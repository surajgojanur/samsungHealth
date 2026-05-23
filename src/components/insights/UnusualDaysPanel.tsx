"use client";

import { useMemo, useState } from "react";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { findUnusualDays } from "@/lib/insights/anomalyInsights";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function UnusualDaysPanel({ data, symptoms }: { data: NormalizedHealthData; symptoms: SymptomLog[] }) {
  const unusual = useMemo(() => findUnusualDays({ data, symptoms }), [data, symptoms]);
  const dates = [...new Set(unusual.map((day) => day.date))].sort();
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");
  const selected = unusual.filter((day) => day.date === selectedDate);
  const activity = data.activity.find((day) => day.date === selectedDate);
  const sleep = data.sleep.filter((session) => session.localDate === selectedDate);
  const heart = data.heartRate.filter((sample) => sample.localDate === selectedDate);
  const workout = data.workouts.filter((session) => session.localDate === selectedDate);
  const spo2 = data.spo2.filter((sample) => sample.localDate === selectedDate);
  const symptomList = symptoms.filter((symptom) => symptom.localDate === selectedDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Unusual days</CardTitle>
        <CardDescription>Calendar-style baseline flags. A marked day is unusual compared with your uploaded data.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="grid grid-cols-7 gap-2">
          {dates.length ? (
            dates.map((date) => {
              const dayFlags = unusual.filter((item) => item.date === date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={cn(
                    "min-h-20 rounded-md border bg-background p-2 text-left text-xs hover:border-primary",
                    selectedDate === date && "border-primary ring-2 ring-primary/20"
                  )}
                >
                  <span className="font-medium">{date.slice(5)}</span>
                  <span className="mt-2 block text-muted-foreground">{dayFlags.length} flag{dayFlags.length === 1 ? "" : "s"}</span>
                </button>
              );
            })
          ) : (
            <div className="col-span-7 flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">No unusual days found yet.</div>
          )}
        </div>
        <div className="space-y-3 rounded-md border bg-muted/30 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold">{selectedDate || "No day selected"}</p>
            <Badge>{selected.length} flags</Badge>
          </div>
          {selected.map((flag) => (
            <div key={`${flag.metric}-${flag.date}`} className="rounded-md border bg-card p-3 text-sm">
              <p className="font-medium">{flag.metric.replace(/[A-Z]/g, " $&")}</p>
              <p className="text-muted-foreground">{flag.summary}</p>
            </div>
          ))}
          <div className="grid gap-2 text-sm text-muted-foreground">
            <p>Sleep: {sleep.length ? `${Math.round(sleep.reduce((sum, item) => sum + item.durationMinutes, 0) / 60)} h` : "none found"}</p>
            <p>Steps: {activity?.steps?.toLocaleString() ?? "none found"}</p>
            <p>Heart samples: {heart.length}</p>
            <p>Workouts: {workout.length}</p>
            <p>SpO2 readings: {spo2.length}</p>
            <p>Symptoms: {symptomList.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

