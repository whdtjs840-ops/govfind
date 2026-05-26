import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const key = process.env.GOVFIND_BOKJIRO_LOCAL_API_KEY || process.env.GOVFIND_WELFARE_API_KEY;
const outputPath = resolve("src/data/local-welfare-api.generated.ts");
const endpoint = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations";

function decodeXml(value = "") {
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

function pick(source, keys) {
  for (const key of keys) {
    if (source[key]) return source[key];
  }
  return "";
}

function parseItems(xml) {
  const blocks = [...xml.matchAll(/<(?:servList|item)>([\s\S]*?)<\/(?:servList|item)>/g)];
  return blocks.map(([, body]) => {
    const record = {};
    for (const match of body.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      record[match[1]] = decodeXml(match[2]);
    }
    return record;
  });
}

function parseDetail(xml) {
  const detail = {};
  const cleaned = xml
    .replace(/^<\?xml[^>]*>/, "")
    .replace(/<inqplCtadrList>[\s\S]*?<\/inqplCtadrList>/g, (block) => {
      const name = block.match(/<wlfareInfoReldNm>([\s\S]*?)<\/wlfareInfoReldNm>/)?.[1] || "";
      const contact = block.match(/<wlfareInfoReldCn>([\s\S]*?)<\/wlfareInfoReldCn>/)?.[1] || "";
      return `<inqplCtadrList>${decodeXml(`${name} ${contact}`)}</inqplCtadrList>`;
    });

  for (const match of cleaned.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
    detail[match[1]] = decodeXml(match[2]);
  }
  return detail;
}

function cleanText(value = "", maxLength = 160) {
  const cleaned = decodeXml(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/[○●◎◦❍□■◆◇※]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "";
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
}

function displayLines(value = "", max = 4, maxLength = 100) {
  return decodeXml(value)
    .replace(/<[^>]+>/g, "\n")
    .split(/\n|[○●◎◦❍□■◆◇※]/)
    .map((line) => cleanText(line, maxLength))
    .filter(Boolean)
    .slice(0, max);
}

async function request(path, params = {}) {
  const url = new URL(`${endpoint}/${path}`);
  url.searchParams.set("serviceKey", key);
  for (const [name, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(name, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  if (response.status === 429 || /quota exceeded/i.test(body)) {
    throw new Error("API quota exceeded while fetching local welfare data");
  }
  if (!response.ok || /SERVICE_KEY|INVALID_REQUEST|NO DATA FOUND/i.test(body)) return "";
  return body;
}

async function fetchDetail(serviceId) {
  if (!serviceId) return {};
  const body = await request("LcgvWelfaredetailed", { servId: serviceId });
  return body ? parseDetail(body) : {};
}

function slugify(value, fallback) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return ascii || fallback;
}

function categoryFrom(text) {
  if (/아동|보육|출산|육아|가족/.test(text)) return "복지";
  if (/노인|어르신|장애|취약|기초|급여/.test(text)) return "복지";
  if (/주거|월세|전세|임대|주택/.test(text)) return "주거";
  if (/취업|고용|일자리|훈련/.test(text)) return "고용";
  if (/창업|사업|소상공인|기업/.test(text)) return "소상공인";
  if (/교육|학습|학생|장학/.test(text)) return "교육";
  if (/의료|건강|진료|검진/.test(text)) return "보건의료";
  if (/청년/.test(text)) return "청년";
  return "복지";
}

function statusFromEndDate(value) {
  if (!value || value === "99991231") return { deadline: "상시 또는 지자체 공고 확인", dday: "상시", status: "상시" };
  const date = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  const end = new Date(`${date}T23:59:59+09:00`);
  if (Number.isNaN(end.getTime())) return { deadline: "지자체 공고 확인", dday: "확인필요", status: "모집중" };
  const diff = Math.ceil((end.getTime() - Date.now()) / 86400000);
  return {
    deadline: date.replaceAll("-", "."),
    dday: diff >= 0 ? `D-${diff}` : "마감",
    status: diff >= 0 && diff <= 14 ? "마감임박" : diff >= 0 ? "모집중" : "예정",
  };
}

function policyFromLocalWelfare(item, detail, index) {
  const title = pick(detail, ["servNm"]) || pick(item, ["servNm"]) || `지자체 복지서비스 ${index + 1}`;
  const summary = pick(detail, ["servDgst"]) || pick(item, ["servDgst"]) || "지자체가 제공하는 복지서비스입니다.";
  const agency = pick(detail, ["bizChrDeptNm"]) || pick(item, ["bizChrDeptNm"]) || "지자체 담당 부서";
  const region = [pick(detail, ["ctpvNm"]) || pick(item, ["ctpvNm"]), pick(detail, ["sggNm"]) || pick(item, ["sggNm"])]
    .filter(Boolean)
    .join(" ");
  const id = pick(item, ["servId"]) || pick(detail, ["servId"]) || String(index + 1);
  const target = pick(detail, ["sprtTrgtCn"]) || pick(item, ["lifeNmArray"]) || "공식 상세 기준 확인";
  const criteria = pick(detail, ["slctCritCn"]);
  const benefit = pick(detail, ["alwServCn"]) || pick(item, ["srvPvsnNm"]);
  const application = pick(detail, ["aplyMtdCn"]) || pick(detail, ["aplyMtdNm"]) || pick(item, ["aplyMtdNm"]);
  const documents = pick(detail, ["stdrDocCn", "sbmsnDocCn", "reqstDcCn"]);
  const contact = pick(detail, ["inqplCtadrList"]) || agency;
  const link = pick(item, ["servDtlLink"]) || "https://www.bokjiro.go.kr";
  const text = `${title} ${summary} ${target} ${benefit}`;
  const category = categoryFrom(text);
  const deadlineInfo = statusFromEndDate(pick(detail, ["enfcEndYmd"]));
  const benefitLines = displayLines(benefit, 4, 100);
  const documentLines = displayLines(documents, 4, 80);

  return {
    slug: `local-${slugify(title, id)}`,
    title,
    category,
    source: "복지로 지자체복지 API",
    agency,
    region: region || "지역별",
    amount: pick(item, ["srvPvsnNm"]) || "사업별 상이",
    deadline: deadlineInfo.deadline,
    dday: deadlineInfo.dday,
    status: deadlineInfo.status,
    lifeStage: pick(item, ["lifeNmArray"]) || "지역 주민",
    targetGroup: displayLines(target, 1, 100)[0] || "공식 상세 기준 확인",
    income: criteria ? cleanText(criteria, 90) : "지자체 기준 확인",
    applyOnline: /인터넷|모바일|온라인/.test(application),
    tags: [...new Set([category, "지자체복지", region || "지역별", ...title.split(/\s+/).slice(0, 2)])].filter(Boolean),
    summary: cleanText(summary, 130),
    audience: displayLines(target, 2, 110).join(" ") || "지역, 대상, 선정기준을 공식 상세에서 확인해야 합니다.",
    benefits: benefitLines.length ? benefitLines : ["지원내용은 지자체 공고 기준으로 확인", "신청 가능 여부는 담당 기관 확인"],
    documents: documentLines.length ? documentLines : ["신분 확인 서류", "대상 확인 서류", "지자체별 추가 서류"],
    apply: cleanText(application, 180) || "복지로 또는 지자체 공식 안내에서 신청 방법을 확인합니다.",
    officialUrl: link,
    officialSourceUrl: "https://www.bokjiro.go.kr",
    contact: cleanText(contact, 120),
    views: 4200 - index * 17,
    updatedAt: (pick(detail, ["lastModYmd"]) || pick(item, ["lastModYmd"]) || new Date().toISOString().slice(0, 10).replaceAll("-", "")).replace(/(\d{4})(\d{2})(\d{2})/, "$1.$2.$3"),
    matchReasons: ["복지로 지자체복지 API 기준", "지역별 담당 부서 확인 가능", "최종 신청은 공식 기관에서 확인"],
    faq: [
      {
        q: "이 정보만으로 신청 가능 여부가 확정되나요?",
        a: "아닙니다. GovFind는 조건 확인을 돕고, 최종 자격과 접수 가능 여부는 지자체 또는 복지로 공식 안내에서 판단합니다.",
      },
      {
        q: "신청은 어디에서 하나요?",
        a: "상세 페이지의 공식 신청처 또는 지자체 담당 부서 안내를 통해 진행합니다.",
      },
    ],
    apiDetails: {
      target,
      criteria,
      benefit,
      application,
      documents,
      contact,
    },
  };
}

async function writeGenerated(policies) {
  await mkdir(dirname(outputPath), { recursive: true });
  const content = `import type { Policy } from "./policies";\n\nexport const localWelfareApiPolicies: Policy[] = ${JSON.stringify(policies, null, 2)};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function keepExisting(reason) {
  try {
    await readFile(outputPath, "utf8");
    console.warn(`[local-welfare-api] ${reason}. Keeping existing generated data.`);
  } catch {
    await writeGenerated([]);
    console.warn(`[local-welfare-api] ${reason}. Created empty generated data.`);
  }
}

if (!key) {
  await keepExisting("GOVFIND_BOKJIRO_LOCAL_API_KEY is not set");
  process.exit(0);
}

try {
  const body = await request("LcgvWelfarelist", {
    pageNo: "1",
    numOfRows: process.env.GOVFIND_BOKJIRO_LOCAL_API_ROWS || "30",
  });
  const items = parseItems(body);
  if (!items.length) {
    await keepExisting("API response did not contain local welfare list items");
    process.exit(0);
  }

  const policies = [];
  for (let index = 0; index < items.slice(0, 30).length; index += 1) {
    const item = items[index];
    const detail = await fetchDetail(pick(item, ["servId"]));
    policies.push(policyFromLocalWelfare(item, detail, index));
  }
  await writeGenerated(policies);
  console.log(`[local-welfare-api] Generated ${policies.length} local welfare policies.`);
} catch (error) {
  await keepExisting(error instanceof Error ? error.message : String(error));
}
