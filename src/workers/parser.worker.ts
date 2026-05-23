import { unzipSync } from "fflate";
import { parseVirtualFiles, type VirtualInputFile } from "@/lib/parser/importer";
import { defaultParserLimits, normalizePath } from "@/lib/parser/security";

export type WorkerProgressStage = "extracting" | "inventory" | "parsing" | "complete" | "error";

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
    postProgress({ stage: "inventory", percent: 5, message: "Preparing local file inventory" });

    if (request.type === "parseFiles") {
      const files: VirtualInputFile[] = [];
      for (let index = 0; index < request.files.length; index += 1) {
        files.push(await readFile(request.files[index].file));
        if (index % 25 === 0) {
          postProgress({ stage: "inventory", percent: 10 + Math.round((index / Math.max(request.files.length, 1)) * 30), message: "Reading selected files" });
        }
      }
      postProgress({ stage: "parsing", percent: 55, message: "Parsing Samsung Health tables" });
      const result = await parseVirtualFiles(files, { debugMode: request.debugMode });
      postProgress({ stage: "complete", percent: 100, message: "Import complete" });
      self.postMessage({ type: "result", result });
      return;
    }

    postProgress({ stage: "extracting", percent: 10, message: "Checking ZIP size limits" });
    if (request.buffer.byteLength > defaultParserLimits.maxCompressedBytes) {
      throw new Error("ZIP exceeds the configured compressed size limit.");
    }
    postProgress({ stage: "extracting", percent: 20, message: "Extracting ZIP locally" });
    const unzipped = unzipSync(new Uint8Array(request.buffer));
    const entries = Object.entries(unzipped);
    if (entries.length > defaultParserLimits.maxFileCount) {
      throw new Error("ZIP exceeds the configured file count limit.");
    }
    const files: VirtualInputFile[] = entries.map(([path, bytes]) => ({ path: normalizePath(path), size: bytes.byteLength, bytes }));
    postProgress({ stage: "parsing", percent: 55, message: "Parsing Samsung Health tables" });
    const result = await parseVirtualFiles(files, { compressedBytes: request.buffer.byteLength, debugMode: request.debugMode });
    postProgress({ stage: "complete", percent: 100, message: "Import complete" });
    self.postMessage({ type: "result", result });
  } catch (error) {
    self.postMessage({
      type: "error",
      error: error instanceof Error ? error.message : "Parser worker failed."
    });
  }
};

export {};

