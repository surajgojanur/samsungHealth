import type { HeartRateSample, ParserWarning } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { rowTimestamp, sourceFor } from "./helpers";

export function parseHeartRate(files: SamsungCsvFile[]): { samples: HeartRateSample[]; warnings: ParserWarning[] } {
  const samples: HeartRateSample[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!name.includes("heart_rate")) continue;
    file.rows.forEach((row, rowIndex) => {
      const bpm = firstNumber(row, ["com_samsung_health_heart_rate_heart_rate", "heart_rate", "max_hr"]);
      const { iso, localDate } = rowTimestamp(row, ["com_samsung_health_heart_rate_start_time", "start_time"]);
      if (!iso || !localDate || bpm === undefined) return;
      if (bpm <= 0 || bpm > 240) {
        warnings.push({
          severity: "medium",
          code: "HEART_RATE_OUT_OF_RANGE",
          fileName: file.fileName,
          message: "A heart-rate row was outside expected wearable ranges.",
          recommendation: "Keep the row out of baseline calculations but show a parser warning."
        });
        return;
      }
      samples.push({ timestamp: iso, localDate, bpm, source: sourceFor(file, row, rowIndex, "high") });
    });
  }
  return { samples: samples.sort((a, b) => a.timestamp.localeCompare(b.timestamp)), warnings };
}

