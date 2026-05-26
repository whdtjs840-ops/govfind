import { PolicyCard } from "../../components/PolicyCard";
import { getPolicies } from "../../lib/policies";

export default async function OnlinePage() {
  const result = await getPolicies({ applyType: "online" as any });
  return (
    <main className="section">
      <div className="container">
        <h1>온라인 신청 가능 정책</h1>
        <p className="lead">공식 온라인 신청처가 확인되는 정책을 우선 보여줍니다.</p>
        <div className="policy-grid">{result.items.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}</div>
      </div>
    </main>
  );
}
