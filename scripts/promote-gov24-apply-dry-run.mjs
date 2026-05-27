import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies, categories } from "../src/data/policies.ts";
import {
  ddayNumber,
  getDisplayRegion,
  getDisplayStatus,
  getPublicPolicies,
  isDeadlineSoonPolicy,
  policySearchText,
  shouldIncludeInDeadlineSort,
  shouldIncludeInRegionPage,
  shouldIncludeInStatusFilter,
  shouldRequireOfficialConfirmation,
  shouldShowDday
} from "../src/utils/policyUtils.ts";
import { sourceLabel } from "../src/utils/sourceNames.ts";
import { readJson } from "./importers/staging-artifacts.mjs";

const sourceOfTruthFile = "src/data/policies.ts";
const generatedFiles = [
  "src/data/welfare-api.generated.ts",
  "src/data/local-welfare-api.generated.ts",
  "src/data/public-service-api.generated.ts",
  "src/data/kstartup-api.generated.ts",
  "src/data/youth-api.generated.ts"
];
const searchIndexSource = "src/pages/search-index.json.ts";
const policyDetailPageGenerationPath = "src/pages/support/[slug].astro";
const categoryCountCalculationPath = "src/utils/policyUtils.ts#getPolicyCounts";

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

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function normalizeUrl(value = "") {
  return String(value)
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/+$/g, "")
    .toLowerCase();
}

function parseUrl(value = "") {
  const raw = String(value ?? "").trim();
  if (!raw) return null;
  try {
    return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
}

function isGov24DetailUrl(value = "") {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  return /(^|\.)gov\.kr$/i.test(parsed.hostname) && /\/portal\/rcvfvrSvc\/dtlEx\/[^/?#]+/i.test(parsed.pathname);
}

function isBokjiroDetailUrl(value = "") {
  const parsed = parseUrl(value);
  if (!parsed) return false;
  return /(^|\.)bokjiro\.go\.kr$/i.test(parsed.hostname) && parsed.searchParams.has("wlfareInfoId");
}

function isGenericOfficialUrl(value = "", sharedCount = 1) {
  const parsed = parseUrl(value);
  if (!parsed) return true;
  const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
  const path = parsed.pathname.replace(/\/+$/g, "");
  const lowerPath = path.toLowerCase();
  const hasQuery = parsed.searchParams.toString().length > 0;
  const pathSegments = path.split("/").filter(Boolean);

  if (sharedCount > 1) return true;
  if (isGov24DetailUrl(value) || isBokjiroDetailUrl(value)) return false;
  if (host === "gov.kr" && !/\/dtlEx\//i.test(path)) return true;
  if (host === "government24.go.kr" && !/\/dtlEx\//i.test(path)) return true;
  if (host === "bokjiro.go.kr" && !parsed.searchParams.has("wlfareInfoId")) return true;
  if (["apply.jobaba.net", "www.jobaba.net"].includes(host) && pathSegments.length <= 1) return true;
  if (/(search|list|serviceList|benefitTotalSrvcList|main|portal)$/i.test(lowerPath)) return true;
  if (!hasQuery && pathSegments.length <= 1) return true;
  return false;
}

function titleSimilarity(left = "", right = "") {
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (!a || !b) return 0;
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return Math.min(a.length, b.length) / Math.max(a.length, b.length);
  const bigrams = (value) => {
    if (value.length < 2) return new Set([value]);
    const set = new Set();
    for (let i = 0; i < value.length - 1; i += 1) set.add(value.slice(i, i + 2));
    return set;
  };
  const aSet = bigrams(a);
  const bSet = bigrams(b);
  const intersection = [...aSet].filter((item) => bSet.has(item)).length;
  return (2 * intersection) / (aSet.size + bSet.size);
}

function hasCategoryMappingGap(item) {
  return (
    item.publicPolicyPreview?.category === "기타" ||
    item.issues?.some((issue) => /category mapping gap|unknown source category|category not supported/i.test(issue))
  );
}

function candidateSourceKey(item) {
  return `gov24-public-service-benefits::${item.sourceItemId}`;
}

function titleAgencyKey(policy) {
  return `${normalizeText(policy.title)}::${normalizeText(policy.agency)}`;
}

function policyUrls(policy = {}) {
  const urls = [
    { field: "officialUrl", value: policy.officialUrl },
    { field: "officialSourceUrl", value: policy.officialSourceUrl }
  ].filter((entry) => entry.value);
  const seen = new Set();
  return urls.filter((entry) => {
    const normalized = normalizeUrl(entry.value);
    if (!normalized || seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

function validateCandidate(item) {
  const policy = item.publicPolicyPreview;
  const issues = [];
  const classificationOk = ["ready", "publishable_with_warning"].includes(item.originalClassification);
  if (!classificationOk) issues.push(`invalid source classification: ${item.originalClassification}`);
  if (!["promotable_without_model_change", "promotable_with_safe_mapping"].includes(item.proposedBucket)) {
    issues.push(`not selected for generated promotion: ${item.proposedBucket}`);
  }
  if (!policy) issues.push("missing publicPolicyPreview");
  if (hasCategoryMappingGap(item)) issues.push("category mapping gap");

  if (policy) {
    if (policy.publishPolicy?.canPublish !== true) issues.push("publishPolicy.canPublish is not true");
    if (!policy.title) issues.push("missing title");
    if (!policy.slug) issues.push("missing slug/public id");
    if (!item.sourceItemId) issues.push("missing sourceItemId");
    if (!policy.agency) issues.push("missing organizationName/agency");
    if (!policy.officialUrl && !policy.officialSourceUrl) issues.push("missing officialUrl/applicationUrl");
    if (!policy.summary && !policy.audience) issues.push("missing summary/description");
    if (policy.category === "기타") issues.push("category is 기타");
    if (!categories.includes(policy.category)) issues.push(`invalid category: ${policy.category}`);
  }

  return issues;
}

function conflictCheck(existingPolicies, selectedItems) {
  const existingSlugs = new Set(existingPolicies.map((policy) => policy.slug));
  const existingUrls = new Map();
  const existingTitleAgency = new Map();
  for (const policy of existingPolicies) {
    for (const entry of policyUrls(policy)) {
      const url = normalizeUrl(entry.value);
      if (!url) continue;
      if (!existingUrls.has(url)) existingUrls.set(url, []);
      existingUrls.get(url).push({ policy, field: entry.field, value: entry.value });
    }
    existingTitleAgency.set(titleAgencyKey(policy), policy);
  }

  const seenSlugs = new Set();
  const seenSourceKeys = new Set();
  const seenUrls = new Map();
  const seenTitleAgency = new Set();
  const accepted = [];
  const skipped = [];
  const officialUrlConflictDetails = [];

  for (const item of selectedItems) {
    const policy = item.publicPolicyPreview;
    const conflicts = [];
    const downgradedOfficialUrlConflicts = [];
    const sourceKey = candidateSourceKey(item);
    const taKey = policy ? titleAgencyKey(policy) : "";

    if (policy?.slug && existingSlugs.has(policy.slug)) conflicts.push({ type: "slug", matchedSlug: policy.slug });
    if (policy?.slug && seenSlugs.has(policy.slug)) conflicts.push({ type: "slug-within-selection", matchedSlug: policy.slug });
    if (seenSourceKeys.has(sourceKey)) conflicts.push({ type: "sourceName+sourceItemId", sourceKey });
    for (const candidateUrl of policyUrls(policy)) {
      const url = normalizeUrl(candidateUrl.value);
      const existingMatches = existingUrls.get(url) ?? [];
      for (const match of existingMatches) {
        const sharedCount = existingMatches.length;
        const candidateGeneric = isGenericOfficialUrl(candidateUrl.value, sharedCount);
        const matchedGeneric = isGenericOfficialUrl(match.value, sharedCount);
        const similarity = titleSimilarity(policy?.title, match.policy.title);
        const sameOrganization = normalizeText(policy?.agency) === normalizeText(match.policy.agency);
        const isIndividualDetail = (
          (isGov24DetailUrl(candidateUrl.value) && isGov24DetailUrl(match.value)) ||
          (isBokjiroDetailUrl(candidateUrl.value) && isBokjiroDetailUrl(match.value))
        );
        const genericOfficialUrl = candidateGeneric || matchedGeneric;
        const conflictStrength = genericOfficialUrl ? "weak" : "strong";
        const detail = {
          type: "officialUrl",
          candidateSourceItemId: item.sourceItemId,
          candidateTitle: policy?.title ?? item.title,
          candidateSlug: policy?.slug,
          candidateField: candidateUrl.field,
          candidateUrl: candidateUrl.value,
          matchedField: match.field,
          matchedUrl: match.value,
          matchedSlug: match.policy.slug,
          matchedTitle: match.policy.title,
          officialUrlGeneric: genericOfficialUrl,
          isIndividualDetailUrl: isIndividualDetail,
          titleSimilarity: Number(similarity.toFixed(3)),
          sameOrganization,
          conflictStrength,
          reason: genericOfficialUrl
            ? "generic or shared URL is not sufficient for a strong duplicate"
            : "individual policy URL matches existing policy",
          finalDecision: genericOfficialUrl ? "downgraded_not_blocking" : "blocking_conflict"
        };

        officialUrlConflictDetails.push(detail);
        if (conflictStrength === "strong") {
          conflicts.push({
            type: "officialUrl",
            matchedSlug: match.policy.slug,
            matchedTitle: match.policy.title,
            conflictStrength,
            officialUrlGeneric: false
          });
        } else {
          downgradedOfficialUrlConflicts.push(detail);
        }
      }

      const seenMatch = seenUrls.get(url);
      if (seenMatch) {
        const genericOfficialUrl = isGenericOfficialUrl(candidateUrl.value, 2) || isGenericOfficialUrl(seenMatch.value, 2);
        const detail = {
          type: "officialUrl-within-selection",
          candidateSourceItemId: item.sourceItemId,
          candidateTitle: policy?.title ?? item.title,
          candidateSlug: policy?.slug,
          candidateField: candidateUrl.field,
          candidateUrl: candidateUrl.value,
          matchedField: seenMatch.field,
          matchedUrl: seenMatch.value,
          matchedSlug: seenMatch.policy.slug,
          matchedTitle: seenMatch.policy.title,
          officialUrlGeneric: genericOfficialUrl,
          conflictStrength: genericOfficialUrl ? "weak" : "strong",
          reason: genericOfficialUrl
            ? "generic or shared URL within selection is not sufficient for a strong duplicate"
            : "individual policy URL repeats within selection",
          finalDecision: genericOfficialUrl ? "downgraded_not_blocking" : "blocking_conflict"
        };
        officialUrlConflictDetails.push(detail);
        if (genericOfficialUrl) downgradedOfficialUrlConflicts.push(detail);
        else conflicts.push({ type: "officialUrl-within-selection", url, conflictStrength: "strong" });
      }
    }
    if (taKey && existingTitleAgency.has(taKey)) {
      const matched = existingTitleAgency.get(taKey);
      conflicts.push({ type: "title+organization", matchedSlug: matched.slug, matchedTitle: matched.title });
    }
    if (taKey && seenTitleAgency.has(taKey)) conflicts.push({ type: "title+organization-within-selection" });

    if (conflicts.length) {
      skipped.push({
        sourceItemId: item.sourceItemId,
        title: item.title,
        slug: policy?.slug,
        reasons: conflicts,
        downgradedOfficialUrlConflicts
      });
      continue;
    }

    accepted.push(item);
    if (policy?.slug) seenSlugs.add(policy.slug);
    seenSourceKeys.add(sourceKey);
    for (const candidateUrl of policyUrls(policy)) {
      const url = normalizeUrl(candidateUrl.value);
      if (url && !seenUrls.has(url)) {
        seenUrls.set(url, { policy, field: candidateUrl.field, value: candidateUrl.value });
      }
    }
    if (taKey) seenTitleAgency.add(taKey);
  }

  return { accepted, skipped, officialUrlConflictDetails };
}

function conflictCheckSelectedOnly(existingPolicies, selectedItems) {
  const { skipped } = conflictCheck(existingPolicies, selectedItems);
  return skipped;
}

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item) || "확인필요";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

function buildSearchItem(policy) {
  return {
    id: policy.slug,
    title: policy.title,
    category: policy.category,
    region: getDisplayRegion(policy),
    source: sourceLabel(policy.source),
    agency: policy.agency,
    status: getDisplayStatus(policy),
    dday: shouldShowDday(policy) ? policy.dday : "",
    updatedAt: policy.updatedAt,
    applyOnline: policy.applyOnline,
    officialUrl: policy.officialUrl,
    url: `/support/${policy.slug}/`,
    keywords: policy.tags,
    searchText: policySearchText(policy)
  };
}

function validateSearchIndexPreview(mergedPolicies) {
  const items = mergedPolicies
    .filter((policy) => policy.publishPolicy?.includeInSearch !== false)
    .map(buildSearchItem);
  const invalid = items.filter((item) => !item.title || !item.category || !item.agency || !item.source || !item.searchText);
  return {
    count: items.length,
    valid: invalid.length === 0,
    invalidCount: invalid.length,
    sampleUrls: items.slice(-5).map((item) => item.url)
  };
}

function validateSlug(slug) {
  return Boolean(slug && !/[/?#\\]/.test(slug) && encodeURIComponent(slug).length > 0);
}

function validatePageGeneration(selectedPolicies) {
  const invalid = [];
  const urls = [];
  for (const policy of selectedPolicies) {
    const url = `/support/${policy.slug}/`;
    urls.push(url);
    const issues = [];
    if (!validateSlug(policy.slug)) issues.push("slug is not URL-safe");
    if (policy.dateConfidence === "unknown" && shouldShowDday(policy)) issues.push("unknown date can show D-day");
    if (policy.endDate === null && isDeadlineSoonPolicy(policy)) issues.push("null endDate can enter deadline soon");
    if (policy.statusConfidence === "unknown" && shouldIncludeInStatusFilter(policy, "모집중")) issues.push("unknown status can enter 모집중 filter");
    if (policy.statusConfidence === "unknown" && shouldIncludeInStatusFilter(policy, "마감임박")) issues.push("unknown status can enter 마감임박 filter");
    if (policy.region === null && shouldIncludeInRegionPage(policy)) issues.push("null region can enter region page");
    if (String(policy.dday).includes("NaN") || String(policy.deadline).includes("Invalid Date")) issues.push("invalid date text");
    if (issues.length) invalid.push({ slug: policy.slug, title: policy.title, issues });
  }
  return {
    checkedCount: selectedPolicies.length,
    valid: invalid.length === 0,
    invalid,
    urls
  };
}

function validateGuards(selectedPolicies) {
  const issues = [];
  for (const policy of selectedPolicies) {
    if (policy.dateConfidence === "unknown") {
      if (shouldShowDday(policy)) issues.push({ slug: policy.slug, issue: "dateConfidence unknown but D-day visible" });
      if (shouldIncludeInDeadlineSort(policy)) issues.push({ slug: policy.slug, issue: "dateConfidence unknown but deadline sort enabled" });
      if (isDeadlineSoonPolicy(policy)) issues.push({ slug: policy.slug, issue: "dateConfidence unknown but deadline-soon enabled" });
    }
    if (policy.endDate === null && isDeadlineSoonPolicy(policy)) {
      issues.push({ slug: policy.slug, issue: "null endDate but deadline-soon enabled" });
    }
    if (policy.statusConfidence === "unknown") {
      if (shouldIncludeInStatusFilter(policy, "모집중")) issues.push({ slug: policy.slug, issue: "unknown status enters 모집중 filter" });
      if (shouldIncludeInStatusFilter(policy, "마감임박")) issues.push({ slug: policy.slug, issue: "unknown status enters 마감임박 filter" });
    }
    if (policy.region === null && shouldIncludeInRegionPage(policy)) {
      issues.push({ slug: policy.slug, issue: "null region enters region page" });
    }
    if (policy.requiresOfficialConfirmation && !shouldRequireOfficialConfirmation(policy)) {
      issues.push({ slug: policy.slug, issue: "official confirmation flag lost" });
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    unknownDateCount: selectedPolicies.filter((policy) => policy.dateConfidence === "unknown").length,
    unknownStatusCount: selectedPolicies.filter((policy) => policy.statusConfidence === "unknown").length,
    unknownRegionCount: selectedPolicies.filter((policy) => policy.region === null).length,
    requiresOfficialConfirmationCount: selectedPolicies.filter(shouldRequireOfficialConfirmation).length,
    deadlineSoonCount: selectedPolicies.filter(isDeadlineSoonPolicy).length,
    deadlineSortEligibleCount: selectedPolicies.filter(shouldIncludeInDeadlineSort).length
  };
}

function applyReadiness({ preValidationErrors, searchIndexPreview, pageGenerationPreview, guardValidation }) {
  if (preValidationErrors.length || !searchIndexPreview.valid || !pageGenerationPreview.valid || !guardValidation.valid) {
    return "needs_fix_before_apply";
  }
  return "ready_for_apply";
}

async function main() {
  if (process.argv.includes("--apply")) {
    throw new Error("This command is dry-run only in step 7.3. Do not pass --apply.");
  }

  const limit = Math.max(Number(argValue("limit", "50")), 1);
  const generatorReportPath = resolve(argValue("generator-report", "data/staging/gov24/promotion-generator-report.json"));
  const outPath = resolve(argValue("out", "data/staging/gov24/apply-dry-run-report.json"));
  const mergedPath = resolve(argValue("merged", "data/staging/gov24/apply-dry-run-merged.tmp.json"));

  const generatorReport = await readJson(generatorReportPath);
  const existingPolicies = getPublicPolicies(policies);
  const candidateItems = (generatorReport.selectedItems ?? [])
    .filter((item) => ["promotable_without_model_change", "promotable_with_safe_mapping"].includes(item.proposedBucket));

  const preValidationErrors = [];
  const candidatesAfterPrecheck = [];
  for (const item of candidateItems) {
    const issues = validateCandidate(item);
    if (issues.length) {
      preValidationErrors.push({
        sourceItemId: item.sourceItemId,
        title: item.title,
        slug: item.publicPolicyPreview?.slug,
        issues
      });
      continue;
    }
    candidatesAfterPrecheck.push(item);
  }

  const {
    accepted: acceptedBeforeLimit,
    skipped: conflictSkipped,
    officialUrlConflictDetails
  } = conflictCheck(existingPolicies, candidatesAfterPrecheck);
  const accepted = acceptedBeforeLimit.slice(0, limit);
  const selectedPolicies = accepted.map((item) => item.publicPolicyPreview);
  const skippedItems = [
    ...preValidationErrors.map((item) => ({ ...item, reasons: item.issues.map((issue) => ({ type: "pre-validation", issue })) })),
    ...conflictSkipped
  ];
  const mergedPolicies = [...existingPolicies, ...selectedPolicies];

  const categoryCountPreview = countBy(mergedPolicies, (policy) => policy.category);
  const statusCountPreview = countBy(mergedPolicies, (policy) => getDisplayStatus(policy));
  const sourceCountPreview = countBy(mergedPolicies, (policy) => sourceLabel(policy.source));
  const searchIndexPreview = validateSearchIndexPreview(mergedPolicies);
  const pageGenerationPreview = validatePageGeneration(selectedPolicies);
  const guardValidation = validateGuards(selectedPolicies);
  const readiness = applyReadiness({
    preValidationErrors,
    searchIndexPreview,
    pageGenerationPreview,
    guardValidation
  });

  const finalSelectionConflicts = conflictCheckSelectedOnly(existingPolicies, accepted);
  const genericOfficialUrlConflicts = officialUrlConflictDetails.filter((conflict) => conflict.officialUrlGeneric);
  const downgradedOfficialUrlConflicts = officialUrlConflictDetails.filter((conflict) => conflict.finalDecision === "downgraded_not_blocking");
  const strongOfficialUrlConflicts = officialUrlConflictDetails.filter((conflict) => conflict.conflictStrength === "strong");
  const report = {
    runAt: new Date().toISOString(),
    dryRun: true,
    sourceOfTruthFile,
    generatedFiles,
    searchIndexSource,
    policyDetailPageGenerationPath,
    categoryCountCalculationPath,
    limit,
    existingPolicyCount: existingPolicies.length,
    selectedCount: selectedPolicies.length,
    selectedGov24Count: selectedPolicies.length,
    skippedCount: skippedItems.length,
    finalPolicyCountPreview: mergedPolicies.length,
    expectedPolicyIncrease: selectedPolicies.length,
    publishableWithWarningCount: selectedPolicies.filter((policy) => policy.requiresOfficialConfirmation || policy.publishPolicy?.requiresOfficialConfirmation).length,
    requiresOfficialConfirmationCount: guardValidation.requiresOfficialConfirmationCount,
    unknownDateCount: guardValidation.unknownDateCount,
    unknownStatusCount: guardValidation.unknownStatusCount,
    unknownRegionCount: guardValidation.unknownRegionCount,
    categoryCountPreview,
    statusCountPreview,
    sourceCountPreview,
    conflictSummary: {
      conflictCount: finalSelectionConflicts.length,
      conflicts: finalSelectionConflicts
    },
    skippedConflictSummary: {
      conflictCount: conflictSkipped.length,
      conflicts: conflictSkipped
    },
    genericOfficialUrlConflicts,
    downgradedOfficialUrlConflicts,
    strongOfficialUrlConflicts,
    officialUrlConflictDetails,
    searchIndexPreview,
    pageGenerationPreview,
    guardValidation,
    applyPlan: [
      "Review data/staging/gov24/apply-dry-run-report.json.",
      "In a separate explicit apply step only, append selected Gov24 policies to the controlled generated/static data path.",
      "Regenerate search index through the normal Astro build output.",
      "Run npm.cmd run validate:policies.",
      "Run npm.cmd test.",
      "Run npm.cmd run legacy:build.",
      "Open sampled new detail pages and verify official-confirmation/date/status/region copy."
    ],
    expectedChangedFiles: [
      "src/data/policies.ts or a future generated Gov24 static data file, only in a separate apply step",
      "dist/search-index.json after build output regeneration",
      "dist/support/{slug}/index.html after build output regeneration",
      "dist/category/*/index.html after build output regeneration if category counts change"
    ],
    selectedItemSummaries: accepted.map((item) => {
      const policy = item.publicPolicyPreview;
      return {
        sourceItemId: item.sourceItemId,
        title: policy.title,
        slug: policy.slug,
        category: policy.category,
        organizationName: policy.agency,
        status: policy.status,
        statusLabel: policy.statusLabel,
        region: policy.region,
        regionLabel: policy.regionLabel,
        dateConfidence: policy.dateConfidence,
        statusConfidence: policy.statusConfidence,
        applicationPeriodLabel: policy.applicationPeriodLabel,
        officialUrl: policy.officialUrl,
        publishPolicy: policy.publishPolicy,
        previewUrl: `/support/${policy.slug}/`
      };
    }),
    skippedItemSummaries: skippedItems,
    applyReadiness: readiness
  };

  await writeJson(outPath, report);
  await writeJson(mergedPath, {
    runAt: report.runAt,
    dryRun: true,
    existingPolicyCount: existingPolicies.length,
    selectedCount: selectedPolicies.length,
    finalPolicyCountPreview: mergedPolicies.length,
    policies: mergedPolicies
  });

  console.log("Gov24 apply dry-run");
  console.log(`source-of-truth policy file: ${sourceOfTruthFile}`);
  console.log(`apply dry-run report path: ${outPath}`);
  console.log(`apply dry-run merged temp path: ${mergedPath}`);
  console.log(`existingPolicyCount: ${report.existingPolicyCount}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`skippedCount: ${report.skippedCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`expectedPolicyIncrease: ${report.expectedPolicyIncrease}`);
  console.log(`searchIndexPreviewCount: ${report.searchIndexPreview.count}`);
  console.log(`pageGenerationValid: ${report.pageGenerationPreview.valid}`);
  console.log(`guardValidationValid: ${report.guardValidation.valid}`);
  console.log(`applyReadiness: ${report.applyReadiness}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
