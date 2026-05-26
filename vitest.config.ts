import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node"
  },
  resolve: {
    alias: {
      "@govfind/shared": resolve("packages/shared/src/index.ts")
    }
  }
});
