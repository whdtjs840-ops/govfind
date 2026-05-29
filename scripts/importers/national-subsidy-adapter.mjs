import {
  ENDPOINT_ENV_KEY,
  ENV_KEY_CANDIDATES,
  NATIONAL_SUBSIDY_SOURCE_NAME,
  getExternalId,
  normalizeNationalSubsidyItem,
  normalizeOfficialUrl,
  parseXmlItems
} from "./national-subsidy-normalizers.mjs";

export class NationalSubsidyApiError extends Error {
  constructor({ status = null, kind = "api_error", message, bodyPreview = "" }) {
    super(message);
    this.name = "NationalSubsidyApiError";
    this.status = status;
    this.kind = kind;
    this.bodyPreview = bodyPreview;
  }
}

export function getConfiguredApiKeyName() {
  return ENV_KEY_CANDIDATES.find((name) => Boolean(process.env[name])) ?? null;
}

function getApiKey() {
  const keyName = getConfiguredApiKeyName();
  if (!keyName) {
    throw new NationalSubsidyApiError({
      kind: "service_key_required",
      message: `${ENV_KEY_CANDIDATES.join(" or ")} is not set`
    });
  }
  return process.env[keyName];
}

function getEndpoint() {
  const endpoint = process.env[ENDPOINT_ENV_KEY];
  if (!endpoint) {
    throw new NationalSubsidyApiError({
      kind: "endpoint_required",
      message: `${ENDPOINT_ENV_KEY} is not set`
    });
  }
  return endpoint;
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getItemsFromJson(json) {
  const candidates = [
    json?.response?.body?.items?.item,
    json?.response?.body?.items,
    json?.body?.items?.item,
    json?.items?.item,
    json?.items,
    json?.data?.items,
    json?.data?.list,
    json?.list,
    json?.item
  ];
  for (const candidate of candidates) {
    const items = asArray(candidate).filter(Boolean);
    if (items.length) return items;
  }
  return [];
}

function getTotalCountFromJson(json, items) {
  const candidates = [
    json?.response?.body?.totalCount,
    json?.body?.totalCount,
    json?.totalCount,
    json?.totCnt,
    json?.data?.totalCount,
    items?.[0]?.totalCount,
    items?.[0]?.totCnt
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
    return { format: "json", items, totalCount: getTotalCountFromJson(json, items), raw: json };
  } catch {
    const items = parseXmlItems(body);
    const totalCount = Number(items.find((item) => item.totalCount || item.totCnt)?.totalCount ?? items.find((item) => item.totalCount || item.totCnt)?.totCnt);
    return { format: "xml", items, totalCount: Number.isFinite(totalCount) ? totalCount : null, raw: null };
  }
}

function classifyApiError({ status = null, body = "" } = {}) {
  const text = String(body).toLowerCase();
  if (text.includes("quota") || text.includes("rate limit") || text.includes("traffic") || text.includes("limit")) return "quota_exceeded";
  if (text.includes("servicekey") || text.includes("service key") || text.includes("unauthorized") || text.includes("invalid") || text.includes("인증")) return "service_key_error";
  if (status && status >= 400) return "api_error";
  return "unknown_api_error";
}

async function request({ page = 1, limit = 20 } = {}) {
  const url = new URL(getEndpoint());
  url.searchParams.set("serviceKey", getApiKey());
  url.searchParams.set("pageNo", String(page));
  url.searchParams.set("numOfRows", String(limit));
  url.searchParams.set("_type", "json");

  const response = await fetch(url);
  const body = await response.text();
  const looksLikeError = /SERVICE_KEY|ERROR|INVALID|quota|rate limit|traffic|unauthorized|인증|오류/i.test(body);
  if (!response.ok || looksLikeError) {
    const kind = classifyApiError({ status: response.status, body });
    throw new NationalSubsidyApiError({
      status: response.status,
      kind,
      message: `National subsidy request failed ${response.status}`,
      bodyPreview: body.slice(0, 240)
    });
  }
  return body;
}

export const nationalSubsidyAdapter = {
  sourceName: NATIONAL_SUBSIDY_SOURCE_NAME,

  async fetchPage({ page = 1, limit = 20 } = {}) {
    const body = await request({ page, limit });
    const parsed = parseResponse(body);
    return {
      meta: {
        sourceName: NATIONAL_SUBSIDY_SOURCE_NAME,
        endpointName: "national-subsidy-openapi",
        responseItemArrayPath: parsed.format === "json" ? "response.body.items.item" : "response.body.items.item",
        page,
        limit,
        totalCount: parsed.totalCount,
        currentCount: parsed.items.length,
        requestParams: {
          serviceKey: "[REDACTED]",
          pageNo: page,
          numOfRows: limit,
          _type: "json"
        }
      },
      items: parsed.items
    };
  },

  getExternalId(raw) {
    return getExternalId(raw);
  },

  getOfficialUrl(raw) {
    return normalizeOfficialUrl(raw?.pblancUrl || raw?.pbancUrl || raw?.detailUrl || raw?.url || raw?.link);
  },

  normalizeItem(raw, detail = {}) {
    return normalizeNationalSubsidyItem({ ...raw, ...detail });
  }
};
