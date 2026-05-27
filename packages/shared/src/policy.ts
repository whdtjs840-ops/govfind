export type SourceSystem =
  | "gov24"
  | "gov24-public-service-benefits"
  | "bokjiro-central"
  | "bokjiro-local"
  | "bizinfo"
  | "kstartup"
  | "youth";
export type ApplyType = "online" | "offline" | "mixed" | "check";
export type ApplyStatus = "open" | "closing" | "scheduled" | "always" | "closed" | "check";

export type PolicySummary = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  agencyName: string;
  regionScope: "nationwide" | "sido" | "sigungu" | "mixed";
  regions: string[];
  applyType: ApplyType;
  applyStatus: ApplyStatus;
  applyStartAt?: string | null;
  applyEndAt?: string | null;
  supportSummary: string;
  officialUrl?: string | null;
  sourceUrl?: string | null;
  sourceSystem: SourceSystem;
  lifeStages: string[];
  targetGroups: string[];
  requiredDocs: string[];
  lastCheckedAt?: string | null;
};

export type PolicyDetail = PolicySummary & {
  eligibilitySummary: string;
  contentSummary: string;
  applyMethodSummary: string;
  faq: Array<{ question: string; answer: string }>;
  rawExcerpt?: string | null;
  relatedSourceUrls?: Array<{ label: string; url: string }>;
};

export type SearchQuery = {
  q?: string;
  category?: string;
  region?: string;
  sourceSystem?: SourceSystem | "";
  lifeStage?: string;
  target?: string;
  applyStatus?: ApplyStatus | "";
  applyType?: ApplyType | "";
  page?: number;
  limit?: number;
};

export type PolicyCorrectionInput = {
  policySlug?: string;
  email: string;
  type: "broken_link" | "wrong_deadline" | "wrong_eligibility" | "duplicate" | "other";
  message: string;
};
