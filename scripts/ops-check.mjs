import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { policies } from "../src/data/policies.ts";
import { getPublicPolicies } from "../src/utils/policyUtils.ts";
import { writeJson } from "./importers/update-check-utils.mjs";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const REPORT_PATH = "data/staging/operations/operational-stability-100-report.json";
const SEARCH_INDEX_PATH = path.join(DIST, "search-index.json");
const UPDATE_ALL_REPORT_PATH = path.join(ROOT, "data/staging/automation/update-all-report.json");
const UPDATE_PLAN_REPORT_PATH = path.join(ROOT, "data/staging/automation/update-plan-report.json");

const SEARCH_INDEX_MAX_BYTES = 8 * 1024 * 1024;
const HTML_MAX_BYTES = 500 * 1024;
const EXPECTED_INITIAL_CARD_COUNT = 30;
const MIN_PUBLIC_COUNT = 3000;

const REQUIRED_PACKAGE_SCRIPTS = [
  "qa:smoke",
  "validate:policies",
  "test",
  "legacy:build",
  "update:all",
  "update:plan",
  "ops:check"
];

const PUBLIC_ROUTES = [
  "/",
  "/support/",
  "/support/?q=%EC%B0%BD%EC%97%85",
  "/support/?tag=%EC%B0%BD%EC%97%85",
  "/support/?category=%EC%B0%BD%EC%97%85",
  "/category/welfare/",
  "/category/startup/",
  "/category/small-business/",
  "/category/employment/",
  "/search-index.json"
];

const BAD_TEXT_PATTERNS = [
  { name: "Invalid Date", pattern: /Invalid Date/i },
  { name: "NaN", pattern: /\bNaN\b/ },
  { name: "undefined", pattern: /\bundefined\b/i },
  { name: "null text", pattern: />\s*null\s*</i }
];

const FORBIDDEN_SEARCH_INDEX_FIELDS = [
  "description",
  "supportContent",
  "eligibilityText",
  "selectionCriteria",
  "warnings",
  "applicationUrl"
];

function routeFile(route) {
  const pathname = route.split("?")[0];
  if (pathname === "/search-index.json") return SEARCH_INDEX_PATH;
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  return path.join(DIST, clean, "index.html");
}

function stripNonVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
}

function readJsonIfExists(filePath) {
  if (!existsSync(filePath)) return null;
  return JSON.parse(requireSafeRead(filePath));
}

function requireSafeRead(filePath) {
  return readFileSync(filePath, "utf8");
}

function git(args) {
  const result = spawnSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false
  });
  return {
    ok: result.status === 0,
    stdout: String(result.stdout ?? ""),
    stderr: String(result.stderr ?? ""),
    status: result.status
  };
}

function npmPackage() {
  return JSON.parse(requireSafeRead(path.join(ROOT, "package.json")));
}

function assert(condition, gate, message, details = null) {
  return {
    gate,
    passed: Boolean(condition),
    message,
    details
  };
}

function summarizeRoute(route) {
  const filePath = routeFile(route);
  if (!existsSync(filePath)) {
    return {
      route,
      filePath,
      exists: false,
      sizeBytes: null,
      cardCount: null,
      badText: [],
      passed: false,
      issues: ["missing build artifact"]
    };
  }

  const content = requireSafeRead(filePath);
  const visible = route.endsWith(".json") ? content : stripNonVisible(content);
  const badText = BAD_TEXT_PATTERNS.filter((entry) => entry.pattern.test(visible)).map((entry) => entry.name);
  const cardCount = route.startsWith("/support/") || route.startsWith("/category/")
    ? (content.match(/class="[^"]*support-card/g) ?? []).length
    : null;
  const sizeBytes = statSync(filePath).size;
  const issues = [];

  if (badText.length) issues.push(`bad visible text: ${badText.join(", ")}`);
  if (!route.endsWith(".json") && !content.includes("<html")) issues.push("not html");
  if (cardCount !== null && cardCount !== EXPECTED_INITIAL_CARD_COUNT) {
    issues.push(`expected ${EXPECTED_INITIAL_CARD_COUNT} initial cards, got ${cardCount}`);
  }
  if (sizeBytes > HTML_MAX_BYTES && !route.endsWith(".json")) {
    issues.push(`html size over budget: ${sizeBytes}`);
  }

  return {
    route,
    filePath,
    exists: true,
    sizeBytes,
    cardCount,
    badText,
    passed: issues.length === 0,
    issues
  };
}

async function main() {
  const searchIndex = JSON.parse(await readFile(SEARCH_INDEX_PATH, "utf8"));
  const searchItems = Array.isArray(searchIndex.items) ? searchIndex.items : [];
  const searchIndexSizeBytes = statSync(SEARCH_INDEX_PATH).size;
  const sourceOfTruthCount = policies.length;
  const publicPolicyCount = getPublicPolicies(policies).length;
  const packageJson = npmPackage();
  const missingScripts = REQUIRED_PACKAGE_SCRIPTS.filter((name) => !packageJson.scripts?.[name]);
  const routeChecks = PUBLIC_ROUTES.map(summarizeRoute);
  const searchIndexFieldKeys = Object.keys(searchItems[0] ?? {});
  const forbiddenSearchIndexFieldsPresent = FORBIDDEN_SEARCH_INDEX_FIELDS.filter((field) => searchIndexFieldKeys.includes(field));
  const updateAllReport = readJsonIfExists(UPDATE_ALL_REPORT_PATH);
  const updatePlanReport = readJsonIfExists(UPDATE_PLAN_REPORT_PATH);
  const trackedEnvFiles = git(["ls-files", ".env", ".env.local", ".env.production", ".env.development"]).stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const gitStatusLines = git(["status", "--porcelain"]).stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const automationCountMismatch =
    updateAllReport
      ? Number(updateAllReport.currentPolicyCount) !== searchIndex.count ||
        Number(updateAllReport.searchIndexCount) !== searchIndex.count ||
        updateAllReport.countMismatchDetected === true
      : true;
  const planCountMismatch =
    updatePlanReport
      ? Number(updatePlanReport.currentPolicyCount) !== searchIndex.count ||
        Number(updatePlanReport.searchIndexCount) !== searchIndex.count ||
        updatePlanReport.countMismatchDetected === true
      : true;

  const gates = [
    assert(searchIndex.count === searchItems.length, "search_index_count_parity", "search-index count equals items.length", {
      count: searchIndex.count,
      itemsLength: searchItems.length
    }),
    assert(searchIndex.count === publicPolicyCount, "public_count_parity", "dist search-index count equals public policy count", {
      searchIndexCount: searchIndex.count,
      publicPolicyCount
    }),
    assert(searchIndex.count >= MIN_PUBLIC_COUNT, "public_count_floor", "public count remains above operating floor", {
      searchIndexCount: searchIndex.count,
      minPublicCount: MIN_PUBLIC_COUNT
    }),
    assert(searchIndexSizeBytes <= SEARCH_INDEX_MAX_BYTES, "search_index_payload_budget", "search-index payload stays under budget", {
      searchIndexSizeBytes,
      maxBytes: SEARCH_INDEX_MAX_BYTES
    }),
    assert(forbiddenSearchIndexFieldsPresent.length === 0, "compact_search_index_shape", "search-index excludes long detail-only fields", {
      forbiddenSearchIndexFieldsPresent
    }),
    assert(missingScripts.length === 0, "required_scripts_present", "required operational scripts exist", {
      missingScripts
    }),
    assert(trackedEnvFiles.length === 0, "env_files_not_tracked", "real .env files are not tracked by git", {
      trackedEnvFiles
    }),
    assert(updateAllReport && !automationCountMismatch, "update_all_count_parity", "update:all count matches public search-index", {
      updateAllCurrentPolicyCount: updateAllReport?.currentPolicyCount ?? null,
      updateAllSearchIndexCount: updateAllReport?.searchIndexCount ?? null,
      searchIndexCount: searchIndex.count
    }),
    assert(updatePlanReport && !planCountMismatch, "update_plan_count_parity", "update:plan count matches public search-index", {
      updatePlanCurrentPolicyCount: updatePlanReport?.currentPolicyCount ?? null,
      updatePlanSearchIndexCount: updatePlanReport?.searchIndexCount ?? null,
      searchIndexCount: searchIndex.count
    }),
    assert(routeChecks.every((route) => route.passed), "public_route_artifacts", "critical public route artifacts are generated and clean", {
      failedRoutes: routeChecks.filter((route) => !route.passed).map((route) => ({ route: route.route, issues: route.issues }))
    })
  ];

  const failedGates = gates.filter((gate) => !gate.passed);
  const operationalStabilityScore = failedGates.length === 0 ? 100 : Math.max(0, Math.round(((gates.length - failedGates.length) / gates.length) * 100));
  const report = {
    runAt: new Date().toISOString(),
    mode: "local-dist-cache-only",
    apiCalled: false,
    sourceOfTruthCount,
    publicPolicyCount,
    searchIndexCount: searchIndex.count,
    searchIndexItemsLength: searchItems.length,
    searchIndexSizeBytes,
    searchIndexFieldKeys,
    routeChecks,
    updateAllSummary: updateAllReport
      ? {
          currentPolicyCount: updateAllReport.currentPolicyCount,
          searchIndexCount: updateAllReport.searchIndexCount,
          recommendedNextAction: updateAllReport.recommendedNextAction,
          countMismatchDetected: updateAllReport.countMismatchDetected
        }
      : null,
    updatePlanSummary: updatePlanReport
      ? {
          currentPolicyCount: updatePlanReport.currentPolicyCount,
          searchIndexCount: updatePlanReport.searchIndexCount,
          recommendedNextSource: updatePlanReport.recommendedNextSource,
          recommendedMode: updatePlanReport.recommendedMode,
          finalDecision: updatePlanReport.finalDecision,
          countMismatchDetected: updatePlanReport.countMismatchDetected
        }
      : null,
    trackedEnvFiles,
    gitStatusClean: gitStatusLines.length === 0,
    gitStatusSummary: gitStatusLines,
    gates,
    failedGates,
    operationalStabilityScore,
    finalDecision: failedGates.length === 0 ? "operational_stability_100_ready" : "needs_fix"
  };

  await writeJson(REPORT_PATH, report);

  console.log(JSON.stringify({
    status: failedGates.length === 0 ? "passed" : "failed",
    reportPath: REPORT_PATH,
    sourceOfTruthCount,
    publicPolicyCount,
    searchIndexCount: searchIndex.count,
    searchIndexItemsLength: searchItems.length,
    searchIndexSizeBytes,
    failedGates: failedGates.map((gate) => gate.gate),
    operationalStabilityScore,
    finalDecision: report.finalDecision
  }, null, 2));

  if (failedGates.length > 0) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
