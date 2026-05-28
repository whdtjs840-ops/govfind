import {
  classificationOf,
  loadBizinfoStagingItems,
  selectBizinfoCandidatesFromItems,
  summarizeBizinfoStagingItem
} from "./importers/bizinfo-promotion-utils.mjs";
import { runCacheUpdateCheck } from "./importers/cache-update-check-runner.mjs";
import { hasFlag } from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "bizinfo";
const REPORT_PATH = "data/staging/automation/update-bizinfo-check-report.json";

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for update checks. Run explicit discovery commands after approval.");
  }

  await runCacheUpdateCheck({
    sourceName: SOURCE_NAME,
    reportPath: REPORT_PATH,
    loadItems: loadBizinfoStagingItems,
    selectCandidates: selectBizinfoCandidatesFromItems,
    classificationOf,
    summarizeItem: summarizeBizinfoStagingItem,
    currentSourceMatcher: (source) => source.includes("기업마당"),
    discoveryCommand: "npm.cmd run discover:bizinfo -- --pages=<pages> --limit=100 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:bizinfo:apply:dry-run -- --limit=${count}`
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
