# Next Source After National Subsidy Blocked

Date: 2026-05-29

## Current Status

GovFind production is operating with 5,224 public search-index policies. The `national-subsidy` draft importer exists, but the source is blocked because the configured API key and endpoint returned an authorization or service-key error body instead of a normal XML/JSON data payload.

National subsidy should stay out of discovery, dry-run, apply, and deployment until the API approval and key format are confirmed.

## Why National Subsidy Is Deferred

- `sourceName`: `national-subsidy`
- `status`: `blocked_api_approval`
- `recommendedAction`: `wait_for_api_approval`
- `applyAllowed`: `false`
- Failure reason: likely data.go.kr detailed-function approval, Encoding/Decoding key mismatch, or endpoint/key authorization mismatch.

Retry only after:

1. The exact detailed function is approved on data.go.kr.
2. The correct Encoding or Decoding key type is confirmed.
3. The configured operation endpoint returns normal XML/JSON data, not an auth/error body.
4. `import:national-subsidy:dry-run` can parse real item rows.

## Candidate Source Comparison

| Candidate source | Ready now | API key needed | Expected volume | GovFind fit | Duplicate risk | Category mapping difficulty | Development difficulty | Recommendation |
| --- | --- | --- | ---: | --- | --- | --- | --- | --- |
| K-Startup additional expansion | Medium | Existing pipeline/key assumed | 300-800 if more valid pages remain | Very high for startup, business support, education, mentoring | Medium, because pages 1-15 are already applied | Low to medium | Low | Recommended first |
| Bizinfo additional expansion | Low to medium | Existing pipeline/key assumed | 0-300 short term unless fresh pages exist | High for small business, export, R&D, policy funds | High, because prior pages are heavily consumed | Low to medium | Low | Monitor, not first |
| Public institution hiring / jobs | Medium | Likely API or source-specific approval needed | 500-2,000 | Medium, more job-board than subsidy portal | Medium | Medium | Medium | Good second track if employment expansion is desired |
| WorkNet government-supported jobs | Medium | Likely WorkNet/open API key needed | 1,000+ | High for employment and training support | Medium | Medium to high | Medium | Recommended second |
| National subsidy retry | No | Yes, approval/key format required | 500-2,000 after unblock | Very high for grant/public-call identity | Medium | High, because budget/disclosure rows must be excluded | Medium to high | Defer until approval is fixed |

## Recommended TOP 3

1. **K-Startup additional expansion**
   - Best immediate fit with the existing importer, promotion, apply dry-run, and QA flow.
   - Strongly reinforces the startup and business-support side of GovFind.
   - Next attempt should use a bounded discovery window, not open-ended crawling.

2. **WorkNet government-supported jobs**
   - Strong fit for employment, training, youth jobs, and public job support discovery.
   - Expected volume is large enough to justify a new importer.
   - Needs careful separation between ordinary job listings and actual public support programs.

3. **Public institution hiring / jobs**
   - Useful for public-sector employment discovery, but less central to the "지원사업" identity than WorkNet.
   - Should be treated as a separate employment expansion track, not mixed into welfare or subsidy categories.

## Not Recommended As The Immediate Next Step

- **National subsidy retry**: blocked by approval/authentication; more local retries will waste time until the data.go.kr setup is corrected.
- **Bizinfo additional expansion**: the pipeline is stable, but the latest planning flow marked Bizinfo as exhausted. It is worth monitoring later for newly posted pages rather than forcing another batch now.
- **Existing Gov24/Bokjiro needsReview cleanup**: useful for quality, but not a fast large-batch expansion path because the remaining items are blocker-heavy.

## First Source To Proceed With

Recommended next source: **K-Startup additional expansion**.

Reason:

- Existing importer and promotion flow are already production-proven.
- Category mapping is comparatively stable: startup, business support, mentoring, education, investment, and commercialization.
- It can likely produce a meaningful batch if valid pages beyond the previous range remain.
- It does not require new UI, DB, or policy model changes.

Expected expansion quantity:

- Conservative: 200-300 policies.
- Plausible: 300-800 policies if pages beyond the previous discovery window still contain publishable items.

## Suggested Next Commands

Do not run these automatically. Run only in the next approved data-expansion step.

```powershell
npm.cmd run discover:kstartup -- --pages=16,17,18,19,20,21,22,23,24,25 --limit=100 --save --resume
npm.cmd run promote:kstartup:dry-run -- --limit=1000
npm.cmd run promote:kstartup:generate -- --limit=1000
npm.cmd run promote:kstartup:apply:dry-run -- --limit=1000
```

Apply should remain manual and conditional:

```powershell
npm.cmd run promote:kstartup:apply -- --limit=<selectedCount> --batch=3 --confirm
```

Apply conditions:

- `selectedCount >= 200`
- `compatibilityIssues: 0`
- search index preview valid
- page generation preview valid
- guard validation valid
- no duplicate, incomplete, needsReview, or category mapping gap candidates selected

## Risks

- K-Startup pages after the previous discovery range may have lower-quality or duplicate-heavy rows.
- Some ordinary announcements may not be direct support policies and should remain in `needsReview`.
- If candidate volume is low, WorkNet should become the next new-source investigation.

