import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { Gov24ApiError, gov24BenefitsAdapter } from "./gov24-benefits-adapter.mjs";

async function mapLimit(items, limit, mapper) {
  const results = [];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

export class Gov24DiscoveryError extends Error {
  constructor({ message, apiError = null, failedAtPage = null, partialRawPayload = null, pagesRequested = [] }) {
    super(message);
    this.name = "Gov24DiscoveryError";
    this.apiError = apiError;
    this.failedAtPage = failedAtPage;
    this.partialRawPayload = partialRawPayload;
    this.pagesRequested = pagesRequested;
  }
}

export function parsePagesOption(value) {
  if (!value) return null;
  const pages = String(value)
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((page) => Number.isInteger(page) && page > 0);
  return [...new Set(pages)];
}

export function buildRequestedPages({ pages = null, startPage = 1, maxPages = 1, resumeAfterPage = null } = {}) {
  if (Array.isArray(pages) && pages.length) return [...new Set(pages)].sort((a, b) => a - b);
  const firstPage = Number(resumeAfterPage ?? startPage);
  return Array.from({ length: Math.max(Number(maxPages) || 1, 1) }, (_, index) => firstPage + index);
}

export function redactRequestParams(params = {}) {
  const redacted = { ...params };
  for (const key of Object.keys(redacted)) {
    if (/key|servicekey|api/i.test(key)) redacted[key] = "[REDACTED]";
  }
  return redacted;
}

export function cacheFilePath({ cacheDir = "data/staging/gov24/cache", page, limit }) {
  return resolve(cacheDir, `serviceList-page-${page}-limit-${limit}.json`);
}

async function readPageCache({ cacheDir, page, limit }) {
  const path = cacheFilePath({ cacheDir, page, limit });
  if (!existsSync(path)) return null;
  return JSON.parse(await readFile(path, "utf8"));
}

async function writePageCache({ cacheDir, page, limit, payload }) {
  const path = cacheFilePath({ cacheDir, page, limit });
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return path;
}

function rawPayloadMeta({ sourceName, startPage, limit, maxPages, pagesRequested, pages, totalAvailable, cacheHits, apiCallsMade }) {
  const lastSuccessfulPage = pages.length ? pages[pages.length - 1].page : null;
  return {
    sourceName,
    adapterName: sourceName,
    endpointName: "serviceList",
    detailEndpointName: "serviceDetail",
    responseItemArrayPath: "data",
    requestParams: redactRequestParams({
      startPage,
      limit,
      maxPages,
      pages: pagesRequested.join(","),
      serviceKey: process.env.GOVFIND_GOV24_API_KEY ? "[REDACTED]" : undefined
    }),
    page: startPage,
    limit,
    maxPages,
    pagesRequested,
    pagesFetched: pages.length,
    lastSuccessfulPage,
    pages,
    cacheHits,
    apiCallsMade,
    totalAvailable,
    fetchedAt: new Date().toISOString()
  };
}

async function fetchPageWithDetails({ page, limit, detailConcurrency }) {
  const listPayload = await gov24BenefitsAdapter.fetchPage({ page, limit });
  const pageItems = listPayload.items ?? [];
  const entries = await mapLimit(pageItems, detailConcurrency, async (listItem, indexOnPage) => {
    const detail = await gov24BenefitsAdapter.fetchDetail(listItem);
    return { listItem, detail, page, indexOnPage };
  });
  return {
    meta: {
      page,
      limit,
      rawCount: pageItems.length,
      totalCount: listPayload.meta?.totalCount ?? null,
      currentCount: listPayload.meta?.currentCount ?? pageItems.length,
      cachedAt: new Date().toISOString()
    },
    items: entries
  };
}

export async function fetchGov24RawPayload({
  startPage = 1,
  limit = 5,
  maxPages = 1,
  pages = null,
  resumeAfterPage = null,
  detailConcurrency = 5,
  useCache = true,
  cacheDir = "data/staging/gov24/cache"
} = {}) {
  const sourceName = gov24BenefitsAdapter.sourceName;
  const pagesRequested = buildRequestedPages({ pages, startPage, maxPages, resumeAfterPage });
  const pageMetadata = [];
  const items = [];
  let totalAvailable = null;
  let cacheHits = 0;
  let apiCallsMade = 0;

  for (const page of pagesRequested) {
    let pagePayload = useCache ? await readPageCache({ cacheDir, page, limit }) : null;
    const cacheHit = Boolean(pagePayload);

    if (!pagePayload) {
      try {
        pagePayload = await fetchPageWithDetails({ page, limit, detailConcurrency });
        apiCallsMade += 1;
      } catch (error) {
        const partialRawPayload = {
          meta: rawPayloadMeta({
            sourceName,
            startPage,
            limit,
            maxPages,
            pagesRequested,
            pages: pageMetadata,
            totalAvailable,
            cacheHits,
            apiCallsMade
          }),
          items
        };
        throw new Gov24DiscoveryError({
          message: error instanceof Error ? error.message : String(error),
          apiError: error instanceof Gov24ApiError ? error : null,
          failedAtPage: page,
          partialRawPayload,
          pagesRequested
        });
      }

      if (useCache) await writePageCache({ cacheDir, page, limit, payload: pagePayload });
    } else {
      cacheHits += 1;
    }

    const pageItems = pagePayload.items ?? [];
    pageMetadata.push({
      page,
      limit,
      rawCount: pagePayload.meta?.rawCount ?? pageItems.length,
      totalCount: pagePayload.meta?.totalCount ?? null,
      currentCount: pagePayload.meta?.currentCount ?? pageItems.length,
      cacheHit
    });
    if (typeof pagePayload.meta?.totalCount === "number") totalAvailable = pagePayload.meta.totalCount;
    items.push(...pageItems);
  }

  return {
    meta: rawPayloadMeta({
      sourceName,
      startPage,
      limit,
      maxPages,
      pagesRequested,
      pages: pageMetadata,
      totalAvailable,
      cacheHits,
      apiCallsMade
    }),
    items
  };
}
