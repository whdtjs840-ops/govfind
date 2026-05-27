import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { policies } from "../src/data/policies.ts";
import {
  argValue,
  bokjiroPaths,
  loadBokjiroStagingItems,
  selectBokjiroCandidatesFromItems,
  summarizeStagingItem,
  writeJson
} from "./importers/bokjiro-promotion-utils.mjs";

async function main() {
  const limit = Math.max(Number.parseInt(argValue("limit", "98"), 10), 1);
  const outPath = argValue("out", bokjiroPaths.promotionPreview);
  const items = await loadBokjiroStagingItems();
  const publicPolicies = getPublicPolicies(policies);
  const { selected, skipped } = selectBokjiroCandidatesFromItems({ items, limit, publicPolicies });

  const report = {
    runAt: new Date().toISOString(),
    mode: "candidate-dry-run",
    sourceName: "bokjiro-central",
    currentPolicyCount: publicPolicies.length,
    analyzedCandidateCount: items.length,
    selectedCount: selected.length,
    expectedPolicyIncrease: selected.length,
    finalPolicyCountPreview: publicPolicies.length + selected.length,
    skippedAlreadyAppliedCount: skipped.alreadyApplied.length,
    skippedDuplicateCount: skipped.duplicate.length,
    skippedCategoryMappingGapCount: skipped.categoryMappingGap.length,
    skippedNeedsReviewCount: skipped.needsReview.length,
    skippedIncompleteCount: skipped.incomplete.length,
    skippedSlugConflictCount: skipped.slugConflict.length,
    skippedOtherCount: skipped.other.length,
    selectedReadyCount: selected.filter((item) => item.classification === "ready").length,
    selectedPublishableWithWarningCount: selected.filter((item) => item.classification === "publishable_with_warning").length,
    compatibilityIssues: [],
    selectedItems: selected.map(summarizeStagingItem),
    skippedSamples: {
      alreadyApplied: skipped.alreadyApplied.slice(0, 5).map(({ item, reasons }) => ({ ...summarizeStagingItem(item), reasons })),
      duplicate: skipped.duplicate.slice(0, 5).map(({ item, reasons }) => ({ ...summarizeStagingItem(item), reasons })),
      categoryMappingGap: skipped.categoryMappingGap.slice(0, 5).map(({ item, reasons }) => ({ ...summarizeStagingItem(item), reasons }))
    },
    applyReadiness: selected.length > 0 ? "candidate_ready_for_generator_dry_run" : "not_ready",
    recommendedNextAction: selected.length > 0 ? "run_bokjiro_generator_dry_run" : "stop_and_review"
  };

  await writeJson(outPath, report);

  console.log("Bokjiro central promotion candidate dry-run");
  console.log(`candidate report path: ${outPath}`);
  console.log(`currentPolicyCount: ${report.currentPolicyCount}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`selectedReadyCount: ${report.selectedReadyCount}`);
  console.log(`selectedPublishableWithWarningCount: ${report.selectedPublishableWithWarningCount}`);
  console.log(`skippedAlreadyAppliedCount: ${report.skippedAlreadyAppliedCount}`);
  console.log(`skippedDuplicateCount: ${report.skippedDuplicateCount}`);
  console.log(`skippedCategoryMappingGapCount: ${report.skippedCategoryMappingGapCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`compatibilityIssuesCount: ${report.compatibilityIssues.length}`);
  console.log(`applyReadiness: ${report.applyReadiness}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

