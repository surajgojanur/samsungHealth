import { describe, expect, it } from "vitest";
import { calculateHealthCorrelations } from "@/lib/analytics/correlations";
import { attachBaselineStats, buildBaselineMetrics } from "@/lib/analytics/baseline";
import { generateDoctorOnePageSummary } from "@/lib/insights/doctorSummaryGenerator";
import { generateInsights } from "@/lib/insights/insightEngine";
import { generateHealthStory } from "@/lib/insights/healthStory";
import { analyzeSymptomPatterns } from "@/lib/insights/symptomInsights";
import { assertNoForbiddenMedicalClaims, findForbiddenMedicalClaims } from "@/lib/safety/medicalClaimGuard";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";
import type { NormalizedHealthData } from "@/types/health";

function emptyData(): NormalizedHealthData {
  return {
    heartRate: [],
    activity: [],
    sleep: [],
    workouts: [],
    spo2: [],
    body: [],
    nutrition: [],
    water: [],
    stress: [],
    metadata: []
  };
}

describe("Insight Intelligence Layer", () => {
  it("generates useful insights with enough sample data", () => {
    const sample = makeSampleImport();
    const symptoms = makeSampleSymptoms();
    const insights = generateInsights({ data: sample.data, symptoms, report: sample.report });
    expect(insights.length).toBeGreaterThan(20);
    expect(insights[0].priorityScore).toBeGreaterThanOrEqual(insights[1].priorityScore);
    expect(insights.some((insight) => insight.category === "sleep")).toBe(true);
    expect(insights.some((insight) => insight.category === "heart")).toBe(true);
    expect(insights.some((insight) => insight.category === "symptom")).toBe(true);
    insights.forEach((insight) => {
      expect(insight.whyItMatters.length).toBeGreaterThan(10);
      expect(insight.confidence).toMatch(/high|medium|low/);
    });
  });

  it("handles sparse data honestly", () => {
    const insights = generateInsights({ data: emptyData(), symptoms: [] });
    expect(insights.some((insight) => insight.tone === "limited_data")).toBe(true);
    expect(insights.some((insight) => insight.limitations?.length)).toBe(true);
  });

  it("keeps generated insight text clear of forbidden medical claims", () => {
    const sample = makeSampleImport();
    const insights = generateInsights({ data: sample.data, symptoms: makeSampleSymptoms(), report: sample.report });
    const text = insights.map((insight) => [insight.title, insight.summary, insight.plainLanguage, insight.whyItMatters, insight.doctorDiscussion].join(" ")).join(" ");
    expect(findForbiddenMedicalClaims(text)).toEqual([]);
    expect(() => assertNoForbiddenMedicalClaims(text)).not.toThrow();
  });

  it("analyzes symptom context windows", () => {
    const sample = makeSampleImport();
    const pattern = analyzeSymptomPatterns(sample.data, makeSampleSymptoms());
    expect(pattern.eventCount).toBe(3);
    expect(pattern.contexts[0].previousNightSleepMinutes).toBeGreaterThan(0);
    expect(pattern.lowSleepEvents + pattern.highActivityEvents + pattern.highWorkoutLoadEvents + pattern.highHeartRateEvents).toBeGreaterThan(0);
  });

  it("detects baseline anomalies", () => {
    const sample = makeSampleImport();
    const baselines = buildBaselineMetrics(sample.data, makeSampleSymptoms());
    const steps = attachBaselineStats(baselines.steps);
    expect(steps.length).toBeGreaterThan(20);
    expect(steps.some((point) => point.zScore !== undefined)).toBe(true);
  });

  it("warns when correlation sample size is low", () => {
    const correlations = calculateHealthCorrelations(emptyData(), []);
    expect(correlations.some((correlation) => correlation.direction === "insufficient")).toBe(true);
    expect(correlations.some((correlation) => correlation.limitation)).toBe(true);
  });

  it("generates doctor summary without raw identifiers", () => {
    const sample = makeSampleImport();
    const summary = generateDoctorOnePageSummary({ data: sample.data, symptoms: makeSampleSymptoms(), report: sample.report });
    const text = JSON.stringify(summary);
    expect(summary.topObservations.length).toBeGreaterThan(0);
    expect(text).not.toContain("sourceId");
    expect(text).not.toContain("deviceId");
    expect(findForbiddenMedicalClaims(text)).toEqual([]);
  });

  it("generates data-quality warnings and health story for demo mode", () => {
    const sample = makeSampleImport();
    const symptoms = makeSampleSymptoms();
    const story = generateHealthStory(sample.data, symptoms, sample.report.dateRange);
    const insights = generateInsights({ data: sample.data, symptoms, report: sample.report });
    expect(story.oneLineSummary).toContain("2026-04");
    expect(insights.some((insight) => insight.category === "data_quality")).toBe(true);
  });
});

