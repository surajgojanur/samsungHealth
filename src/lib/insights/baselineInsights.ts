import { buildBaselineMetrics } from "@/lib/analytics/baseline";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { formatNumber, makeInsight } from "./insightText";

export function generateBaselineInsights(input: InsightEngineInput): HealthInsight[] {
  const metrics = buildBaselineMetrics(input.data, input.symptoms ?? []);
  return Object.entries(metrics)
    .filter(([, baseline]) => baseline.points.length >= 7 && baseline.average !== undefined && baseline.median !== undefined)
    .slice(0, 5)
    .map(([metric, baseline]) =>
      makeInsight({
        id: `baseline-${metric}`,
        category: "overview",
        title: `${metric.replace(/[A-Z]/g, " $&").toLowerCase()} baseline`,
        summary: `Average ${metric} was ${formatNumber(baseline.average ?? 0, 1)} and median was ${formatNumber(baseline.median ?? 0, 1)}.`,
        plainLanguage: "This baseline is calculated from your uploaded data only.",
        whyItMatters: "Personal baselines help HealthLens flag days that are unusual compared with your own pattern.",
        supportingMetric: `avg ${formatNumber(baseline.average ?? 0, 1)} / median ${formatNumber(baseline.median ?? 0, 1)}`,
        confidence: baseline.points.length >= 21 ? "high" : "medium",
        tone: "neutral",
        dateRange: input.dateRange,
        sourceMetrics: [metric],
        priorityScore: 38
      })
    );
}

