export const BIZINFO_SOURCE_NAME = "bizinfo";

export const GOVFIND_CATEGORIES = [
  "청년",
  "복지",
  "주거",
  "고용",
  "창업",
  "교육",
  "보건의료",
  "문화생활",
  "농림어업",
  "소상공인"
];

export const GOVFIND_REGIONS = [
  "전국",
  "서울",
  "경기",
  "인천",
  "부산",
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
  "제주",
  "지역별"
];

const fieldAliases = {
  id: ["pblancId", "seq", "pblancNo", "id"],
  title: ["pblancNm", "title"],
  summary: ["bsnsSumryCn", "description"],
  description: ["bsnsSumryCn", "description"],
  organizationName: ["jrsdInsttNm", "author", "excInsttNm"],
  implementingAgency: ["excInsttNm"],
  region: ["hashTags"],
  target: ["trgetNm"],
  applicationMethod: ["reqstMthPapersCn"],
  contact: ["refrncNm"],
  officialUrl: ["pblancUrl", "link"],
  applicationUrl: ["rceptEngnHmpgUrl", "pblancUrl", "link"],
  category: ["pldirSportRealmLclasCodeNm", "lcategory"],
  updatedAt: ["creatPnttm", "pubDate"],
  period: ["reqstBeginEndDe", "reqstDt"],
  supportContent: ["bsnsSumryCn", "description"],
  fileUrl: ["flpthNm", "printFlpthNm"]
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
  const blocks = [...String(xml).matchAll(/<item>([\s\S]*?)<\/item>/g)];
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
  if (!cleaned) return "https://www.bizinfo.go.kr";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^www\./i.test(cleaned)) return `https://${cleaned}`;
  return cleaned.startsWith("/") ? `https://www.bizinfo.go.kr${cleaned}` : cleaned;
}

function sourceText(raw = {}) {
  return [
    pick(raw, fieldAliases.category),
    pick(raw, fieldAliases.title),
    pick(raw, fieldAliases.summary),
    pick(raw, fieldAliases.description),
    pick(raw, fieldAliases.target),
    pick(raw, fieldAliases.organizationName),
    pick(raw, fieldAliases.region)
  ].join(" ");
}

export function normalizeCategory(raw = {}) {
  const sourceCategory = pick(raw, fieldAliases.category);
  const text = sourceText(raw);
  if (/창업|스타트업|벤처|예비창업|창업기업/.test(text)) return { value: "창업", confidence: "high", reason: null, sourceCategory };
  if (/인력|채용|고용|일자리|근로|교육훈련|직무/.test(text)) return { value: "고용", confidence: "medium", reason: null, sourceCategory };
  if (/교육|연수|훈련|컨설팅|멘토링|세미나|역량/.test(text)) return { value: "교육", confidence: "medium", reason: null, sourceCategory };
  if (/농식품|농업|어업|수산|축산|임업/.test(text)) return { value: "농림어업", confidence: "high", reason: null, sourceCategory };
  if (/주거|공장|입주|공간|사무실|센터 입주/.test(text)) return { value: "주거", confidence: "low", reason: "business facility support mapped to housing-like space category", sourceCategory };
  if (/금융|자금|대출|보증|투자|바우처|경영|기술|수출|내수|판로|마케팅|소상공인|중소기업|기업/.test(text)) {
    return { value: "소상공인", confidence: "medium", reason: null, sourceCategory };
  }
  return { value: "소상공인", confidence: "low", reason: "bizinfo category needs review but maps to business support", sourceCategory };
}

const REGION_PATTERNS = [
  ["서울", /서울/],
  ["경기", /경기|경기도/],
  ["인천", /인천/],
  ["부산", /부산/],
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
  if (/전국|중소벤처기업부|산업통상자원부|고용노동부|과학기술정보통신부|환경부|해양수산부/.test(text)) {
    return { value: "전국", confidence: "medium", reason: null };
  }
  for (const [region, pattern] of REGION_PATTERNS) {
    if (pattern.test(text)) return { value: region, confidence: "high", reason: null };
  }
  return { value: null, confidence: "low", reason: "region is not explicit in Bizinfo fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = [];
  if (/소상공인|자영업|소기업/.test(text)) groups.push("소상공인");
  if (/창업|스타트업|벤처|예비창업/.test(text)) groups.push("창업기업");
  if (/중소기업|기업|법인|사업자/.test(text)) groups.push("기업");
  if (/청년/.test(text)) groups.push("청년");
  return [...new Set(groups.length ? groups : ["기업"])];
}

export function normalizeApplicationMethod(raw = {}) {
  return clean(pick(raw, fieldAliases.applicationMethod));
}

export function normalizeStatus(raw = {}) {
  const text = [pick(raw, fieldAliases.period), pick(raw, fieldAliases.applicationMethod), pick(raw, fieldAliases.title)].join(" ");
  const { endDate } = normalizeDateRange(raw);
  if (/상시|수시|예산 소진|연중/.test(text)) return { value: "상시", confidence: "medium", reason: null };
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59+09:00`);
    if (!Number.isNaN(end.getTime())) {
      return { value: end.getTime() < Date.now() ? "마감" : "모집중", confidence: "known", reason: null };
    }
  }
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in Bizinfo fields" };
}

function normalizeYmd(value = "") {
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function normalizeDateRange(raw = {}) {
  const text = pick(raw, fieldAliases.period);
  const matches = [...text.matchAll(/(20\d{2})[.\-/\s년]*(\d{1,2})[.\-/\s월]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });
  const compact = text.split("~").map(normalizeYmd).filter(Boolean);
  const dates = matches.length ? matches : compact;
  return {
    startDate: dates[0] ?? null,
    endDate: dates.length > 1 ? dates[dates.length - 1] : null,
    confidence: dates.length > 1 ? "known" : "unknown",
    reason: dates.length > 1 ? null : "date range is not explicit in Bizinfo fields"
  };
}

export function normalizeBizinfoItem(raw = {}) {
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
  const applicationMethod = normalizeApplicationMethod(raw);
  const organizationName = pick(raw, fieldAliases.organizationName) || "기업마당";
  const officialUrl = normalizeOfficialUrl(pick(raw, fieldAliases.officialUrl));
  const applicationUrl = normalizeOfficialUrl(pick(raw, fieldAliases.applicationUrl) || officialUrl);
  const normalized = {
    title,
    slug: `bizinfo-${normalizeSlug(title, sourceItemId || "policy")}`,
    summary,
    description,
    category: category.value,
    sourceName: BIZINFO_SOURCE_NAME,
    sourceItemId,
    organizationName,
    targetGroups: normalizeTargetGroups(raw),
    region: region.value,
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod,
    applicationUrl,
    officialUrl,
    supportContent,
    eligibilityText,
    selectionCriteria: "",
    contact: pick(raw, fieldAliases.contact) || pick(raw, fieldAliases.implementingAgency),
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
