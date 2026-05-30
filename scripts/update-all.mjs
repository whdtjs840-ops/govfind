import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { statSync, existsSync } from "node:fs";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { readJson, writeJson } from "./importers/update-check-utils.mjs";

const REPORT_PATH = "data/staging/automation/update-all-report.json";
const SEARCH_INDEX_PATH = "dist/search-index.json";

const sourceConfigs = [
  {
    sourceName: "gov24",
    checkScript: "scripts/update-gov24-check.mjs",
    reportPath: "data/staging/automation/update-gov24-check-report.json",
    sourceMatcher: (source) => source.includes("정부24"),
    fetchCommand: "npm.cmd run discover:gov24 -- --pages=<pages> --limit=100 --save --resume",
    dryRunCommand: (count) => `npm.cmd run update:apply:dry-run -- --source=gov24 --limit=${count || 100}`
  },
  {
    sourceName: "bokjiro-central",
    checkScript: "scripts/update-bokjiro-central-check.mjs",
    reportPath: "data/staging/automation/update-bokjiro-central-check-report.json",
    sourceMatcher: (source) => source.includes("복지로 중앙부처"),
    fetchCommand: "npm.cmd run discover:bokjiro-central -- --pages=<pages> --limit=50 --save --resume",
    dryRunCommand: (count) => `npm.cmd run update:apply:dry-run -- --source=bokjiro-central --limit=${count || 100}`
  },
  {
    sourceName: "bokjiro-local",
    checkScript: "scripts/update-bokjiro-local-check.mjs",
    reportPath: "data/staging/automation/update-bokjiro-local-check-report.json",
    sourceMatcher: (source) => source.includes("복지로 지자체복지"),
    fetchCommand: "npm.cmd run discover:bokjiro-local -- --pages=<pages> --limit=50 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:bokjiro-local:apply:dry-run -- --limit=${count || 500}`
  },
  {
    sourceName: "ontong-youth",
    checkScript: "scripts/update-ontong-youth-check.mjs",
    reportPath: "data/staging/automation/update-ontong-youth-check-report.json",
    sourceMatcher: (source) => source.includes("온통청년"),
    fetchCommand: "npm.cmd run discover:ontong-youth -- --pages=<pages> --limit=50 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:ontong-youth:apply:dry-run -- --limit=${count || 300}`
  },
  {
    sourceName: "bizinfo",
    checkScript: "scripts/update-bizinfo-check.mjs",
    reportPath: "data/staging/automation/update-bizinfo-check-report.json",
    sourceMatcher: (source) => source.includes("기업마당"),
    fetchCommand: "npm.cmd run discover:bizinfo -- --pages=<pages> --limit=100 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:bizinfo:apply:dry-run -- --limit=${count || 500}`
  },
  {
    sourceName: "kstartup",
    checkScript: "scripts/update-kstartup-check.mjs",
    reportPath: "data/staging/automation/update-kstartup-check-report.json",
    sourceMatcher: (source) => source.includes("K-Startup"),
    fetchCommand: "npm.cmd run discover:kstartup -- --pages=<pages> --limit=100 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:kstartup:apply:dry-run -- --limit=${count || 1000}`
  }
];

function commandName() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

function runCheckScript(config) {
  if (!config.checkScript) {
    return {
      ok: false,
      skipped: true,
      reason: "not_integrated_into_update_check"
    };
  }

  const result = spawnSync(`${commandName()} tsx ${config.checkScript}`, {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
    shell: true
  });

  if (result.status === 0) return { ok: true };

  return {
    ok: false,
    skipped: false,
    reason: "check_failed",
    exitCode: result.status,
    signal: result.signal,
    errorMessage: result.error?.message ?? null,
    stderrSummary: summarizeProcessOutput(result.stderr),
    stdoutSummary: summarizeProcessOutput(result.stdout)
  };
}

function summarizeProcessOutput(value = "") {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
}

function sourceCount(publicPolicies, config) {
  return publicPolicies.filter((policy) => config.sourceMatcher(policy.source ?? "")).length;
}

async function searchIndexCount(publicPolicies) {
  try {
    const payload = JSON.parse(await readFile("dist/search-index.json", "utf8"));
    return payload.count ?? payload.items?.length ?? publicPolicies.length;
  } catch {
    return publicPolicies.length;
  }
}

async function searchIndexMetadata(publicPolicies) {
  try {
    const payload = JSON.parse(await readFile(SEARCH_INDEX_PATH, "utf8"));
    const itemLength = Array.isArray(payload.items) ? payload.items.length : null;
    return {
      count: payload.count ?? itemLength ?? publicPolicies.length,
      itemLength,
      bytes: existsSync(SEARCH_INDEX_PATH) ? statSync(SEARCH_INDEX_PATH).size : null,
      path: SEARCH_INDEX_PATH,
      available: true
    };
  } catch {
    return {
      count: publicPolicies.length,
      itemLength: publicPolicies.length,
      bytes: null,
      path: SEARCH_INDEX_PATH,
      available: false
    };
  }
}

function candidateStatusFromReport(report) {
  const summary = report.summary ?? {};
  if ((report.sourceErrors ?? []).length || (report.quotaErrors ?? []).length) return "error";
  if ((summary.safeToApplyCount ?? 0) > 0) return "ready_for_dry_run";
  if ((summary.needsReviewCount ?? 0) > 0 || (summary.blockedItemCount ?? 0) > 0) return "needs_review";
  if (report.recommendedAction === "fetch_required") return "fetch_required";
  return report.recommendedAction ?? "no_action";
}

function summarizeIntegratedReport(config, report, currentSourceCount) {
  const summary = report.summary ?? {};
  const safeToApplyCount = summary.safeToApplyCount ?? 0;
  const status = candidateStatusFromReport(report);
  let nextCommandSuggestion = config.fetchCommand;
  if (safeToApplyCount > 0) {
    nextCommandSuggestion = config.dryRunCommand(safeToApplyCount);
  } else if (status === "needs_review") {
    nextCommandSuggestion = `Open ${config.reportPath} and review needsReview or blocked items`;
  }

  return {
    sourceName: config.sourceName,
    status,
    currentSourceCount,
    newCandidateCount: summary.newCandidateCount ?? 0,
    safeToApplyCount,
    duplicateCandidateCount: summary.duplicateCandidateCount ?? 0,
    needsReviewCount: summary.needsReviewCount ?? 0,
    recommendedAction: report.recommendedAction ?? "no_action",
    nextCommandSuggestion,
    reportPath: config.reportPath ?? null,
    mode: report.mode ?? "unknown"
  };
}

function summarizeNotIntegratedSource(config, currentSourceCount) {
  return {
    sourceName: config.sourceName,
    status: "not_integrated_into_update_check",
    currentSourceCount,
    newCandidateCount: 0,
    safeToApplyCount: 0,
    duplicateCandidateCount: 0,
    needsReviewCount: 0,
    recommendedAction: "manual_source_dry_run_required",
    nextCommandSuggestion: config.fetchCommand,
    reportPath: null,
    mode: "cache-only-status"
  };
}

function decideRecommendedNextAction({ totalSafeToApplyCount, fetchRequiredSources, blockedSources, sourceErrors }) {
  if (sourceErrors.length) return "needs_review";
  if (blockedSources.length) return "needs_review";
  if (totalSafeToApplyCount >= 300) return "ready_for_large_batch_dry_run";
  if (totalSafeToApplyCount >= 50) return "ready_for_medium_batch_dry_run";
  if (fetchRequiredSources.length) return "fetch_required";
  return "no_action";
}

async function main() {
  const fetchRequested = hasFlag("fetch");
  const publicPolicies = getPublicPolicies(policies);
  const currentPolicyCount = publicPolicies.length;
  const searchIndex = await searchIndexMetadata(publicPolicies);
  const currentSearchIndexCount = searchIndex.count;
  const countMismatchDetected = currentPolicyCount !== currentSearchIndexCount || searchIndex.itemLength !== currentSearchIndexCount;
  const sourceErrors = [];
  const sources = [];

  for (const config of sourceConfigs) {
    const currentSourceCount = sourceCount(publicPolicies, config);

    if (fetchRequested) {
      sources.push({
        ...summarizeNotIntegratedSource(config, currentSourceCount),
        status: "fetch_option_not_implemented",
        recommendedAction: "run_explicit_source_discovery",
        nextCommandSuggestion: config.fetchCommand
      });
      continue;
    }

    const checkResult = runCheckScript(config);
    if (checkResult.ok) {
      try {
        const report = await readJson(config.reportPath);
        sources.push(summarizeIntegratedReport(config, report, currentSourceCount));
      } catch (error) {
        sourceErrors.push({
          sourceName: config.sourceName,
          status: "report_read_failed",
          reportPath: config.reportPath,
          message: error instanceof Error ? error.message : String(error)
        });
        sources.push({
          ...summarizeNotIntegratedSource(config, currentSourceCount),
          status: "report_read_failed",
          recommendedAction: "needs_review"
        });
      }
    } else if (checkResult.skipped) {
      sources.push(summarizeNotIntegratedSource(config, currentSourceCount));
    } else {
      sourceErrors.push({
        sourceName: config.sourceName,
        status: checkResult.reason,
        exitCode: checkResult.exitCode,
        signal: checkResult.signal,
        stderrSummary: checkResult.stderrSummary,
        stdoutSummary: checkResult.stdoutSummary
      });
      sources.push({
        ...summarizeNotIntegratedSource(config, currentSourceCount),
        status: "check_failed",
        recommendedAction: "needs_review"
      });
    }
  }

  const totalNewCandidateCount = sources.reduce((sum, source) => sum + source.newCandidateCount, 0);
  const totalSafeToApplyCount = sources.reduce((sum, source) => sum + source.safeToApplyCount, 0);
  const totalDuplicateCandidateCount = sources.reduce((sum, source) => sum + source.duplicateCandidateCount, 0);
  const totalNeedsReviewCount = sources.reduce((sum, source) => sum + source.needsReviewCount, 0);
  const fetchRequiredSources = sources
    .filter((source) => ["fetch_required", "not_integrated_into_update_check", "manual_source_dry_run_required"].includes(source.status))
    .map((source) => source.sourceName);
  const readyForDryRunSources = sources
    .filter((source) => source.safeToApplyCount > 0 || source.status === "ready_for_dry_run")
    .map((source) => source.sourceName);
  const blockedSources = sources
    .filter((source) => ["needs_review", "check_failed", "report_read_failed"].includes(source.status))
    .map((source) => source.sourceName);
  const recommendedNextAction = decideRecommendedNextAction({
    totalSafeToApplyCount,
    fetchRequiredSources,
    blockedSources,
    sourceErrors
  });
  const recommendedNextCommands = sources
    .filter((source) => source.nextCommandSuggestion)
    .map((source) => ({
      sourceName: source.sourceName,
      command: source.nextCommandSuggestion
    }));

  const report = {
    runAt: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    mode: fetchRequested ? "fetch-requested-no-api-call" : "cache-only",
    apiFetchEnabled: false,
    countSource: searchIndex.available ? "source-of-truth-policies-and-dist-search-index" : "source-of-truth-policies",
    reportFreshness: {
      generatedAt: new Date().toISOString(),
      maxAgeMs: null,
      isStaleByAge: false
    },
    staleReportDetected: false,
    countMismatchDetected,
    currentPolicyCount,
    searchIndexCount: currentSearchIndexCount,
    searchIndexItemLength: searchIndex.itemLength,
    searchIndexSizeBytes: searchIndex.bytes,
    searchIndexPath: searchIndex.path,
    sources,
    totalNewCandidateCount,
    totalSafeToApplyCount,
    totalDuplicateCandidateCount,
    totalNeedsReviewCount,
    fetchRequiredSources,
    readyForDryRunSources,
    blockedSources,
    sourceErrors,
    recommendedNextAction,
    recommendedNextCommands,
    notes: [
      "update:all is cache-only by default and does not call source APIs.",
      "Sources without integrated update checks are listed with manual discovery or dry-run suggestions.",
      "Any real apply still requires source-specific dry-run, human approval, local QA, build, deploy, and production QA."
    ]
  };

  await writeJson(REPORT_PATH, report);

  console.log("All-source update report");
  console.log(`report path: ${REPORT_PATH}`);
  console.log(`mode: ${report.mode}`);
  console.log(`currentPolicyCount: ${currentPolicyCount}`);
  console.log(`searchIndexCount: ${currentSearchIndexCount}`);
  for (const source of sources) {
    console.log(`${source.sourceName}: status=${source.status}, current=${source.currentSourceCount}, new=${source.newCandidateCount}, safe=${source.safeToApplyCount}, duplicate=${source.duplicateCandidateCount}, needsReview=${source.needsReviewCount}`);
  }
  console.log(`totalNewCandidateCount: ${totalNewCandidateCount}`);
  console.log(`totalSafeToApplyCount: ${totalSafeToApplyCount}`);
  console.log(`fetchRequiredSources: ${fetchRequiredSources.join(", ") || "(none)"}`);
  console.log(`readyForDryRunSources: ${readyForDryRunSources.join(", ") || "(none)"}`);
  console.log(`blockedSources: ${blockedSources.join(", ") || "(none)"}`);
  console.log(`sourceErrors: ${sourceErrors.length}`);
  console.log(`recommendedNextAction: ${recommendedNextAction}`);
  console.log(`recommendedNextCommands: ${JSON.stringify(recommendedNextCommands, null, 2)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
