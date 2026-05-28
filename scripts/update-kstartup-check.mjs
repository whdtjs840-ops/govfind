import {
  classificationOf,
  loadKstartupStagingItems,
  selectKstartupCandidatesFromItems,
  summarizeKstartupStagingItem
} from "./importers/kstartup-promotion-utils.mjs";
import { runCacheUpdateCheck } from "./importers/cache-update-check-runner.mjs";
import { hasFlag } from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "kstartup";
const REPORT_PATH = "data/staging/automation/update-kstartup-check-report.json";

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for update checks. Run explicit discovery commands after approval.");
  }

  await runCacheUpdateCheck({
    sourceName: SOURCE_NAME,
    reportPath: REPORT_PATH,
    loadItems: loadKstartupStagingItems,
    selectCandidates: selectKstartupCandidatesFromItems,
    classificationOf,
    summarizeItem: summarizeKstartupStagingItem,
    currentSourceMatcher: (source) => source.includes("K-Startup"),
    discoveryCommand: "npm.cmd run discover:kstartup -- --pages=<pages> --limit=100 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:kstartup:apply:dry-run -- --limit=${count}`
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
