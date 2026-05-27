# GovFind Data Ingestion

This document covers external source import work before data is allowed into the public GovFind policy dataset.

## First Source

First dry-run source:

- source name: `gov24-public-service-benefits`
- public source: Korean Ministry of the Interior and Safety public service benefits API
- GovFind command: `npm run import:gov24:dry-run`

The importer is dry-run only. It does not publish data.

## API Key

Create an API key for the Gov24 public service benefits API on the public data portal.

Set it locally:

```powershell
$env:GOVFIND_GOV24_API_KEY="..."
```

The script also reads `.env` when present.

The API key must not be committed and must not be hardcoded.

## Environment Variables

```bash
GOVFIND_GOV24_API_KEY=""
GOVFIND_GOV24_PAGE="1"
GOVFIND_GOV24_PER_PAGE="5"
```

Keep the page size small while this source is in review.

## Commands

Run without writing artifacts:

```bash
npm run import:gov24:dry-run -- --page=1 --limit=5
```

Run and save review artifacts:

```bash
npm run import:gov24:dry-run -- --page=1 --limit=5 --save
```

Use a custom output directory:

```bash
npm run import:gov24:dry-run -- --page=1 --limit=5 --save --out-dir=data/imports/gov24
```

Test missing-key behavior without reading `.env`:

```bash
npm run import:gov24:dry-run -- --page=1 --limit=1 --no-env-file
```

Rebuild staging files from the latest saved raw artifact without calling the API:

```bash
npm run normalize:staging:gov24
```

Validate the latest saved staging artifact without writing to public policy data:

```bash
npm run validate:staging:gov24
```

Use explicit input files when reviewing an older run:

```bash
npm run normalize:staging:gov24 -- --raw=data/imports/gov24/raw/gov24-public-service-benefits-YYYYMMDD-HHmmss.raw.json
npm run validate:staging:gov24 -- --staging=data/imports/gov24/staging/gov24-public-service-benefits-YYYYMMDD-HHmmss.staging.json
```

Discover a wider Gov24 batch without promoting data:

```bash
npm run discover:gov24 -- --limit=100 --max-pages=3
```

Use explicit page sampling after the API quota resets:

```bash
npm run discover:gov24 -- --limit=100 --pages=1 --save
npm run discover:gov24 -- --limit=100 --pages=10 --save
npm run discover:gov24 -- --limit=100 --pages=30,60,90 --save --resume
```

Windows examples:

```powershell
npm.cmd run discover:gov24 -- --limit=100 --pages=1 --save
npm.cmd run discover:gov24 -- --limit=100 --pages=10 --save
npm.cmd run discover:gov24 -- --limit=100 --pages=30,60,90 --save --resume
```

Discovery supports:

- `--pages=1,10,30`
- `--start-page=1`
- `--max-pages=3`
- `--limit=100`
- `--resume`
- `--no-cache`

Page cache is enabled by default. Cached pages are stored under:

```text
data/staging/gov24/cache/
```

The same page/limit combination is read from cache instead of calling the API again. Use `--no-cache` only when a fresh API call is intentional.

Discovery defaults are intentionally small:

- `limit=100`
- `max-pages=3`
- maximum first-pass review size: 300 list items

The command writes a review-only report to:

```text
data/staging/gov24/discovery-report.json
```

Successful discovery reports keep:

- `status: "success"`
- `pagesRequested`
- `pagesFetched`
- `lastSuccessfulPage`
- `totalAvailable`
- `rawCount`
- `normalizedCount`
- `readyCount`
- `incompleteCount`
- `needsReviewCount`
- `duplicateCount`
- `duplicateCandidatesCount`
- `uniqueNewCandidateCount`
- `invariantPassed`

If Gov24 returns quota, rate-limit, service-key, or API error responses, the command fails and does not overwrite the latest success report. Error reports are written separately:

```text
data/staging/gov24/errors/gov24-discovery-error-YYYYMMDD-HHmmss.json
```

Error reports include:

- `status: "error"` or `status: "partial"`
- `errorCode`
- `errorMessage`
- `failedAtPage`
- `pagesRequested`
- `pagesFetched`
- `lastSuccessfulPage`
- `totalAvailable`

API keys are always redacted as `[REDACTED]` in logs and reports.

`data/staging/` is ignored by git.

## Saved Artifact Paths

When `--save` is passed, files are written under:

- raw payload: `data/imports/gov24/raw/`
- normalized staging: `data/imports/gov24/staging/`
- report: `data/imports/gov24/reports/`

Filename pattern:

- `gov24-public-service-benefits-YYYYMMDD-HHmmss.raw.json`
- `gov24-public-service-benefits-YYYYMMDD-HHmmss.staging.json`
- `gov24-public-service-benefits-YYYYMMDD-HHmmss.report.json`

`data/imports/` is ignored by git.

## What Dry-Run Does

- fetches one small Gov24 page
- fetches item detail payloads when possible
- normalizes source data into GovFind staging fields
- validates each staging item
- marks each item as `ready`, `publishable_with_warning`, `incomplete`, `needsReview`, or `duplicate`
- reports missing required fields, duplicate candidates, mapping gaps, and a sample normalized item
- writes files only when `--save` is passed

## What Dry-Run Does Not Do

- does not modify the current 212 public policies
- does not edit generated policy files
- does not write to Prisma or any database
- does not change UI
- does not deploy or publish imported data

## Staging Validation Status

- `ready`: required fields are present, a public URL is present, summary or description is present, no strong duplicate candidate is found, and no review warning is present.
- `publishable_with_warning`: required fields are present and the item is not a strong duplicate, but the public page must avoid overclaiming uncertain date/status/region/application details.
- `incomplete`: one or more required fields are missing.
- `needsReview`: required fields exist, but category mapping is uncertain, the item maps to `기타`, or another non-publishable mapping issue remains.
- `duplicate`: the item has a strong match against the current static dataset or another Gov24 staging item.

Every normalized item must be in exactly one bucket:

```text
normalizedCount = readyCount + publishableWithWarningCount + incompleteCount + needsReviewCount + duplicateCount
```

The report prints `classifiedTotal` and `invariantPassed`. If `invariantPassed` is `false`, do not promote the staging output.

`publishableTotalCount` is `readyCount + publishableWithWarningCount`. It is only a candidate count; it is not an instruction to write production data.

Required fields:

- `title`
- `slug`
- `category`
- `sourceName`
- `sourceItemId`
- `organizationName`
- `officialUrl` or `applicationUrl`
- `summary` or `description`

## Gov24 Normalization Rules

Gov24 staging uses GovFind internal categories only:

- `청년`
- `복지`
- `주거`
- `고용`
- `창업`
- `소상공인`
- `교육`
- `보건의료`
- `문화생활`
- `농림어업`
- `기타`

Gov24 staging uses GovFind internal regions only:

- `전국`
- `서울`
- `경기`
- `부산`
- `인천`
- `대구`
- `광주`
- `대전`
- `울산`
- `세종`
- `강원`
- `충북`
- `충남`
- `전북`
- `전남`
- `경북`
- `경남`
- `제주`

If a source item does not clearly identify a region, staging does not assume `전국`. The item is marked for manual review with a region mapping gap.

Gov24 staging status values are normalized to:

- `모집중`
- `마감임박`
- `상시`
- `마감`
- `확인필요`

If a deadline is missing and the source does not clearly say the application is always open, status becomes `확인필요`.

Duplicate candidate checks:

- `sourceName + sourceItemId`
- `officialUrl`
- normalized `title + organizationName`
- `title + startDate + endDate`
- high title similarity with the same organization name

`duplicateCandidatesCount` is evidence count, not the publish bucket count. Use `duplicateCount` to see how many items are blocked by strong duplicate matches.

Mapping gaps tracked:

- `description`
- `category`
- `region`
- `targetGroups`
- `status`
- `startDate`
- `endDate`
- `applicationMethod`
- `applicationUrl`
- `sourceUpdatedAt`

The report also includes:

- adapter name
- endpoint name
- request params with API key redacted
- response item array path
- pages fetched
- total available count when the API provides it
- raw count
- normalized count
- ready count
- incomplete count
- needsReview count
- duplicate count
- duplicateCandidates count
- unique new candidate count
- missing title count
- missing organization count
- missing officialUrl/applicationUrl count
- unknown category count
- unknown region count
- `확인필요` status count
- sample ready items
- sample incomplete items
- sample duplicate candidates

## Before Public Import

Before any Gov24 item can be turned into a public policy record:

- confirm `invariantPassed` is `true`
- confirm `readyCount` is greater than 0 for the batch you intend to review
- review all `duplicate` items and decide whether to skip or merge them
- review all `needsReview` items, especially `기타`, unknown region, and `확인필요`
- confirm official URLs and application URLs open correctly
- confirm no staging file writes directly into `src/data/*.generated.ts`
- run `npm run validate:policies` after any later approved generated-data change

If `readyCount` is `0`, check these report fields first:

- `duplicateCount`: the batch may already exist in the 212 public policies
- `incompleteCount`: required fields may be missing
- `needsReviewCount`: mapping may be uncertain
- `unknownRegionCount`: region may need manual confirmation
- `missingOfficialOrApplicationUrlCount`: a public URL may be missing

If `rawCount` stays at `5` even with `--limit=100 --max-pages=3`, check:

- whether the importer is passing `limit` as `perPage`
- whether the response item array path is still `data`
- whether the API returned an error object instead of normal items
- whether the API key or endpoint is restricted
- whether the selected endpoint only returns five items for that request shape

If `rawCount` is `0` and the report status is `error`, do not treat it as an empty successful discovery. Check `errorKind`, `errorMessage`, and `failedAtPage` first.

## Needs Review Analysis

Gov24 discovery batches can be analyzed without calling the API by using saved reports and cache files only.

The aggregate analysis artifact is:

```text
data/staging/gov24/needs-review-analysis.json
```

The analysis separates reasons into two groups:

- `blocking`: missing required identity/content fields, missing both official and application URLs, invalid URLs, or strong duplicate evidence.
- `warning`: uncertain but still reviewable fields such as missing date range, `확인필요` status, unknown region, category mapped to `기타`, or uncertain application method.

Blocking reasons should prevent promotion.

Warning reasons may allow a later `publishable_with_warning` state, but only if the public UI does not overstate the data.

Recommended handling:

- Unknown region: keep `region: null`; show `지역: 공식 공고 확인`; do not include in region landing pages or region filters.
- Uncertain status: do not coerce to `모집중`; show `상태: 공식 공고 확인`; do not include in `모집중` or `마감임박` filters.
- Missing date range: show `신청기간: 공식 공고 확인`; do not use for deadline sorting.
- Category mapped to `기타`: keep out of category landing pages until manually mapped.
- Application URL ambiguity: if `officialUrl` exists, keep official detail URL as the safe destination and mark the application method for review.

Before promoting any Gov24 item from staging:

- required fields must be present
- strong duplicate candidates must be resolved
- every warning must have a safe public display rule
- `ready` and `publishable_with_warning` must remain separate states
- generated production files must be updated only through an approved generator step

## Publishable With Warning Policy

Gov24 staging now separates clean items from safe-but-uncertain items:

- `ready`: publishable candidate with confident category/status/date handling.
- `publishable_with_warning`: publishable candidate only if the public UI shows conservative labels and excludes the item from filters that would overstate certainty.
- `needsReview`: not publishable until a human resolves category or other blocking mapping issues.

Allowed warning-only reasons for `publishable_with_warning`:

- `ambiguous startDate`
- `ambiguous endDate`
- `ambiguous date range`
- `status requires official confirmation`
- `ambiguous status`
- `unknown region`
- `targetGroups uncertain`
- `applicationUrl ambiguity but officialUrl exists`

Reasons that must remain `needsReview`:

- unknown source category
- category mapped to `기타`
- category mapping gap
- missing official URL and missing application URL
- missing title
- missing organization name
- missing summary and missing description
- strong duplicate candidate

Date handling:

- Keep `startDate: null` and `endDate: null` when the source date is unclear.
- Set `applicationPeriodLabel` or `deadlineText` to `공식 공고 확인`.
- Set `dateConfidence: "unknown"`.
- Do not show D-day.
- Do not include the item in deadline sorting or deadline-soon filters.

Status handling:

- Do not coerce uncertain status to `모집중`.
- Set `status: "확인필요"`, `statusLabel: "공식 공고 확인"`, and `statusConfidence: "unknown"`.
- Keep the item available for all-list/search review, but exclude it from `모집중` and `마감임박` filters.

Category handling:

- Items mapped to `기타` or unknown source category stay in `needsReview`.
- This protects category pages and SEO landing pages from wrong-topic imports.
- These items go into `manualCategoryMappingQueue` for source-category mapping review.

Publish policy fields:

- `ready` and `publishable_with_warning`: `canPublish`, `includeInSearch`, and `includeInAllList` may be true.
- `publishable_with_warning`: `requiresOfficialConfirmation` is true.
- Unknown region: `includeInRegionPage` is false.
- Unknown status: `includeInStatusFilters` is false.
- Unknown date: `includeInDeadlineSort` and `showDday` are false.
- `needsReview`, `duplicate`, and `incomplete`: `canPublish` is false.

Before promotion, review:

- `publishableTotalCount`
- `manualCategoryMappingQueue`
- sample `publishable_with_warning` items
- duplicate mappings
- public display copy for `공식 공고 확인`
- the invariant:

```text
normalizedCount = readyCount + publishableWithWarningCount + needsReviewCount + incompleteCount + duplicateCount
```

## Promotion Dry-Run

Promotion dry-run is the only allowed next step before any generated-data apply. It selects a small review batch and writes a preview report only.

Run:

```powershell
npm.cmd run promote:gov24:dry-run -- --limit=50
```

Output:

```text
data/staging/gov24/promotion-preview.json
data/staging/gov24/promotion-preview-merged.tmp.json
```

The dry-run does not:

- write to `src/data/*.generated.ts`
- modify the existing 212 public policies
- call the Gov24 API
- write to Prisma or any database
- change UI

Selection rules:

- include only `ready` and `publishable_with_warning`
- select `ready` first
- then select `publishable_with_warning` only when category is confident, a public URL exists, organization and summary fields exist, and there is no strong duplicate
- exclude `needsReview`, `duplicate`, `incomplete`
- exclude `category=기타`, unknown source category, and category mapping gaps from the first promote dry-run
- exclude slug/id conflicts

Before real apply, review these fields in `promotion-preview.json`:

- `selectedCount`
- `selectedReadyCount`
- `selectedPublishableWithWarningCount`
- `skippedCategoryMappingGapCount`
- `skippedDuplicateCount`
- `skippedSlugConflictCount`
- `skippedIdConflictCount`
- `finalPolicyCountPreview`
- `categoryCountPreview`
- `statusCountPreview`
- `compatibilityIssues`
- `mergeValidation`

Actual apply must be a separate explicit stage after promotion dry-run passes. Do not turn this preview into production data automatically.

## Promotion Generator Dry-Run

Promotion generator dry-run checks whether selected staging candidates can be represented by the current public `Policy` model without losing safety signals.

Run:

```powershell
npm.cmd run promote:gov24:generate -- --limit=50
```

Outputs:

```text
data/staging/gov24/promotion-generator-report.json
data/staging/gov24/promotion-generated-preview.json
data/staging/gov24/promotion-generated-merged.tmp.json
```

This is still preview-only. It does not write generated production files.

Policy-model differences to check:

- staging has `statusLabel`, `applicationPeriodLabel`, `dateConfidence`, `statusConfidence`, `publishPolicy`, and `requiresOfficialConfirmation`
- current public `Policy` uses `status`, `deadline`, `dday`, `region`, and string arrays for display/search
- any value that cannot be preserved safely must be bucketed as `requires_model_or_ui_guard`

Conversion rules:

- Do not convert `확인필요` to `모집중`.
- Do not convert `확인필요` to `상시`.
- Do not calculate D-day when the source date is null or `dateConfidence` is `unknown`.
- Do not put date-unknown items into deadline sorting.
- Do not treat unknown region as `전국`.
- Exclude `기타`, unknown source category, and category mapping gap from first apply candidates.
- Preserve official-confirmation warnings; if the public model cannot preserve them, keep the item out of generated apply output.

Review `promotion-generator-report.json` before any apply:

- `promotableWithoutModelChangeCount`
- `promotableWithSafeMappingCount`
- `requiresModelOrUiGuardCount`
- `rejectedCount`
- `finalPromotableCount`
- `statusMappingIssues`
- `categoryMappingIssues`
- `regionMappingIssues`
- `dateDisplayIssues`
- `officialConfirmationPreservationIssues`
- `recommendedMinimalModelChanges`
- `recommendedMinimalUiGuards`
- `nextAction`

## Public Model Safety Guards

The public `Policy` model now supports optional safety/display fields for Gov24 warning-only candidates:

- `statusLabel`
- `statusConfidence`
- `dateConfidence`
- `applicationPeriodLabel`
- `regionLabel`
- `requiresOfficialConfirmation`
- `warnings`
- `publishPolicy`

Display and filter policy:

- `status="확인필요"` must not be coerced to `모집중` or `상시`.
- If `statusConfidence="unknown"`, show `statusLabel` such as `공식 공고 확인` and exclude the item from `모집중` and `마감임박` filters.
- If `dateConfidence="unknown"` or `endDate=null`, show `applicationPeriodLabel` such as `공식 공고 확인`; do not calculate or display D-day.
- Date-unknown items are excluded from deadline sorting and deadline-soon modules.
- If `region=null`, show `regionLabel` such as `공식 공고 확인`; do not treat it as `전국`.
- Region-unknown items can appear in all-list/search only, but not region pages.
- If `requiresOfficialConfirmation=true`, card/detail rendering must preserve an official-check notice.

Before any apply, rerun:

```powershell
npm.cmd run promote:gov24:generate -- --limit=50
```

Only proceed when `requiresModelOrUiGuardCount` is `0`, validation passes, and the generated preview still preserves official confirmation, date, status, and region safety fields.

## Apply Dry-Run

Apply dry-run simulates the final production merge without writing to production files.

Run:

```powershell
npm.cmd run promote:gov24:apply:dry-run -- --limit=50
```

Outputs:

```text
data/staging/gov24/apply-dry-run-report.json
data/staging/gov24/apply-dry-run-merged.tmp.json
```

Dry-run only:

- does not edit `src/data/policies.ts`
- does not edit `src/data/*.generated.ts`
- does not call the Gov24 API
- does not write to Prisma or any database
- does not deploy or publish data

Review `apply-dry-run-report.json` before any real apply:

- `dryRun` must be `true`
- `applyReadiness` should be `ready_for_apply`
- `selectedCount`, `skippedCount`, and `finalPolicyCountPreview`
- `conflictSummary`
- `searchIndexPreview.count`
- `pageGenerationPreview.valid`
- `guardValidation.valid`
- `categoryCountPreview`
- `statusCountPreview`
- `sourceCountPreview`
- `expectedChangedFiles`

Actual apply must be a separate explicit stage. Do not reuse the dry-run command to write production data, and do not add an implicit write path to it.

After a later approved apply, run this QA checklist:

- regenerate the public dataset through the approved generator only
- run `npm.cmd run validate:policies`
- run `npm.cmd test`
- run `npm.cmd run legacy:build`
- confirm homepage/support/category/search-index counts use the same public dataset
- spot-check several new `/support/{slug}/` detail pages
- confirm unknown date/status/region items do not show D-day, deadline-soon, or overclaimed status labels
- confirm official confirmation notices remain visible for warning-only imports

## Gov24 Apply

The real Gov24 apply command is intentionally separate from dry-run and requires an explicit confirmation flag:

```powershell
npm.cmd run promote:gov24:apply -- --limit=50 --confirm
```

Safety rules:

- `--confirm` is required; without it the command refuses to write.
- The command reads `apply-dry-run-report.json` and only proceeds when `applyReadiness` is `ready_for_apply`.
- It writes only the approved 50 Gov24 promotion candidates.
- It inserts a `gov24PromotionPolicies` block into `src/data/policies.ts` before the generated API policy pushes.
- Existing public policies are not modified or deleted.
- Generated production files are not manually edited.
- Gov24 API is not called.
- Prisma/database files are not touched.

After apply, the command writes:

```text
data/staging/gov24/apply-report.json
```

Then run:

```powershell
npm.cmd run validate:policies
npm.cmd run validate:staging:gov24
npm.cmd test
npm.cmd run legacy:build
```

The apply is considered successful only when policy validation, staging validation, tests, and legacy build all pass, and the final public count increases by the approved candidate count.

## Next Candidate Sources

Add future sources one at a time:

- Bokjiro central welfare services
- Bokjiro local welfare services
- Bizinfo support programs
- K-Startup startup programs
- OnTongYouth youth policies
