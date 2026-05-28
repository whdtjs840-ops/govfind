import {
  BOKJIRO_LOCAL_SOURCE_NAME,
  getExternalId,
  normalizeBokjiroLocalItem,
  normalizeOfficialUrl,
  parseXmlCount,
  parseXmlItems,
  parseXmlObject
} from "./bokjiro-local-normalizers.mjs";

const API_BASE_URL = "https://apis.data.go.kr/B554287/LocalGovernmentWelfareInformations";

export class BokjiroLocalApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "BokjiroLocalApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyBokjiroLocalApiError({ status = null, message = "", body = "" } = {}) {
  const text = `${message} ${body}`.toLowerCase();
  if (text.includes("quota") || text.includes("rate limit") || text.includes("traffic") || text.includes("traffic_limited")) {
    return "quota_exceeded";
  }
  if (text.includes("service_key") || text.includes("servicekey") || text.includes("unauthorized") || text.includes("invalid")) {
    return "service_key_error";
  }
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

function getApiKey() {
  const key = process.env.GOVFIND_BOKJIRO_LOCAL_API_KEY || process.env.GOVFIND_WELFARE_API_KEY;
  if (!key) throw new Error("GOVFIND_BOKJIRO_LOCAL_API_KEY is not set");
  return key;
}

async function request(path, params = {}) {
  const url = new URL(`${API_BASE_URL}/${path}`);
  url.searchParams.set("serviceKey", getApiKey());
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const response = await fetch(url);
  const body = await response.text();
  const looksLikeApiError = /SERVICE_KEY|INVALID_REQUEST|NO DATA FOUND|ERROR|quota|rate limit|traffic/i.test(body);
  if (!response.ok || looksLikeApiError) {
    const kind = classifyBokjiroLocalApiError({ status: response.status, body });
    throw new BokjiroLocalApiError({
      status: response.status,
      message: `Bokjiro local request failed ${response.status}: ${body.slice(0, 160)}`,
      kind,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const bokjiroLocalAdapter = {
  sourceName: BOKJIRO_LOCAL_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 20 } = {}) {
    const body = await request("LcgvWelfarelist", {
      pageNo: page,
      numOfRows: limit
    });
    const items = parseXmlItems(body);
    const meta = parseXmlCount(body);
    return {
      meta: {
        sourceName: BOKJIRO_LOCAL_SOURCE_NAME,
        endpointName: "LcgvWelfarelist",
        responseItemArrayPath: "response.body.items.servList",
        page,
        limit,
        totalCount: meta.totalCount,
        currentCount: items.length,
        requestParams: {
          pageNo: page,
          numOfRows: limit,
          serviceKey: "[REDACTED]"
        }
      },
      items
    };
  },

  async fetchDetail(raw) {
    const id = this.getExternalId(raw);
    if (!id) return {};
    try {
      const body = await request("LcgvWelfaredetailed", { servId: id });
      const records = parseXmlItems(body);
      if (records[0]) return records[0];
      return parseXmlObject(body);
    } catch {
      return {};
    }
  },

  getExternalId(raw) {
    return getExternalId(raw);
  },

  getOfficialUrl(raw, detail = {}) {
    const merged = { ...raw, ...detail };
    return normalizeOfficialUrl(merged.servDtlLink || merged.svcUrl || merged.url, this.getExternalId(merged));
  },

  normalizeItem(raw, detail = {}) {
    return normalizeBokjiroLocalItem(raw, detail);
  }
};
