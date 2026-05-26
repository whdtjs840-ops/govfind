import { describe, expect, it } from "vitest";
import { samplePolicies, searchPolicies, getCanonicalCounts, getClosingSoonPolicies } from "@govfind/shared";

describe("policy search", () => {
  it("ranks earned income tax credit first for action-style query", () => {
    const result = searchPolicies(samplePolicies, { q: "\uADFC\uB85C\uC7A5\uB824\uAE08 \uC2E0\uCCAD\uBC29\uBC95" });
    expect(result.total).toBeGreaterThan(0);
    expect(result.items[0]?.title).toContain("\uADFC\uB85C");
  });

  it("filters youth rent query to directly related policies", () => {
    const result = searchPolicies(samplePolicies, { q: "\uCCAD\uB144\uC6D4\uC138 \uC9C0\uC6D0 \uB300\uC0C1" });
    expect(result.items[0]?.slug).toBe("youth-rent-support");
  });

  it("uses one canonical count basis", () => {
    const counts = getCanonicalCounts(samplePolicies);
    const result = searchPolicies(samplePolicies, {});
    expect(counts.total).toBe(result.total);
  });

  it("only returns D-0 to D-14 closing soon items", () => {
    const items = getClosingSoonPolicies(samplePolicies, new Date("2026-05-26"));
    expect(items.every((item) => item.dday >= 0 && item.dday <= 14)).toBe(true);
    expect(items.every((item) => item.applyStatus !== "always" && item.applyStatus !== "scheduled")).toBe(true);
  });
});
