"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AlertCircle, Info } from "lucide-react";
import type { HealthInsight } from "@/lib/insights/insightTypes";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { dailyHeartRate, dailySpo2 } from "@/lib/analytics";
import { Badge } from "@/components/ui/badge";

interface InsightChartModalProps {
  insight: HealthInsight | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  data: NormalizedHealthData;
  symptoms: SymptomLog[];
}

export function InsightChartModal({ insight, isOpen, onOpenChange, data, symptoms }: InsightChartModalProps) {
  const chartData = useMemo(() => {
    if (!insight) return [];
    
    switch (insight.category) {
      case "heart":
        return dailyHeartRate(data.heartRate);
      case "sleep":
        return data.sleep.map((item) => ({ date: item.localDate, hours: Number((item.durationMinutes / 60).toFixed(2)) }));
      case "activity":
      case "workout":
        const symptomCounts = symptoms.reduce<Record<string, number>>((acc, symptom) => {
          acc[symptom.localDate] = (acc[symptom.localDate] ?? 0) + 1;
          return acc;
        }, {});
        return data.activity.map((item) => ({ date: item.date, steps: item.steps, symptoms: symptomCounts[item.date] ?? 0 }));
      case "spo2":
        return dailySpo2(data.spo2);
      case "body":
        return data.body.filter((item) => item.weightKg !== undefined).map((item) => ({ date: item.localDate, weight: item.weightKg }));
      default:
        return [];
    }
  }, [insight, data, symptoms]);

  const hasData = chartData.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Badge tone="good" className="rounded-full">Visual Evidence</Badge>
            {insight && <Badge tone="neutral" className="rounded-full uppercase">{insight.category}</Badge>}
          </div>
          <DialogTitle className="text-2xl mt-2">{insight?.title ?? "Insight Detail"}</DialogTitle>
          <DialogDescription className="text-base">
            {insight?.plainLanguage}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 min-h-[400px] flex flex-col gap-6">
          {!hasData ? (
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center bg-slate-50 dark:bg-slate-900/50">
              <AlertCircle className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-bold">No chart data available</p>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                We couldn't find enough valid data points in your export to generate a visualization for this specific insight.
              </p>
            </div>
          ) : (
            <div className="flex-1 bg-white dark:bg-slate-950 rounded-2xl border p-4 shadow-inner">
              <div className="h-[350px] w-full">
                {insight?.category && renderChart(insight.category, chartData) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(insight.category, chartData) as React.ReactElement}
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">Chart type not supported.</div>
                )}
              </div>
            </div>
          )}

          {insight && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-primary/5 p-5 border border-primary/10">
                <div className="flex items-center gap-2 mb-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Info className="h-4 w-4" />
                  Why this matters
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.whyItMatters}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
                <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-500 font-bold text-xs uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  Data Context
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.limitations?.[0] ?? "Analysis based on available data from your Samsung Health export."}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function renderChart(category: string | undefined, data: any[]) {
  switch (category) {
    case "heart":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" minTickGap={30} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis domain={["dataMin - 5", "dataMax + 5"]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="bpm" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
        </LineChart>
      );
    case "sleep":
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" minTickGap={30} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="hours" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHours)" strokeWidth={3} />
        </AreaChart>
      );
    case "activity":
    case "workout":
      return (
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" minTickGap={30} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Area yAxisId="left" type="monotone" dataKey="steps" fill="hsl(var(--primary) / 0.1)" stroke="hsl(var(--primary))" strokeWidth={3} />
          <Bar yAxisId="right" dataKey="symptoms" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
        </ComposedChart>
      );
    case "spo2":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" minTickGap={30} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis domain={[80, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="spo2" stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
        </LineChart>
      );
    case "body":
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="date" minTickGap={30} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis domain={["dataMin - 1", "dataMax + 1"]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip 
            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={3} />
        </LineChart>
      );
    default:
      return null;
  }
}
