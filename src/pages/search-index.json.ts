import { policies } from "../data/policies";
import { getDisplayRegion, getDisplayStatus, getPublicPolicies } from "../utils/policyUtils";
import { sourceLabel } from "../utils/sourceNames";

export function GET() {
  const items = getPublicPolicies(policies)
    .map((policy) => ({
      id: policy.slug,
      title: policy.title,
      category: policy.category,
      region: getDisplayRegion(policy),
      source: sourceLabel(policy.source),
      agency: policy.agency,
      status: getDisplayStatus(policy),
      dday: policy.dday,
      updatedAt: policy.updatedAt,
      applyOnline: policy.applyOnline,
      officialUrl: policy.officialUrl,
      url: `/support/${policy.slug}/`,
      keywords: policy.tags,
      searchText: [
        policy.title,
        policy.category,
        getDisplayRegion(policy),
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
