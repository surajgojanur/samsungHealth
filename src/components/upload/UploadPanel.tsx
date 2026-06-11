"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, FolderOpen, Info, Lock, RotateCcw, UploadCloud } from "lucide-react";
import Link from "next/link";
import type { ImportResult } from "@/types/health";
import type { WorkerProgress } from "@/workers/parser.worker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealthStore } from "@/store/healthStore";
import { cn } from "@/lib/utils";

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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="space-y-6">
        <Card
          className={cn(
            "relative overflow-hidden transition-all",
            dragging ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/30"
          )}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Drop your export here</CardTitle>
            <CardDescription>Upload your Samsung Health ZIP, folder, or CSV files.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50/50 p-8 text-center dark:bg-slate-900/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UploadCloud className="h-10 w-10" />
              </div>
              <p className="text-xl font-bold">Select or drag your files</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Your health data never leaves your computer. We process everything locally in your browser.
              </p>
              
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="rounded-full px-8">
                  <label className="cursor-pointer">
                    <UploadCloud className="mr-2 h-5 w-5" />
                    Select ZIP or Files
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
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => {
                    folderInputRef.current?.setAttribute("webkitdirectory", "");
                    folderInputRef.current?.click();
                  }}
                >
                  <FolderOpen className="mr-2 h-5 w-5" />
                  Select Folder
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

              <div className="mt-8 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>End-to-end private. No server upload.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-2xl border bg-primary/5 p-6 dark:bg-primary/10">
          <div className="space-y-1">
            <h3 className="font-bold">Not ready to upload?</h3>
            <p className="text-sm text-muted-foreground">Try HealthLens with a sample data demo.</p>
          </div>
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/demo">
              Try Demo
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Import error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-600 dark:text-red-300" role="alert">{error}</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-4 text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => setError(undefined)}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="space-y-6">
        <Card className="overflow-hidden border-primary/20 bg-primary/5 dark:bg-primary/10">
          <CardHeader className="bg-primary/10 pb-4">
            <CardTitle className="text-lg">How to export your data</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ol className="relative space-y-6 border-l-2 border-primary/20 ml-3">
              {[
                { title: "Open Samsung Health", text: "Tap the triple-dot or menu icon on your phone." },
                { title: "Go to Settings", text: "Look for 'Download personal data' or 'Export'." },
                { title: "Start Download", text: "Select all categories and wait for the ZIP file." },
                { title: "Upload Here", text: "Drag that ZIP file into the box on the left." }
              ].map((step, i) => (
                <li key={i} className="ml-6">
                  <span className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h4 className="font-bold text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-start gap-3 rounded-lg bg-white/50 p-3 text-[11px] dark:bg-slate-900/50">
              <Info className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-muted-foreground leading-relaxed">
                Export options can vary by phone model and Samsung Health version. If you don't see the option, ensure your app is up to date.
              </p>
            </div>
          </CardContent>
        </Card>

        {busy || progress ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Importing your health story...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{progress?.message ?? "Initializing..."}</span>
                <span className="text-muted-foreground">{progress?.percent ?? 0}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out" 
                  style={{ width: `${progress?.percent ?? 0}%` }} 
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {uploadStates.map((state, i) => {
                  const done = progress?.stage === "complete" || uploadStates.indexOf(state) < currentStateIndex(progress?.message);
                  const active = !done && progress?.message?.toLowerCase().includes(state.toLowerCase().split(" ")[0]);
                  return (
                    <div key={state} className={cn(
                      "flex items-center gap-2 text-[10px] transition-colors",
                      done ? "text-primary font-medium" : active ? "text-foreground" : "text-muted-foreground/60"
                    )}>
                      <CheckCircle2 className={cn("h-3 w-3", done ? "text-primary" : "text-muted-foreground/30")} />
                      <span className="truncate">{state}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        <Card className="border-none bg-slate-100 dark:bg-slate-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Safety Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              HealthLens is for informational purposes only. It is not medical advice, diagnosis, or treatment. 
              Always consult your doctor before making changes to your health routine based on wearable data.
            </p>
          </CardContent>
        </Card>

        {progress?.stage === "complete" && (
          <Button asChild className="w-full rounded-full" size="lg">
            <Link href="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => {
            setProgress(undefined);
            setError(undefined);
            void reset();
          }}
        >
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset & Clear All Data
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
