import { unzipSync } from "fflate";
import { parseVirtualFiles, type VirtualInputFile } from "@/lib/parser/importer";
import { defaultParserLimits, normalizePath } from "@/lib/parser/security";

export type WorkerProgressStage = "waiting" | "reading" | "extracting" | "inventory" | "sidecars" | "normalizing" | "insights" | "complete" | "error";

export interface WorkerProgress {
  stage: WorkerProgressStage;
  percent: number;
  message: string;
}

export type ParserWorkerRequest =
  | {
      type: "parseFiles";
      files: Array<{ path: string; file: File }>;
      debugMode?: boolean;
    }
  | {
      type: "parseZip";
      fileName: string;
      buffer: ArrayBuffer;
      debugMode?: boolean;
    };

function postProgress(progress: WorkerProgress): void {
  self.postMessage({ type: "progress", progress });
}

async function readFile(file: File): Promise<VirtualInputFile> {
  return {
    path: normalizePath((file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name),
    size: file.size,
    text: await file.text()
  };
}

self.onmessage = async (event: MessageEvent<ParserWorkerRequest>) => {
  try {
    const request = event.data;
    postProgress({ stage: "reading", percent: 5, message: "Reading file" });

    if (request.type === "parseFiles") {
      const files: VirtualInputFile[] = [];
      for (let index = 0; index < request.files.length; index += 1) {
        files.push(await readFile(request.files[index].file));
        if (index % 25 === 0) {
          postProgress({ stage: "inventory", percent: 10 + Math.round((index / Math.max(request.files.length, 1)) * 30), message: "Building file inventory" });
        }
      }
      postProgress({ stage: "sidecars", percent: 45, message: "Resolving JSON sidecars" });
      postProgress({ stage: "normalizing", percent: 60, message: "Parsing Samsung CSV files and normalizing health records" });
      const result = await parseVirtualFiles(files, { debugMode: request.debugMode });
      postProgress({ stage: "insights", percent: 90, message: "Generating insights" });
      postProgress({ stage: "complete", percent: 100, message: "Ready" });
      self.postMessage({ type: "result", result });
      return;
    }

    postProgress({ stage: "extracting", percent: 10, message: "Checking ZIP size limits" });
    if (request.buffer.byteLength > defaultParserLimits.maxCompressedBytes) {
      throw new Error("ZIP exceeds the configured compressed size limit.");
    }
    postProgress({ stage: "extracting", percent: 20, message: "Extracting ZIP" });
    const unzipped = unzipSync(new Uint8Array(request.buffer));
    const entries = Object.entries(unzipped);
    if (entries.length > defaultParserLimits.maxFileCount) {
      throw new Error("ZIP exceeds the configured file count limit.");
    }
    const files: VirtualInputFile[] = entries.map(([path, bytes]) => ({ path: normalizePath(path), size: bytes.byteLength, bytes }));
    postProgress({ stage: "inventory", percent: 45, message: "Building file inventory" });
    postProgress({ stage: "sidecars", percent: 55, message: "Resolving JSON sidecars" });
    postProgress({ stage: "normalizing", percent: 65, message: "Parsing Samsung CSV files and normalizing health records" });
    const result = await parseVirtualFiles(files, { compressedBytes: request.buffer.byteLength, debugMode: request.debugMode });
    postProgress({ stage: "insights", percent: 90, message: "Generating insights" });
    postProgress({ stage: "complete", percent: 100, message: "Ready" });
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Parser worker failed."
    });
  }
};

export {};
