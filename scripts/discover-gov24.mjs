import { existsSync, readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gov24BenefitsAdapter } from "./importers/gov24-benefits-adapter.mjs";
import { buildDiscoveryErrorReport, saveDiscoveryErrorReport } from "./importers/gov24-discovery-report.mjs";
import {
  buildRequestedPages,
  fetchGov24RawPayload,
  parsePagesOption
} from "./importers/gov24-discovery-runner.mjs";
import {
  buildStagingPayloadFromRaw,
  buildStagingReport,
  printStagingReport,
  saveGov24Artifacts,
  writeJson
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
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
      const [rawKey, ...rawValue] = trimmed.split("=");
      const key = rawKey.trim();
      if (!process.env[key]) process.env[key] = rawValue.join("=").trim().replace(/^['"]|['"]$/g, "");
    }
  } catch {
    // Explicit environment variables still work.
  }
}

function discoveryReportPath(outDir) {
  return resolve(outDir, "discovery-report.json");
}

function latestSuccessfulPageFromReport(outDir) {
  const path = discoveryReportPath(outDir);
  if (!existsSync(path)) return null;
  try {
    const report = JSON.parse(readFileSync(path, "utf8"));
    if (report.status !== "success" && report.status !== "partial") return null;
    return Number(report.lastSuccessfulPage ?? 0) || null;
  } catch {
    return null;
  }
}

async function main() {
  if (!hasFlag("no-env-file")) loadLocalEnv();

  const startPageInput = Number(argValue("start-page") ?? argValue("page") ?? 1);
  const limit = Number(argValue("limit") ?? argValue("per-page") ?? 100);
  const maxPages = Number(argValue("max-pages") ?? 3);
  const explicitPages = parsePagesOption(argValue("pages"));
  const outDir = argValue("out-dir") ?? "data/staging/gov24";
  const cacheDir = argValue("cache-dir") ?? resolve(outDir, "cache");
  const useCache = !hasFlag("no-cache");
  const resume = hasFlag("resume");
  const resumeAfterPage = resume && !explicitPages ? latestSuccessfulPageFromReport(outDir) : null;
  const startPage = resumeAfterPage ? resumeAfterPage + 1 : startPageInput;
  const pagesRequested = buildRequestedPages({
    pages: explicitPages,
    startPage,
    maxPages
  });
  const saveImports = hasFlag("save-imports") || hasFlag("save");

  console.log("Gov24 discovery");
  console.log(`sourceName: ${gov24BenefitsAdapter.sourceName}`);
  console.log(`estimatedRequestCount: ${useCache ? "up to " : ""}${pagesRequested.length} list pages plus uncached detail lookups`);
  console.log(`pagesRequested: ${JSON.stringify(pagesRequested)}`);
  console.log(`cache: ${useCache ? "enabled" : "disabled"}`);
  if (resume) console.log(`resume: enabled${resumeAfterPage ? ` after page ${resumeAfterPage}` : ""}`);

  if (!process.env.GOVFIND_GOV24_API_KEY) {
    console.log("GOVFIND_GOV24_API_KEY is not set. No files were written.");
    process.exitCode = 1;
    return;
  }

  let rawPayload;
  try {
    rawPayload = await fetchGov24RawPayload({
      startPage,
      limit,
      maxPages,
      pages: explicitPages,
      useCache,
      cacheDir
    });
  } catch (error) {
    await mkdir(resolve(outDir, "errors"), { recursive: true });
    const report = buildDiscoveryErrorReport({
      error,
      outDir,
      params: {
        startPage,
        limit,
        maxPages,
        pagesRequested,
        requestParams: { startPage, limit, maxPages, pages: pagesRequested.join(","), serviceKey: "[REDACTED]" }
      }
    });
    const reportPath = await saveDiscoveryErrorReport({ report });
    console.log(error instanceof Error ? error.message : String(error));
    printStagingReport(report);
    console.log(`saved error report path: ${reportPath}`);
    process.exitCode = 1;
    return;
  }

  const stagingPayload = buildStagingPayloadFromRaw(rawPayload);
  const report = buildStagingReport(stagingPayload, rawPayload);
  report.status = "success";
  report.runAt = new Date().toISOString();
  report.params = { startPage, limit, maxPages, pages: pagesRequested, cache: useCache, resume };

  await mkdir(outDir, { recursive: true });
  const reportPath = discoveryReportPath(outDir);
  report.validationReportFilePath = reportPath;
  await writeJson(reportPath, report);

  if (saveImports) {
    await saveGov24Artifacts({ outDir: "data/imports/gov24", rawPayload, stagingPayload, report });
  }

  printStagingReport(report);
  console.log(`saved discovery report path: ${reportPath}`);

  if (report.rawCount <= 5 && limit > 5 && pagesRequested.length > 1) {
    console.log("rawCount did not grow beyond 5. Check whether page/limit params are honored, response path is data, API returned an error payload, or the key/endpoint is limited.");
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
