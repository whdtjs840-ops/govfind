import Fastify from "fastify";
import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import { policyRoutes } from "./routes/policies";
import { correctionRoutes } from "./routes/corrections";
import { adminRoutes } from "./routes/admin";

export async function createApp() {
  const app = Fastify({ logger: true });
  await app.register(cors, { origin: true });
  await app.register(formbody);
  app.get("/health", async () => ({ ok: true }));
  await app.register(policyRoutes);
  await app.register(correctionRoutes);
  await app.register(adminRoutes);
  return app;
}
