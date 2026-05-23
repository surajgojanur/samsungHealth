"use client";

import { Download } from "lucide-react";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { analyzeSymptomPatterns } from "@/lib/insights/symptomInsights";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { downloadTextFile } from "@/lib/utils";

export function SymptomPatternPanel({ data, symptoms }: { data: NormalizedHealthData; symptoms: SymptomLog[] }) {
  const pattern = analyzeSymptomPatterns(data, symptoms);

  function exportTimeline() {
    const rows = [
      ["date", "symptom", "severity", "previous_sleep_minutes", "same_day_steps", "workout_load_24h", "same_day_hr", "notes"],
      ...pattern.contexts.map((context) => [
        context.symptom.localDate,
        context.symptom.customSymptom ?? context.symptom.symptomType,
        String(context.symptom.severity ?? ""),
        String(context.previousNightSleepMinutes ?? ""),
        String(context.sameDaySteps ?? ""),
        String(context.workoutLoad24h ?? ""),
        String(context.sameDayHeartRate ?? ""),
        context.notes.join(" | ")
      ])
    ];
    downloadTextFile("healthlens-symptom-timeline.csv", rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv");
  }

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
        <div>
          <CardTitle>What happened around your symptoms?</CardTitle>
          <CardDescription>Compares symptom timing with prior sleep, same-day activity, workouts, heart rate, SpO2, stress records, and notes.</CardDescription>
        </div>
        <Button type="button" variant="secondary" onClick={exportTimeline} disabled={!symptoms.length}>
          <Download className="h-4 w-4" />
          Export symptom timeline
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border bg-background p-4">
          <p className="font-medium">Possible patterns</p>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>Near shorter sleep: {pattern.lowSleepEvents}/{pattern.eventCount}</p>
            <p>Near higher activity: {pattern.highActivityEvents}/{pattern.eventCount}</p>
            <p>Near higher workout load: {pattern.highWorkoutLoadEvents}/{pattern.eventCount}</p>
            <p>Near higher heart-rate days: {pattern.highHeartRateEvents}/{pattern.eventCount}</p>
          </div>
        </div>
        <div className="rounded-md border bg-background p-4">
          <p className="font-medium">{pattern.eventCount ? "Doctor-ready symptom note" : "No clear pattern found"}</p>
          <p className="mt-3 text-sm text-muted-foreground">
            {pattern.eventCount ? pattern.doctorReadyNote : "No symptoms logged yet. Add symptoms to compare them with sleep, activity, heart trends, workouts, and notes."}
          </p>
        </div>
        <div className="lg:col-span-2">
          {pattern.contexts.length ? (
            <div className="grid gap-2">
              {pattern.contexts.map((context) => (
                <div key={context.symptom.id} className="rounded-md border bg-background p-3 text-sm">
                  <p className="font-medium">
                    {context.symptom.localDate} · {context.symptom.customSymptom ?? context.symptom.symptomType.replaceAll("_", " ")}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    Previous sleep: {context.previousNightSleepMinutes ? `${Math.round(context.previousNightSleepMinutes / 60)} h` : "not found"} · Steps:{" "}
                    {context.sameDaySteps?.toLocaleString() ?? "not found"} · Workout load: {context.workoutLoad24h?.toFixed(1) ?? "none found"} · HR:{" "}
                    {context.sameDayHeartRate ? Math.round(context.sameDayHeartRate) : "not found"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">No symptoms logged yet.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

