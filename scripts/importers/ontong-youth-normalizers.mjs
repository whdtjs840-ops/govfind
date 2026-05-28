export const ONTONG_YOUTH_SOURCE_NAME = "ontong-youth";

export const GOVFIND_CATEGORIES = [
  "청년",
  "복지",
  "주거",
  "고용",
  "창업",
  "소상공인",
  "교육",
  "보건의료",
  "문화생활",
  "농림어업",
  "기타"
];

export const GOVFIND_REGIONS = [
  "전국",
  "서울",
  "경기",
  "부산",
  "인천",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주"
];

const fieldAliases = {
  id: ["plcyNo", "bizId", "policyId", "polyBizSecd", "id"],
  title: ["plcyNm", "polyBizSjnm", "policyName", "title"],
  summary: ["plcyExplnCn", "polyItcnCn", "policyCn", "summary"],
  description: ["plcyExplnCn", "polyItcnCn", "sprtCn", "supportCn", "policyCn", "description"],
  organizationName: ["sprvsnInstCdNm", "operInstCdNm", "cnsgNmor", "rgtrInstCdNm", "agency", "organizationName"],
  region: ["zipCd", "rgtrHghrkInstCdNm", "rgtrUpInstCdNm", "rgtrInstCdNm", "lclsfNm", "region"],
  target: ["addAplyQlfcCndCn", "sprtTrgtCn", "ageInfo", "target", "plcyMajorCdNm", "jobCdNm"],
  selectionCriteria: ["slctCritCn", "earnCndCn", "mrgSttsCdNm", "splzRlmRqisCn", "selectionCriteria"],
  applicationMethod: ["plcyAplyMthdCn", "aplyMthdCn", "rqutProcCn", "apply", "aplyYmd"],
  contact: ["operInstCdNm", "sprvsnInstCdNm", "cnsgNmor", "etcMttrCn", "contact"],
  officialUrl: ["aplyUrlAddr", "refUrlAddr1", "refUrlAddr2", "rfcSiteUrlAddr", "url"],
  category: ["plcyMajorCdNm", "lclsfNm", "mclsfNm", "policyType", "category"],
  status: ["aplyYmd", "bizPrdCn", "plcyAplyMthdCn", "status"],
  updatedAt: ["lastMdfcnDt", "mdfcnDt", "regDt", "sourceUpdatedAt"],
  startDate: ["aplyBgngYmd", "bizPrdBgngYmd", "startDate"],
  endDate: ["aplyEndYmd", "bizPrdEndYmd", "endDate"],
  supportContent: ["sprtCn", "supportCn", "plcyExplnCn", "polyItcnCn"]
};

export function decodeXml(value = "") {
  return String(value ?? "")
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replaceAll("<br />", "\n")
    .replaceAll("<br/>", "\n")
    .replaceAll("<br>", "\n")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replace(/\r/g, "")
    .trim();
}

export function clean(value = "") {
  return decodeXml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function oneLine(value = "") {
  return clean(value).replace(/\s+/g, " ").trim();
}

export function pick(source, names) {
  for (const name of names) {
    const value = source?.[name];
    if (value !== undefined && value !== null && String(value).trim()) return oneLine(value);
  }
  return "";
}

export function parseXmlObject(xml = "") {
  const record = {};
  for (const match of String(xml).matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
    record[match[1]] = decodeXml(match[2]);
  }
  return record;
}

export function parseXmlItems(xml = "") {
  const blocks = [...String(xml).matchAll(/<(?:youthPolicy|youthPlcy|policy|item|row)>([\s\S]*?)<\/(?:youthPolicy|youthPlcy|policy|item|row)>/g)];
  return blocks.map(([, body]) => parseXmlObject(body));
}

export function normalizeComparableText(value = "") {
  return oneLine(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSlug(value = "", fallback = "policy") {
  const slug = normalizeComparableText(value)
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || String(fallback).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || "policy";
}

export function getExternalId(raw = {}) {
  return pick(raw, fieldAliases.id) || normalizeComparableText(pick(raw, fieldAliases.title)).slice(0, 80);
}

export function normalizeOfficialUrl(value = "") {
  const cleaned = oneLine(value);
  if (!cleaned) return "https://www.youthcenter.go.kr";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^www\./i.test(cleaned)) return `https://${cleaned}`;
  return cleaned.startsWith("/") ? `https://www.youthcenter.go.kr${cleaned}` : cleaned;
}

function sourceText(raw = {}) {
  return [
    pick(raw, fieldAliases.category),
    pick(raw, fieldAliases.title),
    pick(raw, fieldAliases.summary),
    pick(raw, fieldAliases.description),
    pick(raw, fieldAliases.target),
    pick(raw, fieldAliases.selectionCriteria),
    pick(raw, fieldAliases.organizationName),
    pick(raw, fieldAliases.region)
  ].join(" ");
}

export function normalizeCategory(raw = {}) {
  const text = sourceText(raw);
  const sourceCategory = pick(raw, fieldAliases.category);

  if (/주거|주택|월세|전세|임대|보증금|부동산/.test(text)) return { value: "주거", confidence: "high", reason: null, sourceCategory };
  if (/취업|고용|구직|일자리|채용|직무|인턴|면접|자격증/.test(text)) return { value: "고용", confidence: "high", reason: null, sourceCategory };
  if (/창업|스타트업|벤처|사업화|로컬크리에이터/.test(text)) return { value: "창업", confidence: "high", reason: null, sourceCategory };
  if (/소상공인|자영업|상권/.test(text)) return { value: "소상공인", confidence: "high", reason: null, sourceCategory };
  if (/교육|학습|대학|학자금|장학|훈련|멘토링|역량/.test(text)) return { value: "교육", confidence: "high", reason: null, sourceCategory };
  if (/건강|의료|보건|심리|상담|치료|마음/.test(text)) return { value: "보건의료", confidence: "high", reason: null, sourceCategory };
  if (/문화|예술|체육|관광|축제|동아리|커뮤니티/.test(text)) return { value: "문화생활", confidence: "high", reason: null, sourceCategory };
  if (/농업|어업|농촌|귀농|귀어/.test(text)) return { value: "농림어업", confidence: "high", reason: null, sourceCategory };
  if (/복지|생활|수당|자산|금융|대출|저축|도약계좌|지원금/.test(text)) return { value: "복지", confidence: "medium", reason: null, sourceCategory };
  return { value: "청년", confidence: "medium", reason: null, sourceCategory };
}

const REGION_PATTERNS = [
  ["서울", /서울/],
  ["경기", /경기|경기도/],
  ["부산", /부산/],
  ["인천", /인천/],
  ["대구", /대구/],
  ["광주", /광주/],
  ["대전", /대전/],
  ["울산", /울산/],
  ["세종", /세종/],
  ["강원", /강원/],
  ["충북", /충북|충청북도/],
  ["충남", /충남|충청남도/],
  ["전북", /전북|전라북도/],
  ["전남", /전남|전라남도/],
  ["경북", /경북|경상북도/],
  ["경남", /경남|경상남도/],
  ["제주", /제주/]
];

export function normalizeRegion(raw = {}) {
  const text = [pick(raw, fieldAliases.region), pick(raw, fieldAliases.organizationName), sourceText(raw)].join(" ");
  if (/전국|중앙부처|고용노동부|국토교통부|중소벤처기업부|교육부|보건복지부/.test(text)) return { value: "전국", confidence: "medium", reason: null };
  for (const [region, pattern] of REGION_PATTERNS) {
    if (pattern.test(text)) return { value: region, confidence: "high", reason: null };
  }
  return { value: null, confidence: "low", reason: "region is not explicit in OnTongYouth fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = ["청년"];
  if (/구직|취업|실업|면접|채용/.test(text)) groups.push("구직자");
  if (/창업|스타트업|예비창업/.test(text)) groups.push("소상공인");
  if (/대학|학자금|장학|학생/.test(text)) groups.push("청년");
  if (/신혼|부부|가구|부모/.test(text)) groups.push("가구/부모");
  return [...new Set(groups)];
}

export function normalizeApplicationMethod(raw = {}) {
  return clean(pick(raw, fieldAliases.applicationMethod));
}

export function normalizeStatus(raw = {}) {
  const text = [pick(raw, fieldAliases.status), pick(raw, fieldAliases.applicationMethod)].join(" ");
  if (/상시|수시|연중|계속/.test(text)) return { value: "상시", confidence: "medium", reason: null };
  if (/마감|종료|접수마감/.test(text)) return { value: "마감", confidence: "medium", reason: null };
  if (/모집|접수|신청/.test(text) && /\d{4}|상시|기간/.test(text)) return { value: "모집중", confidence: "low", reason: "application text implies open status but needs official confirmation" };
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in OnTongYouth fields" };
}

function normalizeYmd(value = "") {
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length !== 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function normalizeDateRange(raw = {}) {
  const explicitStart = normalizeYmd(pick(raw, fieldAliases.startDate));
  const explicitEnd = normalizeYmd(pick(raw, fieldAliases.endDate));
  if (explicitStart && explicitEnd) return { startDate: explicitStart, endDate: explicitEnd, confidence: "known", reason: null };
  const text = [pick(raw, fieldAliases.status), pick(raw, fieldAliases.applicationMethod), pick(raw, ["aplyYmd", "rqutPrdCn", "bizPrdCn"])].join(" ");
  const dates = [...text.matchAll(/(20\d{2})[.\-/\s년]*(\d{1,2})[.\-/\s월]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });
  return {
    startDate: explicitStart ?? dates[0] ?? null,
    endDate: explicitEnd ?? (dates.length > 1 ? dates[dates.length - 1] : null),
    confidence: explicitStart && explicitEnd ? "known" : "unknown",
    reason: explicitStart && explicitEnd ? null : "date range is not explicit in OnTongYouth fields"
  };
}

export function normalizeOntongYouthItem(raw = {}) {
  const sourceItemId = getExternalId(raw);
  const title = pick(raw, fieldAliases.title);
  const category = normalizeCategory(raw);
  const region = normalizeRegion(raw);
  const status = normalizeStatus(raw);
  const dateRange = normalizeDateRange(raw);
  const summary = pick(raw, fieldAliases.summary);
  const description = clean(pick(raw, fieldAliases.description));
  const supportContent = clean(pick(raw, fieldAliases.supportContent)) || description || summary;
  const eligibilityText = clean(pick(raw, fieldAliases.target));
  const selectionCriteria = clean(pick(raw, fieldAliases.selectionCriteria));
  const applicationMethod = normalizeApplicationMethod(raw);
  const organizationName = pick(raw, fieldAliases.organizationName) || "온통청년";
  const officialUrl = normalizeOfficialUrl(pick(raw, fieldAliases.officialUrl));
  const normalized = {
    title,
    slug: `ontong-youth-${normalizeSlug(title, sourceItemId || "policy")}`,
    summary,
    description,
    category: category.value,
    sourceName: ONTONG_YOUTH_SOURCE_NAME,
    sourceItemId,
    organizationName,
    targetGroups: normalizeTargetGroups(raw),
    region: region.value,
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod,
    applicationUrl: officialUrl,
    officialUrl,
    supportContent,
    eligibilityText,
    selectionCriteria,
    contact: pick(raw, fieldAliases.contact),
    lastVerifiedAt: new Date().toISOString(),
    sourceUpdatedAt: pick(raw, fieldAliases.updatedAt) || null,
    searchKeywords: [],
    normalization: {
      category,
      region,
      status,
      dateRange,
      reviewReasons: [category.reason, region.reason, status.reason, dateRange.reason].filter(Boolean)
    }
  };
  normalized.searchKeywords = [
    normalized.title,
    normalized.category,
    normalized.region,
    normalized.organizationName,
    normalized.status,
    ...(normalized.targetGroups ?? []),
    ...oneLine(summary).split(/\s+/).slice(0, 8)
  ].filter(Boolean);
  return normalized;
}
