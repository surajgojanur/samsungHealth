import { activityConsistencyScore, average, dailyHeartRate, missingDays } from "@/lib/analytics";
import { calculateCorrelation } from "@/lib/analytics/correlations";
import { dailySleepMinutes } from "@/lib/analytics/baseline";
import type { InsightEngineInput, HealthInsight } from "./insightTypes";
import { confidenceFromSamples, formatNumber, formatPercent, makeInsight } from "./insightText";
import { scoreInsight } from "./insightScoring";

export function generateActivityInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const activity = [...data.activity].sort((a, b) => a.date.localeCompare(b.date));
  if (!activity.length) {
    return [
      makeInsight({
        id: "activity-missing",
        category: "activity",
        title: "No activity data found",
        summary: "No daily step records were found in this export.",
        plainLanguage: "HealthLens cannot explain activity patterns until Samsung Health step or day-summary files are included.",
        whyItMatters: "Activity is useful context for sleep, heart-rate, workout, and symptom patterns.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["activity"],
        limitations: ["No parsed activity records were available."],
        priorityScore: 76
      })
    ];
  }

  const insights: HealthInsight[] = [];
  const avgSteps = average(activity.map((day) => day.steps));
  const confidence = confidenceFromSamples(activity.length);
  const best = activity.reduce((current, day) => ((day.steps ?? 0) > (current.steps ?? 0) ? day : current), activity[0]);
  const lowest = activity.reduce((current, day) => ((day.steps ?? 0) < (current.steps ?? 0) ? day : current), activity[0]);
  const weekdays = activity.filter((day) => {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    return weekday >= 1 && weekday <= 5;
  });
  const weekends = activity.filter((day) => {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    return weekday === 0 || weekday === 6;
  });
  const weekdayAvg = average(weekdays.map((day) => day.steps));
  const weekendAvg = average(weekends.map((day) => day.steps));
  const consistency = activityConsistencyScore(activity);
  const missing = missingDays(activity.map((day) => day.date));
  const stepsPoints = activity.filter((day) => day.steps !== undefined).map((day) => ({ date: day.date, value: day.steps! }));
  const sleepRelation = calculateCorrelation("steps", "sleepDuration", stepsPoints, dailySleepMinutes(data));
  const heartRelation = calculateCorrelation(
    "steps",
    "avgHeartRate",
    stepsPoints,
    dailyHeartRate(data.heartRate).map((point) => ({ date: point.date, value: point.bpm }))
  );

  if (avgSteps !== undefined) {
    const base = {
      id: "activity-average-steps",
      category: "activity" as const,
      title: "Average daily steps",
      summary: `Your average was ${formatNumber(avgSteps)} steps per day across ${activity.length} days.`,
      plainLanguage: `Your usual activity level in this export was about ${formatNumber(avgSteps)} steps per day.`,
      whyItMatters: "Step patterns help explain routine changes and can provide context for sleep, workouts, heart rate, and symptoms.",
      supportingMetric: `${formatNumber(avgSteps)} steps/day`,
      confidence,
      tone: "neutral" as const,
      dateRange,
      sourceMetrics: ["daily steps"],
      relatedCharts: ["steps"],
      limitations: activity.length < 7 ? ["Fewer than 7 activity days were available."] : undefined
    };
    insights.push(makeInsight({ ...base, priorityScore: scoreInsight(base, 34) }));
  }

  insights.push(
    makeInsight({
      id: "activity-best-lowest-days",
      category: "activity",
      title: "Most and least active days",
      summary: `Your highest step day was ${best.date} with ${formatNumber(best.steps ?? 0)} steps. Your lowest was ${lowest.date} with ${formatNumber(lowest.steps ?? 0)} steps.`,
      plainLanguage: "These days stand out from the rest of your activity pattern.",
      whyItMatters: "Unusual activity days are helpful context when reviewing sleep, workout load, heart-rate, and symptom notes.",
      supportingMetric: `${formatNumber(best.steps ?? 0)} high / ${formatNumber(lowest.steps ?? 0)} low`,
      confidence,
      tone: "neutral",
      dateRange,
      sourceMetrics: ["daily steps"],
      relatedCharts: ["steps"],
      priorityScore: 56
    })
  );

  if (weekdayAvg !== undefined && weekendAvg !== undefined && weekends.length >= 2 && weekdays.length >= 3) {
    const delta = weekendAvg ? ((weekdayAvg - weekendAvg) / weekendAvg) * 100 : 0;
    const base = {
      id: "activity-weekday-weekend",
      category: "activity" as const,
      title: "Weekday versus weekend activity",
      summary: `Your steps were ${formatPercent(Math.abs(delta))} ${delta >= 0 ? "higher" : "lower"} on weekdays than weekends.`,
      plainLanguage: delta >= 0 ? "Your activity looks routine-driven, with more movement during weekdays." : "Your weekends were more active than weekdays in this export.",
      whyItMatters: "Routine-driven activity patterns can explain why some days look different without needing to inspect raw CSV rows.",
      supportingMetric: `${formatNumber(weekdayAvg)} weekday / ${formatNumber(weekendAvg)} weekend`,
      comparison: "Weekday average compared with weekend average",
      confidence: confidenceFromSamples(Math.min(weekdays.length, weekends.length), 6, 2),
      tone: Math.abs(delta) > 25 ? ("attention" as const) : ("neutral" as const),
      dateRange,
      sourceMetrics: ["daily steps"],
      relatedCharts: ["steps"]
    };
    insights.push(makeInsight({ ...base, priorityScore: scoreInsight(base, 42) }));
  }

  insights.push(
    makeInsight({
      id: "activity-consistency",
      category: "activity",
      title: "Activity consistency",
      summary: `${consistency}% of activity days had at least 1,000 steps.`,
      plainLanguage: consistency >= 70 ? "Your activity was fairly consistent across the selected period." : "Your activity varied quite a bit across the selected period.",
      whyItMatters: "Consistency can be more useful than a single high or low day when looking for lifestyle patterns.",
      supportingMetric: `${consistency}% consistency score`,
      confidence,
      tone: consistency >= 70 ? "positive" : "attention",
      dateRange,
      sourceMetrics: ["daily steps"],
      relatedCharts: ["steps"],
      priorityScore: consistency >= 70 ? 62 : 70
    })
  );

  if (sleepRelation.direction !== "insufficient") {
    insights.push(
      makeInsight({
        id: "activity-sleep-relationship",
        category: "activity",
        title: "Steps and sleep relationship",
        summary: sleepRelation.plainLanguage,
        plainLanguage: "This is a relationship check only. It does not show cause.",
        whyItMatters: "Comparing sleep and steps can help you understand whether high-activity days tend to happen near shorter or longer sleep.",
        supportingMetric: sleepRelation.coefficient === undefined ? undefined : `r=${sleepRelation.coefficient.toFixed(2)}, n=${sleepRelation.sampleSize}`,
        confidence: sleepRelation.confidence,
        tone: sleepRelation.direction === "none" ? "neutral" : "attention",
        dateRange,
        sourceMetrics: ["daily steps", "sleep duration"],
        limitations: sleepRelation.limitation ? [sleepRelation.limitation] : undefined,
        relatedCharts: ["steps", "sleep"],
        priorityScore: 58
      })
    );
  }

  if (heartRelation.direction !== "insufficient") {
    insights.push(
      makeInsight({
        id: "activity-heart-relationship",
        category: "activity",
        title: "Steps and heart rate relationship",
        summary: heartRelation.plainLanguage,
        plainLanguage: "This pattern may be related to activity load, sleep, stress, caffeine, illness, or device accuracy.",
        whyItMatters: "Daily heart-rate changes are easier to interpret when activity context is visible.",
        supportingMetric: heartRelation.coefficient === undefined ? undefined : `r=${heartRelation.coefficient.toFixed(2)}, n=${heartRelation.sampleSize}`,
        confidence: heartRelation.confidence,
        tone: heartRelation.direction === "none" ? "neutral" : "attention",
        dateRange,
        sourceMetrics: ["daily steps", "average heart rate"],
        limitations: heartRelation.limitation ? [heartRelation.limitation] : undefined,
        relatedCharts: ["steps", "heart"],
        priorityScore: 55
      })
    );
  }

  if (missing.length) {
    insights.push(
      makeInsight({
        id: "activity-missing-days",
        category: "data_quality",
        title: "Missing activity days",
        summary: `${missing.length} dates are missing between the first and last activity day.`,
        plainLanguage: "Some days may be absent because no device was worn, Samsung did not export them, or the files were incomplete.",
        whyItMatters: "Missing days can make trends look better or worse than they really are.",
        supportingMetric: `${missing.length} missing days`,
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["daily steps"],
        limitations: ["Missing activity days reduce confidence in activity trends."],
        priorityScore: 68
      })
    );
  }

  return insights;
}

