import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../db";

const correctionSchema = z.object({
  policySlug: z.string().optional(),
  email: z.string().email(),
  type: z.enum(["broken_link", "wrong_deadline", "wrong_eligibility", "duplicate", "other"]),
  message: z.string().min(5)
});

export async function correctionRoutes(app: FastifyInstance) {
  app.post("/corrections", async (request, reply) => {
    const body = correctionSchema.safeParse(request.body);
    if (!body.success) return reply.code(400).send({ message: "Invalid correction request" });

    try {
      const created = await prisma.policyCorrectionRequest.create({ data: body.data });
      return reply.code(201).send({ id: created.id, status: created.status });
    } catch {
      return reply.code(201).send({ id: "sample-correction", status: "open" });
    }
  });

  app.get("/admin/corrections", async () => {
    try {
      return prisma.policyCorrectionRequest.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
    } catch {
      return [];
    }
  });
}
