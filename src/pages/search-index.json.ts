import { policies } from "../data/policies";
import { dedupePolicies, isSearchOnlyPolicy } from "../utils/policyUtils";
import { sourceLabel } from "../utils/sourceNames";

export function GET() {
  const { canonical } = dedupePolicies(policies);
  const items = canonical
    .filter((policy) => !isSearchOnlyPolicy(policy))
    .map((policy) => ({
      id: policy.slug,
      title: policy.title,
      category: policy.category,
      region: policy.region,
      source: sourceLabel(policy.source),
      agency: policy.agency,
      status: policy.status,
      dday: policy.dday,
      updatedAt: policy.updatedAt,
      applyOnline: policy.applyOnline,
      officialUrl: policy.officialUrl,
      url: `/support/${policy.slug}/`,
      keywords: policy.tags,
      searchText: [
        policy.title,
        policy.category,
        policy.region,
        sourceLabel(policy.source),
        policy.agency,
        policy.targetGroup,
        policy.summary,
        policy.amount,
        policy.benefits.join(" "),
        policy.documents.join(" "),
        policy.tags.join(" ")
      ].join(" ")
    }));

  return new Response(
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        strategy: "build-time-collected-internal-index",
        count: items.length,
        items
      },
      null,
      2
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "public, max-age=300"
      }
    }
  );
}
