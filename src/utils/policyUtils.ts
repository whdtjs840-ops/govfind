import type { Policy } from "../data/policies";

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
    policy.source,
    policy.agency,
    policy.region,
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

export function ddayNumber(policy: Pick<Policy, "dday">) {
  if (policy.dday === "D-Day") return 0;
  const match = policy.dday.match(/^D-(\d{1,3})$/);
  return match ? Number(match[1]) : null;
}

export function hasVariableDeadline(policy: Pick<Policy, "deadline" | "dday">) {
  const text = `${policy.deadline} ${policy.dday}`;
  return /지자체|지역별|기관별|별도|확인|상시|예정|접수중|모집중/.test(text) && ddayNumber(policy) === null;
}

export function deadlineDisplay(policy: Pick<Policy, "deadline" | "dday">) {
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
      return policy.status === "마감임박" && days !== null && days >= 0 && days <= limit;
    })
    .sort((a, b) => (ddayNumber(a) ?? 999) - (ddayNumber(b) ?? 999));
}

export function upcomingPolicies(items: Policy[]) {
  return items
    .filter((policy) => {
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
