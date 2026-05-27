import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { buildStagingPayloadFromRaw, readJson } from "./importers/staging-artifacts.mjs";
import {
  buildCurrentPolicyIndex,
  buildUpdateCheckReport,
  classificationOf,
  existingConflictReasons,
  hasCategoryMappingGap,
  hasFlag,
  hasRequiredCandidateFields,
  hasStrongDuplicate,
  listJsonFiles,
  printUpdateCheckReport,
  sourceCount,
  summarizeConflictReasons,
  summarizeStagingItem,
  writeJson
} from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "gov24";
const REPORT_PATH = "data/staging/automation/update-gov24-check-report.json";

function toRawPayloadFromCache(cachePayload, file) {
  return {
    meta: {
      ...(cachePayload.meta ?? {}),
      rawFilePath: file,
      sourceName: "gov24-public-service-benefits",
      responseItemArrayPath: "data"
    },
    items: Array.isArray(cachePayload.items) ? cachePayload.items : []
  };
}

async function loadGov24StagingItems() {
  const rawFiles = await listJsonFiles("data/imports/gov24/raw", ".raw.json");
  const cacheFiles = await listJsonFiles("data/staging/gov24/cache", ".json");
  const bySourceItemId = new Map();
  const artifacts = [];

  for (const file of rawFiles) {
    const payload = await readJson(file);
    if (!Array.isArray(payload.items)) continue;
    payload.meta = { ...(payload.meta ?? {}), rawFilePath: file };
    artifacts.push({ file, payload });
  }

  for (const file of cacheFiles) {
    const payload = toRawPayloadFromCache(await readJson(file), file);
    artifacts.push({ file, payload });
  }

  for (const { file, payload } of artifacts) {
    const stagingPayload = buildStagingPayloadFromRaw(payload);
    for (const item of stagingPayload.items ?? []) {
      const sourceItemId = item.normalized?.sourceItemId;
      if (!sourceItemId || bySourceItemId.has(sourceItemId)) continue;
      bySourceItemId.set(sourceItemId, {
        ...item,
        sourceArtifact: file,
        sourcePage: payload.meta?.page ?? null,
        sourceLimit: payload.meta?.limit ?? null
      });
    }
  }

  return { items: [...bySourceItemId.values()], artifactCount: artifacts.length };
}

function bucketGov24Items(items, publicPolicies) {
  const currentIndex = buildCurrentPolicyIndex(publicPolicies);
  const safeToApply = [];
  const duplicateCandidates = [];
  const needsReview = [];
  const blockedItems = [];

  for (const item of items) {
    const classification = classificationOf(item);
    const conflicts = existingConflictReasons(item, currentIndex);
    const summary = summarizeStagingItem(item);

    if (conflicts.length) {
      duplicateCandidates.push({
        ...summary,
        reasons: summarizeConflictReasons(conflicts)
      });
      continue;
    }

    if (classification === "duplicate" || hasStrongDuplicate(item)) {
      duplicateCandidates.push({
        ...summary,
        reasons: summarizeConflictReasons(item.duplicateCandidates ?? [])
      });
      continue;
    }

    if (classification === "needsReview") {
      needsReview.push({
        ...summary,
        reasons: item.reasons ?? item.reviewReasons ?? []
      });
      continue;
    }

    if (classification === "incomplete") {
      blockedItems.push({
        ...summary,
        blockReason: "incomplete",
        reasons: item.reasons ?? item.validationIssues ?? []
      });
      continue;
    }

    if (!["ready", "publishable_with_warning"].includes(classification)) {
      blockedItems.push({
        ...summary,
        blockReason: `unsupported classification: ${classification}`
      });
      continue;
    }

    if (hasCategoryMappingGap(item)) {
      blockedItems.push({
        ...summary,
        blockReason: "category mapping gap",
        reasons: item.reasons ?? item.mappingGaps ?? []
      });
      continue;
    }

    if (!hasRequiredCandidateFields(item) || item.publishPolicy?.canPublish !== true) {
      blockedItems.push({
        ...summary,
        blockReason: "missing required candidate field or publishPolicy.canPublish"
      });
      continue;
    }

    safeToApply.push(summary);
  }

  return {
    newCandidates: safeToApply,
    safeToApply,
    duplicateCandidates,
    needsReview,
    blockedItems
  };
}

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for this check command in step 16. Run explicit discovery commands after approval.");
  }

  const publicPolicies = getPublicPolicies(policies);
  const { items, artifactCount } = await loadGov24StagingItems();
  const buckets = bucketGov24Items(items, publicPolicies);
  const report = buildUpdateCheckReport({
    sourceName: SOURCE_NAME,
    mode: "cache-only",
    currentPolicyCount: publicPolicies.length,
    currentSourcePolicyCount: sourceCount(publicPolicies, "정부24"),
    ...buckets,
    metadata: {
      artifactCount,
      analyzedStagingItemCount: items.length,
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
