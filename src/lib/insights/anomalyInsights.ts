import { attachBaselineStats, buildBaselineMetrics } from "@/lib/analytics/baseline";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { formatNumber, makeInsight } from "./insightText";

const metricLabels: Record<string, { titleHigh: string; titleLow: string; source: string; chart: string }> = {
  steps: { titleHigh: "Unusually active day", titleLow: "Lower-than-usual activity day", source: "daily steps", chart: "steps" },
  activeMinutes: { titleHigh: "Unusually active-time day", titleLow: "Lower active-time day", source: "active minutes", chart: "steps" },
  sleepDuration: { titleHigh: "Longer-than-usual sleep", titleLow: "Lower-than-usual sleep", source: "sleep duration", chart: "sleep" },
  avgHeartRate: { titleHigh: "Higher-than-usual heart rate", titleLow: "Lower-than-usual heart rate", source: "average heart rate", chart: "heart" },
  workoutLoad: { titleHigh: "High workout load", titleLow: "Low workout load", source: "estimated workout load", chart: "workouts" },
  spo2: { titleHigh: "Higher SpO2 reading day", titleLow: "Lower-than-usual SpO2 reading day", source: "SpO2", chart: "spo2" },
  symptomCount: { titleHigh: "Symptom cluster day", titleLow: "Lower symptom-count day", source: "symptom count", chart: "symptoms" }
};

export interface UnusualDay {
  date: string;
  metric: string;
  value: number;
  zScore?: number;
  direction: "higher" | "lower";
  summary: string;
}

export function findUnusualDays(input: InsightEngineInput): UnusualDay[] {
  const baselines = buildBaselineMetrics(input.data, input.symptoms ?? []);
  return Object.entries(baselines).flatMap(([metric, baseline]) => {
    if (baseline.points.length < 5) return [];
    return attachBaselineStats(baseline)
      .filter((point) => point.zScore !== undefined && Math.abs(point.zScore) >= 1.5)
      .map((point) => ({
        date: point.date,
        metric,
        value: point.value,
        zScore: point.zScore,
        direction: point.zScore! > 0 ? "higher" : "lower",
        summary: `${metricLabels[metric]?.source ?? metric} was ${point.zScore! > 0 ? "higher" : "lower"} than your baseline.`
      }));
  });
}

export function generateAnomalyInsights(input: InsightEngineInput): HealthInsight[] {
  const unusual = findUnusualDays(input).sort((a, b) => Math.abs(b.zScore ?? 0) - Math.abs(a.zScore ?? 0)).slice(0, 8);
  if (!unusual.length) {
    return [
      makeInsight({
        id: "anomaly-none",
        category: "overview",
        title: "No strong unusual-day pattern found",
        summary: "HealthLens did not find strong unusual-day signals in the available baseline metrics.",
        plainLanguage: "Your uploaded data did not contain obvious outlier days, or there was not enough data to be confident.",
        whyItMatters: "This prevents the app from overstating patterns when the data does not support them.",
        confidence: "medium",
        tone: "neutral",
        dateRange: input.dateRange,
        sourceMetrics: ["baseline metrics"],
        limitations: ["Some categories may still be sparse or missing."],
        priorityScore: 34
      })
    ];
  }

  return unusual.map((day, index) => {
    const labels = metricLabels[day.metric] ?? { titleHigh: "Unusual day", titleLow: "Unusual day", source: day.metric, chart: day.metric };
    return makeInsight({
      id: `anomaly-${day.metric}-${day.date}`,
      category: day.metric === "symptomCount" ? "symptom" : day.metric === "sleepDuration" ? "sleep" : day.metric === "avgHeartRate" ? "heart" : day.metric === "workoutLoad" ? "workout" : day.metric === "spo2" ? "spo2" : "activity",
      title: day.direction === "higher" ? labels.titleHigh : labels.titleLow,
      summary: `${day.date}: ${labels.source} was ${day.direction} than your uploaded-period baseline.`,
      plainLanguage: "This day was unusual compared with your own baseline, not compared with a general population.",
      whyItMatters: "Unusual days are useful for reviewing what else happened nearby, including sleep, activity, workouts, and symptoms.",
      supportingMetric: `${formatNumber(day.value, 1)} (${day.zScore?.toFixed(1)} z-score)`,
      confidence: "medium",
      tone: day.direction === "higher" && day.metric !== "sleepDuration" ? "attention" : "neutral",
      dateRange: { start: day.date, end: day.date },
      sourceMetrics: [labels.source],
      relatedCharts: [labels.chart],
      doctorDiscussion: day.metric === "symptomCount" || day.metric === "avgHeartRate" ? "If this day lines up with symptoms, it may be worth including in a doctor discussion." : undefined,
      priorityScore: 78 - index
    });
  });
}

