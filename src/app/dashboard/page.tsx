"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Activity, AlertTriangle, ChevronRight, Dumbbell, HeartPulse, Info, LayoutDashboard, Moon, ShieldCheck, Stethoscope, TrendingUp, Zap } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const qualityLabel = metrics.coverageScore >= 80 ? "Excellent" : metrics.coverageScore >= 55 ? "Good" : metrics.coverageScore >= 25 ? "Limited" : "Sparse";

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">HealthLens Dashboard</span>
          </div>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">Your Health Story</h1>
          <p className="mt-2 text-muted-foreground">Based on your Samsung Health export from {metrics.dateRange?.start ?? "..."} to {metrics.dateRange?.end ?? "..."}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {sampleMode ? (
            <div className="flex items-center gap-3 rounded-full border bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-800 dark:bg-amber-950/20 dark:text-amber-400">
              <Info className="h-4 w-4" />
              <span>Viewing Sample Data</span>
              <Button size="sm" variant="outline" className="h-7 bg-white px-3 text-xs" onClick={() => void setImportResult(makeSampleImport())}>
                Reload Sample
              </Button>
            </div>
          ) : (
            <Badge tone="good" className="rounded-full px-4 py-1">
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              100% Private Analysis
            </Badge>
          )}
          <Button asChild variant="secondary" className="rounded-full">
            <Link href="/upload">Upload New Export</Link>
          </Button>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          icon={Activity} 
          label="Daily Steps" 
          value={formatNumber(metrics.averageDailySteps ?? 0)} 
          description="Avg. steps per day"
          trend={(metrics.averageDailySteps ?? 0) > 7000 ? "Good" : "Low"}
        />
        <MetricCard 
          icon={Moon} 
          label="Sleep Time" 
          value={metrics.averageSleepHours ? `${metrics.averageSleepHours.toFixed(1)}h` : "N/A"} 
          description="Avg. sleep duration"
          trend={metrics.averageSleepHours && metrics.averageSleepHours >= 7 ? "Restful" : "Short"}
        />
        <MetricCard 
          icon={HeartPulse} 
          label="Heart Rate" 
          value={metrics.averageHeartRate ? `${Math.round(metrics.averageHeartRate)}` : "N/A"} 
          unit="bpm"
          description="Avg. resting rate"
        />
        <MetricCard 
          icon={ShieldCheck} 
          label="Data Quality" 
          value={`${metrics.coverageScore}%`} 
          description="Analysis confidence"
          trend={qualityLabel}
        />
      </section>

      {/* Health Story & Doctor Points */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HealthStoryCard story={story} confidence={metrics.coverageScore >= 70 ? "high" : metrics.coverageScore >= 40 ? "medium" : "low"} />
        </div>
        <Card className="border-2 border-primary/10 shadow-sm">
          <CardHeader className="bg-primary/5 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Doctor Notes</CardTitle>
              <Stethoscope className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Top discussion points</p>
            {doctorPoints.length ? (
              <div className="space-y-4">
                {doctorPoints.map((insight) => (
                  <div key={insight.id} className="group relative rounded-xl border p-3 text-sm transition-colors hover:bg-muted/50">
                    <p className="font-bold">{insight.title}</p>
                    <p className="mt-1 text-muted-foreground line-clamp-2">{insight.doctorDiscussion ?? insight.summary}</p>
                  </div>
                ))}
                <Button asChild className="w-full rounded-full mt-2" variant="secondary">
                  <Link href="/report">
                    View Full Doctor Report
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-2xl">
                <Zap className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">No critical points found yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Insights */}
      <section id="insights" className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Top Insights</h2>
            <p className="text-muted-foreground">Significant patterns detected in your data.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="#all-insights">View all</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.slice(0, 3).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </section>

      {/* Data Quality Badge */}
      <Card className="overflow-hidden border-none bg-slate-900 text-white dark:bg-slate-950">
        <CardContent className="flex flex-col justify-between gap-6 p-8 md:flex-row md:items-center">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              Data Coverage Audit
            </h3>
            <p className="max-w-2xl text-slate-400 text-sm">
              Your coverage score is <span className="text-white font-bold">{metrics.coverageScore}%</span>. 
              This reflects how much data was available for analysis across all categories. 
              Higher coverage leads to more accurate insights.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-8 py-4 backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Status</span>
            <span className="text-2xl font-black">{qualityLabel}</span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline & Patterns */}
      <section id="timeline" className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Timeline & Patterns</h2>
          <p className="text-muted-foreground">Detailed daily breakdown and unusual activity detection.</p>
        </div>
        <PeriodSummary insights={insights} />
        <UnusualDaysPanel data={active.data} symptoms={displaySymptoms} />
      </section>

      {/* Secondary Metrics */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold">Activity & Body Metrics</h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MetricCard icon={Dumbbell} label="Workouts" value={metrics.workoutCount.toLocaleString()} description="Total sessions" />
          <MetricCard icon={TrendingUp} label="Avg SpO2" value={metrics.averageSpo2 ? `${metrics.averageSpo2.toFixed(1)}%` : "N/A"} description="Blood oxygen" />
          <MetricCard icon={Activity} label="Weight" value={metrics.latestWeightKg ? `${metrics.latestWeightKg.toFixed(1)} kg` : "N/A"} description="Latest record" />
          <MetricCard icon={AlertTriangle} label="Warnings" value={metrics.warningCount.toLocaleString()} description="Parser notices" />
        </div>
      </section>

      {/* Full Explorer Sections */}
      <section className="space-y-12 pt-10 border-t">
        <div id="all-insights">
          <InsightHub insights={insights} />
        </div>
        <CorrelationExplorer data={active.data} symptoms={displaySymptoms} />
        <div id="symptoms">
          <SymptomPatternPanel data={active.data} symptoms={displaySymptoms} />
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Visual Trends</h2>
            <p className="text-muted-foreground">Interactive charts for deep-diving into your health data.</p>
          </div>
          <ChartGrid data={active.data} symptoms={displaySymptoms} />
        </div>

        <div id="data-quality" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Data Quality Audit</h2>
            <p className="text-muted-foreground">Technical breakdown of file parsing and detections.</p>
          </div>
          <DetectionTable detections={active.report.detections.length ? active.report.detections : makeSampleImport().report.detections} />
        </div>

        <SymptomLogPanel />
      </section>

      <Card className="border-none bg-muted/50">
        <CardContent className="p-6 text-sm text-center text-muted-foreground">
          <p>
            HealthLens uses your wearable data for tracking and educational purposes. 
            Device accuracy varies. This analysis is not a substitute for professional medical advice.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  unit,
  description, 
  trend 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string; 
  unit?: string;
  description: string;
  trend?: string;
}) {
  return (
    <Card className="relative overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <Badge tone="neutral" className="rounded-full text-[10px] font-bold uppercase">
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-black tracking-tight">{value}</span>
            {unit && <span className="text-sm font-medium text-muted-foreground">{unit}</span>}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground/80 leading-none">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
