import {
  classificationOf,
  loadOntongYouthStagingItems,
  selectOntongYouthCandidatesFromItems,
  summarizeOntongYouthStagingItem
} from "./importers/ontong-youth-promotion-utils.mjs";
import { runCacheUpdateCheck } from "./importers/cache-update-check-runner.mjs";
import { hasFlag } from "./importers/update-check-utils.mjs";

const SOURCE_NAME = "ontong-youth";
const REPORT_PATH = "data/staging/automation/update-ontong-youth-check-report.json";

async function main() {
  if (hasFlag("fetch")) {
    throw new Error("--fetch is intentionally disabled for update checks. Run explicit discovery commands after approval.");
  }

  await runCacheUpdateCheck({
    sourceName: SOURCE_NAME,
    reportPath: REPORT_PATH,
    loadItems: loadOntongYouthStagingItems,
    selectCandidates: selectOntongYouthCandidatesFromItems,
    classificationOf,
    summarizeItem: summarizeOntongYouthStagingItem,
    currentSourceMatcher: (source) => source.includes("온통청년"),
    discoveryCommand: "npm.cmd run discover:ontong-youth -- --pages=<pages> --limit=50 --save --resume",
    dryRunCommand: (count) => `npm.cmd run promote:ontong-youth:apply:dry-run -- --limit=${count}`
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
