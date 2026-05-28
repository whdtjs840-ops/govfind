import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { argValue, bizinfoPaths, readJson } from "./importers/bizinfo-promotion-utils.mjs";

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function assertApplyReady(dryRunReport, limit) {
  const failures = [];
  if (dryRunReport.dryRun !== true) failures.push("dryRun report marker is not true");
  if (dryRunReport.applyReadiness !== "ready_for_apply") failures.push(`applyReadiness is ${dryRunReport.applyReadiness}`);
  if (dryRunReport.selectedCount !== limit) failures.push(`selectedCount is ${dryRunReport.selectedCount}, expected ${limit}`);
  if ((dryRunReport.compatibilityIssues ?? []).length !== 0) failures.push("compatibilityIssues is not zero");
  if (dryRunReport.searchIndexPreview?.valid !== true) failures.push("searchIndexPreview is not valid");
  if (dryRunReport.pageGenerationPreview?.valid !== true) failures.push("pageGenerationPreview is not valid");
  if (dryRunReport.guardValidation?.valid !== true) failures.push("guardValidation is not valid");
  if (failures.length) {
    throw new Error(`Bizinfo apply preflight failed: ${failures.join("; ")}`);
  }
}

function assertCandidateSafety(policies, limit) {
  const failures = [];
  const seenSlugs = new Set();

  if (policies.length !== limit) failures.push(`selected generated policies count is ${policies.length}, expected ${limit}`);

  policies.forEach((policy, index) => {
    const label = policy.slug || `index ${index}`;
    if (!policy.slug) failures.push(`${label}: missing slug`);
    if (seenSlugs.has(policy.slug)) failures.push(`${label}: duplicate selected slug`);
    seenSlugs.add(policy.slug);
    if (!policy.slug?.startsWith("bizinfo-")) failures.push(`${label}: slug does not use bizinfo prefix`);
    if (!policy.title) failures.push(`${label}: missing title`);
    if (!policy.category || policy.category === "기타") failures.push(`${label}: invalid category`);
    if (policy.category === "복지") failures.push(`${label}: business support item mapped to welfare`);
    if (!policy.agency) failures.push(`${label}: missing agency`);
    if (!policy.officialUrl && !policy.officialSourceUrl) failures.push(`${label}: missing official URL`);
    if (!policy.summary && !policy.audience) failures.push(`${label}: missing summary/audience`);
    if (policy.publishPolicy?.canPublish !== true) failures.push(`${label}: publishPolicy.canPublish is not true`);
    if (policy.statusConfidence === "unknown" && policy.publishPolicy?.includeInStatusFilters !== false) {
      failures.push(`${label}: unknown status item would enter status filters`);
    }
    if (policy.dateConfidence === "unknown") {
      if (policy.startDate !== null) failures.push(`${label}: unknown date item has startDate`);
      if (policy.endDate !== null) failures.push(`${label}: unknown date item has endDate`);
      if (policy.publishPolicy?.includeInDeadlineSort !== false) failures.push(`${label}: unknown date item would enter deadline sort`);
      if (policy.publishPolicy?.showDday !== false) failures.push(`${label}: unknown date item would show D-day`);
    }
    if (policy.region === null && policy.publishPolicy?.includeInRegionPage !== false) {
      failures.push(`${label}: unknown region item would enter region pages`);
    }
  });

  if (failures.length) {
    throw new Error(`Bizinfo candidate safety failed:\n${failures.join("\n")}`);
  }
}

function toPolicyBlock(blockName, policies) {
  return [
    `const ${blockName}: Policy[] = `,
    JSON.stringify(policies, null, 2),
    `;\n\npolicies.push(...${blockName});\n\n`
  ].join("");
}

async function main() {
  const limit = Number.parseInt(argValue("limit", "500"), 10);
  const batch = Number.parseInt(argValue("batch", "1"), 10);
  if (!hasFlag("confirm")) {
    throw new Error("Refusing to write production source-of-truth without --confirm.");
  }

  const policiesPath = "src/data/policies.ts";
  const applyReportPath = `data/staging/bizinfo/apply-report-bizinfo-batch-${batch}.json`;
  const sourceText = await readFile(policiesPath, "utf8");
  const blockName = batch === 1 ? "bizinfoPromotionPolicies" : `bizinfoPromotionPoliciesBatch${batch}`;

  if (sourceText.includes(`const ${blockName}`)) {
    throw new Error(`${blockName} block already exists. Refusing to apply twice.`);
  }

  const dryRunReport = await readJson(bizinfoPaths.applyDryRunReport);
  assertApplyReady(dryRunReport, limit);

  const generatedPreview = await readJson(bizinfoPaths.generatedPreview);
  const selectedPolicies = (generatedPreview.policies ?? []).slice(0, limit);
  assertCandidateSafety(selectedPolicies, limit);

  const insertBefore = "policies.push(...youthApiPolicies);";
  if (!sourceText.includes(insertBefore)) {
    throw new Error(`Could not find insertion marker: ${insertBefore}`);
  }

  const updatedText = sourceText.replace(insertBefore, `${toPolicyBlock(blockName, selectedPolicies)}${insertBefore}`);
  await writeFile(policiesPath, updatedText, "utf8");

  const selectedItemSummaries = selectedPolicies.map((policy) => ({
    slug: policy.slug,
    title: policy.title,
    category: policy.category,
    source: policy.source,
    agency: policy.agency,
    status: policy.status,
    statusLabel: policy.statusLabel,
    dateConfidence: policy.dateConfidence,
    statusConfidence: policy.statusConfidence,
    applicationPeriodLabel: policy.applicationPeriodLabel,
    region: policy.region,
    regionLabel: policy.regionLabel,
    requiresOfficialConfirmation: policy.requiresOfficialConfirmation,
    url: `/support/${policy.slug}/`
  }));

  const report = {
    runAt: new Date().toISOString(),
    sourceName: "bizinfo",
    batch,
    applied: true,
    appliedCount: selectedPolicies.length,
    previousPolicyCount: dryRunReport.currentPolicyCount,
    finalPolicyCount: dryRunReport.finalPolicyCountPreview,
    expectedPolicyIncrease: dryRunReport.expectedPolicyIncrease,
    sourceOfTruthFile: policiesPath,
    changedFiles: [policiesPath, applyReportPath],
    directGeneratedProductionFileEdits: false,
    generatedProductionFilesChangedByHand: false,
    addedItemSummaries: selectedItemSummaries,
    categoryCountAfter: dryRunReport.categoryCountPreview,
    statusCountAfter: dryRunReport.statusCountPreview,
    sourceCountAfter: dryRunReport.sourceCountPreview,
    searchIndexCountAfter: dryRunReport.searchIndexPreview?.count,
    generatedPageCountAfter: null,
    sampleQaUrls: selectedItemSummaries.slice(0, 30).map((item) => item.url),
    validationResults: {
      validatePolicies: "pending",
      test: "pending",
      legacyBuild: "pending"
    },
    buildResult: "pending",
    rollbackNote: "Revert only the bizinfoPromotionPolicies block and its policies.push call from src/data/policies.ts, then rerun validation/test/build.",
    applyReadiness: "applied_pending_validation"
  };

  await writeJson(applyReportPath, report);

  console.log("Bizinfo apply completed");
  console.log(`source-of-truth policy file: ${policiesPath}`);
  console.log(`apply report path: ${resolve(applyReportPath)}`);
  console.log(`previousPolicyCount: ${report.previousPolicyCount}`);
  console.log(`appliedCount: ${report.appliedCount}`);
  console.log(`finalPolicyCount: ${report.finalPolicyCount}`);
  console.log(`expectedPolicyIncrease: ${report.expectedPolicyIncrease}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
