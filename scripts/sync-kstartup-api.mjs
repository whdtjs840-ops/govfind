import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const key = process.env.GOVFIND_KSTARTUP_API_KEY || process.env.GOVFIND_PUBLIC_SERVICE_API_KEY;
const outputPath = resolve("src/data/kstartup-api.generated.ts");
const endpoint = "https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01";

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

function slugify(value, fallback) {
  const slug = text(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 82);
  return slug || fallback;
}

function formatDate(value = "") {
  const raw = text(value).replace(/\D/g, "");
  if (raw.length !== 8) return text(value);
  return `${raw.slice(0, 4)}.${raw.slice(4, 6)}.${raw.slice(6, 8)}`;
}

function dday(endDate = "") {
  const raw = text(endDate).replace(/\D/g, "");
  if (raw.length !== 8) return "확인필요";
  const end = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}T23:59:59+09:00`);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / 86400000);
  if (diff < 0) return "마감";
  if (diff === 0) return "D-Day";
  return `D-${diff}`;
}

function categoryFrom(record) {
  const source = `${record.supt_biz_clsfc || ""} ${record.biz_pbanc_nm || ""} ${record.pbanc_ctnt || ""}`;
  if (/교육|멘토링|컨설팅|역량|강의/.test(source)) return "교육";
  if (/융자|자금|보증|투자|사업화|지원금|바우처/.test(source)) return "창업";
  if (/소상공인|자영업/.test(source)) return "소상공인";
  if (/공간|보육|입주|센터/.test(source)) return "창업";
  if (/고용|취업|채용|일자리/.test(source)) return "고용";
  return "창업";
}

function applicationUrl(record) {
  const candidates = [
    record.biz_aply_url,
    record.aply_mthd_onli_rcpt_istc,
    record.biz_gdnc_url,
    record.detl_pg_url
  ].map(text);
  const url = candidates.find(Boolean) || "https://www.k-startup.go.kr";
  if (/^https?:\/\//.test(url)) return url;
  return `https://${url}`;
}

function policyFromKstartup(record, index) {
  const title = text(record.biz_pbanc_nm) || `K-Startup 창업지원사업 ${index + 1}`;
  const summary = cleanLines(record.pbanc_ctnt, 1)[0] || "K-Startup 창업지원포털에서 제공하는 창업지원사업 공고입니다.";
  const start = formatDate(record.pbanc_rcpt_bgng_dt);
  const end = formatDate(record.pbanc_rcpt_end_dt);
  const deadline = start && end ? `${start} ~ ${end}` : end || "공고별 확인";
  const status = record.rcrt_prgs_yn === "Y" ? "모집중" : "예정";
  const applyUrl = applicationUrl(record);
  const target = text(record.aply_trgt_ctnt || record.aply_trgt) || "예비창업자, 초기창업기업 등 공고별 대상 확인";
  const stage = text(record.biz_enyy) || "예비창업자·초기창업기업 등";
  const age = text(record.biz_trgt_age);
  const region = text(record.supt_regin) || "전국";
  const organization = text(record.pbanc_ntrp_nm || record.sprv_inst) || "K-Startup";

  return {
    slug: `kstartup-${slugify(title, String(record.pbanc_sn || index + 1))}`,
    title,
    category: categoryFrom(record),
    source: "K-Startup API",
    agency: organization,
    region,
    amount: text(record.supt_biz_clsfc) || "공고별 지원내용 확인",
    deadline,
    dday: dday(record.pbanc_rcpt_end_dt),
    status,
    lifeStage: /청년|만 39세|대학생/.test(`${target} ${age}`) ? "청년" : "예비창업·초기창업",
    targetGroup: cleanLines(target, 1)[0] || "공고별 지원 대상 확인",
    income: "업력·연령·창업단계 등 공고별 기준 확인",
    applyOnline: Boolean(applyUrl),
    tags: [...new Set(["창업", "K-Startup", text(record.supt_biz_clsfc), region, ...title.split(/\s+/).slice(0, 3)].filter(Boolean))],
    summary,
    audience: [target, stage, age].filter(Boolean).join(" / "),
    benefits: cleanLines(record.pbanc_ctnt, 4).length ? cleanLines(record.pbanc_ctnt, 4) : ["창업지원사업 공고 확인", "모집기간 확인", "온라인 신청처 이동", "주관기관 문의"],
    documents: cleanLines(record.prfn_matr, 4).length ? cleanLines(record.prfn_matr, 4) : ["사업계획서", "사업자등록 관련 서류", "대표자 신분 확인 자료", "공고별 추가 제출서류"],
    apply: `K-Startup 공고 상세 또는 주관기관 신청 페이지에서 접수합니다. ${applyUrl}`,
    officialUrl: applyUrl,
    officialSourceUrl: text(record.detl_pg_url) || "https://www.k-startup.go.kr",
    contact: text(record.prch_cnpl_no || record.biz_prch_dprt_nm) || "K-Startup 또는 주관기관 문의",
    views: 18000 - index * 42,
    updatedAt: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    matchReasons: ["K-Startup 사업공고 API 연동 정보", "모집기간·대상·신청처가 명확한 창업지원 콘텐츠", "사업계획서 준비형 SEO 콘텐츠로 확장 가능"],
    faq: [
      {
        q: "예비창업자도 신청할 수 있나요?",
        a: "공고별로 예비창업자, 1년 미만, 3년 미만 등 업력 기준이 다르므로 상세 공고의 대상 업력을 확인해야 합니다."
      },
      {
        q: "GovFind에서 신청을 대행하나요?",
        a: "아니요. GovFind는 공고 요약과 공식 신청처 연결을 제공하고, 접수는 K-Startup 또는 주관기관 페이지에서 진행합니다."
      }
    ],
    apiDetails: {
      target,
      criteria: [stage, age].filter(Boolean).join(" / "),
      benefit: text(record.pbanc_ctnt),
      application: applyUrl,
      documents: text(record.prfn_matr),
      contact: text(record.prch_cnpl_no || record.biz_prch_dprt_nm)
    }
  };
}

async function request(pageNo) {
  const url = new URL(endpoint);
  url.searchParams.set("serviceKey", key);
  url.searchParams.set("pageNo", String(pageNo));
  url.searchParams.set("numOfRows", "10");
  url.searchParams.set("returnType", "json");

  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) throw new Error(`kstartup request failed ${response.status}: ${body.slice(0, 160)}`);
  const json = JSON.parse(body);
  if (json.response?.header?.resultCode && json.response.header.resultCode !== "00") {
    throw new Error(json.response.header.resultMsg || "kstartup API failed");
  }
  return json.data || json.response?.body?.items || [];
}

async function writeGenerated(policies) {
  await mkdir(dirname(outputPath), { recursive: true });
  const content = `import type { Policy } from "./policies";\n\nexport const kstartupApiPolicies: Policy[] = ${JSON.stringify(policies, null, 2)};\n`;
  await writeFile(outputPath, content, "utf8");
}

async function keepExisting(reason) {
  try {
    await readFile(outputPath, "utf8");
    console.warn(`[kstartup-api] ${reason}. Keeping existing generated data.`);
  } catch {
    await writeGenerated([]);
    console.warn(`[kstartup-api] ${reason}. Created empty generated data.`);
  }
}

if (!key) {
  await keepExisting("GOVFIND_KSTARTUP_API_KEY is not set");
  process.exit(0);
}

try {
  const maxRows = Number(process.env.GOVFIND_KSTARTUP_API_ROWS || 40);
  const records = [];
  for (let page = 1; records.length < maxRows && page <= 8; page += 1) {
    const pageRecords = await request(page);
    if (!pageRecords.length) break;
    records.push(...pageRecords);
  }
  const uniqueRecords = [
    ...new Map(records.map((record) => [text(record.pbanc_sn || record.biz_pbanc_nm), record])).values()
  ];
  if (!uniqueRecords.length) {
    await keepExisting("API response did not contain announcement records");
    process.exit(0);
  }
  const policies = uniqueRecords.slice(0, maxRows).map(policyFromKstartup);
  await writeGenerated(policies);
  console.log(`[kstartup-api] Generated ${policies.length} startup policies.`);
} catch (error) {
  await keepExisting(error instanceof Error ? error.message : String(error));
}
