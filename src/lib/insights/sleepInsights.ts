import { average, sleepConsistencyScore } from "@/lib/analytics";
import { calculateCorrelation } from "@/lib/analytics/correlations";
import { dailySleepMinutes } from "@/lib/analytics/baseline";
import { dailyHeartRate } from "@/lib/analytics";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";
import { scoreInsight } from "./insightScoring";

export function generateSleepInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const sleep = [...data.sleep].sort((a, b) => a.localDate.localeCompare(b.localDate));
  if (!sleep.length) {
    return [
      makeInsight({
        id: "sleep-missing",
        category: "sleep",
        title: "No sleep data found",
        summary: "No sleep records were found in this export.",
        plainLanguage: "Sleep insights need Samsung Health sleep files.",
        whyItMatters: "Sleep is important context for activity, workouts, heart-rate trends, and symptom timing.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["sleep"],
        limitations: ["No parsed sleep records were available."],
        priorityScore: 78
      })
    ];
  }

  const sleepPoints = dailySleepMinutes(data);
  const avgMinutes = average(sleepPoints.map((point) => point.value)) ?? 0;
  const shortNights = sleepPoints.filter((point) => point.value < avgMinutes - 60);
  const longNights = sleepPoints.filter((point) => point.value > avgMinutes + 90);
  const consistency = sleepConsistencyScore(sleep);
  const heartRelation = calculateCorrelation(
    "sleepDuration",
    "avgHeartRate",
    sleepPoints,
    dailyHeartRate(data.heartRate).map((point) => ({ date: point.date, value: point.bpm }))
  );
  const confidence = confidenceFromSamples(sleepPoints.length);
  const insights: HealthInsight[] = [];

  const avgInsight = {
    id: "sleep-average",
    category: "sleep" as const,
    title: "Average sleep duration",
    summary: `Your average sleep duration was ${(avgMinutes / 60).toFixed(1)} hours across ${sleepPoints.length} nights.`,
    plainLanguage: "This gives a simple baseline for the period you uploaded.",
    whyItMatters: "Sleep duration often helps explain changes in next-day activity, heart rate, workouts, and symptoms.",
    supportingMetric: `${(avgMinutes / 60).toFixed(1)} hours/night`,
    confidence,
    tone: avgMinutes >= 420 ? ("positive" as const) : ("attention" as const),
    dateRange,
    sourceMetrics: ["sleep duration"],
    relatedCharts: ["sleep"],
    limitations: sleepPoints.length < 7 ? ["Fewer than 7 sleep nights were available."] : undefined
  };
  insights.push(makeInsight({ ...avgInsight, priorityScore: scoreInsight(avgInsight, 46) }));

  insights.push(
    makeInsight({
      id: "sleep-consistency",
      category: "sleep",
      title: "Sleep consistency",
      summary: consistency ? `${consistency}% of nights were within about 90 minutes of your average.` : "Not enough nights were available for a stable sleep consistency score.",
      plainLanguage: consistency >= 70 ? "Your sleep duration was fairly consistent." : "Your sleep duration moved around enough to flag as a pattern.",
      whyItMatters: "Sleep consistency can be easier to act on than a single short night.",
      supportingMetric: consistency ? `${consistency}% consistency` : "Limited data",
      confidence,
      tone: consistency >= 70 ? "positive" : "attention",
      dateRange,
      sourceMetrics: ["sleep duration"],
      relatedCharts: ["sleep"],
      limitations: sleepPoints.length < 7 ? ["Sleep consistency needs at least 7 nights."] : undefined,
      priorityScore: consistency >= 70 ? 58 : 69
    })
  );

  if (shortNights.length) {
    insights.push(
      makeInsight({
        id: "sleep-short-nights",
        category: "sleep",
        title: "Shorter-than-usual nights",
        summary: `${shortNights.length} nights were at least 1 hour shorter than your average.`,
        plainLanguage: "These nights stand out compared with your own uploaded-period baseline.",
        whyItMatters: "Short-sleep nights are useful context for next-day activity, heart rate, workouts, and symptoms.",
        supportingMetric: `${shortNights.length} short nights`,
        confidence,
        tone: "attention",
        dateRange,
        sourceMetrics: ["sleep duration"],
        doctorDiscussion: "If symptoms tend to follow short-sleep nights, this pattern may be worth discussing with a doctor.",
        relatedCharts: ["sleep"],
        priorityScore: 72
      })
    );
  }

  if (longNights.length) {
    insights.push(
      makeInsight({
        id: "sleep-recovery-nights",
        category: "sleep",
        title: "Longer recovery nights",
        summary: `${longNights.length} nights were at least 90 minutes longer than your average.`,
        plainLanguage: "Longer nights may reflect schedule change, catch-up sleep, illness, stress, or device capture differences.",
        whyItMatters: "Recovery-looking nights can help explain changes in next-day activity or heart-rate patterns.",
        supportingMetric: `${longNights.length} longer nights`,
        confidence,
        tone: "neutral",
        dateRange,
        sourceMetrics: ["sleep duration"],
        relatedCharts: ["sleep"],
        priorityScore: 46
      })
    );
  }

  if (heartRelation.direction !== "insufficient") {
    const base = {
      id: "sleep-next-day-heart",
      category: "sleep" as const,
      title: "Sleep and heart-rate relationship",
      summary: heartRelation.plainLanguage,
      plainLanguage: "This does not show cause, but it is a useful personal pattern.",
      whyItMatters: "Seeing sleep and heart rate together helps you explain unusual days without reading raw charts.",
      supportingMetric: heartRelation.coefficient === undefined ? undefined : `r=${heartRelation.coefficient.toFixed(2)}, n=${heartRelation.sampleSize}`,
      confidence: heartRelation.confidence,
      tone: heartRelation.direction === "none" ? ("neutral" as const) : ("attention" as const),
      dateRange,
      sourceMetrics: ["sleep duration", "average heart rate"],
      limitations: heartRelation.limitation ? [heartRelation.limitation] : undefined,
      relatedCharts: ["sleep", "heart"]
    };
    insights.push(makeInsight({ ...base, priorityScore: scoreInsight(base, 50) }));
  }

  const scoreAvg = average(sleep.map((session) => session.sleepScore));
  if (scoreAvg !== undefined) {
    insights.push(
      makeInsight({
        id: "sleep-quality-score",
        category: "sleep",
        title: "Sleep quality score trend",
        summary: `Your average Samsung sleep score was ${formatNumber(scoreAvg)} where scores were available.`,
        plainLanguage: "Samsung sleep scores are device-generated wellness signals, so use them as a trend rather than a final judgment.",
        whyItMatters: "Sleep score can add context when duration alone does not explain a night.",
        supportingMetric: `${formatNumber(scoreAvg)} average score`,
        confidence: confidenceFromSamples(sleep.filter((session) => session.sleepScore !== undefined).length),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["sleep score"],
        relatedCharts: ["sleep"],
        priorityScore: 44
      })
    );
  }

  return insights;
}

