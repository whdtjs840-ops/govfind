import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { bokjiroLocalAdapter, BokjiroLocalApiError } from "./importers/bokjiro-local-adapter.mjs";
import {
  BOKJIRO_LOCAL_SOURCE_NAME,
  GOVFIND_CATEGORIES,
  GOVFIND_REGIONS,
  normalizeComparableText
} from "./importers/bokjiro-local-normalizers.mjs";

const requiredFields = ["title", "slug", "sourceName", "sourceItemId", "organizationName"];
const allowedWarningGaps = new Set(["region", "status", "startDate", "endDate", "applicationMethod", "sourceUpdatedAt", "targetGroups"]);

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

function extractBokjiroId(value = "") {
  return String(value).match(/wlfareInfoId=([^&]+)/)?.[1] ?? "";
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
  const byTitleAgency = new Map();
  const all = [];

  for (const policy of items) {
    const urls = [policy.officialUrl, policy.officialSourceUrl].filter(Boolean);
    for (const url of urls) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) byOfficialUrl.set(normalizedUrl, policy);
      const bokjiroId = extractBokjiroId(url);
      if (bokjiroId && /wlfareInfoReldBztpCd=02|bokjiro-local|지자체/i.test(`${url} ${policy.source ?? ""} ${policy.slug ?? ""}`)) {
        bySourceItemId.set(`${BOKJIRO_LOCAL_SOURCE_NAME}::${bokjiroId}`, policy);
      }
    }

    const titleAgency = `${normalizeComparableText(policy.title)}::${normalizeComparableText(policy.agency)}`;
    if (titleAgency !== "::") byTitleAgency.set(titleAgency, policy);
    all.push(policy);
  }

  return { bySourceItemId, byOfficialUrl, byTitleAgency, all };
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
    if (sameOrganization && similarity >= 0.82) {
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
  if (!normalized.region || !GOVFIND_REGIONS.includes(normalized.region)) gaps.push("region");
  if (normalized.status === "확인필요") gaps.push("status");
  if (!normalized.startDate) gaps.push("startDate");
  if (!normalized.endDate) gaps.push("endDate");
  if (!normalized.applicationMethod) gaps.push("applicationMethod");
  if (!normalized.sourceUpdatedAt) gaps.push("sourceUpdatedAt");
  if (!normalized.targetGroups?.length) gaps.push("targetGroups");

  return { mappingGaps: [...new Set(gaps)], reviewReasons: [...new Set(reasons.filter(Boolean))] };
}

function validationIssuesFor(normalized) {
  const issues = [];
  for (const field of requiredFields) {
    if (isBlank(normalized[field])) issues.push(`missing required field: ${field}`);
  }
  if (isBlank(normalized.officialUrl) && isBlank(normalized.applicationUrl)) issues.push("missing officialUrl or applicationUrl");
  if (isBlank(normalized.summary) && isBlank(normalized.description)) issues.push("missing summary or description");
  if (normalized.officialUrl && !/^https?:\/\//i.test(normalized.officialUrl)) issues.push("officialUrl is not an absolute URL");
  if (normalized.applicationUrl && !/^https?:\/\//i.test(normalized.applicationUrl)) issues.push("applicationUrl is not an absolute URL");
  return issues;
}

function classify({ validationIssues, mappingGaps, reviewReasons, duplicateCandidates: candidates }) {
  if (validationIssues.length) return "incomplete";
  if (candidates.some((candidate) => candidate.strength === "high")) return "duplicate";
  if (mappingGaps.length || reviewReasons.length || candidates.length) {
    if (!candidates.length && mappingGaps.every((gap) => allowedWarningGaps.has(gap))) return "publishable_with_warning";
    return "needsReview";
  }
  return "ready";
}

function buildPublishPolicy({ classification, normalized, mappingGaps }) {
  const canPublish = classification === "ready" || classification === "publishable_with_warning";
  const dateUnknown = mappingGaps.includes("startDate") || mappingGaps.includes("endDate");
  const statusUnknown = mappingGaps.includes("status") || normalized.status === "확인필요";
  const regionUnknown = mappingGaps.includes("region") || !normalized.region;
  const categoryUnclear = mappingGaps.includes("category") || normalized.category === "기타";
  const hasDate = Boolean(normalized.startDate || normalized.endDate);
  return {
    canPublish,
    includeInSearch: canPublish,
    includeInAllList: canPublish,
    includeInCategoryPage: canPublish && !categoryUnclear,
    includeInRegionPage: canPublish && !regionUnknown,
    includeInStatusFilters: canPublish && !statusUnknown,
    includeInDeadlineSort: canPublish && hasDate && !dateUnknown,
    showDday: canPublish && hasDate && !dateUnknown,
    requiresOfficialConfirmation: classification === "publishable_with_warning"
  };
}

function warningLabels({ mappingGaps, reviewReasons }) {
  const warnings = [];
  if (mappingGaps.includes("startDate") || mappingGaps.includes("endDate")) warnings.push("ambiguous date range");
  if (mappingGaps.includes("status")) warnings.push("status requires official confirmation");
  if (mappingGaps.includes("region")) warnings.push("unknown region");
  if (mappingGaps.includes("applicationMethod")) warnings.push("application method requires official confirmation");
  for (const reason of reviewReasons) warnings.push(reason);
  return [...new Set(warnings)];
}

function buildStagingItem({ rawIndex, listItem, detail, normalized, existingIndex }) {
  const validationIssues = validationIssuesFor(normalized);
  const { mappingGaps, reviewReasons } = mappingGapsFor(normalized);
  const duplicates = duplicateCandidates(normalized, existingIndex);
  const classification = classify({ validationIssues, mappingGaps, reviewReasons, duplicateCandidates: duplicates });
  const warnings = warningLabels({ mappingGaps, reviewReasons });
  const normalizedWithSafety = {
    ...normalized,
    applicationPeriodLabel: mappingGaps.includes("startDate") || mappingGaps.includes("endDate") ? "공식 공고 확인" : undefined,
    dateConfidence: mappingGaps.includes("startDate") || mappingGaps.includes("endDate") ? "unknown" : "known",
    statusLabel: mappingGaps.includes("status") ? "공식 공고 확인" : normalized.status,
    statusConfidence: mappingGaps.includes("status") ? "unknown" : "known",
    regionLabel: mappingGaps.includes("region") ? "공식 공고 확인" : undefined,
    warnings
  };
  const publishPolicy = buildPublishPolicy({ classification, normalized: normalizedWithSafety, mappingGaps });
  const reasons = [
    ...validationIssues,
    ...reviewReasons,
    ...mappingGaps.map((gap) => `mapping gap: ${gap}`),
    ...duplicates.map((candidate) => `duplicate: ${candidate.rule} -> ${candidate.matchedTitle}`)
  ];

  return {
    status: classification,
    classification,
    reasons: [...new Set(reasons.filter(Boolean))],
    validationIssues,
    reviewReasons,
    duplicateCandidates: duplicates,
    mappingGaps,
    warnings,
    publishPolicy,
    normalized: normalizedWithSafety,
    rawRef: { sourceName: BOKJIRO_LOCAL_SOURCE_NAME, sourceItemId: normalized.sourceItemId, rawIndex },
    raw: { listItem, detail }
  };
}

function countBy(items, classification) {
  return items.filter((item) => item.classification === classification).length;
}

function gapCounts(items) {
  return items.reduce((acc, item) => {
    for (const gap of item.mappingGaps ?? []) acc[gap] = (acc[gap] ?? 0) + 1;
    return acc;
  }, {});
}

function sample(items, classification, limit = 5) {
  return items
    .filter((item) => item.classification === classification)
    .slice(0, limit)
    .map((item) => ({
      sourceItemId: item.normalized.sourceItemId,
      title: item.normalized.title,
      organizationName: item.normalized.organizationName,
      region: item.normalized.region,
      category: item.normalized.category,
      status: item.normalized.status,
      reasons: item.reasons,
      duplicateCandidates: item.duplicateCandidates,
      officialUrl: item.normalized.officialUrl
    }));
}

function itemReport(item) {
  return {
    sourceItemId: item.normalized.sourceItemId,
    title: item.normalized.title,
    slug: item.normalized.slug,
    organizationName: item.normalized.organizationName,
    region: item.normalized.region,
    category: item.normalized.category,
    classification: item.classification,
    mappingGaps: item.mappingGaps,
    duplicateCandidates: item.duplicateCandidates,
    publishPolicy: item.publishPolicy,
    officialUrl: item.normalized.officialUrl
  };
}

function buildReport({ rawPayload, stagingPayload, savedPaths = null, status = "success", error = null }) {
  const items = stagingPayload.items ?? [];
  const readyCount = countBy(items, "ready");
  const publishableWithWarningCount = countBy(items, "publishable_with_warning");
  const needsReviewCount = countBy(items, "needsReview");
  const duplicateCount = countBy(items, "duplicate");
  const incompleteCount = countBy(items, "incomplete");
  const duplicateCandidatesCount = items.reduce((sum, item) => sum + (item.duplicateCandidates?.length ?? 0), 0);
  const classifiedTotal = readyCount + publishableWithWarningCount + needsReviewCount + duplicateCount + incompleteCount;
  const mappingGaps = gapCounts(items);

  return {
    status,
    sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
    fetchedAt: stagingPayload.fetchedAt,
    requestParams: rawPayload.meta?.requestParams ?? null,
    page: rawPayload.meta?.page ?? null,
    limit: rawPayload.meta?.limit ?? null,
    totalAvailable: rawPayload.meta?.totalCount ?? null,
    rawCount: rawPayload.items?.length ?? 0,
    normalizedCount: items.length,
    readyCount,
    publishableWithWarningCount,
    needsReviewCount,
    duplicateCount,
    incompleteCount,
    duplicateCandidatesCount,
    classifiedTotal,
    invariantPassed: items.length === classifiedTotal,
    mappingGaps,
    duplicateCandidates: items.flatMap((item) =>
      (item.duplicateCandidates ?? []).map((candidate) => ({
        sourceItemId: item.normalized.sourceItemId,
        title: item.normalized.title,
        ...candidate
      }))
    ),
    itemReports: items.map(itemReport),
    sampleReadyItems: sample(items, "ready"),
    samplePublishableWithWarningItems: sample(items, "publishable_with_warning"),
    sampleNeedsReviewItems: sample(items, "needsReview"),
    sampleDuplicateItems: sample(items, "duplicate"),
    sampleIncompleteItems: sample(items, "incomplete"),
    recommendedNextAction:
      status === "error"
        ? "stop_and_review"
        : items.length === classifiedTotal && !Object.keys(mappingGaps).includes("category")
          ? "ready_for_bokjiro_local_candidate_dry_run"
          : Object.keys(mappingGaps).includes("category")
            ? "need_mapping_fix"
            : "stop_and_review",
    errorCode: error?.code ?? null,
    errorKind: error?.kind ?? null,
    errorMessage: error?.message ?? null,
    savedPaths
  };
}

async function saveArtifacts({ outDir, rawPayload, stagingPayload, report }) {
  const stamp = timestamp();
  const rawPath = resolve(outDir, "raw", `${BOKJIRO_LOCAL_SOURCE_NAME}-${stamp}.raw.json`);
  const stagingPath = resolve(outDir, "staging", `${BOKJIRO_LOCAL_SOURCE_NAME}-${stamp}.staging.json`);
  const reportPath = resolve(outDir, "reports", `${BOKJIRO_LOCAL_SOURCE_NAME}-${stamp}.report.json`);
  const fixedReportPath = resolve("data/staging/bokjiro-local/dry-run-report.json");
  const savedPaths = { raw: rawPath, staging: stagingPath, report: reportPath, fixedReport: fixedReportPath };
  report.savedPaths = savedPaths;
  stagingPayload.rawFilePath = rawPath;
  stagingPayload.stagingFilePath = stagingPath;
  await writeJson(rawPath, rawPayload);
  await writeJson(stagingPath, stagingPayload);
  await writeJson(reportPath, report);
  await writeJson(fixedReportPath, report);
  return savedPaths;
}

function printReport(report) {
  console.log("Bokjiro local dry-run importer");
  console.log(`status: ${report.status}`);
  if (report.errorKind) console.log(`errorKind: ${report.errorKind}`);
  if (report.errorMessage) console.log(`errorMessage: ${report.errorMessage}`);
  console.log(`rawCount: ${report.rawCount}`);
  console.log(`normalizedCount: ${report.normalizedCount}`);
  console.log(`readyCount: ${report.readyCount}`);
  console.log(`publishableWithWarningCount: ${report.publishableWithWarningCount}`);
  console.log(`needsReviewCount: ${report.needsReviewCount}`);
  console.log(`duplicateCount: ${report.duplicateCount}`);
  console.log(`incompleteCount: ${report.incompleteCount}`);
  console.log(`duplicateCandidatesCount: ${report.duplicateCandidatesCount}`);
  console.log(`mappingGaps: ${JSON.stringify(report.mappingGaps)}`);
  console.log(`invariantPassed: ${report.invariantPassed}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
  if (report.savedPaths) console.log(`saved report path: ${report.savedPaths.fixedReport}`);
}

export async function runBokjiroLocalDryRun({ page = 1, limit = 20, save = false, outDir = "data/imports/bokjiro-local" } = {}) {
  const existingIndex = buildExistingPolicyIndex(getPublicPolicies(policies));

  if (!process.env.GOVFIND_BOKJIRO_LOCAL_API_KEY && !process.env.GOVFIND_WELFARE_API_KEY) {
    const rawPayload = {
      meta: {
        sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
        endpointName: "LcgvWelfarelist",
        requestParams: { pageNo: page, numOfRows: limit, serviceKey: "[REDACTED]" }
      },
      items: []
    };
    const stagingPayload = { sourceName: BOKJIRO_LOCAL_SOURCE_NAME, fetchedAt: new Date().toISOString(), items: [] };
    const report = buildReport({
      rawPayload,
      stagingPayload,
      status: "error",
      error: { kind: "missing_api_key", message: "GOVFIND_BOKJIRO_LOCAL_API_KEY is not set" }
    });
    if (save) await saveArtifacts({ outDir, rawPayload, stagingPayload, report });
    return { report, rawPayload, stagingPayload };
  }

  try {
    const listPayload = await bokjiroLocalAdapter.fetchPage({ page, limit });
    const rawItems = [];
    for (let index = 0; index < listPayload.items.length; index += 1) {
      const listItem = listPayload.items[index];
      const detail = await bokjiroLocalAdapter.fetchDetail(listItem);
      rawItems.push({ listItem, detail, page, indexOnPage: index });
    }
    const rawPayload = {
      meta: {
        ...listPayload.meta,
        adapterName: BOKJIRO_LOCAL_SOURCE_NAME,
        requestParams: listPayload.meta.requestParams
      },
      items: rawItems
    };
    const stagingItems = rawItems.map((entry, rawIndex) => {
      const normalized = bokjiroLocalAdapter.normalizeItem(entry.listItem, entry.detail);
      return buildStagingItem({ ...entry, rawIndex, normalized, existingIndex });
    });
    const stagingPayload = {
      sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
      fetchedAt: new Date().toISOString(),
      page,
      limit,
      totalAvailable: listPayload.meta.totalCount,
      items: stagingItems
    };
    const report = buildReport({ rawPayload, stagingPayload });
    if (save) await saveArtifacts({ outDir, rawPayload, stagingPayload, report });
    return { report, rawPayload, stagingPayload };
  } catch (error) {
    const rawPayload = {
      meta: {
        sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
        endpointName: "LcgvWelfarelist",
        requestParams: { pageNo: page, numOfRows: limit, serviceKey: "[REDACTED]" }
      },
      items: []
    };
    const stagingPayload = { sourceName: BOKJIRO_LOCAL_SOURCE_NAME, fetchedAt: new Date().toISOString(), items: [] };
    const report = buildReport({
      rawPayload,
      stagingPayload,
      status: "error",
      error:
        error instanceof BokjiroLocalApiError
          ? error
          : { kind: "unknown_error", message: error instanceof Error ? error.message : String(error) }
    });
    if (save) await saveArtifacts({ outDir, rawPayload, stagingPayload, report });
    return { report, rawPayload, stagingPayload };
  }
}

async function main() {
  if (!hasFlag("no-env-file")) loadLocalEnv();

  const page = Number(argValue("page", process.env.GOVFIND_BOKJIRO_LOCAL_PAGE ?? 1));
  const limit = Number(argValue("limit", argValue("per-page", process.env.GOVFIND_BOKJIRO_LOCAL_PER_PAGE ?? 20)));
  const save = hasFlag("save");
  const outDir = argValue("out-dir", "data/imports/bokjiro-local");
  const { report } = await runBokjiroLocalDryRun({ page, limit, save, outDir });
  printReport(report);
  if (report.status === "error") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
