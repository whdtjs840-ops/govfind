import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { runBizinfoDryRun } from "./import-bizinfo-dry-run.mjs";

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

function parsePages(value) {
  if (!value) return [];
  return [...new Set(String(value).split(",").map((item) => Number(item.trim())).filter((item) => Number.isInteger(item) && item > 0))];
}

function pageRange({ page, maxPages }) {
  return Array.from({ length: maxPages }, (_, index) => page + index);
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function listReportFiles(directory = "data/imports/bizinfo/reports") {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".report.json"))
    .map((entry) => resolve(directory, entry.name))
    .sort();
}

async function loadReports() {
  const reports = [];
  for (const file of await listReportFiles()) {
    try {
      const report = await readJson(file);
      if (report.sourceName === "bizinfo") reports.push({ ...report, reportFilePath: file });
    } catch {
      // Ignore malformed runtime artifacts.
    }
  }
  return reports;
}

function findCachedReport(reports, { page, limit }) {
  return reports
    .filter((report) => report.status === "success" && Number(report.page) === page && Number(report.limit) === limit)
    .sort((a, b) => String(b.fetchedAt).localeCompare(String(a.fetchedAt)))[0] ?? null;
}

function classificationCount(reports, name) {
  return reports.reduce((sum, report) => sum + Number(report[`${name}Count`] ?? 0), 0);
}

function mergeGapCounts(reports) {
  const gaps = {};
  for (const report of reports) {
    for (const [gap, count] of Object.entries(report.mappingGaps ?? {})) {
      gaps[gap] = (gaps[gap] ?? 0) + Number(count);
    }
  }
  return gaps;
}

function itemReports(report) {
  return Array.isArray(report.itemReports) ? report.itemReports : [];
}

function uniqueItemKey(item) {
  return `${item.sourceItemId ?? ""}::${item.slug ?? ""}::${item.officialUrl ?? ""}`;
}

function successfulPageSummary(report) {
  return {
    page: report.page,
    limit: report.limit,
    totalAvailable: report.totalAvailable,
    rawCount: report.rawCount,
    normalizedCount: report.normalizedCount,
    readyCount: report.readyCount,
    publishableWithWarningCount: report.publishableWithWarningCount,
    needsReviewCount: report.needsReviewCount,
    duplicateCount: report.duplicateCount,
    incompleteCount: report.incompleteCount,
    uniqueNewCandidateCount: report.uniqueNewCandidateCount ?? Number(report.readyCount ?? 0) + Number(report.publishableWithWarningCount ?? 0),
    duplicateCandidatesCount: report.duplicateCandidatesCount
  };
}

function buildAggregateReport({ allReports, pagesTried, pagesSucceeded, pagesFailed, invalidPages, apiQuotaError, currentLimit }) {
  const currentPolicyCount = getPublicPolicies(policies).length;
  const successfulReports = allReports.filter((report) => report.status === "success" && Number(report.limit) === currentLimit);
  const knownPages = [...new Set(successfulReports.map((report) => Number(report.page)).filter(Boolean))].sort((a, b) => a - b);
  const aggregatePagesTried = [...new Set([...knownPages, ...pagesTried])].sort((a, b) => a - b);
  const aggregatePagesSucceeded = [...new Set([...knownPages, ...pagesSucceeded])].sort((a, b) => a - b);
  const totalAvailable = successfulReports.find((report) => Number(report.totalAvailable) > 0)?.totalAvailable ?? null;
  const calculatedTotalPages = totalAvailable ? Math.ceil(totalAvailable / currentLimit) : null;
  const rawCount = successfulReports.reduce((sum, report) => sum + Number(report.rawCount ?? 0), 0);
  const normalizedCount = successfulReports.reduce((sum, report) => sum + Number(report.normalizedCount ?? 0), 0);
  const readyCount = classificationCount(successfulReports, "ready");
  const publishableWithWarningCount = classificationCount(successfulReports, "publishableWithWarning");
  const needsReviewCount = classificationCount(successfulReports, "needsReview");
  const duplicateCount = classificationCount(successfulReports, "duplicate");
  const incompleteCount = classificationCount(successfulReports, "incomplete");
  const duplicateCandidatesCount = successfulReports.reduce((sum, report) => sum + Number(report.duplicateCandidatesCount ?? 0), 0);
  const publishableCandidates = new Map();

  for (const report of successfulReports) {
    for (const item of itemReports(report)) {
      if (!["ready", "publishable_with_warning"].includes(item.classification)) continue;
      if (item.publishPolicy?.canPublish === false) continue;
      publishableCandidates.set(uniqueItemKey(item), item);
    }
  }

  const uniqueNewCandidateCount = publishableCandidates.size || readyCount + publishableWithWarningCount;
  const mappingGaps = mergeGapCounts(successfulReports);
  const categoryGap = Object.keys(mappingGaps).includes("category");
  const recommendedNextAction =
    apiQuotaError || pagesFailed.length
      ? "stop_and_review"
      : uniqueNewCandidateCount >= 300 && !categoryGap
        ? "ready_for_bizinfo_large_apply"
        : categoryGap
          ? "need_mapping_fix"
          : uniqueNewCandidateCount > 0
            ? "need_more_discovery"
            : "move_to_kstartup";

  return {
    runAt: new Date().toISOString(),
    sourceName: "bizinfo",
    currentPolicyCount,
    totalAvailable,
    limit: currentLimit,
    calculatedTotalPages,
    pagesTried: aggregatePagesTried,
    pagesSucceeded: aggregatePagesSucceeded,
    pagesFailed,
    invalidPages,
    apiQuotaError,
    rawCount,
    normalizedCount,
    readyCount,
    publishableWithWarningCount,
    needsReviewCount,
    duplicateCount,
    incompleteCount,
    uniqueNewCandidateCount,
    selectedCount: 0,
    finalPolicyCountPreview: currentPolicyCount,
    expectedPolicyIncrease: 0,
    duplicateCandidatesCount,
    mappingGaps,
    compatibilityIssues: [],
    applyReadiness: uniqueNewCandidateCount >= 200 && !categoryGap ? "candidate_dry_run_required" : "not_ready",
    remainingCandidateCount: uniqueNewCandidateCount,
    duplicateCandidates: successfulReports.flatMap((report) => report.duplicateCandidates ?? []),
    sampleReadyItems: successfulReports.flatMap((report) => report.sampleReadyItems ?? []).slice(0, 5),
    samplePublishableWithWarningItems: successfulReports.flatMap((report) => report.samplePublishableWithWarningItems ?? []).slice(0, 5),
    sampleNeedsReviewItems: successfulReports.flatMap((report) => report.sampleNeedsReviewItems ?? []).slice(0, 5),
    fetchedPageSummaries: successfulReports.map(successfulPageSummary),
    recommendedNextAction
  };
}

async function main() {
  if (!hasFlag("no-env-file")) loadLocalEnv();

  const limit = Number(argValue("limit", process.env.GOVFIND_BIZINFO_PER_PAGE ?? 100));
  const explicitPages = parsePages(argValue("pages"));
  const page = Number(argValue("page", process.env.GOVFIND_BIZINFO_PAGE ?? 1));
  const maxPages = Number(argValue("max-pages", 1));
  const pages = explicitPages.length ? explicitPages : pageRange({ page, maxPages });
  const save = hasFlag("save");
  const resume = hasFlag("resume");
  const noCache = hasFlag("no-cache");
  const outDir = argValue("out-dir", "data/imports/bizinfo");
  const discoveryReportPath = resolve(argValue("report", "data/staging/bizinfo/bizinfo-discovery-and-candidate-report.json"));

  const existingReportsBefore = await loadReports();
  const totalAvailable = existingReportsBefore.find((report) => Number(report.totalAvailable) > 0 && Number(report.limit) === limit)?.totalAvailable ?? null;
  const calculatedTotalPages = totalAvailable ? Math.ceil(totalAvailable / limit) : null;
  const pagesTried = [];
  const pagesSucceeded = [];
  const pagesFailed = [];
  const invalidPages = [];
  let apiQuotaError = false;

  for (const targetPage of pages) {
    pagesTried.push(targetPage);
    if (calculatedTotalPages && targetPage > calculatedTotalPages) {
      invalidPages.push(targetPage);
      console.log(`page ${targetPage}: skipped because total pages is ${calculatedTotalPages}`);
      continue;
    }

    const currentReports = await loadReports();
    const cached = !noCache && (resume || save) ? findCachedReport(currentReports, { page: targetPage, limit }) : null;
    if (cached) {
      pagesSucceeded.push(targetPage);
      console.log(`page ${targetPage}: cache hit`);
      continue;
    }

    const { report } = await runBizinfoDryRun({ page: targetPage, limit, save, outDir });
    if (report.status === "error") {
      pagesFailed.push({ page: targetPage, errorKind: report.errorKind, errorMessage: report.errorMessage });
      if (["quota_exceeded", "service_key_error"].includes(report.errorKind)) apiQuotaError = true;
      console.log(`page ${targetPage}: failed ${report.errorKind ?? "error"}`);
      break;
    }
    pagesSucceeded.push(targetPage);
    console.log(
      `page ${targetPage}: status=${report.status} rawCount=${report.rawCount} normalizedCount=${report.normalizedCount} readyCount=${report.readyCount} publishableWithWarningCount=${report.publishableWithWarningCount} needsReviewCount=${report.needsReviewCount} duplicateCount=${report.duplicateCount} incompleteCount=${report.incompleteCount} uniqueNewCandidateCount=${report.uniqueNewCandidateCount}`
    );
  }

  const allReports = await loadReports();
  const aggregate = buildAggregateReport({
    allReports,
    pagesTried,
    pagesSucceeded,
    pagesFailed,
    invalidPages,
    apiQuotaError,
    currentLimit: limit
  });
  await writeJson(discoveryReportPath, aggregate);

  console.log(`totalAvailable: ${aggregate.totalAvailable}`);
  console.log(`calculatedTotalPages: ${aggregate.calculatedTotalPages}`);
  console.log(`pagesTried: ${JSON.stringify(aggregate.pagesTried)}`);
  console.log(`pagesSucceeded: ${JSON.stringify(aggregate.pagesSucceeded)}`);
  console.log(`apiQuotaError: ${aggregate.apiQuotaError}`);
  console.log(`rawCount: ${aggregate.rawCount}`);
  console.log(`normalizedCount: ${aggregate.normalizedCount}`);
  console.log(`readyCount: ${aggregate.readyCount}`);
  console.log(`publishableWithWarningCount: ${aggregate.publishableWithWarningCount}`);
  console.log(`needsReviewCount: ${aggregate.needsReviewCount}`);
  console.log(`duplicateCount: ${aggregate.duplicateCount}`);
  console.log(`incompleteCount: ${aggregate.incompleteCount}`);
  console.log(`uniqueNewCandidateCount: ${aggregate.uniqueNewCandidateCount}`);
  console.log(`duplicateCandidatesCount: ${aggregate.duplicateCandidatesCount}`);
  console.log(`remainingCandidateCount: ${aggregate.remainingCandidateCount}`);
  console.log(`recommendedNextAction: ${aggregate.recommendedNextAction}`);
  console.log(`discoveryReport: ${discoveryReportPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
