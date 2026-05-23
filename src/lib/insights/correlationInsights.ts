import { calculateHealthCorrelations } from "@/lib/analytics/correlations";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { makeInsight } from "./insightText";

export function generateCorrelationInsights(input: InsightEngineInput): HealthInsight[] {
  return calculateHealthCorrelations(input.data, input.symptoms ?? [])
    .filter((result) => result.direction !== "insufficient")
    .slice(0, 6)
    .map((result) =>
      makeInsight({
        id: `correlation-${result.id}`,
        category: result.metricX.includes("symptom") || result.metricY.includes("symptom") ? "symptom" : "overview",
        title: "Relationship check",
        summary: result.plainLanguage,
        plainLanguage: "This is a same-day relationship in your uploaded data and does not show cause.",
        whyItMatters: "Relationship checks can reveal patterns that are easy to miss when viewing one chart at a time.",
        supportingMetric: result.coefficient === undefined ? `n=${result.sampleSize}` : `r=${result.coefficient.toFixed(2)}, n=${result.sampleSize}`,
        confidence: result.confidence,
        tone: result.direction === "none" ? "neutral" : "attention",
        dateRange: input.dateRange,
        sourceMetrics: [result.metricX, result.metricY],
        limitations: result.limitation ? [result.limitation] : undefined,
        relatedCharts: ["correlation"],
        priorityScore: result.direction === "none" ? 36 : 64
      })
    );
}

