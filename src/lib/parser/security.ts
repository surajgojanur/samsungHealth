import type { ParserWarning } from "@/types/health";

export interface ParserLimits {
  maxCompressedBytes: number;
  maxUncompressedBytes: number;
  maxFileCount: number;
  maxCompressionRatio: number;
  allowImages: boolean;
}

export const defaultParserLimits: ParserLimits = {
  maxCompressedBytes: 80 * 1024 * 1024,
  maxUncompressedBytes: 260 * 1024 * 1024,
  maxFileCount: 25_000,
  maxCompressionRatio: 25,
  allowImages: false
};

const dangerousExtensions = new Set([
  "exe",
  "dll",
  "bat",
  "cmd",
  "com",
  "scr",
  "ps1",
  "sh",
  "app",
  "jar",
  "msi",
  "html",
  "htm",
  "svg"
]);

export function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").replace(/^\.\/+/, "");
}

export function isIgnoredPath(path: string): boolean {
  const normalized = normalizePath(path);
  const parts = normalized.split("/");
  return parts.some((part) => part === "__MACOSX" || part === ".DS_Store" || part.startsWith("."));
}

export function validateVirtualPath(path: string): ParserWarning | null {
  const normalized = normalizePath(path);
  if (normalized.startsWith("/") || /^[A-Za-z]:\//.test(normalized)) {
    return {
      severity: "high",
      code: "ABSOLUTE_PATH_REJECTED",
      fileName: path,
      message: "Absolute paths are not allowed in uploads.",
      recommendation: "Export a normal Samsung Health ZIP/folder and retry."
    };
  }
  if (normalized.split("/").includes("..")) {
    return {
      severity: "high",
      code: "PATH_TRAVERSAL_REJECTED",
      fileName: path,
      message: "Path traversal segments are not allowed.",
      recommendation: "Reject the archive because it may be unsafe."
    };
  }
  return null;
}

export function extensionFor(path: string): string {
  const fileName = normalizePath(path).split("/").pop() ?? "";
  const index = fileName.lastIndexOf(".");
  return index >= 0 ? fileName.slice(index + 1).toLowerCase() : "";
}

export function validateExtension(path: string, limits: ParserLimits): ParserWarning | null {
  const extension = extensionFor(path);
  if (dangerousExtensions.has(extension)) {
    return {
      severity: "high",
      code: "DANGEROUS_FILE_REJECTED",
      fileName: path,
      message: `The .${extension} file type is not accepted.`,
      recommendation: "Only parse data files, never executable or HTML content."
    };
  }
  if (extension === "jpg" || extension === "jpeg") {
    return limits.allowImages
      ? null
      : {
          severity: "low",
          code: "IMAGE_SKIPPED",
          fileName: path,
          message: "Images are private and are skipped in the MVP.",
          recommendation: "Enable image support only with explicit user consent."
        };
  }
  if (!["csv", "json"].includes(extension)) {
    return {
      severity: "medium",
      code: "UNSUPPORTED_EXTENSION",
      fileName: path,
      message: `Unsupported file extension .${extension || "none"}.`
    };
  }
  return null;
}

export function maskIdentifier(value: unknown): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  return "[MASKED_ID]";
}

export function maskDebugValue(key: string, value: unknown): string | number | null {
  if (value === null || value === undefined) return null;
  const lower = key.toLowerCase();
  if (
    lower.includes("uuid") ||
    lower.includes("device") ||
    lower.includes("account") ||
    lower.includes("email") ||
    lower.includes("name") ||
    lower.includes("comment") ||
    lower.includes("note") ||
    lower.includes("location") ||
    lower.includes("lat") ||
    lower.includes("long") ||
    lower.includes("id")
  ) {
    return "[MASKED]";
  }
  return typeof value === "number" ? value : String(value);
}

