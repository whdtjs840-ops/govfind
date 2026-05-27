import { resolve } from "node:path";
import { Gov24ApiError, gov24BenefitsAdapter } from "./gov24-benefits-adapter.mjs";
import { Gov24DiscoveryError, redactRequestParams } from "./gov24-discovery-runner.mjs";
import { buildStagingPayloadFromRaw, buildStagingReport, timestamp, writeJson } from "./staging-artifacts.mjs";

function emptyCounts() {
  return {
    rawCount: 0,
    normalizedCount: 0,
    readyCount: 0,
    incompleteCount: 0,
    needsReviewCount: 0,
    duplicateCount: 0,
    duplicateCandidatesCount: 0,
    uniqueNewCandidateCount: 0,
    unknownCategoryCount: 0,
    unknownRegionCount: 0,
    missingOfficialUrlOrApplicationUrlCount: 0,
    missingTitleCount: 0,
    missingOrganizationCount: 0,
    statusNeedsConfirmationCount: 0,
    fieldsThatCouldNotBeMapped: {},
    topMappingGap: null,
    classifiedTotal: 0,
    invariantPassed: true,
    sampleReadyItems: [],
    sampleNeedsReviewItems: [],
    sampleIncompleteItems: [],
    sampleDuplicateItems: [],
    sampleDuplicateCandidates: [],
    sampleUnknownRegionItems: [],
    itemReports: []
  };
}

export function buildDiscoveryErrorReport({ error, params, rawPayload = null, outDir = "data/staging/gov24" }) {
  const isDiscoveryError = error instanceof Gov24DiscoveryError;
  const partialRawPayload = rawPayload ?? (isDiscoveryError ? error.partialRawPayload : null);
  const apiError = isDiscoveryError ? error.apiError : error instanceof Gov24ApiError ? error : null;
  const message = error instanceof Error ? error.message : String(error);

  let report;
  if (partialRawPayload?.items?.length) {
    const stagingPayload = buildStagingPayloadFromRaw(partialRawPayload);
    report = buildStagingReport(stagingPayload, partialRawPayload);
    report.status = "partial";
  } else {
    report = {
      status: "error",
      runAt: new Date().toISOString(),
      sourceName: gov24BenefitsAdapter.sourceName,
      adapterName: gov24BenefitsAdapter.sourceName,
      endpointName: "serviceList",
      responseItemArrayPath: "data",
      ...emptyCounts()
    };
  }

  report.status = partialRawPayload?.items?.length ? "partial" : "error";
  report.errorCode = apiError?.code ?? null;
  report.errorKind = apiError?.kind ?? "api_error";
  report.errorMessage = message;
  report.failedAtPage = isDiscoveryError ? error.failedAtPage : null;
  report.pagesRequested = isDiscoveryError ? error.pagesRequested : params.pagesRequested ?? null;
  report.pagesFetched = partialRawPayload?.meta?.pagesFetched ?? report.pagesFetched ?? 0;
  report.lastSuccessfulPage = partialRawPayload?.meta?.lastSuccessfulPage ?? null;
  report.totalAvailable = partialRawPayload?.meta?.totalAvailable ?? report.totalAvailable ?? null;
  report.requestParams = redactRequestParams(params.requestParams ?? params);
  report.responseParsingDiagnosis = [
    "The command did not write a success discovery report.",
    "The API response was treated as an error, not as zero successful items.",
    "Retry after quota resets, use cached pages, or request fewer pages."
  ];
  report.validationReportFilePath = null;
  report.errorReportFilePath = resolve(outDir, "errors", `gov24-discovery-error-${timestamp()}.json`);
  return report;
}

export async function saveDiscoveryErrorReport({ report }) {
  await writeJson(report.errorReportFilePath, report);
  return report.errorReportFilePath;
}
