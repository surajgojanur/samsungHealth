import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { confidenceFromSamples, formatNumber, makeInsight } from "./insightText";

export function generateBodyInsights({ data, dateRange }: InsightEngineInput): HealthInsight[] {
  const weights = data.body.filter((sample) => sample.weightKg !== undefined).sort((a, b) => a.localDate.localeCompare(b.localDate));
  const bodyFat = data.body.filter((sample) => sample.bodyFatPercent !== undefined).sort((a, b) => a.localDate.localeCompare(b.localDate));
  const muscle = data.body.filter((sample) => sample.skeletalMuscleMassKg !== undefined).sort((a, b) => a.localDate.localeCompare(b.localDate));

  if (!data.body.length) {
    return [
      makeInsight({
        id: "body-missing",
        category: "body",
        title: "No body metrics found",
        summary: "No weight, height, or body-composition records were found in this export.",
        plainLanguage: "Body metric insights need Samsung Health body measurement files.",
        whyItMatters: "Body metrics are optional, but trend context can help interpret activity and nutrition logs.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["body metrics"],
        limitations: ["No parsed body metric records were available."],
        priorityScore: 44
      })
    ];
  }

  const insights: HealthInsight[] = [];
  if (weights.length) {
    const first = weights[0].weightKg!;
    const latest = weights.at(-1)!.weightKg!;
    const change = latest - first;
    insights.push(
      makeInsight({
        id: "body-weight-trend",
        category: "body",
        title: "Weight trend",
        summary: `Your latest weight was ${formatNumber(latest, 1)} kg, a ${change >= 0 ? "gain" : "decrease"} of ${formatNumber(Math.abs(change), 1)} kg from the first record.`,
        plainLanguage: "This is a neutral trend summary based only on measurements in the export.",
        whyItMatters: "Weight trend can provide context for activity and nutrition patterns when measured consistently.",
        supportingMetric: `${formatNumber(latest, 1)} kg latest`,
        confidence: confidenceFromSamples(weights.length, 8, 3),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["weight"],
        limitations: weights.length < 3 ? ["Weight trend is limited because there are fewer than 3 measurements."] : undefined,
        relatedCharts: ["body"],
        priorityScore: 50
      })
    );
  }

  if (bodyFat.length >= 2) {
    const first = bodyFat[0].bodyFatPercent!;
    const latest = bodyFat.at(-1)!.bodyFatPercent!;
    insights.push(
      makeInsight({
        id: "body-fat-trend",
        category: "body",
        title: "Body fat trend",
        summary: `Body fat changed by ${formatNumber(latest - first, 1)} percentage points across available records.`,
        plainLanguage: "This is a device-reported body-composition trend and can vary by measurement conditions.",
        whyItMatters: "Body-composition trends are only useful when measurements are consistent and repeated.",
        supportingMetric: `${formatNumber(latest, 1)}% latest`,
        confidence: confidenceFromSamples(bodyFat.length, 8, 3),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["body fat percent"],
        limitations: bodyFat.length < 8 ? ["Body-composition data is sparse, so treat this as a rough trend."] : undefined,
        priorityScore: 38
      })
    );
  }

  if (muscle.length >= 2) {
    const first = muscle[0].skeletalMuscleMassKg!;
    const latest = muscle.at(-1)!.skeletalMuscleMassKg!;
    insights.push(
      makeInsight({
        id: "body-muscle-trend",
        category: "body",
        title: "Muscle mass trend",
        summary: `Skeletal muscle mass changed by ${formatNumber(latest - first, 1)} kg across available records.`,
        plainLanguage: "This is a trend from device-reported body-composition records.",
        whyItMatters: "Consistent body-composition measurements can add context to workout and nutrition patterns.",
        supportingMetric: `${formatNumber(latest, 1)} kg latest`,
        confidence: confidenceFromSamples(muscle.length, 8, 3),
        tone: "neutral",
        dateRange,
        sourceMetrics: ["skeletal muscle mass"],
        limitations: muscle.length < 8 ? ["Muscle mass data is sparse, so treat this as a rough trend."] : undefined,
        priorityScore: 36
      })
    );
  }

  const latestWeight = weights.at(-1)?.weightKg;
  const latestHeight = [...data.body].reverse().find((sample) => sample.heightCm !== undefined)?.heightCm;
  if (latestWeight && latestHeight) {
    const bmi = latestWeight / (latestHeight / 100) ** 2;
    insights.push(
      makeInsight({
        id: "body-bmi-neutral",
        category: "body",
        title: "BMI calculation available",
        summary: `BMI can be calculated from the latest height and weight as ${formatNumber(bmi, 1)}.`,
        plainLanguage: "HealthLens shows this only as a calculation and does not apply labels.",
        whyItMatters: "Some users want BMI included in doctor discussion, but it should be interpreted with context.",
        supportingMetric: `${formatNumber(bmi, 1)} calculated BMI`,
        confidence: "medium",
        tone: "neutral",
        dateRange,
        sourceMetrics: ["height", "weight"],
        priorityScore: 32
      })
    );
  }

  if (data.body.length < 4) {
    insights.push(
      makeInsight({
        id: "body-sparse",
        category: "data_quality",
        title: "Body metrics are sparse",
        summary: `Only ${data.body.length} body metric records were found.`,
        plainLanguage: "Body trend insights are limited until there are more repeated measurements.",
        whyItMatters: "Sparse body data can make normal measurement noise look like a trend.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["body metrics"],
        limitations: ["More body metric records are needed for stronger trends."],
        priorityScore: 48
      })
    );
  }

  return insights;
}

