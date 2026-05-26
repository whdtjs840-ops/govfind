import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const bokjiroCentralAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceSystem: "bokjiro-central",
  normalize(raw) {
    return { ...gov24Adapter.normalize(raw), sourceSystem: "bokjiro-central", category: String(raw.category ?? "복지") };
  }
};
