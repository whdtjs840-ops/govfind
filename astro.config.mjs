import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const sitemapExcludedSupportSlugs = new Set(["gov24-근로-자녀장려금"]);

function supportSlugFromSitemapUrl(page) {
  try {
    const { pathname } = new URL(page);
    const match = pathname.match(/^\/support\/(.+)\/$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export default defineConfig({
  site: "https://govfind.kr",
  integrations: [
    sitemap({
      filter(page) {
        const supportSlug = supportSlugFromSitemapUrl(page);
        return !supportSlug || !sitemapExcludedSupportSlugs.has(supportSlug);
      }
    })
  ],
  output: "static"
});
