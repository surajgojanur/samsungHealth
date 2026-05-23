import type { ParserWarning, SleepSession, SleepStageSegment } from "@/types/health";
import { firstNumber, firstString, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { durationMinutes, rowTimestamp, sourceFor } from "./helpers";

export function parseSleep(files: SamsungCsvFile[]): { sleep: SleepSession[]; warnings: ParserWarning[] } {
  const sessions: SleepSession[] = [];
  const warnings: ParserWarning[] = [];
  const stagesById = new Map<string, SleepStageSegment[]>();

  for (const file of files) {
    if (!file.fileName.toLowerCase().includes("sleep_stage")) continue;
    file.rows.forEach((row) => {
      const sleepId = firstString(row, ["sleep_id"]);
      const start = rowTimestamp(row, ["start_time"]);
      const end = rowTimestamp(row, ["end_time"]);
      if (!sleepId || !start.iso || !end.iso) return;
      const list = stagesById.get(sleepId) ?? [];
      list.push({ startTime: start.iso, endTime: end.iso, stage: mapStage(firstNumber(row, ["stage"])) });
      stagesById.set(sleepId, list);
    });
  }

  for (const file of files) {
    const name = file.fileName.toLowerCase();
    if (!name.includes("sleep.") && !name.includes("sleep_combined")) continue;
    if (name.includes("sleep_stage") || name.includes("sleep_raw_data") || name.includes("sleep_goal")) continue;
    file.rows.forEach((row, rowIndex) => {
      const start = rowTimestamp(row, ["com_samsung_health_sleep_start_time", "start_time"]);
      const end = rowTimestamp(row, ["com_samsung_health_sleep_end_time", "end_time"]);
      if (!start.iso || !end.iso || !start.localDate) return;
      const rawJoinId = firstString(row, ["com_samsung_health_sleep_datauuid", "datauuid", "combined_id"]);
      const combinedId = firstString(row, ["combined_id"]);
      const id = `${file.fileName}:${rowIndex}`;
      const explicit = firstNumber(row, ["sleep_duration"]);
      const duration = durationMinutes(start.iso, end.iso, undefined, explicit && explicit < 2_000 ? explicit : undefined);
      sessions.push({
        id,
        startTime: start.iso,
        endTime: end.iso,
        localDate: start.localDate,
        durationMinutes: duration ?? 0,
        sleepScore: firstNumber(row, ["sleep_score"]),
        efficiency: firstNumber(row, ["efficiency", "original_efficiency"]),
        stages: stagesById.get(rawJoinId ?? "") ?? stagesById.get(combinedId ?? "") ?? undefined,
        source: sourceFor(file, row, rowIndex, "high")
      });
    });
  }

  return { sleep: sessions.sort((a, b) => a.startTime.localeCompare(b.startTime)), warnings };
}

function mapStage(stage?: number): SleepStageSegment["stage"] {
  switch (stage) {
    case 40001:
      return "awake";
    case 40002:
      return "light";
    case 40003:
      return "deep";
    case 40004:
      return "rem";
    default:
      return "unknown";
  }
}
