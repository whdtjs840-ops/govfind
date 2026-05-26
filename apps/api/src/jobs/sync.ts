import { prisma } from "../db";
import { gov24Adapter } from "../adapters/gov24";
import { bokjiroCentralAdapter } from "../adapters/bokjiro-central";
import { bokjiroLocalAdapter } from "../adapters/bokjiro-local";
import { kstartupAdapter } from "../adapters/kstartup";
import { youthAdapter } from "../adapters/youth";
import type { NormalizedPolicy, SourceAdapter } from "../adapters/types";
import { indexPolicies } from "../search/meili";

const adapters: SourceAdapter[] = [gov24Adapter, bokjiroCentralAdapter, bokjiroLocalAdapter, kstartupAdapter, youthAdapter];

function canonicalKey(item: NormalizedPolicy) {
  return [item.title, item.agencyName, item.officialUrl ?? "", item.sourceSystem].join("::").toLowerCase();
}

function dedupe(items: NormalizedPolicy[]) {
  const map = new Map<string, NormalizedPolicy>();
  for (const item of items) {
    const key = canonicalKey(item);
    const previous = map.get(key);
    if (!previous) {
      map.set(key, { ...item, canonicalKey: key });
      continue;
    }
    const previousScore = Number(Boolean(previous.officialUrl)) + Number(Boolean(previous.applyEndAt)) + previous.eligibilitySummary.length / 1000;
    const nextScore = Number(Boolean(item.officialUrl)) + Number(Boolean(item.applyEndAt)) + item.eligibilitySummary.length / 1000;
    if (nextScore > previousScore) map.set(key, { ...item, canonicalKey: key });
  }
  return [...map.values()];
}

async function collectFromAdapter(adapter: SourceAdapter) {
  const list = await adapter.fetchList();
  const detailed = await Promise.all(list.map((raw) => adapter.fetchDetail(raw)));
  return detailed.map((raw) => adapter.normalize(raw));
}

async function upsert(items: NormalizedPolicy[]) {
  for (const item of items) {
    await prisma.policy.upsert({
      where: {
        sourceSystem_sourceExternalId: {
          sourceSystem: item.sourceSystem,
          sourceExternalId: item.sourceExternalId
        }
      },
      create: {
        ...item,
        applyStartAt: item.applyStartAt ? new Date(item.applyStartAt) : null,
        applyEndAt: item.applyEndAt ? new Date(item.applyEndAt) : null,
        lastCheckedAt: item.lastCheckedAt ? new Date(item.lastCheckedAt) : null,
        faqJson: { items: item.faq },
        rawJson: item.rawJson as any
      },
      update: {
        title: item.title,
        summary: item.summary,
        category: item.category,
        agencyName: item.agencyName,
        regions: item.regions,
        applyType: item.applyType,
        applyStatus: item.applyStatus,
        supportSummary: item.supportSummary,
        eligibilitySummary: item.eligibilitySummary,
        contentSummary: item.contentSummary,
        applyMethodSummary: item.applyMethodSummary,
        requiredDocs: item.requiredDocs,
        faqJson: { items: item.faq },
        rawJson: item.rawJson as any,
        lastSyncedAt: new Date()
      }
    });
  }
}

async function main() {
  const collected = (await Promise.all(adapters.map(collectFromAdapter))).flat();
  const merged = dedupe(collected);
  await upsert(merged);
  await indexPolicies(merged);
  console.log(`Synced ${merged.length} policies`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
