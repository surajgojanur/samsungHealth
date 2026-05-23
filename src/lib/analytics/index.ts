import type { DailyActivity, HeartRateSample, NormalizedHealthData, SleepSession, SpO2Sample, WorkoutSession } from "@/types/health";

export interface DashboardMetrics {
  dateRange?: { start: string; end: string };
  coverageScore: number;
  averageDailySteps?: number;
  averageSleepHours?: number;
  averageHeartRate?: number;
  workoutCount: number;
  averageSpo2?: number;
  latestWeightKg?: number;
  missingCategories: number;
  warningCount: number;
  insights: string[];
}

export function average(values: Array<number | undefined>): number | undefined {
  const valid = values.filter((value): value is number => value !== undefined && Number.isFinite(value));
  if (valid.length === 0) return undefined;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

export function rollingAverage<T>(items: T[], value: (item: T) => number | undefined, windowSize: number): Array<number | undefined> {
  return items.map((_, index) => average(items.slice(Math.max(0, index - windowSize + 1), index + 1).map(value)));
}

export function zScore(value: number, baseline: number[], minSamples = 7): number | undefined {
  if (baseline.length < minSamples) return undefined;
  const mean = average(baseline);
  if (mean === undefined) return undefined;
  const variance = average(baseline.map((sample) => (sample - mean) ** 2));
  if (!variance) return undefined;
  return (value - mean) / Math.sqrt(variance);
}

export function pearson(xs: number[], ys: number[]): number | undefined {
  const n = Math.min(xs.length, ys.length);
  if (n < 3) return undefined;
  const x = xs.slice(0, n);
  const y = ys.slice(0, n);
  const xAvg = average(x);
  const yAvg = average(y);
  if (xAvg === undefined || yAvg === undefined) return undefined;
  const numerator = x.reduce((sum, xi, index) => sum + (xi - xAvg) * (y[index] - yAvg), 0);
  const denomX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - xAvg) ** 2, 0));
  const denomY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - yAvg) ** 2, 0));
  return denomX && denomY ? numerator / (denomX * denomY) : undefined;
}

export function missingDays(dates: string[]): string[] {
  const unique = [...new Set(dates)].sort();
  if (unique.length < 2) return [];
  const missing: string[] = [];
  let cursor = new Date(`${unique[0]}T00:00:00Z`);
  const end = new Date(`${unique[unique.length - 1]}T00:00:00Z`);
  const set = new Set(unique);
  while (cursor <= end) {
    const day = cursor.toISOString().slice(0, 10);
    if (!set.has(day)) missing.push(day);
    cursor = new Date(cursor.getTime() + 86_400_000);
  }
  return missing;
}

export function dataCoverageScore(data: NormalizedHealthData): number {
  const core = [
    data.activity.length > 0,
    data.heartRate.length > 0,
    data.sleep.length > 0,
    data.workouts.length > 0,
    data.spo2.length > 0,
    data.body.length > 0
  ];
  return Math.round((core.filter(Boolean).length / core.length) * 100);
}

export function activityConsistencyScore(activity: DailyActivity[]): number {
  if (activity.length === 0) return 0;
  const activeDays = activity.filter((day) => (day.steps ?? 0) >= 1000).length;
  return Math.round((activeDays / activity.length) * 100);
}

export function sleepConsistencyScore(sleep: SleepSession[]): number {
  if (sleep.length < 7) return 0;
  const durations = sleep.map((session) => session.durationMinutes);
  const mean = average(durations) ?? 0;
  const withinBand = durations.filter((duration) => Math.abs(duration - mean) <= 90).length;
  return Math.round((withinBand / durations.length) * 100);
}

export function workoutLoadEstimate(workouts: WorkoutSession[]): Array<{ date: string; load: number }> {
  return workouts.map((workout) => ({
    date: workout.localDate,
    load: (workout.durationMinutes ?? 0) * ((workout.avgHeartRate ?? workout.maxHeartRate ?? 100) / 100)
  }));
}

export function dailyHeartRate(heartRate: HeartRateSample[]): Array<{ date: string; bpm: number }> {
  const grouped = new Map<string, number[]>();
  heartRate.forEach((sample) => grouped.set(sample.localDate, [...(grouped.get(sample.localDate) ?? []), sample.bpm]));
  return [...grouped.entries()].map(([date, values]) => ({ date, bpm: average(values) ?? 0 })).sort((a, b) => a.date.localeCompare(b.date));
}

export function dailySpo2(spo2: SpO2Sample[]): Array<{ date: string; spo2: number }> {
  const grouped = new Map<string, number[]>();
  spo2.forEach((sample) => grouped.set(sample.localDate, [...(grouped.get(sample.localDate) ?? []), sample.spo2]));
  return [...grouped.entries()].map(([date, values]) => ({ date, spo2: average(values) ?? 0 })).sort((a, b) => a.date.localeCompare(b.date));
}

export function computeDashboardMetrics(data: NormalizedHealthData, warningCount: number): DashboardMetrics {
  const allDates = [
    ...data.activity.map((item) => item.date),
    ...data.heartRate.map((item) => item.localDate),
    ...data.sleep.map((item) => item.localDate),
    ...data.workouts.map((item) => item.localDate),
    ...data.spo2.map((item) => item.localDate)
  ].sort();
  const missingCategories = [
    data.activity.length,
    data.heartRate.length,
    data.sleep.length,
    data.workouts.length,
    data.spo2.length,
    data.body.length
  ].filter((count) => count === 0).length + 3;
  const averageDailySteps = average(data.activity.map((day) => day.steps));
  const averageSleepHours = average(data.sleep.map((session) => session.durationMinutes / 60));
  const averageHeartRate = average(data.heartRate.map((sample) => sample.bpm));
  const averageSpo2 = average(data.spo2.map((sample) => sample.spo2));
  const latestWeightKg = [...data.body].reverse().find((item) => item.weightKg !== undefined)?.weightKg;
  return {
    dateRange: allDates.length ? { start: allDates[0], end: allDates[allDates.length - 1] } : undefined,
    coverageScore: dataCoverageScore(data),
    averageDailySteps,
    averageSleepHours,
    averageHeartRate,
    workoutCount: data.workouts.length,
    averageSpo2,
    latestWeightKg,
    missingCategories,
    warningCount,
    insights: buildInsights(data, { averageDailySteps, averageSleepHours, averageHeartRate, averageSpo2 })
  };
}

function buildInsights(
  data: NormalizedHealthData,
  metrics: Pick<DashboardMetrics, "averageDailySteps" | "averageSleepHours" | "averageHeartRate" | "averageSpo2">
): string[] {
  const insights: string[] = [];
  if (metrics.averageDailySteps !== undefined) insights.push(`Average daily steps are ${Math.round(metrics.averageDailySteps).toLocaleString()}, based on parsed Samsung activity summaries.`);
  if (metrics.averageSleepHours !== undefined) insights.push(`Average sleep duration is ${metrics.averageSleepHours.toFixed(1)} hours; use this as a wellness trend, not a medical conclusion.`);
  if (metrics.averageHeartRate !== undefined) insights.push(`Average heart rate is ${Math.round(metrics.averageHeartRate)} bpm across available samples. Unusual days should be compared with your personal baseline.`);
  if (metrics.averageSpo2 !== undefined) insights.push(`Average SpO2 is ${metrics.averageSpo2.toFixed(1)}% where data is available; coverage and device accuracy can affect interpretation.`);
  if (data.nutrition.length < 100) insights.push("Nutrition data is limited, so food insights should be treated as partial.");
  if (data.water.length < 10) insights.push("Water intake data is sparse in this export.");
  if (data.stress.length < 30) insights.push("Stress and recovery signals are experimental because the export has sparse or proprietary data.");
  return insights;
}

