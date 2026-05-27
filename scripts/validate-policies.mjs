import { policies, categories, regions } from "../src/data/policies.ts";
import { getPolicyCounts, getPublicPolicies } from "../src/utils/policyUtils.ts";
import { GET as getSearchIndex } from "../src/pages/search-index.json.ts";

const requiredStringFields = [
  "slug",
  "title",
  "category",
  "source",
  "agency",
  "region",
  "deadline",
  "dday",
  "status",
  "officialUrl",
  "officialSourceUrl"
];

const knownStatuses = new Set([
  "\uBAA8\uC9D1\uC911",
  "\uC0C1\uC2DC",
  "\uC608\uC815",
  "\uB9C8\uAC10\uC784\uBC15",
  "\uB9C8\uAC10",
  "\uD655\uC778\uD544\uC694"
]);
const knownDdayLabels = new Set([...knownStatuses, "\uD655\uC778\uD544\uC694"]);

const knownCategories = new Set(categories);
const knownRegions = new Set(regions);
const generatedSlugPrefixes = ["api-", "local-", "gov24-", "kstartup-", "youth-"];

const errors = [];
const warnings = [];

function isBlank(value) {
  return value === undefined || value === null || String(value).trim() === "";
}

function addError(policy, message) {
  errors.push({ slug: policy?.slug || "(missing slug)", message });
}

function addWarning(policy, message) {
  warnings.push({ slug: policy?.slug || "(missing slug)", message });
}

function isKnownRegion(value) {
  if (knownRegions.has(value)) return true;
  if (/^전국[·\s-]/.test(value)) return true;
  if (/특별시|광역시|특별자치도|특별자치시|자치도|경기도|강원|충청|전라|경상|제주|서울|부산|대구|인천|광주|대전|울산/.test(value)) return true;
  if (/^(전북|전남|경북|경남|충북|충남)$/.test(value)) return true;
  if (/[시군구청]$/.test(value)) return true;
  if (/권역별|지역별|지자체/.test(value)) return true;
  return false;
}

function checkDuplicate(values, label) {
  const counts = new Map();
  for (const value of values.filter(Boolean)) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  for (const [value, count] of counts) {
    if (count > 1) errors.push({ slug: value, message: `duplicate ${label}: ${count} entries` });
  }
}

const ids = policies.map((policy) => policy.id).filter(Boolean);
if (ids.length) checkDuplicate(ids, "id");

for (const policy of policies) {
  if ("id" in policy && isBlank(policy.id)) addError(policy, "missing id");

  for (const field of requiredStringFields) {
    if (isBlank(policy[field])) addError(policy, `missing ${field}`);
  }

  if (!knownCategories.has(policy.category)) {
    addError(policy, `unknown category: ${policy.category}`);
  }

  if (!isBlank(policy.region) && !isKnownRegion(policy.region)) {
    addError(policy, `unknown region: ${policy.region}`);
  }

  if (!knownStatuses.has(policy.status)) {
    addError(policy, `unknown status: ${policy.status}`);
  }

  if (policy.dday !== "D-Day" && !/^D-\d{1,3}$/.test(policy.dday) && !knownDdayLabels.has(policy.dday)) {
    addWarning(policy, `non-standard dday: ${policy.dday}`);
  }

  if (typeof policy.applyOnline !== "boolean") {
    addError(policy, "applyOnline must be boolean");
  }

  for (const arrayField of ["tags", "benefits", "documents", "matchReasons", "faq"]) {
    if (!Array.isArray(policy[arrayField]) || policy[arrayField].length === 0) {
      addError(policy, `${arrayField} must be a non-empty array`);
    }
  }

  for (const document of policy.documents ?? []) {
    const normalizedDocument = String(document).trim();
    if (/^(?:\+?82[-\s]?)?0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}$/.test(normalizedDocument)) {
      addWarning(policy, `suspicious document value looks like phone number: ${normalizedDocument}`);
    }
    if (/\d{2,4}[-\s]\d{3,4}[-\s]\d{4}/.test(normalizedDocument) && /문의|전화|콜센터|센터|기관/.test(normalizedDocument)) {
      addWarning(policy, `suspicious document value looks like contact info: ${normalizedDocument}`);
    }
  }
}

checkDuplicate(policies.map((policy) => policy.slug), "slug");

const publicPolicies = getPublicPolicies(policies);
const policyCounts = getPolicyCounts(policies);
const generatedCount = policies.filter((policy) => generatedSlugPrefixes.some((prefix) => policy.slug.startsWith(prefix))).length;
const manualCount = policies.length - generatedCount;
const categoryCountTotal = Object.values(policyCounts.byCategory).reduce((sum, count) => sum + count, 0);

if (categoryCountTotal !== publicPolicies.length) {
  errors.push({ slug: "category-counts", message: `category count total ${categoryCountTotal} does not match public policy count ${publicPolicies.length}` });
}

const searchIndexResponse = await getSearchIndex();
const searchIndex = await searchIndexResponse.json();
if (searchIndex.count !== publicPolicies.length) {
  errors.push({ slug: "search-index", message: `search index count ${searchIndex.count} does not match public policy count ${publicPolicies.length}` });
}
if (searchIndex.items?.length !== publicPolicies.length) {
  errors.push({ slug: "search-index", message: `search index item length ${searchIndex.items?.length ?? 0} does not match public policy count ${publicPolicies.length}` });
}

console.log("GovFind policy data validation");
console.log(`- total policies: ${policies.length}`);
console.log(`- public policies after dedupe/search-only filtering: ${publicPolicies.length}`);
console.log(`- manual/static policies: ${manualCount}`);
console.log(`- generated policies: ${generatedCount}`);
console.log(`- search-index policies: ${searchIndex.count}`);
console.log(`- category count total: ${categoryCountTotal}`);
console.log("- id field: not present in current static Policy model; slug is validated as the stable key");

if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})`);
  for (const warning of warnings.slice(0, 50)) {
    console.log(`- ${warning.slug}: ${warning.message}`);
  }
  if (warnings.length > 50) console.log(`- ...and ${warnings.length - 50} more warnings`);
}

if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors.slice(0, 80)) {
    console.error(`- ${error.slug}: ${error.message}`);
  }
  if (errors.length > 80) console.error(`- ...and ${errors.length - 80} more errors`);
  process.exit(1);
}

console.log("\nPolicy validation passed.");
