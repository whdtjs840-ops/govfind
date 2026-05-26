import type { SourceAdapter } from "./types";

export const gov24Adapter: SourceAdapter = {
  sourceSystem: "gov24",
  async fetchList() {
    // TODO: serviceList 기반 정기 수집. 런타임 사용자 요청에서 직접 호출하지 않는다.
    return [];
  },
  async fetchDetail(raw) {
    // TODO: serviceDetail/supportConditions 상세 수집.
    return raw;
  },
  normalize(raw) {
    const title = String(raw.title ?? "정부24 혜택");
    return {
      slug: String(raw.slug ?? title.toLowerCase().replace(/\s+/g, "-")),
      sourceExternalId: String(raw.serviceId ?? raw.id ?? title),
      title,
      summary: String(raw.summary ?? "공식 출처 기준으로 확인이 필요한 정책입니다."),
      category: String(raw.category ?? "복지"),
      agencyName: String(raw.agency ?? "공식 기관"),
      regionScope: "nationwide",
      regions: ["전국"],
      applyType: "check",
      applyStatus: "check",
      supportSummary: String(raw.supportSummary ?? "공식 신청처 확인 필요"),
      eligibilitySummary: String(raw.eligibilitySummary ?? "공식 신청처 확인 필요"),
      contentSummary: String(raw.contentSummary ?? "공식 신청처 확인 필요"),
      applyMethodSummary: String(raw.applyMethodSummary ?? "공식 신청처 확인 필요"),
      officialUrl: typeof raw.officialUrl === "string" ? raw.officialUrl : null,
      sourceUrl: typeof raw.sourceUrl === "string" ? raw.sourceUrl : null,
      sourceSystem: "gov24",
      lifeStages: [],
      targetGroups: [],
      requiredDocs: [],
      faq: [],
      rawJson: raw
    };
  }
};
