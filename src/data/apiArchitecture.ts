export const apiSources = [
  {
    name: "행정안전부 대한민국 공공서비스(혜택) 정보",
    key: "gov24",
    provider: "gov24",
    quota: "개발계정 10,000건",
    role: "중앙부처·지자체·공공기관 혜택의 넓은 모수 확보",
    advantage: "전국 범위, JSON/XML, 무료, 이용허락 제한 없음",
    caution: "구형 오퍼레이션은 폐기됐으므로 예전 list/details 예제를 사용하지 않음",
    strategy: "정기 수집 후 raw_json과 normalized_policy로 분리 저장",
    sample: {
      provider: "gov24",
      serviceId: "svc-001",
      title: "청년 월세 지원",
      agency: "국토교통부",
      scope: "전국",
      officialUrl: "https://www.gov.kr/...",
      summary: "월세 부담 완화를 위한 공식 지원사업"
    }
  },
  {
    name: "한국사회보장정보원 중앙부처복지서비스",
    key: "bokjiro-central",
    provider: "bokjiro-central",
    quota: "개발계정 100건",
    role: "복지 상세의 지원대상·선정기준·신청방법 강화",
    advantage: "복지로 기반 상세 정보가 풍부하고 온라인신청가능여부 같은 활용 항목이 있음",
    caution: "XML 중심이고 개발계정 트래픽이 낮아 사용자 요청마다 호출하면 안 됨",
    strategy: "반드시 캐시형 정기 수집으로 운영",
    sample: {
      provider: "bokjiro-central",
      serviceId: "wel-001",
      title: "기초연금",
      target: "어르신",
      selectionCriteria: "소득인정액 기준",
      applyMethod: "온라인/방문"
    }
  },
  {
    name: "한국사회보장정보원 지자체복지서비스",
    key: "bokjiro-local",
    provider: "bokjiro-local",
    quota: "개발계정 1,000건",
    role: "시도·시군구 단위 정밀 매칭",
    advantage: "지자체 복지서비스 목록과 상세를 공식적으로 확보 가능",
    caution: "XML 중심, 코드표 관리와 지역 코드 정규화가 필수",
    strategy: "지역 랜딩 확장 단계에서 정기 수집",
    sample: {
      provider: "bokjiro-local",
      serviceId: "lg-001",
      title: "지자체 출산지원금",
      sido: "서울",
      sigungu: "강남구",
      target: "출산가구",
      applyMethod: "구청/복지로 확인"
    }
  },
  {
    name: "창업진흥원 K-Startup 조회서비스",
    key: "kstartup",
    provider: "kstartup",
    quota: "개발계정 10,000건",
    role: "창업 공고, 사업소개, 신청 가이드 확장",
    advantage: "창업 공고·지원대상·모집기간·신청방법·문의처가 명시됨",
    caution: "예전 K-Startup 공고 API 대신 신규 국가중점데이터 API 기준으로 확인",
    strategy: "모집기간과 신청처를 정규화",
    sample: {
      provider: "kstartup",
      announcementId: "ks-001",
      title: "창업지원 패키지",
      target: "예비창업자",
      period: "2026-06-01~2026-06-30",
      applyMethod: "온라인 접수"
    }
  },
  {
    name: "한국고용정보원 온통청년 청년정책 API",
    key: "youth",
    provider: "youth",
    quota: "무료 / 기관 정책 따름",
    role: "청년 정책 보강과 청년 전용 랜딩 페이지 생성",
    advantage: "정책키워드·정책설명·법정시군구코드·주관기관을 활용 가능",
    caution: "청년 범주에 한정되며 기관 정책에 따라 트래픽 기준이 달라질 수 있음",
    strategy: "청년 랜딩과 조건검색 정확도 개선 단계에서 추가",
    sample: {
      provider: "youth",
      policyId: "y-001",
      title: "청년도약계좌",
      regionCode: "11",
      keywords: ["청년", "금융"],
      agency: "금융위원회"
    }
  },
  {
    name: "행정안전부 도로명주소 API",
    key: "juso",
    provider: "juso",
    quota: "무료 / 고정 한도 미공개, 과도 호출 제한 가능",
    role: "주소 입력 보정, 시도·시군구 매핑, 운영자 주소 검증",
    advantage: "무료 사용 가능하고 주소·우편번호·행정코드 매핑에 유용",
    caution: "상세주소 입력 UI는 별도 구현이 필요하고 과도 호출은 제한될 수 있음",
    strategy: "사용자가 주소를 입력할 때만 보조 호출",
    sample: {
      roadAddr: "서울특별시 ...",
      jibunAddr: "...",
      zipNo: "12345",
      admCd: "11680"
    }
  }
];

export const architectureLayers = [
  {
    title: "공공 원천",
    items: ["정부24 혜택", "복지로 중앙부처", "복지로 지자체", "K-Startup", "온통청년", "도로명주소"]
  },
  {
    title: "수집·정규화",
    items: ["스케줄러", "소스별 어댑터", "표준 스키마", "중복 제거", "링크 검증", "마감 판정"]
  },
  {
    title: "내부 저장",
    items: ["현재: 빌드 시 생성 데이터", "현재: 정적 검색 인덱스", "확장: PostgreSQL", "확장: Meilisearch"]
  },
  {
    title: "서비스",
    items: ["Astro 프론트", "비로그인 조건검색", "상세 비교", "공식 신청처 이동", "향후 운영자 대시보드"]
  }
];

export const implementationSteps = [
  "원천 API는 수집 스크립트에서만 호출한다.",
  "원본 응답은 raw_json에 그대로 보관한다.",
  "수집 결과는 GovFind 표준 정책 스키마로 변환한다.",
  "중복 정책, 마감 표시, 공식 링크를 검수한다.",
  "사용자 화면은 내부 데이터와 검색 인덱스만 조회한다.",
  "트래픽이 커지면 PostgreSQL과 Meilisearch로 저장·검색 계층을 분리한다."
];

export const normalizedStorageFields = [
  { name: "raw_policy", description: "원천 API 응답 전체를 raw_json으로 저장해 추후 재가공과 검수에 사용" },
  { name: "normalized_policy", description: "제목, 대상, 지역, 신청기간, 공식 URL, 필요서류처럼 화면과 검색에 쓰는 표준 필드" },
  { name: "source_adapter_version", description: "원천 API 개편에 대응하기 위한 어댑터 버전과 마지막 수집 기준" },
  { name: "policy_relation", description: "중복·유사 정책을 대표 정책과 관련 공식 원문으로 묶는 관계 정보" }
];

export const deferredIntegrations = [
  {
    name: "공공 마이데이터",
    reason: "인증과 정보 전송 동의가 필요하므로 비로그인 정보 포털 MVP 범위를 넘어섬",
    stage: "P2 고도화"
  },
  {
    name: "워크넷/고용24 채용 API",
    reason: "저작권 표시, 비영리, 변경금지 조건 해석 이슈가 있어 광고 기반 서비스와 분리 검토 필요",
    stage: "라이선스 검토 후 별도 영역"
  }
];

export const recommendedStack = [
  {
    name: "Next.js App Router",
    role: "검색 유입형 웹 프론트",
    reason: "파일 시스템 라우팅, Server Components, Suspense, 라우트 기준 코드 스플리팅이 콘텐츠형 검색 사이트에 적합"
  },
  {
    name: "Fastify",
    role: "BFF/API 서버",
    reason: "낮은 오버헤드와 플러그인 구조로 수집·검색·정정요청 API를 가볍게 운영하기 좋음"
  },
  {
    name: "PostgreSQL + Prisma",
    role: "원천·정규화 데이터 저장",
    reason: "raw_json과 normalized_policy를 함께 보관하고 타입 안전한 DB 접근과 마이그레이션을 제공"
  },
  {
    name: "Meilisearch",
    role: "검색 인덱스",
    reason: "search-as-you-type, facet, filtering, sorting을 내장해 조건검색과 목록 UX에 유리"
  }
];

export const monorepoBlueprint = [
  "govfind/",
  "  apps/",
  "    web/",
  "      app/",
  "        page.tsx",
  "        support/page.tsx",
  "        support/[slug]/page.tsx",
  "        layout.tsx",
  "      components/quick-finder.tsx",
  "      components/policy-card.tsx",
  "      lib/api.ts",
  "    api/",
  "      src/server.ts",
  "      src/routes/policies.ts",
  "      src/jobs/sync.ts",
  "      src/adapters/gov24.ts",
  "      src/adapters/bokjiro-central.ts",
  "      src/adapters/bokjiro-local.ts",
  "      src/adapters/kstartup.ts",
  "      src/adapters/youth.ts",
  "  packages/",
  "    shared/src/policy.ts",
  "    db/prisma/schema.prisma",
  "  docker-compose.yml",
  "  .env.example",
  "  pnpm-workspace.yaml",
  "  package.json"
];

export const prismaSchemaTemplate = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Policy {
  id                 String   @id @default(cuid())
  slug               String   @unique
  title              String
  summary            String
  sourceSystem       String
  sourceExternalId   String
  sourceUrl          String?
  officialUrl        String?
  agencyName         String
  category           String
  lifeStages         String[]
  targetGroups       String[]
  regionScope        String
  regions            String[]
  applyType          String
  applyStatus        String
  applyStartAt       DateTime?
  applyEndAt         DateTime?
  supportSummary     String
  eligibilitySummary String
  requiredDocs       String[]
  faqJson            Json?
  rawJson            Json
  isPublished        Boolean  @default(true)
  lastCheckedAt      DateTime?
  lastSyncedAt       DateTime @default(now())
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([sourceSystem, sourceExternalId])
  @@index([category])
  @@index([applyStatus])
  @@index([agencyName])
}

model PolicyCorrectionRequest {
  id         String   @id @default(cuid())
  policySlug String?
  email      String
  type       String
  message    String
  status     String   @default("open")
  createdAt  DateTime @default(now())
}`;
