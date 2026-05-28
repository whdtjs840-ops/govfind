# GovFind v1 최종 준비도 감사 리포트 (5,224개 기준)

작성 시점: 2026-05-28  
대상 버전: production 5,224개 정책  
감사 범위: 홈, 지원사업 목록, 검색/필터, 카테고리, 상세 페이지, SEO/기술, 자동 업데이트 흐름  
수정 여부: 수정 없음, 리포트만 작성

## 전체 완성도 평가

GovFind v1은 오늘 안에 마감 가능한 상태입니다. 핵심 데이터 규모는 5,224개로 충분하고, 주요 데이터 소스(Gov24, Bokjiro Central, Bokjiro Local, Ontong Youth, Bizinfo, K-Startup)가 연결되어 있습니다. 검색, 필터, 번호형 pagination, 상세 페이지, 카테고리 페이지, SEO 메타, sitemap, robots.txt 모두 기본 품질 기준을 통과했습니다.

v1의 핵심 가치는 “공식 출처 기반으로 여러 정부지원사업을 한곳에서 탐색한다”는 점이며, 현재 홈과 상세 페이지의 신뢰 문구, 공식 신청처 CTA, 카테고리 구조가 이 메시지를 충분히 전달합니다.

다만 v1 이후에는 성능과 검색 품질 개선이 중요합니다. 특히 `/support/`와 대형 카테고리 페이지는 번호형 pagination이 적용되어 있지만 정적 HTML에 많은 카드가 포함되어 HTML 크기가 큽니다. 기능상 배포 차단은 아니지만, 실제 사용자 경험과 Core Web Vitals 개선을 위해 다음 개선 우선순위로 두는 것이 좋습니다.

## 배포 차단 이슈 여부

배포 차단 이슈는 없습니다.

- search-index count: 5,224
- search-index items length: 5,224
- validate/test/build: 통과
- Invalid Date / NaN / undefined/null: 발견 없음
- 주요 상세 페이지 404: 없음
- sitemap-index.xml: 존재
- robots.txt sitemap 안내: 정상
- title/meta/canonical/OG: 주요 페이지에서 정상
- `/support/` 및 `/category/*` pagination: 정상

## 홈 평가

홈 첫 화면은 GovFind가 어떤 서비스인지 비교적 명확하게 전달합니다. “공식 출처 기반”과 데이터 규모가 신뢰 신호로 작동하고, 검색창이 사용자의 첫 행동을 잘 유도합니다.

좋은 점:
- 검색 중심 구조가 명확합니다.
- 공식 출처와 데이터 규모가 서비스 신뢰도를 보강합니다.
- 카테고리 카드가 실제 데이터가 있는 카테고리 중심으로 정리되어 있습니다.
- 과도한 마케팅 문구보다 탐색 기능에 집중되어 있습니다.

남은 개선점:
- 인기 검색어 또는 대표 시나리오(청년, 창업, 소상공인, 긴급복지)를 첫 화면에서 조금 더 안내하면 신규 사용자의 첫 검색 진입이 쉬워집니다.
- 출처별 데이터 현황은 좋지만, 사용자가 “내 상황에 맞게 어디부터 눌러야 하는지”를 더 빠르게 알 수 있도록 보조 문구를 조금 더 다듬을 여지가 있습니다.

## /support 목록 평가

5,224개 기준으로 번호형 pagination은 정상입니다. 검색 결과 헤더, active filter chip, 필터 유지, 0건 UI 분리도 잘 동작합니다.

좋은 점:
- 전체 목록과 검색/필터 결과 모두 pagination이 유지됩니다.
- 결과가 있을 때 0건 UI가 나오지 않습니다.
- 카드에는 제목, 기관, 카테고리, 상태, 출처가 표시되어 탐색에 필요한 최소 정보가 있습니다.
- 공식확인 상태가 과하게 긴 경고문으로 반복되지 않습니다.

남은 개선점:
- 정적 `/support/` HTML이 약 10MB 수준으로 큽니다. 번호형 pagination은 UI상 적용됐지만, 현재 빌드 산출물은 많은 카드 정보를 포함하고 있어 초기 전송량 최적화가 필요합니다.
- 카드 정보량은 현재 수용 가능하지만, 데이터가 7,000개 이상으로 커지면 출처/상태/카테고리 badge의 시각적 밀도를 더 줄여야 할 수 있습니다.
- 검색 결과 정렬은 기본 검색 매칭 중심으로 보이며, 사용자의 의도와 최신성/모집 상태/공식확인 상태를 함께 반영한 랭킹 개선 여지가 있습니다.

## 상세 페이지 평가

상세 페이지는 v1 기준으로 충분히 읽기 쉽습니다. 핵심 요약 카드, 지원 대상, 지원 내용, 신청 방법, 공식 출처가 분리되어 있고, 공식 신청처 CTA가 잘 보입니다.

좋은 점:
- 제목과 기관/카테고리/상태 정보가 잘 보입니다.
- 공식 신청처 CTA가 명확합니다.
- `requiresOfficialConfirmation` 계열 정책의 안내 문구가 단일 신뢰 블록으로 정리되어 있습니다.
- description이 비어 있더라도 summary, 지원 대상, 지원 내용, 신청 방법, 공식 출처가 조합되어 빈 페이지처럼 보이지 않습니다.
- Invalid Date, NaN, undefined/null 문제가 발견되지 않았습니다.

남은 개선점:
- 일부 외부 API 기반 정책은 summary가 공고 제목과 비슷하거나 짧아, 장기적으로 원문 기반 요약 품질 개선이 필요합니다.
- 공식확인 항목이 1,613개로 많기 때문에, 나중에는 “확인필요” 데이터의 최신성/상태 갱신 자동화가 중요합니다.

## 카테고리 평가

현재 카테고리 분포는 v1 기준 자연스럽습니다.

- 창업: 1,328
- 교육: 883
- 복지: 565
- 보건의료: 522
- 소상공인: 507
- 고용: 441
- 청년: 337
- 주거: 258
- 농림어업: 233
- 문화생활: 150

좋은 점:
- K-Startup과 Bizinfo 확장 후 창업/소상공인 카테고리가 충분히 강화되었습니다.
- 복지/보건의료/Bokjiro 계열 데이터도 여전히 충분합니다.
- 이전 Bizinfo 주거 오분류 정리 이후, 기업지원 데이터가 주거에 크게 섞이는 문제는 완화되었습니다.

남은 개선점:
- Bizinfo/K-Startup 항목 중 “교육”, “고용”, “소상공인”, “창업” 사이에 경계가 애매한 정책은 장기적으로 세부 태그 체계가 필요합니다.
- 현재 대분류 10개는 단순하고 좋지만, 5,000개 이상에서는 “정책자금”, “수출”, “기술/R&D”, “사업화”, “멘토링” 같은 보조 태그가 탐색 품질을 크게 높일 수 있습니다.

## 검색 UX 평가

주요 검색어 기준 결과는 정상입니다.

- 청년: 결과 있음
- 창업: 결과 있음
- 소상공인: 결과 있음
- 긴급복지: 결과 있음
- 정책자금: 결과 있음
- K-Startup: 결과 있음

좋은 점:
- 검색 결과 헤더가 현재 검색어/필터 상태를 설명합니다.
- active chip으로 현재 조건이 드러납니다.
- 0건 UI는 결과가 없을 때만 표시되는 구조입니다.
- pagination이 검색/필터와 함께 유지됩니다.

남은 개선점:
- 검색 랭킹은 v1 이후 가장 큰 개선 포인트입니다. 예를 들어 “정책자금” 검색은 제목/summary 매칭뿐 아니라 소상공인/기업마당/K-Startup의 금융성 공고를 더 잘 끌어올리는 방식이 필요합니다.
- 동의어 사전(예: 융자=대출=자금, 취업=일자리=고용)을 도입하면 체감 검색 품질이 좋아질 수 있습니다.

## SEO/기술 평가

기술 기본기는 v1 기준 안정적입니다.

- search-index count: 5,224
- sitemap-index.xml: 정상 생성
- robots.txt: sitemap 안내 포함
- 주요 페이지 title/meta/canonical/OG: 정상
- 상세 페이지 title: 정책명 기반
- meta description: 비어 있지 않음
- Invalid Date / NaN / undefined/null: 발견 없음

남은 개선점:
- sitemap support URL 수와 public search-index 수가 완전히 같은지 지속 점검이 필요합니다. 현재는 dedupe/search-only/생성 상세 페이지 정책 때문에 약간의 known exception 가능성이 있습니다.
- `/support/`와 대형 카테고리 페이지 HTML 크기가 큽니다. 정적 SEO와 UX 사이 균형을 유지하면서 실제 page query별 정적 분할 또는 클라이언트 데이터 렌더링을 검토할 만합니다.

## 자동화 상태

`update:all`은 정상 동작합니다.

현재 결과:
- currentPolicyCount: 5,224
- searchIndexCount: 5,224
- totalNewCandidateCount: 71
- totalSafeToApplyCount: 71
- readyForDryRunSources: bokjiro-local, ontong-youth
- fetchRequiredSources: bokjiro-central
- blockedSources: gov24, bizinfo, kstartup
- recommendedNextAction: needs_review

다음에 사람이 보면 되는 명령:

```powershell
npm.cmd run update:all
```

그 다음 흐름:

1. `data/staging/automation/update-all-report.json` 확인
2. `readyForDryRunSources`가 300개 이상이면 source별 large dry-run
3. `blockedSources`는 needsReview report 먼저 확인
4. apply 전 source별 `promote:*:apply:dry-run` 실행
5. apply 후 validate/test/build + 로컬 QA
6. production deploy + production QA

아직 수동으로 남은 부분:
- Gov24 needsReview 66건 검토
- Bizinfo needsReview 2건 검토
- K-Startup needsReview 22건 검토
- Bokjiro Central 추가 discovery 여부 판단
- 검색 랭킹/동의어/태그 개선은 별도 제품 개선 과제

## 이슈 목록

### Critical

없음.

### High

1. `/support/` 정적 HTML이 매우 큼
   - 5,224개 데이터 기준 `/support/` HTML이 약 10MB 수준입니다.
   - 번호형 pagination은 UX상 정상이나, 실제 HTML 전송량/파싱 비용은 여전히 큽니다.
   - v1 배포 차단은 아니지만 v1 이후 가장 먼저 줄이는 것이 좋습니다.

2. 대형 카테고리 페이지 HTML 크기
   - `/category/startup/`는 창업 데이터가 많아 약 5MB 이상입니다.
   - `/category/small-business/`, `/category/welfare/`도 데이터 증가와 함께 무거워질 수 있습니다.

### Medium

1. 검색 랭킹이 아직 단순함
   - 키워드 포함 여부는 잘 잡지만, 모집 상태/최신성/출처 신뢰도/카테고리 가중치가 충분히 반영되지는 않습니다.

2. 세부 태그 체계 부족
   - 창업/소상공인/고용/교육 사이 경계가 애매한 기업지원 공고가 있습니다.
   - 정책자금, 수출, R&D, 사업화, 멘토링 같은 보조 태그가 있으면 탐색 품질이 좋아집니다.

3. 공식확인 상태 데이터가 많음
   - 공식 공고 확인 상태는 안전하지만, 사용자가 “신청 가능한지”를 빠르게 판단하기 어렵습니다.
   - 상태 갱신 자동화가 필요합니다.

4. update:all 결과가 needs_review
   - 자동화 자체는 동작하지만 Gov24/Bizinfo/K-Startup에 검토 항목이 남아 있어 완전 자동 확장은 아직 어렵습니다.

### Low

1. validate warning 75건
   - 기존 non-standard dday, phone-like document warning입니다.
   - 현재 validation은 통과하며 v1 차단 사유는 아닙니다.

2. 일부 summary 품질 편차
   - API 원문 성격이 남은 문장이 있습니다.
   - 상세 템플릿이 보완하고 있어 v1 차단은 아닙니다.

3. sitemap/search-index known exception 지속 점검 필요
   - 검색 제외/중복 제외 정책과 상세 페이지 생성 정책의 차이를 주기적으로 audit하면 좋습니다.

## 오늘 안에 꼭 고칠 것 TOP 5

v1 마감을 오늘 해야 한다면 필수 수정은 없습니다.

다만 시간이 조금 있다면 아래 순서로 보는 것이 좋습니다.

1. `/support/` HTML 크기 완화 방향 결정
   - 당장 구현까지는 아니어도 v1 이후 첫 성능 작업으로 확정합니다.

2. `/category/startup/` HTML 크기 완화 방향 결정
   - 창업 카테고리가 가장 커서 우선순위가 높습니다.

3. 검색 랭킹 개선 설계
   - 동의어/상태/카테고리/출처 가중치 기준을 문서화합니다.

4. update:all blocked source review 계획 수립
   - Gov24 66, K-Startup 22, Bizinfo 2 needsReview를 다음 데이터 확장 전 정리합니다.

5. 세부 태그 도입 범위 결정
   - 정책자금, 수출, 기술지원, 사업화, 멘토링 등 보조 태그를 데이터 모델에 넣을지 결정합니다.

## 나중에 해도 되는 것

- 전체 디자인 리브랜딩
- 추천 정책 개인화
- 지역별 전용 랜딩 페이지 확장
- 관리자 검수 UI
- 공식 API 상태 갱신 자동화 고도화
- 상세 페이지 원문 요약 품질 개선
- Cloudflare Analytics 기반 검색어/이탈률 분석

## 데이터 확장 재개 시점

v1 마감 후 바로 데이터 확장을 재개하기보다는, 최소한 아래 두 가지를 먼저 정리한 뒤 재개하는 것을 추천합니다.

1. 대형 목록/카테고리 HTML 크기 개선 방향 확정
2. update:all needsReview 항목 정리

그 후 확장 우선순위는 다음이 좋아 보입니다.

1. K-Startup needsReview 정리 후 추가 확장
2. Bizinfo 검토 항목 정리 후 추가 확장
3. Bokjiro Central/Local 추가 discovery
4. 검색 랭킹 개선 후 데이터 확장 재개

## 자동화 다음 단계

1. `update:all` 결과에서 blocked source를 별도 review report로 분리
2. source별 needsReview 항목을 사람이 확인하기 쉬운 Markdown/CSV로 출력
3. apply 후보가 300개 이상일 때만 large dry-run 추천
4. apply 후 QA report 생성까지 자동화
5. production deploy 전 check list를 자동으로 생성

## v1 마감 가능 여부

가능합니다.

판단: `v1_ready_with_known_followups`

이유:
- 배포 차단 이슈가 없습니다.
- 5,224개 정책이 production에 반영되어 있고 검색 인덱스도 정상입니다.
- 주요 UX 흐름이 정상입니다.
- 상세 페이지와 카테고리 페이지가 기본적인 신뢰/가독성 기준을 충족합니다.
- 남은 문제는 성능 최적화, 검색 랭킹, 자동화 검수 고도화로 v1 이후 개선 과제에 가깝습니다.

## 최종 추천

오늘은 데이터 추가를 멈추고 v1을 마감하는 것을 추천합니다. 다음 작업은 데이터 확장이 아니라 성능과 검색 품질 개선으로 전환하는 것이 좋습니다.
