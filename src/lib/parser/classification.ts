import type { CategoryKey, Confidence } from "@/types/health";

export function classifyPath(path: string): { category: CategoryKey; confidence: Confidence; notes: string } {
  const name = path.toLowerCase();
  if (name.includes("heart_rate") || name.includes("health.hrv")) {
    return { category: "heartRate", confidence: "high", notes: "Heart rate or HRV table matched by report target." };
  }
  if (
    name.includes("pedometer") ||
    name.includes("step_daily_trend") ||
    name.includes("activity.day_summary") ||
    name.includes("activity_level") ||
    name.includes("movement") ||
    name.includes("floors")
  ) {
    return { category: "activity", confidence: "high", notes: "Activity, steps, movement, or floors table matched." };
  }
  if (name.includes("sleep") || name.includes("vitality.nap")) {
    return { category: "sleep", confidence: "high", notes: "Sleep table matched." };
  }
  if (name.includes("exercise")) {
    return { category: "workouts", confidence: "high", notes: "Workout table matched." };
  }
  if (name.includes("oxygen_saturation")) {
    return { category: "spo2", confidence: "high", notes: "SpO2 table matched." };
  }
  if (name.includes("weight") || name.includes("height")) {
    return { category: "body", confidence: "high", notes: "Body metric table matched." };
  }
  if (name.includes("nutrition") || name.includes("food")) {
    return { category: "nutrition", confidence: "medium", notes: "Nutrition table matched; report marks this limited." };
  }
  if (name.includes("water_intake")) {
    return { category: "water", confidence: "medium", notes: "Water intake table matched; report marks this sparse." };
  }
  if (name.includes("stress") || name.includes("breathing") || name.includes("mood") || name.includes("mindfulness") || name.includes("vitality_score")) {
    return { category: "stress", confidence: "medium", notes: "Recovery/stress table matched; report marks this partial." };
  }
  if (name.includes("device_profile") || name.includes("user_profile") || name.includes("hsp.references") || name.includes("preferences")) {
    return { category: "metadata", confidence: "medium", notes: "Metadata or preferences table matched." };
  }
  return { category: "unknown", confidence: "low", notes: "Not a target MVP health table." };
}

export const categoryLabels: Record<CategoryKey, string> = {
  heartRate: "Heart rate",
  activity: "Steps/activity",
  sleep: "Sleep",
  workouts: "Exercise/workouts",
  spo2: "Blood oxygen / SpO2",
  body: "Body metrics",
  calories: "Calories/activity",
  nutrition: "Nutrition",
  water: "Water",
  stress: "Stress/recovery",
  bloodPressure: "Blood pressure",
  ecg: "ECG",
  menstrualCycle: "Menstrual cycle",
  metadata: "Device/source metadata",
  unknown: "Unknown/unsupported"
};

export const orderedCategories: CategoryKey[] = [
  "heartRate",
  "activity",
  "sleep",
  "workouts",
  "spo2",
  "body",
  "calories",
  "nutrition",
  "water",
  "stress",
  "bloodPressure",
  "ecg",
  "menstrualCycle",
  "metadata",
  "unknown"
];

