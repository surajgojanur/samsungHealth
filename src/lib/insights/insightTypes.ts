import type { NormalizedHealthData, ParserReport, SymptomLog } from "@/types/health";

export type InsightCategory =
  | "overview"
  | "heart"
  | "sleep"
  | "activity"
  | "workout"
  | "spo2"
  | "body"
  | "nutrition"
  | "water"
  | "stress"
  | "symptom"
  | "data_quality"
  | "doctor_discussion";

export type InsightTone = "positive" | "neutral" | "attention" | "limited_data";

export type InsightConfidence = "high" | "medium" | "low";

export interface HealthInsight {
  id: string;
  category: InsightCategory;
  title: string;
  summary: string;
  plainLanguage: string;
  whyItMatters: string;
  supportingMetric?: string;
  comparison?: string;
  confidence: InsightConfidence;
  tone: InsightTone;
  dateRange?: {
    start: string;
    end: string;
  };
  sourceMetrics: string[];
  suggestedUserAction?: string;
  doctorDiscussion?: string;
  limitations?: string[];
  relatedCharts?: string[];
  priorityScore: number;
}

export interface InsightEngineInput {
  data: NormalizedHealthData;
  symptoms?: SymptomLog[];
  report?: ParserReport;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface HealthStory {
  title: string;
  oneLineSummary: string;
  detailedSummary: string;
  topPositivePattern?: string;
  topAttentionPattern?: string;
  symptomPattern?: string;
  dataLimitations: string[];
  doctorReadySummary: string;
}

export interface DoctorOnePageSummary {
  title: string;
  dateRange: string;
  dataSources: string[];
  dataQualityNote: string;
  topObservations: string[];
  symptomSummary: string;
  patternSummary: string;
  chartRecommendations: string[];
  userNotesPrompt: string;
  questionsToAsk: string[];
  disclaimer: string;
}

