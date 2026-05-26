import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const key = process.env.GOVFIND_PUBLIC_SERVICE_API_KEY;
const outputPath = resolve("src/data/public-service-api.generated.ts");
const endpoint = "https://api.odcloud.kr/api";

function text(value = "") {
  return String(value ?? "")
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanLines(value = "", max = 5) {
  return text(value)
    .split(/\n|(?:\s{2,})|(?:[•ㆍ·]\s*)/)
    .map((line) => line.replace(/^[\-*·ㆍ•\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function sanitizeDisplay(value = "", maxLength = 160) {
  const cleaned = text(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/[○●■□▶※❍ㆍ•·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
}

function displayLines(value = "", max = 4, maxLength = 120) {
  return text(value)
    .replace(/<[^>]+>/g, "\n")
    .split(/\n|[○●■□▶※❍ㆍ•·]+|(?:\s{2,})/)
    .map((line) => sanitizeDisplay(line, maxLength))
    .filter(Boolean)
    .slice(0, max);
}

function firstLine(value = "", fallback = "") {
  return displayLines(value, 1, 120)[0] || fallback;
}

function slugify(value, fallback) {
  const slug = text(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 82);
  return slug || fallback;
}

function categoryFrom(record) {
  const title = text(record["서비스명"]);
  const field = text(record["서비스분야"]);
  const source = `${field} ${title} ${record["서비스목적요약"] || ""} ${record["지원대상"] || ""}`;
  if (/근로장려|자녀장려|기초연금|수당|급여|바우처|생활지원|긴급지원|복지/.test(title)) return "복지";
  if (/주거|주택|전세|월세|임대|분양|보증/.test(`${title} ${field}`)) return "주거";
  if (/근로장려|자녀장려|기초연금|수당|급여|바우처|생활지원|긴급지원|복지/.test(field)) return "복지";
  if (/창업|기업|사업자|소상공인|중소기업|자영업/.test(source)) return /소상공인|자영업/.test(source) ? "소상공인" : "창업";
  if (/취업|일자리|고용|구직|직업|훈련|내일배움/.test(source)) return "고용";
  if (/청년|대학생/.test(`${title} ${field}`)) return "청년";
  if (/교육|학습|학교|학생|장학/.test(source)) return "교육";
  if (/보건|건강|의료|진료|병원|검진/.test(source)) return "보건의료";
  if (/농업|어업|임업|축산|영농|농림/.test(source)) return "농림어업";
  return "복지";
}

function lifeStageFrom(record) {
  const source = `${record["사용자구분"] || ""} ${record["서비스명"] || ""} ${record["지원대상"] || ""}`;
  if (/청년|대학생|구직/.test(source)) return "청년";
  if (/임산부|출산|영유아|육아|아동|자녀/.test(source)) return "임신·출산·육아";
  if (/어르신|노인|65세|고령/.test(source)) return "어르신";
  if (/소상공인|사업자|기업|창업/.test(source)) return "사업자";
  if (/장애|취약|저소득|기초생활|차상위/.test(source)) return "취약계층";
  if (/농업|어업|임업|축산/.test(source)) return "농업인";
  return "전체";
}

function statusFrom(deadline) {
  const value = text(deadline);
  if (!value || /상시|수시|연중/.test(value)) return { status: "상시", dday: "상시" };
  if (/마감|종료/.test(value)) return { status: "마감임박", dday: "확인필요" };
  return { status: "모집중", dday: "접수중" };
}

function officialUrl(record, detail) {
  return (
    text(detail["온라인신청사이트URL"]) ||
    text(record["상세조회URL"]) ||
    text(detail["상세조회URL"]) ||
    "https://www.gov.kr"
  );
}

function policyFromPublicService(record, detail, index) {
  const merged = { ...record, ...detail };
  const title = text(merged["서비스명"]) || `정부24 공공서비스 ${index + 1}`;
  const summary = firstLine(merged["서비스목적"] || merged["서비스목적요약"], "정부24 공공서비스 API에서 제공하는 국민 혜택 정보입니다.");
  const category = categoryFrom(merged);
  const { status, dday } = statusFrom(merged["신청기한"]);
  const support = text(merged["지원대상"]) || "공식 상세 페이지에서 지원 대상을 확인해야 합니다.";
  const criteria = text(merged["선정기준"]);
  const benefit = text(merged["지원내용"]);
  const application = text(merged["신청방법"]);
  const documents = text(merged["구비서류"]);
  const contact = text(merged["문의처"] || merged["전화문의"] || merged["접수기관명"] || merged["접수기관"]) || "정부24 또는 소관기관 문의";
  const agency = text(merged["소관기관명"] || merged["부서명"]) || "정부24";
  const updatedAt = text(merged["수정일시"] || merged["등록일시"]).slice(0, 10).replaceAll("-", ".") || new Date().toISOString().slice(0, 10).replaceAll("-", ".");

  return {
    slug: `gov24-${slugify(title, text(merged["서비스ID"]) || String(index + 1))}`,
    title,
    category,
    source: "정부24 공공서비스 API",
    agency,
    region: /시청|도청|군청|구청|지자체|특별시|광역시|특별자치|도 /.test(`${agency} ${merged["소관기관유형"] || ""}`) ? "지역별" : "전국",
    amount: firstLine(benefit, text(merged["지원유형"]) || "서비스별 상이"),
    deadline: text(merged["신청기한"]) || "상시 또는 공식 공고 확인",
    dday,
    status,
    lifeStage: lifeStageFrom(merged),
    targetGroup: firstLine(support, "공식 상세 기준 확인"),
    income: criteria ? firstLine(criteria, "서비스별 선정기준 확인") : "서비스별 소득·자격 기준 확인",
    applyOnline: Boolean(text(merged["온라인신청사이트URL"] || merged["상세조회URL"])),
    tags: [...new Set([category, "정부24", text(merged["지원유형"]), text(merged["서비스분야"]), ...title.split(/\s+/).slice(0, 3)].filter(Boolean))],
    summary: sanitizeDisplay(summary, 130),
    audience: displayLines(support, 2, 120).join(" ") || "공식 상세 페이지의 지원 대상과 선정 기준을 함께 확인해야 합니다.",
    benefits: displayLines(benefit, 4, 110).length ? displayLines(benefit, 4, 110) : ["지원내용 확인", "신청기한 확인", "공식 신청처 이동", "소관기관 문의처 확인"],
    documents: displayLines(documents, 4, 80).length ? displayLines(documents, 4, 80) : ["신분 확인 서류", "자격 확인 자료", "서비스별 추가 구비서류"],
    apply: displayLines(application, 2, 130).join(" ") || "정부24 또는 소관기관 공식 페이지에서 신청 방법을 확인합니다.",
    officialUrl: officialUrl(merged, detail),
    officialSourceUrl: text(record["상세조회URL"]) || "https://www.gov.kr",
    contact,
    views: Number(merged["조회수"]) || 12000 - index * 35,
    updatedAt,
    matchReasons: ["정부24 공공서비스 API 연동 정보", "지원대상·선정기준·신청방법을 한 페이지에서 확인", "공식 신청처로 이동하는 handoff 구조"],
    faq: [
      {
        q: "GovFind에서 바로 신청이 확정되나요?",
        a: "아니요. GovFind는 조건과 준비서류를 정리하고, 최종 신청과 자격 판정은 정부24 또는 소관기관 공식 페이지에서 진행합니다."
      },
      {
        q: "신청기한이 상시로 보이면 언제든 가능한가요?",
        a: "상시 접수라도 예산, 지역, 세부 조건에 따라 달라질 수 있으니 공식 상세 페이지의 최신 안내를 확인해야 합니다."
      }
    ],
    apiDetails: {
      target: support,
      criteria,
      benefit,
      application,
      documents,
      contact
    }
  };
}

async function request(path, params = {}) {
  const url = new URL(`${endpoint}${path}`);
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("returnType", "JSON");
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(name, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) throw new Error(`public-service request failed ${response.status}: ${body.slice(0, 160)}`);
  const json = JSON.parse(body);
  if (json.errorCode || json.message?.includes("SERVICE_KEY")) throw new Error(json.message || "public-service auth failed");
  return json;
}

async function fetchDetail(serviceId) {
  if (!serviceId) return {};
  const json = await request("/gov24/v3/serviceDetail", {
    page: 1,
    perPage: 1,
    "cond[서비스ID::EQ]": serviceId
  });
  return json.data?.[0] || {};
}

async function writeGenerated(policies) {
  await mkdir(dirname(outputPath), { recursive: true });
  const content = `import type { Policy } from "./policies";\n\nexport const publicServiceApiPolicies: Policy[] = ${JSON.stringify(policies, null, 2)};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function keepExisting(reason) {
  try {
    await readFile(outputPath, "utf8");
    console.warn(`[public-service-api] ${reason}. Keeping existing generated data.`);
  } catch {
    await writeGenerated([]);
    console.warn(`[public-service-api] ${reason}. Created empty generated data.`);
  }
}

if (!key) {
  await keepExisting("GOVFIND_PUBLIC_SERVICE_API_KEY is not set");
  process.exit(0);
}

try {
  const json = await request("/gov24/v3/serviceList", {
    page: 1,
    perPage: process.env.GOVFIND_PUBLIC_SERVICE_API_ROWS || 80
  });
  const records = json.data || [];
  if (!records.length) {
    await keepExisting("API response did not contain service records");
    process.exit(0);
  }

  const selected = records.slice(0, Number(process.env.GOVFIND_PUBLIC_SERVICE_API_ROWS || 80));
  const policies = [];
  for (let index = 0; index < selected.length; index += 1) {
    const record = selected[index];
    const detail = await fetchDetail(record["서비스ID"]);
    policies.push(policyFromPublicService(record, detail, index));
  }
  await writeGenerated(policies);
  console.log(`[public-service-api] Generated ${policies.length} public service policies.`);
} catch (error) {
  await keepExisting(error instanceof Error ? error.message : String(error));
}
