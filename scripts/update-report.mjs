import { buildUpdateCheckReport, readJson, writeJson } from "./importers/update-check-utils.mjs";

const REPORT_PATH = "data/staging/automation/update-report.json";

const sourceConfigs = [
  {
    sourceName: "gov24",
    reportPath: "data/staging/automation/update-gov24-check-report.json",
    applyDryRunCommand: (count) => `npm.cmd run promote:gov24:apply:dry-run -- --limit=${count}`,
    fetchCommand: "npm.cmd run discover:gov24 -- --pages=<page> --limit=100 --save --resume"
  },
  {
    sourceName: "bokjiro-central",
    reportPath: "data/staging/automation/update-bokjiro-central-check-report.json",
    applyDryRunCommand: (count) => `npm.cmd run promote:bokjiro-central:apply:dry-run -- --limit=${count}`,
    fetchCommand: "npm.cmd run discover:bokjiro-central -- --pages=<page> --limit=50 --save --resume"
  }
];

async function readSourceReports() {
  const reports = [];
  const missingSources = [];

  for (const config of sourceConfigs) {
    try {
      const report = await readJson(config.reportPath);
      reports.push({ config, report });
    } catch (error) {
      missingSources.push({
        sourceName: config.sourceName,
        reportPath: config.reportPath,
        reason: error instanceof Error ? error.message : String(error)
      });
    }
  }

  return { reports, missingSources };
}

function topReasons(report) {
  const reasons = [];
  const summary = report.summary ?? {};
  if ((summary.safeToApplyCount ?? 0) > 0) reasons.push(`${summary.safeToApplyCount} cache-only safe candidates available`);
  if ((summary.needsReviewCount ?? 0) > 0) reasons.push(`${summary.needsReviewCount} items need review`);
  if ((summary.duplicateCandidateCount ?? 0) > 0) reasons.push(`${summary.duplicateCandidateCount} duplicate candidates detected`);
  if ((summary.blockedItemCount ?? 0) > 0) reasons.push(`${summary.blockedItemCount} blocked items`);
  if (report.recommendedAction === "fetch_required") reasons.push("cache has no remaining safe candidate; fetch/discovery required");
  if (report.recommendedAction === "stop_and_review") reasons.push("source error or quota error requires review");
  return reasons;
}

function summarizeSource({ config, report }) {
  const summary = report.summary ?? {};
  return {
    sourceName: report.sourceName ?? config.sourceName,
    mode: report.mode ?? "unknown",
    currentSourcePolicyCount: report.currentSourcePolicyCount ?? 0,
    newCandidateCount: summary.newCandidateCount ?? 0,
    updateCandidateCount: summary.updateCandidateCount ?? 0,
    duplicateCandidateCount: summary.duplicateCandidateCount ?? 0,
    needsReviewCount: summary.needsReviewCount ?? 0,
    safeToApplyCount: summary.safeToApplyCount ?? 0,
    recommendedAction: report.recommendedAction ?? "stop_and_review",
    topReasons: topReasons(report),
    reportPath: config.reportPath
  };
}

function sourceNamesByAction(sourceReports, action) {
  return sourceReports
    .filter((source) => source.recommendedAction === action)
    .map((source) => source.sourceName);
}

function buildHumanApprovalQueue(sourceReports) {
  return sourceReports.flatMap((source) => {
    const config = sourceConfigs.find((item) => item.sourceName === source.sourceName);
    if (!config) return [];

    if (source.safeToApplyCount > 0) {
      return [{
        sourceName: source.sourceName,
        candidateCount: source.safeToApplyCount,
        reason: "cache-only safe candidates available",
        nextCommandSuggestion: config.applyDryRunCommand(source.safeToApplyCount)
      }];
    }

    if (source.recommendedAction === "fetch_required") {
      return [{
        sourceName: source.sourceName,
        candidateCount: 0,
        reason: "fetch required",
        nextCommandSuggestion: config.fetchCommand
      }];
    }

    if (source.needsReviewCount > 0) {
      return [{
        sourceName: source.sourceName,
        candidateCount: source.needsReviewCount,
        reason: "manual review required before apply dry-run",
        nextCommandSuggestion: `Open ${source.reportPath} and review needsReview items`
      }];
    }

    return [];
  });
}

function decideRecommendedNextAction({ totalSafeToApplyCount, totalNeedsReviewCount, fetchRequiredSources, sourceReports }) {
  if (totalSafeToApplyCount > 0) return "ready_for_apply_dry_run";
  if (fetchRequiredSources.length) return "fetch_required";
  if (totalNeedsReviewCount > 0) return "needs_review";
  if (sourceReports.some((source) => source.recommendedAction === "stop_and_review")) return "stop_and_review";
  return "no_action";
}

async function main() {
  const { reports, missingSources } = await readSourceReports();
  const sourceReports = reports.map(summarizeSource);

  const totalNewCandidateCount = sourceReports.reduce((sum, source) => sum + source.newCandidateCount, 0);
  const totalUpdateCandidateCount = sourceReports.reduce((sum, source) => sum + source.updateCandidateCount, 0);
  const totalDuplicateCandidateCount = sourceReports.reduce((sum, source) => sum + source.duplicateCandidateCount, 0);
  const totalNeedsReviewCount = sourceReports.reduce((sum, source) => sum + source.needsReviewCount, 0);
  const totalSafeToApplyCount = sourceReports.reduce((sum, source) => sum + source.safeToApplyCount, 0);
  const currentPolicyCount = Math.max(...sourceReports.map((source) => reports.find((entry) => entry.report.sourceName === source.sourceName)?.report.currentPolicyCount ?? 0), 0);
  const fetchRequiredSources = sourceNamesByAction(sourceReports, "fetch_required");
  const readyForApplyDryRunSources = sourceReports
    .filter((source) => source.safeToApplyCount > 0 || source.recommendedAction === "ready_for_apply_dry_run")
    .map((source) => source.sourceName);
  const noActionSources = sourceNamesByAction(sourceReports, "no_action");
  const blockedSources = sourceReports
    .filter((source) => source.recommendedAction === "stop_and_review")
    .map((source) => source.sourceName);
  const humanApprovalQueue = buildHumanApprovalQueue(sourceReports);
  const recommendedNextAction = decideRecommendedNextAction({
    totalSafeToApplyCount,
    totalNeedsReviewCount,
    fetchRequiredSources,
    sourceReports
  });
  const recommendedNextCommands = humanApprovalQueue.map((item) => item.nextCommandSuggestion);

  const report = {
    runAt: new Date().toISOString(),
    currentPolicyCount,
    sources: sourceReports.map((source) => source.sourceName),
    missingSources,
    sourceReports,
    aggregateSummary: {
      totalNewCandidateCount,
      totalUpdateCandidateCount,
      totalDuplicateCandidateCount,
      totalNeedsReviewCount,
      totalSafeToApplyCount,
      fetchRequiredSources,
      readyForApplyDryRunSources,
      noActionSources,
      blockedSources
    },
    humanApprovalQueue,
    fetchRequiredSources,
    recommendedNextAction,
    recommendedNextCommands
  };

  await writeJson(REPORT_PATH, report);

  console.log("Integrated update report");
  console.log(`report path: ${REPORT_PATH}`);
  console.log(`currentPolicyCount: ${report.currentPolicyCount}`);
  console.log(`totalNewCandidateCount: ${totalNewCandidateCount}`);
  console.log(`totalUpdateCandidateCount: ${totalUpdateCandidateCount}`);
  console.log(`totalDuplicateCandidateCount: ${totalDuplicateCandidateCount}`);
  console.log(`totalNeedsReviewCount: ${totalNeedsReviewCount}`);
  console.log(`totalSafeToApplyCount: ${totalSafeToApplyCount}`);
  console.log(`fetchRequiredSources: ${fetchRequiredSources.join(", ") || "(none)"}`);
  console.log(`readyForApplyDryRunSources: ${readyForApplyDryRunSources.join(", ") || "(none)"}`);
  console.log(`recommendedNextAction: ${recommendedNextAction}`);
  console.log(`recommendedNextCommands: ${JSON.stringify(recommendedNextCommands, null, 2)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
