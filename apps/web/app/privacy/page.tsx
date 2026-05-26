export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="container card">
        <h1>개인정보처리방침</h1>
        <p>GovFind는 회원가입 없이 정책 정보를 제공합니다. 오류 제보 시 답변을 위해 이메일, 제보 유형, 제보 내용을 수집할 수 있습니다.</p>
        <p>수집한 정보는 제보 처리와 서비스 품질 개선 목적으로만 사용하며, 처리 완료 후 운영상 필요한 보관 기간이 지나면 삭제합니다.</p>
        <p>광고와 분석 도구를 사용하는 경우 쿠키가 활용될 수 있으며, 적용 범위는 운영자가 실제 도입한 도구 기준으로 고지합니다.</p>
        <p>문의: {process.env.GOVFIND_OPERATOR_EMAIL ?? "contact@govfind.kr"}</p>
      </div>
    </main>
  );
}
