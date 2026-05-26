export default async function ReportPage({ searchParams }: { searchParams: Promise<{ policySlug?: string }> }) {
  const params = await searchParams;
  return (
    <main className="section">
      <div className="container card">
        <h1>오류 제보</h1>
        <p className="lead">깨진 링크, 마감일 오류, 중복 정책, 지원 대상 설명 오류를 알려주세요.</p>
        <form action={`${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"}/corrections`} method="post" className="grid">
          <input type="hidden" name="policySlug" value={params.policySlug ?? ""} />
          <label className="field">이메일
            <input className="input" type="email" name="email" required placeholder="reply@example.com" />
          </label>
          <label className="field">제보 유형
            <select className="select" name="type" required>
              <option value="broken_link">공식 링크 오류</option>
              <option value="wrong_deadline">마감일 오류</option>
              <option value="wrong_eligibility">지원 대상 오류</option>
              <option value="duplicate">중복 정책</option>
              <option value="other">기타</option>
            </select>
          </label>
          <label className="field">내용
            <textarea className="textarea" name="message" required rows={6} placeholder="확인이 필요한 내용을 적어주세요." />
          </label>
          <button className="button" type="submit">제보 제출</button>
        </form>
      </div>
    </main>
  );
}
