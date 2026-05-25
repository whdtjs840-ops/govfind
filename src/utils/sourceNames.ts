export function sourceLabel(source: string) {
  if (source.includes("정부24")) return "정부24";
  if (source.includes("복지로")) return "복지로";
  if (source.includes("K-Startup")) return "K-Startup";
  return source.replace(/\s*API\b/g, "").replace("공공서비스", "").trim();
}

export function sourceMatches(source: string, filter: string) {
  if (!filter) return true;
  return source === filter || sourceLabel(source) === filter;
}

export const publicSourceOptions = [
  { label: "정부24", value: "정부24" },
  { label: "복지로", value: "복지로" },
  { label: "K-Startup", value: "K-Startup" }
];
