import { average, dailyHeartRate } from "@/lib/analytics";
import { dailySleepMinutes, dailyWorkoutLoad } from "@/lib/analytics/baseline";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";

export interface SymptomContext {
  symptom: SymptomLog;
  previousNightSleepMinutes?: number;
  sameDaySteps?: number;
  workoutLoad24h?: number;
  sameDayHeartRate?: number;
  sameDaySpo2?: number;
  nearbyStressCount: number;
  notes: string[];
}

export interface SymptomPatternSummary {
  eventCount: number;
  symptomTypes: string[];
  averageSeverity?: number;
  contexts: SymptomContext[];
  lowSleepEvents: number;
  highActivityEvents: number;
  highWorkoutLoadEvents: number;
  highHeartRateEvents: number;
  doctorReadyNote: string;
}

function label(symptom: SymptomLog): string {
  return symptom.customSymptom || symptom.symptomType.replaceAll("_", " ");
}

function previousDate(date: string): string {
  return new Date(new Date(`${date}T00:00:00Z`).getTime() - 86_400_000).toISOString().slice(0, 10);
}

export function analyzeSymptomPatterns(data: NormalizedHealthData, symptoms: SymptomLog[] = []): SymptomPatternSummary {
  const sleep = new Map(dailySleepMinutes(data).map((point) => [point.date, point.value]));
  const steps = new Map(data.activity.map((day) => [day.date, day.steps ?? 0]));
  const hr = new Map(dailyHeartRate(data.heartRate).map((point) => [point.date, point.bpm]));
  const spo2 = new Map(data.spo2.map((sample) => [sample.localDate, sample.spo2]));
  const workoutLoad = dailyWorkoutLoad(data);
  const avgSleep = average([...sleep.values()]) ?? 0;
  const avgSteps = average([...steps.values()]) ?? 0;
  const avgHr = average([...hr.values()]) ?? 0;
  const avgLoad = average(workoutLoad.map((point) => point.value)) ?? 0;

  const contexts = symptoms.map((symptom) => {
    const start = new Date(symptom.timestamp).getTime();
    const load24h = workoutLoad
      .filter((point) => {
        const time = new Date(`${point.date}T12:00:00Z`).getTime();
        return time <= start && start - time <= 86_400_000;
      })
      .reduce((sum, point) => sum + point.value, 0);
    const nearbyStress = data.stress.filter((sample) => {
      const time = new Date(sample.timestamp).getTime();
      return Math.abs(start - time) <= 12 * 60 * 60 * 1000;
    }).length;
    return {
      symptom,
      previousNightSleepMinutes: sleep.get(previousDate(symptom.localDate)),
      sameDaySteps: steps.get(symptom.localDate),
      workoutLoad24h: load24h || undefined,
      sameDayHeartRate: hr.get(symptom.localDate),
      sameDaySpo2: spo2.get(symptom.localDate),
      nearbyStressCount: nearbyStress,
      notes: [symptom.beforeEvent, symptom.flags?.caffeine ? "caffeine flag" : undefined, symptom.flags?.workout ? "workout flag" : undefined, symptom.flags?.poorSleep ? "poor sleep flag" : undefined, symptom.notes].filter(Boolean) as string[]
    };
  });

  const lowSleepEvents = contexts.filter((context) => context.previousNightSleepMinutes !== undefined && avgSleep && context.previousNightSleepMinutes < avgSleep - 45).length;
  const highActivityEvents = contexts.filter((context) => context.sameDaySteps !== undefined && avgSteps && context.sameDaySteps > avgSteps * 1.2).length;
  const highWorkoutLoadEvents = contexts.filter((context) => context.workoutLoad24h !== undefined && avgLoad && context.workoutLoad24h > avgLoad * 1.25).length;
  const highHeartRateEvents = contexts.filter((context) => context.sameDayHeartRate !== undefined && avgHr && context.sameDayHeartRate > avgHr + 3).length;
  const symptomTypes = [...new Set(symptoms.map(label))];
  const severity = average(symptoms.map((symptom) => symptom.severity));
  const commonDurations = symptoms
    .filter((symptom) => symptom.durationSeconds !== undefined)
    .map((symptom) => `${Math.round((symptom.durationSeconds ?? 0) / 60)} min`)
    .slice(0, 3)
    .join(", ");
  const doctorReadyNote = symptoms.length
    ? `Symptoms logged: ${symptomTypes.join(", ")}, ${symptoms.length} events. Average severity: ${severity ? `${formatNumber(severity, 1)}/10` : "not recorded"}. Typical duration examples: ${commonDurations || "not recorded"}. Nearby patterns: ${[
        lowSleepEvents ? "shorter sleep on some events" : "",
        highActivityEvents ? "higher activity on some events" : "",
        highWorkoutLoadEvents ? "higher workout load on some events" : "",
        highHeartRateEvents ? "higher heart-rate days on some events" : ""
      ]
        .filter(Boolean)
        .join(", ") || "no clear repeated pattern yet"}.`
    : "No symptoms logged yet.";

  return {
    eventCount: symptoms.length,
    symptomTypes,
    averageSeverity: severity,
    contexts,
    lowSleepEvents,
    highActivityEvents,
    highWorkoutLoadEvents,
    highHeartRateEvents,
    doctorReadyNote
  };
}

export function generateSymptomInsights(input: InsightEngineInput): HealthInsight[] {
  const symptoms = input.symptoms ?? [];
  const summary = analyzeSymptomPatterns(input.data, symptoms);
  if (!symptoms.length) {
    return [
      makeInsight({
        id: "symptoms-empty",
        category: "symptom",
        title: "No symptoms logged yet",
        summary: "No symptoms are currently logged in HealthLens.",
        plainLanguage: "Add symptoms to compare them with sleep, activity, heart trends, workouts, and notes.",
        whyItMatters: "Symptoms are not part of Samsung Health exports, so manual logs make pattern review possible.",
        confidence: "high",
        tone: "limited_data",
        dateRange: input.dateRange,
        sourceMetrics: ["symptom log"],
        limitations: ["No symptom logs were available."],
        priorityScore: 64
      })
    ];
  }

  const insights: HealthInsight[] = [
    makeInsight({
      id: "symptom-frequency",
      category: "symptom",
      title: "Symptom frequency",
      summary: `You logged ${summary.eventCount} symptom events: ${summary.symptomTypes.join(", ")}.`,
      plainLanguage: "This is your manually entered symptom timeline.",
      whyItMatters: "Symptom frequency gives a simple starting point for reviewing patterns with sleep, activity, workouts, and heart rate.",
      supportingMetric: `${summary.eventCount} events`,
      confidence: confidenceFromSamples(symptoms.length, 8, 3),
      tone: symptoms.length >= 3 ? "attention" : "neutral",
      dateRange: input.dateRange,
      sourceMetrics: ["symptom log"],
      relatedCharts: ["symptoms"],
      doctorDiscussion: "Bring the symptom timeline if the events continue or are concerning to you.",
      priorityScore: symptoms.length >= 3 ? 84 : 62
    }),
    makeInsight({
      id: "symptom-doctor-note",
      category: "doctor_discussion",
      title: "Doctor-ready symptom note",
      summary: summary.doctorReadyNote,
      plainLanguage: "This keeps the symptom summary factual and short.",
      whyItMatters: "A concise timeline can make a health appointment more efficient.",
      confidence: confidenceFromSamples(symptoms.length, 8, 3),
      tone: "attention",
      dateRange: input.dateRange,
      sourceMetrics: ["symptom log", "sleep", "activity", "heart rate", "workouts"],
      limitations: symptoms.length < 3 ? ["More symptom events would make pattern detection stronger."] : undefined,
      relatedCharts: ["symptoms"],
      doctorDiscussion: summary.doctorReadyNote,
      priorityScore: 88
    })
  ];

  const patterns = [
    ["symptom-low-sleep", "Symptoms near shorter sleep", summary.lowSleepEvents, "shorter-than-usual sleep"],
    ["symptom-high-activity", "Symptoms near higher activity", summary.highActivityEvents, "higher-than-usual activity"],
    ["symptom-workout-load", "Symptoms near higher workout load", summary.highWorkoutLoadEvents, "higher estimated workout load"],
    ["symptom-heart-rate", "Symptoms near higher heart-rate days", summary.highHeartRateEvents, "higher heart-rate days"]
  ] as const;

  patterns.forEach(([id, title, count, phrase]) => {
    if (!count) return;
    insights.push(
      makeInsight({
        id,
        category: "symptom",
        title,
        summary: `${count} of ${summary.eventCount} symptom events happened near ${phrase}.`,
        plainLanguage: "This does not show cause, but it gives a useful personal pattern to track.",
        whyItMatters: "Patterns around symptoms can help you decide what context to record next and what to mention in a doctor discussion.",
        supportingMetric: `${count}/${summary.eventCount} events`,
        confidence: confidenceFromSamples(summary.eventCount, 8, 3),
        tone: "attention",
        dateRange: input.dateRange,
        sourceMetrics: ["symptom log", phrase],
        limitations: summary.eventCount < 5 ? ["There are only a few symptom events, so confidence is limited."] : undefined,
        relatedCharts: ["symptoms"],
        doctorDiscussion: `Ask whether symptoms could be related to ${phrase}, caffeine, stress, hydration, or device-captured activity context.`,
        priorityScore: 82
      })
    );
  });

  if (![summary.lowSleepEvents, summary.highActivityEvents, summary.highWorkoutLoadEvents, summary.highHeartRateEvents].some(Boolean)) {
    insights.push(
      makeInsight({
        id: "symptom-no-clear-pattern",
        category: "symptom",
        title: "No clear symptom pattern found yet",
        summary: "HealthLens did not find a repeated sleep, activity, workout, or heart-rate pattern around symptoms.",
        plainLanguage: "More symptom logs may help, especially with notes about caffeine, stress, hydration, and recent activity.",
        whyItMatters: "A no-pattern result is useful because it avoids over-reading sparse data.",
        confidence: "medium",
        tone: "neutral",
        dateRange: input.dateRange,
        sourceMetrics: ["symptom log"],
        limitations: ["Pattern detection is limited by the number and detail of symptom logs."],
        priorityScore: 54
      })
    );
  }

  return insights;
}

