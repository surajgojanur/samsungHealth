import type { HealthInsight, InsightCategory, InsightConfidence, InsightTone } from "./insightTypes";
import { sanitizeGeneratedHealthText } from "@/lib/safety/medicalClaimGuard";

export function formatNumber(value: number, digits = 0): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

export function formatPercent(value: number, digits = 0): string {
  return `${formatNumber(value, digits)}%`;
}

export function categoryLabel(category: InsightCategory): string {
  return category
    .split("_")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function confidenceFromSamples(samples: number, high = 21, medium = 7): InsightConfidence {
  if (samples >= high) return "high";
  if (samples >= medium) return "medium";
  return "low";
}

export function limitedDataLimitations(metric: string, count: number, target: number): string[] {
  return count >= target ? [] : [`Only ${count} ${metric} records were available. More records would make this pattern easier to trust.`];
}

export function makeInsight(input: Omit<HealthInsight, "priorityScore"> & { priorityScore?: number }): HealthInsight {
  const insight: HealthInsight = {
    ...input,
    summary: sanitizeGeneratedHealthText(input.summary),
    plainLanguage: sanitizeGeneratedHealthText(input.plainLanguage),
    whyItMatters: sanitizeGeneratedHealthText(input.whyItMatters),
    suggestedUserAction: input.suggestedUserAction ? sanitizeGeneratedHealthText(input.suggestedUserAction) : undefined,
    doctorDiscussion: input.doctorDiscussion ? sanitizeGeneratedHealthText(input.doctorDiscussion) : undefined,
    priorityScore: input.priorityScore ?? 50
  };
  return insight;
}

export function tonePriority(tone: InsightTone): number {
  if (tone === "attention") return 20;
  if (tone === "positive") return 10;
  if (tone === "limited_data") return 6;
  return 0;
}

