import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const key = process.env.GOVFIND_YOUTH_API_KEY;
const outputPath = resolve("src/data/youth-api.generated.ts");
const endpoint = "https://www.youthcenter.go.kr/opi/youthPlcyList.do";

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

function parseItems(xml) {
  const blocks = [...xml.matchAll(/<(?:youthPolicy|youthPlcy|policy|item|row)>([\s\S]*?)<\/(?:youthPolicy|youthPlcy|policy|item|row)>/g)];
  return blocks.map(([, body]) => {
    const record = {};
    for (const match of body.matchAll(/<([A-Za-z0-9_]+)>([\s\S]*?)<\/\1>/g)) {
      record[match[1]] = decodeXml(match[2]);
    }
    return record;
  });
}

function pick(source, keys) {
  for (const key of keys) {
    if (source[key]) return source[key];
  }
  return "";
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

function slugify(value, fallback) {
  const ascii = value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return ascii || fallback;
}

function categoryFrom(text) {
  if (/주거|월세|전세|임대|주택/.test(text)) return "주거";
  if (/취업|고용|일자리|훈련|채용/.test(text)) return "고용";
  if (/창업|사업|소상공인|기업/.test(text)) return "소상공인";
  if (/교육|학습|학생|장학/.test(text)) return "교육";
  if (/금융|저축|계좌|대출|자산/.test(text)) return "복지";
  return "청년";
}

function policyFromYouth(item, index) {
  const title = pick(item, ["plcyNm", "polyBizSjnm", "policyName", "title"]) || `청년정책 ${index + 1}`;
  const summary = pick(item, ["plcyExplnCn", "polyItcnCn", "policyCn", "summary"]) || "온통청년에서 제공하는 청년정책입니다.";
  const agency = pick(item, ["sprvsnInstCdNm", "operInstCdNm", "cnsgNmor", "agency"]) || "온통청년";
  const region = pick(item, ["zipCd", "lclsfNm", "mclsfNm", "region"]) || "전국";
  const id = pick(item, ["plcyNo", "bizId", "policyId", "id"]) || String(index + 1);
  const target = pick(item, ["sprtTrgtMinAge", "sprtTrgtMaxAge", "ageInfo", "target"]) || "청년 대상";
  const benefit = pick(item, ["sprtCn", "rqutPrdCn", "supportCn", "benefit"]) || summary;
  const application = pick(item, ["aplyYmd", "aplyMthdCn", "rqutProcCn", "apply"]) || "온통청년 공식 안내 확인";
  const link = pick(item, ["aplyUrlAddr", "rfcSiteUrlAddr", "url"]) || "https://www.youthcenter.go.kr";
  const text = `${title} ${summary} ${benefit}`;
  const category = categoryFrom(text);

  return {
    slug: `youth-${slugify(title, id)}`,
    title,
    category,
    source: "온통청년 API",
    agency,
    region,
    amount: "정책별 상이",
    deadline: "공식 공고 확인",
    dday: "확인필요",
    status: "모집중",
    lifeStage: "청년",
    targetGroup: cleanText(target, 90) || "청년 대상",
    income: "정책별 기준 확인",
    applyOnline: /온라인|인터넷|홈페이지|url|URL/.test(application + link),
    tags: [...new Set(["청년", category, ...title.split(/\s+/).slice(0, 3)])],
    summary: cleanText(summary, 130),
    audience: displayLines(target, 2, 110).join(" ") || "연령, 거주지, 취업상태 등 정책별 조건 확인이 필요합니다.",
    benefits: displayLines(benefit, 4, 100),
    documents: ["신분 확인 서류", "정책별 자격 확인 서류", "공식 공고에서 요구하는 추가 서류"],
    apply: cleanText(application, 180),
    officialUrl: link,
    officialSourceUrl: "https://www.youthcenter.go.kr",
    contact: agency,
    views: 3900 - index * 15,
    updatedAt: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    matchReasons: ["온통청년 청년정책 API 기준", "청년 대상 정책 보강", "최종 신청은 공식 기관에서 확인"],
    faq: [
      {
        q: "청년이면 모두 신청할 수 있나요?",
        a: "아닙니다. 연령, 지역, 소득, 취업상태 등 세부 조건은 정책별 공식 공고에서 확인해야 합니다.",
      },
      {
        q: "신청은 어디에서 하나요?",
        a: "상세 페이지의 공식 신청처 또는 온통청년 공식 안내에서 진행합니다.",
      },
    ],
    apiDetails: {
      target,
      benefit,
      application,
      contact: agency,
    },
  };
}

async function writeGenerated(policies) {
  await mkdir(dirname(outputPath), { recursive: true });
  const content = `import type { Policy } from "./policies";\n\nexport const youthApiPolicies: Policy[] = ${JSON.stringify(policies, null, 2)};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function keepExisting(reason) {
  try {
    await readFile(outputPath, "utf8");
    console.warn(`[youth-api] ${reason}. Keeping existing generated data.`);
  } catch {
    await writeGenerated([]);
    console.warn(`[youth-api] ${reason}. Created empty generated data.`);
  }
}

if (!key) {
  await keepExisting("GOVFIND_YOUTH_API_KEY is not set");
  process.exit(0);
}

try {
  const url = new URL(endpoint);
  url.searchParams.set("openApiVlak", key);
  url.searchParams.set("pageIndex", "1");
  url.searchParams.set("display", process.env.GOVFIND_YOUTH_API_ROWS || "30");

  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok || /인증키|INVALID|ERROR|오류/i.test(body)) {
    await keepExisting(`API request failed with ${response.status}: ${body.slice(0, 120)}`);
    process.exit(0);
  }

  const items = parseItems(body);
  if (!items.length) {
    await keepExisting("API response did not contain youth policy list items");
    process.exit(0);
  }

  await writeGenerated(items.slice(0, 30).map(policyFromYouth));
  console.log(`[youth-api] Generated ${items.slice(0, 30).length} youth policies.`);
} catch (error) {
  await keepExisting(error instanceof Error ? error.message : String(error));
}
