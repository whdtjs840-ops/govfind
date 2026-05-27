import { createHash } from "node:crypto";
import { prisma } from "../db";
import type { NormalizedPolicy, RawPolicy, SourceAdapter, SourceFetchOptions } from "../adapters/types";

export type SyncOptions = SourceFetchOptions & {
  dryRun?: boolean;
};

export type SyncSummary = {
  fetchedCount: number;
  insertedCount: number;
  updatedCount: number;
  skippedDuplicateCount: number;
  failedCount: number;
};

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
}

export function payloadHash(value: unknown): string {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

export function normalizeUrl(value?: string | null) {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return value.trim().replace(/\/$/, "").toLowerCase();
  }
}

export function canonicalKey(item: Pick<NormalizedPolicy, "title" | "agencyName" | "applyStartAt" | "applyEndAt">) {
  return [item.title, item.agencyName, item.applyStartAt ?? "", item.applyEndAt ?? ""]
    .join("::")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function sourceItemId(adapter: SourceAdapter, raw: RawPolicy, normalized?: NormalizedPolicy) {
  return normalized?.sourceExternalId || String(raw.serviceId ?? raw["서비스ID"] ?? raw.id ?? raw["서비스명"] ?? adapter.sourceName);
}

export async function collectFromAdapter(adapter: SourceAdapter, options: SyncOptions = {}) {
  const rawItems = await adapter.fetchList(options);
  const normalized: Array<{ raw: RawPolicy; detailed: RawPolicy; policy: NormalizedPolicy }> = [];
  let failedCount = 0;

  for (const raw of rawItems) {
    try {
      const detailed = await adapter.fetchDetail(raw);
      normalized.push({ raw, detailed, policy: adapter.normalize(detailed) });
    } catch (error) {
      failedCount += 1;
      console.error(`[sync:${adapter.sourceName}] failed item`, error);
    }
  }

  return { rawItems, normalized, failedCount };
}

function emptySummary(): SyncSummary {
  return {
    fetchedCount: 0,
    insertedCount: 0,
    updatedCount: 0,
    skippedDuplicateCount: 0,
    failedCount: 0
  };
}

export async function runSourceSync(adapter: SourceAdapter, options: SyncOptions = {}): Promise<SyncSummary> {
  const summary = emptySummary();
  const collected = await collectFromAdapter(adapter, options).catch((error) => {
    console.error(`[sync:${adapter.sourceName}] fetch failed`, error);
    return null;
  });
  if (!collected) {
    summary.failedCount = 1;
    return summary;
  }
  summary.fetchedCount = collected.rawItems.length;
  summary.failedCount = collected.failedCount;

  const batchKeys = new Set<string>();

  for (const item of collected.normalized) {
    const key = canonicalKey(item.policy);
    if (batchKeys.has(key)) {
      summary.skippedDuplicateCount += 1;
      continue;
    }
    batchKeys.add(key);

    if (options.dryRun) continue;

    const sourceId = sourceItemId(adapter, item.raw, item.policy);
    const hash = payloadHash(item.detailed);
    const sourceUrl = normalizeUrl(item.policy.sourceUrl);
    const officialUrl = normalizeUrl(item.policy.officialUrl);
    const existingBySource = await prisma.policy.findUnique({
      where: {
        sourceSystem_sourceExternalId: {
          sourceSystem: item.policy.sourceSystem,
          sourceExternalId: item.policy.sourceExternalId
        }
      }
    });

    const duplicate =
      existingBySource ??
      (await prisma.policy.findFirst({
        where: {
          OR: [
            ...(sourceUrl ? [{ sourceUrl: item.policy.sourceUrl }] : []),
            ...(officialUrl ? [{ officialUrl: item.policy.officialUrl }] : []),
            { canonicalKey: key }
          ]
        }
      }));

    if (duplicate && !existingBySource) {
      summary.skippedDuplicateCount += 1;
      await prisma.sourceRawItem.upsert({
        where: { sourceName_sourceItemId: { sourceName: adapter.sourceName, sourceItemId: sourceId } },
        create: {
          sourceName: adapter.sourceName,
          sourceItemId: sourceId,
          payload: item.detailed as any,
          payloadHash: hash,
          fetchedAt: new Date(),
          policyId: duplicate.id
        },
        update: {
          payload: item.detailed as any,
          payloadHash: hash,
          fetchedAt: new Date(),
          policyId: duplicate.id
        }
      });
      continue;
    }

    const saved = await prisma.policy.upsert({
      where: {
        sourceSystem_sourceExternalId: {
          sourceSystem: item.policy.sourceSystem,
          sourceExternalId: item.policy.sourceExternalId
        }
      },
      create: {
        ...item.policy,
        applyStartAt: item.policy.applyStartAt ? new Date(item.policy.applyStartAt) : null,
        applyEndAt: item.policy.applyEndAt ? new Date(item.policy.applyEndAt) : null,
        lastCheckedAt: item.policy.lastCheckedAt ? new Date(item.policy.lastCheckedAt) : null,
        faqJson: { items: item.policy.faq },
        rawJson: item.policy.rawJson as any,
        canonicalKey: key
      },
      update: {
        title: item.policy.title,
        summary: item.policy.summary,
        category: item.policy.category,
        agencyName: item.policy.agencyName,
        sourceUrl: item.policy.sourceUrl,
        officialUrl: item.policy.officialUrl,
        lifeStages: item.policy.lifeStages,
        targetGroups: item.policy.targetGroups,
        regionScope: item.policy.regionScope,
        regions: item.policy.regions,
        applyType: item.policy.applyType,
        applyStatus: item.policy.applyStatus,
        applyStartAt: item.policy.applyStartAt ? new Date(item.policy.applyStartAt) : null,
        applyEndAt: item.policy.applyEndAt ? new Date(item.policy.applyEndAt) : null,
        supportSummary: item.policy.supportSummary,
        eligibilitySummary: item.policy.eligibilitySummary,
        contentSummary: item.policy.contentSummary,
        applyMethodSummary: item.policy.applyMethodSummary,
        requiredDocs: item.policy.requiredDocs,
        faqJson: { items: item.policy.faq },
        rawJson: item.policy.rawJson as any,
        canonicalKey: key,
        lastCheckedAt: item.policy.lastCheckedAt ? new Date(item.policy.lastCheckedAt) : null,
        lastSyncedAt: new Date()
      }
    });

    if (existingBySource) summary.updatedCount += 1;
    else summary.insertedCount += 1;

    await prisma.sourceRawItem.upsert({
      where: { sourceName_sourceItemId: { sourceName: adapter.sourceName, sourceItemId: sourceId } },
      create: {
        sourceName: adapter.sourceName,
        sourceItemId: sourceId,
        payload: item.detailed as any,
        payloadHash: hash,
        fetchedAt: new Date(),
        policyId: saved.id
      },
      update: {
        payload: item.detailed as any,
        payloadHash: hash,
        fetchedAt: new Date(),
        policyId: saved.id
      }
    });
  }

  return summary;
}

export function printSummary(summary: SyncSummary) {
  console.log(`fetched count: ${summary.fetchedCount}`);
  console.log(`inserted count: ${summary.insertedCount}`);
  console.log(`updated count: ${summary.updatedCount}`);
  console.log(`skipped duplicate count: ${summary.skippedDuplicateCount}`);
  console.log(`failed count: ${summary.failedCount}`);
}
