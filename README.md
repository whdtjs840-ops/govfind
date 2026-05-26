# GovFind 리빌드

GovFind는 한국 정부지원금, 복지, 청년, 창업, 소상공인 정책을 공식 출처 기준으로 비교·검색하는 서비스입니다. 핵심 원칙은 “공식 출처 우선, 익명 퀵파인더, 비교 가능한 상세 페이지, 공식 신청처 연결”입니다.

## 포함 범위

- Next.js App Router 웹 앱: `apps/web`
- Fastify API: `apps/api`
- PostgreSQL + Prisma 스키마/seed: `packages/db`
- 공통 타입, 샘플 데이터, 검색/필터 로직: `packages/shared`
- Meilisearch 인덱싱 인터페이스
- 공공 API 정기 수집 워커 스켈레톤
- 관리자 대시보드, 오류 제보 API, 비교함, 마감임박/온라인/지역 랜딩
- 운영·보안·성능 기준 문서: `docs/operations.md`
- 실행 로드맵과 우선순위 체크리스트: `docs/roadmap.md`

커뮤니티, 포인트, 리워드, 익명 라운지, 자극적 머니 피드, 마이데이터 실제 연계는 초기 범위에서 제외합니다.

## 로컬 실행

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

API는 별도 터미널에서 실행합니다.

```bash
npm run dev:api
```

- 웹: `http://localhost:3000`
- API: `http://localhost:4000`
- Meilisearch: `http://localhost:7700`

## 주요 명령

```bash
npm run build
npm test
npm run db:seed
npm run sync --workspace @govfind/api
```

## 운영 원칙

- “받을 수 있다”처럼 확정 표현을 사용하지 않습니다.
- 홈, 결과, 상세에서 “최종 자격 및 신청은 공식 기관에서 확인” 문구를 반복 노출합니다.
- 외부 공식 신청처 링크는 `target="_blank"`와 `rel="noopener noreferrer"`를 사용합니다.
- 공공 API는 사용자 요청 시 실시간 호출하지 않고 `apps/api/src/jobs/sync.ts`로 정기 수집합니다.
- 홈 총 건수, 결과 총 건수, 카테고리 카운트는 공통 검색 기준으로 계산합니다.

## API 수집 구조

수집 워커는 아래 adapter interface를 따릅니다.

```ts
type SourceAdapter = {
  sourceSystem: SourceSystem;
  fetchList(): Promise<RawPolicy[]>;
  fetchDetail(raw: RawPolicy): Promise<RawPolicy>;
  normalize(raw: RawPolicy): NormalizedPolicy;
};
```

현재 스켈레톤:

- `gov24`
- `bokjiro-central`
- `bokjiro-local`
- `kstartup`
- `youth`

API 키는 `.env.example`의 `GOVFIND_*_API_KEY` 항목에 맞춰 설정합니다.
