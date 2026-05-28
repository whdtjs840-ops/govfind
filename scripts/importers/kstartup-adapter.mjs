import {
  KSTARTUP_SOURCE_NAME,
  getExternalId,
  normalizeKstartupItem,
  normalizeOfficialUrl
} from "./kstartup-normalizers.mjs";

const API_BASE_URL = "https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01";

export class KstartupApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "KstartupApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyKstartupApiError({ status = null, message = "", body = "" } = {}) {
  const text = `${message} ${body}`.toLowerCase();
  if (text.includes("quota") || text.includes("rate limit") || text.includes("traffic") || text.includes("limit")) return "quota_exceeded";
  if (text.includes("servicekey") || text.includes("service key") || text.includes("key") || text.includes("unauthorized") || text.includes("invalid")) return "service_key_error";
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

function getApiKey() {
  const key = process.env.GOVFIND_KSTARTUP_API_KEY || process.env.GOVFIND_PUBLIC_SERVICE_API_KEY;
  if (!key) throw new Error("GOVFIND_KSTARTUP_API_KEY is not set");
  return key;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getItemsFromJson(json) {
  const candidates = [
    json?.data,
    json?.data?.item,
    json?.data?.items,
    json?.response?.body?.items?.item,
    json?.response?.body?.items,
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
  const candidates = [
    json?.totalCount,
    json?.totCnt,
    json?.response?.body?.totalCount,
    json?.response?.body?.totalCnt,
    json?.response?.body?.numOfRows
  ];
  for (const candidate of candidates) {
    const count = Number(candidate);
    if (Number.isFinite(count) && count >= 0) return count;
  }
  return items.length || null;
}

function parseResponse(body) {
  const json = JSON.parse(body);
  const resultCode = json?.response?.header?.resultCode;
  if (resultCode && resultCode !== "00") {
    throw new KstartupApiError({
      code: resultCode,
      message: json?.response?.header?.resultMsg || "K-Startup API returned an error",
      kind: classifyKstartupApiError({ body: JSON.stringify(json?.response?.header ?? {}) }),
      bodyPreview: JSON.stringify(json?.response?.header ?? {}).slice(0, 240)
    });
  }
  const items = getItemsFromJson(json);
  return {
    format: "json",
    items,
    totalCount: getTotalCountFromJson(json, items),
    raw: json
  };
}

async function request(params = {}) {
  const url = new URL(API_BASE_URL);
  url.searchParams.set("serviceKey", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  if (!response.ok) {
    const kind = classifyKstartupApiError({ status: response.status, body });
    throw new KstartupApiError({
      status: response.status,
      message: `K-Startup request failed ${response.status}: ${body.slice(0, 160)}`,
      kind,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const kstartupAdapter = {
  sourceName: KSTARTUP_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 50 } = {}) {
    const body = await request({
      page,
      perPage: limit,
      returnType: "json"
    });
    const parsed = parseResponse(body);
    return {
      meta: {
        sourceName: KSTARTUP_SOURCE_NAME,
        endpointName: "kisedKstartupService01.getAnnouncementInformation01",
        responseItemArrayPath: parsed.format === "json" ? "data" : null,
        page,
        limit,
        totalCount: parsed.totalCount,
        currentCount: parsed.items.length,
        requestParams: {
          page,
          perPage: limit,
          returnType: "json",
          serviceKey: "[REDACTED]"
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
    return normalizeOfficialUrl(raw?.detl_pg_url || raw?.detlPgUrl || raw?.biz_gdnc_url || raw?.bizGdncUrl);
  },

  normalizeItem(raw, detail = {}) {
    return normalizeKstartupItem({ ...raw, ...detail });
  }
};
