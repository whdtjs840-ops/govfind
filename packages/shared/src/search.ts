import type { PolicyDetail, SearchQuery } from "./policy";

const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const compact = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

function containsTerm(text: string, term: string) {
  const normalizedText = normalize(text);
  const compactText = compact(text);
  const compactTerm = compact(term);
  if (normalizedText.includes(term) || compactText.includes(compactTerm)) return true;
  if (compactTerm === "근로장려금") return compactText.includes("근로") && compactText.includes("장려금");
  if (compactTerm === "청년월세") return compactText.includes("청년") && compactText.includes("월세");
  if (compactTerm === "소상공인정책자금") return compactText.includes("소상공인") && compactText.includes("정책자금");
  return false;
}

export function scorePolicy(policy: PolicyDetail, q = "") {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return 0;

  const weighted = [
    [policy.title, 12],
    [policy.summary, 5],
    [policy.supportSummary, 4],
    [policy.eligibilitySummary, 4],
    [policy.applyMethodSummary, 4],
    [policy.contentSummary, 3],
    [policy.category, 3],
    [policy.agencyName, 2],
    [policy.targetGroups.join(" "), 2],
    [policy.lifeStages.join(" "), 2]
  ] as const;

  return terms.reduce((total, term) => {
    return total + weighted.reduce((sum, [text, weight]) => sum + (containsTerm(text, term) ? weight : 0), 0);
  }, 0);
}

export function searchPolicies(items: PolicyDetail[], query: SearchQuery) {
  const page = Math.max(query.page ?? 1, 1);
  const limit = Math.min(Math.max(query.limit ?? 20, 1), 50);

  let filtered = items.filter((policy) => {
    if (query.category && policy.category !== query.category) return false;
    if (query.region && !policy.regions.includes(query.region) && !policy.regions.includes("전국")) return false;
    if (query.sourceSystem && policy.sourceSystem !== query.sourceSystem) return false;
    if (query.lifeStage && !policy.lifeStages.includes(query.lifeStage)) return false;
    if (query.target && !policy.targetGroups.includes(query.target)) return false;
    if (query.applyStatus && policy.applyStatus !== query.applyStatus) return false;
    if (query.applyType && policy.applyType !== query.applyType && policy.applyType !== "mixed") return false;
    return true;
  });

  if (query.q?.trim()) {
    filtered = filtered
      .map((policy) => ({ policy, score: scorePolicy(policy, query.q) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.policy.title.localeCompare(b.policy.title, "ko"))
      .map((item) => item.policy);
  } else {
    filtered = filtered.sort((a, b) => {
      const aEnd = a.applyEndAt ? new Date(a.applyEndAt).getTime() : Number.MAX_SAFE_INTEGER;
      const bEnd = b.applyEndAt ? new Date(b.applyEndAt).getTime() : Number.MAX_SAFE_INTEGER;
      return aEnd - bEnd || a.title.localeCompare(b.title, "ko");
    });
  }

  const total = filtered.length;
  const itemsPage = filtered.slice((page - 1) * limit, page * limit);
  return { page, limit, total, items: itemsPage };
}

export function getCanonicalCounts(items: PolicyDetail[]) {
  const total = items.length;
  const byCategory = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});
  return { total, byCategory };
}

export function getClosingSoonPolicies(items: PolicyDetail[], today = new Date()) {
  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  return items
    .filter((item) => item.applyEndAt && ["open", "closing"].includes(item.applyStatus))
    .map((item) => {
      const end = new Date(item.applyEndAt as string);
      end.setHours(0, 0, 0, 0);
      const dday = Math.ceil((end.getTime() - start.getTime()) / 86_400_000);
      return { ...item, dday };
    })
    .filter((item) => item.dday >= 0 && item.dday <= 14)
    .sort((a, b) => a.dday - b.dday);
}
