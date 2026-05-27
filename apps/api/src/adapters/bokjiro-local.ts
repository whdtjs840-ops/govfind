import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const bokjiroLocalAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceName: "bokjiro-local",
  sourceSystem: "bokjiro-local",
  async fetchList() {
    return [];
  },
  async fetchDetail(raw) {
    return raw;
  },
  normalize(raw) {
    return { ...gov24Adapter.normalize(raw), sourceSystem: "bokjiro-local", regionScope: "sigungu" };
  }
};
