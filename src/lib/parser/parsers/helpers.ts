import type { Confidence, SourceRef } from "@/types/health";
import { deriveLocalDate, parseSamsungDateToIso, parseSamsungLocalTimestamp } from "@/lib/parser/time";
import { firstNumber, firstString, type SamsungCsvFile, type SamsungRow } from "@/lib/parser/samsungCsv";
import { maskIdentifier } from "@/lib/parser/security";

export function sourceFor(file: SamsungCsvFile, row: SamsungRow, rowIndex: number, confidence: Confidence = "high"): SourceRef {
  return {
    fileName: file.fileName,
    tableName: file.tableName,
    rowIndex,
    deviceIdMasked: maskIdentifier(firstString(row, ["deviceuuid", "com_samsung_health_heart_rate_deviceuuid", "com_samsung_health_sleep_deviceuuid"])),
    timeOffset: firstString(row, ["time_offset", "com_samsung_health_heart_rate_time_offset", "com_samsung_health_sleep_time_offset", "com_samsung_health_exercise_time_offset"]),
    confidence
  };
}

export function rowTimestamp(row: SamsungRow, keys: string[]): { iso?: string; localDate?: string; timeOffset?: string } {
  const timeOffset = firstString(row, [
    "time_offset",
    "com_samsung_health_heart_rate_time_offset",
    "com_samsung_health_step_count_time_offset",
    "com_samsung_health_sleep_time_offset",
    "com_samsung_health_exercise_time_offset",
    "com_samsung_health_oxygen_saturation_time_offset"
  ]);
  const value = firstString(row, keys) ?? firstNumber(row, keys);
  const iso = parseSamsungDateToIso(value, timeOffset);
  if (!iso) return { timeOffset };
  return { iso, localDate: deriveLocalDate(iso, timeOffset), timeOffset };
}

export function durationMinutes(startIso?: string, endIso?: string, explicitMs?: number, explicitMinutes?: number): number | undefined {
  if (explicitMinutes !== undefined && Number.isFinite(explicitMinutes)) return explicitMinutes;
  if (explicitMs !== undefined && Number.isFinite(explicitMs)) return explicitMs / 60_000;
  if (!startIso || !endIso) return undefined;
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return undefined;
  return (end - start) / 60_000;
}

export function dateFromDailyRow(row: SamsungRow): string | undefined {
  const timeOffset = firstString(row, ["time_offset"]) ?? "UTC+0000";
  const value = firstString(row, ["day_time", "com_samsung_shealth_calories_burned_day_time"]) ?? firstNumber(row, ["day_time", "com_samsung_shealth_calories_burned_day_time"]);
  const parsed = parseSamsungLocalTimestamp(value, timeOffset);
  if (!parsed) return undefined;
  return deriveLocalDate(parsed, timeOffset);
}

export function numberOrUndefined(value: number | undefined): number | undefined {
  return value === undefined || !Number.isFinite(value) ? undefined : value;
}

