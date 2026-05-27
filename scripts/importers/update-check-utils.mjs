import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { sourceLabel } from "../../src/utils/sourceNames.ts";

export function argValue(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1];
  return fallback;
}

export function hasFlag(name) {
  return process.argv.slice(2).includes(`--${name}`);
}

export async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function listJsonFiles(directory, suffix = ".json") {
  const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => resolve(directory, entry.name))
    .sort();
}

export function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

export function normalizeUrl(value = "") {
  if (!value) return "";
  try {
    const url = new URL(value);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return String(value).trim().replace(/\/$/, "").toLowerCase();
  }
}

export function classificationOf(item) {
  const value = item.classification ?? item.status;
  if (value === "duplicate_candidate") return "duplicate";
  if (value === "needs_manual_review") return "needsReview";
  return value;
}

export function titleAgencyKey(title = "", agency = "") {
  return `${normalizeText(title)}::${normalizeText(agency)}`;
}

export function buildCurrentPolicyIndex(publicPolicies) {
  const bySlug = new Map();
  const byOfficialUrl = new Map();
  const byTitleAgency = new Map();
  const bySourceItemId = new Map();

  for (const policy of publicPolicies) {
    if (policy.slug) bySlug.set(policy.slug, policy);
    for (const url of [policy.officialUrl, policy.officialSourceUrl].filter(Boolean)) {
      const normalizedUrl = normalizeUrl(url);
      if (normalizedUrl) byOfficialUrl.set(normalizedUrl, policy);

      const gov24Match = String(url).match(/dtlEx\/([^/?#]+)/);
      if (gov24Match?.[1]) bySourceItemId.set(`gov24-public-service-benefits::${gov24Match[1]}`, policy);

      const bokjiroMatch = String(url).match(/wlfareInfoId=([^&]+)/);
      if (bokjiroMatch?.[1]) bySourceItemId.set(`bokjiro-central::${bokjiroMatch[1]}`, policy);
    }
    byTitleAgency.set(titleAgencyKey(policy.title, policy.agency), policy);
  }

  return { bySlug, byOfficialUrl, byTitleAgency, bySourceItemId };
}

export function sourceCount(publicPolicies, label) {
  return publicPolicies.filter((policy) => sourceLabel(policy.source) === label || policy.source === label || policy.source.includes(label)).length;
}

export function summarizeStagingItem(item) {
  const normalized = item.normalized ?? {};
  return {
    sourceItemId: normalized.sourceItemId ?? null,
    title: normalized.title ?? null,
    slug: normalized.slug ?? null,
    category: normalized.category ?? null,
    organizationName: normalized.organizationName ?? null,
    status: normalized.status ?? null,
    statusLabel: normalized.statusLabel ?? normalized.status ?? null,
    statusConfidence: normalized.statusConfidence ?? null,
    dateConfidence: normalized.dateConfidence ?? null,
    applicationPeriodLabel: normalized.applicationPeriodLabel ?? null,
    region: normalized.region ?? null,
    regionLabel: normalized.regionLabel ?? null,
    classification: classificationOf(item),
    warnings: item.warnings ?? normalized.warnings ?? [],
    mappingGaps: item.mappingGaps ?? [],
    publishPolicy: item.publishPolicy ?? null,
    officialUrl: normalized.officialUrl ?? null,
    applicationUrl: normalized.applicationUrl ?? null,
    sourceArtifact: item.sourceArtifact ?? null
  };
}

export function existingConflictReasons(item, currentIndex) {
  const normalized = item.normalized ?? {};
  const reasons = [];
  const sourceKey = `${normalized.sourceName}::${normalized.sourceItemId}`;
  const url = normalizeUrl(normalized.officialUrl || normalized.applicationUrl);
  const key = titleAgencyKey(normalized.title, normalized.organizationName);

  if (sourceKey !== "::" && currentIndex.bySourceItemId.has(sourceKey)) {
    reasons.push({ type: "sourceName+sourceItemId", matched: currentIndex.bySourceItemId.get(sourceKey) });
  }
  if (normalized.slug && currentIndex.bySlug.has(normalized.slug)) {
    reasons.push({ type: "slug", matched: currentIndex.bySlug.get(normalized.slug) });
  }
  if (url && currentIndex.byOfficialUrl.has(url)) {
    reasons.push({ type: "officialUrl", matched: currentIndex.byOfficialUrl.get(url) });
  }
  if (key !== "::" && currentIndex.byTitleAgency.has(key)) {
    reasons.push({ type: "title+organization", matched: currentIndex.byTitleAgency.get(key) });
  }

  return reasons;
}

export function summarizeConflictReasons(reasons = []) {
  return reasons.map((reason) => ({
    type: reason.type ?? reason.rule ?? String(reason),
    matchedSlug: reason.matched?.slug ?? reason.matchedSlug ?? null,
    matchedTitle: reason.matched?.title ?? reason.matchedTitle ?? null,
    strength: reason.strength ?? null
  }));
}

export function hasStrongDuplicate(item) {
  return (item.duplicateCandidates ?? []).some((candidate) => candidate.strength === "high");
}

export function hasRequiredCandidateFields(item) {
  const normalized = item.normalized ?? {};
  return Boolean(
    normalized.title &&
      normalized.slug &&
      normalized.sourceName &&
      normalized.sourceItemId &&
      normalized.organizationName &&
      (normalized.officialUrl || normalized.applicationUrl) &&
      (normalized.summary || normalized.description)
  );
}

export function hasCategoryMappingGap(item) {
  const category = item.normalized?.category;
  return (
    !category ||
    category === "기타" ||
    category === "湲고?" ||
    (item.mappingGaps ?? []).includes("category") ||
    (item.reviewReasons ?? []).some((reason) => /unknown source category|category mapped|category mapping gap/i.test(reason)) ||
    (item.reasons ?? []).some((reason) => /unknown source category|category mapped|mapping gap: category|category mapping gap/i.test(reason))
  );
}

export function buildUpdateCheckReport({
  sourceName,
  mode,
  currentPolicyCount,
  currentSourcePolicyCount,
  newCandidates = [],
  updateCandidates = [],
  expiredCandidates = [],
  duplicateCandidates = [],
  needsReview = [],
  safeToApply = [],
  blockedItems = [],
  sourceErrors = [],
  quotaErrors = [],
  metadata = {}
}) {
  let recommendedAction = "no_action";
  if (sourceErrors.length || quotaErrors.length) recommendedAction = "stop_and_review";
  else if (safeToApply.length) recommendedAction = "ready_for_apply_dry_run";
  else if (needsReview.length || blockedItems.length) recommendedAction = "needs_review";
  else if (mode === "cache-only") recommendedAction = "fetch_required";

  return {
    runAt: new Date().toISOString(),
    sourceName,
    mode,
    currentPolicyCount,
    currentSourcePolicyCount,
    newCandidates,
    updateCandidates,
    expiredCandidates,
    duplicateCandidates,
    needsReview,
    safeToApply,
    blockedItems,
    sourceErrors,
    quotaErrors,
    summary: {
      newCandidateCount: newCandidates.length,
      updateCandidateCount: updateCandidates.length,
      expiredCandidateCount: expiredCandidates.length,
      duplicateCandidateCount: duplicateCandidates.length,
      needsReviewCount: needsReview.length,
      safeToApplyCount: safeToApply.length,
      blockedItemCount: blockedItems.length
    },
    recommendedAction,
    metadata
  };
}

export function printUpdateCheckReport(report, reportPath) {
  console.log(`${report.sourceName} update check`);
  console.log(`report path: ${reportPath}`);
  console.log(`mode: ${report.mode}`);
  console.log(`currentPolicyCount: ${report.currentPolicyCount}`);
  console.log(`currentSourcePolicyCount: ${report.currentSourcePolicyCount}`);
  console.log(`newCandidateCount: ${report.summary.newCandidateCount}`);
  console.log(`updateCandidateCount: ${report.summary.updateCandidateCount}`);
  console.log(`expiredCandidateCount: ${report.summary.expiredCandidateCount}`);
  console.log(`duplicateCandidateCount: ${report.summary.duplicateCandidateCount}`);
  console.log(`needsReviewCount: ${report.summary.needsReviewCount}`);
  console.log(`safeToApplyCount: ${report.summary.safeToApplyCount}`);
  console.log(`blockedItemCount: ${report.summary.blockedItemCount}`);
  console.log(`recommendedAction: ${report.recommendedAction}`);
}
