import type { ParserWarning, WorkoutSession } from "@/types/health";
import { firstNumber, firstString, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { durationMinutes, rowTimestamp, sourceFor } from "./helpers";

export function parseWorkouts(files: SamsungCsvFile[]): { workouts: WorkoutSession[]; warnings: ParserWarning[] } {
  const workouts: WorkoutSession[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!name.includes("exercise.") || name.includes("recovery_heart_rate") || name.includes("weather") || name.includes("periodization")) continue;
    file.rows.forEach((row, rowIndex) => {
      const start = rowTimestamp(row, ["com_samsung_health_exercise_start_time", "start_time"]);
      const end = rowTimestamp(row, ["com_samsung_health_exercise_end_time", "end_time"]);
      if (!start.iso || !start.localDate) return;
      const durationMs = firstNumber(row, ["com_samsung_health_exercise_duration", "duration"]);
      const duration = durationMinutes(start.iso, end.iso, durationMs);
      workouts.push({
        id: `${file.fileName}:${rowIndex}`,
        startTime: start.iso,
        endTime: end.iso,
        localDate: start.localDate,
        exerciseType: firstString(row, ["com_samsung_health_exercise_exercise_type", "exercise_type"]),
        durationMinutes: duration,
        caloriesKcal: firstNumber(row, ["com_samsung_health_exercise_calorie", "total_calorie"]),
        distanceMeters: firstNumber(row, ["com_samsung_health_exercise_distance"]),
        avgHeartRate: firstNumber(row, ["com_samsung_health_exercise_mean_heart_rate"]),
        maxHeartRate: firstNumber(row, ["com_samsung_health_exercise_max_heart_rate"]),
        source: sourceFor(file, row, rowIndex, "high")
      });
    });
  }
  return { workouts: workouts.sort((a, b) => a.startTime.localeCompare(b.startTime)), warnings };
}
