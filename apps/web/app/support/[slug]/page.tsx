import Script from "next/script";
import { notFound } from "next/navigation";
import { getPolicy } from "../../../lib/policies";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = await getPolicy(slug);
  if (!policy) return {};
  return {
    title: policy.title,
    description: policy.summary,
    alternates: { canonical: `/support/${policy.slug}` },
    openGraph: { title: policy.title, description: policy.summary }
  };
}

export default async function PolicyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = await getPolicy(slug);
  if (!policy) notFound();

  const faqJsonLd = policy.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: policy.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: process.env.SITE_URL ?? "http://localhost:3000" },
      { "@type": "ListItem", position: 2, name: "지원금 검색", item: `${process.env.SITE_URL ?? "http://localhost:3000"}/support` },
      { "@type": "ListItem", position: 3, name: policy.title, item: `${process.env.SITE_URL ?? "http://localhost:3000"}/support/${policy.slug}` }
    ]
  };

  return (
    <main>
      <section className="section">
        <div className="container">
          <p className="eyebrow">{policy.category} · {policy.agencyName}</p>
          <h1>{policy.title}</h1>
          <p className="lead">{policy.summary}</p>
          <div className="notice">최종 자격 및 신청은 공식 기관에서 확인하세요. GovFind는 받을 수 있다고 단정하지 않습니다.</div>
          {policy.officialUrl && <p><a className="button" href={policy.officialUrl} target="_blank" rel="noopener noreferrer">공식 신청처 보기</a></p>}
        </div>
      </section>
      <nav className="detail-nav" aria-label="상세 목차">
        <div className="container">
          {["요약", "지원대상", "지원내용", "신청방법", "필요서류", "FAQ", "공식확인"].map((item) => <a href={`#${item}`} key={item}>{item}</a>)}
        </div>
      </nav>
      <section className="section">
        <div className="container grid grid-2">
          <div className="card" id="요약">
            <h2>신청 전 빠른 확인</h2>
            <p><strong>대상</strong><br />{policy.eligibilitySummary}</p>
            <p><strong>지역</strong><br />{policy.regions.join(", ")}</p>
            <p><strong>신청기간</strong><br />{policy.applyEndAt ? `${policy.applyEndAt}까지` : "공식 신청처 확인 필요"}</p>
            <p><strong>신청방식</strong><br />{policy.applyMethodSummary}</p>
            <p><strong>마지막 확인일</strong><br />{policy.lastCheckedAt ?? "확인 예정"}</p>
          </div>
          <div className="card" id="공식확인">
            <h2>공식 확인</h2>
            <p>정책 조건, 금액, 소득 기준, 재산 기준은 공식 공고에서 바뀔 수 있습니다.</p>
            {policy.officialUrl && <a className="button" href={policy.officialUrl} target="_blank" rel="noopener noreferrer">공식 신청처 보기</a>}
            <p><a href={`/report?policySlug=${policy.slug}`}>오류 제보하기</a></p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container grid grid-2">
          <div className="card" id="지원대상"><h2>지원 대상</h2><p>{policy.eligibilitySummary}</p></div>
          <div className="card" id="지원내용"><h2>지원 내용</h2><p>{policy.contentSummary}</p></div>
          <div className="card" id="신청방법"><h2>신청 방법</h2><p>{policy.applyMethodSummary}</p></div>
          <div className="card" id="필요서류"><h2>준비 서류</h2><ul>{policy.requiredDocs.map((doc) => <li key={doc}>{doc}</li>)}</ul></div>
        </div>
      </section>
      {!!policy.faq.length && (
        <section className="section" id="FAQ">
          <div className="container card">
            <h2>자주 묻는 질문</h2>
            {policy.faq.map((item) => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}
          </div>
        </section>
      )}
      {policy.officialUrl && <div className="sticky-cta"><a className="button" style={{ width: "100%" }} href={policy.officialUrl} target="_blank" rel="noopener noreferrer">공식 신청처 보기</a></div>}
      <Script id="faq-jsonld" type="application/ld+json">{JSON.stringify(faqJsonLd)}</Script>
      <Script id="breadcrumb-jsonld" type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</Script>
    </main>
  );
}
