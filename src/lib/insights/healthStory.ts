import { calculateHealthCorrelations } from "@/lib/analytics/correlations";
import { dataCoverageScore } from "@/lib/analytics";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import type { HealthStory } from "./insightTypes";
import { generateActivityInsights } from "./activityInsights";
import { generateHeartInsights } from "./heartInsights";
import { generateSleepInsights } from "./sleepInsights";
import { analyzeSymptomPatterns } from "./symptomInsights";
import { sanitizeGeneratedHealthText } from "@/lib/safety/medicalClaimGuard";

export function generateHealthStory(data: NormalizedHealthData, symptoms: SymptomLog[] = [], dateRange?: { start: string; end: string }): HealthStory {
  const rangeText = dateRange ? `${dateRange.start.slice(0, 10)} to ${dateRange.end.slice(0, 10)}` : "the uploaded period";
  const activity = generateActivityInsights({ data, symptoms, dateRange }).find((insight) => insight.tone === "positive" || insight.category === "activity");
  const sleepAttention = generateSleepInsights({ data, symptoms, dateRange }).find((insight) => insight.tone === "attention");
  const heartAttention = generateHeartInsights({ data, symptoms, dateRange }).find((insight) => insight.tone === "attention");
  const correlations = calculateHealthCorrelations(data, symptoms).filter((item) => item.direction !== "insufficient" && item.direction !== "none");
  const symptomSummary = analyzeSymptomPatterns(data, symptoms);
  const coverage = dataCoverageScore(data);
  const dataLimitations = [
    data.sleep.length < 7 ? "Sleep data is limited." : "",
    data.heartRate.length < 20 ? "Heart-rate data is limited." : "",
    data.spo2.length < 10 ? "SpO2 data is sparse or missing." : "",
    data.nutrition.length < 10 ? "Nutrition logs are too sparse for strong food insights." : "",
    symptoms.length === 0 ? "No symptoms are logged yet." : ""
  ].filter(Boolean);
  const symptomPattern = symptoms.length
    ? symptomSummary.doctorReadyNote
    : "No symptoms logged yet. Add symptoms to compare them with sleep, activity, heart trends, workouts, and notes.";
  const topAttention = sleepAttention?.plainLanguage || heartAttention?.plainLanguage || correlations[0]?.plainLanguage;
  const oneLine =
    coverage >= 70
      ? `Over ${rangeText}, your data shows useful patterns across activity, sleep, heart rate, and wellness context.`
      : `Over ${rangeText}, HealthLens found some useful patterns, but missing or sparse data limits confidence.`;
  const detailed = [
    activity?.plainLanguage || "Activity data gives the clearest routine signal in this upload.",
    topAttention || "No strong attention pattern stood out across the available core metrics.",
    symptomPattern
  ].join(" ");
  const doctorReady = [
    `Covered period: ${rangeText}.`,
    activity?.summary,
    topAttention,
    symptoms.length ? symptomSummary.doctorReadyNote : "No symptom events logged in HealthLens.",
    "This summary is for tracking and doctor discussion only; wearable data can be incomplete or affected by device accuracy."
  ]
    .filter(Boolean)
    .join(" ");

  return {
    title: "Your Health Story",
    oneLineSummary: sanitizeGeneratedHealthText(oneLine),
    detailedSummary: sanitizeGeneratedHealthText(detailed),
    topPositivePattern: activity?.plainLanguage ? sanitizeGeneratedHealthText(activity.plainLanguage) : undefined,
    topAttentionPattern: topAttention ? sanitizeGeneratedHealthText(topAttention) : undefined,
    symptomPattern: sanitizeGeneratedHealthText(symptomPattern),
    dataLimitations: dataLimitations.map(sanitizeGeneratedHealthText),
    doctorReadySummary: sanitizeGeneratedHealthText(doctorReady)
  };
}
