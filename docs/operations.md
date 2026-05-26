# GovFind 운영, 배포, 보안, 성능 기준

## 배포 분리

- 프론트엔드: CDN 앞단의 Next.js 배포 대상으로 운영한다.
- API 서버: Fastify 서비스를 별도 런타임으로 운영한다.
- 수집 워커: `apps/api/src/jobs/sync.ts`를 별도 스케줄러에서 실행한다.
- DB/Search: PostgreSQL과 Meilisearch는 프론트 배포와 분리한다.

## 데이터 운영

- 전체 동기화: 하루 1회.
- 증분 갱신: 시간 단위로 가능한 소스부터 적용.
- 링크 체크: 공식 신청처 URL을 주기적으로 확인하고 `lastCheckedAt`을 갱신한다.
- 백업: PostgreSQL 일별 백업, 주간 복구 리허설.
- 검색 인덱스: Meilisearch 스냅샷 또는 DB 기반 재생성 절차를 유지한다.

## 보안 기본값

- 관리자 API는 `x-admin-token` 기반 보호를 기본값으로 둔다. 운영에서는 SSO/RBAC로 교체한다.
- 공개 쓰기 API는 rate limit과 Origin 검사를 적용한다.
- 보안 헤더는 HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP를 기본 적용한다.
- API 키는 `.env` 또는 플랫폼 시크릿 저장소에서만 관리하고 저장소에 커밋하지 않는다.
- 정책 수정, 제보 생성, 관리자 작업은 `AuditLog`에 남긴다.

## 성능 목표

- LCP: 2.5초 이하
- INP: 200ms 이하
- CLS: 0.1 이하

홈, 목록, 상세는 Server Components와 revalidate를 우선 사용한다. 검색은 공공 API 실시간 호출이 아니라 내부 DB/검색 인덱스 기준으로 처리한다.

## 접근성 목표

- WCAG 2.2 AA를 목표로 한다.
- 키보드 포커스 표시, 폼 레이블, FAQ/details 접근성, 충분한 색 대비를 기본값으로 둔다.
- 모바일 하단 CTA는 본문 내용을 가리지 않도록 하단 여백을 함께 둔다.

## SEO 운영

- 정책 상세: FAQPage, BreadcrumbList JSON-LD.
- 목록/홈: ItemList JSON-LD.
- sitemap, robots, canonical, Open Graph를 유지한다.
- Search Console에서 색인, sitemap, Core Web Vitals, 리치 결과 오류를 점검한다.
