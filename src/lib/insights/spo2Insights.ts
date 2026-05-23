import { average, dailySpo2 } from "@/lib/analytics";
import { calculateCorrelation } from "@/lib/analytics/correlations";
import { dailySleepMinutes } from "@/lib/analytics/baseline";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";

export function generateSpo2Insights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const daily = dailySpo2(data.spo2);
  if (!daily.length) {
    return [
      makeInsight({
        id: "spo2-missing",
        category: "spo2",
        title: "No SpO2 data found",
        summary: "No SpO2 data was found in this export.",
        plainLanguage: "SpO2 insights need oxygen saturation files from Samsung Health.",
        whyItMatters: "SpO2 can add context for sleep sessions when coverage is strong, but wearable readings can be affected by fit and movement.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["SpO2"],
        limitations: ["No parsed SpO2 records were available."],
        priorityScore: 54
      })
    ];
  }

  const avg = average(daily.map((point) => point.spo2)) ?? 0;
  const min = daily.reduce((current, point) => (point.spo2 < current.spo2 ? point : current), daily[0]);
  const max = daily.reduce((current, point) => (point.spo2 > current.spo2 ? point : current), daily[0]);
  const relation = calculateCorrelation("spo2", "sleepDuration", daily.map((point) => ({ date: point.date, value: point.spo2 })), dailySleepMinutes(data));
  const confidence = confidenceFromSamples(daily.length, 14, 5);
  const insights: HealthInsight[] = [
    makeInsight({
      id: "spo2-average",
      category: "spo2",
      title: "Average SpO2",
      summary: `Your average SpO2 reading was ${formatNumber(avg, 1)}% across ${daily.length} days with data.`,
      plainLanguage: "Use this as a wearable trend only. Sensor fit, movement, and device quality can affect readings.",
      whyItMatters: "SpO2 trends are most useful when there are enough records and when they are reviewed with sleep context.",
      supportingMetric: `${formatNumber(avg, 1)}% average`,
      confidence,
      tone: daily.length >= 14 ? "neutral" : "limited_data",
      dateRange,
      sourceMetrics: ["SpO2"],
      limitations: daily.length < 14 ? ["SpO2 coverage is sparse, so confidence is limited."] : undefined,
      relatedCharts: ["spo2"],
      priorityScore: daily.length >= 14 ? 50 : 66
    }),
    makeInsight({
      id: "spo2-range",
      category: "spo2",
      title: "SpO2 range",
      summary: `Your daily SpO2 range was ${formatNumber(min.spo2, 1)}% to ${formatNumber(max.spo2, 1)}%.`,
      plainLanguage: "Some readings may be lower than your usual range. Wearable SpO2 can be affected by fit, movement, and sensor quality.",
      whyItMatters: "Range helps spot readings that are unusual compared with your baseline.",
      supportingMetric: `${formatNumber(min.spo2, 1)}%-${formatNumber(max.spo2, 1)}%`,
      confidence,
      tone: "neutral",
      dateRange,
      sourceMetrics: ["SpO2"],
      relatedCharts: ["spo2"],
      priorityScore: 44
    })
  ];

  if (relation.direction !== "insufficient") {
    insights.push(
      makeInsight({
        id: "spo2-sleep-relationship",
        category: "spo2",
        title: "SpO2 and sleep relationship",
        summary: relation.plainLanguage,
        plainLanguage: "This is a relationship check only and should not be treated as a cause.",
        whyItMatters: "SpO2 readings are often most useful when reviewed next to sleep timing and quality.",
        supportingMetric: relation.coefficient === undefined ? undefined : `r=${relation.coefficient.toFixed(2)}, n=${relation.sampleSize}`,
        confidence: relation.confidence,
        tone: relation.direction === "none" ? "neutral" : "attention",
        dateRange,
        sourceMetrics: ["SpO2", "sleep duration"],
        limitations: relation.limitation ? [relation.limitation] : undefined,
        relatedCharts: ["spo2", "sleep"],
        priorityScore: 48
      })
    );
  }

  return insights;
}

