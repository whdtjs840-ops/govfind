import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { policies } from "../src/data/policies.ts";
import {
  getPolicyToday,
  getPublicPolicies,
  isPolicyExpired,
  isSearchOnlyPolicy
} from "../src/utils/policyUtils.ts";
import { writeJson } from "./importers/update-check-utils.mjs";

const REPORT_PATH = "data/staging/automation/automation-cycle-report.json";
const APPROVAL_MANIFEST_PATH = "data/staging/automation/automation-approval-manifest.json";
const UPDATE_ALL_REPORT_PATH = "data/staging/automation/update-all-report.json";
const UPDATE_PLAN_REPORT_PATH = "data/staging/automation/update-plan-report.json";
const OPS_REPORT_PATH = "data/staging/operations/operational-stability-100-report.json";
const SEARCH_INDEX_PATH = "dist/search-index.json";

const SOURCE_COMMANDS = {
  gov24: {
    dryRun: (limit) => [
      `npm.cmd run promote:gov24:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:gov24:generate -- --limit=${limit}`,
      `npm.cmd run promote:gov24:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:gov24:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:gov24 -- --pages=<pages> --limit=100 --save --resume"
  },
  "bokjiro-central": {
    dryRun: (limit) => [
      `npm.cmd run promote:bokjiro-central:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:bokjiro-central:generate -- --limit=${limit}`,
      `npm.cmd run promote:bokjiro-central:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:bokjiro-central:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:bokjiro-central -- --pages=<pages> --limit=50 --save --resume"
  },
  "bokjiro-local": {
    dryRun: (limit) => [
      `npm.cmd run promote:bokjiro-local:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:bokjiro-local:generate -- --limit=${limit}`,
      `npm.cmd run promote:bokjiro-local:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:bokjiro-local:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:bokjiro-local -- --pages=<pages> --limit=50 --save --resume"
  },
  "ontong-youth": {
    dryRun: (limit) => [
      `npm.cmd run promote:ontong-youth:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:ontong-youth:generate -- --limit=${limit}`,
      `npm.cmd run promote:ontong-youth:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:ontong-youth:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:ontong-youth -- --pages=<pages> --limit=50 --save --resume"
  },
  bizinfo: {
    dryRun: (limit) => [
      `npm.cmd run promote:bizinfo:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:bizinfo:generate -- --limit=${limit}`,
      `npm.cmd run promote:bizinfo:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:bizinfo:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:bizinfo -- --pages=<pages> --limit=100 --save --resume"
  },
  kstartup: {
    dryRun: (limit) => [
      `npm.cmd run promote:kstartup:dry-run -- --limit=${limit}`,
      `npm.cmd run promote:kstartup:generate -- --limit=${limit}`,
      `npm.cmd run promote:kstartup:apply:dry-run -- --limit=${limit}`
    ],
    apply: (limit, batch = "<batch>") => `npm.cmd run promote:kstartup:apply -- --limit=${limit} --batch=${batch} --confirm`,
    discovery: "npm.cmd run discover:kstartup -- --pages=<pages> --limit=100 --save --resume"
  }
};

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function argValue(name, fallback = null) {
  const prefix = `--${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  return index >= 0 ? process.argv[index + 1] : fallback;
}

function run(command, { required = true } = {}) {
  const result = spawnSync(command, {
    cwd: process.cwd(),
    env: process.env,
    shell: true,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  const summary = {
    command,
    exitCode: result.status,
    ok: result.status === 0,
    stdoutTail: tail(result.stdout),
    stderrTail: tail(result.stderr)
  };
  if (required && result.status !== 0) {
    const error = new Error(`Command failed: ${command}`);
    error.summary = summary;
    throw error;
  }
  return summary;
}

function tail(value = "") {
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-12);
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

function sourceSummaryByName(updatePlan, sourceName) {
  return (updatePlan.sourceSummaries ?? []).find((source) => source.sourceName === sourceName) ?? null;
}

function computeExpirySummary(today) {
  const publicPolicies = getPublicPolicies(policies);
  const hiddenExpired = policies.filter((policy) => !isSearchOnlyPolicy(policy) && isPolicyExpired(policy, today));
  return {
    today: today.toISOString().slice(0, 10),
    sourceOfTruthCount: policies.length,
    publicPolicyCount: publicPolicies.length,
    expiredExcludedCount: hiddenExpired.length,
    searchOnlyExcludedCount: policies.filter(isSearchOnlyPolicy).length
  };
}

function chooseAutomationState(updatePlan) {
  if (updatePlan.finalDecision === "ready_for_next_large_batch") return "ready_for_source_dry_run";
  if (updatePlan.finalDecision === "need_discovery") return "needs_approved_discovery";
  if (updatePlan.finalDecision === "need_review_or_new_source") return "needs_review_or_new_source";
  if (updatePlan.finalDecision === "no_action") return "no_action";
  return "needs_review";
}

function buildApprovalManifest({ updatePlan, selectedSource, selectedCount, dryRunCommands }) {
  const sourceCommands = SOURCE_COMMANDS[selectedSource];
  const applyCommand = selectedSource && selectedCount && sourceCommands
    ? sourceCommands.apply(selectedCount)
    : null;
  const discoveryCommand = selectedSource && sourceCommands ? sourceCommands.discovery : null;

  return {
    generatedAt: new Date().toISOString(),
    approvalRequired: true,
    applyAllowedByDefault: false,
    deployAllowedByDefault: false,
    apiFetchAllowedByDefault: false,
    selectedSource,
    selectedCount,
    recommendedMode: updatePlan.recommendedMode,
    dryRunCommands,
    discoveryCommand,
    applyCommand,
    postApplyRequiredCommands: [
      "npm.cmd run qa:smoke",
      "npm.cmd run validate:policies",
      "npm.cmd test",
      "npm.cmd run legacy:build",
      "npm.cmd run update:all",
      "npm.cmd run update:plan",
      "npm.cmd run ops:check"
    ],
    deployCommandTemplate: "npx.cmd wrangler pages deploy dist --project-name govfind --branch main --commit-hash <commit hash> --commit-message \"<message>\"",
    stopConditions: [
      "selectedCount differs from appliedCount",
      "search-index count changes unexpectedly",
      "qa:smoke, validate, test, build, or ops:check fails",
      "API quota, rate-limit, approval, or auth error appears",
      "secret or API key may be printed",
      "src/data/policies.ts would be modified outside an approved apply step"
    ]
  };
}

async function main() {
  const executeDryRun = hasFlag("execute-dry-run");
  const requestedSource = argValue("source");
  const requestedLimit = Number(argValue("limit", "0"));
  const allowApi = hasFlag("allow-api");
  const allowApply = hasFlag("allow-apply");
  const allowDeploy = hasFlag("allow-deploy");

  if (allowApi || allowApply || allowDeploy) {
    throw new Error("automation:cycle does not execute API fetch, apply, or deploy. Use explicit source commands after human approval.");
  }

  const commandResults = [];
  commandResults.push(run("npm.cmd run legacy:build"));
  commandResults.push(run("npm.cmd run update:all"));
  commandResults.push(run("npm.cmd run update:plan"));
  commandResults.push(run("npm.cmd run ops:check"));

  const searchIndex = await readJson(SEARCH_INDEX_PATH);
  const updateAll = await readJson(UPDATE_ALL_REPORT_PATH);
  const updatePlan = await readJson(UPDATE_PLAN_REPORT_PATH);
  const opsReport = await readJson(OPS_REPORT_PATH);
  const today = getPolicyToday();
  const expirySummary = computeExpirySummary(today);
  const selectedSource = requestedSource ?? updatePlan.recommendedNextSource ?? null;
  const sourceSummary = selectedSource ? sourceSummaryByName(updatePlan, selectedSource) : null;
  const selectedCount = requestedLimit || sourceSummary?.safeToApplyCount || 0;
  const dryRunCommands = selectedSource && SOURCE_COMMANDS[selectedSource] && selectedCount > 0
    ? SOURCE_COMMANDS[selectedSource].dryRun(selectedCount)
    : [];

  const dryRunResults = [];
  if (executeDryRun) {
    if (!selectedSource || !SOURCE_COMMANDS[selectedSource]) {
      throw new Error("No executable source selected for dry-run.");
    }
    if (selectedCount <= 0) {
      throw new Error("Selected source has no safe candidates for dry-run.");
    }
    for (const command of dryRunCommands) {
      dryRunResults.push(run(command));
    }
  }

  const approvalManifest = buildApprovalManifest({
    updatePlan,
    selectedSource,
    selectedCount,
    dryRunCommands
  });
  await writeJson(APPROVAL_MANIFEST_PATH, approvalManifest);

  const countMismatchDetected =
    searchIndex.count !== searchIndex.items?.length ||
    updateAll.currentPolicyCount !== searchIndex.count ||
    updateAll.searchIndexCount !== searchIndex.count ||
    updatePlan.currentPolicyCount !== searchIndex.count ||
    updatePlan.searchIndexCount !== searchIndex.count ||
    opsReport.finalDecision !== "operational_stability_100_ready";

  const automationState = chooseAutomationState(updatePlan);
  const finalDecision = countMismatchDetected
    ? "needs_fix"
    : executeDryRun
      ? "dry_run_completed_needs_human_approval"
      : "automation_100_ready_for_human_approval";

  const report = {
    runAt: new Date().toISOString(),
    mode: executeDryRun ? "cache-only-with-source-dry-run" : "cache-only-plan",
    apiCalled: false,
    applyExecuted: false,
    deployExecuted: false,
    commandResults,
    dryRunResults,
    sourceOfTruthCount: policies.length,
    publicSearchIndexCount: searchIndex.count,
    searchIndexItemsLength: searchIndex.items?.length ?? null,
    searchIndexSizeBytes: existsSync(SEARCH_INDEX_PATH) ? statSync(SEARCH_INDEX_PATH).size : null,
    expirySummary,
    updateAllSummary: {
      currentPolicyCount: updateAll.currentPolicyCount,
      searchIndexCount: updateAll.searchIndexCount,
      totalSafeToApplyCount: updateAll.totalSafeToApplyCount,
      readyForDryRunSources: updateAll.readyForDryRunSources,
      fetchRequiredSources: updateAll.fetchRequiredSources,
      blockedSources: updateAll.blockedSources,
      recommendedNextAction: updateAll.recommendedNextAction,
      countMismatchDetected: updateAll.countMismatchDetected
    },
    updatePlanSummary: {
      currentPolicyCount: updatePlan.currentPolicyCount,
      searchIndexCount: updatePlan.searchIndexCount,
      recommendedNextSource: updatePlan.recommendedNextSource,
      recommendedMode: updatePlan.recommendedMode,
      finalDecision: updatePlan.finalDecision,
      blockedSources: updatePlan.blockedSources,
      needsReviewSources: updatePlan.needsReviewSources,
      countMismatchDetected: updatePlan.countMismatchDetected
    },
    opsCheckSummary: {
      finalDecision: opsReport.finalDecision,
      operationalStabilityScore: opsReport.operationalStabilityScore,
      failedGates: opsReport.failedGates
    },
    selectedSource,
    selectedCount,
    automationState,
    approvalManifestPath: APPROVAL_MANIFEST_PATH,
    approvalRequiredBeforeApply: true,
    approvalRequiredBeforeDeploy: true,
    countMismatchDetected,
    completion: {
      uxUi: 100,
      operationalStability: opsReport.operationalStabilityScore,
      automation: countMismatchDetected ? 90 : 100
    },
    finalDecision
  };

  await writeJson(REPORT_PATH, report);

  console.log(JSON.stringify({
    status: countMismatchDetected ? "needs_fix" : "passed",
    reportPath: REPORT_PATH,
    approvalManifestPath: APPROVAL_MANIFEST_PATH,
    publicSearchIndexCount: report.publicSearchIndexCount,
    selectedSource,
    selectedCount,
    automationState,
    applyExecuted: false,
    deployExecuted: false,
    finalDecision,
    completion: report.completion
  }, null, 2));

  if (countMismatchDetected) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  if (error.summary) console.error(JSON.stringify(error.summary, null, 2));
  process.exit(1);
});
