import type { FastifyReply, FastifyRequest } from "fastify";

const unsafeMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export function isAdminRequest(request: FastifyRequest) {
  const configuredToken = process.env.GOVFIND_ADMIN_TOKEN;
  if (!configuredToken) return false;
  return request.headers["x-admin-token"] === configuredToken;
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  if (isAdminRequest(request)) return;
  return reply.code(401).send({ message: "Admin authorization required" });
}

export async function csrfOriginGuard(request: FastifyRequest, reply: FastifyReply) {
  if (!unsafeMethods.has(request.method)) return;
  const origin = request.headers.origin;
  const allowedOrigin = process.env.GOVFIND_CORS_ORIGIN;
  if (!origin || !allowedOrigin || origin === allowedOrigin) return;
  return reply.code(403).send({ message: "Invalid request origin" });
}

export function getClientMeta(request: FastifyRequest) {
  return {
    ipAddress: request.ip,
    userAgent: request.headers["user-agent"] ?? null
  };
}
