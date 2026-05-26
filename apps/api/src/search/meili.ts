import { MeiliSearch } from "meilisearch";
import type { PolicyDetail } from "@govfind/shared";

export function createMeiliClient() {
  return new MeiliSearch({
    host: process.env.MEILISEARCH_HOST ?? "http://localhost:7700",
    apiKey: process.env.MEILISEARCH_API_KEY
  });
}

export async function indexPolicies(items: PolicyDetail[]) {
  const client = createMeiliClient();
  const index = client.index("policies");
  await index.updateFilterableAttributes(["category", "regions", "sourceSystem", "lifeStages", "applyStatus", "applyType"]);
  await index.updateSortableAttributes(["applyEndAt", "lastCheckedAt"]);
  await index.addDocuments(items, { primaryKey: "slug" });
}
