import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { policies } from "../src/data/policies.ts";
import {
  argValue,
  bokjiroLocalPaths,
  readJson,
  validateApplyDryRun,
  writeJson
} from "./importers/bokjiro-local-promotion-utils.mjs";

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

async function main() {
  if (hasFlag("confirm") || hasFlag("apply")) {
    throw new Error("This command is dry-run only. Do not pass --confirm or --apply.");
  }

  const limit = Math.max(Number.parseInt(argValue("limit", "70"), 10), 1);
  const generatedPath = argValue("generated", bokjiroLocalPaths.generatedPreview);
  const outPath = argValue("out", bokjiroLocalPaths.applyDryRunReport);
  const mergedPath = argValue("merged", bokjiroLocalPaths.mergedTemp);
  const generatedPreview = await readJson(generatedPath);
  const publicPolicies = getPublicPolicies(policies);
  const selectedPolicies = (generatedPreview.policies ?? []).slice(0, limit);
  const {
    categoryCountPreview,
    statusCountPreview,
    sourceCountPreview,
    searchIndexPreview,
    pageGenerationPreview,
    guardValidation,
    mergedPolicies
  } = validateApplyDryRun({ existingPolicies: publicPolicies, selectedPolicies });
  const compatibilityIssues = [
    ...(!searchIndexPreview.valid ? ["search index preview invalid"] : []),
    ...(!pageGenerationPreview.valid ? pageGenerationPreview.invalid.map((item) => `${item.slug}: ${item.issue}`) : []),
    ...(!guardValidation.valid ? guardValidation.issues.map((item) => `${item.slug}: ${item.issue}`) : [])
  ];
  const selectedItemSummaries = selectedPolicies.map((policy) => ({
    sourceItemId: policy.officialUrl?.match(/wlfareInfoId=([^&]+)/)?.[1] ?? null,
    title: policy.title,
    slug: policy.slug,
    category: policy.category,
    organizationName: policy.agency,
    region: policy.region,
    status: policy.status,
    statusLabel: policy.statusLabel,
    applicationPeriodLabel: policy.applicationPeriodLabel,
    warnings: policy.warnings ?? [],
    publishPolicy: policy.publishPolicy,
    officialUrl: policy.officialUrl,
    previewUrl: `/support/${policy.slug}/`
  }));
  const applyReadiness =
    selectedPolicies.length > 0 &&
    compatibilityIssues.length === 0 &&
    searchIndexPreview.valid &&
    pageGenerationPreview.valid &&
    guardValidation.valid
      ? "ready_for_apply"
      : "needs_fix_before_apply";
  const candidateReport = await readJson(bokjiroLocalPaths.promotionPreview).catch(() => null);
  const report = {
    runAt: new Date().toISOString(),
    dryRun: true,
    sourceName: "bokjiro-local",
    sourceOfTruthFile: "src/data/policies.ts",
    currentPolicyCount: publicPolicies.length,
    selectedCount: selectedPolicies.length,
    finalPolicyCountPreview: publicPolicies.length + selectedPolicies.length,
    expectedPolicyIncrease: selectedPolicies.length,
    skippedDuplicateCount: candidateReport?.skippedDuplicateCount ?? null,
    skippedAlreadyAppliedCount: candidateReport?.skippedAlreadyAppliedCount ?? null,
    skippedCategoryMappingGapCount: candidateReport?.skippedCategoryMappingGapCount ?? null,
    compatibilityIssues,
    searchIndexPreview,
    pageGenerationPreview,
    guardValidation,
    categoryCountPreview,
    statusCountPreview,
    sourceCountPreview,
    sampleSelectedItemUrls: selectedItemSummaries.slice(0, 10).map((item) => item.previewUrl),
    selectedItemSummaries,
    applyReadiness,
    recommendedNextAction: applyReadiness === "ready_for_apply" ? "ready_for_bokjiro_local_apply" : "need_mapping_fix"
  };

  await writeJson(outPath, report);
  await writeJson(mergedPath, {
    runAt: report.runAt,
    dryRun: true,
    existingPolicyCount: publicPolicies.length,
    selectedCount: selectedPolicies.length,
    finalPolicyCountPreview: report.finalPolicyCountPreview,
    policies: mergedPolicies
  });

  console.log("Bokjiro local apply dry-run");
  console.log(`apply dry-run report path: ${outPath}`);
  console.log(`apply dry-run merged temp path: ${mergedPath}`);
  console.log(`currentPolicyCount: ${report.currentPolicyCount}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`expectedPolicyIncrease: ${report.expectedPolicyIncrease}`);
  console.log(`skippedDuplicateCount: ${report.skippedDuplicateCount}`);
  console.log(`compatibilityIssuesCount: ${report.compatibilityIssues.length}`);
  console.log(`searchIndexPreviewCount: ${report.searchIndexPreview.count}`);
  console.log(`pageGenerationValid: ${report.pageGenerationPreview.valid}`);
  console.log(`guardValidationValid: ${report.guardValidation.valid}`);
  console.log(`applyReadiness: ${report.applyReadiness}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
