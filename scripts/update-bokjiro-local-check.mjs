import {
  classificationOf,
  loadBokjiroLocalStagingItems,
  selectBokjiroLocalCandidatesFromItems,
  summarizeBokjiroLocalStagingItem
} from "./importers/bokjiro-local-promotion-utils.mjs";
import { runCacheUpdateCheck } from "./importers/cache-update-check-runner.mjs";
import { hasFlag } from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "bokjiro-local";
const REPORT_PATH = "data/staging/automation/update-bokjiro-local-check-report.json";

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for update checks. Run explicit discovery commands after approval.");
  }

  await runCacheUpdateCheck({
    sourceName: SOURCE_NAME,
    reportPath: REPORT_PATH,
    loadItems: loadBokjiroLocalStagingItems,
    selectCandidates: selectBokjiroLocalCandidatesFromItems,
    classificationOf,
    summarizeItem: summarizeBokjiroLocalStagingItem,
    currentSourceMatcher: (source) => source.includes("복지로 지자체복지"),
    discoveryCommand: "npm.cmd run discover:bokjiro-local -- --pages=<pages> --limit=50 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:bokjiro-local:apply:dry-run -- --limit=${count}`
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
