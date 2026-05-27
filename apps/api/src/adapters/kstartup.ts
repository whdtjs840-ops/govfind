import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const kstartupAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceName: "kstartup",
  sourceSystem: "kstartup",
  async fetchList() {
    return [];
  },
  async fetchDetail(raw) {
    return raw;
  },
  normalize(raw) {
    return { ...gov24Adapter.normalize(raw), sourceSystem: "kstartup", category: String(raw.category ?? "창업·소상공인") };
  }
};
