import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { policyRoutes } from "./routes/policies";
import { correctionRoutes } from "./routes/corrections";
import { adminRoutes } from "./routes/admin";
import { csrfOriginGuard } from "./security";

export async function createApp() {
  const app = Fastify({ logger: true });
  await app.register(helmet, {
    global: true,
    contentSecurityPolicy: false
  });
  await app.register(rateLimit, {
    max: Number(process.env.GOVFIND_RATE_LIMIT_MAX ?? 120),
    timeWindow: process.env.GOVFIND_RATE_LIMIT_WINDOW ?? "1 minute"
  });
  await app.register(cors, {
    origin: process.env.GOVFIND_CORS_ORIGIN ?? true,
    credentials: false
  });
  await app.register(formbody);
  app.addHook("preHandler", csrfOriginGuard);
  app.get("/health", async () => ({ ok: true }));
  await app.register(policyRoutes);
  await app.register(correctionRoutes);
  await app.register(adminRoutes);
  return app;
}
