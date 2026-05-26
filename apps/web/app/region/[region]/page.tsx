import { PolicyCard } from "../../../components/PolicyCard";
import { getPolicies } from "../../../lib/policies";

export default async function RegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params;
  const decoded = decodeURIComponent(region);
  const result = await getPolicies({ region: decoded });
  return (
    <main className="section">
      <div className="container">
        <h1>{decoded} 지원 정책</h1>
        <p className="lead">지역 조건을 기준으로 좁혀본 결과입니다. 최종 접수 가능 여부는 공식 기관에서 확인하세요.</p>
        <div className="policy-grid">{result.items.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}</div>
      </div>
    </main>
  );
}
