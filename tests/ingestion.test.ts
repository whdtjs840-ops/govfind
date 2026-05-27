import { describe, expect, it } from "vitest";
import { normalizeGov24PublicService } from "../apps/api/src/adapters/gov24";
import type { SourceAdapter } from "../apps/api/src/adapters/types";
import { canonicalKey, payloadHash, runSourceSync } from "../apps/api/src/jobs/sync-core";

const gov24Record = {
  "서비스ID": "SVC-001",
  "서비스명": "청년 월세 지원",
  "서비스목적요약": "청년의 주거비 부담을 줄이기 위한 월세 지원",
  "지원대상": "무주택 청년",
  "지원내용": "월세 일부를 지원합니다.",
  "소관기관명": "국토교통부",
  "신청기한": "2026.05.01 ~ 2026.06.30",
  "신청방법": "온라인 신청",
  "온라인신청사이트URL": "https://www.gov.kr/apply",
  "상세조회URL": "https://www.gov.kr/detail",
  "구비서류": "신분증\n임대차계약서"
};

describe("public service ingestion", () => {
  it("normalizes Gov24 fields into GovFind policy fields", () => {
    const policy = normalizeGov24PublicService(gov24Record);

    expect(policy.sourceSystem).toBe("gov24-public-service-benefits");
    expect(policy.sourceExternalId).toBe("SVC-001");
    expect(policy.title).toBe("청년 월세 지원");
    expect(policy.category).toBe("주거");
    expect(policy.agencyName).toBe("국토교통부");
    expect(policy.regions).toEqual(["전국"]);
    expect(policy.targetGroups).toContain("청년");
    expect(policy.applyType).toBe("online");
    expect(policy.applyStatus).toBe("open");
    expect(policy.applyStartAt).toBe("2026-05-01");
    expect(policy.applyEndAt).toBe("2026-06-30");
    expect(policy.requiredDocs).toEqual(["신분증", "임대차계약서"]);
  });

  it("maps local regions and always-open status", () => {
    const policy = normalizeGov24PublicService({
      ...gov24Record,
      "서비스ID": "SVC-002",
      "서비스명": "서울 창업 지원",
      "서비스목적요약": "서울 소재 창업기업 지원",
      "소관기관명": "서울특별시",
      "신청기한": "상시 신청"
    });

    expect(policy.category).toBe("창업");
    expect(policy.regionScope).toBe("sido");
    expect(policy.regions).toEqual(["서울"]);
    expect(policy.applyStatus).toBe("always");
  });

  it("creates stable hashes independent of object key order", () => {
    expect(payloadHash({ b: 2, a: 1 })).toBe(payloadHash({ a: 1, b: 2 }));
  });

  it("uses title, organization, and period for canonical duplicate keys", () => {
    const first = normalizeGov24PublicService(gov24Record);
    const second = normalizeGov24PublicService({ ...gov24Record, "서비스ID": "SVC-OTHER" });

    expect(canonicalKey(first)).toBe(canonicalKey(second));
  });

  it("supports dry-run without database writes", async () => {
    const adapter: SourceAdapter = {
      sourceName: "gov24-public-service-benefits",
      sourceSystem: "gov24-public-service-benefits",
      async fetchList() {
        return [gov24Record, { ...gov24Record, "서비스ID": "SVC-003" }];
      },
      async fetchDetail(raw) {
        return raw;
      },
      normalize: normalizeGov24PublicService
    };

    const summary = await runSourceSync(adapter, { dryRun: true });

    expect(summary.fetchedCount).toBe(2);
    expect(summary.insertedCount).toBe(0);
    expect(summary.updatedCount).toBe(0);
    expect(summary.skippedDuplicateCount).toBe(1);
    expect(summary.failedCount).toBe(0);
  });
});
