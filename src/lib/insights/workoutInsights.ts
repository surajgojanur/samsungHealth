import { average, workoutLoadEstimate } from "@/lib/analytics";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";

export function generateWorkoutInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const workouts = [...data.workouts].sort((a, b) => a.localDate.localeCompare(b.localDate));
  if (!workouts.length) {
    return [
      makeInsight({
        id: "workouts-missing",
        category: "workout",
        title: "No workout sessions found",
        summary: "No Samsung Health workout sessions were found in this export.",
        plainLanguage: "Workout insights need exercise records.",
        whyItMatters: "Workout timing and load can help explain activity, sleep, heart-rate, and symptom patterns.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["workouts"],
        limitations: ["No parsed workout sessions were available."],
        priorityScore: 62
      })
    ];
  }

  const totalMinutes = workouts.reduce((sum, workout) => sum + (workout.durationMinutes ?? 0), 0);
  const longest = workouts.reduce((current, workout) => ((workout.durationMinutes ?? 0) > (current.durationMinutes ?? 0) ? workout : current), workouts[0]);
  const load = workoutLoadEstimate(workouts);
  const avgLoad = average(load.map((point) => point.load)) ?? 0;
  const recent = load.slice(-7);
  const previous = load.slice(Math.max(0, load.length - 35), Math.max(0, load.length - 7));
  const recentAvg = average(recent.map((point) => point.load));
  const previousAvg = average(previous.map((point) => point.load));
  const loadJump = recentAvg !== undefined && previousAvg !== undefined && previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : undefined;
  const byType = workouts.reduce<Record<string, number>>((acc, workout) => {
    const type = workout.exerciseType ?? "unspecified";
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});
  const commonType = Object.entries(byType).sort((a, b) => b[1] - a[1])[0];
  const confidence = confidenceFromSamples(workouts.length, 8, 3);

  const insights: HealthInsight[] = [
    makeInsight({
      id: "workouts-count",
      category: "workout",
      title: "Workout frequency",
      summary: `You logged ${workouts.length} workouts totaling ${formatNumber(totalMinutes)} minutes.`,
      plainLanguage: "This is the workout activity Samsung Health exported for the selected period.",
      whyItMatters: "Workout frequency helps explain changes in steps, sleep, heart rate, and symptom timing.",
      supportingMetric: `${workouts.length} workouts`,
      confidence,
      tone: workouts.length >= 4 ? "positive" : "neutral",
      dateRange,
      sourceMetrics: ["workout sessions", "duration"],
      relatedCharts: ["workouts"],
      priorityScore: 58
    }),
    makeInsight({
      id: "workouts-longest",
      category: "workout",
      title: "Longest workout",
      summary: `Your longest workout was on ${longest.localDate} for ${formatNumber(longest.durationMinutes ?? 0)} minutes.`,
      plainLanguage: "This session stands out as your longest workout in the uploaded data.",
      whyItMatters: "Long or intense sessions can be useful context for sleep, heart-rate, and symptom review.",
      supportingMetric: `${formatNumber(longest.durationMinutes ?? 0)} minutes`,
      confidence,
      tone: "neutral",
      dateRange,
      sourceMetrics: ["workout duration"],
      relatedCharts: ["workouts"],
      priorityScore: 44
    }),
    makeInsight({
      id: "workouts-load",
      category: "workout",
      title: "Estimated workout load",
      summary: `Your average estimated workout load was ${formatNumber(avgLoad, 1)} per workout.`,
      plainLanguage: "This combines workout duration with available heart-rate intensity. It is a simple wellness estimate, not a medical score.",
      whyItMatters: "Estimated workout load can show when training volume changed sharply.",
      supportingMetric: `${formatNumber(avgLoad, 1)} average load`,
      confidence: confidenceFromSamples(load.length, 8, 3),
      tone: "neutral",
      dateRange,
      sourceMetrics: ["workout duration", "workout heart rate"],
      limitations: workouts.some((workout) => workout.avgHeartRate === undefined) ? ["Some workouts did not include average heart rate, so duration-based estimates were used."] : undefined,
      relatedCharts: ["workouts"],
      priorityScore: 54
    })
  ];

  if (commonType) {
    insights.push(
      makeInsight({
        id: "workouts-common-type",
        category: "workout",
        title: "Most common workout type",
        summary: `Your most common workout type was ${commonType[0]} with ${commonType[1]} sessions.`,
        plainLanguage: "Samsung exports often use numeric exercise codes, so this may need a friendlier label later.",
        whyItMatters: "Workout type gives context for load and recovery patterns.",
        supportingMetric: `${commonType[1]} sessions`,
        confidence,
        tone: "neutral",
        dateRange,
        sourceMetrics: ["workout type"],
        priorityScore: 36
      })
    );
  }

  if (loadJump !== undefined && loadJump > 40) {
    insights.push(
      makeInsight({
        id: "workouts-load-jump",
        category: "doctor_discussion",
        title: "Sharp workout-load increase",
        summary: `Your recent estimated workout load was ${formatNumber(loadJump)}% higher than the previous comparison window.`,
        plainLanguage: "This is a sharp change compared with your own recent pattern.",
        whyItMatters: "A sudden workload change can be useful context if fatigue or symptoms happen nearby.",
        supportingMetric: `${formatNumber(loadJump)}% increase`,
        confidence: confidenceFromSamples(load.length, 12, 5),
        tone: "attention",
        dateRange,
        sourceMetrics: ["estimated workout load"],
        doctorDiscussion: "If you feel fatigue or symptoms, consider mentioning this workload pattern to a professional.",
        relatedCharts: ["workouts", "symptoms"],
        priorityScore: 82
      })
    );
  }

  return insights;
}
