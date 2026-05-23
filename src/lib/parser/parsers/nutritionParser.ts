import type { NutritionEntry, ParserWarning } from "@/types/health";
import { firstNumber, firstString, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { rowTimestamp, sourceFor } from "./helpers";

export function parseNutrition(files: SamsungCsvFile[]): { nutrition: NutritionEntry[]; warnings: ParserWarning[] } {
  const nutrition: NutritionEntry[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!name.includes("nutrition") && !name.includes("food_intake")) continue;
    file.rows.forEach((row, rowIndex) => {
      const time = rowTimestamp(row, ["start_time"]);
      if (!time.iso || !time.localDate) return;
      nutrition.push({
        timestamp: time.iso,
        localDate: time.localDate,
        mealType: firstString(row, ["meal_type", "title"]),
        caloriesKcal: firstNumber(row, ["calorie"]),
        carbohydrateG: firstNumber(row, ["carbohydrate"]),
        proteinG: firstNumber(row, ["protein"]),
        fatG: firstNumber(row, ["total_fat"]),
        source: sourceFor(file, row, rowIndex, "medium")
      });
    });
  }
  return { nutrition: nutrition.sort((a, b) => a.timestamp.localeCompare(b.timestamp)), warnings };
}

