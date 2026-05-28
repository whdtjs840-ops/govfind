import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { kstartupAdapter, KstartupApiError } from "./importers/kstartup-adapter.mjs";
import {
  KSTARTUP_SOURCE_NAME,
  GOVFIND_CATEGORIES,
  GOVFIND_REGIONS,
  normalizeComparableText
} from "./importers/kstartup-normalizers.mjs";

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

function isGenericOfficialUrl(value = "") {
  const url = normalizeUrl(value);
  if (!url) return false;
  if (url === "https://www.kstartup.go.kr") return true;
  return /^https:\/\/www\.kstartup\.go\.kr\/?$/.test(url) || /\/web\/lay1\/bbs\/S1T122C128\/AS\/74\/list\.do/i.test(url);
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
      candidates.push({
        rule: "officialUrl",
        strength: isGenericOfficialUrl(url) ? "weak" : "high",
        matchedSlug: match.slug,
        matchedTitle: match.title,
        value: url
      });
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

  if (!GOVFIND_CATEGORIES.includes(normalized.category)) gaps.push("category");
  if (!normalized.region || !GOVFIND_REGIONS.includes(normalized.region)) gaps.push("region");
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
  if (isBlank(normalized.summary) && isBlank(normalized.description)) issues.push("missing summary or description");
  if (normalized.officialUrl && !/^https?:\/\//i.test(normalized.officialUrl)) issues.push("officialUrl is not an absolute URL");
  if (normalized.applicationUrl && !/^https?:\/\//i.test(normalized.applicationUrl)) issues.push("applicationUrl is not an absolute URL");
  return issues;
}

function classify({ validationIssues, mappingGaps, reviewReasons, duplicateCandidates: candidates }) {
  if (validationIssues.length) return "incomplete";
  if (candidates.some((candidate) => candidate.strength === "high")) return "duplicate";
  if (mappingGaps.length || reviewReasons.length || candidates.length) {
    if (mappingGaps.every((gap) => allowedWarningGaps.has(gap)) && !candidates.some((candidate) => candidate.strength !== "weak")) {
      return "publishable_with_warning";
    }
    return "needsReview";
  }
  return "ready";
}

function buildPublishPolicy({ classification, normalized, mappingGaps }) {
  const canPublish = classification === "ready" || classification === "publishable_with_warning";
  const dateUnknown = mappingGaps.includes("startDate") || mappingGaps.includes("endDate");
  const statusUnknown = mappingGaps.includes("status") || normalized.status === "확인필요";
  const regionUnknown = mappingGaps.includes("region") || !normalized.region;
  const hasDate = Boolean(normalized.startDate || normalized.endDate);
  return {
    canPublish,
    includeInSearch: canPublish,
    includeInAllList: canPublish,
    includeInCategoryPage: canPublish,
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
    rawRef: { sourceName: KSTARTUP_SOURCE_NAME, sourceItemId: normalized.sourceItemId, rawIndex },
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
  const uniqueNewCandidateCount = items.filter((item) => ["ready", "publishable_with_warning"].includes(item.classification) && item.publishPolicy?.canPublish).length;

  return {
    status,
    sourceName: KSTARTUP_SOURCE_NAME,
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
    uniqueNewCandidateCount,
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
        : items.length === classifiedTotal && !Object.keys(mappingGaps).includes("category") && uniqueNewCandidateCount >= 200
          ? "ready_for_kstartup_large_apply"
          : Object.keys(mappingGaps).includes("category")
            ? "need_mapping_fix"
            : uniqueNewCandidateCount > 0
              ? "need_more_discovery"
              : "move_to_kstartup",
    errorCode: error?.code ?? null,
    errorKind: error?.kind ?? null,
    errorMessage: error?.message ?? null,
    savedPaths
  };
}

async function saveArtifacts({ outDir, rawPayload, stagingPayload, report }) {
  const stamp = timestamp();
  const rawPath = resolve(outDir, "raw", `${KSTARTUP_SOURCE_NAME}-${stamp}.raw.json`);
  const stagingPath = resolve(outDir, "staging", `${KSTARTUP_SOURCE_NAME}-${stamp}.staging.json`);
  const reportPath = resolve(outDir, "reports", `${KSTARTUP_SOURCE_NAME}-${stamp}.report.json`);
  const fixedReportPath = resolve("data/staging/kstartup/dry-run-report.json");
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
  console.log("K-Startup dry-run importer");
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
  console.log(`uniqueNewCandidateCount: ${report.uniqueNewCandidateCount}`);
  console.log(`duplicateCandidatesCount: ${report.duplicateCandidatesCount}`);
  console.log(`mappingGaps: ${JSON.stringify(report.mappingGaps)}`);
  console.log(`invariantPassed: ${report.invariantPassed}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
  if (report.savedPaths) console.log(`saved report path: ${report.savedPaths.fixedReport}`);
}

export async function runKstartupDryRun({ page = 1, limit = 50, save = false, outDir = "data/imports/kstartup" } = {}) {
  const existingIndex = buildExistingPolicyIndex(getPublicPolicies(policies));

  if (!process.env.GOVFIND_KSTARTUP_API_KEY && !process.env.GOVFIND_KSTARTUP_CRTFC_KEY) {
    const rawPayload = {
      meta: {
        sourceName: KSTARTUP_SOURCE_NAME,
        endpointName: "kstartupApi",
        requestParams: { dataType: "json", pageUnit: limit, pageIndex: page, crtfcKey: "[REDACTED]" }
      },
      items: []
    };
    const stagingPayload = { sourceName: KSTARTUP_SOURCE_NAME, fetchedAt: new Date().toISOString(), items: [] };
    const report = buildReport({
      rawPayload,
      stagingPayload,
      status: "error",
      error: { kind: "missing_api_key", message: "GOVFIND_KSTARTUP_API_KEY is not set" }
    });
    if (save) await saveArtifacts({ outDir, rawPayload, stagingPayload, report });
    return { report, rawPayload, stagingPayload };
  }

  try {
    const listPayload = await kstartupAdapter.fetchPage({ page, limit });
    const rawItems = [];
    for (let index = 0; index < listPayload.items.length; index += 1) {
      const listItem = listPayload.items[index];
      const detail = await kstartupAdapter.fetchDetail(listItem);
      rawItems.push({ listItem, detail, page, indexOnPage: index });
    }
    const rawPayload = {
      meta: {
        ...listPayload.meta,
        adapterName: KSTARTUP_SOURCE_NAME,
        requestParams: listPayload.meta.requestParams
      },
      items: rawItems
    };
    const stagingItems = rawItems.map((entry, rawIndex) => {
      const normalized = kstartupAdapter.normalizeItem(entry.listItem, entry.detail);
      return buildStagingItem({ ...entry, rawIndex, normalized, existingIndex });
    });
    const stagingPayload = {
      sourceName: KSTARTUP_SOURCE_NAME,
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
        sourceName: KSTARTUP_SOURCE_NAME,
        endpointName: "kstartupApi",
        requestParams: { dataType: "json", pageUnit: limit, pageIndex: page, crtfcKey: "[REDACTED]" }
      },
      items: []
    };
    const stagingPayload = { sourceName: KSTARTUP_SOURCE_NAME, fetchedAt: new Date().toISOString(), items: [] };
    const report = buildReport({
      rawPayload,
      stagingPayload,
      status: "error",
      error:
        error instanceof KstartupApiError
          ? error
          : { kind: error?.message?.includes("API_KEY") ? "missing_api_key" : "unknown_error", message: error instanceof Error ? error.message : String(error) }
    });
    if (save) await saveArtifacts({ outDir, rawPayload, stagingPayload, report });
    return { report, rawPayload, stagingPayload };
  }
}

async function main() {
  if (!hasFlag("no-env-file")) loadLocalEnv();

  const page = Number(argValue("page", process.env.GOVFIND_KSTARTUP_PAGE ?? 1));
  const limit = Number(argValue("limit", argValue("per-page", process.env.GOVFIND_KSTARTUP_PER_PAGE ?? 50)));
  const save = hasFlag("save");
  const outDir = argValue("out-dir", "data/imports/kstartup");
  const { report } = await runKstartupDryRun({ page, limit, save, outDir });
  printReport(report);
  if (report.status === "error") process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main();
}
