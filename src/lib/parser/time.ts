import { format } from "date-fns";

export function parseTimeOffset(offset?: string | null): number {
  if (!offset) return 0;
  const match = offset.trim().match(/^UTC([+-])(\d{2})(\d{2})$/i);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

export function parseEpochMs(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (numeric < 946_684_800_000 || numeric > 4_102_444_800_000) return null;
  return new Date(numeric);
}

export function parseEpochSeconds(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  if (numeric < 946_684_800 || numeric > 4_102_444_800) return null;
  return new Date(numeric * 1000);
}

export function parseSamsungLocalTimestamp(value: unknown, timeOffset?: string | null): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const raw = String(value).trim();
  if (!raw) return null;
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    return parseEpochMs(raw) ?? parseEpochSeconds(raw);
  }
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?)?$/);
  if (!match) return null;
  const [, y, m, d, hh = "00", mm = "00", ss = "00", ms = "0"] = match;
  const offsetMinutes = parseTimeOffset(timeOffset);
  const utcMs =
    Date.UTC(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss), Number(ms.padEnd(3, "0"))) -
    offsetMinutes * 60_000;
  return new Date(utcMs);
}

export function deriveLocalDate(timestamp: Date | string, timeOffset?: string | null): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const offsetMinutes = parseTimeOffset(timeOffset);
  return format(new Date(date.getTime() + offsetMinutes * 60_000), "yyyy-MM-dd");
}

export function parseSamsungDateToIso(value: unknown, timeOffset?: string | null): string | undefined {
  const parsed = parseSamsungLocalTimestamp(value, timeOffset);
  return parsed?.toISOString();
}

export function dateFromDayValue(value: unknown, timeOffset?: string | null): string | undefined {
  const parsed = parseSamsungLocalTimestamp(value, timeOffset);
  if (!parsed) return undefined;
  return deriveLocalDate(parsed, timeOffset);
}

