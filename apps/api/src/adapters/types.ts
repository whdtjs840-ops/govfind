import type { PolicyDetail, SourceSystem } from "@govfind/shared";

export type RawPolicy = Record<string, unknown>;

export type NormalizedPolicy = PolicyDetail & {
  sourceExternalId: string;
  rawJson: RawPolicy;
  canonicalKey?: string;
};

export type SourceAdapter = {
  sourceSystem: SourceSystem;
  fetchList(): Promise<RawPolicy[]>;
  fetchDetail(raw: RawPolicy): Promise<RawPolicy>;
  normalize(raw: RawPolicy): NormalizedPolicy;
};
