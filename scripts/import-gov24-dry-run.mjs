import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gov24BenefitsAdapter } from "./importers/gov24-benefits-adapter.mjs";
import { fetchGov24RawPayload } from "./importers/gov24-discovery-runner.mjs";
import {
  buildStagingPayloadFromRaw,
  buildStagingReport,
  printStagingReport,
  saveGov24Artifacts
} from "./importers/staging-artifacts.mjs";

function argValue(name) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return undefined;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function loadLocalEnv() {
  try {
    const path = resolve(".env");
    if (!existsSync(path)) return;
    const lines = readFileSync(path, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [rawKey, ...rawValue] = trimmed.split("=");
      const key = rawKey.trim();
      if (process.env[key]) continue;
      process.env[key] = rawValue.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Explicit environment variables still work if local .env loading fails.
  }
}

function emptyReport({ sourceName, startPage, limit, maxPages }) {
  return {
    sourceName,
    adapterName: sourceName,
    endpointName: "serviceList",
    responseItemArrayPath: "data",
    requestParams: { startPage, limit, maxPages, serviceKey: "[REDACTED]" },
    fetchedAt: new Date().toISOString(),
    page: startPage,
    limit,
    maxPages,
    pagesFetched: 0,
    totalAvailable: null,
    rawCount: 0,
    normalizedCount: 0,
    readyCount: 0,
    incompleteCount: 0,
    needsReviewCount: 0,
    duplicateCount: 0,
    duplicateCandidatesCount: 0,
    uniqueNewCandidateCount: 0,
    classifiedTotal: 0,
    invariantPassed: true,
    missingTitleCount: 0,
    missingOrganizationCount: 0,
    missingOfficialUrlOrApplicationUrlCount: 0,
    unknownCategoryCount: 0,
    unknownRegionCount: 0,
    statusNeedsConfirmationCount: 0,
    fieldsThatCouldNotBeMapped: {},
    topMappingGap: null,
    sampleReadyItems: [],
    sampleIncompleteItems: [],
    sampleNeedsReviewItems: [],
    sampleDuplicateItems: [],
    sampleDuplicateCandidates: [],
    sampleUnknownRegionItems: [],
    savedPaths: null
  };
}

async function main() {
  if (!hasFlag("no-env-file")) loadLocalEnv();

  const page = Number(argValue("page") ?? process.env.GOVFIND_GOV24_PAGE ?? 1);
  const startPage = Number(argValue("start-page") ?? page);
  const limit = Number(argValue("limit") ?? argValue("per-page") ?? process.env.GOVFIND_GOV24_PER_PAGE ?? 5);
  const maxPages = Number(argValue("max-pages") ?? 1);
  const save = hasFlag("save");
  const outDir = argValue("out-dir") ?? "data/imports/gov24";
  const cacheDir = argValue("cache-dir") ?? "data/staging/gov24/cache";
  const useCache = !hasFlag("no-cache");
  const sourceName = gov24BenefitsAdapter.sourceName;

  if (!process.env.GOVFIND_GOV24_API_KEY) {
    console.log("Gov24 dry-run importer");
    console.log("GOVFIND_GOV24_API_KEY is not set. No files were written.");
    printStagingReport(emptyReport({ sourceName, startPage, limit, maxPages }));
    return;
  }

  const rawPayload = await fetchGov24RawPayload({ startPage, limit, maxPages, cacheDir, useCache });
  const stagingPayload = buildStagingPayloadFromRaw(rawPayload);
  const report = buildStagingReport(stagingPayload, rawPayload);

  if (save) await saveGov24Artifacts({ outDir, rawPayload, stagingPayload, report });

  console.log("Gov24 dry-run importer");
  printStagingReport(report);
  if (report.savedPaths) {
    console.log(`saved raw path: ${report.savedPaths.raw}`);
    console.log(`saved staging path: ${report.savedPaths.staging}`);
    console.log(`saved report path: ${report.savedPaths.report}`);
  } else {
    console.log("saved paths: not requested; pass --save to write artifacts");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
