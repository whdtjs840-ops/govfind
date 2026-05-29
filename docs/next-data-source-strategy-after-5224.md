# Next Data Source Strategy After 5,224 Policies

Date: 2026-05-29

## Current Status

GovFind is operating with 5,224 production policies at the time this strategy was drafted. The connected data sources are:

- Gov24
- Bokjiro Central
- Bokjiro Local
- Ontong Youth
- Bizinfo
- K-Startup

The remaining needs-review pool was analyzed separately and did not contain warning-only items that could be safely unlocked with simple rules. The remaining items are blocker-heavy, so manual review would produce limited near-term scale.

## Why NeedsReview Should Not Be The Next Growth Path

- Total needsReview count was 90.
- Warning-only count was 0.
- Blocker count was 90.
- Expected safe-to-apply count after simple rule fixes was 0.
- Remaining blockers include category mapping gaps, duplicate risk, missing publish requirements, or source-specific ambiguity.

Because of this, spending time on needsReview cleanup is more likely to create small, manual batches than a clean large-batch expansion.

## Candidate Source Comparison

| Candidate source | Expected volume | GovFind fit | Duplicate risk | Mapping difficulty | API/key readiness | Development effort | Recommendation |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| National subsidy / e나라도움 | 500-2,000+ after unblock | Very high | Medium | High | Blocked by approval/auth | Medium to high | Defer until API approval is fixed |
| WorkNet supported jobs | 500-2,000+ | High for employment and training | Medium | Medium to high | Needs separate check | Medium | Strong next-source candidate |
| Public institution jobs | 500-1,500+ | Medium | Medium | Medium | Needs separate check | Medium | Useful, but more job-board-like |
| K-Startup additional expansion | 300-1,000 if pages remain | Very high | Medium | Low to medium | Existing pipeline | Low | Best immediate expansion path |
| Bizinfo additional expansion | 0-500 depending on fresh pages | High | Medium to high | Low to medium | Existing pipeline | Low | Monitor for fresh pages |
| Gov24/Bokjiro manual needsReview | 50-100 | Medium | High | Medium | Existing pipeline | Medium | Not efficient for large growth |

## Recommended TOP 3

1. **K-Startup additional expansion**
   - The importer, promotion, apply, and QA flow are already production-proven.
   - It strongly supports 창업, 예비창업, 초기창업, 사업화, 멘토링, 투자, and 창업교육 use cases.
   - It is the fastest path to a large safe batch if valid pages remain.

2. **WorkNet government-supported jobs**
   - Good fit for employment, training, youth jobs, and job-support programs.
   - Needs careful filtering so ordinary job postings do not dilute GovFind's support-program identity.

3. **National subsidy / e나라도움 after approval**
   - Very strong fit with the government-support portal identity.
   - Should resume only after the API key, detailed function approval, endpoint, and response shape are confirmed.

## Not Recommended As Immediate Work

- Continuing to force the remaining needsReview pool.
- Repeated national-subsidy calls before API approval/authentication is fixed.
- Broad public hiring ingestion before deciding whether ordinary recruitment listings belong in GovFind.

## Suggested Next Step

Proceed with a bounded K-Startup expansion window first, then run the established dry-run, generate, apply dry-run, apply, local QA, and production deploy sequence.

Suggested command pattern for a future approved data-expansion step:

```powershell
npm.cmd run discover:kstartup -- --pages=16,17,18,19,20,21,22,23,24,25 --limit=100 --save --resume
npm.cmd run promote:kstartup:dry-run -- --limit=1000
npm.cmd run promote:kstartup:generate -- --limit=1000
npm.cmd run promote:kstartup:apply:dry-run -- --limit=1000
```

Do not apply unless selected count, compatibility checks, search-index preview, page generation preview, and guard validation all pass.
