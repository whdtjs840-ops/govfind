import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { nationalSubsidyAdapter, NationalSubsidyApiError, getConfiguredApiKeyName } from "./importers/national-subsidy-adapter.mjs";
import {
  API_CANDIDATES,
  ENDPOINT_ENV_KEY,
  ENV_KEY_CANDIDATES,
  GOVFIND_CATEGORIES,
  NATIONAL_SUBSIDY_SOURCE_NAME,
  normalizeComparableText
} from "./importers/national-subsidy-normalizers.mjs";

const REPORT_PATH = "data/staging/national-subsidy/national-subsidy-api-access-report.json";
const requiredFields = ["title", "slug", "sourceName", "sourceItemId", "organizationName"];
const allowedWarningGaps = new Set(["region", "status", "startDate", "endDate", "applicationMethod", "sourceUpdatedAt"]);

function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function loadLocalEnv() {
  try {
    const path = resolve(".env");
    if (!existsSync(path)) return;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [rawKey, ...rawValue] = trimmed.split("=");
      const key = rawKey.trim();
      if (process.env[key]) continue;
      process.env[key] = rawValue.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Explicit environment variables still work if local .env loading fails.
  }
}

function timestamp() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isBlank(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function normalizeUrl(value = "") {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value).trim().replace(/\/$/, "").toLowerCase();
  }
}

function tokenSet(value = "") {
  return new Set(normalizeComparableText(value).split(/\s+/).filter(Boolean));
}

function textSimilarity(a = "", b = "") {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

function buildExistingPolicyIndex(items) {
  const bySourceItemId = new Map();
  const byOfficialUrl = new Map();
  const bySlug = new Map();
  const byTitleAgency = new Map();
  const all = [];

  for (const policy of items) {
    if (policy.sourceName && policy.sourceItemId) bySourceItemId.set(`${policy.sourceName}::${policy.sourceItemId}`, policy);
    if (policy.slug) bySlug.set(policy.slug, policy);
    for (const url of [policy.officialUrl, policy.officialSourceUrl].filter(Boolean)) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) byOfficialUrl.set(normalizedUrl, policy);
    }
    const titleAgency = `${normalizeComparableText(policy.title)}::${normalizeComparableText(policy.agency)}`;
    if (titleAgency !== "::") byTitleAgency.set(titleAgency, policy);
    all.push(policy);
  }

  return { bySourceItemId, byOfficialUrl, bySlug, byTitleAgency, all };
}

function duplicateCandidates(normalized, existingIndex) {
  const candidates = [];
  const sourceKey = `${normalized.sourceName}::${normalized.sourceItemId}`;
  const officialUrls = [normalized.officialUrl, normalized.applicationUrl].map(normalizeUrl).filter(Boolean);
  const titleAgency = `${normalizeComparableText(normalized.title)}::${normalizeComparableText(normalized.organizationName)}`;
  const supportText = normalizeComparableText(normalized.supportContent || normalized.description || normalized.summary);
  const regionText = normalizeComparableText(normalized.region ?? "");

  if (normalized.sourceItemId && existingIndex.bySourceItemId.has(sourceKey)) {
    const match = existingIndex.bySourceItemId.get(sourceKey);
    candidates.push({ rule: "sourceName + sourceItemId", strength: "high", matchedSlug: match.slug, matchedTitle: match.title, value: sourceKey });
  }

  if (normalized.slug && existingIndex.bySlug.has(normalized.slug)) {
    const match = existingIndex.bySlug.get(normalized.slug);
    candidates.push({ rule: "slug", strength: "high", matchedSlug: match.slug, matchedTitle: match.title, value: normalized.slug });
  }

  for (const url of officialUrls) {
    if (existingIndex.byOfficialUrl.has(url)) {
      const match = existingIndex.byOfficialUrl.get(url);
      candidates.push({ rule: "officialUrl", strength: "high", matchedSlug: match.slug, matchedTitle: match.title, value: url });
    }
  }

  if (titleAgency !== "::" && existingIndex.byTitleAgency.has(titleAgency)) {
    const match = existingIndex.byTitleAgency.get(titleAgency);
    candidates.push({ rule: "title + organizationName", strength: "high", matchedSlug: match.slug, matchedTitle: match.title, value: `${normalized.title} / ${normalized.organizationName}` });
  }

  for (const policy of existingIndex.all) {
    const sameOrganization = normalizeComparableText(normalized.organizationName) === normalizeComparableText(policy.agency);
    const similarity = textSimilarity(normalized.title, policy.title);
    if (sameOrganization && similarity >= 0.84) {
      candidates.push({
        rule: "title similarity + organizationName",
        strength: similarity >= 0.9 ? "high" : "medium",
        matchedSlug: policy.slug,
        matchedTitle: policy.title,
        value: similarity.toFixed(2)
      });
      break;
    }
  }

  if (supportText) {
    for (const policy of existingIndex.all) {
      const sameRegion = regionText && regionText === normalizeComparableText(policy.region ?? "");
      const policyText = normalizeComparableText([policy.summary, policy.audience, ...(policy.benefits ?? [])].join(" "));
      const titleScore = textSimilarity(normalized.title, policy.title);
      const contentScore = textSimilarity(supportText, policyText);
      if (policyText && sameRegion && contentScore >= 0.72 && titleScore >= 0.45) {
        candidates.push({
          rule: "title + region + supportContent similarity",
          strength: titleScore >= 0.75 && contentScore >= 0.82 ? "high" : "medium",
          matchedSlug: policy.slug,
          matchedTitle: policy.title,
          value: `${titleScore.toFixed(2)} / ${contentScore.toFixed(2)}`
        });
        break;
      }
    }
  }

  return candidates.filter((candidate, index, list) => {
    const key = `${candidate.rule}::${candidate.matchedSlug}::${candidate.value}`;
    return list.findIndex((item) => `${item.rule}::${item.matchedSlug}::${item.value}` === key) === index;
  });
}

function mappingGapsFor(normalized) {
  const gaps = [];
  const reasons = [...(normalized.normalization?.reviewReasons ?? [])];

  if (!GOVFIND_CATEGORIES.includes(normalized.category) || normalized.category === "기타") gaps.push("category");
  if (!normalized.region) gaps.push("region");
  if (normalized.status === "확인필요") gaps.push("status");
  if (!normalized.startDate) gaps.push("startDate");
  if (!normalized.endDate) gaps.push("endDate");
  if (!normalized.applicationMethod) gaps.push("applicationMethod");
  if (!normalized.sourceUpdatedAt) gaps.push("sourceUpdatedAt");

  return { mappingGaps: [...new Set(gaps)], reviewReasons: [...new Set(reasons.filter(Boolean))] };
}

function validationIssuesFor(normalized) {
  const issues = [];
  for (const field of requiredFields) {
    if (isBlank(normalized[field])) issues.push(`missing required field: ${field}`);
  }
  if (isBlank(normalized.officialUrl) && isBlank(normalized.applicationUrl)) issues.push("missing officialUrl or applicationUrl");
  if (isBlank(normalized.summary) && isBlank(normalized.description) && isBlank(normalized.supportContent)) issues.push("missing summary, description, or supportContent");
  if (normalized.officialUrl && !/^https?:\/\//i.test(normalized.officialUrl)) issues.push("officialUrl is not an absolute URL");
  if (normalized.applicationUrl && !/^https?:\/\//i.test(normalized.applicationUrl)) issues.push("applicationUrl is not an absolute URL");
  return issues;
}

function classify({ validationIssues, mappingGaps, reviewReasons, duplicateCandidates: candidates }) {
  if (validationIssues.length) return "incomplete";
  if (candidates.some((candidate) => candidate.strength === "high")) return "duplicate";
  if (mappingGaps.includes("category")) return "needsReview";
  const hardReview = reviewReasons.some((reason) => /공시|통계|예산현황|category mapping gap/i.test(reason));
  if (hardReview) return "needsReview";
  const nonWarningGaps = mappingGaps.filter((gap) => !allowedWarningGaps.has(gap));
  if (nonWarningGaps.length) return "needsReview";
  if (mappingGaps.length || candidates.length || reviewReasons.length) return "publishable_with_warning";
  return "ready";
}

function countBy(items, classification) {
  return items.filter((item) => item.classification === classification).length;
}

function mergeGapCounts(itemReports) {
  const gaps = {};
  for (const report of itemReports) {
    for (const gap of report.mappingGaps ?? []) gaps[gap] = (gaps[gap] ?? 0) + 1;
  }
  return gaps;
}

function candidateSummary(itemReport) {
  const n = itemReport.normalized;
  return {
    title: n.title,
    slug: n.slug,
    category: n.category,
    sourceItemId: n.sourceItemId,
    organizationName: n.organizationName,
    classification: itemReport.classification,
    mappingGaps: itemReport.mappingGaps,
    reviewReasons: itemReport.reviewReasons
  };
}

function createSkippedReport({ page, limit, status, envKeyDetected, endpointDetected, apiCalled, errorKind = null, errorMessage = null }) {
  return {
    runAt: new Date().toISOString(),
    sourceName: NATIONAL_SUBSIDY_SOURCE_NAME,
    apiCandidate: API_CANDIDATES,
    envKeyRequired: ENV_KEY_CANDIDATES,
    endpointEnvKeyRequired: ENDPOINT_ENV_KEY,
    envKeyDetected,
    endpointDetected,
    apiCalled,
    status,
    page,
    limit,
    rawCount: 0,
    normalizedCount: 0,
    readyCount: 0,
    publishableWithWarningCount: 0,
    needsReviewCount: 0,
    duplicateCount: 0,
    incompleteCount: 0,
    uniqueNewCandidateCount: 0,
    mappingGaps: {},
    blockerReasons: errorKind ? [errorKind] : [],
    sampleItems: [],
    errorKind,
    errorMessage,
    recommendedNextAction: status === "missing_api_key" ? "need_api_key" : errorKind === "endpoint_required" ? "endpoint_required" : "stop_and_review",
    setupInstructions: [
      "Request access to the selected national subsidy/e나라도움 OpenAPI on data.go.kr or the official subsidy portal.",
      `Set one of ${ENV_KEY_CANDIDATES.join(", ")} in local .env or environment variables.`,
      `Set ${ENDPOINT_ENV_KEY} to the approved OpenAPI endpoint URL if the service endpoint differs from the default draft.`
    ]
  };
}

async function saveReports(report, { save, outDir }) {
  await writeJson(REPORT_PATH, report);
  if (save) {
    const reportPath = `${outDir}/reports/${timestamp()}-page-${report.page}-limit-${report.limit}.report.json`;
    await writeJson(reportPath, report);
  }
}

export async function runNationalSubsidyDryRun({ page = 1, limit = 20, save = false, outDir = "data/imports/national-subsidy" } = {}) {
  loadLocalEnv();
  const envKeyName = getConfiguredApiKeyName();
  const envKeyDetected = Boolean(envKeyName);
  const endpointDetected = Boolean(process.env[ENDPOINT_ENV_KEY]);

  if (!envKeyDetected) {
    const report = createSkippedReport({ page, limit, status: "missing_api_key", envKeyDetected, endpointDetected, apiCalled: false });
    await saveReports(report, { save, outDir });
    return { report, items: [] };
  }

  const existingIndex = buildExistingPolicyIndex(getPublicPolicies(policies));
  let fetched;
  try {
    fetched = await nationalSubsidyAdapter.fetchPage({ page, limit });
  } catch (error) {
    const report = createSkippedReport({
      page,
      limit,
      status: "api_unavailable",
      envKeyDetected,
      endpointDetected,
      apiCalled: error instanceof NationalSubsidyApiError && error.kind === "endpoint_required" ? false : true,
      errorKind: error.kind ?? "api_error",
      errorMessage: error.message
    });
    await saveReports(report, { save, outDir });
    return { report, items: [] };
  }

  const itemReports = fetched.items.map((raw, index) => {
    const normalized = nationalSubsidyAdapter.normalizeItem(raw);
    const validationIssues = validationIssuesFor(normalized);
    const { mappingGaps, reviewReasons } = mappingGapsFor(normalized);
    const candidates = duplicateCandidates(normalized, existingIndex);
    const classification = classify({ validationIssues, mappingGaps, reviewReasons, duplicateCandidates: candidates });
    return {
      index,
      classification,
      sourceItemId: normalized.sourceItemId,
      slug: normalized.slug,
      title: normalized.title,
      normalized,
      validationIssues,
      mappingGaps,
      reviewReasons,
      duplicateCandidates: candidates,
      publishPolicy: {
        canPublish: ["ready", "publishable_with_warning"].includes(classification),
        reason: classification
      }
    };
  });

  const readyCount = countBy(itemReports, "ready");
  const publishableWithWarningCount = countBy(itemReports, "publishable_with_warning");
  const needsReviewCount = countBy(itemReports, "needsReview");
  const duplicateCount = countBy(itemReports, "duplicate");
  const incompleteCount = countBy(itemReports, "incomplete");
  const normalizedCount = itemReports.length;
  const classifiedTotal = readyCount + publishableWithWarningCount + needsReviewCount + duplicateCount + incompleteCount;
  if (classifiedTotal !== normalizedCount) {
    throw new Error(`classification invariant failed: ${classifiedTotal} !== ${normalizedCount}`);
  }

  const mappingGaps = mergeGapCounts(itemReports);
  const blockerReasons = [...new Set(itemReports.flatMap((item) => [...(item.validationIssues ?? []), ...(item.mappingGaps?.includes("category") ? ["category mapping gap"] : [])]))];
  const uniqueNewCandidateCount = readyCount + publishableWithWarningCount;
  const recommendedNextAction =
    duplicateCount + incompleteCount > 0
      ? "stop_and_review"
      : Object.keys(mappingGaps).includes("category")
        ? "need_mapping_fix"
        : uniqueNewCandidateCount > 0
          ? "ready_for_national_subsidy_discovery"
          : "not_suitable_for_publish";

  const report = {
    runAt: new Date().toISOString(),
    sourceName: NATIONAL_SUBSIDY_SOURCE_NAME,
    apiCandidate: API_CANDIDATES,
    envKeyRequired: ENV_KEY_CANDIDATES,
    endpointEnvKeyRequired: ENDPOINT_ENV_KEY,
    envKeyDetected,
    endpointDetected,
    apiCalled: true,
    status: "success",
    page,
    limit,
    totalAvailable: fetched.meta.totalCount,
    responseFormat: fetched.meta.responseItemArrayPath,
    rawCount: fetched.items.length,
    normalizedCount,
    readyCount,
    publishableWithWarningCount,
    needsReviewCount,
    duplicateCount,
    incompleteCount,
    uniqueNewCandidateCount,
    mappingGaps,
    blockerReasons,
    duplicateCandidates: itemReports.flatMap((item) => item.duplicateCandidates ?? []).slice(0, 20),
    sampleItems: itemReports.slice(0, 5).map(candidateSummary),
    itemReports,
    recommendedNextAction
  };

  await saveReports(report, { save, outDir });
  return { report, items: itemReports };
}

async function main() {
  const page = Number(argValue("page", 1));
  const limit = Number(argValue("limit", 20));
  const save = hasFlag("save");
  const outDir = argValue("out-dir", "data/imports/national-subsidy");
  const { report } = await runNationalSubsidyDryRun({ page, limit, save, outDir });
  console.log("National subsidy dry-run importer");
  console.log(`envKeyDetected: ${report.envKeyDetected}`);
  console.log(`apiCalled: ${report.apiCalled}`);
  console.log(`rawCount: ${report.rawCount}`);
  console.log(`normalizedCount: ${report.normalizedCount}`);
  console.log(`readyCount: ${report.readyCount}`);
  console.log(`publishableWithWarningCount: ${report.publishableWithWarningCount}`);
  console.log(`needsReviewCount: ${report.needsReviewCount}`);
  console.log(`duplicateCount: ${report.duplicateCount}`);
  console.log(`incompleteCount: ${report.incompleteCount}`);
  console.log(`uniqueNewCandidateCount: ${report.uniqueNewCandidateCount}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
  console.log(`report: ${REPORT_PATH}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
