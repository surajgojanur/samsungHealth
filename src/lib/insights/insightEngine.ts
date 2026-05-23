import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { inferDateRange } from "@/lib/analytics/baseline";
import { sortInsights } from "./insightScoring";
import { generateActivityInsights } from "./activityInsights";
import { generateAnomalyInsights } from "./anomalyInsights";
import { generateBaselineInsights } from "./baselineInsights";
import { generateBodyInsights } from "./bodyInsights";
import { generateCorrelationInsights } from "./correlationInsights";
import { generateDataQualityInsights } from "./dataQualityInsights";
import { generateHeartInsights } from "./heartInsights";
import { generateNutritionWaterInsights } from "./nutritionWaterInsights";
import { generateSleepInsights } from "./sleepInsights";
import { generateSpo2Insights } from "./spo2Insights";
import { generateSymptomInsights } from "./symptomInsights";
import { generateWorkoutInsights } from "./workoutInsights";
import { assertNoForbiddenMedicalClaims } from "@/lib/safety/medicalClaimGuard";

export function generateInsights(input: InsightEngineInput): HealthInsight[] {
  const dateRange = input.dateRange ?? input.report?.dateRange ?? inferDateRange(input.data, input.symptoms ?? []);
  const fullInput = { ...input, dateRange };
  const insights = [
    ...generateDataQualityInsights(fullInput),
    ...generateActivityInsights(fullInput),
    ...generateHeartInsights(fullInput),
    ...generateSleepInsights(fullInput),
    ...generateWorkoutInsights(fullInput),
    ...generateSpo2Insights(fullInput),
    ...generateBodyInsights(fullInput),
    ...generateNutritionWaterInsights(fullInput),
    ...generateSymptomInsights(fullInput),
    ...generateAnomalyInsights(fullInput),
    ...generateCorrelationInsights(fullInput),
    ...generateBaselineInsights(fullInput)
  ];
  const deduped = new Map<string, HealthInsight>();
  insights.forEach((insight) => deduped.set(insight.id, insight));
  const sorted = sortInsights([...deduped.values()]);
  sorted.forEach((insight) => {
    assertNoForbiddenMedicalClaims(
      [insight.title, insight.summary, insight.plainLanguage, insight.whyItMatters, insight.suggestedUserAction, insight.doctorDiscussion, ...(insight.limitations ?? [])]
        .filter(Boolean)
        .join(" ")
    );
  });
  return sorted;
}

export function topDoctorDiscussionInsights(insights: HealthInsight[], limit = 5): HealthInsight[] {
  return insights.filter((insight) => insight.doctorDiscussion || insight.category === "doctor_discussion").slice(0, limit);
}

