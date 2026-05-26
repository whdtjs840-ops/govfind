import Script from "next/script";
import { QuickFinder } from "../components/QuickFinder";
import { PolicyCard } from "../components/PolicyCard";
import { getClosingSoon, getCounts, getPolicies } from "../lib/policies";

export default async function HomePage() {
  const counts = await getCounts();
  const latest = await getPolicies({ limit: 4 });
  const closing = await getClosingSoon();
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: latest.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: `${process.env.SITE_URL ?? "http://localhost:3000"}/support/${item.slug}`
    }))
  };

  return (
    <main>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">공식 출처 우선 · 비로그인 조건 탐색</p>
          <h1>내 조건으로 정부지원금을 빠르게 좁혀보세요</h1>
          <p className="lead">정부24·복지로·K-Startup 등 공식 출처 기준으로 지원 대상, 신청 기간, 필요 서류, 공식 신청처를 정리했습니다. 최종 자격 및 신청은 공식 기관에서 확인하세요.</p>
          <QuickFinder />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="quick-cards">
            {["정부지원금", "복지서비스", "청년정책", "창업지원", "소상공인 정책자금", "지역별 지원"].map((title) => (
              <a className="card" href={`/support?q=${encodeURIComponent(title)}`} key={title}>
                <h3>{title}</h3>
                <p className="muted">공식 신청처 기준으로 관련 정책을 확인합니다.</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>공식 확인된 핵심 정책 {counts.total}개</h2>
              <p className="muted">카테고리와 결과 화면은 같은 기준으로 계산됩니다.</p>
            </div>
            <a className="button secondary" href="/support">전체 보기</a>
          </div>
          <div className="policy-grid">
            {latest.items.map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head"><h2>마감임박</h2><a href="/deadline">더보기</a></div>
          <div className="policy-grid">
            {closing.slice(0, 4).map((policy) => <PolicyCard key={policy.slug} policy={policy} />)}
          </div>
        </div>
      </section>
      <Script id="home-itemlist-jsonld" type="application/ld+json">{JSON.stringify(itemListJsonLd)}</Script>
    </main>
  );
}
