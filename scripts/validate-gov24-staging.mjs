import { resolve } from "node:path";
import {
  buildStagingReport,
  latestJsonFile,
  printStagingReport,
  readJson,
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

function hasOnlyKnownStatuses(stagingPayload) {
  const allowed = new Set(["ready", "publishable_with_warning", "incomplete", "needsReview", "duplicate", "duplicate_candidate", "needs_manual_review"]);
  return (stagingPayload.items ?? []).every((item) => allowed.has(item.classification ?? item.status));
}

async function main() {
  const outDir = argValue("out-dir") ?? "data/imports/gov24";
  const stagingPath = argValue("staging") ?? (await latestJsonFile(resolve(outDir, "staging"), ".staging.json"));

  if (!stagingPath) {
    console.log("Gov24 staging validator");
    console.log("No staging artifact found. Run normalize:staging:gov24 or import:gov24:dry-run with --save first.");
    return;
  }

  const stagingPayload = await readJson(stagingPath);
  if (!Array.isArray(stagingPayload.items)) {
    throw new Error("Invalid staging artifact: items must be an array");
  }
  if (!hasOnlyKnownStatuses(stagingPayload)) {
    throw new Error("Invalid staging artifact: item classification must be one of ready, publishable_with_warning, incomplete, needsReview, duplicate");
  }

  const report = buildStagingReport(stagingPayload);
  const reportPath = resolve(outDir, "reports", stagingPath.split(/[\\/]/).pop().replace(".staging.json", ".validation-report.json"));
  report.stagingFilePath = stagingPath;
  report.validationReportFilePath = reportPath;
  await writeJson(reportPath, report);

  console.log("Gov24 staging validator");
  console.log(`staging input path: ${stagingPath}`);
  printStagingReport(report);
  console.log(`saved validation report path: ${reportPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
