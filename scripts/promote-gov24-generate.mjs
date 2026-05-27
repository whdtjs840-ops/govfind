import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies, categories, regions } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { buildStagingPayloadFromRaw, readJson } from "./importers/staging-artifacts.mjs";

const publicStatuses = new Set(["모집중", "상시", "예정", "마감임박", "마감", "확인필요"]);
const publicCategories = new Set(categories);
const publicRegions = new Set(regions);

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

async function loadStagingItemsBySourceItemId() {
  const byId = new Map();
  const rawFiles = await listJsonFiles("data/imports/gov24/raw", ".raw.json");
  const cacheFiles = await listJsonFiles("data/staging/gov24/cache", ".json");
  const payloads = [];

  for (const file of rawFiles) {
    const payload = await readJson(file);
    if (Array.isArray(payload.items)) {
      payload.meta = { ...(payload.meta ?? {}), rawFilePath: file };
      payloads.push(payload);
    }
  }
  for (const file of cacheFiles) {
    payloads.push(toRawPayloadFromCache(await readJson(file), file));
  }

  for (const payload of payloads) {
    const staging = buildStagingPayloadFromRaw(payload);
    for (const item of staging.items ?? []) {
      const id = item.normalized?.sourceItemId;
      if (id && !byId.has(id)) byId.set(id, item);
    }
  }
  return byId;
}

function classificationOf(item) {
  if (item.classification === "duplicate_candidate") return "duplicate";
  if (item.classification === "needs_manual_review") return "needsReview";
  return item.classification ?? item.status;
}

function hasCategoryMappingGap(item) {
  return (
    item.normalized?.category === "기타" ||
    (item.mappingGaps ?? []).includes("category") ||
    (item.reasons ?? []).some((reason) => /unknown source category|category mapped|mapping gap: category/i.test(reason))
  );
}

function daysUntil(dateString) {
  if (!dateString) return null;
  const end = new Date(`${dateString}T00:00:00+09:00`);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

function ddayFromEndDate(dateString) {
  const days = daysUntil(dateString);
  if (days === null) return "공식 확인 필요";
  if (days < 0) return "확인필요";
  if (days === 0) return "D-Day";
  if (days <= 999) return `D-${days}`;
  return "모집중";
}

function publicRegionValue(region) {
  if (!region) return null;
  if (publicRegions.has(region)) return region;
  return null;
}

function safeArray(values, fallback) {
  const array = Array.isArray(values) ? values.filter(Boolean) : [];
  return array.length ? array : [fallback];
}

function mapGov24CandidateToPublicPolicy(item) {
  const normalized = item.normalized;
  const issues = [];
  const originalClassification = classificationOf(item);

  if (originalClassification === "duplicate" || originalClassification === "incomplete" || originalClassification === "needsReview") {
    issues.push(`candidate classification is ${originalClassification}`);
  }
  if (hasCategoryMappingGap(item)) issues.push("category mapping gap");
  if (!publicCategories.has(normalized.category)) issues.push(`category not supported by public model: ${normalized.category}`);
  if (!publicStatuses.has(normalized.status)) issues.push(`status not supported by public model: ${normalized.status}`);
  if (!normalized.region) issues.push("region is null or unknown");
  if (normalized.region && !publicRegions.has(normalized.region)) issues.push(`region not in current filter list: ${normalized.region}`);
  if (!normalized.officialUrl && !normalized.applicationUrl) issues.push("missing officialUrl/applicationUrl");

  const rejected =
    originalClassification === "duplicate" ||
    originalClassification === "incomplete" ||
    originalClassification === "needsReview" ||
    hasCategoryMappingGap(item) ||
    !publicCategories.has(normalized.category) ||
    (!normalized.officialUrl && !normalized.applicationUrl);

  if (rejected) {
    return {
      bucket: "rejected",
      issues,
      publicPolicyPreview: null,
      recommendedAction: "Do not promote until source mapping or duplicate/required-field issues are resolved."
    };
  }

  const needsGuard = !publicStatuses.has(normalized.status);

  const regionValue = publicRegionValue(normalized.region);
  const needsSafeRegionMapping = Boolean(normalized.region && !publicRegions.has(normalized.region));

  if (needsGuard) {
    return {
      bucket: "requires_model_or_ui_guard",
      issues,
      publicPolicyPreview: null,
      recommendedAction: "Add public model/UI guards for status/date/region/official-confirmation fields before applying."
    };
  }

  const deadline = normalized.dateConfidence === "unknown"
    ? normalized.applicationPeriodLabel ?? "공식 공고 확인"
    : normalized.endDate
      ? `${normalized.startDate ?? "공식 확인 필요"} ~ ${normalized.endDate}`
      : normalized.applicationPeriodLabel ?? "공식 공고 확인";
  const dday = normalized.dateConfidence === "unknown"
    ? "확인필요"
    : normalized.status === "상시"
      ? "상시"
      : ddayFromEndDate(normalized.endDate);
  const publicPolicyPreview = {
    slug: normalized.slug,
    title: normalized.title,
    category: normalized.category,
    source: "정부24 공공서비스 API",
    agency: normalized.organizationName,
    region: regionValue,
    amount: normalized.supportSummary ?? normalized.summary ?? "공식 공고 확인",
    deadline,
    dday,
    status: normalized.status,
    startDate: normalized.startDate ?? null,
    endDate: normalized.endDate ?? null,
    statusLabel: normalized.statusLabel,
    statusConfidence: normalized.statusConfidence ?? "known",
    dateConfidence: normalized.dateConfidence ?? "known",
    applicationPeriodLabel: normalized.applicationPeriodLabel,
    regionLabel: normalized.region ? undefined : normalized.regionLabel ?? "공식 공고 확인",
    requiresOfficialConfirmation: Boolean(item.publishPolicy?.requiresOfficialConfirmation),
    warnings: item.warnings ?? item.reviewReasons ?? [],
    publishPolicy: item.publishPolicy,
    lifeStage: safeArray(normalized.lifeCycle, "전체").join("·"),
    targetGroup: safeArray(normalized.targetGroups, "공식 공고 확인").join(", "),
    income: "공식 공고 확인",
    applyOnline: Boolean(normalized.applicationUrl),
    tags: safeArray(normalized.searchKeywords, normalized.category).slice(0, 12),
    summary: normalized.summary ?? normalized.description,
    audience: normalized.description ?? normalized.summary,
    benefits: safeArray([normalized.supportSummary ?? normalized.summary], "공식 공고 확인"),
    documents: ["공식 공고 확인"],
    apply: normalized.applicationMethod ?? "공식 신청처에서 신청 방법 확인",
    officialUrl: normalized.applicationUrl ?? normalized.officialUrl,
    officialSourceUrl: normalized.officialUrl ?? normalized.applicationUrl,
    contact: normalized.organizationName,
    views: 0,
    updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    matchReasons: ["Gov24 공식 공공서비스 원문 기준", "공식 신청처 확인 필요"],
    faq: [
      {
        q: "GovFind에서 신청 가능 여부를 확정하나요?",
        a: "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    apiDetails: {
      target: normalized.description ?? normalized.summary,
      benefit: normalized.supportSummary ?? normalized.summary,
      application: normalized.applicationMethod,
      contact: normalized.organizationName
    }
  };

  return {
    bucket: needsSafeRegionMapping ? "promotable_with_safe_mapping" : "promotable_without_model_change",
    issues,
    publicPolicyPreview,
    recommendedAction: needsSafeRegionMapping
      ? "Can preview with region='지역별', but exact regional filters need a later model/UI expansion."
      : "Can be generated into current public Policy shape in a later explicit apply step."
  };
}

function countBy(items, predicate) {
  return items.filter(predicate).length;
}

function groupIssue(items, matcher) {
  return items
    .flatMap((item) => item.issues.filter(matcher).map((issue) => ({ sourceItemId: item.sourceItemId, title: item.title, issue })));
}

function summarizeDecision(item, mapped) {
  return {
    sourceItemId: item.normalized.sourceItemId,
    title: item.normalized.title,
    originalClassification: classificationOf(item),
    proposedBucket: mapped.bucket,
    publicPolicyPreview: mapped.publicPolicyPreview,
    issues: mapped.issues,
    recommendedAction: mapped.recommendedAction
  };
}

function validateGeneratedPreview(existingPolicies, generatedPolicies) {
  const errors = [];
  const slugs = new Set();
  for (const policy of existingPolicies) {
    if (slugs.has(policy.slug)) errors.push(`duplicate existing slug: ${policy.slug}`);
    slugs.add(policy.slug);
  }
  for (const policy of generatedPolicies) {
    if (!policy.slug) errors.push("missing slug");
    if (slugs.has(policy.slug)) errors.push(`duplicate slug: ${policy.slug}`);
    slugs.add(policy.slug);
    if (!policy.title) errors.push(`missing title: ${policy.slug}`);
    if (!policy.category) errors.push(`missing category: ${policy.slug}`);
    if (!publicCategories.has(policy.category)) errors.push(`unsupported category: ${policy.slug} / ${policy.category}`);
    if (!publicStatuses.has(policy.status)) errors.push(`unsupported status: ${policy.slug} / ${policy.status}`);
    if (!policy.region && !policy.regionLabel) errors.push(`missing region: ${policy.slug}`);
    if (!policy.officialUrl && !policy.officialSourceUrl) errors.push(`missing official url: ${policy.slug}`);
    if ((policy.dday === "D-Day" || /^D-\d+/.test(policy.dday)) && (policy.dateConfidence === "unknown" || /공식|확인/.test(policy.deadline))) {
      errors.push(`D-day generated from uncertain deadline: ${policy.slug}`);
    }
    if (policy.statusConfidence === "unknown" && policy.publishPolicy?.includeInStatusFilters !== false) {
      errors.push(`unknown status can enter status filter: ${policy.slug}`);
    }
    if (policy.dateConfidence === "unknown" && (policy.publishPolicy?.showDday !== false || policy.publishPolicy?.includeInDeadlineSort !== false)) {
      errors.push(`unknown date can enter D-day/deadline sort: ${policy.slug}`);
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    searchIndexCountPreview: existingPolicies.length + generatedPolicies.length
  };
}

function recommendation({ finalPromotableCount, requiresGuardCount, validation }) {
  if (finalPromotableCount >= 30 && requiresGuardCount === 0 && validation.valid) return "A. apply 가능";
  if (finalPromotableCount > 0 && requiresGuardCount > 0) return "B. apply 전에 최소 model/UI guard 필요";
  if (finalPromotableCount < 30) return "C. 후보 재선정 필요";
  return "D. 카테고리 매핑 보강 필요";
}

async function main() {
  const limit = Math.max(Number(argValue("limit", "50")), 1);
  const previewPath = resolve(argValue("preview", "data/staging/gov24/promotion-preview.json"));
  const outPath = resolve(argValue("out", "data/staging/gov24/promotion-generator-report.json"));
  const mergedPath = resolve(argValue("merged", "data/staging/gov24/promotion-generated-merged.tmp.json"));
  const generatedPath = resolve(argValue("generated", "data/staging/gov24/promotion-generated-preview.json"));

  const promotionPreview = await readJson(previewPath);
  const selectedSummaries = (promotionPreview.selectedItems ?? []).slice(0, limit);
  const itemsById = await loadStagingItemsBySourceItemId();
  const selectedItems = selectedSummaries.map((summary) => itemsById.get(summary.sourceItemId)).filter(Boolean);

  const mapped = selectedItems.map((item) => {
    const result = mapGov24CandidateToPublicPolicy(item);
    return summarizeDecision(item, result);
  });
  const generatedPolicies = mapped
    .filter((item) => ["promotable_without_model_change", "promotable_with_safe_mapping"].includes(item.proposedBucket))
    .map((item) => item.publicPolicyPreview);

  const existingPolicies = getPublicPolicies(policies);
  const validation = validateGeneratedPreview(existingPolicies, generatedPolicies);
  const requiresGuardCount = countBy(mapped, (item) => item.proposedBucket === "requires_model_or_ui_guard");
  const report = {
    runAt: new Date().toISOString(),
    mode: "generator-dry-run",
    selectedCount: selectedItems.length,
    promotableWithoutModelChangeCount: countBy(mapped, (item) => item.proposedBucket === "promotable_without_model_change"),
    promotableWithSafeMappingCount: countBy(mapped, (item) => item.proposedBucket === "promotable_with_safe_mapping"),
    requiresModelOrUiGuardCount: requiresGuardCount,
    rejectedCount: countBy(mapped, (item) => item.proposedBucket === "rejected"),
    finalPromotableCount: generatedPolicies.length,
    finalPolicyCountPreview: existingPolicies.length + generatedPolicies.length,
    statusMappingIssues: groupIssue(mapped, (issue) => /status/i.test(issue)),
    categoryMappingIssues: groupIssue(mapped, (issue) => /category/i.test(issue)),
    regionMappingIssues: groupIssue(mapped, (issue) => /region/i.test(issue)),
    dateDisplayIssues: groupIssue(mapped, (issue) => /date|deadline/i.test(issue)),
    officialConfirmationPreservationIssues: groupIssue(mapped, (issue) => /requiresOfficialConfirmation|official-confirmation/i.test(issue)),
    rejectedReasons: groupIssue(mapped.filter((item) => item.proposedBucket === "rejected"), () => true),
    recommendedMinimalModelChanges: [
      "No additional model change is required for this preview batch if optional safety fields remain preserved.",
      "Keep statusLabel, applicationPeriodLabel, dateConfidence, statusConfidence, regionLabel, requiresOfficialConfirmation, warnings, and publishPolicy optional fields before apply.",
      "Keep expanded category/region values in sync with public filters before any real generated-data apply."
    ],
    recommendedMinimalUiGuards: [
      "When dateConfidence is unknown, show 공식 공고 확인 and suppress D-day/deadline sorting.",
      "When statusConfidence is unknown, exclude the policy from 모집중 and 마감임박 filters.",
      "When requiresOfficialConfirmation is true, preserve the official-confirmation copy on card and detail pages.",
      "Never coerce 확인필요 to 모집중 and never coerce unknown region to 전국."
    ],
    validation,
    nextAction: recommendation({
      finalPromotableCount: generatedPolicies.length,
      requiresGuardCount,
      validation
    }),
    selectedItems: mapped
  };

  await writeJson(outPath, report);
  await writeJson(generatedPath, {
    runAt: report.runAt,
    generatedCount: generatedPolicies.length,
    policies: generatedPolicies
  });
  await writeJson(mergedPath, {
    runAt: report.runAt,
    existingCount: existingPolicies.length,
    generatedCount: generatedPolicies.length,
    finalPolicyCountPreview: report.finalPolicyCountPreview,
    policies: [...existingPolicies, ...generatedPolicies]
  });

  console.log("Gov24 promotion generator dry-run");
  console.log(`generator report path: ${outPath}`);
  console.log(`generated preview path: ${generatedPath}`);
  console.log(`merged temp path: ${mergedPath}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`promotableWithoutModelChangeCount: ${report.promotableWithoutModelChangeCount}`);
  console.log(`promotableWithSafeMappingCount: ${report.promotableWithSafeMappingCount}`);
  console.log(`requiresModelOrUiGuardCount: ${report.requiresModelOrUiGuardCount}`);
  console.log(`rejectedCount: ${report.rejectedCount}`);
  console.log(`finalPromotableCount: ${report.finalPromotableCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`validationPassed: ${report.validation.valid}`);
  console.log(`nextAction: ${report.nextAction}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
