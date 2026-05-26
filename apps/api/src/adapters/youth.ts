import { gov24Adapter } from "./gov24";
import type { SourceAdapter } from "./types";

export const youthAdapter: SourceAdapter = {
  ...gov24Adapter,
  sourceSystem: "youth",
  normalize(raw) {
    return {
      ...gov24Adapter.normalize(raw),
      sourceSystem: "youth",
      category: String(raw.category ?? "청년"),
      lifeStages: ["청년"],
      targetGroups: ["청년"]
    };
  }
};
