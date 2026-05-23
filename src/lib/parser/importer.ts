import type {
  CategoryDetection,
  CategoryKey,
  FileInventoryItem,
  ImportResult,
  NormalizedHealthData,
  ParserReport,
  ParserWarning
} from "@/types/health";
import { categoryLabels, classifyPath, orderedCategories } from "@/lib/parser/classification";
import { parseNormalizedHealth } from "@/lib/parser/parsers";
import { parseSamsungCsv, type SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { defaultParserLimits, extensionFor, isIgnoredPath, maskDebugValue, normalizePath, type ParserLimits, validateExtension, validateVirtualPath } from "@/lib/parser/security";

export interface VirtualInputFile {
  path: string;
  size: number;
  text?: string;
  bytes?: Uint8Array;
}

function fileNameFor(path: string): string {
  return normalizePath(path).split("/").pop() ?? path;
}

function emptyData(): NormalizedHealthData {
  return {
    heartRate: [],
    activity: [],
    sleep: [],
    workouts: [],
    spo2: [],
    body: [],
    nutrition: [],
    water: [],
    stress: [],
    metadata: []
  };
}

export async function parseVirtualFiles(
  inputFiles: VirtualInputFile[],
  options?: { compressedBytes?: number; limits?: Partial<ParserLimits>; debugMode?: boolean }
): Promise<ImportResult> {
  const limits = { ...defaultParserLimits, ...options?.limits };
  const warnings: ParserWarning[] = [];
  const inventory: FileInventoryItem[] = [];
  const csvFiles: SamsungCsvFile[] = [];
  const decoder = new TextDecoder();
  let uncompressedBytes = 0;
  let parsedRows = 0;

  if (options?.compressedBytes && options.compressedBytes > limits.maxCompressedBytes) {
    warnings.push({
      severity: "high",
      code: "ZIP_COMPRESSED_SIZE_LIMIT",
      message: "The ZIP is larger than the configured compressed-size limit.",
      recommendation: "Ask the user to split the export or raise the limit explicitly."
    });
  }

  if (inputFiles.length > limits.maxFileCount) {
    warnings.push({
      severity: "high",
      code: "FILE_COUNT_LIMIT",
      message: `Upload contains ${inputFiles.length} files, above the limit of ${limits.maxFileCount}.`,
      recommendation: "Stop parsing and ask for a smaller export."
    });
  }

  for (const input of inputFiles) {
    const path = normalizePath(input.path);
    const fileName = fileNameFor(path);
    const extension = extensionFor(path);
    uncompressedBytes += input.size;

    if (isIgnoredPath(path)) continue;

    const pathWarning = validateVirtualPath(path);
    const extensionWarning = validateExtension(path, limits);
    const classification = classifyPath(path);
    const item: FileInventoryItem = {
      path,
      fileName,
      extension,
      size: input.size,
      category: classification.category,
      confidence: classification.confidence,
      status: "skipped",
      notes: classification.notes,
      warnings: []
    };

    if (pathWarning) {
      item.status = "rejected";
      item.warnings.push(pathWarning);
      warnings.push(pathWarning);
      inventory.push(item);
      continue;
    }
    if (extensionWarning) {
      item.status = extensionWarning.code === "IMAGE_SKIPPED" ? "skipped" : extensionWarning.severity === "high" ? "rejected" : "unsupported";
      item.warnings.push(extensionWarning);
      warnings.push(extensionWarning);
      inventory.push(item);
      continue;
    }

    if (extension === "json") {
      item.status = "skipped";
      item.notes = "JSON sidecar indexed for lazy parsing.";
      inventory.push(item);
      continue;
    }

    if (extension !== "csv") {
      item.status = "unsupported";
      inventory.push(item);
      continue;
    }

    try {
      const text = input.text ?? (input.bytes ? decoder.decode(input.bytes) : "");
      const parsed = parseSamsungCsv(fileName, text);
      item.status = "parsed";
      item.tableName = parsed.tableName;
      item.schemaVersion = parsed.schemaVersion;
      item.rowCount = parsed.rows.length;
      item.parsedCount = parsed.rows.length;
      item.skippedCount = 0;
      item.warnings.push(...parsed.warnings);
      parsedRows += parsed.rows.length;
      warnings.push(...parsed.warnings);
      csvFiles.push(parsed);
    } catch (error) {
      const warning: ParserWarning = {
        severity: "high",
        code: "CSV_FILE_FAILED",
        fileName,
        message: error instanceof Error ? error.message : "CSV parse failed.",
        recommendation: "Continue importing other files and show this in the parser report."
      };
      item.status = "failed";
      item.warnings.push(warning);
      warnings.push(warning);
    }
    inventory.push(item);
  }

  if (uncompressedBytes > limits.maxUncompressedBytes) {
    warnings.push({
      severity: "high",
      code: "UNCOMPRESSED_SIZE_LIMIT",
      message: "Upload is larger than the configured uncompressed-size limit.",
      recommendation: "Warn the user before parsing very large exports."
    });
  }

  if (options?.compressedBytes && uncompressedBytes / Math.max(options.compressedBytes, 1) > limits.maxCompressionRatio) {
    warnings.push({
      severity: "medium",
      code: "COMPRESSION_RATIO_WARNING",
      message: "The ZIP compression ratio is unusually high.",
      recommendation: "Treat this as a ZIP bomb risk if limits are exceeded."
    });
  }

  const normalized = csvFiles.length > 0 ? parseNormalizedHealth(csvFiles) : { data: emptyData(), warnings: [] };
  warnings.push(...normalized.warnings);
  if (csvFiles.length === 0) {
    warnings.push({
      severity: "medium",
      code: "NO_USEFUL_HEALTH_FILES_FOUND",
      message: "No useful health files found.",
      recommendation: "Upload a Samsung Health export ZIP or extracted folder containing Samsung CSV files."
    });
  }

  const report: ParserReport = {
    generatedAt: new Date().toISOString(),
    dateRange: deriveDateRange(normalized.data),
    inventory,
    detections: buildDetections(inventory, normalized.data),
    warnings,
    unsupportedFiles: inventory.filter((item) => item.status === "unsupported" || item.status === "rejected" || item.category === "unknown"),
    totals: {
      files: inventory.length,
      csvFiles: inventory.filter((item) => item.extension === "csv").length,
      jsonFiles: inventory.filter((item) => item.extension === "json").length,
      imageFiles: inventory.filter((item) => item.extension === "jpg" || item.extension === "jpeg").length,
      unsupportedFiles: inventory.filter((item) => item.status === "unsupported" || item.status === "rejected").length,
      parsedRows,
      sidecarFiles: inventory.filter((item) => item.extension === "json").length,
      compressedBytes: options?.compressedBytes,
      uncompressedBytes
    }
  };

  return {
    data: normalized.data,
    report,
    debugPreview: options?.debugMode ? buildMaskedPreview(csvFiles) : undefined
  };
}

function buildMaskedPreview(files: SamsungCsvFile[]): Array<Record<string, string | number | null>> {
  return files.slice(0, 8).flatMap((file) =>
    file.rows.slice(0, 2).map((row) => {
      const masked: Record<string, string | number | null> = { file: file.fileName };
      for (const [key, value] of Object.entries(row).slice(0, 12)) {
        masked[key] = maskDebugValue(key, value);
      }
      return masked;
    })
  );
}

function allDates(data: NormalizedHealthData): string[] {
  return [
    ...data.heartRate.map((item) => item.timestamp),
    ...data.activity.map((item) => item.date),
    ...data.sleep.map((item) => item.startTime),
    ...data.workouts.map((item) => item.startTime),
    ...data.spo2.map((item) => item.timestamp),
    ...data.body.map((item) => item.timestamp),
    ...data.nutrition.map((item) => item.timestamp),
    ...data.water.map((item) => item.timestamp),
    ...data.stress.map((item) => item.timestamp)
  ].filter(Boolean);
}

function deriveDateRange(data: NormalizedHealthData): { start: string; end: string } | undefined {
  const dates = allDates(data).sort();
  if (dates.length === 0) return undefined;
  return { start: dates[0], end: dates[dates.length - 1] };
}

function buildDetections(inventory: FileInventoryItem[], data: NormalizedHealthData): CategoryDetection[] {
  const categoryCounts = orderedCategories.reduce(
    (acc, category) => {
      acc[category] = { files: 0, rows: 0, dates: [], confidence: "low" };
      return acc;
    },
    {} as Record<CategoryKey, { files: number; rows: number; dates: string[]; confidence: "high" | "medium" | "low" }>
  );

  for (const item of inventory) {
    const target = categoryCounts[item.category];
    target.files += 1;
    target.rows += item.rowCount ?? 0;
    target.confidence = maxConfidence(target.confidence, item.confidence);
  }

  categoryCounts.heartRate.rows = data.heartRate.length;
  categoryCounts.activity.rows = data.activity.length;
  categoryCounts.sleep.rows = data.sleep.length;
  categoryCounts.workouts.rows = data.workouts.length;
  categoryCounts.spo2.rows = data.spo2.length;
  categoryCounts.body.rows = data.body.length;
  categoryCounts.nutrition.rows = data.nutrition.length;
  categoryCounts.water.rows = data.water.length;
  categoryCounts.stress.rows = data.stress.length;
  categoryCounts.metadata.rows = data.metadata.length;
  categoryCounts.calories.files = categoryCounts.activity.files + categoryCounts.workouts.files;
  categoryCounts.calories.rows = data.activity.filter((item) => item.caloriesKcal !== undefined).length + data.workouts.filter((item) => item.caloriesKcal !== undefined).length;
  categoryCounts.calories.confidence = "high";

  data.heartRate.forEach((item) => categoryCounts.heartRate.dates.push(item.timestamp));
  data.activity.forEach((item) => categoryCounts.activity.dates.push(item.date));
  data.sleep.forEach((item) => categoryCounts.sleep.dates.push(item.startTime));
  data.workouts.forEach((item) => categoryCounts.workouts.dates.push(item.startTime));
  data.spo2.forEach((item) => categoryCounts.spo2.dates.push(item.timestamp));
  data.body.forEach((item) => categoryCounts.body.dates.push(item.timestamp));
  data.nutrition.forEach((item) => categoryCounts.nutrition.dates.push(item.timestamp));
  data.water.forEach((item) => categoryCounts.water.dates.push(item.timestamp));
  data.stress.forEach((item) => categoryCounts.stress.dates.push(item.timestamp));

  return orderedCategories.map((category) => {
    const counts = categoryCounts[category];
    const unsupported = category === "bloodPressure" || category === "ecg" || category === "menstrualCycle";
    const dates = counts.dates.sort();
    const limited = (category === "nutrition" || category === "water" || category === "stress") && counts.rows > 0;
    const experimental = category === "metadata" && counts.files > 0;
    const sparse = counts.rows > 0 && counts.rows < 5;
    const status = unsupported ? "Unsupported" : experimental ? "Experimental" : counts.files === 0 || counts.rows === 0 ? "Missing" : limited || sparse ? "Limited" : "Available";
    const missingNote = `${categoryLabels[category]} was not found in this export. This usually means it was not recorded or not included in the Samsung Health export.`;
    return {
      category,
      label: categoryLabels[category],
      status,
      fileCount: counts.files,
      rowCount: counts.rows,
      dateRange: dates.length ? { start: dates[0], end: dates[dates.length - 1] } : undefined,
      confidence: unsupported ? "high" : counts.confidence,
      notes: unsupported
        ? `${categoryLabels[category]} is listed as unsupported in this MVP and remains inventory-only if present.`
        : status === "Missing"
          ? missingNote
          : status === "Limited"
            ? `${categoryLabels[category]} data exists, but there are too few entries or partial fields for confident insights.`
            : status === "Experimental"
              ? "Device/source metadata is masked and used only for data-quality context."
              : "Detected and parsed."
    };
  });
}

function maxConfidence(a: "high" | "medium" | "low", b: "high" | "medium" | "low"): "high" | "medium" | "low" {
  const order = { low: 0, medium: 1, high: 2 };
  return order[b] > order[a] ? b : a;
}
