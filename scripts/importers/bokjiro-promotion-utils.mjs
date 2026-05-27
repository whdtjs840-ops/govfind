import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { policies, categories, regions } from "../../src/data/policies.ts";
import {
  getDisplayRegion,
  getDisplayStatus,
  getPublicPolicies,
  isDeadlineSoonPolicy,
  policySearchText,
  shouldIncludeInDeadlineSort,
  shouldIncludeInRegionPage,
  shouldIncludeInStatusFilter,
  shouldRequireOfficialConfirmation,
  shouldShowDday
} from "../../src/utils/policyUtils.ts";
import { sourceLabel } from "../../src/utils/sourceNames.ts";
import { BOKJIRO_CENTRAL_SOURCE_NAME, normalizeComparableText } from "./bokjiro-central-normalizers.mjs";

export const bokjiroPaths = {
  promotionPreview: "data/staging/bokjiro-central/promotion-preview.json",
  generatorReport: "data/staging/bokjiro-central/promotion-generator-report.json",
  generatedPreview: "data/staging/bokjiro-central/promotion-generated-preview.json",
  applyDryRunReport: "data/staging/bokjiro-central/bokjiro-central-candidate-dry-run-report.json",
  mergedTemp: "data/staging/bokjiro-central/apply-dry-run-merged.tmp.json"
};

export const publicStatuses = new Set(["모집중", "상시", "예정", "마감임박", "마감", "확인필요"]);
export const publicCategories = new Set(categories);
export const publicRegions = new Set(regions);

export function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return fallback;
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function listJsonFiles(directory, suffix) {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => resolve(directory, entry.name))
    .sort();
}

export function classificationOf(item) {
  const value = item.classification ?? item.status;
  if (value === "duplicate_candidate") return "duplicate";
  if (value === "needs_manual_review") return "needsReview";
  return value;
}

export function normalizeText(value = "") {
  return normalizeComparableText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function normalizeUrl(value = "") {
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

function extractBokjiroId(value = "") {
  return String(value).match(/wlfareInfoId=([^&]+)/)?.[1] ?? "";
}

function titleAgencyKey(title = "", agency = "") {
  return `${normalizeText(title)}::${normalizeText(agency)}`;
}

export function buildExistingPolicyIndex(items = getPublicPolicies(policies)) {
  const bySlug = new Map();
  const bySourceItemId = new Map();
  const byOfficialUrl = new Map();
  const byTitleAgency = new Map();

  for (const policy of items) {
    bySlug.set(policy.slug, policy);
    for (const url of [policy.officialUrl, policy.officialSourceUrl].filter(Boolean)) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) byOfficialUrl.set(normalizedUrl, policy);
      const bokjiroId = extractBokjiroId(url);
      if (bokjiroId) bySourceItemId.set(`${BOKJIRO_CENTRAL_SOURCE_NAME}::${bokjiroId}`, policy);
    }
    byTitleAgency.set(titleAgencyKey(policy.title, policy.agency), policy);
  }

  return { bySlug, bySourceItemId, byOfficialUrl, byTitleAgency, all: items };
}

export async function loadBokjiroStagingItems() {
  const stagingFiles = await listJsonFiles("data/imports/bokjiro-central/staging", ".staging.json");
  const bySourceItemId = new Map();

  for (const file of stagingFiles) {
    const payload = await readJson(file);
    for (const item of payload.items ?? []) {
      const sourceItemId = item.normalized?.sourceItemId;
      if (!sourceItemId || bySourceItemId.has(sourceItemId)) continue;
      bySourceItemId.set(sourceItemId, {
        ...item,
        sourceArtifact: file,
        sourcePage: payload.page ?? null,
        sourceLimit: payload.limit ?? null
      });
    }
  }

  return [...bySourceItemId.values()];
}

export function hasCategoryMappingGap(item) {
  const category = item.normalized?.category;
  return (
    !category ||
    category === "기타" ||
    !publicCategories.has(category) ||
    (item.mappingGaps ?? []).includes("category") ||
    (item.reasons ?? []).some((reason) => /category mapping gap|unknown source category|category mapped to/i.test(reason))
  );
}

export function hasStrongDuplicate(item) {
  return (item.duplicateCandidates ?? []).some((candidate) => candidate.strength === "high");
}

export function hasRequiredCandidateFields(item) {
  const normalized = item.normalized ?? {};
  return Boolean(
    normalized.title &&
      normalized.slug &&
      normalized.sourceName &&
      normalized.sourceItemId &&
      normalized.organizationName &&
      (normalized.officialUrl || normalized.applicationUrl) &&
      (normalized.summary || normalized.description)
  );
}

function existingConflictReasons(item, existingIndex) {
  const normalized = item.normalized ?? {};
  const reasons = [];
  const sourceKey = `${normalized.sourceName}::${normalized.sourceItemId}`;
  const url = normalizeUrl(normalized.officialUrl || normalized.applicationUrl);
  const key = titleAgencyKey(normalized.title, normalized.organizationName);

  if (existingIndex.bySourceItemId.has(sourceKey)) reasons.push({ type: "sourceName+sourceItemId", matched: existingIndex.bySourceItemId.get(sourceKey) });
  if (normalized.slug && existingIndex.bySlug.has(normalized.slug)) reasons.push({ type: "slug", matched: existingIndex.bySlug.get(normalized.slug) });
  if (url && existingIndex.byOfficialUrl.has(url)) reasons.push({ type: "officialUrl", matched: existingIndex.byOfficialUrl.get(url) });
  if (key !== "::" && existingIndex.byTitleAgency.has(key)) reasons.push({ type: "title+organization", matched: existingIndex.byTitleAgency.get(key) });

  return reasons;
}

export function selectBokjiroCandidates({ limit = 98 } = {}) {
  throw new Error("selectBokjiroCandidates must be called with loaded items via selectBokjiroCandidatesFromItems.");
}

export function selectBokjiroCandidatesFromItems({ items, limit = 98, publicPolicies = getPublicPolicies(policies) }) {
  const existingIndex = buildExistingPolicyIndex(publicPolicies);
  const selected = [];
  const selectedSlugs = new Set();
  const selectedUrls = new Set();
  const selectedTitleAgency = new Set();
  const skipped = {
    alreadyApplied: [],
    duplicate: [],
    categoryMappingGap: [],
    needsReview: [],
    incomplete: [],
    other: [],
    slugConflict: []
  };

  const eligible = [];

  for (const item of items) {
    const classification = classificationOf(item);
    const normalized = item.normalized ?? {};
    const sourceKey = `${normalized.sourceName}::${normalized.sourceItemId}`;
    const conflicts = existingConflictReasons(item, existingIndex);

    if (conflicts.some((reason) => reason.type === "sourceName+sourceItemId")) {
      skipped.alreadyApplied.push({ item, reasons: conflicts });
      continue;
    }
    if (classification === "duplicate" || hasStrongDuplicate(item) || conflicts.length) {
      skipped.duplicate.push({ item, reasons: conflicts.length ? conflicts : item.duplicateCandidates ?? [] });
      continue;
    }
    if (classification === "incomplete") {
      skipped.incomplete.push({ item, reasons: item.reasons ?? item.validationIssues ?? [] });
      continue;
    }
    if (classification === "needsReview") {
      skipped.needsReview.push({ item, reasons: item.reasons ?? item.reviewReasons ?? [] });
      continue;
    }
    if (!["ready", "publishable_with_warning"].includes(classification)) {
      skipped.other.push({ item, reasons: [`unsupported classification: ${classification}`] });
      continue;
    }
    if (hasCategoryMappingGap(item)) {
      skipped.categoryMappingGap.push({ item, reasons: item.reasons ?? item.mappingGaps ?? [] });
      continue;
    }
    if (!hasRequiredCandidateFields(item) || item.publishPolicy?.canPublish !== true) {
      skipped.other.push({ item, reasons: item.reasons ?? ["missing required candidate field or publishPolicy.canPublish"] });
      continue;
    }
    if (!sourceKey || sourceKey === "::") {
      skipped.other.push({ item, reasons: ["missing source key"] });
      continue;
    }

    eligible.push(item);
  }

  eligible.sort((a, b) => {
    const priority = (classificationOf(a) === "ready" ? 0 : 1) - (classificationOf(b) === "ready" ? 0 : 1);
    if (priority !== 0) return priority;
    return String(a.normalized.sourceItemId).localeCompare(String(b.normalized.sourceItemId));
  });

  for (const item of eligible) {
    if (selected.length >= limit) break;
    const normalized = item.normalized;
    const url = normalizeUrl(normalized.officialUrl || normalized.applicationUrl);
    const titleAgency = titleAgencyKey(normalized.title, normalized.organizationName);
    if (selectedSlugs.has(normalized.slug)) {
      skipped.slugConflict.push({ item, reasons: ["slug conflict within selection"] });
      continue;
    }
    if (url && selectedUrls.has(url)) {
      skipped.duplicate.push({ item, reasons: ["officialUrl conflict within selection"] });
      continue;
    }
    if (titleAgency !== "::" && selectedTitleAgency.has(titleAgency)) {
      skipped.duplicate.push({ item, reasons: ["title + organization conflict within selection"] });
      continue;
    }

    selected.push(item);
    selectedSlugs.add(normalized.slug);
    if (url) selectedUrls.add(url);
    if (titleAgency !== "::") selectedTitleAgency.add(titleAgency);
  }

  return { selected, skipped, publicPolicies };
}

export function summarizeStagingItem(item) {
  const normalized = item.normalized ?? {};
  return {
    sourceItemId: normalized.sourceItemId,
    title: normalized.title,
    slug: normalized.slug,
    category: normalized.category,
    organizationName: normalized.organizationName,
    status: normalized.status,
    statusLabel: normalized.statusLabel ?? normalized.status,
    statusConfidence: normalized.statusConfidence ?? null,
    dateConfidence: normalized.dateConfidence ?? null,
    applicationPeriodLabel: normalized.applicationPeriodLabel ?? null,
    region: normalized.region ?? null,
    regionLabel: normalized.regionLabel ?? null,
    warnings: item.warnings ?? normalized.warnings ?? [],
    publishPolicy: item.publishPolicy ?? null,
    officialUrl: normalized.officialUrl ?? null,
    applicationUrl: normalized.applicationUrl ?? null,
    classification: classificationOf(item)
  };
}

function ddayFromEndDate(dateString) {
  if (!dateString) return "확인필요";
  const end = new Date(`${dateString}T00:00:00+09:00`);
  if (Number.isNaN(end.getTime())) return "확인필요";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return "확인필요";
  if (days === 0) return "D-Day";
  if (days <= 999) return `D-${days}`;
  return "모집중";
}

function currentDateLabel() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}.${month}.${day}`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function mapBokjiroCandidateToPublicPolicy(item) {
  const normalized = item.normalized ?? {};
  const classification = classificationOf(item);
  const issues = [];

  if (!["ready", "publishable_with_warning"].includes(classification)) issues.push(`classification is ${classification}`);
  if (hasCategoryMappingGap(item)) issues.push("category mapping gap");
  if (!publicCategories.has(normalized.category)) issues.push(`unsupported category: ${normalized.category}`);
  if (!publicStatuses.has(normalized.status)) issues.push(`unsupported status: ${normalized.status}`);
  if (!normalized.officialUrl && !normalized.applicationUrl) issues.push("missing officialUrl/applicationUrl");
  if (!normalized.summary && !normalized.description) issues.push("missing summary/description");

  if (issues.length) {
    return {
      bucket: "rejected",
      issues,
      publicPolicyPreview: null,
      recommendedAction: "Do not promote until required fields and mappings are fixed."
    };
  }

  const dateUnknown = normalized.dateConfidence === "unknown" || !normalized.endDate;
  const statusUnknown = normalized.statusConfidence === "unknown" || normalized.status === "확인필요";
  const regionUnknown = !normalized.region;
  const officialConfirmation = classification === "publishable_with_warning" || item.publishPolicy?.requiresOfficialConfirmation === true;
  const status = normalized.status ?? "확인필요";
  const statusLabel = normalized.statusLabel ?? (statusUnknown ? "공식 공고 확인" : status);
  const deadline = dateUnknown
    ? normalized.applicationPeriodLabel ?? "공식 공고 확인"
    : normalized.endDate
      ? `${normalized.startDate ?? "공식 공고 확인"} ~ ${normalized.endDate}`
      : normalized.applicationPeriodLabel ?? "공식 공고 확인";
  const dday = dateUnknown ? "확인필요" : status === "상시" ? "상시" : ddayFromEndDate(normalized.endDate);
  const publishPolicy = {
    canPublish: true,
    includeInSearch: true,
    includeInAllList: true,
    includeInCategoryPage: true,
    includeInRegionPage: !regionUnknown && item.publishPolicy?.includeInRegionPage !== false,
    includeInStatusFilters: !statusUnknown && item.publishPolicy?.includeInStatusFilters !== false,
    includeInDeadlineSort: !dateUnknown && item.publishPolicy?.includeInDeadlineSort !== false,
    showDday: !dateUnknown && item.publishPolicy?.showDday !== false,
    requiresOfficialConfirmation: officialConfirmation
  };
  const warnings = unique([
    ...(item.warnings ?? []),
    ...(normalized.warnings ?? []),
    ...(dateUnknown ? ["ambiguous date range"] : []),
    ...(statusUnknown ? ["status requires official confirmation"] : []),
    ...(regionUnknown ? ["unknown region"] : []),
    ...(officialConfirmation ? ["official confirmation required before application"] : [])
  ]);
  const tags = unique([
    ...(normalized.searchKeywords ?? []),
    normalized.title,
    normalized.category,
    normalized.region,
    normalized.organizationName,
    status,
    ...(normalized.targetGroups ?? [])
  ]).slice(0, 14);
  const summary = normalized.summary || normalized.description;
  const benefit = normalized.supportContent || normalized.description || summary;
  const audience = normalized.eligibilityText || normalized.selectionCriteria || normalized.description || "세부 자격은 공식 공고에서 확인하세요.";

  const publicPolicyPreview = {
    slug: normalized.slug,
    title: normalized.title,
    category: normalized.category,
    source: "복지로 중앙부처 API",
    agency: normalized.organizationName,
    region: normalized.region ?? null,
    amount: benefit || "공식 공고 확인",
    deadline,
    dday,
    status,
    startDate: normalized.startDate ?? null,
    endDate: normalized.endDate ?? null,
    statusLabel,
    statusConfidence: statusUnknown ? "unknown" : "known",
    dateConfidence: dateUnknown ? "unknown" : "known",
    applicationPeriodLabel: dateUnknown ? "공식 공고 확인" : normalized.applicationPeriodLabel,
    regionLabel: regionUnknown ? "공식 공고 확인" : undefined,
    requiresOfficialConfirmation: officialConfirmation,
    warnings,
    publishPolicy,
    lifeStage: "복지",
    targetGroup: (normalized.targetGroups ?? []).join(", ") || "공식 공고 확인",
    income: "공식 공고 확인",
    applyOnline: Boolean(normalized.applicationUrl),
    tags,
    summary,
    audience,
    benefits: unique([benefit || summary || "공식 공고 확인"]),
    documents: ["공식 공고 확인"],
    apply: normalized.applicationMethod || "복지로 또는 공식 안내에서 신청 방법을 확인하세요.",
    officialUrl: normalized.applicationUrl || normalized.officialUrl,
    officialSourceUrl: normalized.officialUrl || normalized.applicationUrl,
    contact: normalized.contact || normalized.organizationName,
    views: 0,
    updatedAt: currentDateLabel(),
    matchReasons: ["복지로 중앙부처 공식 API 기준", "신청기간과 자격은 공식 공고 확인 필요"],
    faq: [
      {
        q: "GovFind에서 신청 가능 여부를 확정하나요?",
        a: "아니요. 최종 자격과 신청 가능 여부는 복지로 또는 담당 기관의 공식 안내에서 확인해야 합니다."
      }
    ],
    apiDetails: {
      target: audience,
      benefit,
      application: normalized.applicationMethod || "공식 공고 확인",
      contact: normalized.contact || normalized.organizationName
    }
  };

  return {
    bucket: "promotable_without_model_change",
    issues: [],
    publicPolicyPreview,
    recommendedAction: "Can be included in the promotion apply dry-run; real apply requires a separate confirmed step."
  };
}

export function validateGeneratedPreview(existingPolicies, generatedPolicies) {
  const errors = [];
  const slugs = new Set(existingPolicies.map((policy) => policy.slug));

  for (const policy of generatedPolicies) {
    if (!policy.slug) errors.push("missing slug");
    if (slugs.has(policy.slug)) errors.push(`duplicate slug: ${policy.slug}`);
    slugs.add(policy.slug);
    if (!policy.title) errors.push(`missing title: ${policy.slug}`);
    if (!policy.category || !publicCategories.has(policy.category)) errors.push(`unsupported category: ${policy.slug} / ${policy.category}`);
    if (!policy.status || !publicStatuses.has(policy.status)) errors.push(`unsupported status: ${policy.slug} / ${policy.status}`);
    if (!policy.officialUrl && !policy.officialSourceUrl) errors.push(`missing official url: ${policy.slug}`);
    if (!policy.summary && !policy.audience) errors.push(`missing summary/audience: ${policy.slug}`);
    if (policy.dateConfidence === "unknown" && policy.publishPolicy?.showDday !== false) errors.push(`unknown date can show D-day: ${policy.slug}`);
    if (policy.dateConfidence === "unknown" && policy.publishPolicy?.includeInDeadlineSort !== false) errors.push(`unknown date can enter deadline sort: ${policy.slug}`);
    if (policy.statusConfidence === "unknown" && policy.publishPolicy?.includeInStatusFilters !== false) errors.push(`unknown status can enter status filters: ${policy.slug}`);
    if (policy.region === null && policy.publishPolicy?.includeInRegionPage !== false) errors.push(`null region can enter region page: ${policy.slug}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    searchIndexCountPreview: existingPolicies.length + generatedPolicies.length
  };
}

function countBy(items, keyFn) {
  return items.reduce((acc, item) => {
    const key = keyFn(item) || "공식 공고 확인";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
}

export function buildSearchItem(policy) {
  return {
    id: policy.slug,
    title: policy.title,
    category: policy.category,
    region: getDisplayRegion(policy),
    source: sourceLabel(policy.source),
    agency: policy.agency,
    status: getDisplayStatus(policy),
    dday: shouldShowDday(policy) ? policy.dday : "",
    updatedAt: policy.updatedAt,
    applyOnline: policy.applyOnline,
    officialUrl: policy.officialUrl,
    url: `/support/${policy.slug}/`,
    keywords: policy.tags,
    searchText: policySearchText(policy)
  };
}

export function validateApplyDryRun({ existingPolicies, selectedPolicies }) {
  const mergedPolicies = [...existingPolicies, ...selectedPolicies];
  const searchItems = mergedPolicies
    .filter((policy) => policy.publishPolicy?.includeInSearch !== false)
    .map(buildSearchItem);
  const invalidSearchItems = searchItems.filter((item) => !item.title || !item.category || !item.agency || !item.source || !item.searchText);
  const pageIssues = [];
  const guardIssues = [];

  for (const policy of selectedPolicies) {
    if (!policy.slug || /[/?#\\]/.test(policy.slug)) pageIssues.push({ slug: policy.slug, issue: "slug is not URL-safe" });
    if (String(policy.deadline).includes("Invalid Date") || String(policy.dday).includes("NaN")) {
      pageIssues.push({ slug: policy.slug, issue: "invalid date text" });
    }
    if (policy.dateConfidence === "unknown") {
      if (shouldShowDday(policy)) guardIssues.push({ slug: policy.slug, issue: "unknown date can show D-day" });
      if (shouldIncludeInDeadlineSort(policy)) guardIssues.push({ slug: policy.slug, issue: "unknown date can enter deadline sort" });
      if (isDeadlineSoonPolicy(policy)) guardIssues.push({ slug: policy.slug, issue: "unknown date can enter deadline soon" });
    }
    if (policy.statusConfidence === "unknown") {
      if (shouldIncludeInStatusFilter(policy, "모집중")) guardIssues.push({ slug: policy.slug, issue: "unknown status enters 모집중 filter" });
      if (shouldIncludeInStatusFilter(policy, "마감임박")) guardIssues.push({ slug: policy.slug, issue: "unknown status enters 마감임박 filter" });
    }
    if (policy.region === null && shouldIncludeInRegionPage(policy)) {
      guardIssues.push({ slug: policy.slug, issue: "null region enters region page" });
    }
    if (policy.requiresOfficialConfirmation && !shouldRequireOfficialConfirmation(policy)) {
      guardIssues.push({ slug: policy.slug, issue: "official confirmation flag lost" });
    }
  }

  return {
    categoryCountPreview: countBy(mergedPolicies, (policy) => policy.category),
    statusCountPreview: countBy(mergedPolicies, (policy) => getDisplayStatus(policy)),
    sourceCountPreview: countBy(mergedPolicies, (policy) => sourceLabel(policy.source)),
    searchIndexPreview: {
      count: searchItems.length,
      valid: invalidSearchItems.length === 0,
      invalidCount: invalidSearchItems.length
    },
    pageGenerationPreview: {
      checkedCount: selectedPolicies.length,
      valid: pageIssues.length === 0,
      invalid: pageIssues,
      urls: selectedPolicies.map((policy) => `/support/${policy.slug}/`)
    },
    guardValidation: {
      valid: guardIssues.length === 0,
      issues: guardIssues,
      unknownDateCount: selectedPolicies.filter((policy) => policy.dateConfidence === "unknown").length,
      unknownStatusCount: selectedPolicies.filter((policy) => policy.statusConfidence === "unknown").length,
      unknownRegionCount: selectedPolicies.filter((policy) => policy.region === null).length,
      requiresOfficialConfirmationCount: selectedPolicies.filter(shouldRequireOfficialConfirmation).length
    },
    mergedPolicies
  };
}

