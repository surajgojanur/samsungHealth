import type { DailyActivity, ParserWarning } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { dateFromDailyRow, sourceFor } from "./helpers";

export function parseActivity(files: SamsungCsvFile[]): { activity: DailyActivity[]; warnings: ParserWarning[] } {
  const byDate = new Map<string, DailyActivity>();
  const warnings: ParserWarning[] = [];

  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!/(pedometer_day_summary|step_daily_trend|activity\.day_summary|floors_day_summary)/.test(name)) continue;
    file.rows.forEach((row, rowIndex) => {
      const date = dateFromDailyRow(row);
      if (!date) return;
      const existing = byDate.get(date);
      const candidate: DailyActivity = {
        date,
        steps: firstNumber(row, ["step_count", "count"]),
        distanceMeters: firstNumber(row, ["distance"]),
        caloriesKcal: firstNumber(row, ["calorie", "com_samsung_shealth_calories_burned_active_calorie"]),
        activeTimeMs: firstNumber(row, ["active_time", "dynamic_active_time"]),
        exerciseTimeMs: firstNumber(row, ["exercise_time"]),
        floors: firstNumber(row, ["floor_count"]),
        source: sourceFor(file, row, rowIndex, "high")
      };
      byDate.set(date, mergeActivity(existing, candidate));
    });
  }

  return { activity: [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date)), warnings };
}

function mergeActivity(a: DailyActivity | undefined, b: DailyActivity): DailyActivity {
  if (!a) return b;
  return {
    ...a,
    steps: betterNumber(a.steps, b.steps),
    distanceMeters: betterNumber(a.distanceMeters, b.distanceMeters),
    caloriesKcal: betterNumber(a.caloriesKcal, b.caloriesKcal),
    activeTimeMs: betterNumber(a.activeTimeMs, b.activeTimeMs),
    exerciseTimeMs: betterNumber(a.exerciseTimeMs, b.exerciseTimeMs),
    floors: betterNumber(a.floors, b.floors),
    source: a.source
  };
}

function betterNumber(a?: number, b?: number): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return Math.max(a, b);
}

