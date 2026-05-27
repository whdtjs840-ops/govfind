import type { PolicyDetail, SourceSystem } from "@govfind/shared";

export type RawPolicy = Record<string, unknown>;

export type NormalizedPolicy = PolicyDetail & {
  sourceExternalId: string;
  rawJson: RawPolicy;
  canonicalKey?: string;
};

export type SourceAdapter = {
  sourceName: SourceSystem;
  sourceSystem: SourceSystem;
  fetchList(options?: SourceFetchOptions): Promise<RawPolicy[]>;
  fetchDetail(raw: RawPolicy): Promise<RawPolicy>;
  normalize(raw: RawPolicy): NormalizedPolicy;
};

export type SourceFetchOptions = {
  page?: number;
  perPage?: number;
};
