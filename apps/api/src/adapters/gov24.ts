import type { ApplyStatus, ApplyType } from "@govfind/shared";
import type { NormalizedPolicy, RawPolicy, SourceAdapter, SourceFetchOptions } from "./types";

const endpoint = "https://api.odcloud.kr/api/gov24/v3";
const sourceName = "gov24-public-service-benefits" as const;

function value(raw: RawPolicy, keys: string[]) {
  for (const key of keys) {
    const found = raw[key];
    if (found !== undefined && found !== null && String(found).trim()) return String(found).trim();
  }
  return "";
}

function clean(input = "") {
  return String(input)
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function compact(input = "") {
  return clean(input).replace(/\s+/g, " ");
}

function lines(input = "", limit = 5) {
  return clean(input)
    .split(/\n|(?:\s{2,})|[•·○\-]\s*/)
    .map((item) => compact(item))
    .filter(Boolean)
    .slice(0, limit);
}

function slugify(input: string, fallback: string) {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || fallback;
}

function normalizeCategory(raw: RawPolicy) {
  const text = `${value(raw, ["서비스명", "서비스목적요약", "지원내용", "지원대상", "서비스분야"])} ${value(raw, ["서비스분야"])}`;
  if (/주거|주택|월세|전세|임대|보증/.test(text)) return "주거";
  if (/창업|기업|소상공인|자영업|중소기업|정책자금/.test(text)) return /소상공인|자영업/.test(text) ? "소상공인" : "창업";
  if (/취업|고용|일자리|구직|직업|훈련/.test(text)) return "고용";
  if (/청년|대학생/.test(text)) return "청년";
  if (/교육|학습|학교|장학|유아학비/.test(text)) return "교육";
  if (/보건|건강|의료|진료|검진/.test(text)) return "보건의료";
  if (/농업|어업|축산|수산|어촌|농림/.test(text)) return "농림어업";
  return "복지";
}

function normalizeRegions(raw: RawPolicy) {
  const text = `${value(raw, ["소관기관명", "부서명", "지원대상", "서비스명"])} ${value(raw, ["소관기관유형"])}`;
  if (/서울/.test(text)) return { regionScope: "sido" as const, regions: ["서울"] };
  if (/경기/.test(text)) return { regionScope: "sido" as const, regions: ["경기"] };
  if (/인천/.test(text)) return { regionScope: "sido" as const, regions: ["인천"] };
  if (/부산/.test(text)) return { regionScope: "sido" as const, regions: ["부산"] };
  if (/대구/.test(text)) return { regionScope: "sido" as const, regions: ["대구"] };
  if (/광주/.test(text)) return { regionScope: "sido" as const, regions: ["광주"] };
  if (/대전/.test(text)) return { regionScope: "sido" as const, regions: ["대전"] };
  if (/시청|군청|구청|지자체|지방자치/.test(text)) return { regionScope: "mixed" as const, regions: ["지역별"] };
  return { regionScope: "nationwide" as const, regions: ["전국"] };
}

function normalizeTargetGroups(raw: RawPolicy) {
  const text = value(raw, ["지원대상", "사용자구분", "서비스명", "서비스목적요약"]);
  const targetPatterns: Array<[RegExp, string]> = [
    [/청년|대학생/, "청년"],
    [/소상공인|자영업|사업자|기업/, "소상공인"],
    [/신혼/, "신혼부부"],
    [/임신|출산|육아|아동|보육/, "부모/육아"],
    [/노인|어르신|고령/, "어르신"],
    [/장애/, "장애인"],
    [/농업|어업|어촌|농림/, "농어업인"],
    [/구직|취업|실업/, "구직자"]
  ];
  const groups = targetPatterns
    .filter(([pattern]) => pattern.test(text))
    .map(([, label]) => label as string);
  return groups.length ? [...new Set(groups)] : ["일반"];
}

function normalizeLifeStages(targetGroups: string[]) {
  return targetGroups.includes("청년") ? ["청년"] : targetGroups;
}

function parseDate(input = "") {
  const text = compact(input);
  const match = text.match(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})/);
  if (!match) return null;
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function normalizePeriod(raw: RawPolicy) {
  const deadline = value(raw, ["신청기한", "접수기간", "신청기간"]);
  const dates = [...deadline.matchAll(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });
  return {
    applyStartAt: dates[0] ?? null,
    applyEndAt: dates.length > 1 ? dates[dates.length - 1] : parseDate(deadline)
  };
}

function normalizeApplyStatus(raw: RawPolicy): ApplyStatus {
  const deadline = value(raw, ["신청기한", "접수기간", "신청기간"]);
  if (!deadline) return "check";
  if (/상시|수시|연중/.test(deadline)) return "always";
  if (/예정/.test(deadline)) return "scheduled";
  if (/마감|종료/.test(deadline)) return "closed";
  return "open";
}

function normalizeApplyType(raw: RawPolicy): ApplyType {
  const onlineUrl = value(raw, ["온라인신청사이트URL", "온라인신청사이트Url", "온라인신청URL"]);
  const method = value(raw, ["신청방법", "신청절차"]);
  if (onlineUrl) return "online";
  if (/온라인/.test(method) && /방문|우편|오프라인/.test(method)) return "mixed";
  if (/온라인/.test(method)) return "online";
  if (/방문|우편|오프라인/.test(method)) return "offline";
  return "check";
}

function sourceItemId(raw: RawPolicy) {
  return value(raw, ["서비스ID", "서비스아이디", "서비스ID ", "서비스id", "서비스Id", "id"]) || value(raw, ["서비스명"]);
}

function officialUrl(raw: RawPolicy) {
  return value(raw, ["온라인신청사이트URL", "온라인신청사이트Url", "온라인신청URL", "상세조회URL"]) || "https://www.gov.kr";
}

function sourceUrl(raw: RawPolicy) {
  return value(raw, ["상세조회URL", "서비스상세URL", "원문URL"]) || officialUrl(raw);
}

function mergeRaw(listItem: RawPolicy, detail: RawPolicy) {
  return { ...listItem, ...(detail.detail && typeof detail.detail === "object" ? (detail.detail as RawPolicy) : detail) };
}

export function normalizeGov24PublicService(raw: RawPolicy): NormalizedPolicy {
  const listItem = raw.listItem && typeof raw.listItem === "object" ? (raw.listItem as RawPolicy) : raw;
  const detail = raw.detail && typeof raw.detail === "object" ? (raw.detail as RawPolicy) : {};
  const merged = mergeRaw(listItem, detail);
  const id = sourceItemId(merged);
  const title = value(merged, ["서비스명", "title"]) || `Gov24 service ${id}`;
  const summary = compact(value(merged, ["서비스목적요약", "서비스목적", "summary"])) || "Official public service benefit information from Gov24.";
  const category = normalizeCategory(merged);
  const region = normalizeRegions(merged);
  const targetGroups = normalizeTargetGroups(merged);
  const period = normalizePeriod(merged);
  const supportSummary = compact(value(merged, ["지원내용", "서비스목적요약"])) || summary;
  const eligibilitySummary = compact(value(merged, ["지원대상", "선정기준"])) || "Check official eligibility requirements before applying.";
  const applyMethodSummary = compact(value(merged, ["신청방법", "신청절차"])) || "Check the official application channel before applying.";
  const requiredDocs = lines(value(merged, ["구비서류", "제출서류"]), 8);
  const agencyName = value(merged, ["소관기관명", "부서명", "agency"]) || "Gov24";

  return {
    slug: `gov24-${slugify(title, id || "service")}`,
    title,
    summary,
    category,
    agencyName,
    regionScope: region.regionScope,
    regions: region.regions,
    applyType: normalizeApplyType(merged),
    applyStatus: normalizeApplyStatus(merged),
    applyStartAt: period.applyStartAt,
    applyEndAt: period.applyEndAt,
    supportSummary,
    eligibilitySummary,
    contentSummary: supportSummary,
    applyMethodSummary,
    officialUrl: officialUrl(merged),
    sourceUrl: sourceUrl(merged),
    sourceSystem: sourceName,
    sourceExternalId: id || title,
    lifeStages: normalizeLifeStages(targetGroups),
    targetGroups,
    requiredDocs,
    lastCheckedAt: new Date().toISOString(),
    faq: [],
    rawJson: raw
  };
}

async function request(path: string, params: Record<string, string | number>) {
  const key = process.env.GOVFIND_GOV24_API_KEY;
  if (!key) throw new Error("GOVFIND_GOV24_API_KEY is not set");

  const url = new URL(`${endpoint}/${path}`);
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("returnType", "JSON");
  for (const [name, item] of Object.entries(params)) {
    url.searchParams.set(name, String(item));
  }

  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) throw new Error(`Gov24 request failed ${response.status}: ${body.slice(0, 200)}`);
  const json = JSON.parse(body);
  if (json.errorCode || /SERVICE_KEY|INVALID/i.test(String(json.message ?? ""))) {
    throw new Error(String(json.message ?? "Gov24 API authentication failed"));
  }
  return json;
}

export const gov24PublicServiceBenefitsAdapter: SourceAdapter = {
  sourceName,
  sourceSystem: sourceName,
  async fetchList(options: SourceFetchOptions = {}) {
    const page = options.page ?? Number(process.env.GOVFIND_GOV24_PAGE || 1);
    const perPage = options.perPage ?? Number(process.env.GOVFIND_GOV24_PER_PAGE || 20);
    const json = await request("serviceList", { page, perPage });
    return Array.isArray(json.data) ? json.data : [];
  },
  async fetchDetail(raw) {
    const id = sourceItemId(raw);
    if (!id) return { listItem: raw, detail: {} };
    try {
      const json = await request("serviceDetail", {
        page: 1,
        perPage: 1,
        "cond[서비스ID::EQ]": id
      });
      return { listItem: raw, detail: Array.isArray(json.data) ? json.data[0] ?? {} : {} };
    } catch {
      return { listItem: raw, detail: {} };
    }
  },
  normalize: normalizeGov24PublicService
};

export const gov24Adapter = gov24PublicServiceBenefitsAdapter;
