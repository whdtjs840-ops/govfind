import { GOVFIND_CATEGORIES, GOVFIND_REGIONS, normalizeComparableText } from "./gov24-normalizers.mjs";

const requiredFields = ["title", "slug", "category", "sourceName", "sourceItemId", "organizationName"];
const allowedPublishWarnings = new Set(["startDate", "endDate", "status", "region", "targetGroups", "applicationUrl"]);

function isBlank(value) {
  return value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0);
}

function normalizeUrl(value = "") {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value).trim().replace(/\/$/, "").toLowerCase();
  }
}

function extractGov24Id(value = "") {
  const match = String(value).match(/(?:dtlEx\/|서비스ID[=:]?)([A-Za-z0-9_-]{6,})/);
  return match?.[1] ?? "";
}

function compactPeriod(item) {
  return [item.startDate ?? "", item.endDate ?? ""].join("::");
}

function tokenSet(value = "") {
  return new Set(normalizeComparableText(value).split(/\s+/).filter(Boolean));
}

export function titleSimilarity(a = "", b = "") {
  const left = tokenSet(a);
  const right = tokenSet(b);
  if (!left.size || !right.size) return 0;
  const intersection = [...left].filter((token) => right.has(token)).length;
  const union = new Set([...left, ...right]).size;
  return intersection / union;
}

export function buildExistingPolicyIndex(policies) {
  const bySourceItemId = new Map();
  const byOfficialUrl = new Map();
  const byTitleAgency = new Map();
  const byTitlePeriod = new Map();
  const all = [];

  for (const policy of policies) {
    const urls = [policy.officialUrl, policy.officialSourceUrl].filter(Boolean);
    for (const url of urls) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) byOfficialUrl.set(normalizedUrl, policy);
      const gov24Id = extractGov24Id(url);
      if (gov24Id) bySourceItemId.set(`gov24-public-service-benefits::${gov24Id}`, policy);
    }

    const titleAgency = `${normalizeComparableText(policy.title)}::${normalizeComparableText(policy.agency)}`;
    if (titleAgency !== "::") byTitleAgency.set(titleAgency, policy);

    const titlePeriod = `${normalizeComparableText(policy.title)}::${normalizeComparableText(policy.deadline)}`;
    if (titlePeriod !== "::") byTitlePeriod.set(titlePeriod, policy);

    all.push(policy);
  }

  return { bySourceItemId, byOfficialUrl, byTitleAgency, byTitlePeriod, all };
}

export function duplicateCandidates(normalized, existingIndex) {
  const candidates = [];
  const sourceKey = `${normalized.sourceName}::${normalized.sourceItemId}`;
  const officialUrls = [normalized.officialUrl, normalized.applicationUrl].map(normalizeUrl).filter(Boolean);
  const titleAgency = `${normalizeComparableText(normalized.title)}::${normalizeComparableText(normalized.organizationName)}`;
  const titlePeriod = `${normalizeComparableText(normalized.title)}::${compactPeriod(normalized)}`;

  if (normalized.sourceItemId && existingIndex.bySourceItemId.has(sourceKey)) {
    const match = existingIndex.bySourceItemId.get(sourceKey);
    candidates.push({
      rule: "sourceName + sourceItemId",
      strength: "high",
      matchedSlug: match.slug,
      matchedTitle: match.title,
      value: sourceKey
    });
  }

  for (const url of officialUrls) {
    if (existingIndex.byOfficialUrl.has(url)) {
      const match = existingIndex.byOfficialUrl.get(url);
      candidates.push({
        rule: "officialUrl",
        strength: "high",
        matchedSlug: match.slug,
        matchedTitle: match.title,
        value: url
      });
    }
  }

  if (titleAgency !== "::" && existingIndex.byTitleAgency.has(titleAgency)) {
    const match = existingIndex.byTitleAgency.get(titleAgency);
    candidates.push({
      rule: "normalized title + organizationName",
      strength: "high",
      matchedSlug: match.slug,
      matchedTitle: match.title,
      value: `${normalized.title} / ${normalized.organizationName}`
    });
  }

  if (normalized.startDate || normalized.endDate) {
    const matched = existingIndex.all.find((policy) => {
      const similarity = titleSimilarity(normalized.title, policy.title);
      return similarity >= 0.9 && normalizeComparableText(policy.deadline).includes(normalized.endDate ?? normalized.startDate ?? "");
    });
    if (matched) {
      candidates.push({
        rule: "normalized title + date period similar",
        strength: "medium",
        matchedSlug: matched.slug,
        matchedTitle: matched.title,
        value: titlePeriod
      });
    }
  }

  for (const policy of existingIndex.all) {
    const similarity = titleSimilarity(normalized.title, policy.title);
    const sameOrganization = normalizeComparableText(normalized.organizationName) === normalizeComparableText(policy.agency);
    if (sameOrganization && similarity >= 0.82) {
      candidates.push({
        rule: "high title similarity + same organizationName",
        strength: similarity >= 0.9 ? "high" : "medium",
        matchedSlug: policy.slug,
        matchedTitle: policy.title,
        value: similarity.toFixed(2)
      });
      break;
    }
  }

  return candidates.filter((candidate, index, list) => {
    const key = `${candidate.rule}::${candidate.matchedSlug}::${candidate.value}`;
    return list.findIndex((item) => `${item.rule}::${item.matchedSlug}::${item.value}` === key) === index;
  });
}

function hasCategoryMappingGap({ mappingGaps = [], reviewReasons = [] }) {
  return mappingGaps.includes("category") || reviewReasons.some((reason) => /unknown source category|category mapped/i.test(reason));
}

function hasOnlyAllowedPublishWarnings({ mappingGaps = [], reviewReasons = [] }) {
  if (hasCategoryMappingGap({ mappingGaps, reviewReasons })) return false;
  return mappingGaps.every((gap) => allowedPublishWarnings.has(gap));
}

export function warningLabels({ normalized = {}, mappingGaps = [], reviewReasons = [] }) {
  const warnings = [];
  if (mappingGaps.includes("startDate") || mappingGaps.includes("endDate")) warnings.push("ambiguous date range");
  if (mappingGaps.includes("status") || normalized.status === "?뺤씤?꾩슂") warnings.push("ambiguous status");
  if (mappingGaps.includes("region")) warnings.push("unknown region");
  if (mappingGaps.includes("targetGroups")) warnings.push("targetGroups uncertain");
  if (mappingGaps.includes("applicationUrl") && normalized.officialUrl) warnings.push("applicationUrl ambiguity but officialUrl exists");
  for (const reason of reviewReasons) {
    if (/deadline could not be interpreted/i.test(reason)) warnings.push("ambiguous date range");
    if (/status requires official confirmation/i.test(reason)) warnings.push("status requires official confirmation");
    if (/region/i.test(reason)) warnings.push("unknown region");
  }
  return [...new Set(warnings)];
}

export function classifyStagingItem({ normalized = {}, validationIssues = [], mappingGaps = [], reviewReasons = [], duplicateCandidates = [] }) {
  const hasStrongDuplicate = duplicateCandidates.some((candidate) => candidate.strength === "high");
  if (validationIssues.length) return "incomplete";
  if (hasStrongDuplicate) return "duplicate";
  if (mappingGaps.length || reviewReasons.length || duplicateCandidates.length) {
    if (!duplicateCandidates.length && hasOnlyAllowedPublishWarnings({ mappingGaps, reviewReasons })) {
      return "publishable_with_warning";
    }
    return "needsReview";
  }
  return "ready";
}

export function buildPublishPolicy({ classification, normalized = {}, mappingGaps = [] }) {
  const hasDate = Boolean(normalized.startDate || normalized.endDate);
  const dateUnknown = mappingGaps.includes("startDate") || mappingGaps.includes("endDate");
  const statusUnknown = mappingGaps.includes("status") || normalized.status === "?뺤씤?꾩슂";
  const regionUnknown = mappingGaps.includes("region") || !normalized.region;
  const categoryUnclear = mappingGaps.includes("category") || normalized.category === "湲고?";
  const canPublish = classification === "ready" || classification === "publishable_with_warning";

  return {
    canPublish,
    includeInSearch: canPublish,
    includeInAllList: canPublish,
    includeInCategoryPage: canPublish && !categoryUnclear,
    includeInRegionPage: canPublish && !regionUnknown,
    includeInStatusFilters: canPublish && !statusUnknown,
    includeInDeadlineSort: canPublish && hasDate && !dateUnknown,
    showDday: canPublish && hasDate && !dateUnknown,
    requiresOfficialConfirmation: classification === "publishable_with_warning"
  };
}

export function validateStagingItem(normalized, existingIndex) {
  const validationIssues = [];
  const mappingGaps = [];
  const reviewReasons = [...(normalized.normalization?.reviewReasons ?? [])];

  for (const field of requiredFields) {
    if (isBlank(normalized[field])) validationIssues.push(`missing required field: ${field}`);
  }

  if (isBlank(normalized.officialUrl) && isBlank(normalized.applicationUrl)) {
    validationIssues.push("missing officialUrl or applicationUrl");
  }
  if (isBlank(normalized.summary) && isBlank(normalized.description)) {
    validationIssues.push("missing summary or description");
  }

  if (!GOVFIND_CATEGORIES.includes(normalized.category)) {
    validationIssues.push(`invalid category: ${normalized.category}`);
  }
  if (normalized.category === "기타") {
    mappingGaps.push("category");
    reviewReasons.push("category mapped to 기타");
  }

  if (!normalized.region || !GOVFIND_REGIONS.includes(normalized.region)) {
    mappingGaps.push("region");
    reviewReasons.push(normalized.normalization?.region?.reason ?? "region is unknown");
  }

  if (normalized.status === "확인필요") {
    mappingGaps.push("status");
    reviewReasons.push("status requires official confirmation");
  }

  for (const field of ["startDate", "endDate", "applicationMethod", "sourceUpdatedAt"]) {
    if (isBlank(normalized[field])) mappingGaps.push(field);
  }

  if (normalized.officialUrl && !/^https?:\/\//i.test(normalized.officialUrl)) {
    validationIssues.push("officialUrl is not an absolute URL");
  }
  if (normalized.applicationUrl && !/^https?:\/\//i.test(normalized.applicationUrl)) {
    validationIssues.push("applicationUrl is not an absolute URL");
  }

  const duplicates = duplicateCandidates(normalized, existingIndex);
  const classification = classifyStagingItem({
    normalized,
    validationIssues,
    mappingGaps,
    reviewReasons,
    duplicateCandidates: duplicates
  });

  return {
    status: classification,
    classification,
    validationIssues: [...new Set(validationIssues)],
    mappingGaps: [...new Set(mappingGaps)],
    reviewReasons: [...new Set(reviewReasons.filter(Boolean))],
    duplicateCandidates: duplicates
  };
}
