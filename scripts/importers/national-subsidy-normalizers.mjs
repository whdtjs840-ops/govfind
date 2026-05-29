export const NATIONAL_SUBSIDY_SOURCE_NAME = "national-subsidy";

export const API_CANDIDATES = [
  {
    name: "기획재정부/공공데이터포털 국고보조금 공모사업 상세",
    portalUrl: "https://www.data.go.kr/",
    requestUrlStatus: "활용신청 후 OpenAPI 상세 화면에서 service endpoint 확인 필요",
    expectedFormat: "JSON 또는 XML",
    expectedPaging: ["pageNo", "numOfRows", "totalCount"]
  },
  {
    name: "기획재정부/공공데이터포털 국고보조금 정보",
    portalUrl: "https://www.data.go.kr/",
    requestUrlStatus: "활용신청 후 OpenAPI 상세 화면에서 service endpoint 확인 필요",
    expectedFormat: "JSON 또는 XML",
    expectedPaging: ["pageNo", "numOfRows", "totalCount"]
  },
  {
    name: "e나라도움 / 보조금통합포털 공모사업 공개 데이터",
    portalUrl: "https://www.gosims.go.kr/",
    requestUrlStatus: "보조금통합포털 또는 공공데이터포털 제공 API 확인 필요",
    expectedFormat: "JSON 또는 XML",
    expectedPaging: ["pageNo", "numOfRows", "totalCount"]
  }
];

export const ENV_KEY_CANDIDATES = [
  "GOVFIND_NATIONAL_SUBSIDY_API_KEY",
  "GOVFIND_ENARADOUM_API_KEY",
  "GOVFIND_MOEF_SUBSIDY_API_KEY"
];

export const ENDPOINT_ENV_KEY = "GOVFIND_NATIONAL_SUBSIDY_API_URL";

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

const fieldAliases = {
  id: [
    "pblancId",
    "pblancNo",
    "pbancNo",
    "bsnsId",
    "bizId",
    "sn",
    "seq",
    "id"
  ],
  title: [
    "pblancNm",
    "pbancNm",
    "bsnsNm",
    "bizNm",
    "title",
    "sj",
    "공모명",
    "사업명"
  ],
  summary: [
    "bsnsSumryCn",
    "bizSumry",
    "summary",
    "cn",
    "content",
    "사업개요",
    "공모개요"
  ],
  description: [
    "bsnsSumryCn",
    "bizCn",
    "description",
    "detailCn",
    "cn",
    "content",
    "사업내용"
  ],
  organizationName: [
    "jrsdInsttNm",
    "excInsttNm",
    "insttNm",
    "agencyNm",
    "deptNm",
    "organizationName",
    "기관명",
    "소관기관"
  ],
  region: [
    "areaNm",
    "region",
    "sidoNm",
    "ctprvnNm",
    "지역"
  ],
  category: [
    "realmNm",
    "fieldNm",
    "bsnsRealmNm",
    "category",
    "분야"
  ],
  target: [
    "trgetNm",
    "sprtTrget",
    "target",
    "지원대상",
    "신청대상"
  ],
  supportContent: [
    "sprtCn",
    "supportContent",
    "bsnsCn",
    "benefitCn",
    "지원내용"
  ],
  applicationMethod: [
    "reqstMthCn",
    "reqstMthPapersCn",
    "applyMth",
    "applicationMethod",
    "신청방법"
  ],
  officialUrl: [
    "pblancUrl",
    "pbancUrl",
    "detailUrl",
    "url",
    "link",
    "공고URL"
  ],
  applicationUrl: [
    "reqstUrl",
    "applyUrl",
    "applicationUrl",
    "pblancUrl",
    "pbancUrl",
    "url"
  ],
  contact: [
    "refrncNm",
    "inqireTel",
    "telNo",
    "contact",
    "문의처"
  ],
  period: [
    "reqstBeginEndDe",
    "reqstDt",
    "pblancBeginEndDe",
    "pbancRcptBgngDt",
    "pbancRcptEndDt",
    "period",
    "접수기간"
  ],
  updatedAt: [
    "creatPnttm",
    "updtDt",
    "registDt",
    "pubDate",
    "등록일"
  ]
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
    .slice(0, 90);
  return slug || String(fallback).toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || "policy";
}

export function getExternalId(raw = {}) {
  return pick(raw, fieldAliases.id) || normalizeComparableText(pick(raw, fieldAliases.title)).slice(0, 90);
}

export function normalizeOfficialUrl(value = "") {
  const cleaned = oneLine(value);
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^www\./i.test(cleaned)) return `https://${cleaned}`;
  return cleaned;
}

function sourceText(raw = {}) {
  return [
    pick(raw, fieldAliases.category),
    pick(raw, fieldAliases.title),
    pick(raw, fieldAliases.summary),
    pick(raw, fieldAliases.description),
    pick(raw, fieldAliases.target),
    pick(raw, fieldAliases.supportContent),
    pick(raw, fieldAliases.organizationName),
    pick(raw, fieldAliases.region)
  ].join(" ");
}

export function normalizeCategory(raw = {}) {
  const text = sourceText(raw);
  const sourceCategory = pick(raw, fieldAliases.category);
  if (/창업|스타트업|사업화|벤처|예비창업|초기창업/.test(text)) return { value: "창업", confidence: "medium", reason: null, sourceCategory };
  if (/소상공인|중소기업|기업|수출|판로|마케팅|인증|기술|R&D|연구개발|정책자금|융자|보증|투자|바우처|경영/.test(text)) return { value: "소상공인", confidence: "medium", reason: null, sourceCategory };
  if (/채용|고용|일자리|취업|근로|인력/.test(text)) return { value: "고용", confidence: "medium", reason: null, sourceCategory };
  if (/교육|훈련|역량|아카데미|연수/.test(text)) return { value: "교육", confidence: "medium", reason: null, sourceCategory };
  if (/농업|농식품|축산|어업|영농|귀농|임업|산림/.test(text)) return { value: "농림어업", confidence: "medium", reason: null, sourceCategory };
  if (/의료|보건|건강|질병|병원/.test(text)) return { value: "보건의료", confidence: "low", reason: "health-related subsidy category needs review", sourceCategory };
  if (/복지|생계|취약계층|장애인|노인|아동|한부모/.test(text)) return { value: "복지", confidence: "low", reason: "welfare subsidy category needs review", sourceCategory };
  return { value: "기타", confidence: "low", reason: "national subsidy category mapping gap", sourceCategory };
}

export function normalizeRegion(raw = {}) {
  const text = [pick(raw, fieldAliases.region), sourceText(raw)].join(" ");
  const patterns = [
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
  for (const [region, pattern] of patterns) {
    if (pattern.test(text)) return { value: region, confidence: "high", reason: null };
  }
  if (/전국|중앙부처|기획재정부|문화체육관광부|농림축산식품부|중소벤처기업부|고용노동부/.test(text)) {
    return { value: "전국", confidence: "medium", reason: null };
  }
  return { value: null, confidence: "low", reason: "region is not explicit in national subsidy fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = [];
  if (/청년/.test(text)) groups.push("청년");
  if (/소상공인|자영업/.test(text)) groups.push("소상공인");
  if (/중소기업|기업|법인|사업자/.test(text)) groups.push("기업");
  if (/창업|스타트업|벤처/.test(text)) groups.push("창업기업");
  if (/농업|어업|축산|임업/.test(text)) groups.push("농림어업인");
  if (/취약계층|장애인|노인|아동|한부모/.test(text)) groups.push("개인/가구");
  return [...new Set(groups)];
}

export function normalizeDateRange(raw = {}) {
  const text = pick(raw, fieldAliases.period);
  const explicitStart = normalizeYmd(raw?.pbancRcptBgngDt || raw?.reqstBgngDt || raw?.startDate);
  const explicitEnd = normalizeYmd(raw?.pbancRcptEndDt || raw?.reqstEndDt || raw?.endDate);
  if (explicitStart || explicitEnd) {
    return { startDate: explicitStart, endDate: explicitEnd, confidence: explicitStart && explicitEnd ? "known" : "unknown", reason: explicitStart && explicitEnd ? null : "partial date range" };
  }
  const matches = [...text.matchAll(/(20\d{2})[.\-/\s년]*(\d{1,2})[.\-/\s월]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });
  return {
    startDate: matches[0] ?? null,
    endDate: matches.length > 1 ? matches[matches.length - 1] : null,
    confidence: matches.length > 1 ? "known" : "unknown",
    reason: matches.length > 1 ? null : "date range is not explicit in national subsidy fields"
  };
}

function normalizeYmd(value = "") {
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function normalizeStatus(raw = {}) {
  const text = [pick(raw, fieldAliases.period), pick(raw, fieldAliases.title), pick(raw, fieldAliases.description)].join(" ");
  const { endDate } = normalizeDateRange(raw);
  if (/상시|수시|예산 소진|연중/.test(text)) return { value: "상시", confidence: "medium", reason: null };
  if (endDate) {
    const end = new Date(`${endDate}T23:59:59+09:00`);
    if (!Number.isNaN(end.getTime())) return { value: end.getTime() < Date.now() ? "마감" : "모집중", confidence: "known", reason: null };
  }
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in national subsidy fields" };
}

export function normalizeNationalSubsidyItem(raw = {}) {
  const sourceItemId = getExternalId(raw);
  const title = pick(raw, fieldAliases.title);
  const category = normalizeCategory(raw);
  const region = normalizeRegion(raw);
  const dateRange = normalizeDateRange(raw);
  const status = normalizeStatus(raw);
  const summary = pick(raw, fieldAliases.summary);
  const description = clean(pick(raw, fieldAliases.description));
  const supportContent = clean(pick(raw, fieldAliases.supportContent)) || description || summary;
  const targetGroups = normalizeTargetGroups(raw);
  const officialUrl = normalizeOfficialUrl(pick(raw, fieldAliases.officialUrl));
  const applicationUrl = normalizeOfficialUrl(pick(raw, fieldAliases.applicationUrl) || officialUrl);
  const organizationName = pick(raw, fieldAliases.organizationName);
  const applicationMethod = clean(pick(raw, fieldAliases.applicationMethod));
  const reviewReasons = [
    category.reason,
    region.reason,
    dateRange.reason,
    status.reason,
    !officialUrl && !applicationUrl ? "missing officialUrl/applicationUrl" : null,
    category.value === "기타" ? "category mapping gap" : null
  ].filter(Boolean);

  return {
    title,
    slug: `national-subsidy-${normalizeSlug(title, sourceItemId || "policy")}`,
    summary,
    description,
    category: category.value,
    sourceName: NATIONAL_SUBSIDY_SOURCE_NAME,
    sourceItemId,
    organizationName,
    targetGroups,
    region: region.value,
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod,
    applicationUrl,
    officialUrl,
    supportContent,
    eligibilityText: clean(pick(raw, fieldAliases.target)),
    selectionCriteria: "",
    contact: pick(raw, fieldAliases.contact),
    lastVerifiedAt: new Date().toISOString(),
    sourceUpdatedAt: pick(raw, fieldAliases.updatedAt) || null,
    searchKeywords: [],
    normalization: {
      sourceCategory: category.sourceCategory,
      categoryConfidence: category.confidence,
      regionConfidence: region.confidence,
      dateConfidence: dateRange.confidence,
      statusConfidence: status.confidence,
      reviewReasons
    }
  };
}

