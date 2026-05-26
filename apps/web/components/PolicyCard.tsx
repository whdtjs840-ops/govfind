import type { PolicySummary } from "@govfind/shared";

export function PolicyCard({ policy, compare = true }: { policy: PolicySummary; compare?: boolean }) {
  return (
    <article className="card policy-card">
      <div>
        <div className="badge-row">
          <span className="badge">{policy.category}</span>
          <span className="badge">{policy.applyType === "online" ? "온라인 가능" : "공식처 확인"}</span>
          <span className="badge">{policy.regions.slice(0, 2).join(", ")}</span>
        </div>
        <h3><a href={`/support/${policy.slug}`}>{policy.title}</a></h3>
        <p className="muted">{policy.summary}</p>
      </div>
      <div>
        <p className="meta"><span>{policy.agencyName}</span><span>마지막 확인: {policy.lastCheckedAt ?? "확인 예정"}</span></p>
        {compare && <a className="button secondary" href={`/compare?items=${policy.slug}`}>비교함에 담기</a>}
      </div>
    </article>
  );
}
