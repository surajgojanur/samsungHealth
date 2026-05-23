"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, FolderOpen, RotateCcw, UploadCloud } from "lucide-react";
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
        setError(event.data.error);
        setBusy(false);
        worker.removeEventListener("message", onMessage);
      }
      if (event.data.type === "result") {
        await setImportResult(event.data.result);
        setProgress({ stage: "complete", percent: 100, message: "Ready for dashboard" });
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
              HealthLens rejects executable and HTML files, skips images by default, and discards raw rows after normalization.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild>
                <label>
                  <UploadCloud className="h-4 w-4" />
                  Select ZIP/files
                  <input
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
            <CardDescription>ZIP extraction, inventory, and parsing progress.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center justify-between">
              <Badge tone={progress?.stage === "complete" ? "good" : busy ? "warn" : "neutral"}>{progress?.stage ?? "idle"}</Badge>
              <span className="text-sm text-muted-foreground">{progress?.percent ?? 0}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress?.percent ?? 0}%` }} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{progress?.message ?? "No import running."}</p>
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
              <p className="text-sm text-muted-foreground">{error}</p>
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
          Clear/reset data
        </Button>
      </div>
    </div>
  );
}
