import { categoryGroups, policies } from "../../data/policies";
import { derivePolicyTags } from "../../utils/derivedTags";
import { cleanSummary, getDisplayRegion, getDisplayStatus, getPublicPolicies } from "../../utils/policyUtils";
import { sourceLabel } from "../../utils/sourceNames";

const summaryTextLimit = 100;
const searchTextLimit = 100;
const keywordLimit = 6;
const keywordTextLimit = 22;
const benefitLimit = 2;

const aliases = new Map([
  ["employment", "job"],
]);

function compactText(value = "", limit = 160) {
  const normalized = String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized || ["null", "undefined"].includes(normalized.toLowerCase())) return "";
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).replace(/\s+\S*$/, "")}...`;
}

function uniqueValues(values: unknown[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const text = compactText(String(value ?? ""), 220);
    if (!text) continue;
    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
}

function compactKeywords(values: unknown[]) {
  return uniqueValues(values)
    .map((value) => compactText(value, keywordTextLimit))
    .filter(Boolean)
    .slice(0, keywordLimit);
}

function buildCompactSearchText(values: unknown[]) {
  const text = uniqueValues(values).join(" ");
  return compactText(text, searchTextLimit);
}

function buildIndexItem(policy: (typeof policies)[number]) {
  const tags = derivePolicyTags(policy);
  const displayRegion = getDisplayRegion(policy);
  const displaySource = sourceLabel(policy.source);
  const displayStatus = getDisplayStatus(policy);
  const summary = compactText(cleanSummary(policy.summary || policy.benefits?.[0] || policy.amount || policy.title), summaryTextLimit);
  const keywords = compactKeywords([...(policy.tags ?? []), ...tags]);
  const searchText = buildCompactSearchText([
    policy.title,
    policy.category,
    displayRegion,
    displaySource,
    policy.agency,
    policy.lifeStage,
    policy.targetGroup,
    policy.income,
    policy.audience,
    summary,
    policy.amount,
    policy.apply,
    ...(policy.benefits ?? []).slice(0, benefitLimit),
    ...keywords,
    ...tags
  ]);

  return {
    id: policy.slug,
    title: policy.title,
    summary,
    category: policy.category,
    region: displayRegion,
    source: displaySource,
    agency: policy.agency,
    status: displayStatus,
    dday: policy.dday,
    updatedAt: policy.updatedAt,
    applyOnline: policy.applyOnline,
    officialUrl: policy.officialUrl,
    url: `/support/${policy.slug}/`,
    keywords,
    tags,
    searchText
  };
}

export function getStaticPaths() {
  const paths = categoryGroups.map((category) => ({ params: { slug: category.slug } }));
  for (const [alias, canonicalSlug] of aliases) {
    if (categoryGroups.some((category) => category.slug === canonicalSlug)) {
      paths.push({ params: { slug: alias } });
    }
  }
  return paths;
}

export function GET({ params }: { params: { slug?: string } }) {
  const requestedSlug = params.slug ?? "";
  const canonicalSlug = aliases.get(requestedSlug) ?? requestedSlug;
  const category = categoryGroups.find((item) => item.slug === canonicalSlug);
  const items = category
    ? getPublicPolicies(policies)
      .filter((policy) => policy.category === category.label)
      .map(buildIndexItem)
    : [];

  return new Response(
    JSON.stringify({
      generatedAt: new Date().toISOString(),
      strategy: "compact-build-time-category-index",
      category: category?.label ?? "",
      slug: requestedSlug,
      canonicalSlug,
      count: items.length,
      items
    }),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}
