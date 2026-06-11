"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Info, Plus } from "lucide-react";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { findUnusualDays } from "@/lib/insights/anomalyInsights";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useHealthStore } from "@/store/healthStore";

export function UnusualDaysPanel({ data, symptoms }: { data: NormalizedHealthData; symptoms: SymptomLog[] }) {
  const unusual = useMemo(() => findUnusualDays({ data, symptoms }), [data, symptoms]);
  const dates = useMemo(() => [...new Set(unusual.map((day) => day.date))].sort().reverse(), [unusual]);
  
  const [selectedDate, setSelectedDate] = useState(dates[0] ?? "");
  const [filter, setFilter] = useState<string>("all");

  const selectedDayDates = useHealthStore((state) => state.selectedDayDates);
  const toggleDaySelection = useHealthStore((state) => state.toggleDaySelection);

  const filteredDates = useMemo(() => {
    if (filter === "all") return dates;
    return [...new Set(unusual.filter(u => u.metric.toLowerCase().includes(filter.toLowerCase())).map(u => u.date))].sort().reverse();
  }, [dates, filter, unusual]);

  const selected = unusual.filter((day) => day.date === selectedDate);
  const activity = data.activity.find((day) => day.date === selectedDate);
  const sleep = data.sleep.filter((session) => session.localDate === selectedDate);
  const heart = data.heartRate.filter((sample) => sample.localDate === selectedDate);
  const workout = data.workouts.filter((session) => session.localDate === selectedDate);
  const spo2 = data.spo2.filter((sample) => sample.localDate === selectedDate);
  const symptomList = symptoms.filter((symptom) => symptom.localDate === selectedDate);

  const isDaySelected = selectedDayDates.includes(selectedDate);

  return (
    <Card className="border-none bg-slate-50 dark:bg-slate-900 shadow-none overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Timeline Explorer</span>
            </div>
            <CardTitle className="text-2xl">Unusual Patterns</CardTitle>
            <CardDescription className="text-sm">
              Significant baseline deviations detected in your health data.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "steps", "sleep", "heart", "spo2"].map(f => (
              <Button 
                key={f} 
                size="sm" 
                variant={filter === f ? "secondary" : "ghost"}
                className={cn("rounded-full h-8 text-[10px] font-bold uppercase tracking-wider", filter === f && "bg-white dark:bg-slate-800")}
                onClick={() => {
                  setFilter(f);
                  // Auto select first date of new filter
                  const newDates = f === "all" ? dates : [...new Set(unusual.filter(u => u.metric.toLowerCase().includes(f)).map(u => u.date))].sort().reverse();
                  if (newDates.length > 0) setSelectedDate(newDates[0]);
                }}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px] p-6 pt-0">
        {/* Heatmap/Grid View */}
        <div className="space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 lg:grid-cols-5 xl:grid-cols-7 gap-3">
            {filteredDates.length ? (
              filteredDates.map((date) => {
                const dayFlags = unusual.filter((item) => item.date === date);
                const severity = dayFlags.length > 3 ? "high" : dayFlags.length > 1 ? "medium" : "low";
                
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all h-24",
                      selectedDate === date 
                        ? "border-primary bg-white dark:bg-slate-800 ring-4 ring-primary/10 shadow-lg" 
                        : "border-transparent bg-white/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200"
                    )}
                  >
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mb-1">{date.slice(5)}</span>
                    <span className="text-xl font-black">{dayFlags.length}</span>
                    <span className="text-[9px] font-medium text-muted-foreground uppercase">Flags</span>
                    
                    <div className={cn(
                      "absolute bottom-2 h-1.5 w-1.5 rounded-full",
                      severity === "high" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : 
                      severity === "medium" ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" : 
                      "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                    )} />
                  </button>
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center h-48 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-muted-foreground">
                <AlertCircle className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No flags found for this filter.</p>
              </div>
            )}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className={cn(
          "flex flex-col rounded-3xl border-2 transition-colors overflow-hidden",
          selectedDate ? "bg-white dark:bg-slate-950 border-primary/20 shadow-xl" : "bg-slate-50 dark:bg-slate-900 border-dashed border-slate-200"
        )}>
          {selectedDate ? (
            <>
              <div className="p-6 border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Day Analysis</p>
                      <p className="text-xl font-black">{selectedDate}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant={isDaySelected ? "secondary" : "ghost"} 
                    className="rounded-full h-9 px-4 text-xs font-bold"
                    onClick={() => toggleDaySelection(selectedDate)}
                  >
                    {isDaySelected ? <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                    {isDaySelected ? "In Report" : "Add to Report"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <StatMini label="Steps" value={activity?.steps?.toLocaleString() ?? "—"} />
                  <StatMini label="Sleep" value={sleep.length ? `${(sleep.reduce((s, i) => s + i.durationMinutes, 0) / 60).toFixed(1)}h` : "—"} />
                  <StatMini label="Heart" value={heart.length ? `${Math.round(heart.reduce((s, i) => s + (i.bpm ?? 0), 0) / heart.length)}` : "—"} />
                </div>
              </div>

              <div className="flex-1 p-6 space-y-4 overflow-y-auto max-h-[400px]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Detected Flags</p>
                {selected.length ? (
                  selected.map((flag, i) => (
                    <div key={i} className="group relative rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 border border-transparent hover:border-primary/20 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex h-2 w-2 shrink-0 rounded-full bg-primary" />
                        <div>
                          <p className="font-bold text-sm leading-tight mb-1">{flag.metric.replace(/[A-Z]/g, " $&")}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{flag.summary}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 opacity-40">
                    <CheckCircle2 className="h-10 w-10 mb-2" />
                    <p className="text-sm font-medium">No flags for this day</p>
                  </div>
                )}

                {symptomList.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Logged Symptoms</p>
                    <div className="flex flex-wrap gap-2">
                      {symptomList.map((s, i) => (
                        <Badge key={i} tone="warn" className="rounded-full bg-amber-50 border border-amber-100 dark:bg-amber-950/20 text-[10px]">
                          {s.symptomType} {s.severity && `(${s.severity})`}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 text-[10px] text-muted-foreground flex items-start gap-2">
                <Info className="h-3 w-3 shrink-0 mt-0.5" />
                <p>Flags are generated by comparing daily data against your 30-day trailing baseline.</p>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground/20 mb-4" />
              <p className="text-sm font-bold text-muted-foreground">Select a day to view details</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-2 text-center border border-slate-100 dark:border-slate-800">
      <p className="text-[8px] font-bold uppercase text-muted-foreground leading-none mb-1">{label}</p>
      <p className="text-xs font-black truncate">{value}</p>
    </div>
  );
}
