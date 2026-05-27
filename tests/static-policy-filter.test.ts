import { describe, expect, it } from "vitest";
import type { Policy } from "../src/data/policies";
import {
  deadlineDisplay,
  filterPolicies,
  getDisplayRegion,
  getDisplayStatus,
  getPolicyCounts,
  getPublicPolicies,
  shouldIncludeInDeadlineSort,
  shouldIncludeInRegionPage,
  shouldIncludeInStatusFilter,
  shouldRequireOfficialConfirmation,
  shouldShowDday,
  sortPolicies
} from "../src/utils/policyUtils";

function policy(overrides: Partial<Policy>): Policy {
  return {
    slug: "base-policy",
    title: "기본 지원금",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "공식 확인 필요",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "전체",
    targetGroup: "일반",
    income: "공식 확인 필요",
    applyOnline: true,
    tags: ["복지"],
    summary: "공식 출처 기준 지원 정책입니다.",
    audience: "공식 신청처 확인 필요",
    benefits: ["지원 내용 확인"],
    documents: ["신분증"],
    apply: "공식 신청처에서 신청",
    officialUrl: "https://example.com/apply",
    officialSourceUrl: "https://example.com/source",
    contact: "공식 기관 문의",
    views: 10,
    updatedAt: "2026.05.26",
    matchReasons: ["공식 출처 기준"],
    faq: [{ q: "어디서 신청하나요?", a: "공식 신청처에서 확인합니다." }],
    ...overrides
  };
}

describe("static policy filters", () => {
  const items = [
    policy({
      slug: "youth-rent",
      title: "청년 월세 지원",
      category: "주거",
      source: "정부24",
      agency: "국토교통부",
      region: "전국",
      targetGroup: "청년",
      tags: ["청년", "월세", "주거"],
      summary: "청년 월세 부담을 줄이는 지원입니다.",
      dday: "D-3",
      status: "마감임박"
    }),
    policy({
      slug: "small-business-fund",
      title: "소상공인 정책자금",
      category: "소상공인",
      source: "K-Startup",
      agency: "소상공인시장진흥공단",
      region: "서울",
      targetGroup: "소상공인",
      tags: ["소상공인", "정책자금"],
      summary: "사업자 대상 정책자금 신청 안내입니다.",
      applyOnline: false,
      status: "모집중",
      dday: "D-30"
    })
  ];

  it("matches q only when every query token is present", () => {
    expect(filterPolicies(items, { q: "청년 월세" }).map((item) => item.slug)).toEqual(["youth-rent"]);
    expect(filterPolicies(items, { q: "청년 정책자금" })).toHaveLength(0);
  });

  it("filters category, source, region, status, and online consistently", () => {
    expect(filterPolicies(items, { category: "주거" }).map((item) => item.slug)).toEqual(["youth-rent"]);
    expect(filterPolicies(items, { source: "정부24" }).map((item) => item.slug)).toEqual(["youth-rent"]);
    expect(filterPolicies(items, { region: "서울" }).map((item) => item.slug)).toEqual(["youth-rent", "small-business-fund"]);
    expect(filterPolicies(items, { status: "마감임박" }).map((item) => item.slug)).toEqual(["youth-rent"]);
    expect(filterPolicies(items, { online: true }).map((item) => item.slug)).toEqual(["youth-rent"]);
  });

  it("sorts deadline results by nearest dday", () => {
    const sorted = sortPolicies([...items, policy({ slug: "today", title: "오늘 마감", dday: "D-Day", status: "마감임박" })], "deadline");
    expect(sorted[0]?.slug).toBe("today");
  });

  it("uses one public count basis after dedupe/search-only filtering", () => {
    const publicItems = getPublicPolicies(items);
    const counts = getPolicyCounts(items);
    expect(counts.all).toBe(publicItems.length);
  });

  it("guards unknown Gov24 warning fields from D-day and status filters", () => {
    const warningPolicy = policy({
      slug: "gov24-warning",
      title: "공식 확인 필요 정책",
      status: "확인필요",
      statusLabel: "공식 공고 확인",
      statusConfidence: "unknown",
      dateConfidence: "unknown",
      applicationPeriodLabel: "공식 공고 확인",
      dday: "확인필요",
      deadline: "공식 공고 확인",
      region: null,
      regionLabel: "공식 공고 확인",
      requiresOfficialConfirmation: true,
      publishPolicy: {
        canPublish: true,
        includeInSearch: true,
        includeInAllList: true,
        includeInCategoryPage: true,
        includeInRegionPage: false,
        includeInStatusFilters: false,
        includeInDeadlineSort: false,
        showDday: false,
        requiresOfficialConfirmation: true
      }
    });

    expect(getDisplayStatus(warningPolicy)).toBe("공식 공고 확인");
    expect(deadlineDisplay(warningPolicy)).toBe("공식 공고 확인");
    expect(getDisplayRegion(warningPolicy)).toBe("공식 공고 확인");
    expect(shouldShowDday(warningPolicy)).toBe(false);
    expect(shouldIncludeInDeadlineSort(warningPolicy)).toBe(false);
    expect(shouldIncludeInStatusFilter(warningPolicy, "모집중")).toBe(false);
    expect(shouldIncludeInStatusFilter(warningPolicy, "마감임박")).toBe(false);
    expect(shouldIncludeInRegionPage(warningPolicy)).toBe(false);
    expect(shouldRequireOfficialConfirmation(warningPolicy)).toBe(true);
  });

  it("keeps unknown date policies at the end of deadline sorting", () => {
    const unknownDate = policy({
      slug: "unknown-date",
      status: "확인필요",
      statusConfidence: "unknown",
      dateConfidence: "unknown",
      dday: "확인필요",
      publishPolicy: {
        canPublish: true,
        includeInSearch: true,
        includeInAllList: true,
        includeInCategoryPage: true,
        includeInRegionPage: true,
        includeInStatusFilters: false,
        includeInDeadlineSort: false,
        showDday: false,
        requiresOfficialConfirmation: true
      }
    });
    const sorted = sortPolicies([unknownDate, policy({ slug: "near", dday: "D-2", status: "마감임박" })], "deadline");
    expect(sorted.at(-1)?.slug).toBe("unknown-date");
  });
});
