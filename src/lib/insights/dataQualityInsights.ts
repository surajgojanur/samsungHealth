import { dataCoverageScore } from "@/lib/analytics";
import type { HealthInsight, InsightEngineInput } from "./insightTypes";
import { makeInsight } from "./insightText";

export function generateDataQualityInsights({ data, report, dateRange }: InsightEngineInput): HealthInsight[] {
  const coverage = dataCoverageScore(data);
  const insights: HealthInsight[] = [
    makeInsight({
      id: "data-quality-coverage",
      category: "data_quality",
      title: "Data coverage score",
      summary: `Core data coverage is ${coverage}%.`,
      plainLanguage: coverage >= 70 ? "Your upload has enough core categories for useful general insights." : "Some important categories are missing or sparse, so HealthLens will be cautious.",
      whyItMatters: "Insight confidence depends on which files were present and how many records were parsed.",
      supportingMetric: `${coverage}% coverage`,
      confidence: "high",
      tone: coverage >= 70 ? "positive" : "limited_data",
      dateRange,
      sourceMetrics: ["parser report", "normalized records"],
      limitations: coverage < 70 ? ["Missing categories reduce insight confidence."] : undefined,
      priorityScore: coverage >= 70 ? 50 : 74
    }),
    makeInsight({
      id: "privacy-local-first",
      category: "data_quality",
      title: "Processed locally",
      summary: "The app processes uploaded Samsung Health files in the browser by default.",
      plainLanguage: "Your raw files do not need to leave your device for the standard HealthLens workflow.",
      whyItMatters: "Health data is sensitive, so local-first processing reduces exposure.",
      supportingMetric: "Local-first parser",
      confidence: "high",
      tone: "positive",
      dateRange,
      sourceMetrics: ["privacy model"],
      priorityScore: 46
    })
  ];

  if (report?.warnings.length) {
    insights.push(
      makeInsight({
        id: "data-quality-parser-warnings",
        category: "data_quality",
        title: "Parser warnings found",
        summary: `${report.warnings.length} parser warnings were found.`,
        plainLanguage: "Some files may have been skipped, partially parsed, or treated cautiously.",
        whyItMatters: "Parser warnings explain why some charts or insights may be incomplete.",
        supportingMetric: `${report.warnings.length} warnings`,
        confidence: "high",
        tone: "attention",
        dateRange,
        sourceMetrics: ["parser report"],
        limitations: report.warnings.slice(0, 3).map((warning) => warning.message),
        priorityScore: 76
      })
    );
  }

  const sparse = [
    ["nutrition", data.nutrition.length],
    ["water", data.water.length],
    ["stress", data.stress.length],
    ["SpO2", data.spo2.length],
    ["body metrics", data.body.length]
  ].filter(([, count]) => Number(count) < 10);
  if (sparse.length) {
    insights.push(
      makeInsight({
        id: "data-quality-sparse-categories",
        category: "data_quality",
        title: "Sparse categories",
        summary: `${sparse.map(([name]) => name).join(", ")} have limited records.`,
        plainLanguage: "HealthLens will show these categories as limited rather than making strong claims.",
        whyItMatters: "Sparse data can make normal gaps look like meaningful patterns.",
        confidence: "high",
        tone: "limited_data",
        dateRange,
        sourceMetrics: ["normalized records"],
        limitations: sparse.map(([name, count]) => `${name}: ${count} records`),
        priorityScore: 70
      })
    );
  }

  insights.push(
    makeInsight({
      id: "stress-experimental",
      category: "stress",
      title: "Experimental wellness estimate",
      summary: data.stress.length
        ? `${data.stress.length} stress, breathing, mood, or vitality records were found.`
        : "No stress, breathing, mood, or vitality records were found.",
      plainLanguage: data.stress.length
        ? "Stress and recovery signals are experimental because Samsung exports can be sparse or proprietary."
        : "No stress or recovery wellness records were available in this export.",
      whyItMatters: "These records can add context, but HealthLens should be cautious when the category is sparse or device-specific.",
      supportingMetric: `${data.stress.length} records`,
      confidence: data.stress.length >= 30 ? "medium" : "low",
      tone: data.stress.length >= 30 ? "neutral" : "limited_data",
      dateRange,
      sourceMetrics: ["stress", "breathing", "mood", "vitality"],
      limitations: data.stress.length < 30 ? ["Stress/recovery records are too sparse for a strong estimate."] : undefined,
      priorityScore: data.stress.length >= 30 ? 36 : 52
    })
  );

  return insights;
}
