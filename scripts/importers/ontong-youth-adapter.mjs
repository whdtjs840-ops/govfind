import {
  ONTONG_YOUTH_SOURCE_NAME,
  getExternalId,
  normalizeOfficialUrl,
  normalizeOntongYouthItem,
  parseXmlItems
} from "./ontong-youth-normalizers.mjs";

const API_BASE_URL = "https://www.youthcenter.go.kr/go/ythip/getPlcy";

export class OntongYouthApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "OntongYouthApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyOntongYouthApiError({ status = null, message = "", body = "" } = {}) {
  const text = `${message} ${body}`.toLowerCase();
  if (text.includes("quota") || text.includes("rate limit") || text.includes("traffic")) return "quota_exceeded";
  if (text.includes("apikey") || text.includes("api key") || text.includes("unauthorized") || text.includes("invalid")) {
    return "service_key_error";
  }
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

function getApiKey() {
  const key = process.env.GOVFIND_ONTONG_YOUTH_API_KEY || process.env.GOVFIND_YOUTH_API_KEY;
  if (!key) throw new Error("GOVFIND_ONTONG_YOUTH_API_KEY is not set");
  return key;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getItemsFromJson(json) {
  const candidates = [
    json?.result?.youthPolicyList,
    json?.result?.policyList,
    json?.result?.items,
    json?.youthPolicyList,
    json?.policyList,
    json?.data?.list,
    json?.data?.items,
    json?.data,
    json?.items,
    json?.list
  ];
  for (const candidate of candidates) {
    const list = asArray(candidate).filter(Boolean);
    if (list.length) return list;
  }
  return [];
}

function getTotalCountFromJson(json) {
  const candidates = [
    json?.result?.totalCnt,
    json?.result?.totalCount,
    json?.result?.totCnt,
    json?.totalCnt,
    json?.totalCount,
    json?.totCnt,
    json?.pagination?.totalCount,
    json?.data?.totalCount
  ];
  for (const candidate of candidates) {
    const count = Number(candidate);
    if (Number.isFinite(count) && count >= 0) return count;
  }
  return null;
}

function parseResponse(body) {
  try {
    const json = JSON.parse(body);
    return {
      format: "json",
      items: getItemsFromJson(json),
      totalCount: getTotalCountFromJson(json),
      raw: json
    };
  } catch {
    const items = parseXmlItems(body);
    return { format: "xml", items, totalCount: null, raw: null };
  }
}

async function request(params = {}) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("apiKeyNm", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  const looksLikeApiError = /INVALID|ERROR|quota|rate limit|traffic|unauthorized|apiKey/i.test(body);
  if (!response.ok || looksLikeApiError) {
    const kind = classifyOntongYouthApiError({ status: response.status, body });
    throw new OntongYouthApiError({
      status: response.status,
      message: `OntongYouth request failed ${response.status}: ${body.slice(0, 160)}`,
      kind,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const ontongYouthAdapter = {
  sourceName: ONTONG_YOUTH_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 20 } = {}) {
    const body = await request({
      pageNum: page,
      pageSize: limit,
      rtnType: "json"
    });
    const parsed = parseResponse(body);
    return {
      meta: {
        sourceName: ONTONG_YOUTH_SOURCE_NAME,
        endpointName: "getPlcy",
        responseItemArrayPath: parsed.format === "json" ? "result.youthPolicyList" : "xml policy item",
        page,
        limit,
        totalCount: parsed.totalCount,
        currentCount: parsed.items.length,
        requestParams: {
          pageNum: page,
          pageSize: limit,
          rtnType: "json",
          apiKeyNm: "[REDACTED]"
        }
      },
      items: parsed.items
    };
  },

  async fetchDetail() {
    return {};
  },

  getExternalId(raw) {
    return getExternalId(raw);
  },

  getOfficialUrl(raw) {
    return normalizeOfficialUrl(raw?.aplyUrlAddr || raw?.refUrlAddr1 || raw?.refUrlAddr2 || raw?.rfcSiteUrlAddr || raw?.url);
  },

  normalizeItem(raw, detail = {}) {
    return normalizeOntongYouthItem({ ...raw, ...detail });
  }
};
