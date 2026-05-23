import type { ParserWarning, StressSample } from "@/types/health";
import { firstNumber, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { dateFromDailyRow, rowTimestamp, sourceFor } from "./helpers";

export function parseStress(files: SamsungCsvFile[]): { stress: StressSample[]; warnings: ParserWarning[] } {
  const stress: StressSample[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!/(stress|breathing|mood|vitality_score)/.test(name)) continue;
    file.rows.forEach((row, rowIndex) => {
      const time = rowTimestamp(row, ["start_time", "update_time"]);
      const day = dateFromDailyRow(row);
      const timestamp = time.iso ?? (day ? `${day}T00:00:00.000Z` : undefined);
      const localDate = time.localDate ?? day;
      if (!timestamp || !localDate) return;
      stress.push({
        timestamp,
        localDate,
        score: firstNumber(row, ["score", "total_score"]),
        kind: name.includes("breathing") ? "breathing" : name.includes("mood") ? "mood" : name.includes("vitality") ? "vitality" : "stress",
        durationSeconds: firstNumber(row, ["duration"]) ? firstNumber(row, ["duration"])! / 1000 : undefined,
        source: sourceFor(file, row, rowIndex, "medium")
      });
    });
  }
  return { stress: stress.sort((a, b) => a.timestamp.localeCompare(b.timestamp)), warnings };
}

