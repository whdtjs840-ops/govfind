import type { FastifyInstance } from "fastify";
import { samplePolicies } from "@govfind/shared";
import { requireAdmin } from "../security";

export async function adminRoutes(app: FastifyInstance) {
  app.addHook("preHandler", requireAdmin);

  app.get("/admin/issues", async () => {
    const stale = samplePolicies
      .filter((policy) => !policy.lastCheckedAt)
      .map((policy) => ({
        policySlug: policy.slug,
        type: "stale_policy",
        severity: "medium",
        message: "마지막 확인일이 없어 공식 출처 재확인이 필요합니다."
      }));

    return {
      brokenLinks: [],
      stalePolicies: stale,
      correctionRequests: []
    };
  });
}
