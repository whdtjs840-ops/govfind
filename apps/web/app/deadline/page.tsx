import { PolicyCard } from "../../components/PolicyCard";
import { getClosingSoon } from "../../lib/policies";

export default async function DeadlinePage() {
  const items = await getClosingSoon();
  return (
    <main className="section">
      <div className="container">
        <h1>마감임박 지원금</h1>
        <p className="lead">D-0부터 D-14까지, 마감일 숫자가 확인되는 정책만 기본 노출합니다.</p>
        <div className="policy-grid">{items.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}</div>
      </div>
    </main>
  );
}
