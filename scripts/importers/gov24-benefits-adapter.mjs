import {
  GOV24_SOURCE_NAME,
  getGov24ExternalId,
  normalizeGov24Item,
  normalizeOfficialUrl
} from "./gov24-normalizers.mjs";

const API_BASE_URL = "https://api.odcloud.kr/api/gov24/v3";

export class Gov24ApiError extends Error {
  constructor({ status = null, code = null, message, kind = "api_error", bodyPreview = "" }) {
    super(message);
    this.name = "Gov24ApiError";
    this.status = status;
    this.code = code;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function classifyGov24ApiError({ status = null, code = null, message = "", body = "" } = {}) {
  const text = `${code ?? ""} ${message} ${body}`.toLowerCase();
  if (text.includes("트래픽 허용 횟수") || text.includes("quota") || text.includes("rate limit")) {
    return "quota_exceeded";
  }
  if (text.includes("service key") || text.includes("servicekey") || text.includes("인증") || text.includes("invalid")) {
    return "service_key_error";
  }
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

function getApiKey() {
  const key = process.env.GOVFIND_GOV24_API_KEY;
  if (!key) throw new Error("GOVFIND_GOV24_API_KEY is not set");
  return key;
}

async function request(path, params) {
  const url = new URL(`${API_BASE_URL}/${path}`);
  url.searchParams.set("serviceKey", getApiKey());
  url.searchParams.set("returnType", "JSON");
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url);
  const body = await response.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    throw new Gov24ApiError({
      status: response.status,
      message: `Gov24 returned non-JSON response (${response.status})`,
      kind: "api_error",
      bodyPreview: body.slice(0, 200)
    });
  }

  const apiCode = json.code ?? json.errorCode ?? null;
  const apiMessage = json.msg ?? json.message ?? json.errorMessage ?? "";
  const looksLikeApiError = (apiCode !== null && Number(apiCode) !== 0) || /SERVICE_KEY|INVALID|quota|rate limit|트래픽 허용 횟수/i.test(String(apiMessage));

  if (!response.ok || looksLikeApiError) {
    const kind = classifyGov24ApiError({
      status: response.status,
      code: apiCode,
      message: apiMessage,
      body
    });
    throw new Gov24ApiError({
      status: response.status,
      code: apiCode,
      message: `Gov24 request failed ${response.status}: ${apiMessage || body.slice(0, 120)}`,
      kind,
      bodyPreview: body.slice(0, 200)
    });
  }
  return json;
}

export const gov24BenefitsAdapter = {
  sourceName: GOV24_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 5 } = {}) {
    const json = await request("serviceList", { page, perPage: limit });
    const items = Array.isArray(json.data) ? json.data : [];
    return {
      meta: {
        sourceName: GOV24_SOURCE_NAME,
        endpoint: "serviceList",
        page,
        limit,
        totalCount: json.totalCount ?? null,
        currentCount: json.currentCount ?? items.length
      },
      items
    };
  },

  async fetchDetail(raw) {
    const id = this.getExternalId(raw);
    if (!id) return {};
    try {
      const json = await request("serviceDetail", {
        page: 1,
        perPage: 1,
        "cond[서비스ID::EQ]": id
      });
      return Array.isArray(json.data) ? json.data[0] ?? {} : {};
    } catch {
      return {};
    }
  },

  getExternalId(raw) {
    return getGov24ExternalId(raw);
  },

  getOfficialUrl(raw, detail = {}) {
    const merged = { ...raw, ...detail };
    const explicitUrl = normalizeOfficialUrl(merged["상세조회URL"]) || normalizeOfficialUrl(merged["온라인신청사이트URL"]);
    const id = getGov24ExternalId(merged);
    return explicitUrl || (id ? `https://www.gov.kr/portal/rcvfvrSvc/dtlEx/${id}` : null);
  },

  normalizeItem(raw, detail = {}) {
    return normalizeGov24Item(raw, detail);
  }
};
