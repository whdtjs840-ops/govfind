import type { Policy } from "../data/policies";
import { sourceLabel } from "./sourceNames";

const summaryLimit = 132;
const searchOnlySlugs = new Set([
  "earned-income-tax-credit-application",
  "youth-rent-eligibility-check",
  "local-youth-rent-support",
  "health-insurance-out-of-pocket-refund",
  "health-insurance-overpayment-refund",
  "small-business-direct-loan",
  "small-business-emergency-fund"
]);

export function isSearchOnlyPolicy(policy: Pick<Policy, "slug">) {
  return searchOnlySlugs.has(policy.slug);
}

export function normalizeText(value = "") {
  return value
    .toLowerCase()
    .replace(/[·ㆍ・]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function cleanSummary(value = "") {
  const cleaned = value
    .replace(/[○●◎◇◆□■△▲▶▷]/g, " ")
    .replace(/\s*\([^)]{18,}\)\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = cleaned.split(/(?<=다\.|요\.|음\.|함\.)\s+/).filter(Boolean);
  const compact = sentences.slice(0, 2).join(" ") || cleaned;
  if (compact.length <= summaryLimit) return compact;
  return `${compact.slice(0, summaryLimit).replace(/\s+\S*$/, "")}...`;
}

export function policySearchText(policy: Policy) {
  return [
    policy.title,
    policy.category,
    sourceLabel(policy.source),
    policy.agency,
    getDisplayRegion(policy),
    policy.lifeStage,
    policy.targetGroup,
    policy.income,
    policy.summary,
    policy.audience,
    policy.apply,
    policy.amount,
    policy.documents.join(" "),
    policy.benefits.join(" "),
    policy.tags.join(" ")
  ].join(" ");
}

export type PolicyFilters = {
  q?: string;
  category?: string;
  source?: string;
  status?: string;
  region?: string;
  online?: boolean;
};

export type PolicySort = "recommended" | "deadline" | "popular" | "online" | "updated";

export function getPublicPolicies(items: Policy[]) {
  const { canonical } = dedupePolicies(items);
  return canonical.filter((policy) => !isSearchOnlyPolicy(policy));
}

export const officialCheckLabel = "공식 공고 확인";

export function getDisplayStatus(policy: Pick<Policy, "status" | "statusLabel">) {
  if (policy.statusLabel) return policy.statusLabel;
  if (policy.status === "확인필요") return officialCheckLabel;
  return policy.status;
}

export function getDisplayRegion(policy: Pick<Policy, "region" | "regionLabel">) {
  return policy.regionLabel ?? policy.region ?? officialCheckLabel;
}

export function hasKnownStatus(policy: Pick<Policy, "statusConfidence" | "publishPolicy">) {
  if (policy.statusConfidence === "unknown") return false;
  if (policy.publishPolicy?.includeInStatusFilters === false) return false;
  return true;
}

export function ddayNumber(policy: Pick<Policy, "dday">) {
  if (policy.dday === "D-Day") return 0;
  const match = policy.dday.match(/^D-(\d{1,3})$/);
  return match ? Number(match[1]) : null;
}

export function hasKnownDate(policy: Pick<Policy, "dateConfidence" | "publishPolicy" | "dday" | "endDate">) {
  if (policy.dateConfidence === "unknown") return false;
  if (policy.publishPolicy?.includeInDeadlineSort === false || policy.publishPolicy?.showDday === false) return false;
  if (policy.endDate === null) return false;
  if (policy.endDate) {
    const parsed = new Date(`${policy.endDate}T00:00:00+09:00`);
    if (Number.isNaN(parsed.getTime())) return false;
  }
  return ddayNumber(policy) !== null;
}

export function shouldShowDday(policy: Pick<Policy, "dateConfidence" | "publishPolicy" | "dday" | "endDate">) {
  if (policy.publishPolicy?.showDday === false) return false;
  return hasKnownDate(policy);
}

export function shouldIncludeInDeadlineSort(policy: Pick<Policy, "dateConfidence" | "publishPolicy" | "dday" | "endDate">) {
  if (policy.publishPolicy?.includeInDeadlineSort === false) return false;
  return hasKnownDate(policy);
}

export function shouldIncludeInStatusFilter(policy: Pick<Policy, "status" | "statusConfidence" | "publishPolicy" | "dday" | "dateConfidence" | "endDate">, status = "") {
  const normalizedStatus = normalizeStatusFilter(status);
  if (!normalizedStatus) return true;
  if (!hasKnownStatus(policy)) return false;
  if (normalizedStatus === "마감임박") return isDeadlineSoonPolicy(policy);
  return policy.status === normalizedStatus;
}

export function shouldIncludeInRegionPage(policy: Pick<Policy, "region" | "regionLabel" | "publishPolicy">) {
  if (policy.publishPolicy?.includeInRegionPage === false) return false;
  if (!policy.region) return false;
  if (policy.regionLabel === officialCheckLabel) return false;
  return true;
}

export function shouldRequireOfficialConfirmation(policy: Pick<Policy, "requiresOfficialConfirmation" | "publishPolicy">) {
  return Boolean(policy.requiresOfficialConfirmation || policy.publishPolicy?.requiresOfficialConfirmation);
}

export function isDeadlineSoonPolicy(policy: Pick<Policy, "status" | "dday" | "dateConfidence" | "statusConfidence" | "publishPolicy" | "endDate">) {
  if (!shouldIncludeInDeadlineSort(policy)) return false;
  if (!hasKnownStatus(policy)) return false;
  const days = ddayNumber(policy);
  return policy.status === "마감임박" && days !== null && days >= 0 && days <= 14;
}

export function getPolicyCounts(items: Policy[]) {
  const publicPolicies = getPublicPolicies(items);
  return {
    all: publicPolicies.length,
    deadline: publicPolicies.filter(isDeadlineSoonPolicy).length,
    byCategory: Object.fromEntries(
      [...new Set(publicPolicies.map((policy) => policy.category))]
        .sort((a, b) => a.localeCompare(b, "ko-KR"))
        .map((category) => [category, publicPolicies.filter((policy) => policy.category === category).length])
    ) as Record<string, number>,
    bySource: Object.fromEntries(
      [...new Set(publicPolicies.map((policy) => sourceLabel(policy.source)))]
        .sort((a, b) => a.localeCompare(b, "ko-KR"))
        .map((source) => [source, publicPolicies.filter((policy) => sourceLabel(policy.source) === source).length])
    ) as Record<string, number>
  };
}

function tokenizeQuery(value = "") {
  return value
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function normalizeStatusFilter(value = "") {
  if (["deadlineSoon", "closingSoon", "closing"].includes(value)) return "마감임박";
  return value;
}

function isNationwideRegion(value = "") {
  return value === "전국" || value.includes("전국");
}

export function policyMatchesFilters(policy: Policy, filters: PolicyFilters) {
  const queryTokens = tokenizeQuery(filters.q);
  if (queryTokens.length) {
    const searchable = normalizeText(policySearchText(policy));
    const matchesAllTokens = queryTokens.every((token) => searchable.includes(normalizeText(token)));
    if (!matchesAllTokens) return false;
  }

  if (filters.category && policy.category !== filters.category) return false;

  if (filters.source && sourceLabel(policy.source) !== sourceLabel(filters.source)) return false;

  const status = normalizeStatusFilter(filters.status);
  if (status) {
    if (!shouldIncludeInStatusFilter(policy, status)) return false;
  }

  if (filters.region && filters.region !== "전체") {
    if (!shouldIncludeInRegionPage(policy)) return false;
    const policyRegion = policy.region ?? "";
    if (policyRegion !== filters.region && !isNationwideRegion(policyRegion)) return false;
  }

  if (filters.online && !policy.applyOnline) return false;

  return true;
}

export function filterPolicies(items: Policy[], filters: PolicyFilters) {
  return items.filter((policy) => policyMatchesFilters(policy, filters));
}

export function sortPolicies(items: Policy[], sort: PolicySort = "recommended") {
  const sorted = [...items];
  if (sort === "deadline") return sorted.sort((a, b) => (shouldIncludeInDeadlineSort(a) ? ddayNumber(a) ?? 999 : 9999) - (shouldIncludeInDeadlineSort(b) ? ddayNumber(b) ?? 999 : 9999));
  if (sort === "popular") return sorted.sort((a, b) => b.views - a.views);
  if (sort === "online") return sorted.sort((a, b) => Number(b.applyOnline) - Number(a.applyOnline));
  if (sort === "updated") return sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return sorted;
}

export function hasVariableDeadline(policy: Pick<Policy, "deadline" | "dday">) {
  const text = `${policy.deadline} ${policy.dday}`;
  return /지자체|지역별|기관별|별도|확인|상시|예정|접수중|모집중/.test(text) && ddayNumber(policy) === null;
}

export function deadlineDisplay(policy: Pick<Policy, "deadline" | "dday" | "dateConfidence" | "publishPolicy" | "endDate" | "applicationPeriodLabel">) {
  if (policy.applicationPeriodLabel) return policy.applicationPeriodLabel;
  if (!shouldShowDday(policy)) {
    if (/확인|별도|공고/.test(policy.deadline) || policy.dateConfidence === "unknown") return officialCheckLabel;
  }
  if (/지자체|지역별|기관별/.test(policy.deadline)) return "지역별 상이";
  if (/확인|별도/.test(policy.deadline) && ddayNumber(policy) === null) return "공식 확인 필요";
  return policy.dday;
}

export function deadlineBasisText(policy: Pick<Policy, "deadline" | "dday">) {
  if (/지자체|지역별|기관별/.test(policy.deadline)) {
    return `신청기간이 "${policy.deadline}"로 표시되어 단일 D-day를 쓰지 않습니다. 지역 또는 기관별 공고에서 실제 접수일을 확인해야 합니다.`;
  }
  const days = ddayNumber(policy);
  if (days !== null) {
    return `D-day는 현재 등록된 신청기간 문구 "${policy.deadline}"과 정책 상태값을 기준으로 산정했습니다. 지역별 접수일이 다를 수 있으므로 공식 신청처에서 최종 확인해야 합니다.`;
  }
  return `신청기간이 "${policy.deadline}"로 표시되어 있어 단일 D-day를 확정하지 않았습니다. 상시·기관별 접수는 공식 신청처의 최신 공고를 기준으로 확인해야 합니다.`;
}

export function urgentPolicies(items: Policy[], limit = 14) {
  return items
    .filter((policy) => {
      const days = ddayNumber(policy);
      return isDeadlineSoonPolicy(policy) && days !== null && days <= limit;
    })
    .sort((a, b) => (shouldIncludeInDeadlineSort(a) ? ddayNumber(a) ?? 999 : 9999) - (shouldIncludeInDeadlineSort(b) ? ddayNumber(b) ?? 999 : 9999));
}

export function upcomingPolicies(items: Policy[]) {
  return items
    .filter((policy) => {
      if (!shouldIncludeInDeadlineSort(policy)) return false;
      const days = ddayNumber(policy);
      return days !== null && days > 14;
    })
    .sort((a, b) => (ddayNumber(a) ?? 999) - (ddayNumber(b) ?? 999));
}

function canonicalTitleKey(title: string) {
  const normalized = normalizeText(title);
  if (normalized.includes("근로자녀장려금")) return "근로장려금";
  return normalized
    .replace(/한시특별지원/g, "")
    .replace(/지원사업/g, "")
    .replace(/신청/g, "");
}

export function canonicalKey(policy: Policy) {
  const titleKey = canonicalTitleKey(policy.title);
  const urlKey = normalizeText(policy.officialUrl.replace(/^https?:\/\//, "").replace(/^www\./, ""));
  const agencyKey = normalizeText(policy.agency);
  return `${titleKey}|${urlKey}|${agencyKey}`;
}

export function dedupePolicies(items: Policy[]) {
  const groups = new Map<string, Policy[]>();

  for (const policy of items) {
    const key = canonicalKey(policy);
    const current = groups.get(key) ?? [];
    current.push(policy);
    groups.set(key, current);
  }

  const chooseCanonical = (group: Policy[]) => {
    return [...group].sort((a, b) => {
      const manualRank = Number(a.slug.startsWith("api-") || a.slug.startsWith("gov24-") || a.slug.startsWith("kstartup-")) - Number(b.slug.startsWith("api-") || b.slug.startsWith("gov24-") || b.slug.startsWith("kstartup-"));
      if (manualRank !== 0) return manualRank;
      return b.views - a.views;
    })[0];
  };

  const canonical = Array.from(groups.values()).map(chooseCanonical);

  const relatedBySlug = new Map<string, Policy[]>();
  for (const group of groups.values()) {
    const main = chooseCanonical(group);
    relatedBySlug.set(main.slug, group.filter((item) => item.slug !== main.slug));
  }

  return { canonical, relatedBySlug };
}
