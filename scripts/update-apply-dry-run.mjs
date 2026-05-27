import { execSync } from "node:child_process";
import {
  argValue,
  readJson,
  writeJson
} from "./importers/update-check-utils.mjs";

const UPDATE_REPORT_PATH = "data/staging/automation/update-report.json";
const OUT_PATH = "data/staging/automation/update-apply-dry-run-report.json";

const sourceRunners = {
  gov24: runGov24DryRun
};

function npxCommand() {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function runTsxScript(script, args) {
  const command = [npxCommand(), "tsx", script, ...args].join(" ");
  execSync(command, {
    stdio: "inherit",
    env: process.env,
    shell: true
  });
}

function selectedSourceNames(updateReport, requestedSource) {
  const readySources = updateReport.aggregateSummary?.readyForApplyDryRunSources ?? [];
  if (!requestedSource || requestedSource === "auto") return readySources;
  if (requestedSource === "all") return readySources;
  return readySources.includes(requestedSource) ? [requestedSource] : [];
}

function sourceSummary(updateReport, sourceName) {
  return (updateReport.sourceReports ?? []).find((source) => source.sourceName === sourceName);
}

function queueItem(updateReport, sourceName) {
  return (updateReport.humanApprovalQueue ?? []).find((item) => item.sourceName === sourceName);
}

function limitForSource(updateReport, sourceName, requestedLimit) {
  if (requestedLimit) return Math.max(Number.parseInt(requestedLimit, 10), 1);
  const source = sourceSummary(updateReport, sourceName);
  return Math.max(Number.parseInt(String(source?.safeToApplyCount ?? 0), 10), 1);
}

function sourceSkippedEntries(updateReport, selectedSources) {
  const selectedSet = new Set(selectedSources);
  return (updateReport.sourceReports ?? [])
    .filter((source) => !selectedSet.has(source.sourceName))
    .map((source) => ({
      sourceName: source.sourceName,
      reason: source.recommendedAction,
      safeToApplyCount: source.safeToApplyCount,
      nextCommandSuggestion: queueItem(updateReport, source.sourceName)?.nextCommandSuggestion ?? null
    }));
}

async function runGov24DryRun({ limit }) {
  const prefix = "data/staging/automation/update-gov24";
  const promotionPreviewPath = `${prefix}-promotion-preview.json`;
  const promotionPreviewMergedPath = `${prefix}-promotion-preview-merged.tmp.json`;
  const generatorReportPath = `${prefix}-promotion-generator-report.json`;
  const generatedPreviewPath = `${prefix}-promotion-generated-preview.json`;
  const generatedMergedPath = `${prefix}-promotion-generated-merged.tmp.json`;
  const applyReportPath = `${prefix}-apply-dry-run-report.json`;
  const applyMergedPath = `${prefix}-apply-dry-run-merged.tmp.json`;

  runTsxScript("scripts/promote-gov24-dry-run.mjs", [
    `--limit=${limit}`,
    `--out=${promotionPreviewPath}`,
    `--tmp=${promotionPreviewMergedPath}`
  ]);
  runTsxScript("scripts/promote-gov24-generate.mjs", [
    `--limit=${limit}`,
    `--preview=${promotionPreviewPath}`,
    `--out=${generatorReportPath}`,
    `--generated=${generatedPreviewPath}`,
    `--merged=${generatedMergedPath}`
  ]);
  runTsxScript("scripts/promote-gov24-apply-dry-run.mjs", [
    `--limit=${limit}`,
    `--generator-report=${generatorReportPath}`,
    `--out=${applyReportPath}`,
    `--merged=${applyMergedPath}`
  ]);

  const promotionPreview = await readJson(promotionPreviewPath);
  const generatorReport = await readJson(generatorReportPath);
  const applyReport = await readJson(applyReportPath);
  const compatibilityIssues = [
    ...(generatorReport.validation?.errors ?? []),
    ...(applyReport.searchIndexPreview?.valid === false ? [{ type: "search-index-preview", details: applyReport.searchIndexPreview }] : []),
    ...(applyReport.pageGenerationPreview?.valid === false ? [{ type: "page-generation-preview", details: applyReport.pageGenerationPreview }] : []),
    ...(applyReport.guardValidation?.valid === false ? [{ type: "guard-validation", details: applyReport.guardValidation }] : [])
  ];

  return {
    sourceName: "gov24",
    selectedCount: applyReport.selectedCount,
    finalPolicyCountPreview: applyReport.finalPolicyCountPreview,
    expectedPolicyIncrease: applyReport.expectedPolicyIncrease,
    skippedDuplicateCount: promotionPreview.skippedDuplicateCount ?? 0,
    skippedAlreadyAppliedCount: promotionPreview.skippedAlreadyAppliedCount ?? 0,
    skippedCategoryMappingGapCount: promotionPreview.skippedCategoryMappingGapCount ?? 0,
    skippedAfterGeneratorCount: applyReport.skippedCount ?? 0,
    skippedAfterGeneratorSummaries: applyReport.skippedItemSummaries ?? [],
    compatibilityIssues,
    searchIndexPreview: applyReport.searchIndexPreview,
    pageGenerationPreview: applyReport.pageGenerationPreview,
    guardValidation: applyReport.guardValidation,
    applyReadiness: applyReport.applyReadiness,
    reportPaths: {
      promotionPreview: promotionPreviewPath,
      generatorReport: generatorReportPath,
      applyDryRunReport: applyReportPath,
      mergedTemp: applyMergedPath
    }
  };
}

function aggregateReadiness(sourceResults, skippedSources) {
  if (!sourceResults.length) {
    return skippedSources.some((source) => source.reason === "fetch_required") ? "fetch_required" : "needs_review";
  }
  const hasIssues = sourceResults.some((source) => (
    source.applyReadiness !== "ready_for_apply" ||
    (source.compatibilityIssues?.length ?? 0) > 0 ||
    source.searchIndexPreview?.valid === false ||
    source.pageGenerationPreview?.valid === false ||
    source.guardValidation?.valid === false
  ));
  return hasIssues ? "needs_review" : "ready_for_manual_apply";
}

async function main() {
  if (process.argv.some((arg) => arg === "--confirm" || arg === "--apply")) {
    throw new Error("update:apply:dry-run is dry-run only and does not accept --confirm or --apply.");
  }

  const updateReport = await readJson(UPDATE_REPORT_PATH);
  const requestedSource = argValue("source", "auto");
  const requestedLimit = argValue("limit", undefined);
  const selectedSources = selectedSourceNames(updateReport, requestedSource);
  const skippedSources = sourceSkippedEntries(updateReport, selectedSources);
  const sourceResults = [];

  for (const sourceName of selectedSources) {
    const runner = sourceRunners[sourceName];
    if (!runner) {
      skippedSources.push({
        sourceName,
        reason: "unsupported_source_for_integrated_apply_dry_run",
        nextCommandSuggestion: queueItem(updateReport, sourceName)?.nextCommandSuggestion ?? null
      });
      continue;
    }
    const limit = limitForSource(updateReport, sourceName, requestedLimit);
    sourceResults.push(await runner({ limit }));
  }

  const totalSelectedCount = sourceResults.reduce((sum, source) => sum + (source.selectedCount ?? 0), 0);
  const currentPolicyCount = updateReport.currentPolicyCount ?? 0;
  const finalPolicyCountPreview = currentPolicyCount + totalSelectedCount;
  const compatibilityIssues = sourceResults.flatMap((source) => source.compatibilityIssues ?? []);
  const applyReadiness = aggregateReadiness(sourceResults, skippedSources);
  const suggestedManualApplyCommands = sourceResults.map((source) => {
    if (source.sourceName === "gov24") return `npm.cmd run promote:gov24:apply -- --limit=${source.selectedCount} --batch=6 --confirm`;
    return null;
  }).filter(Boolean);

  const report = {
    runAt: new Date().toISOString(),
    dryRun: true,
    updateReportPath: UPDATE_REPORT_PATH,
    currentPolicyCount,
    selectedSources,
    skippedSources,
    totalSelectedCount,
    finalPolicyCountPreview,
    expectedPolicyIncrease: totalSelectedCount,
    sourceResults,
    compatibilityIssues,
    searchIndexPreview: {
      valid: sourceResults.every((source) => source.searchIndexPreview?.valid !== false),
      sourcePreviews: Object.fromEntries(sourceResults.map((source) => [source.sourceName, source.searchIndexPreview]))
    },
    pageGenerationPreview: {
      valid: sourceResults.every((source) => source.pageGenerationPreview?.valid !== false),
      sourcePreviews: Object.fromEntries(sourceResults.map((source) => [source.sourceName, source.pageGenerationPreview]))
    },
    guardValidation: {
      valid: sourceResults.every((source) => source.guardValidation?.valid !== false),
      sourcePreviews: Object.fromEntries(sourceResults.map((source) => [source.sourceName, source.guardValidation]))
    },
    applyReadiness,
    recommendedNextAction: applyReadiness,
    suggestedManualApplyCommands
  };

  await writeJson(OUT_PATH, report);

  console.log("Integrated update apply dry-run");
  console.log(`report path: ${OUT_PATH}`);
  console.log(`currentPolicyCount: ${currentPolicyCount}`);
  console.log(`selectedSources: ${selectedSources.join(", ") || "(none)"}`);
  console.log(`skippedSources: ${skippedSources.map((source) => `${source.sourceName}:${source.reason}`).join(", ") || "(none)"}`);
  console.log(`totalSelectedCount: ${totalSelectedCount}`);
  console.log(`finalPolicyCountPreview: ${finalPolicyCountPreview}`);
  console.log(`expectedPolicyIncrease: ${totalSelectedCount}`);
  console.log(`compatibilityIssuesCount: ${compatibilityIssues.length}`);
  console.log(`applyReadiness: ${applyReadiness}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
  console.log(`suggestedManualApplyCommands: ${JSON.stringify(suggestedManualApplyCommands, null, 2)}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
