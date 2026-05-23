import type { ParserWarning, SpO2Sample } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { rowTimestamp, sourceFor } from "./helpers";

export function parseSpO2(files: SamsungCsvFile[]): { spo2: SpO2Sample[]; warnings: ParserWarning[] } {
  const spo2: SpO2Sample[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    if (!file.fileName.toLowerCase().includes("oxygen_saturation")) continue;
    file.rows.forEach((row, rowIndex) => {
      const value = firstNumber(row, ["com_samsung_health_oxygen_saturation_spo2", "spo2"]);
      const time = rowTimestamp(row, ["com_samsung_health_oxygen_saturation_start_time", "start_time"]);
      if (!time.iso || !time.localDate || value === undefined) return;
      if (value < 50 || value > 100) {
        warnings.push({ severity: "medium", code: "SPO2_OUT_OF_RANGE", fileName: file.fileName, message: "An SpO2 value was outside 50-100%." });
        return;
      }
      spo2.push({ timestamp: time.iso, localDate: time.localDate, spo2: value, source: sourceFor(file, row, rowIndex, "high") });
    });
  }
  return { spo2: spo2.sort((a, b) => a.timestamp.localeCompare(b.timestamp)), warnings };
}

