import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { policies } from "../src/data/policies.ts";
import {
  argValue,
  bizinfoPaths,
  loadBizinfoStagingItems,
  mapBizinfoCandidateToPublicPolicy,
  readJson,
  validateGeneratedPreview,
  writeJson
} from "./importers/bizinfo-promotion-utils.mjs";

function countBy(items, predicate) {
  return items.filter(predicate).length;
}

async function main() {
  const limit = Math.max(Number.parseInt(argValue("limit", "500"), 10), 1);
  const previewPath = argValue("preview", bizinfoPaths.promotionPreview);
  const outPath = argValue("out", bizinfoPaths.generatorReport);
  const generatedPath = argValue("generated", bizinfoPaths.generatedPreview);
  const promotionPreview = await readJson(previewPath);
  const selectedIds = (promotionPreview.selectedItems ?? []).slice(0, limit).map((item) => item.sourceItemId);
  const itemsById = new Map((await loadBizinfoStagingItems()).map((item) => [item.normalized.sourceItemId, item]));
  const selectedItems = selectedIds.map((id) => itemsById.get(id)).filter(Boolean);
  const mapped = selectedItems.map((item) => {
    const result = mapBizinfoCandidateToPublicPolicy(item);
    return {
      sourceItemId: item.normalized.sourceItemId,
      title: item.normalized.title,
      originalClassification: item.classification,
      proposedBucket: result.bucket,
      publicPolicyPreview: result.publicPolicyPreview,
      issues: result.issues,
      recommendedAction: result.recommendedAction
    };
  });
  const generatedPolicies = mapped
    .filter((item) => ["promotable_without_model_change", "promotable_with_safe_mapping"].includes(item.proposedBucket))
    .map((item) => item.publicPolicyPreview);
  const publicPolicies = getPublicPolicies(policies);
  const validation = validateGeneratedPreview(publicPolicies, generatedPolicies);
  const report = {
    runAt: new Date().toISOString(),
    mode: "generator-dry-run",
    sourceName: "bizinfo",
    selectedCount: selectedItems.length,
    promotableWithoutModelChangeCount: countBy(mapped, (item) => item.proposedBucket === "promotable_without_model_change"),
    promotableWithSafeMappingCount: countBy(mapped, (item) => item.proposedBucket === "promotable_with_safe_mapping"),
    requiresModelOrUiGuardCount: countBy(mapped, (item) => item.proposedBucket === "requires_model_or_ui_guard"),
    rejectedCount: countBy(mapped, (item) => item.proposedBucket === "rejected"),
    finalPromotableCount: generatedPolicies.length,
    finalPolicyCountPreview: publicPolicies.length + generatedPolicies.length,
    compatibilityIssues: validation.valid ? [] : validation.errors,
    validation,
    selectedItems: mapped,
    recommendedNextAction: validation.valid ? "run_bizinfo_apply_dry_run" : "need_mapping_fix"
  };

  await writeJson(outPath, report);
  await writeJson(generatedPath, {
    runAt: report.runAt,
    sourceName: "bizinfo",
    generatedCount: generatedPolicies.length,
    policies: generatedPolicies
  });

  console.log("Bizinfo promotion generator dry-run");
  console.log(`generator report path: ${outPath}`);
  console.log(`generated preview path: ${generatedPath}`);
  console.log(`selectedCount: ${report.selectedCount}`);
  console.log(`finalPromotableCount: ${report.finalPromotableCount}`);
  console.log(`finalPolicyCountPreview: ${report.finalPolicyCountPreview}`);
  console.log(`validationPassed: ${report.validation.valid}`);
  console.log(`recommendedNextAction: ${report.recommendedNextAction}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
