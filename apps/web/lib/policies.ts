import { samplePolicies, searchPolicies, getCanonicalCounts, getClosingSoonPolicies } from "@govfind/shared";
import type { SearchQuery } from "@govfind/shared";

export const revalidate = 3600;

export async function getPolicies(query: SearchQuery = {}) {
  return searchPolicies(samplePolicies, query);
}

export async function getPolicy(slug: string) {
  return samplePolicies.find((policy) => policy.slug === slug) ?? null;
}

export async function getCounts() {
  return getCanonicalCounts(samplePolicies);
}

export async function getClosingSoon() {
  return getClosingSoonPolicies(samplePolicies, new Date("2026-05-26"));
}
