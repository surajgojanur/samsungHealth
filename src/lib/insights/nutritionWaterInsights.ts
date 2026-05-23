import { average } from "@/lib/analytics";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";

export function generateNutritionWaterInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const insights: HealthInsight[] = [];
  const nutritionDays = new Set(data.nutrition.map((entry) => entry.localDate)).size;
  const waterDays = new Set(data.water.map((entry) => entry.localDate)).size;

  if (data.nutrition.length < 10) {
    insights.push(
      makeInsight({
        id: "nutrition-sparse",
        category: "nutrition",
        title: "Nutrition data is sparse",
        summary: `Nutrition was logged ${data.nutrition.length} times across ${nutritionDays} days.`,
        plainLanguage: "Nutrition data exists, but not enough for strong insights.",
        whyItMatters: "Food logs are usually partial. Sparse logs should not be compared too strongly with sleep, activity, or symptoms.",
        supportingMetric: `${data.nutrition.length} entries`,
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["nutrition"],
        limitations: ["Nutrition insights are not reliable unless logging is consistent."],
        priorityScore: 55
      })
    );
  } else {
    const calories = average(data.nutrition.map((entry) => entry.caloriesKcal));
    const protein = average(data.nutrition.map((entry) => entry.proteinG));
    const carbs = average(data.nutrition.map((entry) => entry.carbohydrateG));
    const fat = average(data.nutrition.map((entry) => entry.fatG));
    insights.push(
      makeInsight({
        id: "nutrition-summary",
        category: "nutrition",
        title: "Nutrition logging summary",
        summary: `Nutrition was logged on ${nutritionDays} days${calories ? ` with an average of ${formatNumber(calories)} kcal per entry` : ""}.`,
        plainLanguage: "These numbers reflect logged entries only, not necessarily everything eaten.",
        whyItMatters: "Consistent nutrition logs can add context to energy, workout, sleep, and symptom patterns.",
        supportingMetric: [protein ? `${formatNumber(protein, 1)}g protein` : "", carbs ? `${formatNumber(carbs, 1)}g carbs` : "", fat ? `${formatNumber(fat, 1)}g fat` : ""].filter(Boolean).join(" / "),
        confidence: confidenceFromSamples(nutritionDays, 21, 7),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["nutrition"],
        limitations: nutritionDays < 14 ? ["Nutrition logging was not frequent enough for strong pattern claims."] : undefined,
        priorityScore: 42
      })
    );
  }

  if (data.water.length < 10) {
    insights.push(
      makeInsight({
        id: "water-sparse",
        category: "water",
        title: "Water logging is limited",
        summary: `You logged water ${data.water.length} times in this export.`,
        plainLanguage: `You logged water only ${data.water.length} times in this export, so hydration insights are not reliable yet.`,
        whyItMatters: "Hydration context can be useful for doctor discussion, but only when logs are consistent.",
        supportingMetric: `${data.water.length} water logs`,
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["water"],
        limitations: ["Water logs are too sparse for reliable trend analysis."],
        priorityScore: 54
      })
    );
  } else {
    const total = data.water.reduce((sum, entry) => sum + entry.amountMl, 0);
    insights.push(
      makeInsight({
        id: "water-summary",
        category: "water",
        title: "Water logging summary",
        summary: `Water was logged on ${waterDays} days, totaling ${formatNumber(total)} ml.`,
        plainLanguage: "This summarizes recorded water logs only.",
        whyItMatters: "Consistent water logs can add context to activity, sleep, and symptom notes.",
        supportingMetric: `${formatNumber(total)} ml total`,
        confidence: confidenceFromSamples(waterDays, 21, 7),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["water"],
        priorityScore: 38
      })
    );
  }

  return insights;
}

