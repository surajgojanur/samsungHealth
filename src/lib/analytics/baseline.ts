import { average, dailyHeartRate, dailySpo2, workoutLoadEstimate } from "@/lib/analytics";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";

export interface MetricPoint {
  date: string;
  value: number;
}

export interface MetricBaseline {
  metric: string;
  points: MetricPoint[];
  median?: number;
  average?: number;
  standardDeviation?: number;
  rolling7: MetricPoint[];
  rolling30: MetricPoint[];
  percentile25?: number;
  percentile75?: number;
}

export interface BaselinePoint extends MetricPoint {
  zScore?: number;
  rolling7?: number;
  rolling30?: number;
  percentileBand: "low" | "typical" | "high" | "unknown";
}

export function median(values: number[]): number | undefined {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return undefined;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export function standardDeviation(values: number[]): number | undefined {
  const mean = average(values);
  if (mean === undefined || values.length < 2) return undefined;
  const variance = average(values.map((value) => (value - mean) ** 2));
  return variance === undefined ? undefined : Math.sqrt(variance);
}

export function percentile(values: number[], p: number): number | undefined {
  const sorted = values.filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return undefined;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

export function rollingMetricAverage(points: MetricPoint[], windowSize: number): MetricPoint[] {
  return points.map((point, index) => ({
    date: point.date,
    value: average(points.slice(Math.max(0, index - windowSize + 1), index + 1).map((item) => item.value)) ?? point.value
  }));
}

export function calculateMetricBaseline(metric: string, points: MetricPoint[]): MetricBaseline {
  const sorted = [...points].filter((point) => Number.isFinite(point.value)).sort((a, b) => a.date.localeCompare(b.date));
  const values = sorted.map((point) => point.value);
  return {
    metric,
    points: sorted,
    median: median(values),
    average: average(values),
    standardDeviation: standardDeviation(values),
    rolling7: rollingMetricAverage(sorted, 7),
    rolling30: rollingMetricAverage(sorted, 30),
    percentile25: percentile(values, 0.25),
    percentile75: percentile(values, 0.75)
  };
}

export function attachBaselineStats(baseline: MetricBaseline): BaselinePoint[] {
  const rolling7 = new Map(baseline.rolling7.map((point) => [point.date, point.value]));
  const rolling30 = new Map(baseline.rolling30.map((point) => [point.date, point.value]));
  return baseline.points.map((point) => {
    const z = baseline.average !== undefined && baseline.standardDeviation ? (point.value - baseline.average) / baseline.standardDeviation : undefined;
    const band =
      baseline.percentile25 === undefined || baseline.percentile75 === undefined
        ? "unknown"
        : point.value < baseline.percentile25
          ? "low"
          : point.value > baseline.percentile75
            ? "high"
            : "typical";
    return {
      ...point,
      zScore: z,
      rolling7: rolling7.get(point.date),
      rolling30: rolling30.get(point.date),
      percentileBand: band
    };
  });
}

export function dailySleepMinutes(data: NormalizedHealthData): MetricPoint[] {
  const grouped = new Map<string, number>();
  data.sleep.forEach((session) => grouped.set(session.localDate, (grouped.get(session.localDate) ?? 0) + session.durationMinutes));
  return [...grouped.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
}

export function dailyActiveMinutes(data: NormalizedHealthData): MetricPoint[] {
  return data.activity
    .filter((day) => day.activeTimeMs !== undefined)
    .map((day) => ({ date: day.date, value: (day.activeTimeMs ?? 0) / 60_000 }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function dailyWorkoutLoad(data: NormalizedHealthData): MetricPoint[] {
  const grouped = new Map<string, number>();
  workoutLoadEstimate(data.workouts).forEach((point) => grouped.set(point.date, (grouped.get(point.date) ?? 0) + point.load));
  return [...grouped.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
}

export function dailySymptomCount(symptoms: SymptomLog[] = []): MetricPoint[] {
  const grouped = new Map<string, number>();
  symptoms.forEach((symptom) => grouped.set(symptom.localDate, (grouped.get(symptom.localDate) ?? 0) + 1));
  return [...grouped.entries()].map(([date, value]) => ({ date, value })).sort((a, b) => a.date.localeCompare(b.date));
}

export function dailySymptomSeverity(symptoms: SymptomLog[] = []): MetricPoint[] {
  const grouped = new Map<string, number[]>();
  symptoms.forEach((symptom) => {
    if (symptom.severity !== undefined) grouped.set(symptom.localDate, [...(grouped.get(symptom.localDate) ?? []), symptom.severity]);
  });
  return [...grouped.entries()].map(([date, values]) => ({ date, value: average(values) ?? 0 })).sort((a, b) => a.date.localeCompare(b.date));
}

export function buildBaselineMetrics(data: NormalizedHealthData, symptoms: SymptomLog[] = []): Record<string, MetricBaseline> {
  const dailyHr = dailyHeartRate(data.heartRate);
  const minHr = new Map<string, number>();
  const maxHr = new Map<string, number>();
  data.heartRate.forEach((sample) => {
    minHr.set(sample.localDate, Math.min(minHr.get(sample.localDate) ?? sample.bpm, sample.bpm));
    maxHr.set(sample.localDate, Math.max(maxHr.get(sample.localDate) ?? sample.bpm, sample.bpm));
  });
  const weightPoints = data.body
    .filter((sample) => sample.weightKg !== undefined)
    .map((sample) => ({ date: sample.localDate, value: sample.weightKg! }));
  const metrics: Record<string, MetricPoint[]> = {
    steps: data.activity.filter((day) => day.steps !== undefined).map((day) => ({ date: day.date, value: day.steps! })),
    activeMinutes: dailyActiveMinutes(data),
    sleepDuration: dailySleepMinutes(data),
    avgHeartRate: dailyHr.map((point) => ({ date: point.date, value: point.bpm })),
    minHeartRate: [...minHr.entries()].map(([date, value]) => ({ date, value })),
    maxHeartRate: [...maxHr.entries()].map(([date, value]) => ({ date, value })),
    workoutLoad: dailyWorkoutLoad(data),
    spo2: dailySpo2(data.spo2).map((point) => ({ date: point.date, value: point.spo2 })),
    weight: weightPoints,
    symptomCount: dailySymptomCount(symptoms),
    symptomSeverity: dailySymptomSeverity(symptoms)
  };
  return Object.fromEntries(Object.entries(metrics).map(([metric, points]) => [metric, calculateMetricBaseline(metric, points)]));
}

export function daysBetween(start: string, end: string): string[] {
  const output: string[] = [];
  let cursor = new Date(`${start.slice(0, 10)}T00:00:00Z`);
  const stop = new Date(`${end.slice(0, 10)}T00:00:00Z`);
  while (cursor <= stop) {
    output.push(cursor.toISOString().slice(0, 10));
    cursor = new Date(cursor.getTime() + 86_400_000);
  }
  return output;
}

export function inferDateRange(data: NormalizedHealthData, symptoms: SymptomLog[] = []): { start: string; end: string } | undefined {
  const dates = [
    ...data.activity.map((item) => item.date),
    ...data.heartRate.map((item) => item.localDate),
    ...data.sleep.map((item) => item.localDate),
    ...data.workouts.map((item) => item.localDate),
    ...data.spo2.map((item) => item.localDate),
    ...data.body.map((item) => item.localDate),
    ...data.nutrition.map((item) => item.localDate),
    ...data.water.map((item) => item.localDate),
    ...data.stress.map((item) => item.localDate),
    ...symptoms.map((item) => item.localDate)
  ].filter(Boolean).sort();
  return dates.length ? { start: dates[0], end: dates[dates.length - 1] } : undefined;
}

