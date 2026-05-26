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

export const sharedPolicyTypeTemplate = `export type PolicySummary = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  agencyName: string;
  regionScope: string;
  regions: string[];
  applyType: "online" | "offline" | "mixed" | "check";
  applyStatus: "open" | "closing" | "scheduled" | "always" | "closed";
  applyEndAt?: string | null;
  supportSummary: string;
  officialUrl?: string | null;
  sourceSystem: "gov24" | "bokjiro-central" | "bokjiro-local" | "kstartup" | "youth";
  lifeStages: string[];
  targetGroups: string[];
  lastCheckedAt?: string | null;
};

export type PolicyDetail = PolicySummary & {
  eligibilitySummary: string;
  requiredDocs: string[];
  faq: Array<{ question: string; answer: string }>;
  sourceUrl?: string | null;
};

export type SearchQuery = {
  q?: string;
  category?: string;
  region?: string;
  sourceSystem?: string;
  lifeStage?: string;
  applyStatus?: string;
  applyType?: string;
  page?: number;
  limit?: number;
};`;

export const fastifyApiTemplate = `import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

app.get("/health", async () => ({ ok: true }));

app.get("/policies", async (request) => {
  const q = request.query as {
    q?: string;
    category?: string;
    region?: string;
    sourceSystem?: string;
    lifeStage?: string;
    applyStatus?: string;
    applyType?: string;
    page?: string;
    limit?: string;
  };

  const page = Math.max(parseInt(q.page || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(q.limit || "20", 10), 1), 50);

  const where = {
    isPublished: true,
    ...(q.category ? { category: q.category } : {}),
    ...(q.sourceSystem ? { sourceSystem: q.sourceSystem } : {}),
    ...(q.applyStatus ? { applyStatus: q.applyStatus } : {}),
    ...(q.applyType ? { applyType: q.applyType } : {}),
    ...(q.lifeStage ? { lifeStages: { has: q.lifeStage } } : {}),
    ...(q.region ? { regions: { has: q.region } } : {}),
    ...(q.q
      ? {
          OR: [
            { title: { contains: q.q, mode: "insensitive" as const } },
            { summary: { contains: q.q, mode: "insensitive" as const } },
            { supportSummary: { contains: q.q, mode: "insensitive" as const } },
            { eligibilitySummary: { contains: q.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.policy.findMany({
      where,
      orderBy: [{ applyEndAt: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
      select: {
        slug: true,
        title: true,
        summary: true,
        category: true,
        agencyName: true,
        regionScope: true,
        regions: true,
        applyType: true,
        applyStatus: true,
        applyEndAt: true,
        supportSummary: true,
        officialUrl: true,
        sourceSystem: true,
        lifeStages: true,
        targetGroups: true,
        lastCheckedAt: true,
      },
    }),
    prisma.policy.count({ where }),
  ]);

  return { page, limit, total, items };
});

app.get("/policies/:slug", async (request, reply) => {
  const { slug } = request.params as { slug: string };

  const item = await prisma.policy.findUnique({ where: { slug } });
  if (!item) return reply.code(404).send({ message: "Not found" });

  return {
    slug: item.slug,
    title: item.title,
    summary: item.summary,
    category: item.category,
    agencyName: item.agencyName,
    regionScope: item.regionScope,
    regions: item.regions,
    applyType: item.applyType,
    applyStatus: item.applyStatus,
    applyEndAt: item.applyEndAt?.toISOString() ?? null,
    supportSummary: item.supportSummary,
    eligibilitySummary: item.eligibilitySummary,
    requiredDocs: item.requiredDocs,
    officialUrl: item.officialUrl,
    sourceUrl: item.sourceUrl,
    sourceSystem: item.sourceSystem,
    lifeStages: item.lifeStages,
    targetGroups: item.targetGroups,
    lastCheckedAt: item.lastCheckedAt?.toISOString() ?? null,
    faq: Array.isArray((item.faqJson as any)?.items) ? (item.faqJson as any).items : [],
  };
});

app.post("/corrections", async (request, reply) => {
  const body = request.body as {
    policySlug?: string;
    email: string;
    type: string;
    message: string;
  };

  if (!body.email || !body.type || !body.message) {
    return reply.code(400).send({ message: "Missing required fields" });
  }

  const created = await prisma.policyCorrectionRequest.create({ data: body });
  return reply.code(201).send({ id: created.id, status: created.status });
});

app.listen({ port: Number(process.env.PORT || 4000), host: "0.0.0.0" });`;

export const syncJobTemplate = `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

type RawPolicy = Record<string, unknown>;

type NormalizedPolicy = {
  slug: string;
  title: string;
  summary: string;
  sourceSystem: string;
  sourceExternalId: string;
  sourceUrl?: string | null;
  officialUrl?: string | null;
  agencyName: string;
  category: string;
  lifeStages: string[];
  targetGroups: string[];
  regionScope: string;
  regions: string[];
  applyType: string;
  applyStatus: string;
  applyStartAt?: Date | null;
  applyEndAt?: Date | null;
  supportSummary: string;
  eligibilitySummary: string;
  requiredDocs: string[];
  faqJson?: unknown;
  rawJson: RawPolicy;
  lastCheckedAt?: Date | null;
};

async function fetchGov24(): Promise<NormalizedPolicy[]> {
  // TODO: 공식 serviceList/serviceDetail/supportConditions 어댑터 구현
  return [];
}

async function fetchBokjiroCentral(): Promise<NormalizedPolicy[]> {
  // TODO: NationalWelfarelistV001 + detailed V001 어댑터 구현
  return [];
}

async function fetchBokjiroLocal(): Promise<NormalizedPolicy[]> {
  // TODO: 지자체 복지 목록/상세 어댑터 구현
  return [];
}

async function fetchKStartup(): Promise<NormalizedPolicy[]> {
  // TODO: 창업 공고 + 사업소개 어댑터 구현
  return [];
}

async function fetchYouth(): Promise<NormalizedPolicy[]> {
  // TODO: 청년정책 API 어댑터 구현
  return [];
}

function dedupe(items: NormalizedPolicy[]): NormalizedPolicy[] {
  const map = new Map<string, NormalizedPolicy>();

  for (const item of items) {
    const key = \`\${item.title}::\${item.agencyName}::\${item.category}\`;
    const prev = map.get(key);
    if (!prev) {
      map.set(key, item);
      continue;
    }
    // 우선순위: 공식 URL 존재 > applyEndAt 존재 > 더 긴 eligibilitySummary
    const prevScore =
      Number(Boolean(prev.officialUrl)) +
      Number(Boolean(prev.applyEndAt)) +
      prev.eligibilitySummary.length / 1000;

    const nextScore =
      Number(Boolean(item.officialUrl)) +
      Number(Boolean(item.applyEndAt)) +
      item.eligibilitySummary.length / 1000;

    if (nextScore > prevScore) map.set(key, item);
  }

  return [...map.values()];
}

async function upsert(items: NormalizedPolicy[]) {
  for (const item of items) {
    await prisma.policy.upsert({
      where: {
        sourceSystem_sourceExternalId: {
          sourceSystem: item.sourceSystem,
          sourceExternalId: item.sourceExternalId,
        },
      },
      create: item,
      update: {
        ...item,
        lastSyncedAt: new Date(),
      },
    });
  }
}

async function main() {
  const all = await Promise.all([
    fetchGov24(),
    fetchBokjiroCentral(),
    fetchBokjiroLocal(),
    fetchKStartup(),
    fetchYouth(),
  ]);

  const merged = dedupe(all.flat());
  await upsert(merged);

  console.log(\`Synced \${merged.length} policies\`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });`;

export const webHomeTemplate = `import Link from "next/link";

const quickOptions = {
  audience: ["개인", "가구", "사업자"],
  lifeStage: ["청년", "신혼부부", "임신·출산", "구직자", "소상공인", "어르신"],
  region: ["전국", "서울", "경기", "인천", "부산", "대구", "광주", "대전"],
  applyType: ["온라인 우선", "오프라인 포함"],
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border p-6">
        <p className="text-sm text-neutral-600">공식 출처 우선 · 신청은 공식 기관에서</p>
        <h1 className="mt-2 text-3xl font-bold">내 조건으로 정부지원금을 빠르게 좁혀보세요</h1>
        <p className="mt-3 text-neutral-700">
          GovFind는 지원사업을 정리해 보여주고, 최종 신청은 정부24·복지로·고용24·K-Startup 등
          공식 신청처로 연결합니다.
        </p>

        <form action="/support" className="mt-6 grid gap-4 md:grid-cols-4">
          <select name="audience" className="rounded-lg border p-3">
            {quickOptions.audience.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select name="lifeStage" className="rounded-lg border p-3">
            <option value="">생애주기 선택</option>
            {quickOptions.lifeStage.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select name="region" className="rounded-lg border p-3">
            {quickOptions.region.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select name="applyType" className="rounded-lg border p-3">
            {quickOptions.applyType.map((v) => <option key={v}>{v}</option>)}
          </select>

          <input
            type="text"
            name="q"
            placeholder="근로장려금, 청년월세, 창업지원 등"
            className="rounded-lg border p-3 md:col-span-3"
          />
          <button className="rounded-lg border px-4 py-3 font-medium">조건으로 찾기</button>
        </form>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {["근로장려금", "청년월세", "국민취업지원제도", "소상공인 정책자금", "청년도약계좌"].map((tag) => (
            <Link
              key={tag}
              href={\`/support?q=\${encodeURIComponent(tag)}\`}
              className="rounded-full border px-3 py-1.5"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          ["마감 임박", "지금 신청해야 놓치지 않는 정책 모음"],
          ["온라인 신청 우선", "공식 온라인 접수로 바로 이동 가능한 정책"],
          ["지역별 지원금", "서울·경기·인천 등 지역 조건 기반 모음"],
        ].map(([title, desc]) => (
          <div key={title} className="rounded-2xl border p-5">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-neutral-700">{desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}`;
