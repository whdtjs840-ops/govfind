import { policies } from "../../src/data/policies.ts";
import { getAppliedPoliciesForConflictCheck, getPublicPolicies } from "../../src/utils/policyUtils.ts";
import {
  buildUpdateCheckReport,
  printUpdateCheckReport,
  summarizeConflictReasons,
  writeJson
} from "./update-check-utils.mjs";

function summarizeSkipped(entry, summarizeItem, fallbackReason) {
  const item = entry.item ?? entry;
  const reasons = Array.isArray(entry.reasons) ? entry.reasons : fallbackReason ? [fallbackReason] : [];
  const summarizedReasons = summarizeConflictReasons(reasons);
  return {
    ...summarizeItem(item),
    reasons: summarizedReasons.length ? summarizedReasons : reasons.map(String)
  };
}

function sourcePolicyCount(publicPolicies, matcher) {
  return publicPolicies.filter((policy) => matcher(policy.source ?? "")).length;
}

function buildNextCommandSuggestion({ report, discoveryCommand, dryRunCommand }) {
  const safeToApplyCount = report.summary?.safeToApplyCount ?? 0;
  if (safeToApplyCount > 0) return dryRunCommand(safeToApplyCount);
  if (report.recommendedAction === "needs_review") return `Open ${report.reportPath} and review needsReview or blocked items`;
  return discoveryCommand;
}

export async function runCacheUpdateCheck({
  sourceName,
  reportPath,
  loadItems,
  selectCandidates,
  classificationOf,
  summarizeItem,
  currentSourceMatcher,
  discoveryCommand,
  dryRunCommand
}) {
  const publicPolicies = getPublicPolicies(policies);
  const appliedPolicies = getAppliedPoliciesForConflictCheck(policies);
  const items = await loadItems();
  const { selected, skipped } = selectCandidates({
    items,
    limit: Number.MAX_SAFE_INTEGER,
    publicPolicies: appliedPolicies
  });

  const safeToApply = selected.map(summarizeItem);
  const duplicateCandidates = [
    ...(skipped.alreadyApplied ?? []).map((entry) => summarizeSkipped(entry, summarizeItem, "already applied")),
    ...(skipped.duplicate ?? []).map((entry) => summarizeSkipped(entry, summarizeItem, "duplicate candidate")),
    ...(skipped.slugConflict ?? []).map((entry) => summarizeSkipped(entry, summarizeItem, "slug conflict"))
  ];
  const needsReview = (skipped.needsReview ?? []).map((entry) => summarizeSkipped(entry, summarizeItem, "needs review"));
  const blockedItems = [
    ...(skipped.categoryMappingGap ?? []).map((entry) => ({
      ...summarizeSkipped(entry, summarizeItem, "category mapping gap"),
      blockReason: "category mapping gap"
    })),
    ...(skipped.incomplete ?? []).map((entry) => ({
      ...summarizeSkipped(entry, summarizeItem, "incomplete"),
      blockReason: "incomplete"
    })),
    ...(skipped.other ?? []).map((entry) => ({
      ...summarizeSkipped(entry, summarizeItem, "other"),
      blockReason: "other"
    }))
  ];

  const classificationCounts = items.reduce((acc, item) => {
    const key = classificationOf(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const report = buildUpdateCheckReport({
    sourceName,
    mode: "cache-only",
    currentPolicyCount: publicPolicies.length,
    currentSourcePolicyCount: sourcePolicyCount(publicPolicies, currentSourceMatcher),
    newCandidates: safeToApply,
    safeToApply,
    duplicateCandidates,
    needsReview,
    blockedItems,
    metadata: {
      analyzedStagingItemCount: items.length,
      classificationCounts,
      skippedAlreadyAppliedCount: skipped.alreadyApplied?.length ?? 0,
      skippedDuplicateCount: skipped.duplicate?.length ?? 0,
      skippedSlugConflictCount: skipped.slugConflict?.length ?? 0,
      skippedCategoryMappingGapCount: skipped.categoryMappingGap?.length ?? 0,
      skippedIncompleteCount: skipped.incomplete?.length ?? 0,
      skippedNeedsReviewCount: skipped.needsReview?.length ?? 0,
      skippedOtherCount: skipped.other?.length ?? 0,
      apiFetchEnabled: false,
      fetchOptionsAcceptedButNotRun: ["--fetch", "--pages", "--limit", "--resume", "--save"]
    }
  });

  report.reportPath = reportPath;
  report.nextCommandSuggestion = buildNextCommandSuggestion({ report, discoveryCommand, dryRunCommand });

  await writeJson(reportPath, report);
  printUpdateCheckReport(report, reportPath);
  console.log(`nextCommandSuggestion: ${report.nextCommandSuggestion}`);
}
