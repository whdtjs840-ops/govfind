import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("security defaults", () => {
  it("protects admin routes", async () => {
    const previous = process.env.GOVFIND_ADMIN_TOKEN;
    process.env.GOVFIND_ADMIN_TOKEN = "test-admin-token";
    const app = await createApp();

    const blocked = await app.inject({ method: "GET", url: "/admin/issues" });
    expect(blocked.statusCode).toBe(401);

    const allowed = await app.inject({
      method: "GET",
      url: "/admin/issues",
      headers: { "x-admin-token": "test-admin-token" }
    });
    expect(allowed.statusCode).toBe(200);

    await app.close();
    process.env.GOVFIND_ADMIN_TOKEN = previous;
  });

  it("rejects unsafe cross-origin writes", async () => {
    const previous = process.env.GOVFIND_CORS_ORIGIN;
    process.env.GOVFIND_CORS_ORIGIN = "https://govfind.kr";
    const app = await createApp();

    const res = await app.inject({
      method: "POST",
      url: "/corrections",
      headers: { origin: "https://evil.example" },
      payload: { email: "user@example.com", type: "broken_link", message: "공식 링크가 열리지 않습니다." }
    });
    expect(res.statusCode).toBe(403);

    await app.close();
    process.env.GOVFIND_CORS_ORIGIN = previous;
  });
});
