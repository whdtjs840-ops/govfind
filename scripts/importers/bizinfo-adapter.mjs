import {
  BIZINFO_SOURCE_NAME,
  getExternalId,
  normalizeBizinfoItem,
  normalizeOfficialUrl,
  parseXmlItems
} from "./bizinfo-normalizers.mjs";

const API_BASE_URL = "https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do";

export class BizinfoApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "BizinfoApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyBizinfoApiError({ status = null, message = "", body = "" } = {}) {
  const text = `${message} ${body}`.toLowerCase();
  if (text.includes("quota") || text.includes("rate limit") || text.includes("traffic") || text.includes("limit")) return "quota_exceeded";
  if (text.includes("crtfc") || text.includes("key") || text.includes("unauthorized") || text.includes("invalid")) return "service_key_error";
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

function getApiKey() {
  const key = process.env.GOVFIND_BIZINFO_API_KEY || process.env.GOVFIND_BIZINFO_CRTFC_KEY;
  if (!key) throw new Error("GOVFIND_BIZINFO_API_KEY is not set");
  return key;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getItemsFromJson(json) {
  const candidates = [
    json?.jsonArray,
    json?.jsonArray?.item,
    json?.jsonArray?.items,
    json?.channel?.item,
    json?.response?.body?.items?.item,
    json?.data?.items,
    json?.data?.list,
    json?.items,
    json?.item
  ];
  for (const candidate of candidates) {
    const list = asArray(candidate).filter(Boolean);
    if (list.length) return list;
  }
  return [];
}

function getTotalCountFromJson(json, items) {
  const first = items?.[0] ?? {};
  const candidates = [
    json?.jsonArray?.totCnt,
    json?.jsonArray?.totalCount,
    json?.totalCount,
    json?.totCnt,
    json?.response?.body?.totalCount,
    first?.totCnt
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
    const items = getItemsFromJson(json);
    return {
      format: "json",
      items,
      totalCount: getTotalCountFromJson(json, items),
      raw: json
    };
  } catch {
    const items = parseXmlItems(body);
    const totalCount = Number(items.find((item) => item.totCnt)?.totCnt);
    return { format: "xml", items, totalCount: Number.isFinite(totalCount) ? totalCount : null, raw: null };
  }
}

async function request(params = {}) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("crtfcKey", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  const looksLikeApiError = /INVALID|ERROR|quota|rate limit|traffic|unauthorized|crtfcKey|인증키|서비스키/i.test(body);
  if (!response.ok || looksLikeApiError) {
    const kind = classifyBizinfoApiError({ status: response.status, body });
    throw new BizinfoApiError({
      status: response.status,
      message: `Bizinfo request failed ${response.status}: ${body.slice(0, 160)}`,
      kind,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const bizinfoAdapter = {
  sourceName: BIZINFO_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 50 } = {}) {
    const body = await request({
      dataType: "json",
      pageUnit: limit,
      pageIndex: page
    });
    const parsed = parseResponse(body);
    return {
      meta: {
        sourceName: BIZINFO_SOURCE_NAME,
        endpointName: "bizinfoApi",
        responseItemArrayPath: parsed.format === "json" ? "jsonArray.item" : "rss.channel.item",
        page,
        limit,
        totalCount: parsed.totalCount,
        currentCount: parsed.items.length,
        requestParams: {
          dataType: "json",
          pageUnit: limit,
          pageIndex: page,
          crtfcKey: "[REDACTED]"
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
    return normalizeOfficialUrl(raw?.pblancUrl || raw?.link);
  },

  normalizeItem(raw, detail = {}) {
    return normalizeBizinfoItem({ ...raw, ...detail });
  }
};
