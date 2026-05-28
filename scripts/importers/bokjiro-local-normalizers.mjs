import {
  GOVFIND_CATEGORIES,
  GOVFIND_REGIONS,
  clean,
  normalizeComparableText,
  normalizeSlug,
  oneLine,
  parseXmlCount,
  parseXmlItems,
  parseXmlObject,
  pick
} from "./bokjiro-central-normalizers.mjs";

export { clean, normalizeComparableText, normalizeSlug, oneLine, parseXmlCount, parseXmlItems, parseXmlObject, pick };
export { GOVFIND_CATEGORIES, GOVFIND_REGIONS };

export const BOKJIRO_LOCAL_SOURCE_NAME = "bokjiro-local";

const fieldAliases = {
  id: ["servId", "svcId", "wlfareInfoId", "id"],
  title: ["servNm", "servName", "serviceName", "wlfareInfoNm", "title"],
  summary: ["servDgst", "servDesc", "wlfareInfoOutlCn", "intrcn", "summary"],
  description: ["servDtlCn", "alwServCn", "sportCn", "sprtCn", "benefitCn", "description"],
  organizationName: ["jurMnofNm", "jurOrgNm", "bizChrDeptNm", "deptNm", "agency", "organizationName", "ctpvNm", "sggNm"],
  region: ["ctpvNm", "sggNm", "localNm", "region"],
  target: ["tgtrDtlCn", "sprtTrgetCn", "sprtTrgtCn", "trgterIndvdlArray", "lifeArray", "target"],
  selectionCriteria: ["slctCritCn", "slctCrit", "slctCndCn", "selStdCn", "selectionCriteria"],
  applicationMethod: ["aplyMtdCn", "aplyMtd", "reqstMthdCn", "reqstMthd", "applyMthdCn", "applicationMethod"],
  contact: ["rprsCtadr", "inqplCtadrList", "contact"],
  officialUrl: ["servDtlLink", "svcUrl", "url", "officialUrl"],
  category: ["servSeDetailNm", "servSeCode", "wlfareInfoReldBztpCd", "category"],
  status: ["aplyMtdCn", "reqstMthdCn", "servDtlCn", "status"],
  updatedAt: ["lastModYmd", "modYmd", "updDt", "sourceUpdatedAt"],
  startDate: ["enfcBgngYmd", "aplyBgngYmd", "startDate"],
  endDate: ["enfcEndYmd", "aplyEndYmd", "endDate"]
};

const categoryByLabel = (label) => GOVFIND_CATEGORIES.find((category) => category === label) ?? label;
const regionByLabel = (label) => GOVFIND_REGIONS.find((region) => region === label) ?? label;

const CATEGORY = {
  youth: categoryByLabel("청년"),
  welfare: categoryByLabel("복지"),
  housing: categoryByLabel("주거"),
  employment: categoryByLabel("고용"),
  startup: categoryByLabel("창업"),
  smallBusiness: categoryByLabel("소상공인"),
  education: categoryByLabel("교육"),
  health: categoryByLabel("보건의료"),
  culture: categoryByLabel("문화생활"),
  farming: categoryByLabel("농림어업"),
  other: categoryByLabel("기타")
};

const REGION_PATTERNS = [
  ["서울", /서울|서울특별시/],
  ["경기", /경기|경기도/],
  ["부산", /부산|부산광역시/],
  ["인천", /인천|인천광역시/],
  ["대구", /대구|대구광역시/],
  ["광주", /광주|광주광역시/],
  ["대전", /대전|대전광역시/],
  ["울산", /울산|울산광역시/],
  ["세종", /세종|세종특별자치시/],
  ["강원", /강원|강원특별자치도/],
  ["충북", /충북|충청북도/],
  ["충남", /충남|충청남도/],
  ["전북", /전북|전라북도|전북특별자치도/],
  ["전남", /전남|전라남도/],
  ["경북", /경북|경상북도/],
  ["경남", /경남|경상남도/],
  ["제주", /제주|제주특별자치도/]
];

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

export function getExternalId(raw = {}) {
  const direct = pick(raw, fieldAliases.id);
  if (direct) return direct;
  const link = pick(raw, fieldAliases.officialUrl);
  return link.match(/wlfareInfoId=([^&]+)/)?.[1] ?? "";
}

export function normalizeOfficialUrl(value = "", sourceItemId = "") {
  const cleaned = oneLine(value);
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (sourceItemId) {
    return `https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=${encodeURIComponent(sourceItemId)}&wlfareInfoReldBztpCd=02`;
  }
  return null;
}

export function normalizeCategory(raw = {}) {
  const text = sourceText(raw);
  const sourceCategory = pick(raw, fieldAliases.category);

  if (/청년|청소년|대학생|청년층/.test(text)) return { value: CATEGORY.youth, confidence: "high", reason: null, sourceCategory };
  if (/주거|주택|임대|월세|전세|보증금/.test(text)) return { value: CATEGORY.housing, confidence: "high", reason: null, sourceCategory };
  if (/고용|취업|구직|일자리|직업훈련|실업/.test(text)) return { value: CATEGORY.employment, confidence: "high", reason: null, sourceCategory };
  if (/창업|벤처|사업화|기업지원/.test(text)) return { value: CATEGORY.startup, confidence: "high", reason: null, sourceCategory };
  if (/소상공인|자영업|전통시장/.test(text)) return { value: CATEGORY.smallBusiness, confidence: "high", reason: null, sourceCategory };
  if (/교육|학습|학교|입학|평생교육|훈련/.test(text)) return { value: CATEGORY.education, confidence: "high", reason: null, sourceCategory };
  if (/보건|건강|의료|진료|검진|병원|치료|요양/.test(text)) return { value: CATEGORY.health, confidence: "high", reason: null, sourceCategory };
  if (/문화|예술|체육|관광|여가/.test(text)) return { value: CATEGORY.culture, confidence: "high", reason: null, sourceCategory };
  if (/농업|어업|축산|수산|농림|귀농|귀어/.test(text)) return { value: CATEGORY.farming, confidence: "high", reason: null, sourceCategory };
  if (/복지|기초생활|저소득|취약|장애|노인|아동|출산|양육|한부모|급여|바우처|돌봄/.test(text)) {
    return { value: CATEGORY.welfare, confidence: "high", reason: null, sourceCategory };
  }

  return sourceCategory
    ? { value: CATEGORY.other, confidence: "low", reason: `unknown source category: ${sourceCategory}`, sourceCategory }
    : { value: CATEGORY.welfare, confidence: "medium", reason: "source category is missing; local welfare service mapped to 복지 for review", sourceCategory: null };
}

export function normalizeRegion(raw = {}) {
  const regionText = [pick(raw, fieldAliases.region), pick(raw, fieldAliases.organizationName), sourceText(raw)].join(" ");
  for (const [label, pattern] of REGION_PATTERNS) {
    if (pattern.test(regionText)) return { value: regionByLabel(label), confidence: "high", reason: null };
  }
  return { value: null, confidence: "low", reason: "local welfare region is not explicit in source fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = [];
  if (/청년|대학생|청소년/.test(text)) groups.push("청년");
  if (/구직|취업|실업|근로/.test(text)) groups.push("구직자");
  if (/소상공인|자영업/.test(text)) groups.push("소상공인");
  if (/임신|출산|양육|아동|보육|한부모/.test(text)) groups.push("가구/부모");
  if (/노인|어르신|고령|65세/.test(text)) groups.push("어르신");
  if (/장애/.test(text)) groups.push("장애인");
  if (/저소득|기초생활|차상위|취약/.test(text)) groups.push("취약계층");
  if (/농업|어업|축산|수산/.test(text)) groups.push("농어업인");
  return groups.length ? [...new Set(groups)] : ["일반"];
}

export function normalizeApplicationMethod(raw = {}) {
  return clean(pick(raw, fieldAliases.applicationMethod));
}

export function normalizeStatus(raw = {}) {
  const text = [pick(raw, fieldAliases.status), pick(raw, fieldAliases.applicationMethod), pick(raw, fieldAliases.description)].join(" ");
  if (/상시|수시|연중|계속/.test(text)) return { value: "상시", confidence: "high", reason: null };
  if (/마감|종료|접수마감/.test(text)) return { value: "마감", confidence: "medium", reason: null };
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in Bokjiro local fields" };
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

  const text = [pick(raw, fieldAliases.applicationMethod), pick(raw, fieldAliases.description)].join(" ");
  const dates = [...text.matchAll(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });
  return {
    startDate: explicitStart ?? dates[0] ?? null,
    endDate: explicitEnd ?? (dates.length > 1 ? dates[dates.length - 1] : null),
    confidence: explicitStart && explicitEnd ? "known" : "unknown",
    reason: explicitStart && explicitEnd ? null : "date range is not explicit in Bokjiro local fields"
  };
}

export function normalizeSearchKeywords(raw = {}, normalized = {}) {
  const terms = [
    normalized.title,
    normalized.category,
    normalized.region,
    normalized.organizationName,
    normalized.status,
    ...(normalized.targetGroups ?? []),
    ...oneLine(pick(raw, fieldAliases.summary)).split(/\s+/).slice(0, 8)
  ];
  return [...new Set(terms.map(oneLine).filter(Boolean))];
}

export function normalizeBokjiroLocalItem(listItem = {}, detail = {}) {
  const merged = { ...listItem, ...detail };
  const sourceItemId = getExternalId(merged);
  const title = pick(merged, fieldAliases.title);
  const category = normalizeCategory(merged);
  const region = normalizeRegion(merged);
  const status = normalizeStatus(merged);
  const dateRange = normalizeDateRange(merged);
  const organizationName = pick(merged, fieldAliases.organizationName) || "복지로 지자체";
  const officialUrl = normalizeOfficialUrl(pick(merged, fieldAliases.officialUrl), sourceItemId);
  const summary = pick(merged, fieldAliases.summary);
  const description = clean(pick(merged, fieldAliases.description));
  const supportContent = description || clean(pick(merged, ["alwServCn", "servDtlCn", "sprtCn", "sportCn"]));
  const eligibilityText = clean(pick(merged, fieldAliases.target));
  const selectionCriteria = clean(pick(merged, fieldAliases.selectionCriteria));
  const applicationMethod = normalizeApplicationMethod(merged);

  const normalized = {
    title,
    slug: `bokjiro-local-${normalizeSlug(title, sourceItemId || "service")}`,
    summary,
    description,
    category: category.value,
    sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
    sourceItemId,
    organizationName,
    targetGroups: normalizeTargetGroups(merged),
    region: region.value,
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod,
    applicationUrl: null,
    officialUrl,
    supportContent,
    eligibilityText,
    selectionCriteria,
    contact: pick(merged, fieldAliases.contact),
    lastVerifiedAt: new Date().toISOString(),
    sourceUpdatedAt: pick(merged, fieldAliases.updatedAt) || null,
    searchKeywords: [],
    normalization: {
      category,
      region,
      status,
      dateRange,
      reviewReasons: [category.reason, region.reason, status.reason, dateRange.reason].filter(Boolean)
    }
  };
  normalized.searchKeywords = normalizeSearchKeywords(merged, normalized);
  return normalized;
}
