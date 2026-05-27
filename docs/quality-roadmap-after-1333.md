# GovFind Quality Roadmap After 1,333 Policies

## Current Status

- Production version: 1,333 public search-index items
- Source mix in public search index:
  - 정부24: 1,003
  - 복지로: 269
  - 온통청년: 30
  - K-Startup: 12
  - 기타 공식 출처: 19
- Category count:
  - 보건의료 268, 복지 261, 농림어업 192, 청년 159, 교육 154, 주거 151, 고용 44, 문화생활 40, 소상공인 36, 창업 28
- Status count:
  - 상시 686, 공식 공고 확인 344, 모집중 224, 마감 66, 예정 8, 마감임박 5
- Static build:
  - HTML pages: 1,387
  - Support detail HTML pages: 1,341
  - Public search-index items: 1,333
  - Sitemap URLs: 1,387
- Technical QA:
  - Invalid Date: not found in sampled pages and full detail HTML scan
  - NaN: not found in sampled pages and full detail HTML scan
  - Visible undefined/null string: not found in sampled rendered pages
  - Missing detail title/meta description/canonical: 0
  - Thin detail pages by static text length threshold: 0

## UX Audit

### What Works

- The home page communicates the purpose clearly: users can search official support policies without login.
- The home page search box is prominent, and popular keyword chips help users start quickly.
- Category navigation is visible on the home and support pages, with clear count signals.
- The support list exposes useful filter dimensions: category, region, source, status, life stage, and online application.
- Policy cards expose category, source, target, region, status, deadline, agency, and official-link actions.
- Detail pages have a predictable structure: summary, target, benefit, application method, documents, FAQ, official check, and related policies.

### UX Issues

- The `/support/` page renders a very large result set in one page. At 1,333 items, the page is useful but heavy, and scanning can feel dense.
- The filter and quick-finder area takes significant vertical space before the result list, especially for returning users who already know what they want.
- The phrase "공식 공고 확인" appears very often on pages with uncertain dates/status. It is safe, but repeated many times it can feel anxious rather than reassuring.
- Home page category navigation includes zero-count links such as 기타 0건 and 채용 0건. These can look unfinished.
- Category pages are useful for browsing, but they do not expose the same search box as `/support/`, so users may need to jump back to refine.

## Detail Page Audit

### What Works

- Detail pages clearly show title, category, agency, region, status, official link, and last verified date.
- The official source card and official confirmation block support trust.
- Date-unknown policies do not show D-day in sampled Bokjiro pages.
- Unknown-status Bokjiro pages are displayed as "공식 공고 확인" rather than "모집중".
- There are no missing title/meta/canonical tags across detail HTML pages.

### Detail Page Issues

- Many Bokjiro and Gov24 pages repeat the same safety phrase across hero, quick facts, summary, source card, official original summary, FAQ, and official confirmation sections.
- Some descriptions still feel like raw agency/API prose, especially service, counseling, education, or medical support programs.
- Summary, support content, and official original summary can repeat substantially on Bokjiro pages.
- "신청기간 공식 공고 확인 · 공식 공고 확인" appears redundant on warning pages.
- Some pages are technically complete but may not answer the user's first practical question quickly enough: "Can I apply, where, and what should I check first?"

## Search And Filter Audit

### What Works

- `/support/?q=청년` returns results and does not show a false "검색 결과 없음" state.
- The data-level status counts are coherent:
  - 모집중 224
  - 마감임박 5
  - 공식 공고 확인 344
- Unknown-status and unknown-date items are not counted as 마감임박 in the public search index.
- Category counts in the UI match the built search index.

### Search And Filter Issues

- Search result pages use the same title, meta description, and canonical as `/support/`. This is safe for duplicate SEO, but weak for shareability and search-specific landing quality.
- The search result heading remains generic even when a query is active.
- The support page is doing a lot: landing content, quick finder, filters, category navigation, and all results. At 1,333 items this is approaching a performance and cognitive-load boundary.
- Source and status counts are useful, but "공식 공고 확인" cards can dominate certain browses and make result quality feel less decisive.

## SEO Audit

### What Works

- Home, support, category, and detail pages have title, meta description, and canonical tags.
- Detail page titles are policy-name based.
- Detail page meta descriptions are generated from policy summaries.
- `robots.txt` points to the sitemap index:
  - `Sitemap: https://govfind.kr/sitemap-index.xml`
- `sitemap-index.xml` and `sitemap-0.xml` exist in the static build.
- Sitemap includes newly generated support detail URLs.

### SEO Issues

- There is no `/sitemap.xml` alias in the build. This is not a blocker because robots points to `/sitemap-index.xml`, but `/sitemap.xml` is a common crawler expectation.
- Sitemap includes 8 support detail URLs that are not present in the public search index after dedupe/search-only filtering:
  - `/support/earned-income-tax-credit-application/`
  - `/support/gov24-근로-자녀장려금/`
  - `/support/health-insurance-out-of-pocket-refund/`
  - `/support/health-insurance-overpayment-refund/`
  - `/support/local-youth-rent-support/`
  - `/support/small-business-direct-loan/`
  - `/support/small-business-emergency-fund/`
  - `/support/youth-rent-eligibility-check/`
- Duplicate meta descriptions exist in several groups. Examples include disaster compensation, insurance, medical benefit, and repeated subsidy templates.
- Search result pages are canonicalized to `/support/`, so query pages are not differentiated for SEO or social sharing.
- Some non-cash services, counseling, education, and administrative programs are indexed with the same "지원금" framing, which may reduce query intent match.

## Content Quality Audit

### What Works

- Recent summary polish work improved obvious short/API-like summaries in recent Gov24 and Bokjiro batches.
- Most pages have enough body content and are not thin by text length.
- Official source links are present and prominent.
- Unknown data is represented conservatively rather than guessed.

### Content Risks

- 946 detail pages contain "공식 공고 확인" 14 or more times. This is safe but repetitive.
- Some summaries and meta descriptions are duplicated across similar policies.
- Some categories contain services, counseling, education, or facility-use items that users may not think of as "지원금".
- A few category mappings may be technically defensible but semantically soft, such as transport/service items in 보건의료 or broad counseling items in 복지.
- Search text often repeats title/category/summary/support content, which helps recall but can create noisy relevance.

## Issues By Priority

### Critical

- None found.

### High

1. `/support/` renders the full 1,333-item catalog on one page, creating a performance and scanning risk as data grows.
2. "공식 공고 확인" is repeated heavily across 946 detail pages, which can make safe uncertainty feel like low confidence.
3. Sitemap contains 8 support detail URLs excluded from the public search index, creating a possible canonical/dedupe crawl mismatch.

### Medium

1. Search result pages have generic title/meta/H1/canonical and do not reflect the active query.
2. `/sitemap.xml` is absent; only `/sitemap-index.xml` exists.
3. Duplicate meta descriptions exist across several policy groups.
4. Some detail pages repeat summary/support/original-source content too closely.
5. Home page shows zero-count category/search links such as 기타 0건 and 채용 0건.
6. Category pages lack an in-page search field and depend on navigation back to `/support/` for refinement.
7. Support page mixes onboarding, quick finder, filters, and all results, making repeated use heavier than necessary.
8. Some non-funding services are framed similarly to direct benefits, which can weaken user expectation match.

### Low

1. Category icons and labels are helpful but can feel busy in dense areas.
2. "공식 신청처" wording is used even when the action is closer to "공식 안내 확인".
3. Local dev server did not serve generated sitemap index in the same way as static build; static build itself is fine.
4. Some long official titles are readable but visually heavy in cards.

## Top 10 Priorities

1. Add pagination, virtualization, or "load more" to `/support/` before adding significantly more policies.
2. Reduce repeated "공식 공고 확인" instances into one or two clear trust blocks per page.
3. Exclude deduped/search-only detail pages from sitemap or add canonical/noindex handling for them.
4. Make active search pages visibly query-aware: heading, result summary, and page title at minimum.
5. Add a `/sitemap.xml` alias or redirect to `/sitemap-index.xml`.
6. Improve duplicate meta descriptions with source/category/title-aware templates.
7. Add search/refine controls to category pages.
8. Hide zero-count category links from primary navigation surfaces.
9. Create a content taxonomy for non-cash service, counseling, education, and facility-use items.
10. Add a recurring quality report that tracks repeated official-confirmation count, duplicate meta descriptions, and sitemap/search-index mismatch.

## First Five Fixes

1. Implement result pagination or load-more on `/support/`.
2. Refactor warning/official-confirmation rendering to avoid repeated identical phrases.
3. Align sitemap generation with public search-index/dedupe output.
4. Add query-aware UI copy and metadata for `/support/?q=...`, while keeping canonical rules intentional.
5. Hide zero-count categories and topic shortcuts from high-visibility navigation.

## Quick Wins

1. Add `/sitemap.xml` as an alias for `/sitemap-index.xml`.
2. Change duplicate "공식 공고 확인 · 공식 공고 확인" to one label.
3. Rename some official-link labels from "공식 신청처" to "공식 안내 확인" when applyOnline is false or status is unknown.
4. Hide 기타 0건 and 채용 0건 on the home page.
5. Add a small "현재 검색어: ..." line and result count to search result pages.

## Before More Data Expansion

Data expansion should pause briefly for quality work. The current 1,333-policy scale is enough to expose UX and SEO bottlenecks. Before adding another large batch, prioritize:

1. `/support/` performance and pagination.
2. Official-confirmation copy consolidation.
3. Sitemap/search-index alignment.
4. Query-aware search UX.
5. Duplicate meta description reduction.

Small targeted data updates are still safe, but another large batch should wait until the high-priority UX/SEO items are handled.

## Later Work

- Build source-specific content quality dashboards.
- Add richer category landing pages for high-volume categories such as 보건의료, 복지, 농림어업, 청년.
- Add intent labels such as 현금지원, 바우처, 대출, 상담, 교육, 서비스.
- Add structured data after canonical and duplicate page rules are settled.
- Add automated Lighthouse/HTML-size checks to the release QA flow.

## Next Recommended Step

Run a focused UX/SEO cleanup sprint before the next data expansion:

1. `support-list-pagination`
2. `official-confirmation-copy-cleanup`
3. `sitemap-dedupe-alignment`
4. `search-query-page-ux`
5. `zero-count-link-cleanup`

After those are complete, resume update checks and source discovery.
