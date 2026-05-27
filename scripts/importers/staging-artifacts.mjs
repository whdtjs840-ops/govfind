import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies } from "../../src/data/policies.ts";
import {
  GOV24_SOURCE_NAME,
  fieldAliases,
  normalizeComparableText,
  normalizeGov24Item,
  pick
} from "./gov24-normalizers.mjs";
import { buildExistingPolicyIndex, buildPublishPolicy, classifyStagingItem, titleSimilarity, validateStagingItem, warningLabels } from "./staging-validation.mjs";

export function timestamp() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    "-",
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function latestJsonFile(directory, suffix) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => resolve(directory, entry.name))
    .sort()
    .reverse();
  return files[0] ?? null;
}

function rawEntryParts(entry) {
  if (entry?.listItem || entry?.detail) {
    return { listItem: entry.listItem ?? {}, detail: entry.detail ?? {} };
  }
  return { listItem: entry ?? {}, detail: {} };
}

function classificationOf(item) {
  const value = item.classification ?? item.status;
  if (value === "duplicate_candidate") return "duplicate";
  if (value === "needs_manual_review") return "needsReview";
  return value;
}

function isPublishableWithWarning(item) {
  return classificationOf(item) === "publishable_with_warning";
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

function periodKey(item) {
  return [item.startDate ?? "", item.endDate ?? ""].join("::");
}

function uniqueCandidates(candidates) {
  return candidates.filter((candidate, index, list) => {
    const key = `${candidate.rule}::${candidate.matchedSlug}::${candidate.value}`;
    return list.findIndex((item) => `${item.rule}::${item.matchedSlug}::${item.value}` === key) === index;
  });
}

function internalDuplicateCandidates(normalized, allNormalized, currentIndex) {
  const candidates = [];
  const urls = [normalized.officialUrl, normalized.applicationUrl].map(normalizeUrl).filter(Boolean);
  const titleAgency = `${normalizeComparableText(normalized.title)}::${normalizeComparableText(normalized.organizationName)}`;
  const titlePeriod = `${normalizeComparableText(normalized.title)}::${periodKey(normalized)}`;

  allNormalized.forEach((other, otherIndex) => {
    if (otherIndex === currentIndex) return;

    if (normalized.sourceItemId && normalized.sourceName === other.sourceName && normalized.sourceItemId === other.sourceItemId) {
      candidates.push({
        rule: "staging sourceName + sourceItemId",
        strength: "high",
        matchedSlug: other.slug,
        matchedTitle: other.title,
        value: `${normalized.sourceName}::${normalized.sourceItemId}`
      });
    }

    const otherUrls = [other.officialUrl, other.applicationUrl].map(normalizeUrl).filter(Boolean);
    for (const url of urls) {
      if (otherUrls.includes(url)) {
        candidates.push({
          rule: "staging officialUrl",
          strength: "high",
          matchedSlug: other.slug,
          matchedTitle: other.title,
          value: url
        });
      }
    }

    const otherTitleAgency = `${normalizeComparableText(other.title)}::${normalizeComparableText(other.organizationName)}`;
    if (titleAgency !== "::" && titleAgency === otherTitleAgency) {
      candidates.push({
        rule: "staging normalized title + organizationName",
        strength: "high",
        matchedSlug: other.slug,
        matchedTitle: other.title,
        value: `${normalized.title} / ${normalized.organizationName}`
      });
    }

    const samePeriod = (normalized.startDate || normalized.endDate) && periodKey(normalized) === periodKey(other);
    if (samePeriod && titleSimilarity(normalized.title, other.title) >= 0.9) {
      candidates.push({
        rule: "staging normalized title + date period similar",
        strength: "medium",
        matchedSlug: other.slug,
        matchedTitle: other.title,
        value: titlePeriod
      });
    }

    const sameOrganization = normalizeComparableText(normalized.organizationName) === normalizeComparableText(other.organizationName);
    const similarity = titleSimilarity(normalized.title, other.title);
    if (sameOrganization && similarity >= 0.82) {
      candidates.push({
        rule: "staging high title similarity + same organizationName",
        strength: similarity >= 0.9 ? "high" : "medium",
        matchedSlug: other.slug,
        matchedTitle: other.title,
        value: similarity.toFixed(2)
      });
    }
  });

  return uniqueCandidates(candidates);
}

function rawRegionFields(listItem, detail) {
  const merged = { ...listItem, ...detail };
  return {
    region: pick(merged, fieldAliases.region),
    organizationType: pick(merged, fieldAliases.organizationType),
    organizationName: pick(merged, fieldAliases.organizationName),
    title: pick(merged, fieldAliases.title)
  };
}

export function buildStagingPayloadFromRaw(rawPayload) {
  const existingIndex = buildExistingPolicyIndex(policies);
  const rawItems = Array.isArray(rawPayload.items) ? rawPayload.items : [];
  const prepared = rawItems.map((entry, rawIndex) => {
    const { listItem, detail } = rawEntryParts(entry);
    return {
      rawIndex,
      listItem,
      detail,
      normalized: normalizeGov24Item(listItem, detail)
    };
  });
  const allNormalized = prepared.map((entry) => entry.normalized);

  const items = prepared.map(({ rawIndex, listItem, detail, normalized }) => {
    const validation = validateStagingItem(normalized, existingIndex);
    const duplicateCandidates = uniqueCandidates([
      ...validation.duplicateCandidates,
      ...internalDuplicateCandidates(normalized, allNormalized, rawIndex)
    ]);
    const classification = classifyStagingItem({
      normalized,
      validationIssues: validation.validationIssues,
      mappingGaps: validation.mappingGaps,
      reviewReasons: validation.reviewReasons,
      duplicateCandidates
    });
    const warnings = warningLabels({
      normalized,
      mappingGaps: validation.mappingGaps,
      reviewReasons: validation.reviewReasons
    });
    const normalizedWithPolicyFields = {
      ...normalized,
      applicationPeriodLabel: validation.mappingGaps.includes("startDate") || validation.mappingGaps.includes("endDate") ? "공식 공고 확인" : undefined,
      deadlineText: validation.mappingGaps.includes("startDate") || validation.mappingGaps.includes("endDate") ? "공식 공고 확인" : undefined,
      dateConfidence: validation.mappingGaps.includes("startDate") || validation.mappingGaps.includes("endDate") ? "unknown" : "known",
      statusLabel: validation.mappingGaps.includes("status") ? "공식 공고 확인" : normalized.status,
      statusConfidence: validation.mappingGaps.includes("status") ? "unknown" : "known",
      warnings
    };
    const publishPolicy = buildPublishPolicy({
      classification,
      normalized: normalizedWithPolicyFields,
      mappingGaps: validation.mappingGaps
    });
    const reasons = [
      ...validation.validationIssues,
      ...validation.reviewReasons,
      ...validation.mappingGaps.map((gap) => `mapping gap: ${gap}`),
      ...duplicateCandidates.map((candidate) => `duplicate: ${candidate.rule} -> ${candidate.matchedTitle}`)
    ];

    return {
      status: classification,
      classification,
      reasons: [...new Set(reasons.filter(Boolean))],
      validationIssues: validation.validationIssues,
      reviewReasons: validation.reviewReasons,
      duplicateCandidates,
      mappingGaps: validation.mappingGaps,
      warnings,
      publishPolicy,
      normalized: normalizedWithPolicyFields,
      rawRef: {
        sourceName: GOV24_SOURCE_NAME,
        sourceItemId: normalized.sourceItemId,
        rawIndex,
        regionFields: rawRegionFields(listItem, detail)
      }
    };
  });

  return {
    sourceName: rawPayload.meta?.sourceName ?? GOV24_SOURCE_NAME,
    fetchedAt: new Date().toISOString(),
    page: rawPayload.meta?.page ?? null,
    limit: rawPayload.meta?.limit ?? rawItems.length,
    maxPages: rawPayload.meta?.maxPages ?? null,
    pagesFetched: rawPayload.meta?.pagesFetched ?? null,
    totalAvailable: rawPayload.meta?.totalAvailable ?? null,
    requestParams: rawPayload.meta?.requestParams ?? null,
    adapterName: rawPayload.meta?.adapterName ?? rawPayload.meta?.sourceName ?? GOV24_SOURCE_NAME,
    endpointName: rawPayload.meta?.endpointName ?? null,
    responseItemArrayPath: rawPayload.meta?.responseItemArrayPath ?? null,
    pages: rawPayload.meta?.pages ?? [],
    rawFilePath: rawPayload.meta?.rawFilePath ?? null,
    items
  };
}

function countBy(items, predicate) {
  return items.filter(predicate).length;
}

function gapCounts(items) {
  return items.reduce((acc, item) => {
    for (const gap of item.mappingGaps ?? []) acc[gap] = (acc[gap] ?? 0) + 1;
    return acc;
  }, {});
}

function issueCount(items, matcher) {
  return items.reduce((sum, item) => sum + (item.validationIssues ?? []).filter(matcher).length, 0);
}

function normalizedSummary(item) {
  return {
    slug: item.normalized.slug,
    category: item.normalized.category,
    sourceName: item.normalized.sourceName,
    organizationName: item.normalized.organizationName,
    region: item.normalized.region,
    status: item.normalized.status,
    officialUrl: item.normalized.officialUrl,
    applicationUrl: item.normalized.applicationUrl,
    startDate: item.normalized.startDate,
    endDate: item.normalized.endDate,
    applicationPeriodLabel: item.normalized.applicationPeriodLabel ?? null,
    dateConfidence: item.normalized.dateConfidence ?? null,
    statusLabel: item.normalized.statusLabel ?? null,
    statusConfidence: item.normalized.statusConfidence ?? null,
    warnings: item.warnings ?? item.normalized.warnings ?? [],
    publishPolicy: item.publishPolicy ?? null
  };
}

export function buildStagingReport(stagingPayload, rawPayload = null) {
  const items = stagingPayload.items ?? [];
  const duplicateItems = items.filter((item) => (item.duplicateCandidates?.length ?? 0) > 0);
  const duplicateCandidatesCount = items.reduce((sum, item) => sum + (item.duplicateCandidates?.length ?? 0), 0);
  const gaps = gapCounts(items);
  const topMappingGap = Object.entries(gaps).sort((a, b) => b[1] - a[1])[0] ?? null;
  const readyCount = countBy(items, (item) => classificationOf(item) === "ready");
  const publishableWithWarningCount = countBy(items, (item) => isPublishableWithWarning(item));
  const incompleteCount = countBy(items, (item) => classificationOf(item) === "incomplete");
  const needsReviewCount = countBy(items, (item) => classificationOf(item) === "needsReview");
  const duplicateCount = countBy(items, (item) => classificationOf(item) === "duplicate");
  const classifiedTotal = readyCount + publishableWithWarningCount + incompleteCount + needsReviewCount + duplicateCount;
  const rawCount = rawPayload?.items?.length ?? items.length;
  const warningOnlyCount = publishableWithWarningCount;
  const blockerCount = incompleteCount + duplicateCount + needsReviewCount;

  return {
    status: "success",
    sourceName: stagingPayload.sourceName,
    fetchedAt: stagingPayload.fetchedAt,
    page: stagingPayload.page,
    limit: stagingPayload.limit,
    maxPages: stagingPayload.maxPages ?? rawPayload?.meta?.maxPages ?? null,
    pagesFetched: stagingPayload.pagesFetched ?? rawPayload?.meta?.pagesFetched ?? null,
    pagesRequested: rawPayload?.meta?.pagesRequested ?? stagingPayload.pagesRequested ?? null,
    lastSuccessfulPage: rawPayload?.meta?.lastSuccessfulPage ?? stagingPayload.lastSuccessfulPage ?? null,
    totalAvailable: stagingPayload.totalAvailable ?? rawPayload?.meta?.totalAvailable ?? null,
    requestParams: stagingPayload.requestParams ?? rawPayload?.meta?.requestParams ?? null,
    adapterName: stagingPayload.adapterName ?? rawPayload?.meta?.adapterName ?? stagingPayload.sourceName,
    endpointName: stagingPayload.endpointName ?? rawPayload?.meta?.endpointName ?? null,
    responseItemArrayPath: stagingPayload.responseItemArrayPath ?? rawPayload?.meta?.responseItemArrayPath ?? null,
    pages: stagingPayload.pages ?? rawPayload?.meta?.pages ?? [],
    cacheHits: rawPayload?.meta?.cacheHits ?? null,
    apiCallsMade: rawPayload?.meta?.apiCallsMade ?? null,
    rawFilePath: stagingPayload.rawFilePath ?? rawPayload?.meta?.rawFilePath ?? null,
    stagingFilePath: stagingPayload.stagingFilePath ?? null,
    validationReportFilePath: null,
    rawCount,
    normalizedCount: items.length,
    readyCount,
    publishableWithWarningCount,
    publishableTotalCount: readyCount + publishableWithWarningCount,
    incompleteCount,
    needsReviewCount,
    duplicateCount,
    duplicateCandidatesCount,
    uniqueNewCandidateCount: readyCount + publishableWithWarningCount + needsReviewCount,
    warningOnlyCount,
    blockerCount,
    categoryMappingGapCount: countBy(items, (item) => item.mappingGaps?.includes("category")),
    ambiguousDateCount: countBy(items, (item) => item.mappingGaps?.includes("startDate") || item.mappingGaps?.includes("endDate")),
    ambiguousStatusCount: countBy(items, (item) => item.mappingGaps?.includes("status")),
    classifiedTotal,
    invariantPassed: items.length === classifiedTotal,
    missingTitleCount: issueCount(items, (issue) => issue.includes("title")),
    missingOrganizationCount: issueCount(items, (issue) => issue.includes("organizationName")),
    missingOfficialUrlOrApplicationUrlCount: issueCount(items, (issue) => issue.includes("officialUrl or applicationUrl")),
    unknownCategoryCount: countBy(items, (item) => item.mappingGaps?.includes("category")),
    unknownRegionCount: countBy(items, (item) => !item.normalized.region || item.mappingGaps?.includes("region")),
    statusNeedsConfirmationCount: countBy(items, (item) => item.mappingGaps?.includes("status")),
    fieldsThatCouldNotBeMapped: gaps,
    topMappingGap: topMappingGap ? { field: topMappingGap[0], count: topMappingGap[1] } : null,
    sampleReadyItems: items.filter((item) => classificationOf(item) === "ready").slice(0, 5).map((item) => item.normalized),
    samplePublishableWithWarningItems: items.filter((item) => isPublishableWithWarning(item)).slice(0, 10).map((item) => ({
      title: item.normalized.title,
      sourceItemId: item.normalized.sourceItemId,
      organizationName: item.normalized.organizationName,
      category: item.normalized.category,
      status: item.normalized.status,
      applicationPeriodLabel: item.normalized.applicationPeriodLabel ?? null,
      warnings: item.warnings ?? item.normalized.warnings ?? [],
      publishPolicy: item.publishPolicy
    })),
    sampleIncompleteItems: items.filter((item) => classificationOf(item) === "incomplete").slice(0, 5).map((item) => ({
      reasons: item.reasons ?? item.validationIssues,
      normalized: item.normalized
    })),
    sampleNeedsReviewItems: items.filter((item) => classificationOf(item) === "needsReview").slice(0, 5).map((item) => ({
      reasons: item.reasons ?? item.reviewReasons,
      normalized: item.normalized
    })),
    sampleDuplicateItems: items.filter((item) => classificationOf(item) === "duplicate").slice(0, 5).map((item) => ({
      reasons: item.reasons ?? [],
      sourceItemId: item.normalized.sourceItemId,
      title: item.normalized.title,
      candidates: item.duplicateCandidates
    })),
    sampleDuplicateCandidates: duplicateItems.slice(0, 5).map((item) => ({
      sourceItemId: item.normalized.sourceItemId,
      title: item.normalized.title,
      candidates: item.duplicateCandidates
    })),
    sampleUnknownRegionItems: items
      .filter((item) => !item.normalized.region || item.mappingGaps?.includes("region"))
      .slice(0, 5)
      .map((item) => ({
        sourceItemId: item.normalized.sourceItemId,
        title: item.normalized.title,
        normalizedRegion: item.normalized.region,
        reasons: item.reasons ?? [],
        rawRegionFields: item.rawRef?.regionFields ?? null
      })),
    itemReports: items.map((item) => ({
      sourceItemId: item.normalized.sourceItemId,
      title: item.normalized.title,
      classification: classificationOf(item),
      reasons: item.reasons ?? [],
      warnings: item.warnings ?? [],
      publishPolicy: item.publishPolicy ?? null,
      duplicateCandidates: item.duplicateCandidates ?? [],
      normalized: normalizedSummary(item)
    })),
    savedPaths: null
  };
}

export async function saveGov24Artifacts({ outDir = "data/imports/gov24", stamp = timestamp(), rawPayload, stagingPayload, report }) {
  const rawPath = resolve(outDir, "raw", `${GOV24_SOURCE_NAME}-${stamp}.raw.json`);
  const stagingPath = resolve(outDir, "staging", `${GOV24_SOURCE_NAME}-${stamp}.staging.json`);
  const reportPath = resolve(outDir, "reports", `${GOV24_SOURCE_NAME}-${stamp}.report.json`);

  rawPayload.meta = { ...(rawPayload.meta ?? {}), rawFilePath: rawPath };
  stagingPayload.rawFilePath = rawPath;
  stagingPayload.stagingFilePath = stagingPath;
  report.savedPaths = { raw: rawPath, staging: stagingPath, report: reportPath };
  report.rawFilePath = rawPath;
  report.stagingFilePath = stagingPath;
  report.validationReportFilePath = reportPath;
  await writeJson(rawPath, rawPayload);
  await writeJson(stagingPath, stagingPayload);
  await writeJson(reportPath, report);
  return report.savedPaths;
}

export function printStagingReport(report) {
  if (report.status) console.log(`status: ${report.status}`);
  if (report.errorCode !== undefined && report.errorCode !== null) console.log(`errorCode: ${report.errorCode}`);
  if (report.errorKind) console.log(`errorKind: ${report.errorKind}`);
  if (report.errorMessage) console.log(`errorMessage: ${report.errorMessage}`);
  if (report.failedAtPage !== undefined && report.failedAtPage !== null) console.log(`failedAtPage: ${report.failedAtPage}`);
  if (report.adapterName) console.log(`adapterName: ${report.adapterName}`);
  if (report.endpointName) console.log(`endpointName: ${report.endpointName}`);
  if (report.requestParams) console.log(`requestParams: ${JSON.stringify(report.requestParams)}`);
  if (report.responseItemArrayPath) console.log(`responseItemArrayPath: ${report.responseItemArrayPath}`);
  if (report.pagesFetched !== undefined && report.pagesFetched !== null) console.log(`pagesFetched: ${report.pagesFetched}`);
  if (report.pagesRequested !== undefined && report.pagesRequested !== null) console.log(`pagesRequested: ${JSON.stringify(report.pagesRequested)}`);
  if (report.lastSuccessfulPage !== undefined && report.lastSuccessfulPage !== null) console.log(`lastSuccessfulPage: ${report.lastSuccessfulPage}`);
  if (report.totalAvailable !== undefined && report.totalAvailable !== null) console.log(`totalAvailable: ${report.totalAvailable}`);
  if (report.apiCallsMade !== undefined && report.apiCallsMade !== null) console.log(`apiCallsMade: ${report.apiCallsMade}`);
  if (report.cacheHits !== undefined && report.cacheHits !== null) console.log(`cacheHits: ${report.cacheHits}`);
  if (report.pages?.length) console.log(`pageMetadata: ${JSON.stringify(report.pages)}`);
  if (report.rawFilePath) console.log(`Gov24 raw staging file path: ${report.rawFilePath}`);
  if (report.stagingFilePath) console.log(`Gov24 normalized staging file path: ${report.stagingFilePath}`);
  if (report.validationReportFilePath) console.log(`Gov24 validation report file path: ${report.validationReportFilePath}`);
  console.log(`rawCount: ${report.rawCount}`);
  console.log(`normalizedCount: ${report.normalizedCount}`);
  console.log(`readyCount: ${report.readyCount}`);
  if (report.publishableWithWarningCount !== undefined) console.log(`publishableWithWarningCount: ${report.publishableWithWarningCount}`);
  if (report.publishableTotalCount !== undefined) console.log(`publishableTotalCount: ${report.publishableTotalCount}`);
  console.log(`incompleteCount: ${report.incompleteCount}`);
  console.log(`needsReviewCount: ${report.needsReviewCount}`);
  console.log(`duplicateCount: ${report.duplicateCount}`);
  console.log(`duplicateCandidatesCount: ${report.duplicateCandidatesCount}`);
  console.log(`uniqueNewCandidateCount: ${report.uniqueNewCandidateCount}`);
  console.log(`unknownCategoryCount: ${report.unknownCategoryCount}`);
  console.log(`unknownRegionCount: ${report.unknownRegionCount}`);
  console.log(`missingOfficialOrApplicationUrlCount: ${report.missingOfficialUrlOrApplicationUrlCount}`);
  console.log(`classifiedTotal: ${report.classifiedTotal}`);
  console.log(`invariantPassed: ${report.invariantPassed}`);
  if (report.warningOnlyCount !== undefined) console.log(`warningOnlyCount: ${report.warningOnlyCount}`);
  if (report.blockerCount !== undefined) console.log(`blockerCount: ${report.blockerCount}`);
  if (report.categoryMappingGapCount !== undefined) console.log(`categoryMappingGapCount: ${report.categoryMappingGapCount}`);
  if (report.ambiguousDateCount !== undefined) console.log(`ambiguousDateCount: ${report.ambiguousDateCount}`);
  if (report.ambiguousStatusCount !== undefined) console.log(`ambiguousStatusCount: ${report.ambiguousStatusCount}`);
  console.log(`missingTitleCount: ${report.missingTitleCount}`);
  console.log(`missingOrganizationCount: ${report.missingOrganizationCount}`);
  console.log(`statusNeedsConfirmationCount: ${report.statusNeedsConfirmationCount}`);
  console.log(`topMappingGap: ${JSON.stringify(report.topMappingGap)}`);
  console.log(`sample ready items: ${JSON.stringify(report.sampleReadyItems, null, 2)}`);
  if (report.samplePublishableWithWarningItems) console.log(`sample publishable_with_warning items: ${JSON.stringify(report.samplePublishableWithWarningItems, null, 2)}`);
  console.log(`sample incomplete items: ${JSON.stringify(report.sampleIncompleteItems, null, 2)}`);
  console.log(`sample needsReview items: ${JSON.stringify(report.sampleNeedsReviewItems, null, 2)}`);
  console.log(`sample duplicate items: ${JSON.stringify(report.sampleDuplicateItems, null, 2)}`);
  console.log(`sample duplicate candidates: ${JSON.stringify(report.sampleDuplicateCandidates, null, 2)}`);
  console.log(`sample unknown region items: ${JSON.stringify(report.sampleUnknownRegionItems, null, 2)}`);
}
