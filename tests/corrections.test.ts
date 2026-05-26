import { describe, expect, it } from "vitest";
import { createApp } from "../apps/api/src/app";

describe("correction request API", () => {
  it("rejects invalid correction request", async () => {
    const app = await createApp();
    const res = await app.inject({ method: "POST", url: "/corrections", payload: { email: "bad" } });
    expect(res.statusCode).toBe(400);
    await app.close();
  });

  it("accepts valid correction request with fallback storage", async () => {
    const app = await createApp();
    const res = await app.inject({
      method: "POST",
      url: "/corrections",
      payload: { email: "user@example.com", type: "broken_link", message: "공식 링크가 열리지 않습니다." }
    });
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body).status).toBe("open");
    await app.close();
  });
});
