import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const key = process.env.GOVFIND_WELFARE_API_KEY;
const outputPath = resolve("src/data/welfare-api.generated.ts");
const endpoint = "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001";

function decodeXml(value = "") {
  return value
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
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pick(source, keys) {
  for (const key of keys) {
    if (source[key]) return source[key];
  }
  return "";
}

function parseItems(xml) {
  const blocks = [...xml.matchAll(/<(?:item|servList|wantedList)>([\s\S]*?)<\/(?:item|servList|wantedList)>/g)];
  return blocks.map(([, body]) => {
    const record = {};
    for (const match of body.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      record[match[1]] = decodeXml(match[2]);
    }
    return record;
  });
}

function parseDetail(xml) {
  const records = parseItems(xml);
  if (records[0]) return records[0];

  const detail = {};
  const body = xml
    .replace(/^<\?xml[^>]*>/, "")
    .replace(/<\/?(?:response|body|items|item|wantedDtl|servDtl)[^>]*>/g, "");

  for (const match of body.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
    detail[match[1]] = decodeXml(match[2]);
  }
  return detail;
}

function shortLines(value = "", max = 4) {
  return value
    .split(/\n|(?:\s{2,})/)
    .map((line) => line.replace(/^[\-•ㆍ\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, max);
}

function sanitizeDisplay(value = "", maxLength = 160) {
  const cleaned = decodeXml(String(value ?? ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/[○●■□▶※❍ㆍ•·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
}

function displayLines(value = "", max = 4, maxLength = 120) {
  return decodeXml(String(value ?? ""))
    .replace(/<[^>]+>/g, "\n")
    .split(/\n|[○●■□▶※❍ㆍ•·]+|(?:\s{2,})/)
    .map((line) => sanitizeDisplay(line, maxLength))
    .filter((line) => line && !/^serv[A-Z]/.test(line) && !/^\/?serv/.test(line))
    .slice(0, max);
}

async function fetchDetail(serviceId) {
  if (!serviceId) return {};
  const url = new URL(`${endpoint}/NationalWelfaredetailedV001`);
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("servId", serviceId);

  const response = await fetch(url);
  const body = await response.text();
  if (response.status === 429 || /quota exceeded/i.test(body)) {
    throw new Error("API quota exceeded while fetching welfare details");
  }
  if (!response.ok || /NO DATA FOUND|SERVICE_KEY|INVALID_REQUEST/i.test(body)) return {};
  return parseDetail(body);
}

function slugify(value, fallback) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
  return ascii || fallback;
}

function categoryFrom(text) {
  if (/장애|저소득|취약|기초|돌봄|다문화|한부모|보훈|노인|어르신/.test(text)) return "복지";
  if (/주거|월세|임대|전세|주택/.test(text)) return "주거";
  if (/취업|고용|일자리|구직|훈련/.test(text)) return "고용";
  if (/창업|사업|소상공인|기업/.test(text)) return "소상공인";
  if (/교육|학습|학교|장학/.test(text)) return "교육";
  if (/의료|건강|진료|임신|출산/.test(text)) return "보건의료";
  if (/청년|청소년|대학생/.test(text)) return "청년";
  return "복지";
}

function policyFromApi(item, detail, index) {
  const title = pick(item, ["servNm", "servName", "serviceName", "wlfareInfoNm", "title"]) || `복지서비스 ${index + 1}`;
  const summary = pick(item, ["servDgst", "servDesc", "svcfrstRegTs", "summary", "intrcn"]) || "공공데이터포털 복지서비스 API에서 제공하는 중앙부처 복지서비스 정보입니다.";
  const agency = pick(item, ["jurMnofNm", "servSeDetailNm", "inqNum", "agency", "deptNm"]) || "중앙부처";
  const target = pick(detail, ["tgtrDtlCn", "sprtTrgetCn", "trgterIndvdlArray"]) || pick(item, ["lifeArray", "trgterIndvdlArray", "sprtTrgetCn", "target"]) || "공식 상세 기준 확인";
  const link = pick(item, ["servDtlLink", "svcUrl", "url"]) || "https://www.bokjiro.go.kr";
  const id = pick(item, ["servId", "svcId", "id"]) || String(index + 1);
  const text = `${title} ${summary} ${target}`;
  const category = categoryFrom(text);
  const criteria = pick(detail, ["slctCritCn", "slctCrit", "slctCndCn", "selStdCn"]);
  const benefit = pick(detail, ["alwServCn", "servDtlCn", "sportCn", "sprtCn", "benefitCn"]);
  const application = pick(detail, ["aplyMtdCn", "aplyMtd", "reqstMthdCn", "reqstMthd", "applyMthdCn"]);
  const documents = pick(detail, ["stdrDocCn", "reqstDcCn", "sbmsnDocCn", "inqplCtadrList"]);
  const contact = pick(detail, ["rprsCtadr", "inqplCtadrList"]) || pick(item, ["rprsCtadr"]) || "복지로 또는 소관 기관 문의처";
  const benefitLines = displayLines(benefit, 4, 110);
  const documentLines = displayLines(documents, 4, 80);

  return {
    slug: `api-${slugify(title, id)}`,
    title,
    category,
    source: "복지로 API",
    agency,
    region: "전국",
    amount: "사업별 상이",
    deadline: "공식 공고 확인",
    dday: "상시",
    status: "상시",
    lifeStage: /청년/.test(text) ? "청년" : /아동|청소년/.test(text) ? "아동·청소년" : "취약계층",
    targetGroup: displayLines(target, 1, 100)[0] || sanitizeDisplay(target, 90) || "?? ?? ?? ??",
    income: "사업별 소득·가구 기준 확인",
    applyOnline: true,
    tags: [...new Set([category, "복지로", "공공데이터", ...title.split(/\s+/).slice(0, 3)])],
    summary: sanitizeDisplay(summary, 130),
    audience: displayLines(target, 2, 120).join(" ") || "API ?? ??? ????? ?? ?? ??? ??? ?? ?? ??? ?? ?? ???? ???? ???.",
    benefits: benefitLines.length ? benefitLines : ["복지서비스 정보 확인", "지원대상 확인", "신청방법 확인", "공식 출처 연결"],
    documents: documentLines.length ? documentLines : ["신분 확인 서류", "소득·가구 관련 자료", "사업별 추가 서류"],
    apply: shortLines(application, 2).join(" ") || "복지로 또는 소관 기관의 공식 신청 안내를 확인합니다.",
    officialUrl: link,
    officialSourceUrl: "https://www.bokjiro.go.kr",
    contact,
    views: 5000 - index * 20,
    updatedAt: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    matchReasons: ["공공데이터포털 API 연동 정보", "중앙부처 복지서비스 기준", "공식 상세 확인 필요"],
    faq: [
      {
        q: "이 정보만으로 신청 자격이 확정되나요?",
        a: "아니요. GovFind는 탐색을 돕고, 최종 자격과 제출은 공식 기관 기준을 따라야 합니다."
      },
      {
        q: "신청은 어디에서 하나요?",
        a: "복지로 또는 소관 기관의 공식 신청 페이지에서 진행합니다."
      }
    ],
    apiDetails: {
      target,
      criteria,
      benefit,
      application,
      documents,
      contact
    }
  };
}

async function writeGenerated(policies) {
  await mkdir(dirname(outputPath), { recursive: true });
  const content = `import type { Policy } from "./policies";\n\nexport const welfareApiPolicies: Policy[] = ${JSON.stringify(policies, null, 2)};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function keepExisting(reason) {
  try {
    await readFile(outputPath, "utf8");
    console.warn(`[welfare-api] ${reason}. Keeping existing generated data.`);
  } catch {
    await writeGenerated([]);
    console.warn(`[welfare-api] ${reason}. Created empty generated data.`);
  }
}

if (!key) {
  await keepExisting("GOVFIND_WELFARE_API_KEY is not set");
  process.exit(0);
}

const url = new URL(`${endpoint}/NationalWelfarelistV001`);
url.searchParams.set("serviceKey", key);
url.searchParams.set("pageNo", "1");
url.searchParams.set("numOfRows", process.env.GOVFIND_WELFARE_API_ROWS || "30");
url.searchParams.set("callTp", "L");
url.searchParams.set("srchKeyCode", "001");
url.searchParams.set("searchWrd", "");

try {
  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok || /Unauthorized|SERVICE_KEY_IS_NOT_REGISTERED_ERROR|INVALID_REQUEST_PARAMETER_ERROR|quota exceeded/i.test(body)) {
    await keepExisting(`API request failed with ${response.status}: ${body.slice(0, 120)}`);
    process.exit(0);
  }

  const items = parseItems(body);
  if (!items.length) {
    await keepExisting("API response did not contain list items");
    process.exit(0);
  }

  const selectedItems = items.slice(0, 30);
  const policies = [];
  for (let index = 0; index < selectedItems.length; index += 1) {
    const item = selectedItems[index];
    const detail = await fetchDetail(pick(item, ["servId", "svcId", "id"]));
    policies.push(policyFromApi(item, detail, index));
  }
  await writeGenerated(policies);
  console.log(`[welfare-api] Generated ${policies.length} API policies.`);
} catch (error) {
  await keepExisting(error instanceof Error ? error.message : String(error));
}
