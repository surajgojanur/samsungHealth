"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, FolderOpen, RotateCcw, UploadCloud } from "lucide-react";
import type { ImportResult } from "@/types/health";
import type { WorkerProgress } from "@/workers/parser.worker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealthStore } from "@/store/healthStore";

type WorkerMessage =
  | { type: "progress"; progress: WorkerProgress }
  | { type: "result"; result: ImportResult }
  | { type: "error"; error: string };

export function UploadPanel() {
  const setImportResult = useHealthStore((state) => state.setImportResult);
  const reset = useHealthStore((state) => state.reset);
  const debugMode = useHealthStore((state) => state.debugMode);
  const [progress, setProgress] = useState<WorkerProgress | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const workerRef = useRef<Worker | null>(null);
  const uploadStates = [
    "Waiting for file",
    "Reading file",
    "Extracting ZIP",
    "Building file inventory",
    "Parsing Samsung CSV files",
    "Resolving JSON sidecars",
    "Normalizing health records",
    "Generating insights",
    "Ready"
  ];

  useEffect(() => {
    workerRef.current = new Worker(new URL("../../workers/parser.worker.ts", import.meta.url), { type: "module" });
    return () => workerRef.current?.terminate();
  }, []);

  async function parseFiles(files: File[]) {
    if (!workerRef.current || files.length === 0) return;
    const worker = workerRef.current;
    setBusy(true);
    setError(undefined);
    const onMessage = async (event: MessageEvent<WorkerMessage>) => {
      if (event.data.type === "progress") setProgress(event.data.progress);
      if (event.data.type === "error") {
        setError(friendlyImportError(event.data.error));
        setBusy(false);
        worker.removeEventListener("message", onMessage);
      }
      if (event.data.type === "result") {
        await setImportResult(event.data.result);
        const failedCount = event.data.result.report.inventory.filter((item) => item.status === "failed").length;
        const message = failedCount ? `Ready. ${failedCount} files failed, but import continued.` : "Ready";
        setProgress({ stage: "complete", percent: 100, message });
        setBusy(false);
        worker.removeEventListener("message", onMessage);
      }
    };
    worker.addEventListener("message", onMessage);
    const zip = files.length === 1 && files[0].name.toLowerCase().endsWith(".zip") ? files[0] : undefined;
    if (zip) {
      worker.postMessage({ type: "parseZip", fileName: zip.name, buffer: await zip.arrayBuffer(), debugMode }, []);
      return;
    }
    worker.postMessage({
      type: "parseFiles",
      debugMode,
      files: files.map((file) => ({
        path: (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name,
        file
      }))
    });
  }

  function onDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void parseFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <Card
        className={dragging ? "border-primary bg-primary/5" : ""}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <CardHeader>
          <CardTitle>Upload Samsung Health export</CardTitle>
          <CardDescription>ZIP, extracted folder, or selected CSV/JSON files. Parsing runs locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
            <UploadCloud className="mb-4 h-12 w-12 text-primary" />
            <p className="text-lg font-semibold">Drop your export here</p>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Your data stays here. HealthLens processes your files directly in your browser. No cloud, no tracking, no server upload by default.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <label>
                  <UploadCloud className="h-4 w-4" />
                  Select ZIP or files
                  <input
                    aria-label="Select Samsung Health ZIP or files"
                    type="file"
                    multiple
                    className="sr-only"
                    accept=".zip,.csv,.json"
                    onChange={(event) => void parseFiles(Array.from(event.target.files ?? []))}
                  />
                </label>
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  folderInputRef.current?.setAttribute("webkitdirectory", "");
                  folderInputRef.current?.click();
                }}
              >
                <FolderOpen className="h-4 w-4" />
                Select folder
              </Button>
              <input
                aria-label="Select extracted Samsung Health folder"
                ref={folderInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => void parseFiles(Array.from(event.target.files ?? []))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>Import progress</CardTitle>
            <CardDescription>ZIP extraction, inventory, parsing, sidecar resolution, normalization, and insight generation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <Badge tone={progress?.stage === "complete" ? "good" : busy ? "warn" : "neutral"}>{progress?.message ?? "Waiting for file"}</Badge>
              <span className="text-sm text-muted-foreground">{progress?.percent ?? 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress?.percent ?? 0}%` }} />
            </div>
            <ol className="mt-4 space-y-2 text-sm">
              {uploadStates.map((state) => {
                const active = progress?.message?.toLowerCase().includes(state.toLowerCase().split(" ")[0]);
                const done = progress?.stage === "complete" || uploadStates.indexOf(state) < currentStateIndex(progress?.message);
                return (
                  <li key={state} className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className={done ? "h-4 w-4 text-primary" : active ? "h-4 w-4 text-amber-600" : "h-4 w-4 text-muted-foreground"} aria-hidden="true" />
                    <span>{state}</span>
                  </li>
                );
              })}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to export your Samsung Health data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ol className="list-decimal space-y-2 pl-5">
              <li>Open Samsung Health on your phone.</li>
              <li>Go to settings.</li>
              <li>Download/export personal data.</li>
              <li>Keep the ZIP private.</li>
              <li>Upload it here.</li>
            </ol>
            <p>Export options may vary by Samsung Health version and region.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Import checks</CardTitle>
            <CardDescription>HealthLens explains these conditions without exposing raw file contents.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm text-muted-foreground">
            <p>Unsupported file type</p>
            <p>ZIP too large</p>
            <p>Unsafe path rejected</p>
            <p>No useful health files found</p>
            <p>Samsung CSV format not detected</p>
            <p>Some files failed, but import continued</p>
          </CardContent>
        </Card>

        {error ? (
          <Card className="border-red-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Import error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground" role="alert">{error}</p>
            </CardContent>
          </Card>
        ) : null}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setProgress(undefined);
            setError(undefined);
            void reset();
          }}
        >
          <RotateCcw className="h-4 w-4" />
          Clear uploaded data
        </Button>
      </div>
    </div>
  );
}

function currentStateIndex(message?: string): number {
  if (!message) return 0;
  const lower = message.toLowerCase();
  if (lower.includes("reading")) return 1;
  if (lower.includes("extracting")) return 2;
  if (lower.includes("inventory")) return 3;
  if (lower.includes("csv")) return 4;
  if (lower.includes("sidecar")) return 5;
  if (lower.includes("normalizing")) return 6;
  if (lower.includes("insight")) return 7;
  if (lower.includes("ready")) return 8;
  return 0;
}

function friendlyImportError(error: string): string {
  const lower = error.toLowerCase();
  if (lower.includes("compressed size")) return "ZIP too large. The archive exceeds the configured compressed-size limit.";
  if (lower.includes("file count")) return "ZIP too large. The archive contains more files than HealthLens can safely inspect at once.";
  if (lower.includes("path traversal") || lower.includes("absolute paths")) return "Unsafe path rejected. This archive contains a path HealthLens will not open.";
  if (lower.includes("unsupported")) return "Unsupported file type. Upload a Samsung Health ZIP, folder, CSV, or JSON sidecar.";
  if (lower.includes("csv")) return "Samsung CSV format not detected in one or more files.";
  return error || "No useful health files found. Try a Samsung Health export ZIP or extracted folder.";
}
