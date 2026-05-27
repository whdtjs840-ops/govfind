export const BOKJIRO_CENTRAL_SOURCE_NAME = "bokjiro-central";

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
  id: ["servId", "svcId", "wlfareInfoId", "id"],
  title: ["servNm", "servName", "serviceName", "wlfareInfoNm", "title"],
  summary: ["servDgst", "servDesc", "wlfareInfoOutlCn", "intrcn", "summary"],
  description: ["servDtlCn", "alwServCn", "sportCn", "sprtCn", "benefitCn", "description"],
  organizationName: ["jurMnofNm", "jurOrgNm", "deptNm", "agency", "organizationName"],
  target: ["tgtrDtlCn", "sprtTrgetCn", "trgterIndvdlArray", "lifeArray", "target"],
  selectionCriteria: ["slctCritCn", "slctCrit", "slctCndCn", "selStdCn", "selectionCriteria"],
  applicationMethod: ["aplyMtdCn", "aplyMtd", "reqstMthdCn", "reqstMthd", "applyMthdCn", "applicationMethod"],
  requiredDocs: ["stdrDocCn", "reqstDcCn", "sbmsnDocCn", "requiredDocs"],
  contact: ["rprsCtadr", "inqplCtadrList", "contact"],
  officialUrl: ["servDtlLink", "svcUrl", "url", "officialUrl"],
  category: ["servSeDetailNm", "servSeCode", "wlfareInfoReldBztpCd", "category"],
  status: ["aplyMtdCn", "reqstMthdCn", "servDtlCn", "status"],
  updatedAt: ["lastModYmd", "modYmd", "updDt", "sourceUpdatedAt"]
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

export function parseXmlItems(xml = "") {
  const blocks = [...String(xml).matchAll(/<(?:item|servList|wantedList)>([\s\S]*?)<\/(?:item|servList|wantedList)>/g)];
  return blocks.map(([, body]) => parseXmlObject(body));
}

export function parseXmlObject(xml = "") {
  const record = {};
  for (const match of String(xml).matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
    record[match[1]] = decodeXml(match[2]);
  }
  return record;
}

export function parseXmlCount(xml = "") {
  const totalCount = String(xml).match(/<totalCount>([\s\S]*?)<\/totalCount>/)?.[1];
  const numOfRows = String(xml).match(/<numOfRows>([\s\S]*?)<\/numOfRows>/)?.[1];
  const pageNo = String(xml).match(/<pageNo>([\s\S]*?)<\/pageNo>/)?.[1];
  return {
    totalCount: totalCount ? Number(totalCount) : null,
    numOfRows: numOfRows ? Number(numOfRows) : null,
    pageNo: pageNo ? Number(pageNo) : null
  };
}

export function normalizeComparableText(value = "") {
  return oneLine(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSlug(value = "", fallback = "bokjiro-service") {
  const slug = normalizeComparableText(value)
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || fallback;
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
    return `https://www.bokjiro.go.kr/ssis-tbu/twataa/wlfareInfo/moveTWAT52011M.do?wlfareInfoId=${encodeURIComponent(sourceItemId)}&wlfareInfoReldBztpCd=01`;
  }
  return null;
}

function sourceText(raw = {}) {
  return [
    pick(raw, fieldAliases.category),
    pick(raw, fieldAliases.title),
    pick(raw, fieldAliases.summary),
    pick(raw, fieldAliases.description),
    pick(raw, fieldAliases.target),
    pick(raw, fieldAliases.selectionCriteria),
    pick(raw, fieldAliases.organizationName)
  ].join(" ");
}

export function normalizeCategory(raw = {}) {
  const text = sourceText(raw);
  const sourceCategory = pick(raw, fieldAliases.category);

  if (/청년|청소년|대학생|청년층/.test(text)) return { value: "청년", confidence: "high", reason: null, sourceCategory };
  if (/주거|주택|임대|월세|전세|보증금/.test(text)) return { value: "주거", confidence: "high", reason: null, sourceCategory };
  if (/고용|취업|구직|일자리|직업훈련|실업/.test(text)) return { value: "고용", confidence: "high", reason: null, sourceCategory };
  if (/창업|벤처|사업화|기업지원/.test(text)) return { value: "창업", confidence: "high", reason: null, sourceCategory };
  if (/소상공인|자영업|전통시장/.test(text)) return { value: "소상공인", confidence: "high", reason: null, sourceCategory };
  if (/교육|학습|학교|장학|평생교육|훈련/.test(text)) return { value: "교육", confidence: "high", reason: null, sourceCategory };
  if (/보건|건강|의료|진료|검진|병원|치료|요양/.test(text)) return { value: "보건의료", confidence: "high", reason: null, sourceCategory };
  if (/문화|예술|체육|관광|여가/.test(text)) return { value: "문화생활", confidence: "high", reason: null, sourceCategory };
  if (/농업|어업|축산|수산|농림|귀농|귀어/.test(text)) return { value: "농림어업", confidence: "high", reason: null, sourceCategory };
  if (/복지|기초생활|저소득|취약|장애|노인|아동|출산|영유아|한부모|급여|바우처|돌봄/.test(text)) {
    return { value: "복지", confidence: "high", reason: null, sourceCategory };
  }

  return sourceCategory
    ? { value: "기타", confidence: "low", reason: `unknown source category: ${sourceCategory}`, sourceCategory }
    : { value: "복지", confidence: "medium", reason: "source category is missing; central welfare service mapped to 복지 for review", sourceCategory: null };
}

export function normalizeRegion(raw = {}) {
  const text = sourceText(raw);
  const found = GOVFIND_REGIONS.find((region) => region !== "전국" && text.includes(region));
  if (found) return { value: found, confidence: "high", reason: null };
  if (/전국|중앙부처|보건복지부|고용노동부|교육부|여성가족부|국토교통부|국가보훈부/.test(text)) {
    return { value: "전국", confidence: "medium", reason: null };
  }
  return { value: null, confidence: "low", reason: "region is not provided by Bokjiro central fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = [];
  if (/청년|대학생|청소년/.test(text)) groups.push("청년");
  if (/구직|취업|실업|근로/.test(text)) groups.push("구직자");
  if (/소상공인|자영업/.test(text)) groups.push("소상공인");
  if (/임신|출산|영유아|아동|보육|한부모/.test(text)) groups.push("가구·부모");
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
  const text = [pick(raw, fieldAliases.status), pick(raw, fieldAliases.applicationMethod)].join(" ");
  if (/상시|수시|연중|계속/.test(text)) return { value: "상시", confidence: "high", reason: null };
  if (/마감|종료|접수마감/.test(text)) return { value: "마감", confidence: "medium", reason: null };
  if (/신청|접수|모집/.test(text)) return { value: "확인필요", confidence: "low", reason: "status requires official confirmation" };
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in Bokjiro fields" };
}

export function normalizeDateRange(raw = {}) {
  const text = [pick(raw, fieldAliases.applicationMethod), pick(raw, fieldAliases.description)].join(" ");
  const dates = [...text.matchAll(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });

  return {
    startDate: dates[0] ?? null,
    endDate: dates.length > 1 ? dates[dates.length - 1] : null,
    confidence: dates.length >= 2 ? "known" : "unknown",
    reason: dates.length >= 2 ? null : "date range is not explicit in Bokjiro fields"
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

export function normalizeBokjiroCentralItem(listItem = {}, detail = {}) {
  const merged = { ...listItem, ...detail };
  const sourceItemId = getExternalId(merged);
  const title = pick(merged, fieldAliases.title);
  const category = normalizeCategory(merged);
  const region = normalizeRegion(merged);
  const status = normalizeStatus(merged);
  const dateRange = normalizeDateRange(merged);
  const organizationName = pick(merged, fieldAliases.organizationName) || "복지로";
  const officialUrl = normalizeOfficialUrl(pick(merged, fieldAliases.officialUrl), sourceItemId);
  const applicationUrl = null;
  const summary = pick(merged, fieldAliases.summary);
  const description = clean(pick(merged, fieldAliases.description));
  const supportContent = description || clean(pick(merged, ["alwServCn", "servDtlCn", "sprtCn"]));
  const eligibilityText = clean(pick(merged, fieldAliases.target));
  const selectionCriteria = clean(pick(merged, fieldAliases.selectionCriteria));
  const applicationMethod = normalizeApplicationMethod(merged);

  const normalized = {
    title,
    slug: `bokjiro-central-${normalizeSlug(title, sourceItemId || "service")}`,
    summary,
    description,
    category: category.value,
    sourceName: BOKJIRO_CENTRAL_SOURCE_NAME,
    sourceItemId,
    organizationName,
    targetGroups: normalizeTargetGroups(merged),
    region: region.value,
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod,
    applicationUrl,
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
