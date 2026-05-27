import { resolve } from "node:path";
import {
  buildStagingPayloadFromRaw,
  buildStagingReport,
  latestJsonFile,
  printStagingReport,
  readJson,
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

async function main() {
  const outDir = argValue("out-dir") ?? "data/imports/gov24";
  const rawPath = argValue("raw") ?? (await latestJsonFile(resolve(outDir, "raw"), ".raw.json"));

  if (!rawPath) {
    console.log("Gov24 staging normalizer");
    console.log("No raw artifact found. Run import:gov24:dry-run with --save first, or pass --raw=...");
    return;
  }

  const rawPayload = await readJson(rawPath);
  const stagingPayload = buildStagingPayloadFromRaw(rawPayload);
  const report = buildStagingReport(stagingPayload, rawPayload);
  await saveGov24Artifacts({ outDir, rawPayload, stagingPayload, report });

  console.log("Gov24 staging normalizer");
  console.log(`raw input path: ${rawPath}`);
  printStagingReport(report);
  console.log(`saved staging path: ${report.savedPaths.staging}`);
  console.log(`saved report path: ${report.savedPaths.report}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
