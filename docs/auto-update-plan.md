# GovFind 자동 업데이트 설계

이 문서는 GovFind 1,098개 정책 버전 이후의 데이터 운영 자동화 방향을 정리한다. 현재 원칙은 완전 자동 반영이 아니라 **자동 수집 + 자동 분류 + 자동 리포트 + 사람 승인 후 apply**이다. 정책 데이터는 사용자 판단과 신청에 영향을 주므로, 새 정책 발견과 업데이트 후보 검출은 자동화하되 운영 반영은 반드시 dry-run, 검증, QA를 거친다.

## 현재 수동 파이프라인

### Gov24 discovery

- 명령어: `npm.cmd run discover:gov24 -- --limit=100 --pages=40 --save --resume`
- 입력: Gov24 API 응답, 기존 `data/imports/gov24` cache, 현재 `src/data/policies.ts`
- 출력: `data/staging/gov24/*discovery*.json`, raw/staging/report 파일
- 중단 조건: API quota/rate-limit/service key error, rawCount 0이 반복되는 잘못된 page 범위, `invariantPassed: false`, API key 노출 가능성

### Gov24 dry-run

- 명령어: `npm.cmd run promote:gov24:dry-run -- --limit=300`
- 입력: Gov24 staging/report, 현재 공개 정책 1,098개
- 출력: promotion preview report
- 중단 조건: duplicate/incomplete/needsReview/category mapping gap 후보가 selected에 포함됨, `publishPolicy.canPublish !== true`, selectedCount가 기대보다 작음

### Gov24 generate

- 명령어: `npm.cmd run promote:gov24:generate -- --limit=300`
- 입력: promotion preview 후보
- 출력: public Policy shape 변환 preview/report
- 중단 조건: status/date/region/category compatibility issue, `확인필요`을 `모집중`으로 바꾸는 변환, region unknown을 `전국`으로 단정하는 변환

### Gov24 apply dry-run

- 명령어: `npm.cmd run promote:gov24:apply:dry-run -- --limit=200`
- 입력: 변환 가능한 후보, 현재 `src/data/policies.ts`
- 출력: `data/staging/gov24/apply-dry-run-report*.json`
- 중단 조건: id/slug/sourceItemId/officialUrl 충돌, search index preview 불일치, page generation preview 실패, guard validation 실패, `applyReadiness !== ready_for_apply`

### Gov24 apply

- 명령어: `npm.cmd run promote:gov24:apply -- --limit=200 --batch=4 --confirm`
- 입력: ready apply dry-run report, source-of-truth `src/data/policies.ts`
- 출력: 업데이트된 `src/data/policies.ts`, `data/staging/gov24/apply-report-batch-*.json`
- 중단 조건: `--confirm` 없음, 실제 적용 개수가 dry-run selectedCount와 다름, 기존 정책 수정/삭제 감지, validation/build 실패

### Gov24 QA

- 명령어: `npm.cmd run validate:policies`, `npm.cmd test`, `npm.cmd run legacy:build`
- 입력: 적용 후 정적 dataset, `dist`
- 출력: `data/staging/gov24/post-apply-qa-report*.json`, production QA report
- 중단 조건: Invalid Date, NaN, undefined/null visible text, D-day guard issue, status guard issue, official confirmation issue, failed detail/search URL

### Bokjiro Central dry-run/discovery

- 명령어: `npm.cmd run import:bokjiro-central:dry-run -- --limit=20 --save`, `npm.cmd run discover:bokjiro-central -- --pages=2 --limit=50 --save --resume`
- 입력: Bokjiro central API 응답, cache, 현재 `src/data/policies.ts`
- 출력: `data/staging/bokjiro-central/dry-run-report.json`, `data/staging/bokjiro-central/discovery-report.json`
- 중단 조건: API quota/service error, duplicate만 반복되어 신규 후보 없음, 필수 필드 누락, mapping gap이 blocker로 분류됨

### Bokjiro Central apply flow

- 명령어:
  - `npm.cmd run promote:bokjiro-central:dry-run -- --limit=98`
  - `npm.cmd run promote:bokjiro-central:generate -- --limit=98`
  - `npm.cmd run promote:bokjiro-central:apply:dry-run -- --limit=98`
  - `npm.cmd run promote:bokjiro-central:apply -- --limit=98 --confirm`
- 입력: Bokjiro staging 후보, 현재 `src/data/policies.ts`
- 출력: 업데이트된 `src/data/policies.ts`, `data/staging/bokjiro-central/apply-report-bokjiro-central-batch-1.json`
- 중단 조건: `확인필요`, `dateConfidence: unknown`, `applicationPeriodLabel: 공식 공고 확인`, `requiresOfficialConfirmation: true` 보존 실패

### Production deploy

- 명령어: `npx.cmd wrangler pages deploy dist --project-name govfind --branch main --commit-hash <commit> --commit-message "<message>"`
- 입력: 검증된 `dist`, git commit hash
- 출력: Cloudflare Pages deployment URL
- 중단 조건: deploy 실패, deployment URL과 `govfind.kr`의 `search-index.json` count 불일치, custom domain만 이전 버전 유지

### Production QA

- 입력: `https://govfind.kr`, deployment URL, `search-index.json`
- 출력: `data/staging/*/production-qa-report*.json`
- 중단 조건: production count 불일치, 상세 404, 검색 결과 오류, Invalid Date/NaN/undefined/null visible text, 공식 확인 문구 누락

## 자동 업데이트 목표

1. 새 정책 발견: source별 API/cache를 기준으로 기존 정책에 없는 신규 후보를 찾는다.
2. 기존 정책 업데이트 후보 발견: 같은 sourceItemId 또는 officialUrl의 제목, 요약, 기관, 신청 URL, 연락처 변경을 감지한다.
3. 마감/상태 변경 후보 발견: 기존 정책의 status, deadline, dday, applicationPeriodLabel이 바뀐 가능성을 별도 후보로 분류한다.
4. 중복 후보 발견: sourceName + sourceItemId, officialUrl, title + organizationName, title similarity 기준으로 신규/기존 중복을 기록한다.
5. 사람이 승인해야 하는 항목 분리: category mapping gap, unknown source category, officialUrl 불명확, duplicate candidate, status/date 불확실 항목을 승인 대기열에 둔다.
6. 자동 반영하면 안 되는 항목 분리: 필수 필드 누락, strong duplicate, officialUrl/applicationUrl 모두 없음, category=기타 자동 매핑, API error payload를 blocked로 분류한다.

## 추천 자동화 방식

GovFind의 기본 업데이트 원칙은 **자동 수집 + 수동 승인**이다.

자동으로 해도 되는 단계:

- API별 discovery 실행
- raw/cache 저장
- staging normalization
- duplicate/update/expired 후보 분류
- update report 생성
- apply dry-run preview 생성
- validate/test/build 실행

사람이 승인해야 하는 단계:

- 신규 후보를 production dataset에 apply
- 기존 정책의 title, summary, status, deadline, officialUrl 변경
- duplicate 후보 병합/제외 결정
- category mapping gap 해소
- production 배포

## 추천 스케줄

- 매일 새벽 03:00: `update:gov24:check`, `update:bokjiro-central:check`
- 매일 새벽 04:00: `update:report`
- 주 1회 월요일 오전: 신규 후보 `update:apply:dry-run`
- 사람 승인 후: `update:apply -- --confirm`
- apply 직후: `validate:policies`, `test`, `legacy:build`
- 배포 직후: production QA report 생성
- 월 1회: duplicate/update/expired 후보 누적 리포트 리뷰

## 추천 명령어 구조

### `npm.cmd run update:gov24:check`

- Gov24 discovery를 안전한 page/window 단위로 실행한다.
- cache hit이면 API를 재호출하지 않는다.
- quota error는 error report로 저장하고 성공 report를 덮어쓰지 않는다.
- 신규, 업데이트, 마감, 중복 후보를 `data/staging/updates/gov24-check-report.json`에 기록한다.

### `npm.cmd run update:bokjiro-central:check`

- Bokjiro central discovery를 소량 page 단위로 실행한다.
- status/date/region이 불확실한 값은 `공식 공고 확인` 정책으로만 staging한다.
- 신규, 업데이트, 중복 후보를 `data/staging/updates/bokjiro-central-check-report.json`에 기록한다.

### `npm.cmd run update:report`

- source별 check report를 합쳐 하나의 운영 리포트를 만든다.
- 출력: `data/staging/updates/update-report-YYYYMMDD.json`
- `safeToApply`, `needsReview`, `blockedItems`, `sourceErrors`, `quotaErrors`를 한눈에 볼 수 있게 요약한다.

### `npm.cmd run update:apply:dry-run`

- `safeToApply` 후보만 대상으로 메모리/temp 병합을 수행한다.
- 기존 정책 파일은 쓰지 않는다.
- search index preview, page generation preview, guard validation을 확인한다.
- `applyReadiness: ready_for_apply`가 아니면 중단한다.

### `npm.cmd run update:apply -- --confirm`

- 사람이 승인한 후보만 source-of-truth `src/data/policies.ts`에 반영한다.
- `--confirm`이 없으면 write하지 않는다.
- 기존 정책 삭제는 허용하지 않는다.
- apply 후 validate/test/build를 반드시 실행한다.

## 자동 업데이트 리포트 구조

자동 업데이트 리포트는 다음 필드를 포함한다.

```json
{
  "runAt": "2026-05-27T00:00:00.000Z",
  "sources": ["gov24", "bokjiro-central"],
  "currentPolicyCount": 1098,
  "newCandidates": [],
  "updateCandidates": [],
  "expiredCandidates": [],
  "duplicateCandidates": [],
  "needsReview": [],
  "safeToApply": [],
  "blockedItems": [],
  "sourceErrors": [],
  "quotaErrors": [],
  "summary": {
    "newCandidateCount": 0,
    "updateCandidateCount": 0,
    "expiredCandidateCount": 0,
    "duplicateCandidateCount": 0,
    "safeToApplyCount": 0,
    "blockedCount": 0
  },
  "recommendedAction": "review_before_apply"
}
```

## 안전장치

- 기존 정책 삭제 금지.
- 마감 정책 자동 삭제 금지.
- status를 `모집중`으로 임의 변경 금지.
- status가 불확실하면 `확인필요`와 `공식 공고 확인`을 유지.
- 지역 미상을 `전국`으로 단정 금지.
- 날짜 미상을 `상시`로 단정 금지.
- 날짜 미상 항목은 D-day 표시, 마감임박 필터, 마감순 정렬에서 제외.
- officialUrl 또는 applicationUrl이 없는 항목은 자동 반영 금지.
- duplicate 후보는 자동 반영 금지.
- category mapping gap과 category=기타 후보는 자동 반영 금지.
- API error payload를 정상 item으로 처리 금지.
- API key, service key, secret 로그 출력 금지.
- 실패한 run이 마지막 성공 report를 덮어쓰는 것 금지.
- apply 전 dry-run 필수.
- apply 후 `validate:policies`, `test`, `legacy:build` 필수.
- production 배포 후 search-index count와 source count 확인 필수.

## 다음 구현 단계

1. `scripts/update-check-gov24.mjs`를 추가해 Gov24 discovery/cache/report를 하루 단위 update check로 묶는다.
2. `scripts/update-check-bokjiro-central.mjs`를 추가해 Bokjiro central discovery/cache/report를 같은 구조로 맞춘다.
3. `scripts/update-report.mjs`를 추가해 source별 리포트를 통합한다.
4. `scripts/update-apply-dry-run.mjs`를 추가해 `safeToApply` 후보만 temp merge 검증한다.
5. `scripts/update-apply.mjs`는 `--confirm`과 승인된 report id가 있을 때만 쓰기 가능하게 만든다.
6. Cloudflare Pages direct deploy는 자동 apply와 분리하고, production QA가 끝난 뒤 수동으로 실행한다.

## 권장 다음 작업

첫 구현은 `update:report`보다 `update:gov24:check`와 `update:bokjiro-central:check`를 먼저 만드는 것이 좋다. 이미 source별 discovery와 promotion 로직이 있으므로, 이를 감싸서 같은 report schema로 내보내면 이후 통합 리포트와 승인형 apply를 안정적으로 붙일 수 있다.
 
## Step 16 Update Check Commands

The first automation implementation is a cache-only update check. It does not apply data, does not modify `src/data/policies.ts`, and does not call external APIs by default.

### Gov24 Check

Command:

```bash
npm.cmd run update:gov24:check
```

Output report:

```text
data/staging/automation/update-gov24-check-report.json
```

Behavior:

- Reads existing Gov24 raw/cache/staging artifacts.
- Re-normalizes cached Gov24 items against the current public dataset.
- Compares against current source item IDs, slugs, official URLs, and title + organization keys.
- Classifies items into `newCandidates`, `duplicateCandidates`, `needsReview`, `safeToApply`, and `blockedItems`.
- Does not fetch the API unless a future implementation explicitly wires `--fetch`.

### Bokjiro Central Check

Command:

```bash
npm.cmd run update:bokjiro-central:check
```

Output report:

```text
data/staging/automation/update-bokjiro-central-check-report.json
```

Behavior:

- Reads existing Bokjiro Central staging artifacts.
- Reuses the Bokjiro candidate selection rules.
- Excludes already applied source items, duplicate candidates, incomplete items, and category mapping gaps.
- Emits the same report schema as the Gov24 check so a later `update:report` command can combine them.

### Fetch Policy

Both commands are cache-only by default. The supported future option names are:

```bash
--fetch --pages --limit --resume --save
```

In this phase, `--fetch` is intentionally blocked inside the check commands. API discovery should still be run through the explicit source discovery commands after human approval. API keys and service keys must never be printed in logs or reports.

### Report Interpretation

- `safeToApplyCount > 0` and `recommendedAction: ready_for_apply_dry_run` means a human can run the source-specific apply dry-run next.
- `needsReviewCount > 0` means a person should inspect mapping gaps or uncertain fields before promotion.
- `duplicateCandidateCount > 0` means the item should not be auto-applied.
- `blockedItemCount > 0` means required fields, category mapping, or unsupported classification blocked promotion.
- `recommendedAction: fetch_required` means cache has no usable remaining candidate and discovery may be needed.

### Approval Boundary

Automation may collect, classify, and report candidates. A human must approve source-of-truth data writes, policy updates to existing rows, duplicate resolution, category mapping changes, and production deployment.

## Step 17 Integrated Update Report

The integrated report combines source-specific cache-only check reports into one operator-facing summary. It reads only existing check report JSON files and does not call external APIs.

Command:

```bash
npm.cmd run update:report
```

Input reports:

```text
data/staging/automation/update-gov24-check-report.json
data/staging/automation/update-bokjiro-central-check-report.json
```

Output report:

```text
data/staging/automation/update-report.json
```

Difference between source check reports and the integrated report:

- Source check reports contain the per-source candidate buckets and raw decision counts.
- The integrated report contains cross-source totals, missing source reports, fetch-required sources, apply-dry-run-ready sources, and the human approval queue.

What a human should approve from `humanApprovalQueue`:

- whether a source with `safeToApplyCount > 0` should proceed to source-specific apply dry-run,
- whether a `fetch_required` source should run a new discovery command,
- whether `needsReview` items should be mapped, blocked, or deferred.

`recommendedNextAction` interpretation:

- `ready_for_apply_dry_run`: one or more sources have safe candidates; run the suggested apply dry-run command only.
- `fetch_required`: no safe candidates remain in cache; run explicit discovery after approval.
- `needs_review`: review mapping gaps, uncertain fields, or blocked candidates before any dry-run.
- `no_action`: no useful candidate or required action is present.
- `stop_and_review`: source errors or quota errors need inspection.

Real apply still requires a separate source-specific dry-run, human approval, and an explicit `--confirm` apply command.

## Step 18 Integrated Apply Dry-Run

The integrated apply dry-run turns an approved `update-report.json` recommendation into a source-specific temp merge and validation pass. It still does not write production policy data.

Command:

```bash
npm.cmd run update:apply:dry-run
```

Optional source and limit:

```bash
npm.cmd run update:apply:dry-run -- --source=gov24 --limit=48
npm.cmd run update:apply:dry-run -- --source=all
```

Input:

```text
data/staging/automation/update-report.json
```

Output:

```text
data/staging/automation/update-apply-dry-run-report.json
```

Difference from `update:report`:

- `update:report` only combines source check reports and recommends the next action.
- `update:apply:dry-run` runs the approved source-specific promotion dry-run, generator dry-run, and apply dry-run paths, then records final temp merge counts, search index preview, page generation preview, and guard validation.

Fetch-required sources are excluded from integrated apply dry-run. For example, when Gov24 has 48 safe candidates and Bokjiro Central is `fetch_required`, only Gov24 is checked and Bokjiro remains in `skippedSources` with its discovery command.

Expected current example:

- Gov24: 48 candidates ready for apply dry-run.
- Bokjiro Central: fetch required, excluded from dry-run.
- Expected preview count: 1,098 + 48 = 1,146.

The dry-run report may suggest a manual apply command such as:

```bash
npm.cmd run promote:gov24:apply -- --limit=48 --batch=6 --confirm
```

That command must only be run after a human reviews the dry-run report. `update:apply:dry-run` itself never accepts `--confirm` and never writes to the source-of-truth policy file.

## Step 21 Final Selection Guard

`update:report` is a preliminary routing report. It can say that a source has `safeToApplyCount` candidates and recommend `ready_for_apply_dry_run`, but that does not mean the candidates are safe to write to `src/data/policies.ts`.

`update:apply:dry-run` is the final pre-apply decision point. It re-runs source promotion, public Policy generation, temp merge validation, search index preview, page generation preview, and guard validation.

If `safeToApplyCount` is greater than zero but `finalSelectedCount` is zero:

- do not run any apply command,
- treat `applyReadiness` as `not_ready_no_selected_candidates`,
- treat `recommendedNextAction` as `need_more_discovery` or candidate review,
- inspect `candidateTrace` and `excludedAfterFinalValidationReasons`,
- run more discovery or fix the source-specific filter only after reviewing the exclusion reasons.

The final apply rule is:

```text
finalApplyAllowed === true
```

This requires a non-zero final selected count and a ready final dry-run. A preliminary `safeToApplyCount` alone is never enough for production writes.

Official URL conflicts are treated carefully. A shared or generic URL, such as a source main page, search/list page, common application platform, or a URL that does not identify a single source item, is not enough by itself to block a candidate as a strong duplicate. It should be recorded as a weak/downgraded conflict and reviewed with title, organization, source item ID, and content similarity.

Strong duplicate evidence should come from at least one of these:

- identical source name and source item ID,
- identical source-specific detail URL,
- identical slug,
- high title similarity with the same organization,
- high title and support-content similarity.

`update:apply:dry-run` also uses a small-batch safety guard. If the final selected count is non-zero but below the minimum manual apply threshold, the report should recommend more discovery instead of immediate apply.

## Step 35 Weekly Integrated Dry-Run

`update:apply:dry-run` supports both current automatic update sources:

- `gov24`
- `bokjiro-central`

The command reads `data/staging/automation/update-report.json` and processes only sources listed in `readyForApplyDryRunSources`. A source marked `fetch_required`, `no_action`, or with zero safe candidates is skipped and kept in `skippedSources`.

Supported source selection:

```bash
npm.cmd run update:apply:dry-run
npm.cmd run update:apply:dry-run -- --source=gov24
npm.cmd run update:apply:dry-run -- --source=bokjiro-central
npm.cmd run update:apply:dry-run -- --source=all
npm.cmd run update:apply:dry-run -- --source=all --limit=50
```

`update:report` remains a preliminary routing report. It answers which source should be checked next. `update:apply:dry-run` is the final pre-apply decision report because it runs the source promotion dry-run, generator dry-run, temp merge, search index preview, page generation preview, and guard validation.

Final apply safety rules:

- `finalSelectedCount === 0`: do not apply. Run more discovery or review blocked candidates.
- `finalSelectedCount > 0` and `< 30`: treat as `small_batch_review`; do not apply unless a human explicitly decides a tiny batch is worth it.
- `finalSelectedCount >= 30` with no compatibility issues: `finalApplyAllowed` may be `true`.
- Any compatibility issue, invalid search index preview, invalid page generation preview, or invalid guard validation blocks apply.

The integrated dry-run may write suggested manual commands into the report, for example:

```bash
npm.cmd run promote:gov24:apply -- --limit=<selectedCount> --batch=<nextBatch> --confirm
npm.cmd run promote:bokjiro-central:apply -- --limit=<selectedCount> --batch=<nextBatch> --confirm
```

These commands are suggestions only. They must not be run until a person reviews `data/staging/automation/update-apply-dry-run-report.json` and explicitly approves the source-specific apply. After any real apply, the required sequence is local QA, validation, build, production deploy, and production QA.

## Step 55 All-Source Update Status

`update:all` is the operator entry point for checking every connected source in one run.

Command:

```bash
npm.cmd run update:all
```

Output:

```text
data/staging/automation/update-all-report.json
```

Default behavior:

- Cache-only. It does not call Gov24, Bokjiro, Ontong Youth, Bizinfo, K-Startup, or any other external API.
- It runs integrated cache-only check commands where they exist.
- It records sources that are not yet integrated into the update check flow as `not_integrated_into_update_check`.
- It continues when one source fails and records the failure in `sourceErrors`.
- It never writes to `src/data/policies.ts` and never runs apply.

Current sources shown in the report:

- `gov24`
- `bokjiro-central`
- `bokjiro-local`
- `ontong-youth`
- `bizinfo`
- `kstartup`

Report interpretation:

- `readyForDryRunSources`: sources with safe cache candidates that can proceed to source-specific dry-run.
- `fetchRequiredSources`: sources that need explicit discovery or are not yet integrated into automatic cache checks.
- `blockedSources`: sources with check errors, mapping review, or other blockers.
- `recommendedNextAction: ready_for_large_batch_dry_run`: at least 300 safe candidates are available.
- `recommendedNextAction: ready_for_medium_batch_dry_run`: 50 to 299 safe candidates are available.
- `recommendedNextAction: fetch_required`: no safe candidates are available, but discovery or manual source dry-run is needed.
- `recommendedNextAction: needs_review`: at least one source check failed or needs human review.
- `recommendedNextAction: no_action`: no useful candidate or action is present.

The intended weekly flow is:

1. Run `npm.cmd run update:all`.
2. Review `data/staging/automation/update-all-report.json`.
3. Run the suggested source-specific discovery or large dry-run command.
4. If dry-run passes, run the source-specific apply command only after human approval.
5. Run local QA, `validate:policies`, `test`, and `legacy:build`.
6. Commit, deploy, and run production QA.

`update:all` may list apply dry-run commands, but any command containing `--confirm` must be run manually only after reviewing the source-specific dry-run report.

## Step 56 Full Source Check Integration

`update:all` now calls cache-only update checks for all connected data sources:

```bash
npm.cmd run update:gov24:check
npm.cmd run update:bokjiro-central:check
npm.cmd run update:bokjiro-local:check
npm.cmd run update:ontong-youth:check
npm.cmd run update:bizinfo:check
npm.cmd run update:kstartup:check
npm.cmd run update:all
```

Each source check writes the same report shape under `data/staging/automation/`:

- `update-gov24-check-report.json`
- `update-bokjiro-central-check-report.json`
- `update-bokjiro-local-check-report.json`
- `update-ontong-youth-check-report.json`
- `update-bizinfo-check-report.json`
- `update-kstartup-check-report.json`

All update checks are cache-only. They read existing staging/cache artifacts, compare against the current public policy dataset, and classify candidates as safe, duplicate, needs review, incomplete, blocked, or fetch required. They do not call APIs and do not modify source-of-truth policy data.

The shared selection rules are:

- exclude already applied `sourceItemId`, slug, and official URL conflicts,
- exclude duplicate, incomplete, and needs-review items,
- exclude category mapping gaps and unsupported categories,
- allow only `ready` or `publishable_with_warning`,
- require `publishPolicy.canPublish === true`,
- require title, slug, source name, source item ID, organization, official/application URL, and summary/description.

After `update:all`, choose the next source by reading:

- `readyForDryRunSources`: run the suggested source-specific dry-run next.
- `fetchRequiredSources`: run explicit discovery only after approval.
- `blockedSources`: review mapping or needs-review reports before discovery/apply.
- `recommendedNextAction`: the overall routing decision.

API calls remain outside the default update flow. Use explicit discovery commands such as `discover:bizinfo`, `discover:kstartup`, or source-specific `--fetch` support only when a person approves that source.

## Step 64 Update Plan Recommendation

`update:plan` turns the latest all-source status into a short operator plan.

Command:

```bash
npm.cmd run update:plan
```

Input:

```text
data/staging/automation/update-all-report.json
```

If the `update-all` report does not exist, `update:plan` runs `npm.cmd run update:all` first. Otherwise it only reads existing cache/report artifacts. It does not call external APIs, does not run discovery, does not apply policies, and does not modify source-of-truth data.

Output:

```text
data/staging/automation/update-plan-report.json
```

The report summarizes every source with:

- safe cache candidates,
- fetch-required state,
- needs-review state,
- current source count,
- source stability,
- expected category impact,
- recommended next source command.

Recommendation rules:

- If a source has at least 300 safe candidates and no blockers, recommend a source-specific large dry-run.
- If no large batch is ready but a source is `fetch_required`, recommend discovery for the highest-priority stable source.
- If sources have `needs_review` or check errors, keep them blocked until a person reviews their source-specific reports.
- Actual apply is never executed by `update:plan`. Apply commands should only be considered after a source-specific dry-run passes and a person approves the batch.

Source exhaustion rules:

- `sourceExhausted` means the known discovery reports show that all valid pages for the source have already been fetched.
- `fetch_required` should be treated as actionable only when valid unfetched pages remain.
- If `remainingValidPages` is `0`, `update:plan` must not recommend another discovery run for that source.
- If a source is exhausted and has no safe candidates, the recommended action becomes `exhausted` or `no_action`.
- If only needs-review items remain, the source should be routed to review instead of discovery.
- When all existing sources are exhausted, blocked, or below useful batch size, the plan should recommend `review_or_new_source`.

Recommended operating flow:

1. Run `npm.cmd run update:all`.
2. Run `npm.cmd run update:plan`.
3. Follow the suggested discovery or dry-run command.
4. Review the source-specific dry-run report.
5. If approved, run apply manually with `--confirm`.
6. Run local QA, validation, build, commit, deploy, and production QA.
