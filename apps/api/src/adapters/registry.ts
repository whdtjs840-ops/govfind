import { bizinfoAdapter } from "./bizinfo";
import { bokjiroCentralAdapter } from "./bokjiro-central";
import { bokjiroLocalAdapter } from "./bokjiro-local";
import { gov24PublicServiceBenefitsAdapter } from "./gov24";
import { kstartupAdapter } from "./kstartup";
import type { SourceAdapter } from "./types";

export const sourceAdapters = {
  "gov24-public-service-benefits": gov24PublicServiceBenefitsAdapter,
  "bokjiro-central": bokjiroCentralAdapter,
  "bokjiro-local": bokjiroLocalAdapter,
  bizinfo: bizinfoAdapter,
  kstartup: kstartupAdapter
} satisfies Record<string, SourceAdapter>;

export type SourceAdapterName = keyof typeof sourceAdapters;

export function getSourceAdapter(name: string) {
  return sourceAdapters[name as SourceAdapterName];
}
