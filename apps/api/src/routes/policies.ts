import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { samplePolicies, searchPolicies } from "@govfind/shared";
import { prisma } from "../db";

const querySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  region: z.string().optional(),
  sourceSystem: z.string().optional(),
  lifeStage: z.string().optional(),
  target: z.string().optional(),
  applyStatus: z.string().optional(),
  applyType: z.string().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional()
});

async function loadPolicies() {
  try {
    const rows = await prisma.policy.findMany({ where: { isPublished: true }, orderBy: { updatedAt: "desc" } });
    if (!rows.length) return samplePolicies;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      category: row.category,
      agencyName: row.agencyName,
      regionScope: row.regionScope as any,
      regions: row.regions,
      applyType: row.applyType as any,
      applyStatus: row.applyStatus as any,
      applyStartAt: row.applyStartAt?.toISOString() ?? null,
      applyEndAt: row.applyEndAt?.toISOString() ?? null,
      supportSummary: row.supportSummary,
      eligibilitySummary: row.eligibilitySummary,
      contentSummary: row.contentSummary,
      applyMethodSummary: row.applyMethodSummary,
      officialUrl: row.officialUrl,
      sourceUrl: row.sourceUrl,
      sourceSystem: row.sourceSystem as any,
      lifeStages: row.lifeStages,
      targetGroups: row.targetGroups,
      requiredDocs: row.requiredDocs,
      lastCheckedAt: row.lastCheckedAt?.toISOString() ?? null,
      faq: Array.isArray((row.faqJson as any)?.items) ? (row.faqJson as any).items : []
    }));
  } catch {
    return samplePolicies;
  }
}

export async function policyRoutes(app: FastifyInstance) {
  app.get("/policies", async (request) => {
    const query = querySchema.parse(request.query);
    const policies = await loadPolicies();
    return searchPolicies(policies, query as any);
  });

  app.get("/policies/:slug", async (request, reply) => {
    const { slug } = request.params as { slug: string };
    const policies = await loadPolicies();
    const policy = policies.find((item) => item.slug === slug);
    if (!policy) return reply.code(404).send({ message: "Not found" });
    return policy;
  });
}
