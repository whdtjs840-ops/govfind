import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import {
  classificationOf as bokjiroClassificationOf,
  loadBokjiroStagingItems,
  selectBokjiroCandidatesFromItems
} from "./importers/bokjiro-promotion-utils.mjs";
import {
  buildUpdateCheckReport,
  hasFlag,
  printUpdateCheckReport,
  sourceCount,
  summarizeConflictReasons,
  summarizeStagingItem,
  writeJson
} from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "bokjiro-central";
const REPORT_PATH = "data/staging/automation/update-bokjiro-central-check-report.json";

function summarizeSkipped(entry, fallbackReason) {
  const item = entry.item ?? entry;
  const reasons = Array.isArray(entry.reasons) ? entry.reasons : fallbackReason ? [fallbackReason] : [];
  return {
    ...summarizeStagingItem(item),
    reasons: summarizeConflictReasons(reasons).length ? summarizeConflictReasons(reasons) : reasons.map(String)
  };
}

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for this check command in step 16. Run explicit discovery commands after approval.");
  }

  const publicPolicies = getPublicPolicies(policies);
  const items = await loadBokjiroStagingItems();
  const { selected, skipped } = selectBokjiroCandidatesFromItems({
    items,
    limit: Number.MAX_SAFE_INTEGER,
    publicPolicies
  });

  const safeToApply = selected.map(summarizeStagingItem);
  const duplicateCandidates = [
    ...skipped.alreadyApplied.map((entry) => summarizeSkipped(entry, "already applied")),
    ...skipped.duplicate.map((entry) => summarizeSkipped(entry, "duplicate candidate"))
  ];
  const needsReview = skipped.needsReview.map((entry) => summarizeSkipped(entry, "needs review"));
  const blockedItems = [
    ...skipped.categoryMappingGap.map((entry) => ({ ...summarizeSkipped(entry, "category mapping gap"), blockReason: "category mapping gap" })),
    ...skipped.incomplete.map((entry) => ({ ...summarizeSkipped(entry, "incomplete"), blockReason: "incomplete" })),
    ...skipped.slugConflict.map((entry) => ({ ...summarizeSkipped(entry, "slug conflict"), blockReason: "slug conflict" })),
    ...skipped.other.map((entry) => ({ ...summarizeSkipped(entry, "other"), blockReason: "other" }))
  ];

  const classificationCounts = items.reduce((acc, item) => {
    const key = bokjiroClassificationOf(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const report = buildUpdateCheckReport({
    sourceName: SOURCE_NAME,
    mode: "cache-only",
    currentPolicyCount: publicPolicies.length,
    currentSourcePolicyCount: sourceCount(publicPolicies, "복지로"),
    newCandidates: safeToApply,
    safeToApply,
    duplicateCandidates,
    needsReview,
    blockedItems,
    metadata: {
      analyzedStagingItemCount: items.length,
      classificationCounts,
      skippedAlreadyAppliedCount: skipped.alreadyApplied.length,
      skippedDuplicateCount: skipped.duplicate.length,
      skippedCategoryMappingGapCount: skipped.categoryMappingGap.length,
      skippedIncompleteCount: skipped.incomplete.length,
      skippedNeedsReviewCount: skipped.needsReview.length,
      apiFetchEnabled: false,
      fetchOptionsAcceptedButNotRun: ["--fetch", "--pages", "--limit", "--resume", "--save"]
    }
  });

  await writeJson(REPORT_PATH, report);
  printUpdateCheckReport(report, REPORT_PATH);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
