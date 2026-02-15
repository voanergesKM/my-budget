import { StatsValue } from "@/app/lib/types/vehicle";

export function formatStatsValue(value: StatsValue): string {
  if (value === null || value === undefined) return "—";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toFixed(2);
  return String(value);
}
