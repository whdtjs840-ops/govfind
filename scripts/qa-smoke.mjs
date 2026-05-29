import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const EXPECTED_SEARCH_INDEX_COUNT = 6032;
const SUPPORT_CARD_PATTERN = /class="[^"]*support-card/g;
const BAD_TEXT_PATTERNS = [
  /Invalid Date/i,
  /\bNaN\b/,
  /undefined/i,
  />\s*null\s*</i,
];

const routes = [
  "/support/",
  "/support/?q=창업",
  "/support/?q=소상공인",
  "/support/?tag=창업",
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
    .replace(/<style[\s\S]*?<\/style>/gi, "");
}

function assertNoBadText(route, content) {
  const visible = route.endsWith(".json") ? content : stripNonVisible(content);
  const matched = BAD_TEXT_PATTERNS.find((pattern) => pattern.test(visible));
  if (matched) throw new Error(`${route} contains suspicious text: ${matched}`);
}

function assertHtmlRoute(route, filePath, html) {
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
    if (!html.includes("고용 지원사업 | GovFind") && !html.includes("고용 정부지원금")) {
      throw new Error(`${route} did not render the 고용 category page`);
    }
    if (html.includes("GovFind - 정부지원금 맞춤 검색")) {
      throw new Error(`${route} appears to be the home page fallback`);
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
    if (!route.endsWith(".json")) assertHtmlRoute(route, filePath, content);
  } catch (error) {
    failures.push({ route, error: error.message });
  }
}

try {
  const searchIndexPath = path.join(DIST, "search-index.json");
  const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, "utf8"));
  const itemLength = Array.isArray(searchIndex.items) ? searchIndex.items.length : 0;
  if (searchIndex.count !== EXPECTED_SEARCH_INDEX_COUNT || itemLength !== EXPECTED_SEARCH_INDEX_COUNT) {
    failures.push({
      route: "/search-index.json",
      error: `expected count ${EXPECTED_SEARCH_INDEX_COUNT}, got count ${searchIndex.count}, items ${itemLength}`,
    });
  }
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
  searchIndexCount: EXPECTED_SEARCH_INDEX_COUNT,
  employmentAlias: "ok",
}, null, 2));
