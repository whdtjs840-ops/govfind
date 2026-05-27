import { getSourceAdapter } from "../adapters/registry";
import { prisma } from "../db";
import { indexPolicies } from "../search/meili";
import { printSummary, runSourceSync } from "./sync-core";

function argValue(name: string) {
  const prefix = `--${name}=`;
  const found = process.argv.find((item) => item.startsWith(prefix));
  return found ? found.slice(prefix.length) : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

async function main() {
  const source = argValue("source") ?? "gov24-public-service-benefits";
  const adapter = getSourceAdapter(source);
  if (!adapter) throw new Error(`Unknown source adapter: ${source}`);

  const page = Number(argValue("page") ?? process.env.GOVFIND_GOV24_PAGE ?? 1);
  const perPage = Number(argValue("per-page") ?? process.env.GOVFIND_GOV24_PER_PAGE ?? 20);
  const dryRun = hasFlag("dry-run");

  const summary = await runSourceSync(adapter, { page, perPage, dryRun });
  printSummary(summary);

  if (!dryRun && summary.insertedCount + summary.updatedCount > 0) {
    const rows = await prisma.policy.findMany({ where: { isPublished: true }, orderBy: { updatedAt: "desc" } });
    await indexPolicies(
      rows.map((row) => ({
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        category: row.category,
        agencyName: row.agencyName,
        regionScope: row.regionScope as any,
        regions: row.regions,
        applyType: row.applyType as any,
        applyStatus: row.applyStatus as any,
        applyStartAt: row.applyStartAt?.toISOString() ?? null,
        applyEndAt: row.applyEndAt?.toISOString() ?? null,
        supportSummary: row.supportSummary,
        eligibilitySummary: row.eligibilitySummary,
        contentSummary: row.contentSummary,
        applyMethodSummary: row.applyMethodSummary,
        officialUrl: row.officialUrl,
        sourceUrl: row.sourceUrl,
        sourceSystem: row.sourceSystem as any,
        lifeStages: row.lifeStages,
        targetGroups: row.targetGroups,
        requiredDocs: row.requiredDocs,
        lastCheckedAt: row.lastCheckedAt?.toISOString() ?? null,
        faq: Array.isArray((row.faqJson as any)?.items) ? (row.faqJson as any).items : []
      }))
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    printSummary({
      fetchedCount: 0,
      insertedCount: 0,
      updatedCount: 0,
      skippedDuplicateCount: 0,
      failedCount: 1
    });
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
