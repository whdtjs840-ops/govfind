export const GOV24_SOURCE_NAME = "gov24-public-service-benefits";

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

export const GOVFIND_STATUSES = ["모집중", "마감임박", "상시", "마감", "확인필요"];

export const fieldAliases = {
  id: ["서비스ID", "서비스아이디", "serviceId", "id"],
  title: ["서비스명", "title"],
  summary: ["서비스목적요약", "서비스목적", "summary"],
  description: ["지원내용", "서비스내용", "benefit", "description"],
  organizationName: ["소관기관명", "부서명", "agency", "organizationName"],
  organizationType: ["소관기관유형", "organizationType"],
  region: ["지역", "시도", "법정시군구코드", "region"],
  target: ["지원대상", "사용자구분", "target"],
  criteria: ["선정기준", "criteria"],
  deadline: ["신청기한", "접수기간", "신청기간", "deadline"],
  applicationMethod: ["신청방법", "신청절차", "applicationMethod"],
  applicationUrl: ["온라인신청사이트URL", "온라인신청사이트Url", "applicationUrl"],
  officialUrl: ["상세조회URL", "온라인신청사이트URL", "officialUrl"],
  updatedAt: ["수정일시", "등록일시", "updatedAt"],
  category: ["서비스분야", "서비스구분", "category"]
};

export function pick(raw, names) {
  for (const name of names) {
    const value = raw?.[name];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim();
    }
  }
  return "";
}

export function clean(value = "") {
  return String(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function oneLine(value = "") {
  return clean(value).replace(/\s+/g, " ").trim();
}

export function normalizeComparableText(value = "") {
  return oneLine(value)
    .toLowerCase()
    .replace(/[·ㆍ･]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeSlug(value = "", fallback = "gov24-service") {
  const slug = normalizeComparableText(value)
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
  return slug || fallback;
}

function sourceText(raw) {
  return [
    pick(raw, fieldAliases.category),
    pick(raw, fieldAliases.title),
    pick(raw, fieldAliases.summary),
    pick(raw, fieldAliases.description),
    pick(raw, fieldAliases.target),
    pick(raw, fieldAliases.criteria),
    pick(raw, fieldAliases.organizationName)
  ].join(" ");
}

export function normalizeCategory(raw) {
  const text = sourceText(raw);
  const sourceCategory = pick(raw, fieldAliases.category);

  if (/청년|대학생|청소년/.test(text)) return { value: "청년", confidence: "high", reason: null };
  if (/주거|주택|전세|월세|임대|보증|분양/.test(text)) return { value: "주거", confidence: "high", reason: null };
  if (/소상공인|자영업|소기업|시장상인|전통시장/.test(text)) return { value: "소상공인", confidence: "high", reason: null };
  if (/창업|스타트업|벤처|사업화|창업기업/.test(text)) return { value: "창업", confidence: "high", reason: null };
  if (/취업|고용|일자리|구직|직업훈련|근로자|실업/.test(text)) return { value: "고용", confidence: "high", reason: null };
  if (/교육|학습|학교|학생|장학|유아학비|누리과정/.test(text)) return { value: "교육", confidence: "high", reason: null };
  if (/보건|건강|의료|진료|검진|병원|요양/.test(text)) return { value: "보건의료", confidence: "high", reason: null };
  if (/문화|예술|체육|스포츠|관광|여가/.test(text)) return { value: "문화생활", confidence: "high", reason: null };
  if (/농업|어업|축산|수산|농림|어촌|귀농|귀어/.test(text)) return { value: "농림어업", confidence: "high", reason: null };
  if (/복지|기초생활|장애|노인|아동|출산|육아|보육|수당|급여|바우처|취약계층|저소득|보훈/.test(text)) {
    return { value: "복지", confidence: "medium", reason: null };
  }

  return {
    value: "기타",
    confidence: "low",
    reason: sourceCategory ? `unknown source category: ${sourceCategory}` : "source category could not be mapped"
  };
}

export function normalizeRegion(raw) {
  const text = [
    pick(raw, fieldAliases.region),
    pick(raw, fieldAliases.organizationType),
    pick(raw, fieldAliases.organizationName),
    pick(raw, fieldAliases.title)
  ].join(" ");

  const regionMap = [
    ["서울", /서울/],
    ["경기", /경기/],
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

  const found = regionMap.find(([, pattern]) => pattern.test(text));
  if (found) return { value: found[0], confidence: "high", reason: null };

  if (/중앙행정기관|교육부|국세청|고용노동부|보건복지부|국토교통부|중소벤처기업부|해양수산부|문화체육관광부|농림축산식품부|금융위원회|법무부|국방부|통일부/.test(text)) {
    return { value: "전국", confidence: "high", reason: null };
  }

  if (/지자체|시청|군청|구청|지방자치|시도|시군구/.test(text)) {
    return { value: null, confidence: "low", reason: "local-government source without a specific region" };
  }

  return { value: null, confidence: "low", reason: "region could not be determined from source fields" };
}

export function normalizeTargetGroups(raw) {
  const text = sourceText(raw);
  const pairs = [
    ["청년", /청년|대학생|구직/],
    ["구직자", /구직|취업|실업|고용/],
    ["소상공인", /소상공인|자영업|사업자|전통시장/],
    ["신혼부부", /신혼/],
    ["부모/육아", /임신|출산|육아|영유아|유아|아동|보육|누리과정/],
    ["어르신", /노인|어르신|고령|65세/],
    ["장애인", /장애/],
    ["농어업인", /농업|어업|축산|수산|농림|어촌/]
  ];

  const groups = pairs.filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  return groups.length ? [...new Set(groups)] : ["일반"];
}

export function normalizeAgeGroups(raw) {
  const text = sourceText(raw);
  const groups = [];
  if (/영유아|유아|아동|어린이|3~5세|0세|1세|2세|3세|4세|5세/.test(text)) groups.push("아동");
  if (/청소년|중학생|고등학생/.test(text)) groups.push("청소년");
  if (/청년|대학생|19세|34세|39세/.test(text)) groups.push("청년");
  if (/중장년|40세|50세/.test(text)) groups.push("중장년");
  if (/노인|어르신|고령|65세/.test(text)) groups.push("어르신");
  return groups.length ? [...new Set(groups)] : ["전체"];
}

export function normalizeLifeCycle(raw) {
  const text = sourceText(raw);
  const cycles = [];
  if (/임신|출산|육아|보육|영유아|유아|아동/.test(text)) cycles.push("임신·출산·육아");
  if (/청년|대학생|구직/.test(text)) cycles.push("청년");
  if (/신혼|주거|전세|월세/.test(text)) cycles.push("주거");
  if (/취업|고용|일자리|직업훈련/.test(text)) cycles.push("취업");
  if (/창업|소상공인|자영업|사업자/.test(text)) cycles.push("사업");
  if (/노인|어르신|장애|복지|기초생활|저소득/.test(text)) cycles.push("복지");
  return cycles.length ? [...new Set(cycles)] : ["전체"];
}

export function normalizeStatus(raw) {
  const deadline = pick(raw, fieldAliases.deadline);
  if (!deadline) return { value: "확인필요", confidence: "low", reason: "deadline is missing" };
  if (/상시|수시|연중|계속/.test(deadline)) return { value: "상시", confidence: "high", reason: null };
  if (/마감|종료|접수마감/.test(deadline)) return { value: "마감", confidence: "medium", reason: null };

  const dateRange = normalizeDateRange(raw);
  if (dateRange.endDate) {
    const today = new Date();
    const end = new Date(`${dateRange.endDate}T23:59:59+09:00`);
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / 86400000);
    if (diffDays < 0) return { value: "마감", confidence: "high", reason: null };
    if (diffDays <= 14) return { value: "마감임박", confidence: "high", reason: null };
    return { value: "모집중", confidence: "high", reason: null };
  }

  if (/신청|접수|모집/.test(deadline)) return { value: "모집중", confidence: "medium", reason: null };
  return { value: "확인필요", confidence: "low", reason: `deadline could not be interpreted: ${deadline}` };
}

export function normalizeApplicationMethod(raw) {
  const method = clean(pick(raw, fieldAliases.applicationMethod));
  const applicationUrl = normalizeOfficialUrl(pick(raw, fieldAliases.applicationUrl));
  const parts = [];
  if (method) parts.push(method);
  if (applicationUrl) parts.push(`온라인: ${applicationUrl}`);
  return parts.join("\n\n");
}

export function normalizeOrganizationName(raw) {
  return oneLine(pick(raw, fieldAliases.organizationName));
}

export function normalizeOfficialUrl(value = "") {
  const cleaned = oneLine(value);
  if (!cleaned) return null;
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  return null;
}

export function normalizeDateRange(raw) {
  const deadline = pick(raw, fieldAliases.deadline);
  const dates = [...deadline.matchAll(/(20\d{2})[.\-/년\s]*(\d{1,2})[.\-/월\s]*(\d{1,2})/g)].map((match) => {
    const [, year, month, day] = match;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  });

  return {
    startDate: dates[0] ?? null,
    endDate: dates.length > 1 ? dates[dates.length - 1] : dates[0] ?? null
  };
}

export function normalizeSearchKeywords(raw, normalized) {
  const terms = [
    normalized.title,
    normalized.category,
    normalized.region,
    normalized.organizationName,
    normalized.status,
    ...(normalized.targetGroups ?? []),
    ...(normalized.ageGroups ?? []),
    ...(normalized.lifeCycle ?? []),
    ...oneLine(pick(raw, fieldAliases.summary)).split(/\s+/).slice(0, 8)
  ];
  return [...new Set(terms.map(oneLine).filter(Boolean))];
}

export function getGov24ExternalId(raw) {
  return pick(raw, fieldAliases.id);
}

export function normalizeGov24Item(raw, detail = {}) {
  const merged = { ...raw, ...detail };
  const title = oneLine(pick(merged, fieldAliases.title));
  const sourceItemId = getGov24ExternalId(merged);
  const category = normalizeCategory(merged);
  const region = normalizeRegion(merged);
  const status = normalizeStatus(merged);
  const dateRange = normalizeDateRange(merged);
  const organizationName = normalizeOrganizationName(merged);
  const applicationUrl = normalizeOfficialUrl(pick(merged, fieldAliases.applicationUrl));
  const explicitOfficialUrl = normalizeOfficialUrl(pick(merged, fieldAliases.officialUrl));
  const officialUrl = explicitOfficialUrl || (sourceItemId ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${sourceItemId}` : null);
  const summary = oneLine(pick(merged, fieldAliases.summary));
  const description = clean(pick(merged, fieldAliases.description));
  const targetGroups = normalizeTargetGroups(merged);
  const normalized = {
    title,
    slug: `gov24-${normalizeSlug(title, sourceItemId || "service")}`,
    summary,
    description,
    category: category.value,
    sourceName: GOV24_SOURCE_NAME,
    sourceItemId,
    organizationName,
    region: region.value,
    targetGroups,
    ageGroups: normalizeAgeGroups(merged),
    lifeCycle: normalizeLifeCycle(merged),
    status: status.value,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    applicationMethod: normalizeApplicationMethod(merged),
    applicationUrl,
    officialUrl,
    lastVerifiedAt: new Date().toISOString(),
    sourceUpdatedAt: pick(merged, fieldAliases.updatedAt) || null,
    searchKeywords: []
  };
  normalized.searchKeywords = normalizeSearchKeywords(merged, normalized);

  return {
    ...normalized,
    normalization: {
      category,
      region,
      status,
      reviewReasons: [
        category.reason,
        region.reason,
        status.reason
      ].filter(Boolean)
    }
  };
}
