import { existsSync, readFileSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { runNationalSubsidyDryRun } from "./import-national-subsidy-dry-run.mjs";

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

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function listReportFiles(directory = "data/imports/national-subsidy/reports") {
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
      if (report.sourceName === "national-subsidy") reports.push({ ...report, reportFilePath: file });
    } catch {
      // Ignore malformed runtime artifacts.
    }
  }
  return reports;
}

function findCachedReport(reports, { page, limit }) {
  return reports
    .filter((report) => ["success", "missing_api_key", "api_unavailable"].includes(report.status) && Number(report.page) === page && Number(report.limit) === limit)
    .sort((a, b) => String(b.runAt).localeCompare(String(a.runAt)))[0] ?? null;
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
    uniqueNewCandidateCount: report.uniqueNewCandidateCount
  };
}

function buildAggregateReport({ allReports, pagesTried, pagesSucceeded, pagesFailed, currentLimit }) {
  const currentPolicyCount = getPublicPolicies(policies).length;
  const relevantReports = allReports.filter((report) => Number(report.limit) === currentLimit);
  const successfulReports = relevantReports.filter((report) => report.status === "success");
  const missingKeyReports = relevantReports.filter((report) => report.status === "missing_api_key");
  const apiUnavailableReports = relevantReports.filter((report) => report.status === "api_unavailable");
  const totalAvailable = successfulReports.find((report) => Number(report.totalAvailable) > 0)?.totalAvailable ?? null;
  const calculatedTotalPages = totalAvailable ? Math.ceil(totalAvailable / currentLimit) : null;
  const rawCount = successfulReports.reduce((sum, report) => sum + Number(report.rawCount ?? 0), 0);
  const normalizedCount = successfulReports.reduce((sum, report) => sum + Number(report.normalizedCount ?? 0), 0);
  const readyCount = classificationCount(successfulReports, "ready");
  const publishableWithWarningCount = classificationCount(successfulReports, "publishableWithWarning");
  const needsReviewCount = classificationCount(successfulReports, "needsReview");
  const duplicateCount = classificationCount(successfulReports, "duplicate");
  const incompleteCount = classificationCount(successfulReports, "incomplete");
  const uniqueNewCandidateCount = successfulReports.reduce((sum, report) => sum + Number(report.uniqueNewCandidateCount ?? 0), 0);
  const mappingGaps = mergeGapCounts(successfulReports);

  const recommendedNextAction =
    missingKeyReports.length
      ? "need_api_key"
      : apiUnavailableReports.length || pagesFailed.length
        ? "stop_and_review"
        : Object.keys(mappingGaps).includes("category")
          ? "need_mapping_fix"
          : uniqueNewCandidateCount > 0
            ? "ready_for_national_subsidy_discovery"
            : "not_suitable_for_publish";

  return {
    runAt: new Date().toISOString(),
    sourceName: "national-subsidy",
    currentPolicyCount,
    totalAvailable,
    limit: currentLimit,
    calculatedTotalPages,
    pagesTried,
    pagesSucceeded,
    pagesFailed,
    rawCount,
    normalizedCount,
    readyCount,
    publishableWithWarningCount,
    needsReviewCount,
    duplicateCount,
    incompleteCount,
    uniqueNewCandidateCount,
    mappingGaps,
    pageSummaries: successfulReports.map(successfulPageSummary),
    recommendedNextAction
  };
}

async function main() {
  loadLocalEnv();
  const pages = parsePages(argValue("pages", argValue("page", "1")));
  const limit = Number(argValue("limit", 50));
  const save = hasFlag("save");
  const resume = hasFlag("resume");
  const outDir = argValue("out-dir", "data/imports/national-subsidy");
  const reportsBefore = await loadReports();
  const pagesSucceeded = [];
  const pagesFailed = [];

  for (const page of pages) {
    const cached = resume ? findCachedReport(reportsBefore, { page, limit }) : null;
    if (cached) {
      if (cached.status === "success") pagesSucceeded.push(page);
      else pagesFailed.push({ page, status: cached.status, reason: cached.errorKind ?? cached.status });
      continue;
    }
    const { report } = await runNationalSubsidyDryRun({ page, limit, save, outDir });
    if (report.status === "success") pagesSucceeded.push(page);
    else pagesFailed.push({ page, status: report.status, reason: report.errorKind ?? report.status });
    if (report.status === "missing_api_key" || report.errorKind === "quota_exceeded") break;
  }

  const allReports = await loadReports();
  const aggregate = buildAggregateReport({ allReports, pagesTried: pages, pagesSucceeded, pagesFailed, currentLimit: limit });
  await writeJson("data/staging/national-subsidy/national-subsidy-discovery-report.json", aggregate);

  console.log("National subsidy discovery");
  console.log(`pagesSucceeded: ${aggregate.pagesSucceeded.join(",") || "(none)"}`);
  console.log(`rawCount: ${aggregate.rawCount}`);
  console.log(`normalizedCount: ${aggregate.normalizedCount}`);
  console.log(`readyCount: ${aggregate.readyCount}`);
  console.log(`publishableWithWarningCount: ${aggregate.publishableWithWarningCount}`);
  console.log(`needsReviewCount: ${aggregate.needsReviewCount}`);
  console.log(`duplicateCount: ${aggregate.duplicateCount}`);
  console.log(`incompleteCount: ${aggregate.incompleteCount}`);
  console.log(`uniqueNewCandidateCount: ${aggregate.uniqueNewCandidateCount}`);
  console.log(`recommendedNextAction: ${aggregate.recommendedNextAction}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

