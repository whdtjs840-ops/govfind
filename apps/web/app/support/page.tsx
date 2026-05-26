import type { Metadata } from "next";
import { QuickFinder } from "../../components/QuickFinder";
import { PolicyCard } from "../../components/PolicyCard";
import { getPolicies } from "../../lib/policies";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "지원금 검색",
  alternates: { canonical: "/support" },
  openGraph: { title: "지원금 검색 - GovFind" }
};

export default async function SupportPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const result = await getPolicies({
    q: params.q,
    category: params.category,
    region: params.region,
    sourceSystem: params.sourceSystem as any,
    lifeStage: params.lifeStage,
    target: params.target,
    applyStatus: params.applyStatus as any,
    applyType: params.applyType as any,
    page: params.page ? Number(params.page) : 1,
    limit: 20
  });

  return (
    <main>
      <section className="section">
        <div className="container">
          <h1>지원금 검색</h1>
          <p className="lead">검색과 필터는 공식 출처 기준으로 정리된 정책 안에서 작동합니다. 최종 자격 및 신청은 공식 기관에서 확인하세요.</p>
          <QuickFinder />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{params.q ? `"${params.q}" 검색 결과 ` : "전체 결과 "}{result.total}개</h2>
          </div>
          {result.total === 0 ? (
            <div className="card">
              <h3>검색 결과 없음</h3>
              <p className="muted">근로장려금, 청년월세, 건강보험 환급금, 소상공인 정책자금 같은 키워드로 다시 검색해보세요.</p>
            </div>
          ) : (
            <div className="policy-grid">
              {result.items.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
