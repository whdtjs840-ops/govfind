import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { Gov24ApiError } from "../scripts/importers/gov24-benefits-adapter.mjs";
import { buildDiscoveryErrorReport } from "../scripts/importers/gov24-discovery-report.mjs";
import { fetchGov24RawPayload, parsePagesOption, redactRequestParams } from "../scripts/importers/gov24-discovery-runner.mjs";
import { buildStagingReport } from "../scripts/importers/staging-artifacts.mjs";
import { buildPublishPolicy, classifyStagingItem } from "../scripts/importers/staging-validation.mjs";

describe("Gov24 discovery safety", () => {
  it("parses explicit page sampling", () => {
    expect(parsePagesOption("1,10,30,60,90")).toEqual([1, 10, 30, 60, 90]);
  });

  it("redacts API keys in params", () => {
    const redacted = redactRequestParams({
      page: 1,
      serviceKey: "secret",
      apiKey: "also-secret"
    });

    expect(redacted.serviceKey).toBe("[REDACTED]");
    expect(redacted.apiKey).toBe("[REDACTED]");
    expect(JSON.stringify(redacted)).not.toContain("secret");
  });

  it("builds quota errors as error reports instead of success reports", () => {
    const error = new Gov24ApiError({
      status: 400,
      code: -10,
      kind: "quota_exceeded",
      message: "Gov24 request failed 400: 트래픽 허용 횟수를 초과하였습니다."
    });

    const report = buildDiscoveryErrorReport({
      error,
      params: {
        requestParams: { startPage: 1, limit: 100, serviceKey: "secret" }
      },
      outDir: "data/staging/gov24"
    });

    expect(report.status).toBe("error");
    expect(report.errorKind).toBe("quota_exceeded");
    expect(report.normalizedCount).toBe(0);
    expect(report.errorReportFilePath).toContain("errors");
    expect(JSON.stringify(report)).not.toContain("secret");
  });

  it("keeps bucket invariant for staging reports", () => {
    const report = buildStagingReport({
      sourceName: "gov24-public-service-benefits",
      items: [
        { classification: "ready", mappingGaps: [], duplicateCandidates: [], validationIssues: [], normalized: {} },
        { classification: "publishable_with_warning", mappingGaps: ["startDate", "endDate"], duplicateCandidates: [], validationIssues: [], normalized: {} },
        { classification: "duplicate", mappingGaps: [], duplicateCandidates: [{ strength: "high" }], validationIssues: [], normalized: {} }
      ]
    });

    expect(report.normalizedCount).toBe(3);
    expect(report.publishableWithWarningCount).toBe(1);
    expect(report.publishableTotalCount).toBe(2);
    expect(report.classifiedTotal).toBe(3);
    expect(report.invariantPassed).toBe(true);
  });

  it("separates publishable warnings from category review blockers", () => {
    expect(
      classifyStagingItem({
        normalized: { title: "sample" },
        mappingGaps: ["startDate", "endDate", "status"],
        reviewReasons: ["status requires official confirmation"],
        duplicateCandidates: [],
        validationIssues: []
      })
    ).toBe("publishable_with_warning");

    expect(
      classifyStagingItem({
        normalized: { title: "sample" },
        mappingGaps: ["category", "startDate"],
        reviewReasons: ["category mapped to 기타"],
        duplicateCandidates: [],
        validationIssues: []
      })
    ).toBe("needsReview");
  });

  it("builds conservative publish policies for warning-only items", () => {
    const policy = buildPublishPolicy({
      classification: "publishable_with_warning",
      normalized: {
        category: "복지",
        region: "서울",
        startDate: null,
        endDate: null,
        status: "확인필요"
      },
      mappingGaps: ["startDate", "endDate", "status"]
    });

    expect(policy.canPublish).toBe(true);
    expect(policy.includeInSearch).toBe(true);
    expect(policy.includeInAllList).toBe(true);
    expect(policy.includeInStatusFilters).toBe(false);
    expect(policy.includeInDeadlineSort).toBe(false);
    expect(policy.showDday).toBe(false);
    expect(policy.requiresOfficialConfirmation).toBe(true);
  });

  it("uses cached pages without calling the API", async () => {
    const cacheDir = await mkdtemp(join(tmpdir(), "gov24-cache-"));
    await writeFile(
      join(cacheDir, "serviceList-page-7-limit-2.json"),
      JSON.stringify({
        meta: { page: 7, limit: 2, rawCount: 1, totalCount: 10955, currentCount: 1 },
        items: [{ listItem: { id: "cached" }, detail: {}, page: 7, indexOnPage: 0 }]
      }),
      "utf8"
    );

    const raw = await fetchGov24RawPayload({
      pages: [7],
      limit: 2,
      useCache: true,
      cacheDir
    });

    expect(raw.items).toHaveLength(1);
    expect(raw.meta.cacheHits).toBe(1);
    expect(raw.meta.apiCallsMade).toBe(0);
    expect(raw.meta.pages[0].cacheHit).toBe(true);
  });
});
