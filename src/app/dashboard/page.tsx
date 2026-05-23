"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, Dumbbell, HeartPulse, Moon, ShieldCheck, TrendingUp } from "lucide-react";
import { ChartGrid } from "@/components/dashboard/Charts";
import { DetectionTable } from "@/components/dashboard/DetectionTable";
import { SymptomLogPanel } from "@/components/dashboard/SymptomLogPanel";
import { CorrelationExplorer } from "@/components/insights/CorrelationExplorer";
import { HealthStoryCard } from "@/components/insights/HealthStoryCard";
import { InsightHub } from "@/components/insights/InsightHub";
import { InsightCard } from "@/components/insights/InsightCard";
import { PeriodSummary } from "@/components/insights/PeriodSummary";
import { UnusualDaysPanel } from "@/components/insights/UnusualDaysPanel";
import { SymptomPatternPanel } from "@/components/symptoms/SymptomPatternPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { computeDashboardMetrics } from "@/lib/analytics";
import { generateHealthStory } from "@/lib/insights/healthStory";
import { generateInsights, topDoctorDiscussionInsights } from "@/lib/insights/insightEngine";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";
import { formatNumber } from "@/lib/utils";
import { useHealthStore } from "@/store/healthStore";

export default function DashboardPage() {
  const importResult = useHealthStore((state) => state.importResult);
  const setImportResult = useHealthStore((state) => state.setImportResult);
  const symptoms = useHealthStore((state) => state.symptoms);
  const active = importResult ?? makeSampleImport();
  const sampleMode = !importResult;
  const displaySymptoms = sampleMode && symptoms.length === 0 ? makeSampleSymptoms() : symptoms;
  const metrics = useMemo(() => computeDashboardMetrics(active.data, active.report.warnings.length), [active]);
  const insights = useMemo(() => generateInsights({ data: active.data, symptoms: displaySymptoms, report: active.report, dateRange: metrics.dateRange }), [active, displaySymptoms, metrics.dateRange]);
  const story = useMemo(() => generateHealthStory(active.data, displaySymptoms, metrics.dateRange), [active.data, displaySymptoms, metrics.dateRange]);
  const doctorPoints = topDoctorDiscussionInsights(insights, 3);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Overview</h1>
          <p className="mt-2 text-muted-foreground">{sampleMode ? "Sample dashboard shown with fake data. Upload your export for private analysis." : "Samsung Health export parsed locally."}</p>
        </div>
        <div className="flex gap-2">
          <Badge tone="good" className="self-center">Processed locally</Badge>
          {sampleMode ? (
            <Button onClick={() => void setImportResult(makeSampleImport())}>Use sample data</Button>
          ) : null}
          <Button asChild variant="secondary">
            <Link href="/upload">Upload another export</Link>
          </Button>
        </div>
      </div>

      <HealthStoryCard story={story} confidence={metrics.coverageScore >= 70 ? "high" : metrics.coverageScore >= 40 ? "medium" : "low"} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={ShieldCheck} label="Coverage score" value={`${metrics.coverageScore}%`} />
        <MetricCard icon={Activity} label="Average daily steps" value={formatNumber(metrics.averageDailySteps)} />
        <MetricCard icon={Moon} label="Average sleep" value={metrics.averageSleepHours ? `${metrics.averageSleepHours.toFixed(1)} h` : "Not enough data"} />
        <MetricCard icon={HeartPulse} label="Average heart rate" value={metrics.averageHeartRate ? `${Math.round(metrics.averageHeartRate)} bpm` : "Not enough data"} />
        <MetricCard icon={Dumbbell} label="Workouts" value={metrics.workoutCount.toLocaleString()} />
        <MetricCard icon={TrendingUp} label="Average SpO2" value={metrics.averageSpo2 ? `${metrics.averageSpo2.toFixed(1)}%` : "Not enough data"} />
        <MetricCard icon={Activity} label="Latest weight" value={metrics.latestWeightKg ? `${metrics.latestWeightKg.toFixed(1)} kg` : "Not enough data"} />
        <MetricCard icon={AlertTriangle} label="Warnings" value={metrics.warningCount.toLocaleString()} />
      </div>

      <section id="insights" className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">Top insights</h2>
          <div className="grid gap-4 lg:grid-cols-3">
            {insights.slice(0, 3).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
        <Card>
          <CardContent className="space-y-4 p-5">
            <div>
              <h2 className="text-xl font-semibold">Doctor discussion points</h2>
              <p className="mt-1 text-sm text-muted-foreground">Factual patterns that may be useful if symptoms continue.</p>
            </div>
            {doctorPoints.length ? (
              doctorPoints.map((insight) => (
                <div key={insight.id} className="rounded-md border bg-background p-3 text-sm">
                  <p className="font-medium">{insight.title}</p>
                  <p className="mt-1 text-muted-foreground">{insight.doctorDiscussion ?? insight.summary}</p>
                </div>
              ))
            ) : (
              <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">No doctor-discussion points found yet.</p>
            )}
            <Button asChild variant="secondary" className="w-full">
              <Link href="/report">Open doctor report</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <PeriodSummary insights={insights} />
      <InsightHub insights={insights} />
      <CorrelationExplorer data={active.data} symptoms={displaySymptoms} />
      <div id="timeline">
        <UnusualDaysPanel data={active.data} symptoms={displaySymptoms} />
      </div>
      <div id="symptoms">
        <SymptomPatternPanel data={active.data} symptoms={displaySymptoms} />
      </div>

      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Wearables are not perfect. HealthLens uses this data for tracking and doctor discussion, and it avoids medical claims.
        </CardContent>
      </Card>

      <ChartGrid data={active.data} symptoms={displaySymptoms} />
      <div id="data-quality">
      <DetectionTable detections={active.report.detections.length ? active.report.detections : makeSampleImport().report.detections} />
      </div>
      <SymptomLogPanel />
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
