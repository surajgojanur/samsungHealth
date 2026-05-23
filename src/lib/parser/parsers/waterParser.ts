import type { ParserWarning, WaterIntake } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { rowTimestamp, sourceFor } from "./helpers";

export function parseWater(files: SamsungCsvFile[]): { water: WaterIntake[]; warnings: ParserWarning[] } {
  const water: WaterIntake[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    if (!file.fileName.toLowerCase().includes("water_intake")) continue;
    file.rows.forEach((row, rowIndex) => {
      const time = rowTimestamp(row, ["start_time"]);
      const amount = firstNumber(row, ["amount", "unit_amount"]);
      if (!time.iso || !time.localDate || amount === undefined) return;
      water.push({ timestamp: time.iso, localDate: time.localDate, amountMl: amount, source: sourceFor(file, row, rowIndex, "medium") });
    });
  }
  return { water, warnings };
}

