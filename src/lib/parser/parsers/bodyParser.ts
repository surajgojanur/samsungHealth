import type { BodyMetricSample, ParserWarning } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { rowTimestamp, sourceFor } from "./helpers";

export function parseBody(files: SamsungCsvFile[]): { body: BodyMetricSample[]; warnings: ParserWarning[] } {
  const body: BodyMetricSample[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!name.includes("weight") && !name.includes("height")) continue;
    file.rows.forEach((row, rowIndex) => {
      const time = rowTimestamp(row, ["start_time"]);
      if (!time.iso || !time.localDate) return;
      body.push({
        timestamp: time.iso,
        localDate: time.localDate,
        weightKg: firstNumber(row, ["weight"]),
        heightCm: firstNumber(row, ["height"]),
        bodyFatPercent: firstNumber(row, ["body_fat"]),
        skeletalMuscleMassKg: firstNumber(row, ["skeletal_muscle_mass", "skeletal_muscle"]),
        bodyFatMassKg: firstNumber(row, ["body_fat_mass"]),
        basalMetabolicRate: firstNumber(row, ["basal_metabolic_rate"]),
        totalBodyWater: firstNumber(row, ["total_body_water"]),
        source: sourceFor(file, row, rowIndex, "high")
      });
    });
  }
  return { body: body.sort((a, b) => a.timestamp.localeCompare(b.timestamp)), warnings };
}

