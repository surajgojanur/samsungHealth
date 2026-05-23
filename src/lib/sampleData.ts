import type { ImportResult, NormalizedHealthData, SymptomLog } from "@/types/health";

function days(count: number): string[] {
  const start = new Date("2026-04-01T00:00:00Z");
  return Array.from({ length: count }, (_, index) => new Date(start.getTime() + index * 86_400_000).toISOString().slice(0, 10));
}

export function makeSampleImport(): ImportResult {
  const dates = days(30);
  const data: NormalizedHealthData = {
    activity: dates.map((date, index) => ({
      date,
      steps: 5200 + Math.round(Math.sin(index / 3) * 1800 + index * 65),
      distanceMeters: 3900 + index * 75,
      caloriesKcal: 220 + Math.round(Math.sin(index / 4) * 40),
      activeTimeMs: (38 + index) * 60_000,
      floors: index % 5,
      source: { fileName: "sample.activity.csv", confidence: "high" }
    })),
    heartRate: dates.flatMap((date, index) => [68, 74, 82].map((bpm, h) => ({ timestamp: `${date}T0${h + 8}:00:00.000Z`, localDate: date, bpm: bpm + Math.round(Math.sin(index / 5) * 4), source: { fileName: "sample.heart_rate.csv", confidence: "high" as const } }))),
    sleep: dates.slice(0, 24).map((date, index) => ({
      id: `sample-sleep-${date}`,
      startTime: `${date}T17:30:00.000Z`,
      endTime: `${date}T23:45:00.000Z`,
      localDate: date,
      durationMinutes: 375 + Math.round(Math.sin(index / 3) * 55),
      sleepScore: 68 + Math.round(Math.sin(index / 4) * 8),
      efficiency: 82 + Math.round(Math.sin(index / 5) * 6),
      source: { fileName: "sample.sleep.csv", confidence: "high" as const }
    })),
    workouts: dates.filter((_, index) => index % 4 === 0).map((date, index) => ({
      id: `sample-workout-${date}`,
      startTime: `${date}T12:00:00.000Z`,
      endTime: `${date}T12:42:00.000Z`,
      localDate: date,
      exerciseType: "1001",
      durationMinutes: 32 + index * 2,
      caloriesKcal: 180 + index * 18,
      distanceMeters: 2600 + index * 320,
      avgHeartRate: 118 + index,
      maxHeartRate: 146 + index,
      source: { fileName: "sample.exercise.csv", confidence: "high" as const }
    })),
    spo2: dates.slice(5).map((date, index) => ({
      timestamp: `${date}T20:00:00.000Z`,
      localDate: date,
      spo2: 95 + (index % 4) * 0.5,
      source: { fileName: "sample.spo2.csv", confidence: "high" as const }
    })),
    body: dates.filter((_, index) => index % 7 === 0).map((date, index) => ({
      timestamp: `${date}T08:00:00.000Z`,
      localDate: date,
      weightKg: 65 - index * 0.2,
      bodyFatPercent: 16 - index * 0.1,
      source: { fileName: "sample.weight.csv", confidence: "high" as const }
    })),
    nutrition: dates.filter((_, index) => index % 2 === 0).map((date, index) => ({
      timestamp: `${date}T08:30:00.000Z`,
      localDate: date,
      mealType: "breakfast",
      caloriesKcal: 420 + (index % 4) * 35,
      carbohydrateG: 48 + (index % 5),
      proteinG: 22 + (index % 3),
      fatG: 14 + (index % 4),
      source: { fileName: "sample.nutrition.csv", confidence: "medium" as const }
    })),
    water: dates.filter((_, index) => index % 3 !== 0).map((date, index) => ({
      timestamp: `${date}T10:30:00.000Z`,
      localDate: date,
      amountMl: 250 + (index % 3) * 100,
      source: { fileName: "sample.water.csv", confidence: "medium" as const }
    })),
    stress: dates.filter((_, index) => index % 3 === 0).map((date, index) => ({
      timestamp: `${date}T15:30:00.000Z`,
      localDate: date,
      score: 45 + (index % 6) * 5,
      kind: "stress" as const,
      durationSeconds: 180,
      source: { fileName: "sample.stress.csv", confidence: "medium" as const }
    })),
    metadata: [{ manufacturer: "Samsung", model: "Masked wearable", masked: true }]
  };

  return {
    data,
    report: {
      generatedAt: new Date().toISOString(),
      dateRange: { start: dates[0], end: dates[dates.length - 1] },
      inventory: [],
      detections: [
        { category: "heartRate", label: "Heart rate", status: "Available", fileCount: 1, rowCount: data.heartRate.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "activity", label: "Steps/activity", status: "Available", fileCount: 1, rowCount: data.activity.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "sleep", label: "Sleep", status: "Available", fileCount: 1, rowCount: data.sleep.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "workouts", label: "Exercise/workouts", status: "Available", fileCount: 1, rowCount: data.workouts.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "spo2", label: "Blood oxygen / SpO2", status: "Available", fileCount: 1, rowCount: data.spo2.length, dateRange: { start: dates[5], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "body", label: "Body metrics", status: "Available", fileCount: 1, rowCount: data.body.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "calories", label: "Calories/activity", status: "Available", fileCount: 2, rowCount: data.activity.length + data.workouts.length, dateRange: { start: dates[0], end: dates.at(-1)! }, confidence: "high", notes: "Sample data." },
        { category: "nutrition", label: "Nutrition", status: "Missing", fileCount: 0, rowCount: 0, confidence: "medium", notes: "Nutrition was not found in this export. This usually means it was not recorded or not included in the Samsung Health export." },
        { category: "water", label: "Water", status: "Limited", fileCount: 1, rowCount: 2, confidence: "medium", notes: "Water data exists, but there are too few entries for confident insights." },
        { category: "stress", label: "Stress/recovery", status: "Experimental", fileCount: 1, rowCount: 0, confidence: "medium", notes: "Stress/recovery support is experimental." },
        { category: "bloodPressure", label: "Blood pressure", status: "Unsupported", fileCount: 0, rowCount: 0, confidence: "high", notes: "Blood pressure was not found in this export. This usually means it was not recorded or not included in the Samsung Health export." },
        { category: "ecg", label: "ECG", status: "Unsupported", fileCount: 0, rowCount: 0, confidence: "high", notes: "ECG was not found in this export. This usually means it was not recorded or not included in the Samsung Health export." },
        { category: "menstrualCycle", label: "Menstrual cycle", status: "Unsupported", fileCount: 0, rowCount: 0, confidence: "high", notes: "Menstrual cycle was not found in this export. This usually means it was not recorded or not included in the Samsung Health export." },
        { category: "metadata", label: "Device/source metadata", status: "Experimental", fileCount: 1, rowCount: data.metadata.length, confidence: "medium", notes: "Masked source metadata." },
        { category: "unknown", label: "Unknown/unsupported", status: "Missing", fileCount: 0, rowCount: 0, confidence: "low", notes: "None in sample." }
      ],
      warnings: [
        { severity: "low", code: "SAMPLE_DATA", message: "This is generated sample data, not a real health export." }
      ],
      unsupportedFiles: [],
      totals: { files: 0, csvFiles: 0, jsonFiles: 0, imageFiles: 0, unsupportedFiles: 0, parsedRows: 0, sidecarFiles: 0 }
    }
  };
}

export function makeSampleSymptoms(): SymptomLog[] {
  return [
    {
      id: "sample-symptom-1",
      timestamp: "2026-04-08T18:20:00.000Z",
      localDate: "2026-04-08",
      symptomType: "muscle_twitch",
      bodyLocation: "left calf",
      durationSeconds: 20,
      severity: 3,
      beforeEvent: "Long walk and coffee",
      notes: "Brief evening twitching",
      flags: { caffeine: true, workout: false, poorSleep: true, doctorNote: true }
    },
    {
      id: "sample-symptom-2",
      timestamp: "2026-04-16T21:10:00.000Z",
      localDate: "2026-04-16",
      symptomType: "muscle_twitch",
      bodyLocation: "right eyelid",
      durationSeconds: 15,
      severity: 2,
      beforeEvent: "Late work session",
      notes: "Happened twice in the evening",
      flags: { caffeine: true, poorSleep: true, doctorNote: true }
    },
    {
      id: "sample-symptom-3",
      timestamp: "2026-04-24T19:40:00.000Z",
      localDate: "2026-04-24",
      symptomType: "fatigue",
      durationSeconds: 3600,
      severity: 4,
      beforeEvent: "Workout day",
      notes: "Felt tired after a longer workout",
      flags: { workout: true, doctorNote: false }
    }
  ];
}
