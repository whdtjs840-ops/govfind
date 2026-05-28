export const KSTARTUP_SOURCE_NAME = "kstartup";

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
  "지역권"
];

const fieldAliases = {
  id: ["pbanc_sn", "pbancSn", "biz_pbanc_sn", "bizPbancSn", "seq", "id"],
  title: ["biz_pbanc_nm", "bizPbancNm", "pbanc_nm", "pbancNm", "title"],
  summary: ["pbanc_ctnt", "pbancCtnt", "biz_pbanc_ctnt", "description", "summary"],
  description: ["pbanc_ctnt", "pbancCtnt", "biz_pbanc_ctnt", "description"],
  category: ["supt_biz_clsfc", "suptBizClsfc", "biz_clsf", "bizClsfc", "category"],
  organizationName: ["pbanc_ntrp_nm", "pbancNtrpNm", "sprv_inst", "sprvInst", "biz_prch_dprt_nm", "organizationName"],
  region: ["supt_regin", "suptRegin", "region", "area"],
  target: ["aply_trgt_ctnt", "aplyTrgtCtnt", "aply_trgt", "aplyTrgt", "biz_trgt_age", "target"],
  applicationMethod: ["aply_mthd_onli_rcpt_istc", "aplyMthdOnliRcptIstc", "biz_aply_url", "bizAplyUrl", "applicationMethod"],
  applicationUrl: ["biz_aply_url", "bizAplyUrl", "aply_mthd_onli_rcpt_istc", "detl_pg_url", "detlPgUrl"],
  officialUrl: ["detl_pg_url", "detlPgUrl", "biz_gdnc_url", "bizGdncUrl", "biz_aply_url", "bizAplyUrl"],
  supportContent: ["pbanc_ctnt", "pbancCtnt", "biz_pbanc_ctnt", "supportContent"],
  contact: ["prch_cnpl_no", "prchCnplNo", "biz_prch_dprt_nm", "bizPrchDprtNm", "contact"],
  documents: ["prfn_matr", "prfnMatr"],
  startDate: ["pbanc_rcpt_bgng_dt", "pbancRcptBgngDt", "rcpt_bgng_dt", "startDate"],
  endDate: ["pbanc_rcpt_end_dt", "pbancRcptEndDt", "rcpt_end_dt", "endDate"],
  updatedAt: ["mod_dt", "reg_dt", "updatedAt"],
  recruitmentStatus: ["rcrt_prgs_yn", "rcrtPrgsYn"]
};

export function clean(value = "") {
  return String(value ?? "")
    .replaceAll("<![CDATA[", "")
    .replaceAll("]]>", "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\r/g, "")
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
  return pick(raw, fieldAliases.id) || normalizeComparableText(pick(raw, fieldAliases.title)).slice(0, 100);
}

export function normalizeOfficialUrl(value = "") {
  const cleaned = oneLine(value);
  if (!cleaned) return "https://www.k-startup.go.kr";
  if (/^https?:\/\//i.test(cleaned)) return cleaned;
  if (/^www\./i.test(cleaned)) return `https://${cleaned}`;
  return cleaned.startsWith("/") ? `https://www.k-startup.go.kr${cleaned}` : `https://${cleaned}`;
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
  if (/교육|훈련|아카데미|역량강화|강의|멘토링|컨설팅/.test(text)) {
    return { value: "교육", confidence: "medium", reason: null, sourceCategory };
  }
  if (/채용|인력|고용|일자리|취업|근로/.test(text)) {
    return { value: "고용", confidence: "medium", reason: null, sourceCategory };
  }
  if (/자금|융자|대출|보증|투자|판로|수출|마케팅|기술지원|R&D|연구개발|인증|바우처/.test(text)) {
    return { value: "창업", confidence: "medium", reason: null, sourceCategory };
  }
  return { value: "창업", confidence: "high", reason: null, sourceCategory };
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
  if (/전국|중소벤처기업부|창업진흥원|한국청년기업가정신재단|한국엔젤투자협회/.test(text)) {
    return { value: "전국", confidence: "medium", reason: null };
  }
  for (const [region, pattern] of REGION_PATTERNS) {
    if (pattern.test(text)) return { value: region, confidence: "high", reason: null };
  }
  return { value: null, confidence: "low", reason: "region is not explicit in K-Startup fields" };
}

export function normalizeTargetGroups(raw = {}) {
  const text = sourceText(raw);
  const groups = [];
  if (/예비창업|예비 창업/.test(text)) groups.push("예비창업자");
  if (/초기창업|창업기업|스타트업|벤처/.test(text)) groups.push("창업기업");
  if (/청년/.test(text)) groups.push("청년");
  if (/중소기업|기업/.test(text)) groups.push("기업");
  return [...new Set(groups.length ? groups : ["창업기업"])];
}

export function normalizeApplicationMethod(raw = {}) {
  const method = pick(raw, fieldAliases.applicationMethod);
  if (method) return clean(method);
  const url = pick(raw, fieldAliases.applicationUrl);
  return url ? `온라인 접수 또는 공고 상세 확인: ${url}` : "";
}

function normalizeYmd(value = "") {
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length < 8) return null;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

export function normalizeDateRange(raw = {}) {
  const startDate = normalizeYmd(pick(raw, fieldAliases.startDate));
  const endDate = normalizeYmd(pick(raw, fieldAliases.endDate));
  return {
    startDate,
    endDate,
    confidence: startDate || endDate ? "known" : "unknown",
    reason: startDate || endDate ? null : "date range is not explicit in K-Startup fields"
  };
}

export function normalizeStatus(raw = {}) {
  const recruitment = pick(raw, fieldAliases.recruitmentStatus).toUpperCase();
  const dateRange = normalizeDateRange(raw);
  if (recruitment === "Y") return { value: "모집중", confidence: "known", reason: null };
  if (recruitment === "N") return { value: "마감", confidence: "known", reason: null };
  if (dateRange.endDate) {
    const end = new Date(`${dateRange.endDate}T23:59:59+09:00`);
    if (!Number.isNaN(end.getTime())) {
      return { value: end.getTime() < Date.now() ? "마감" : "모집중", confidence: "known", reason: null };
    }
  }
  return { value: "확인필요", confidence: "low", reason: "status is not explicit in K-Startup fields" };
}

export function normalizeKstartupItem(raw = {}) {
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
  const organizationName = pick(raw, fieldAliases.organizationName) || "K-Startup";
  const officialUrl = normalizeOfficialUrl(pick(raw, fieldAliases.officialUrl) || `https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do?schM=view&pbancSn=${sourceItemId}`);
  const applicationUrl = normalizeOfficialUrl(pick(raw, fieldAliases.applicationUrl) || officialUrl);
  const normalized = {
    title,
    slug: `kstartup-${normalizeSlug(title, sourceItemId || "policy")}`,
    summary,
    description,
    category: category.value,
    sourceName: KSTARTUP_SOURCE_NAME,
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
    contact: pick(raw, fieldAliases.contact) || organizationName,
    lastVerifiedAt: new Date().toISOString(),
    sourceUpdatedAt: pick(raw, fieldAliases.updatedAt) || null,
    searchKeywords: [],
    statusLabel: status.confidence === "low" ? "공식 공고 확인" : status.value,
    statusConfidence: status.confidence === "low" ? "unknown" : "known",
    dateConfidence: dateRange.confidence,
    applicationPeriodLabel: dateRange.confidence === "unknown" ? "공식 공고 확인" : [dateRange.startDate, dateRange.endDate].filter(Boolean).join(" ~ "),
    regionLabel: region.value ? region.value : "공식 공고 확인",
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
