import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { readJson } from "./importers/staging-artifacts.mjs";

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return fallback;
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
  if ((dryRunReport.conflictSummary?.conflictCount ?? 0) !== 0) failures.push("conflict summary is not zero");
  if (failures.length) {
    throw new Error(`Gov24 apply preflight failed: ${failures.join("; ")}`);
  }
}

async function readMatchingDryRunReport(candidates, limit) {
  const mismatches = [];
  for (const candidate of candidates) {
    try {
      const report = await readJson(candidate.dryRunReportPath);
      if (report.dryRun === true && report.applyReadiness === "ready_for_apply" && report.selectedCount === limit) {
        return { report, paths: candidate };
      }
      mismatches.push(`${candidate.dryRunReportPath}: selectedCount=${report.selectedCount}, applyReadiness=${report.applyReadiness}`);
    } catch (error) {
      mismatches.push(`${candidate.dryRunReportPath}: ${error.message}`);
    }
  }
  throw new Error(`No matching Gov24 apply dry-run report found for limit ${limit}. Checked: ${mismatches.join("; ")}`);
}

function assertCandidateSafety(policies) {
  const failures = [];
  const seenSlugs = new Set();
  const forbiddenCategory = "기타";

  policies.forEach((policy, index) => {
    const label = policy.slug || `index ${index}`;
    if (!policy.slug) failures.push(`${label}: missing slug`);
    if (seenSlugs.has(policy.slug)) failures.push(`${label}: duplicate selected slug`);
    seenSlugs.add(policy.slug);
    if (!policy.title) failures.push(`${label}: missing title`);
    if (!policy.category || policy.category === forbiddenCategory) failures.push(`${label}: invalid category`);
    if (!policy.agency) failures.push(`${label}: missing agency`);
    if (!policy.officialUrl && !policy.officialSourceUrl) failures.push(`${label}: missing official URL`);
    if (!policy.summary && !policy.audience) failures.push(`${label}: missing summary/audience`);
    if (!policy.publishPolicy?.canPublish) failures.push(`${label}: publishPolicy.canPublish is not true`);
    if (policy.dateConfidence === "unknown" && policy.publishPolicy?.showDday !== false) {
      failures.push(`${label}: unknown date item would show D-day`);
    }
    if (policy.statusConfidence === "unknown" && policy.publishPolicy?.includeInStatusFilters !== false) {
      failures.push(`${label}: unknown status item would enter status filters`);
    }
    if (policy.region === null && policy.publishPolicy?.includeInRegionPage !== false) {
      failures.push(`${label}: unknown region item would enter region pages`);
    }
  });

  if (failures.length) {
    throw new Error(`Gov24 candidate safety failed:\n${failures.join("\n")}`);
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
  const limit = Number.parseInt(argValue("limit", "50"), 10);
  if (!hasFlag("confirm")) {
    throw new Error("Refusing to write production source-of-truth without --confirm.");
  }

  const policiesPath = "src/data/policies.ts";
  const dryRunReportPath = argValue("dry-run-report", "data/staging/gov24/apply-dry-run-report.json");
  const generatedPreviewPath = argValue("generated-preview", "data/staging/gov24/promotion-generated-preview.json");
  const existingSourceText = await readFile(policiesPath, "utf8");
  const requestedBatch = argValue("batch");
  const existingBatchMatches = [...existingSourceText.matchAll(/const gov24PromotionPolicies(?:Batch(\d+))?: Policy\[\]/g)];
  const existingBatches = existingBatchMatches.map((match) => (match[1] ? Number(match[1]) : 1));
  const batch = requestedBatch
    ? Number.parseInt(requestedBatch, 10)
    : existingBatches.length
      ? Math.max(...existingBatches) + 1
      : 1;
  if (!Number.isInteger(batch) || batch < 1) {
    throw new Error(`Invalid batch value: ${requestedBatch}`);
  }
  const blockName = batch === 1 ? "gov24PromotionPolicies" : `gov24PromotionPoliciesBatch${batch}`;
  const applyReportPath = batch === 1 ? "data/staging/gov24/apply-report.json" : `data/staging/gov24/apply-report-batch-${batch}.json`;

  const { report: dryRunReport, paths: selectedInputPaths } = await readMatchingDryRunReport([
    { dryRunReportPath, generatedPreviewPath },
    {
      dryRunReportPath: "data/staging/automation/update-gov24-apply-dry-run-report.json",
      generatedPreviewPath: "data/staging/automation/update-gov24-promotion-generated-preview.json"
    }
  ], limit);
  assertApplyReady(dryRunReport, limit);

  const generatedPreview = await readJson(selectedInputPaths.generatedPreviewPath);
  const policiesBySlug = new Map((generatedPreview.policies ?? []).map((policy) => [policy.slug, policy]));
  const selectedPolicies = (dryRunReport.selectedItemSummaries ?? [])
    .slice(0, limit)
    .map((item) => policiesBySlug.get(item.slug))
    .filter(Boolean);
  if (selectedPolicies.length !== limit) {
    throw new Error(`Generated preview has ${selectedPolicies.length} policies, expected ${limit}.`);
  }
  assertCandidateSafety(selectedPolicies);

  const sourceText = await readFile(policiesPath, "utf8");
  if (sourceText.includes(`const ${blockName}: Policy[]`)) {
    throw new Error(`${blockName} block already exists. Refusing to apply twice.`);
  }

  const insertBefore = "policies.push(...welfareApiPolicies);";
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
    requiresOfficialConfirmation: policy.requiresOfficialConfirmation,
    url: `/support/${policy.slug}/`
  }));

  const readySamples = selectedPolicies
    .filter((policy) => policy.requiresOfficialConfirmation !== true)
    .slice(0, 3)
    .map((policy) => `/support/${policy.slug}/`);
  const warningSamples = selectedPolicies
    .filter((policy) => policy.requiresOfficialConfirmation === true)
    .slice(0, 7)
    .map((policy) => `/support/${policy.slug}/`);

  const report = {
    runAt: new Date().toISOString(),
    batch,
    applied: true,
    appliedCount: selectedPolicies.length,
    previousPolicyCount: dryRunReport.existingPolicyCount,
    finalPolicyCount: dryRunReport.finalPolicyCountPreview,
    expectedPolicyIncrease: dryRunReport.expectedPolicyIncrease,
    sourceOfTruthFile: dryRunReport.sourceOfTruthFile,
    changedFiles: [policiesPath, applyReportPath],
    directGeneratedProductionFileEdits: false,
    generatedProductionFilesChangedByHand: false,
    addedItemSummaries: selectedItemSummaries,
    categoryCountAfter: dryRunReport.categoryCountPreview,
    statusCountAfter: dryRunReport.statusCountPreview,
    sourceCountAfter: dryRunReport.sourceCountPreview,
    searchIndexCountAfter: dryRunReport.searchIndexPreview?.count,
    generatedPageCountAfter: null,
    sampleQaUrls: {
      ready: readySamples,
      publishableWithWarning: warningSamples
    },
    validationResults: {
      validatePolicies: "pending",
      validateStagingGov24: "pending",
      test: "pending",
      legacyBuild: "pending"
    },
    buildResult: "pending",
    rollbackNote: "Revert only the gov24PromotionPolicies block and its policies.push call from src/data/policies.ts, then rerun validation/test/build.",
    applyReadiness: "applied_pending_validation"
  };

  await writeJson(applyReportPath, report);

  console.log("Gov24 apply completed");
  console.log(`source-of-truth policy file: ${policiesPath}`);
  console.log(`apply report path: ${resolve(applyReportPath)}`);
  console.log(`previousPolicyCount: ${report.previousPolicyCount}`);
  console.log(`appliedCount: ${report.appliedCount}`);
  console.log(`finalPolicyCount: ${report.finalPolicyCount}`);
  console.log(`expectedPolicyIncrease: ${report.expectedPolicyIncrease}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
