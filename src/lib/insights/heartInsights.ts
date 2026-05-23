import { average, dailyHeartRate } from "@/lib/analytics";
import { calculateCorrelation } from "@/lib/analytics/correlations";
import { calculateMetricBaseline, dailySleepMinutes } from "@/lib/analytics/baseline";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";
import { scoreInsight } from "./insightScoring";

export function generateHeartInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const daily = dailyHeartRate(data.heartRate);
  if (!daily.length) {
    return [
      makeInsight({
        id: "heart-missing",
        category: "heart",
        title: "No heart-rate data found",
        summary: "No heart-rate rows were found in this export.",
        plainLanguage: "Heart-rate insights need Samsung Health heart-rate records.",
        whyItMatters: "Heart-rate trends can provide useful context for sleep, activity, workouts, and symptoms.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["heart rate"],
        limitations: ["No parsed heart-rate records were available."],
        priorityScore: 78
      })
    ];
  }

  const values = daily.map((point) => point.bpm);
  const baseline = calculateMetricBaseline("avgHeartRate", daily.map((point) => ({ date: point.date, value: point.bpm })));
  const avg = average(values) ?? 0;
  const sd = baseline.standardDeviation ?? 0;
  const higherDays = sd ? daily.filter((point) => point.bpm > avg + sd) : [];
  const lowerDays = sd ? daily.filter((point) => point.bpm < avg - sd) : [];
  const sleepRelation = calculateCorrelation("sleepDuration", "avgHeartRate", dailySleepMinutes(data), daily.map((point) => ({ date: point.date, value: point.bpm })));
  const confidence = confidenceFromSamples(daily.length);
  const insights: HealthInsight[] = [];

  const typical = {
    id: "heart-baseline",
    category: "heart" as const,
    title: "Typical heart-rate baseline",
    summary: `Your typical daily average heart rate was about ${formatNumber(avg)} bpm across ${daily.length} days.`,
    plainLanguage: "This is your personal baseline for the uploaded period, not a general health label.",
    whyItMatters: "A personal baseline makes unusual days easier to spot than comparing against generic numbers.",
    supportingMetric: `${formatNumber(avg)} bpm daily average`,
    confidence,
    tone: "neutral" as const,
    dateRange,
    sourceMetrics: ["average heart rate"],
    relatedCharts: ["heart"],
    limitations: daily.length < 7 ? ["Fewer than 7 heart-rate days were available."] : undefined
  };
  insights.push(makeInsight({ ...typical, priorityScore: scoreInsight(typical, 40) }));

  if (higherDays.length) {
    const base = {
      id: "heart-higher-baseline-days",
      category: "heart" as const,
      title: "Higher-than-usual heart-rate days",
      summary: `${higherDays.length} days were higher than your uploaded-period baseline.`,
      plainLanguage: "These days were unusual compared with your baseline and may be related to sleep, activity, caffeine, illness, stress, or device accuracy.",
      whyItMatters: "Flagging unusual days helps you compare them with symptoms and daily context.",
      supportingMetric: `${higherDays.length} days above baseline band`,
      confidence,
      tone: "attention" as const,
      dateRange,
      sourceMetrics: ["average heart rate"],
      doctorDiscussion: "If symptoms happened on these days, this pattern may be worth discussing with a doctor.",
      relatedCharts: ["heart"]
    };
    insights.push(makeInsight({ ...base, priorityScore: scoreInsight(base, 54) }));
  }

  if (lowerDays.length) {
    insights.push(
      makeInsight({
        id: "heart-lower-baseline-days",
        category: "heart",
        title: "Lower-than-usual heart-rate days",
        summary: `${lowerDays.length} days were lower than your uploaded-period baseline.`,
        plainLanguage: "These days were below your usual range for this export.",
        whyItMatters: "Lower-than-usual days can also be useful context when reviewing sleep, recovery, and activity.",
        supportingMetric: `${lowerDays.length} days below baseline band`,
        confidence,
        tone: "neutral",
        dateRange,
        sourceMetrics: ["average heart rate"],
        relatedCharts: ["heart"],
        priorityScore: 45
      })
    );
  }

  if (sleepRelation.direction !== "insufficient") {
    const base = {
      id: "heart-after-sleep",
      category: "heart" as const,
      title: "Heart rate and sleep pattern",
      summary: sleepRelation.plainLanguage,
      plainLanguage: "This does not show cause, but it is a useful personal pattern to track.",
      whyItMatters: "Sleep changes can appear near heart-rate changes, and seeing both together makes the trend easier to discuss.",
      supportingMetric: sleepRelation.coefficient === undefined ? undefined : `r=${sleepRelation.coefficient.toFixed(2)}, n=${sleepRelation.sampleSize}`,
      confidence: sleepRelation.confidence,
      tone: sleepRelation.direction === "none" ? ("neutral" as const) : ("attention" as const),
      dateRange,
      sourceMetrics: ["sleep duration", "average heart rate"],
      limitations: sleepRelation.limitation ? [sleepRelation.limitation] : undefined,
      doctorDiscussion: sleepRelation.direction === "none" ? undefined : "If symptoms continue, this sleep and heart-rate pattern may be useful for doctor discussion.",
      relatedCharts: ["sleep", "heart"]
    };
    insights.push(makeInsight({ ...base, priorityScore: scoreInsight(base, 52) }));
  }

  insights.push(
    makeInsight({
      id: "heart-coverage",
      category: "data_quality",
      title: "Heart-rate coverage",
      summary: `${data.heartRate.length} heart-rate samples covered ${daily.length} days.`,
      plainLanguage: daily.length >= 14 ? "Heart-rate coverage is enough for basic trend review." : "Heart-rate coverage is limited, so patterns should be treated carefully.",
      whyItMatters: "Sparse heart-rate data can make a day look unusual just because fewer samples were recorded.",
      supportingMetric: `${data.heartRate.length} samples`,
      confidence: "high",
      tone: daily.length >= 14 ? "neutral" : "limited_data",
      dateRange,
      sourceMetrics: ["heart rate"],
      limitations: daily.length < 14 ? ["Fewer than 14 heart-rate days were available."] : undefined,
      priorityScore: daily.length >= 14 ? 42 : 66
    })
  );

  return insights;
}

