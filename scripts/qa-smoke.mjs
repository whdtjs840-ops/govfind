import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const MIN_SEARCH_INDEX_COUNT = 6000;
const UPDATE_ALL_REPORT_PATH = path.join(ROOT, "data/staging/automation/update-all-report.json");
const UPDATE_PLAN_REPORT_PATH = path.join(ROOT, "data/staging/automation/update-plan-report.json");
const SUPPORT_CARD_PATTERN = /class="[^"]*support-card/g;
const BAD_TEXT_PATTERNS = [
  /Invalid Date/i,
  /\bNaN\b/,
  /\bundefined\b/i,
  />\s*null\s*</i,
];

const routes = [
  "/support/",
  "/support/?q=%EC%B0%BD%EC%97%85",
  "/support/?q=%EC%86%8C%EC%83%81%EA%B3%B5%EC%9D%B8",
  "/support/?tag=%EC%B0%BD%EC%97%85",
  "/category/welfare/",
  "/category/startup/",
  "/category/small-business/",
  "/category/employment/",
  "/category/employment/?page=2",
  "/search-index.json",
];

function htmlPathForRoute(route) {
  const pathname = route.split("?")[0];
  if (pathname === "/search-index.json") return path.join(DIST, "search-index.json");
  const clean = pathname.replace(/^\/+|\/+$/g, "");
  return path.join(DIST, clean, "index.html");
}

function stripNonVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
}

function assertNoBadText(route, content) {
  const visible = route.endsWith(".json") ? content : stripNonVisible(content);
  const matched = BAD_TEXT_PATTERNS.find((pattern) => pattern.test(visible));
  if (matched) throw new Error(`${route} contains suspicious text: ${matched}`);
}

function assertHtmlRoute(route, html) {
  if (!html.includes("<html")) throw new Error(`${route} is not HTML`);
  if (!html.includes("<title>")) throw new Error(`${route} is missing title`);
  if (route.startsWith("/support/") && !html.includes("support-pagination")) {
    throw new Error(`${route} is missing support pagination`);
  }
  if (route.startsWith("/category/") && !html.includes("support-pagination")) {
    throw new Error(`${route} is missing category pagination`);
  }
  if ((route.startsWith("/support/") || route.startsWith("/category/")) && (html.match(SUPPORT_CARD_PATTERN) || []).length !== 30) {
    throw new Error(`${route} should render exactly 30 initial cards`);
  }
  if (route.startsWith("/category/employment/")) {
    const visible = stripNonVisible(html);
    if (!visible.includes("고용") && !visible.includes("일자리") && !visible.includes("취업")) {
      throw new Error(`${route} did not render the employment category page`);
    }
    if (visible.includes("GovFind - 정부지원금 맞춤 검색")) {
      throw new Error(`${route} appears to be the home page fallback`);
    }
  }
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertAutomationCountParity({ searchIndexCount, itemLength }) {
  const updateAll = readJsonIfExists(UPDATE_ALL_REPORT_PATH);
  const updatePlan = readJsonIfExists(UPDATE_PLAN_REPORT_PATH);

  if (updateAll) {
    if (Number(updateAll.currentPolicyCount) !== searchIndexCount || Number(updateAll.searchIndexCount) !== searchIndexCount) {
      throw new Error(
        `update:all count mismatch: current=${updateAll.currentPolicyCount}, search=${updateAll.searchIndexCount}, expected=${searchIndexCount}`
      );
    }
    if (updateAll.searchIndexItemLength != null && Number(updateAll.searchIndexItemLength) !== itemLength) {
      throw new Error(`update:all item length mismatch: ${updateAll.searchIndexItemLength} !== ${itemLength}`);
    }
    if (updateAll.countMismatchDetected === true) {
      throw new Error("update:all reported countMismatchDetected=true");
    }
  }

  if (updatePlan) {
    if (Number(updatePlan.currentPolicyCount) !== searchIndexCount || Number(updatePlan.searchIndexCount) !== searchIndexCount) {
      throw new Error(
        `update:plan count mismatch: current=${updatePlan.currentPolicyCount}, search=${updatePlan.searchIndexCount}, expected=${searchIndexCount}`
      );
    }
    if (updatePlan.searchIndexItemLength != null && Number(updatePlan.searchIndexItemLength) !== itemLength) {
      throw new Error(`update:plan item length mismatch: ${updatePlan.searchIndexItemLength} !== ${itemLength}`);
    }
    if (updatePlan.countMismatchDetected === true) {
      throw new Error("update:plan reported countMismatchDetected=true");
    }
  }
}

const failures = [];

for (const route of routes) {
  const filePath = htmlPathForRoute(route);
  try {
    if (!fs.existsSync(filePath)) throw new Error(`missing file ${filePath}`);
    const content = fs.readFileSync(filePath, "utf8");
    assertNoBadText(route, content);
    if (!route.endsWith(".json")) assertHtmlRoute(route, content);
  } catch (error) {
    failures.push({ route, error: error.message });
  }
}

try {
  const searchIndexPath = path.join(DIST, "search-index.json");
  const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, "utf8"));
  const itemLength = Array.isArray(searchIndex.items) ? searchIndex.items.length : 0;
  if (searchIndex.count !== itemLength || itemLength < MIN_SEARCH_INDEX_COUNT) {
    failures.push({
      route: "/search-index.json",
      error: `expected count/items parity above ${MIN_SEARCH_INDEX_COUNT}, got count ${searchIndex.count}, items ${itemLength}`,
    });
  }
  assertAutomationCountParity({ searchIndexCount: searchIndex.count, itemLength });
} catch (error) {
  failures.push({ route: "/search-index.json", error: error.message });
}

if (failures.length > 0) {
  console.error("Smoke QA failed");
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "passed",
  checkedRoutes: routes.length,
  searchIndexCount: JSON.parse(fs.readFileSync(path.join(DIST, "search-index.json"), "utf8")).count,
  employmentAlias: "ok",
  automationCountParity: "ok",
}, null, 2));
