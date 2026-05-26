import { getPolicy, getPolicies } from "../../lib/policies";
import type { PolicyDetail } from "@govfind/shared";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ items?: string }> }) {
  const params = await searchParams;
  const slugs = (params.items ?? "").split(",").filter(Boolean).slice(0, 4);
  const selected = (await Promise.all(slugs.map(getPolicy))).filter((item): item is PolicyDetail => Boolean(item));
  const fallback = await getPolicies({ limit: 4 });
  const items = selected.length ? selected : fallback.items;

  return (
    <main className="section">
      <div className="container">
        <h1>정책 비교함</h1>
        <p className="lead">2~4개 정책의 대상, 기간, 신청방식, 공식 신청처를 나란히 확인합니다. 최종 자격 및 신청은 공식 기관에서 확인하세요.</p>
        <table className="compare-table">
          <tbody>
            <tr><th>항목</th>{items.map((item) => <th key={item.slug}>{item.title}</th>)}</tr>
            <tr><th>대상</th>{items.map((item) => <td key={item.slug}>{item.eligibilitySummary}</td>)}</tr>
            <tr><th>지원내용</th>{items.map((item) => <td key={item.slug}>{item.supportSummary}</td>)}</tr>
            <tr><th>신청기간</th>{items.map((item) => <td key={item.slug}>{item.applyEndAt ?? "공식처 확인"}</td>)}</tr>
            <tr><th>신청방식</th>{items.map((item) => <td key={item.slug}>{item.applyMethodSummary}</td>)}</tr>
            <tr><th>공식 신청처</th>{items.map((item) => <td key={item.slug}>{item.officialUrl ? <a href={item.officialUrl} target="_blank" rel="noopener noreferrer">공식 링크</a> : "확인 필요"}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
