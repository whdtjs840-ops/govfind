export default async function AdminPage() {
  const issues = {
    brokenLinks: [],
    stalePolicies: [{ policySlug: "sample", type: "stale_policy", message: "공식 출처 재확인 필요" }],
    correctionRequests: []
  };

  return (
    <main className="section">
      <div className="container">
        <h1>관리자 대시보드</h1>
        <p className="lead">broken link, stale policy, correction request를 확인하는 운영자 화면입니다.</p>
        <div className="grid grid-3">
          <div className="card"><h2>Broken link</h2><p>{issues.brokenLinks.length}건</p></div>
          <div className="card"><h2>Stale policy</h2><p>{issues.stalePolicies.length}건</p></div>
          <div className="card"><h2>Correction request</h2><p>{issues.correctionRequests.length}건</p></div>
        </div>
      </div>
    </main>
  );
}
