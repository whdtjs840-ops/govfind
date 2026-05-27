import {
  BOKJIRO_CENTRAL_SOURCE_NAME,
  getExternalId,
  normalizeBokjiroCentralItem,
  normalizeOfficialUrl,
  parseXmlCount,
  parseXmlItems,
  parseXmlObject
} from "./bokjiro-central-normalizers.mjs";

const API_BASE_URL = "https://apis.data.go.kr/B554287/NationalWelfareInformationsV001";

export class BokjiroCentralApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "BokjiroCentralApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyBokjiroCentralApiError({ status = null, message = "", body = "" } = {}) {
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
  const key = process.env.GOVFIND_BOKJIRO_CENTRAL_API_KEY || process.env.GOVFIND_WELFARE_API_KEY;
  if (!key) throw new Error("GOVFIND_BOKJIRO_CENTRAL_API_KEY is not set");
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
    const kind = classifyBokjiroCentralApiError({ status: response.status, body });
    throw new BokjiroCentralApiError({
      status: response.status,
      message: `Bokjiro central request failed ${response.status}: ${body.slice(0, 160)}`,
      kind,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const bokjiroCentralAdapter = {
  sourceName: BOKJIRO_CENTRAL_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 20 } = {}) {
    const body = await request("NationalWelfarelistV001", {
      pageNo: page,
      numOfRows: limit,
      callTp: "L",
      srchKeyCode: "001",
      searchWrd: ""
    });
    const items = parseXmlItems(body);
    const meta = parseXmlCount(body);
    return {
      meta: {
        sourceName: BOKJIRO_CENTRAL_SOURCE_NAME,
        endpointName: "NationalWelfarelistV001",
        responseItemArrayPath: "response.body.items.servList",
        page,
        limit,
        totalCount: meta.totalCount,
        currentCount: items.length,
        requestParams: {
          pageNo: page,
          numOfRows: limit,
          callTp: "L",
          srchKeyCode: "001",
          searchWrd: "",
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
      const body = await request("NationalWelfaredetailedV001", { servId: id });
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
    return normalizeBokjiroCentralItem(raw, detail);
  }
};
