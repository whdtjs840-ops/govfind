import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const bokjiroLocalAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceSystem: "bokjiro-local",
  normalize(raw) {
    return { ...gov24Adapter.normalize(raw), sourceSystem: "bokjiro-local", regionScope: "sigungu" };
  }
};
