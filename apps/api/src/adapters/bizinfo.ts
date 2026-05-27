import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const bizinfoAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceName: "bizinfo",
  sourceSystem: "bizinfo",
  async fetchList() {
    return [];
  },
  async fetchDetail(raw) {
    return raw;
  },
  normalize(raw) {
    return {
      ...gov24Adapter.normalize(raw),
      sourceSystem: "bizinfo",
      category: String(raw.category ?? "소상공인")
    };
  }
};
