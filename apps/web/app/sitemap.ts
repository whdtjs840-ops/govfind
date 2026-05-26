import type { MetadataRoute } from "next";
import { samplePolicies } from "@govfind/shared";

export default function sitemap(): MetadataRoute.Sitemap {
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  return [
    "", "/support", "/deadline", "/online", "/compare", "/privacy", "/terms",
    ...samplePolicies.map((policy) => `/support/${policy.slug}`)
  ].map((path) => ({
    url: `${site}${path}`,
    lastModified: new Date("2026-05-26")
  }));
}
