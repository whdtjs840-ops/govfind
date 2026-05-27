import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies, categories, regions } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { buildStagingPayloadFromRaw, readJson } from "./importers/staging-artifacts.mjs";

function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return fallback;
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function listJsonFiles(directory, suffix) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => resolve(directory, entry.name))
    .sort();
}

function toRawPayloadFromCache(cachePayload, file) {
  return {
    meta: {
      ...(cachePayload.meta ?? {}),
      rawFilePath: file,
      sourceName: "gov24-public-service-benefits",
      responseItemArrayPath: "data"
    },
    items: Array.isArray(cachePayload.items) ? cachePayload.items : []
  };
}

async function loadRawPayloads() {
  const rawFiles = await listJsonFiles("data/imports/gov24/raw", ".raw.json");
  const cacheFiles = await listJsonFiles("data/staging/gov24/cache", ".json");
  const payloads = [];

  for (const file of rawFiles) {
    const payload = await readJson(file);
    if (Array.isArray(payload.items)) {
      payload.meta = { ...(payload.meta ?? {}), rawFilePath: file };
      payloads.push({ label: file, payload });
    }
  }

  for (const file of cacheFiles) {
    const payload = toRawPayloadFromCache(await readJson(file), file);
    payloads.push({ label: file, payload });
  }

  return payloads;
}

function classificationOf(item) {
  if (item.classification === "duplicate_candidate") return "duplicate";
  if (item.classification === "needs_manual_review") return "needsReview";
  return item.classification ?? item.status;
}

function hasStrongDuplicate(item) {
  return (item.duplicateCandidates ?? []).some((candidate) => candidate.strength === "high");
}

function hasCategoryMappingGap(item) {
  return (
    item.normalized?.category === "기타" ||
    (item.mappingGaps ?? []).includes("category") ||
    (item.reviewReasons ?? []).some((reason) => /unknown source category|category mapped/i.test(reason)) ||
    (item.reasons ?? []).some((reason) => /unknown source category|category mapped|mapping gap: category/i.test(reason))
  );
}

function hasRequiredCandidateFields(item) {
  const normalized = item.normalized ?? {};
  return Boolean(
    normalized.title &&
      normalized.slug &&
      normalized.category &&
      normalized.sourceName &&
      normalized.sourceItemId &&
      normalized.organizationName &&
      (normalized.officialUrl || normalized.applicationUrl) &&
      (normalized.summary || normalized.description)
  );
}

function allCoreUncertain(item) {
  const gaps = new Set(item.mappingGaps ?? []);
  return ["region", "category", "status", "startDate", "endDate"].every((gap) => gaps.has(gap));
}

function candidatePriority(item) {
  const classification = classificationOf(item);
  if (classification === "ready") return 0;
  if (classification === "publishable_with_warning" && !hasCategoryMappingGap(item)) return 1;
  return 9;
}

function summarizeCandidate(item) {
  const normalized = item.normalized;
  return {
    sourceItemId: normalized.sourceItemId,
    title: normalized.title,
    slug: normalized.slug,
    category: normalized.category,
    organizationName: normalized.organizationName,
    status: normalized.status,
    statusLabel: normalized.statusLabel ?? normalized.status,
    applicationPeriodLabel: normalized.applicationPeriodLabel ?? null,
    warnings: item.warnings ?? normalized.warnings ?? [],
    publishPolicy: item.publishPolicy,
    url: normalized.officialUrl ?? normalized.applicationUrl
  };
}

function increment(map, key) {
  const value = key || "(missing)";
  map[value] = (map[value] ?? 0) + 1;
}

function buildCountPreviews(publicPolicies, selected) {
  const sourceCountPreview = {};
  const categoryCountPreview = {};
  const statusCountPreview = {};

  for (const policy of publicPolicies) {
    increment(sourceCountPreview, policy.source);
    increment(categoryCountPreview, policy.category);
    increment(statusCountPreview, policy.status);
  }

  for (const item of selected) {
    const normalized = item.normalized;
    increment(sourceCountPreview, "Gov24 staging preview");
    increment(categoryCountPreview, normalized.category);
    increment(statusCountPreview, normalized.status);
  }

  return { sourceCountPreview, categoryCountPreview, statusCountPreview };
}

function auditCompatibility(selected) {
  const issues = [];
  const allowedStatuses = new Set(["모집중", "상시", "예정", "마감임박"]);
  const knownCategories = new Set(categories);
  const knownRegions = new Set(regions);

  const incompatibleStatusItems = selected.filter((item) => !allowedStatuses.has(item.normalized.status));
  if (incompatibleStatusItems.length) {
    issues.push({
      type: "status-model-incompatibility",
      count: incompatibleStatusItems.length,
      message: "Current public PolicyStatus does not include every Gov24 normalized status. A later generator must map or extend status before apply.",
      samples: incompatibleStatusItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  const unknownCategoryItems = selected.filter((item) => !knownCategories.has(item.normalized.category));
  if (unknownCategoryItems.length) {
    issues.push({
      type: "category-model-incompatibility",
      count: unknownCategoryItems.length,
      message: "Selected category is not in the current public category list.",
      samples: unknownCategoryItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  const unknownRegionItems = selected.filter((item) => item.normalized.region && !knownRegions.has(item.normalized.region));
  if (unknownRegionItems.length) {
    issues.push({
      type: "region-model-incompatibility",
      count: unknownRegionItems.length,
      message: "Selected region is not in the current public region filter list.",
      samples: unknownRegionItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  const nullDateItems = selected.filter((item) => item.normalized.dateConfidence === "unknown");
  if (nullDateItems.length) {
    issues.push({
      type: "date-rendering-policy-required",
      count: nullDateItems.length,
      message: "Current public Policy shape uses deadline/dday strings. A later generator must map unknown dates to an official-confirmation label and suppress D-day.",
      samples: nullDateItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  const statusUnknownItems = selected.filter((item) => item.normalized.statusConfidence === "unknown");
  if (statusUnknownItems.length) {
    issues.push({
      type: "status-filter-policy-required",
      count: statusUnknownItems.length,
      message: "Items with unknown status must not enter 모집중 or 마감임박 filters during apply.",
      samples: statusUnknownItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  const publishPolicyMissing = selected.filter((item) => !item.publishPolicy);
  if (publishPolicyMissing.length) {
    issues.push({
      type: "missing-publish-policy",
      count: publishPolicyMissing.length,
      message: "Every selected candidate must have publishPolicy before apply.",
      samples: publishPolicyMissing.slice(0, 5).map(summarizeCandidate)
    });
  }

  const officialConfirmationItems = selected.filter((item) => item.publishPolicy?.requiresOfficialConfirmation);
  if (officialConfirmationItems.length) {
    issues.push({
      type: "official-confirmation-copy-required",
      count: officialConfirmationItems.length,
      message: "Current public Policy shape has no dedicated requiresOfficialConfirmation field. A later generator must preserve this warning in display copy.",
      samples: officialConfirmationItems.slice(0, 5).map(summarizeCandidate)
    });
  }

  return issues;
}

function validateSelectedMerge({ publicPolicies, selected, slugConflictCount, idConflictCount }) {
  const errors = [];
  const existingCount = publicPolicies.length;
  const slugs = new Set(publicPolicies.map((policy) => policy.slug));

  for (const item of selected) {
    const normalized = item.normalized;
    if (!normalized.title) errors.push(`missing title: ${normalized.sourceItemId}`);
    if (!normalized.category) errors.push(`missing category: ${normalized.sourceItemId}`);
    if (!normalized.officialUrl && !normalized.applicationUrl) errors.push(`missing url: ${normalized.sourceItemId}`);
    if (slugs.has(normalized.slug)) errors.push(`slug conflict after selection: ${normalized.slug}`);
    slugs.add(normalized.slug);

    if (classificationOf(item) === "publishable_with_warning") {
      if (normalized.statusConfidence === "unknown" && item.publishPolicy?.includeInStatusFilters) {
        errors.push(`warning item included in status filters: ${normalized.slug}`);
      }
      if (normalized.dateConfidence === "unknown" && (item.publishPolicy?.includeInDeadlineSort || item.publishPolicy?.showDday)) {
        errors.push(`warning item included in deadline sort or D-day: ${normalized.slug}`);
      }
    }
  }

  const previewCount = existingCount + selected.length;
  if (previewCount !== existingCount + selected.length) errors.push("search index preview count mismatch");
  if (slugConflictCount) errors.push(`slug conflicts skipped before selection: ${slugConflictCount}`);
  if (idConflictCount) errors.push(`id conflicts skipped before selection: ${idConflictCount}`);

  return {
    valid: errors.length === 0,
    errors,
    searchIndexCountPreview: previewCount
  };
}

async function main() {
  const limit = Math.max(Number(argValue("limit", "50")), 1);
  const outPath = resolve(argValue("out", "data/staging/gov24/promotion-preview.json"));
  const tempPath = resolve(argValue("tmp", "data/staging/gov24/promotion-preview-merged.tmp.json"));
  const publicPolicies = getPublicPolicies(policies);
  const existingSlugs = new Set(publicPolicies.map((policy) => policy.slug));
  const existingIds = new Set(publicPolicies.map((policy) => policy.id).filter(Boolean));

  const payloads = await loadRawPayloads();
  const bySourceItemId = new Map();
  let skippedNeedsReviewCount = 0;
  let skippedDuplicateCount = 0;
  let skippedIncompleteCount = 0;
  let skippedCategoryMappingGapCount = 0;
  let skippedSlugConflictCount = 0;
  let skippedIdConflictCount = 0;
  let skippedOtherCount = 0;

  for (const { label, payload } of payloads) {
    const stagingPayload = buildStagingPayloadFromRaw(payload);
    for (const item of stagingPayload.items ?? []) {
      const normalized = item.normalized ?? {};
      const sourceItemId = normalized.sourceItemId;
      const classification = classificationOf(item);
      if (!sourceItemId || bySourceItemId.has(sourceItemId)) continue;
      item.sourceArtifact = label;

      if (classification === "needsReview") {
        skippedNeedsReviewCount += 1;
        if (hasCategoryMappingGap(item)) skippedCategoryMappingGapCount += 1;
        bySourceItemId.set(sourceItemId, item);
        continue;
      }
      if (classification === "duplicate") {
        skippedDuplicateCount += 1;
        bySourceItemId.set(sourceItemId, item);
        continue;
      }
      if (classification === "incomplete") {
        skippedIncompleteCount += 1;
        bySourceItemId.set(sourceItemId, item);
        continue;
      }
      bySourceItemId.set(sourceItemId, item);
    }
  }

  const allItems = [...bySourceItemId.values()];
  const selected = [];
  const selectedSlugs = new Set();
  const eligible = allItems
    .filter((item) => ["ready", "publishable_with_warning"].includes(classificationOf(item)))
    .sort((a, b) => {
      const byPriority = candidatePriority(a) - candidatePriority(b);
      if (byPriority !== 0) return byPriority;
      return String(b.normalized.sourceUpdatedAt ?? "").localeCompare(String(a.normalized.sourceUpdatedAt ?? ""));
    });

  for (const item of eligible) {
    const normalized = item.normalized;
    const id = normalized.id ?? normalized.sourceItemId;
    if (selected.length >= limit) break;
    if (!hasRequiredCandidateFields(item)) {
      skippedOtherCount += 1;
      continue;
    }
    if (hasCategoryMappingGap(item)) {
      skippedCategoryMappingGapCount += 1;
      continue;
    }
    if (allCoreUncertain(item)) {
      skippedOtherCount += 1;
      continue;
    }
    if (hasStrongDuplicate(item)) {
      skippedDuplicateCount += 1;
      continue;
    }
    if (existingSlugs.has(normalized.slug) || selectedSlugs.has(normalized.slug)) {
      skippedSlugConflictCount += 1;
      continue;
    }
    if (id && existingIds.has(id)) {
      skippedIdConflictCount += 1;
      continue;
    }
    if (!item.publishPolicy?.canPublish) {
      skippedOtherCount += 1;
      continue;
    }

    selected.push(item);
    selectedSlugs.add(normalized.slug);
  }

  const selectedReadyCount = selected.filter((item) => classificationOf(item) === "ready").length;
  const selectedPublishableWithWarningCount = selected.filter((item) => classificationOf(item) === "publishable_with_warning").length;
  const { sourceCountPreview, categoryCountPreview, statusCountPreview } = buildCountPreviews(publicPolicies, selected);
  const compatibilityIssues = auditCompatibility(selected);
  const mergeValidation = validateSelectedMerge({
    publicPolicies,
    selected,
    slugConflictCount: skippedSlugConflictCount,
    idConflictCount: skippedIdConflictCount
  });

  const report = {
    runAt: new Date().toISOString(),
    mode: "dry-run",
    source: "gov24-public-service-benefits",
    limit,
    existingPolicyCount: publicPolicies.length,
    analyzedCandidateCount: allItems.length,
    selectedCount: selected.length,
    selectedReadyCount,
    selectedPublishableWithWarningCount,
    skippedNeedsReviewCount,
    skippedDuplicateCount,
    skippedIncompleteCount,
    skippedCategoryMappingGapCount,
    skippedSlugConflictCount,
    skippedIdConflictCount,
    skippedOtherCount,
    finalPolicyCountPreview: publicPolicies.length + selected.length,
    sourceCountPreview,
    categoryCountPreview,
    statusCountPreview,
    compatibilityIssues,
    mergeValidation,
    selectedItems: selected.map(summarizeCandidate)
  };

  const mergedPreview = {
    runAt: report.runAt,
    existingPolicyCount: publicPolicies.length,
    selectedCount: selected.length,
    finalPolicyCountPreview: report.finalPolicyCountPreview,
    existingSlugs: publicPolicies.map((policy) => policy.slug),
    selectedItems: report.selectedItems
  };

  await writeJson(outPath, report);
  await writeJson(tempPath, mergedPreview);

  console.log("Gov24 promotion dry-run");
  console.log(`promotion preview path: ${outPath}`);
  console.log(`merged temp preview path: ${tempPath}`);
  console.log(`existingPolicyCount: ${report.existingPolicyCount}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`selectedReadyCount: ${report.selectedReadyCount}`);
  console.log(`selectedPublishableWithWarningCount: ${report.selectedPublishableWithWarningCount}`);
  console.log(`skippedNeedsReviewCount: ${report.skippedNeedsReviewCount}`);
  console.log(`skippedDuplicateCount: ${report.skippedDuplicateCount}`);
  console.log(`skippedIncompleteCount: ${report.skippedIncompleteCount}`);
  console.log(`skippedCategoryMappingGapCount: ${report.skippedCategoryMappingGapCount}`);
  console.log(`skippedSlugConflictCount: ${report.skippedSlugConflictCount}`);
  console.log(`skippedIdConflictCount: ${report.skippedIdConflictCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`compatibilityIssuesCount: ${report.compatibilityIssues.length}`);
  console.log(`mergeValidationPassed: ${report.mergeValidation.valid}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
