# GovFind Operations Runbook

## Operating Baseline

- Public count is based on `dist/search-index.json`, not the internal source-of-truth policy count.
- Expired policies remain in source data for detail URL preservation, but must not appear in public lists, search, category pages, tag filters, or the public search index.
- Source API calls are never part of the default operational check. Discovery or fetch commands require explicit operator approval.
- Apply, commit, and production deploy require explicit operator approval and must be preceded by local QA.

## Pre-Deploy Gate

Run these commands before any production deploy:

```powershell
npm.cmd run legacy:build
npm.cmd run update:all
npm.cmd run update:plan
npm.cmd run qa:smoke
npm.cmd run ops:check
npm.cmd run validate:policies
npm.cmd test
```

The deploy is blocked if any command fails.

`legacy:build` must run before `update:all`, `update:plan`, `qa:smoke`, and `ops:check` because those commands validate the generated `dist/search-index.json`. A stale `dist/` folder is treated as an operational failure.

## `ops:check`

`npm.cmd run ops:check` is the single operational stability gate. It is cache-only and does not call external APIs.

It verifies:

- `dist/search-index.json` count equals `items.length`.
- Public search-index count equals public policy count after expired filtering.
- Search-index payload stays under the operating budget.
- Long detail-only fields are not reintroduced into the search-index payload.
- Critical public route artifacts exist.
- `/support/` and `/category/*` initial render remains 30 cards per page.
- Visible text does not include `Invalid Date`, `NaN`, `undefined`, or visible `null`.
- `update:all` and `update:plan` counts match the public search-index count.
- Real `.env` files are not tracked by git.
- Required operating scripts are present.

The command writes:

```text
data/staging/operations/operational-stability-100-report.json
```

`data/staging/` is intentionally ignored by git.

## Stop Conditions

Stop immediately and report if any of these occur:

- Public search-index count changes unexpectedly.
- `src/data/policies.ts` would need to be modified for an operations-only task.
- `qa:smoke`, `ops:check`, `validate:policies`, tests, or build fail.
- API quota, rate-limit, auth, or approval errors appear.
- A secret, API key, or `.env` value may be printed.
- `update:all` or `update:plan` reports count mismatch.
- A deploy would be made from an unintended dirty worktree.

## Production QA

After a manual Cloudflare Pages production deploy, verify:

- `https://govfind.kr/search-index.json`
- `https://govfind.kr/`
- `https://govfind.kr/support/`
- Search URLs for key queries such as `창업`, `청년`, `소상공인`, and `정책자금`
- Tag URLs such as `/support/?tag=창업`
- Category URLs such as `/category/startup/`, `/category/small-business/`, `/category/employment/`, and `/category/welfare/`
- Representative detail pages with official CTA links

The production QA report should include deployment URL, public search-index count, failed URLs, pagination status, tag/filter status, and final production QA decision.

## Current Completion Definition

Operational stability is considered 100% for the current static GovFind scope when:

- The pre-deploy gate above passes.
- `ops:check` reports `operational_stability_100_ready`.
- Public count is consistent across search-index, update reports, smoke QA, and visible UI copy.
- Expired items stay hidden from public discovery surfaces.
- No real secret files are tracked.
- Deploy and rollback decisions are documented and manual approval remains required.
