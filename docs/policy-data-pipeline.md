# GovFind Policy Data Pipeline

This document is the source-of-truth guide for the current static policy data pipeline.

## Current Source Of Truth

The public Astro site currently reads policy data from static TypeScript files, not from Prisma or the API server.

Human-maintained source-of-truth file:

- `src/data/policies.ts`

This file owns:

- the public `Policy` type used by the Astro site
- manually curated policy records
- category, region, source, and keyword constants
- imports and merging of generated policy files

## Generated Files

Do not edit these files manually:

- `src/data/welfare-api.generated.ts`
- `src/data/local-welfare-api.generated.ts`
- `src/data/public-service-api.generated.ts`
- `src/data/kstartup-api.generated.ts`
- `src/data/youth-api.generated.ts`

These files are generated artifacts. They may be overwritten by sync scripts.

## Generation Scripts

Generated files are produced by:

- `scripts/sync-welfare-api.mjs`
- `scripts/sync-local-welfare-api.mjs`
- `scripts/sync-public-service-api.mjs`
- `scripts/sync-kstartup-api.mjs`
- `scripts/sync-youth-api.mjs`

The combined refresh command is:

```bash
npm run legacy:prebuild
```

Run it only when intentionally refreshing generated static data from configured source API keys.

## Public Policy Count Basis

All public counts must use the same data basis:

```text
policies
  -> dedupePolicies()
  -> remove isSearchOnlyPolicy()
  -> public policies
```

Current public count: `212`.

The homepage, `/support/`, category pages, and `/search-index.json` must all use this same public dataset.

## Search Index

`/search-index.json` is generated at build time by:

- `src/pages/search-index.json.ts`

It imports `policies` from `src/data/policies.ts`, then uses `getPublicPolicies(policies)` so its count matches the visible public policy dataset.

The search index does not write back to policy files. It is a build output only.

## Static Support Filters

`/support/` stays static. It does not use SSR and does not generate query-specific pages.

The page reads `URLSearchParams` in the browser and filters the already-rendered static dataset.

Supported filters:

- `q`: tokenized partial match
- `category`: exact category match
- `source`: exact public source label match
- `status`: exact display status match, including deadline-soon alias handling
- `region`: selected region plus nationwide policies
- `online=true`: online-application policies only

The visible result count must always be based on the filtered item count.

## Validation

Run policy validation with:

```bash
npm run validate:policies
```

The validator checks:

- missing slug
- duplicate slug
- duplicate id if a future static model adds `id`
- missing title, category, source, agency, deadline, status, and official URLs
- invalid category
- invalid status
- suspicious `documents` values that look like phone numbers
- category count mismatch
- `/search-index.json` count mismatch

The current static `Policy` model does not have an `id` field. Until a later data-model migration, `slug` is the stable key.

## Future External API Flow

External API data must not be written directly into the public policy dataset.

Recommended future flow:

```text
external API
  -> dry-run importer
  -> raw payload artifact
  -> normalized staging artifact
  -> staging validation
  -> duplicate candidate review
  -> manual approval or controlled generator
  -> generated policy file
  -> src/data/policies.ts merge
  -> getPublicPolicies()
  -> public pages and search-index
```

Current Gov24 dry-run staging artifacts are written under:

- `data/imports/gov24/raw/`
- `data/imports/gov24/staging/`
- `data/imports/gov24/reports/`

`data/imports/` is ignored by git.

Gov24 staging is a review layer before public dataset generation. It can be rebuilt from saved raw artifacts with:

```bash
npm run normalize:staging:gov24
```

It can be checked structurally with:

```bash
npm run validate:staging:gov24
```

These commands do not write to the public policy dataset, generated policy files, Prisma, or the UI.

Gov24 staging reports must satisfy this invariant before any later promotion work:

```text
normalizedCount = readyCount + publishableWithWarningCount + incompleteCount + needsReviewCount + duplicateCount
```

`publishable_with_warning` is a staging-only candidate state. It means the item has the required identity/content fields and is not a strong duplicate, but date/status/region/application fields must be displayed conservatively as official-confirmation-needed. It must stay separate from `ready`.

`duplicateCandidatesCount` is evidence count. `duplicateCount` is the number of staging items blocked from promotion because they strongly match the current public dataset or another staging item.

For wider Gov24 discovery without promotion, run:

```bash
npm run discover:gov24 -- --limit=100 --max-pages=3
```

The discovery report is written to `data/staging/gov24/discovery-report.json`, which is ignored by git and must be reviewed before any later generated-data promotion step.

Gov24 discovery is quota-safe:

- success reports are saved to `data/staging/gov24/discovery-report.json`
- API, quota, rate-limit, and service-key failures are saved separately under `data/staging/gov24/errors/`
- failures must not overwrite the latest success report
- page cache lives under `data/staging/gov24/cache/`
- explicit sampling is supported with `--pages=1,10,30`
- API keys must appear only as `[REDACTED]` in logs and reports

## Do Not Do In This Static Pipeline

Do not:

- edit generated files by hand
- write imported API data directly to public policy records
- migrate the Astro frontend to Prisma without a separate migration plan
- change Prisma schema to fix static policy validation
- connect multiple external APIs in one step
- redesign UI as part of data pipeline work
