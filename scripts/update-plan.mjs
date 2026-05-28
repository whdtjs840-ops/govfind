import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { readJson, writeJson } from "./importers/update-check-utils.mjs";

const UPDATE_ALL_REPORT_PATH = "data/staging/automation/update-all-report.json";
const REPORT_PATH = "data/staging/automation/update-plan-report.json";

const sourcePriority = ["bizinfo", "kstartup", "ontong-youth", "bokjiro-local", "bokjiro-central", "gov24"];

const discoveryReportPaths = {
  gov24: [
    "data/staging/gov24/discovery-report.json",
    "data/staging/gov24/gov24-batch-4-discovery-report.json",
    "data/staging/gov24/gov24-batch-4-pagination-discovery-report.json"
  ],
  "bokjiro-central": [
    "data/staging/bokjiro-central/discovery-report.json",
    "data/staging/bokjiro-central/bokjiro-central-additional-discovery-report.json",
    "data/staging/bokjiro-central/bokjiro-central-additional-discovery-report-batch-3.json",
    "data/staging/bokjiro-central/bokjiro-central-remaining-pages-discovery-report.json"
  ],
  "bokjiro-local": ["data/staging/bokjiro-local/bokjiro-local-discovery-report.json"],
  "ontong-youth": ["data/staging/ontong-youth/ontong-youth-discovery-report.json"],
  bizinfo: ["data/staging/bizinfo/bizinfo-discovery-and-candidate-report.json"],
  kstartup: ["data/staging/kstartup/kstartup-discovery-and-candidate-report.json"]
};

const sourceStability = {
  bizinfo: "high",
  kstartup: "high",
  "ontong-youth": "medium-high",
  "bokjiro-local": "medium-high",
  "bokjiro-central": "medium",
  gov24: "medium"
};

const expectedImpact = {
  bizinfo: "small-business, SME, policy fund, export, and technology support expansion",
  kstartup: "startup, commercialization, startup education, and investment support expansion",
  "ontong-youth": "youth employment, housing, and education policy reinforcement",
  "bokjiro-local": "local welfare service reinforcement",
  "bokjiro-central": "central welfare service reinforcement",
  gov24: "public service and Gov24 policy reinforcement"
};

const discoveryCommands = {
  bizinfo: "npm.cmd run discover:bizinfo -- --pages=<next-pages> --limit=100 --save --resume",
  kstartup: "npm.cmd run discover:kstartup -- --pages=<next-pages> --limit=100 --save --resume",
  "ontong-youth": "npm.cmd run discover:ontong-youth -- --pages=<next-pages> --limit=50 --save --resume",
  "bokjiro-local": "npm.cmd run discover:bokjiro-local -- --pages=<next-pages> --limit=50 --save --resume",
  "bokjiro-central": "npm.cmd run discover:bokjiro-central -- --pages=<next-pages> --limit=50 --save --resume",
  gov24: "npm.cmd run discover:gov24 -- --pages=<next-pages> --limit=100 --save --resume"
};

const dryRunCommands = {
  bizinfo: (count) => [
    `npm.cmd run promote:bizinfo:dry-run -- --limit=${count}`,
    `npm.cmd run promote:bizinfo:generate -- --limit=${count}`,
    `npm.cmd run promote:bizinfo:apply:dry-run -- --limit=${count}`
  ],
  kstartup: (count) => [
    `npm.cmd run promote:kstartup:dry-run -- --limit=${count}`,
    `npm.cmd run promote:kstartup:generate -- --limit=${count}`,
    `npm.cmd run promote:kstartup:apply:dry-run -- --limit=${count}`
  ],
  "ontong-youth": (count) => [
    `npm.cmd run promote:ontong-youth:dry-run -- --limit=${count}`,
    `npm.cmd run promote:ontong-youth:generate -- --limit=${count}`,
    `npm.cmd run promote:ontong-youth:apply:dry-run -- --limit=${count}`
  ],
  "bokjiro-local": (count) => [
    `npm.cmd run promote:bokjiro-local:dry-run -- --limit=${count}`,
    `npm.cmd run promote:bokjiro-local:generate -- --limit=${count}`,
    `npm.cmd run promote:bokjiro-local:apply:dry-run -- --limit=${count}`
  ],
  "bokjiro-central": (count) => [
    `npm.cmd run promote:bokjiro-central:dry-run -- --limit=${count}`,
    `npm.cmd run promote:bokjiro-central:generate -- --limit=${count}`,
    `npm.cmd run promote:bokjiro-central:apply:dry-run -- --limit=${count}`
  ],
  gov24: (count) => [
    `npm.cmd run promote:gov24:dry-run -- --limit=${count}`,
    `npm.cmd run promote:gov24:generate -- --limit=${count}`,
    `npm.cmd run promote:gov24:apply:dry-run -- --limit=${count}`
  ]
};

function priorityRank(sourceName) {
  const index = sourcePriority.indexOf(sourceName);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function sortByPriorityAndCount(a, b) {
  if (b.safeToApplyCount !== a.safeToApplyCount) return b.safeToApplyCount - a.safeToApplyCount;
  return priorityRank(a.sourceName) - priorityRank(b.sourceName);
}

function runUpdateAllIfMissing() {
  if (existsSync(UPDATE_ALL_REPORT_PATH)) return false;

  const result = spawnSync("npm.cmd run update:all", {
    cwd: process.cwd(),
    env: process.env,
    encoding: "utf8",
    shell: true
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").split(/\r?\n/).slice(-12).join("\n");
    throw new Error(`update:all failed while preparing update:plan\n${output}`);
  }

  return true;
}

function numberOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function pageNumbersFrom(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (Number.isInteger(item)) return item;
      if (Number.isInteger(item?.page)) return item.page;
      return null;
    })
    .filter((page) => Number.isInteger(page) && page > 0);
}

function uniqueSorted(values) {
  return [...new Set(values)].sort((a, b) => a - b);
}

function newestReport(reports) {
  return [...reports].sort((a, b) => {
    const aTime = Date.parse(a.report.runAt ?? "") || 0;
    const bTime = Date.parse(b.report.runAt ?? "") || 0;
    return bTime - aTime;
  })[0] ?? null;
}

async function buildSourceExhaustionSummary(sourceName, sourceSummary) {
  const reportPaths = discoveryReportPaths[sourceName] ?? [];
  const loadedReports = [];

  for (const path of reportPaths) {
    try {
      loadedReports.push({ path, report: await readJson(path) });
    } catch {
      // Missing historical reports are expected for some sources.
    }
  }

  const fetchedPages = uniqueSorted(
    loadedReports.flatMap(({ report }) => [
      ...pageNumbersFrom(report.pagesSucceeded),
      ...pageNumbersFrom(report.pagesFetched),
      ...pageNumbersFrom(report.pagesRequested),
      ...pageNumbersFrom(report.pages),
      ...pageNumbersFrom(report.pageMetadata),
      ...pageNumbersFrom(report.rawPayload?.meta?.pages)
    ])
  );
  const totalPagesCandidates = loadedReports
    .map(({ report }) => numberOrNull(report.calculatedTotalPages ?? report.rawPayload?.meta?.calculatedTotalPages))
    .filter((value) => value !== null);
  const totalPages = totalPagesCandidates.length ? Math.max(...totalPagesCandidates) : null;
  const remainingPageList = totalPages
    ? Array.from({ length: totalPages }, (_, index) => index + 1).filter((page) => !fetchedPages.includes(page))
    : null;
  const remainingValidPages = remainingPageList ? remainingPageList.length : null;
  const sourceExhausted = totalPages !== null && remainingValidPages === 0;
  const latest = newestReport(loadedReports);

  let recommendedAction = sourceSummary.recommendedAction;
  let reason = "No discovery pagination metadata was found.";
  if (sourceExhausted) {
    recommendedAction = sourceSummary.safeToApplyCount > 0 ? "dry_run_available_after_exhaustion" : "exhausted";
    reason = `All known pages have been fetched (${fetchedPages.length}/${totalPages}); do not recommend discovery.`;
  } else if (totalPages !== null) {
    reason = `${remainingValidPages} of ${totalPages} known pages remain unfetched.`;
  } else if (sourceSummary.needsReview) {
    recommendedAction = "review_needed";
    reason = "Discovery total pages are unknown and the source currently needs review.";
  } else if (sourceSummary.fetchRequired) {
    reason = "Discovery total pages are unknown; fetch_required can only be used with explicit operator approval.";
  }

  return {
    sourceName,
    totalPages,
    fetchedPages,
    remainingValidPages,
    remainingPageSample: remainingPageList ? remainingPageList.slice(0, 20) : null,
    sourceExhausted,
    lastDiscoveryResult: latest
      ? {
          reportPath: latest.path,
          runAt: latest.report.runAt ?? null,
          pagesTried: latest.report.pagesTried ?? latest.report.pagesRequested ?? null,
          pagesSucceeded: latest.report.pagesSucceeded ?? null,
          rawCount: latest.report.rawCount ?? null,
          normalizedCount: latest.report.normalizedCount ?? null,
          uniqueNewCandidateCount: latest.report.uniqueNewCandidateCount ?? null,
          selectedCount: latest.report.selectedCount ?? null,
          recommendedNextAction: latest.report.recommendedNextAction ?? null,
          quotaError: latest.report.quotaError ?? false
        }
      : null,
    remainingCandidateCount: sourceSummary.safeToApplyCount,
    safeToApplyCount: sourceSummary.safeToApplyCount,
    needsReviewCount: sourceSummary.needsReviewCount,
    recommendedAction,
    reason
  };
}

function toSourceSummary(source, exhaustion = null) {
  const safeToApplyCount = Number(source.safeToApplyCount ?? 0);
  const status = source.status ?? "unknown";
  const needsReviewCount = Number(source.needsReviewCount ?? 0);
  const isFetchRequired = status === "fetch_required" && exhaustion?.sourceExhausted !== true;
  const isNeedsReview = status === "needs_review" || needsReviewCount > 0;
  const isBlocked = ["needs_review", "check_failed", "report_read_failed"].includes(status);
  const effectiveStatus = exhaustion?.sourceExhausted && safeToApplyCount === 0 ? "exhausted" : status;
  const recommendedAction = isNeedsReview
    ? "review_needed"
    : exhaustion?.sourceExhausted && safeToApplyCount === 0
      ? "exhausted"
      : source.recommendedAction ?? "unknown";

  return {
    sourceName: source.sourceName,
    status: effectiveStatus,
    currentSourceCount: Number(source.currentSourceCount ?? 0),
    newCandidateCount: Number(source.newCandidateCount ?? 0),
    safeToApplyCount,
    duplicateCandidateCount: Number(source.duplicateCandidateCount ?? 0),
    needsReviewCount,
    fetchRequired: isFetchRequired,
    needsReview: isNeedsReview,
    blocked: isBlocked,
    sourceExhausted: Boolean(exhaustion?.sourceExhausted),
    remainingValidPages: exhaustion?.remainingValidPages ?? null,
    sourceStability: sourceStability[source.sourceName] ?? "unknown",
    expectedImpact: expectedImpact[source.sourceName] ?? "unknown",
    recommendedAction,
    nextCommandSuggestion: source.nextCommandSuggestion ?? null
  };
}

function applyReviewCommands(sourceName, selectedCount) {
  return [
    ...dryRunCommands[sourceName](selectedCount),
    "Review the source-specific dry-run report before any apply.",
    "Run the source-specific apply command only after human approval and only with --confirm."
  ];
}

function choosePlan({ sourceSummaries, sourceErrors }) {
  const errorSources = sourceErrors.map((error) => error.sourceName).filter(Boolean);
  const blockedSources = sourceSummaries
    .filter((source) => source.blocked)
    .map((source) => source.sourceName);
  const needsReviewSources = sourceSummaries
    .filter((source) => source.needsReview)
    .map((source) => source.sourceName);
  const eligibleSources = sourceSummaries.filter((source) => !source.blocked && !source.needsReview);
  const largeReadySources = eligibleSources.filter((source) => source.safeToApplyCount >= 300).sort(sortByPriorityAndCount);
  const mediumReadySources = eligibleSources.filter((source) => source.safeToApplyCount >= 50).sort(sortByPriorityAndCount);
  const fetchCandidates = eligibleSources
    .filter((source) => !source.sourceExhausted && (source.fetchRequired || source.status === "fetch_required") && source.remainingValidPages !== 0)
    .sort((a, b) => priorityRank(a.sourceName) - priorityRank(b.sourceName));

  if (errorSources.length) {
    return {
      recommendedNextSource: null,
      recommendedMode: "no-action",
      reason: `Source check errors exist: ${errorSources.join(", ")}. Review errors before discovery or dry-run.`,
      suggestedCommands: ["npm.cmd run update:all", "Open data/staging/automation/update-all-report.json and review sourceErrors."],
      blockedSources,
      needsReviewSources,
      finalDecision: "need_review"
    };
  }

  if (largeReadySources.length) {
    const selected = largeReadySources[0];
    return {
      recommendedNextSource: selected.sourceName,
      recommendedMode: "dry-run",
      reason: `${selected.sourceName} has ${selected.safeToApplyCount} safe cache candidates and ${selected.sourceStability} pipeline stability, enough for a large dry-run.`,
      suggestedCommands: applyReviewCommands(selected.sourceName, Math.min(selected.safeToApplyCount, 1000)),
      blockedSources,
      needsReviewSources,
      finalDecision: "ready_for_next_large_batch"
    };
  }

  if (mediumReadySources.length) {
    const selected = mediumReadySources[0];
    return {
      recommendedNextSource: selected.sourceName,
      recommendedMode: "dry-run",
      reason: `${selected.sourceName} has ${selected.safeToApplyCount} safe candidates, but it is below the large-batch threshold. Run dry-run only if a medium batch is worth reviewing now.`,
      suggestedCommands: applyReviewCommands(selected.sourceName, selected.safeToApplyCount),
      blockedSources,
      needsReviewSources,
      finalDecision: "need_review"
    };
  }

  if (fetchCandidates.length) {
    const selected = fetchCandidates[0];
    return {
      recommendedNextSource: selected.sourceName,
      recommendedMode: "discovery",
      reason: `No source has enough safe cache candidates for a large dry-run. ${selected.sourceName} is fetch_required and is the best next discovery candidate by source priority and expected impact.`,
      suggestedCommands: [
        discoveryCommands[selected.sourceName],
        `npm.cmd run update:${selected.sourceName}:check`,
        "npm.cmd run update:all",
        "npm.cmd run update:plan"
      ],
      blockedSources,
      needsReviewSources,
      finalDecision: "need_discovery"
    };
  }

  if (blockedSources.length || needsReviewSources.length) {
    return {
      recommendedNextSource: null,
      recommendedMode: "review_or_new_source",
      reason: "No safe large-batch or non-exhausted discovery candidate is available; review blocked sources or add a new source.",
      suggestedCommands: [
        "Open data/staging/automation/update-all-report.json",
        "Review source-specific update check reports listed under blockedSources."
      ],
      blockedSources,
      needsReviewSources,
      finalDecision: "need_review_or_new_source"
    };
  }

  return {
    recommendedNextSource: null,
    recommendedMode: "no-action",
    reason: "No safe candidate, fetch-required source, or review blocker is present.",
    suggestedCommands: ["npm.cmd run update:all"],
    blockedSources,
    needsReviewSources,
    finalDecision: "no_action"
  };
}

async function main() {
  const updateAllWasRun = runUpdateAllIfMissing();
  const updateAllReport = await readJson(UPDATE_ALL_REPORT_PATH);
  const baseSourceSummaries = (updateAllReport.sources ?? []).map((source) => toSourceSummary(source));
  const sourceExhaustionSummary = [];
  const exhaustionBySource = new Map();
  for (const source of baseSourceSummaries) {
    const exhaustion = await buildSourceExhaustionSummary(source.sourceName, source);
    sourceExhaustionSummary.push(exhaustion);
    exhaustionBySource.set(source.sourceName, exhaustion);
  }
  const sourceSummaries = (updateAllReport.sources ?? []).map((source) => toSourceSummary(source, exhaustionBySource.get(source.sourceName)));
  const sourceErrors = updateAllReport.sourceErrors ?? [];
  const plan = choosePlan({ sourceSummaries, sourceErrors });

  const report = {
    runAt: new Date().toISOString(),
    mode: "cache-report-only",
    apiFetchEnabled: false,
    updateAllReportPath: UPDATE_ALL_REPORT_PATH,
    updateAllWasRun,
    currentPolicyCount: updateAllReport.currentPolicyCount ?? null,
    searchIndexCount: updateAllReport.searchIndexCount ?? null,
    totalSafeToApplyCount: updateAllReport.totalSafeToApplyCount ?? sourceSummaries.reduce((sum, source) => sum + source.safeToApplyCount, 0),
    totalNewCandidateCount: updateAllReport.totalNewCandidateCount ?? sourceSummaries.reduce((sum, source) => sum + source.newCandidateCount, 0),
    sourceSummaries,
    sourceExhaustionSummary,
    ...plan
  };

  await writeJson(REPORT_PATH, report);

  console.log("Update plan report");
  console.log(`report path: ${REPORT_PATH}`);
  console.log(`currentPolicyCount: ${report.currentPolicyCount}`);
  console.log(`searchIndexCount: ${report.searchIndexCount}`);
  console.log(`recommendedNextSource: ${report.recommendedNextSource ?? "(none)"}`);
  console.log(`recommendedMode: ${report.recommendedMode}`);
  console.log(`reason: ${report.reason}`);
  console.log(`blockedSources: ${report.blockedSources.join(", ") || "(none)"}`);
  console.log(`needsReviewSources: ${report.needsReviewSources.join(", ") || "(none)"}`);
  console.log(`sourceExhausted: ${sourceExhaustionSummary.filter((source) => source.sourceExhausted).map((source) => source.sourceName).join(", ") || "(none)"}`);
  console.log(`finalDecision: ${report.finalDecision}`);
  console.log(`suggestedCommands: ${JSON.stringify(report.suggestedCommands, null, 2)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
