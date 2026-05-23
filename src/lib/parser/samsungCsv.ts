import Papa from "papaparse";
import type { ParserWarning } from "@/types/health";

export type SamsungRow = Record<string, string | number | null>;

export interface SamsungCsvFile {
  fileName: string;
  tableName?: string;
  schemaVersion?: string;
  metadata: string[];
  headers: string[];
  originalHeaders: string[];
  rows: SamsungRow[];
  warnings: ParserWarning[];
}

export function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[\s.\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function coerceCell(value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim();
  if (raw === "") return null;
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    const numeric = Number(raw);
    if (Number.isFinite(numeric)) return numeric;
  }
  return raw;
}

export function parseSamsungCsv(fileName: string, content: string): SamsungCsvFile {
  const warnings: ParserWarning[] = [];
  const normalizedContent = content.replace(/^\uFEFF/, "");
  const lines = normalizedContent.split(/\r?\n/);
  if (lines.length < 2) {
    return {
      fileName,
      metadata: [],
      headers: [],
      originalHeaders: [],
      rows: [],
      warnings: [
        {
          severity: "high",
          code: "CSV_TOO_SHORT",
          fileName,
          message: "Samsung CSV must contain metadata and header lines."
        }
      ]
    };
  }

  const metadata = Papa.parse<string[]>(lines[0], { skipEmptyLines: false }).data[0] ?? [];
  const headerLine = lines[1] ?? "";
  const originalHeaders = (Papa.parse<string[]>(headerLine, { skipEmptyLines: false }).data[0] ?? []).map((h) => h.trim());
  const headers = originalHeaders.map(normalizeHeader);
  const dataText = lines.slice(2).join("\n");
  const parsed = Papa.parse<string[]>(dataText, {
    header: false,
    skipEmptyLines: true
  });

  if (parsed.errors.length > 0) {
    warnings.push(
      ...parsed.errors.slice(0, 12).map((error) => ({
        severity: "medium" as const,
        code: "CSV_PARSE_WARNING",
        fileName,
        message: `${error.message} at row ${error.row ?? "unknown"}`
      }))
    );
  }

  const rows = parsed.data.map((row) => {
    const next: SamsungRow = {};
    for (let index = 0; index < headers.length; index += 1) {
      next[headers[index]] = coerceCell(row[index]);
    }
    return next;
  });

  return {
    fileName,
    tableName: metadata[0],
    schemaVersion: metadata[1],
    metadata,
    headers,
    originalHeaders,
    rows,
    warnings
  };
}

export function getString(row: SamsungRow, key: string): string | undefined {
  const value = row[key];
  if (value === null || value === undefined) return undefined;
  return String(value);
}

export function getNumber(row: SamsungRow, key: string): number | undefined {
  const value = row[key];
  if (value === null || value === undefined || value === "") return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : undefined;
}

export function firstNumber(row: SamsungRow, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = getNumber(row, key);
    if (value !== undefined) return value;
  }
  return undefined;
}

export function firstString(row: SamsungRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = getString(row, key);
    if (value !== undefined && value !== "") return value;
  }
  return undefined;
}
