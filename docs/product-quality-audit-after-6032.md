# GovFind Product Quality Audit After 6,032 Policies

## Current Status

- currentPolicyCount: 6,032
- searchIndexCount: 6,032
- productionUrl: https://govfind.kr
- auditDate: 2026-05-29
- production deployment status: 6,032 policy version is live and production QA passed in step 71.1
- scope: audit and report only. No data, UI, DB, API, apply, or deploy changes were made.

## Git Status Summary

`git status` shows no tracked file changes. Two untracked documentation files remain:

- `docs/next-data-source-strategy-after-5224.md`
- `docs/next-source-after-national-subsidy-blocked.md`

`git diff --stat` is empty.

## Untracked Files Summary

Both untracked files are under `docs/`, so they are documentation candidates, not generated data or secrets.

Observations:

- `docs/next-source-after-national-subsidy-blocked.md` appears to be a valid strategy document about the national-subsidy blocked state.
- `docs/next-data-source-strategy-after-5224.md` appears to contain mojibake/encoding-corrupted Korean text. It should not be committed as-is.
- No `.env`, API key, `dist`, `node_modules`, or `data/staging` file appeared in the untracked list.

## Commit Recommendation For Untracked Files

- Do not delete either file in this cleanup-only step.
- Do not commit `docs/next-data-source-strategy-after-5224.md` until the encoding is fixed or the document is regenerated.
- `docs/next-source-after-national-subsidy-blocked.md` can be committed later if it is still useful, preferably together with a clean follow-up documentation commit.
- Keep `data/staging` reports ignored unless a later step explicitly asks to commit a stable report.

## Homepage Status

Status: good with minor follow-up.

The home page loads successfully and keeps the official-source positioning. The current data scale is represented through the production search index and source/category surfaces. The page is lightweight compared with listing pages and has title/meta/canonical present.

What works:

- Home page HTTP 200.
- Title/meta/canonical present.
- Official-source trust signal is visible.
- No `Invalid Date`, `NaN`, `undefined`, or visible `null` text found.

Follow-up:

- Consider making the 6,032 count more visibly tied to the search entry point after future UX work, especially if data continues to grow.

## Support List Status

Status: good.

`/support/` renders 30 initial cards, has pagination, tag UI, title/meta/canonical, and no invalid text artifacts. Search and tag URLs return successfully and preserve the list shell.

Checked search result counts from `search-index.json`:

- 창업: 2,669
- 사업화: 559
- 정책자금: 419
- 청년: 957
- 소상공인: 1,954

What works:

- 30-card initial rendering is preserved.
- Pagination is present.
- Search result pages return 200.
- Tag filter URLs for 창업, 사업화, 정책자금 return 200.
- No invalid date/NaN/undefined/null text artifacts found.

Follow-up:

- Because search/filter pages now rely on client-side filtering over `search-index.json`, no-result UI and filtered card content are not meaningfully represented in the raw HTML. This is acceptable for current performance goals, but it should be considered when adding crawler-oriented search pages later.

## Category Page Status

Status: good, with one slug alias issue.

Category counts from production `search-index.json`:

- 창업: 1,793
- 교육: 1,191
- 복지: 565
- 보건의료: 522
- 소상공인: 507
- 고용: 476
- 청년: 337
- 주거: 258
- 농림어업: 233
- 문화생활: 150

What works:

- `/category/startup/`: 30 cards, pagination, title/meta/canonical.
- `/category/small-business/`: 30 cards, pagination, title/meta/canonical.
- `/category/welfare/`: 30 cards, pagination, title/meta/canonical.
- `/category/job/`: 30 cards, pagination, title/meta/canonical for 고용.

Issue found:

- `/category/employment/` returns the home page shell instead of the 고용 category page. The actual category slug appears to be `/category/job/`. This is not a data corruption issue, but it is a routing/alias consistency issue because recent QA lists have repeatedly used `/category/employment/`.

## Detail Page Status

Status: good.

Checked examples:

- `/support/bokjiro-central-노인맞춤돌봄서비스/`
- `/support/gov24-아빠-육아휴직장려금-지원/`

What works:

- Detail pages return HTTP 200.
- Title/meta/canonical present.
- Official source/application signals are visible.
- Core summary/detail structure remains intact.
- No empty-block or invalid text artifact was found in sampled pages.

Follow-up:

- Some older static/Gov24 detail pages have fewer derived tags than newer K-Startup/Bizinfo pages. This is acceptable because tags are derived from available fields, but tag coverage can be improved later through helper logic, not source data edits.

## Search And Tag Status

Status: good.

Tag counts from production `search-index.json`:

- 창업: 2,669
- 사업화: 559
- 정책자금: 419

What works:

- Search URLs for 창업, 사업화, 정책자금, 청년, 소상공인 return 200.
- Tag filter URLs for 창업, 사업화, 정책자금 return 200.
- `page=2` query with search/tag returns 200.
- Search-index count remains 6,032.

Follow-up:

- Search ranking should now be monitored for K-Startup-heavy queries so that high-signal active programs do not get buried under expired or generic event/training entries.

## SEO Status

Status: good with one route follow-up.

What works:

- `search-index.json`: count 6,032 and item length 6,032.
- `sitemap-index.xml`: HTTP 200.
- `robots.txt`: HTTP 200.
- Home, support, category, and sampled detail pages have title/meta/canonical.
- No `Invalid Date`, `NaN`, `undefined`, or visible `null` text found in checked pages.

Follow-up:

- Add or redirect `/category/employment/` to `/category/job/`, or consistently use only `/category/job/` in future QA and documentation.

## Performance Status

Status: good.

Observed production HTML sizes:

- `/`: about 18 KB
- `/support/`: about 101 KB
- `/category/startup/`: about 95 KB
- `/category/small-business/`: about 97 KB
- `/category/welfare/`: about 90 KB
- sampled detail pages: about 15 KB

The earlier HTML-size optimization remains effective: support and category pages render 30 cards initially and rely on the search index for filtered views.

## Issue List

### Critical

None.

### High

None.

### Medium

1. `/category/employment/` does not render the 고용 category page and returns the home page shell. The canonical working route appears to be `/category/job/`.
2. `docs/next-data-source-strategy-after-5224.md` appears encoding-corrupted and should not be committed as-is.
3. Search/filter/no-result states are client-rendered after the HTML-size optimization, so raw HTML for query URLs does not reflect final filtered state without JavaScript.
4. K-Startup now dominates the 창업 category. Ranking and curation should be monitored so active, high-value startup support programs stay near the top.

### Low

1. Some older detail pages have limited derived tag display because source fields are sparse.
2. Homepage can make the 6,032 policy count and primary search path slightly more prominent in a future polish pass.
3. Status distribution includes many 마감 and 공식 공고 확인 items; this is expected with official-source safety guards, but active/open prioritization can be improved later.

## Top 5 To Fix Soon

1. Add an alias or redirect so `/category/employment/` reaches the 고용 category page, or update all internal QA/documentation references to `/category/job/`.
2. Regenerate or remove the mojibake-corrupted `docs/next-data-source-strategy-after-5224.md` before any documentation commit.
3. Add a lightweight automated production smoke test that checks expected category slugs, card count, pagination, and search-index count after each deploy.
4. Improve startup search ranking to prioritize current/active/high-signal K-Startup programs over expired, generic, or event-like entries.
5. Add a crawler/SEO note for client-rendered search/filter pages so the team is clear that query URLs are optimized for users, not fully server-rendered filtered HTML.

## Later Follow-Ups

- Review K-Startup category quality after several large batches.
- Add more nuanced tags for investment, mentoring, R&D, commercialization, and export.
- Improve active/open program prioritization.
- Add source-specific freshness metrics to update planning.
- Revisit national-subsidy only after API approval/authentication is confirmed.

## Data Expansion Recommendation

Recommendation: pause broad data expansion briefly and do a small quality pass first.

Reason:

- Production has already passed 6,000 policies.
- Core scale, pagination, tag filters, search, SEO, and performance are stable.
- The next gains are likely from trust and navigability: category route consistency, ranking quality, and documentation hygiene.

After the route/document cleanup and a small ranking review, data expansion can resume through the existing source planning flow.
