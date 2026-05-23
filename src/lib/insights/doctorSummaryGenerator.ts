import { computeDashboardMetrics } from "@/lib/analytics";
import type { NormalizedHealthData, ParserReport, SymptomLog } from "@/types/health";
import type { DoctorOnePageSummary, HealthInsight } from "./insightTypes";
import { analyzeSymptomPatterns } from "./symptomInsights";
import { generateInsights } from "./insightEngine";
import { sanitizeGeneratedHealthText } from "@/lib/safety/medicalClaimGuard";

export const doctorReportDisclaimer =
  "This report is based on user-exported wearable wellness data. It may be incomplete or inaccurate and is for personal tracking and doctor discussion only. It does not diagnose, treat, or replace medical advice.";

function sourceList(data: NormalizedHealthData): string[] {
  return [
    data.activity.length ? "Daily activity and steps" : "",
    data.heartRate.length ? "Heart rate" : "",
    data.sleep.length ? "Sleep" : "",
    data.workouts.length ? "Workouts" : "",
    data.spo2.length ? "SpO2" : "",
    data.body.length ? "Body metrics" : "",
    data.nutrition.length ? "Nutrition" : "",
    data.water.length ? "Water" : "",
    data.stress.length ? "Stress/recovery wellness records" : "",
    "Manual symptom log"
  ].filter(Boolean);
}

export function generateDoctorOnePageSummary({
  data,
  symptoms = [],
  report,
  insights
}: {
  data: NormalizedHealthData;
  symptoms?: SymptomLog[];
  report?: ParserReport;
  insights?: HealthInsight[];
}): DoctorOnePageSummary {
  const metrics = computeDashboardMetrics(data, report?.warnings.length ?? 0);
  const generatedInsights = insights ?? generateInsights({ data, symptoms, report, dateRange: report?.dateRange ?? metrics.dateRange });
  const symptomSummary = analyzeSymptomPatterns(data, symptoms);
  const range = metrics.dateRange ? `${metrics.dateRange.start.slice(0, 10)} to ${metrics.dateRange.end.slice(0, 10)}` : "Not enough dated records";
  const topObservations = generatedInsights
    .filter((insight) => insight.category !== "data_quality")
    .slice(0, 5)
    .map((insight) => `${insight.title}: ${insight.summary}`);
  const dataQualityNote = [
    `Coverage score: ${metrics.coverageScore}%.`,
    report?.warnings.length ? `${report.warnings.length} parser warnings were found.` : "No parser warnings were found.",
    "Device and account identifiers are not included in this summary."
  ].join(" ");
  const patternSummary =
    generatedInsights
      .filter((insight) => insight.doctorDiscussion)
      .slice(0, 3)
      .map((insight) => insight.doctorDiscussion)
      .join(" ") || "No strong doctor-discussion pattern was found yet.";

  return {
    title: "HealthLens Doctor Discussion One-Page Summary",
    dateRange: range,
    dataSources: sourceList(data),
    dataQualityNote: sanitizeGeneratedHealthText(dataQualityNote),
    topObservations: topObservations.map(sanitizeGeneratedHealthText),
    symptomSummary: sanitizeGeneratedHealthText(symptomSummary.doctorReadyNote),
    patternSummary: sanitizeGeneratedHealthText(patternSummary),
    chartRecommendations: ["Heart rate trend", "Sleep duration", "Daily steps", "Symptom timeline"],
    userNotesPrompt: "User notes: ______________________________________________________________",
    questionsToAsk: [
      "Could these symptoms be related to sleep, activity load, caffeine, stress, hydration, or device accuracy?",
      "Are these wearable trends useful for further evaluation?",
      "Should I track any additional symptoms or measurements?"
    ],
    disclaimer: doctorReportDisclaimer
  };
}
