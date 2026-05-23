import { pearson } from "@/lib/analytics";
import { buildBaselineMetrics, type MetricPoint } from "./baseline";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";

export interface CorrelationResult {
  id: string;
  metricX: string;
  metricY: string;
  coefficient?: number;
  sampleSize: number;
  confidence: "high" | "medium" | "low";
  direction: "positive" | "negative" | "none" | "insufficient";
  plainLanguage: string;
  limitation?: string;
  points: Array<{ date: string; x: number; y: number }>;
}

const labels: Record<string, string> = {
  sleepDuration: "sleep duration",
  steps: "steps",
  activeMinutes: "active minutes",
  workoutLoad: "estimated workout load",
  avgHeartRate: "average heart rate",
  minHeartRate: "minimum heart rate",
  maxHeartRate: "maximum heart rate",
  spo2: "SpO2",
  weight: "body weight",
  symptomSeverity: "symptom severity",
  symptomCount: "symptom count"
};

function confidence(sampleSize: number): CorrelationResult["confidence"] {
  if (sampleSize >= 21) return "high";
  if (sampleSize >= 8) return "medium";
  return "low";
}

function direction(coefficient: number | undefined, sampleSize: number): CorrelationResult["direction"] {
  if (sampleSize < 5 || coefficient === undefined) return "insufficient";
  if (Math.abs(coefficient) < 0.25) return "none";
  return coefficient > 0 ? "positive" : "negative";
}

function alignPoints(x: MetricPoint[], y: MetricPoint[]): Array<{ date: string; x: number; y: number }> {
  const yByDate = new Map(y.map((point) => [point.date, point.value]));
  return x.flatMap((point) => {
    const yValue = yByDate.get(point.date);
    return yValue === undefined ? [] : [{ date: point.date, x: point.value, y: yValue }];
  });
}

export function calculateCorrelation(metricX: string, metricY: string, x: MetricPoint[], y: MetricPoint[]): CorrelationResult {
  const points = alignPoints(x, y);
  const coefficient = pearson(points.map((point) => point.x), points.map((point) => point.y));
  const sampleSize = points.length;
  const resultDirection = direction(coefficient, sampleSize);
  const xLabel = labels[metricX] ?? metricX;
  const yLabel = labels[metricY] ?? metricY;
  const plainLanguage =
    resultDirection === "insufficient"
      ? `Not enough overlapping ${xLabel} and ${yLabel} data for reliable relationship analysis.`
      : resultDirection === "none"
        ? `${xLabel} and ${yLabel} did not show a clear pattern in this dataset.`
        : resultDirection === "positive"
          ? `Higher ${xLabel} and higher ${yLabel} appeared together in this dataset.`
          : `Higher ${xLabel} and lower ${yLabel} appeared together in this dataset.`;
  return {
    id: `${metricX}-${metricY}`,
    metricX,
    metricY,
    coefficient,
    sampleSize,
    confidence: confidence(sampleSize),
    direction: resultDirection,
    plainLanguage,
    limitation: sampleSize < 8 ? "Relationship analysis is limited because the overlapping sample size is small." : undefined,
    points
  };
}

export function calculateHealthCorrelations(data: NormalizedHealthData, symptoms: SymptomLog[] = []): CorrelationResult[] {
  const baselines = buildBaselineMetrics(data, symptoms);
  const pairs: Array<[string, string]> = [
    ["sleepDuration", "avgHeartRate"],
    ["sleepDuration", "steps"],
    ["steps", "avgHeartRate"],
    ["workoutLoad", "avgHeartRate"],
    ["workoutLoad", "sleepDuration"],
    ["spo2", "sleepDuration"],
    ["symptomCount", "sleepDuration"],
    ["symptomCount", "steps"],
    ["symptomSeverity", "avgHeartRate"],
    ["weight", "steps"]
  ];
  return pairs.map(([x, y]) => calculateCorrelation(x, y, baselines[x]?.points ?? [], baselines[y]?.points ?? []));
}

