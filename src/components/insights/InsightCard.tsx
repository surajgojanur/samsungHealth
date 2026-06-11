"use client";

import { Activity, AlertCircle, BarChart3, CheckCircle2, ChevronRight, Droplets, Dumbbell, HeartPulse, LineChart, Moon, Plus, Scale, ShieldCheck, Sparkles, Stethoscope, Utensils } from "lucide-react";
import type { HealthInsight, InsightCategory } from "@/lib/insights/insightTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const icons: Record<InsightCategory, React.ComponentType<{ className?: string }>> = {
  overview: Sparkles,
  heart: HeartPulse,
  sleep: Moon,
  activity: Activity,
  workout: Dumbbell,
  spo2: LineChart,
  body: Scale,
  nutrition: Utensils,
  water: Droplets,
  stress: BarChart3,
  symptom: AlertCircle,
  data_quality: ShieldCheck,
  doctor_discussion: Stethoscope
};

function confidenceTone(confidence: HealthInsight["confidence"]) {
  return confidence === "high" ? "good" : confidence === "medium" ? "neutral" : "warn";
}

function insightTone(tone: HealthInsight["tone"]) {
  if (tone === "positive") return "good";
  if (tone === "attention" || tone === "limited_data") return "warn";
  return "neutral";
}

export function InsightCard({ 
  insight, 
  added, 
  onToggleReport,
  onViewChart
}: { 
  insight: HealthInsight; 
  added?: boolean; 
  onToggleReport?: (id: string) => void;
  onViewChart?: (insight: HealthInsight) => void;
}) {
  const Icon = icons[insight.category];
  return (
    <Card className="flex flex-col h-full overflow-hidden border-none bg-slate-50 dark:bg-slate-900 shadow-none hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-colors">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-primary shadow-sm">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">{insight.category.replace("_", " ")}</p>
              <CardTitle className="text-lg leading-tight mt-0.5">{insight.title}</CardTitle>
            </div>
          </div>
          <Badge tone={insightTone(insight.tone)} className="rounded-full">{insight.tone.replace("_", " ")}</Badge>
        </div>
        
        <p className="text-sm font-medium leading-relaxed">{insight.plainLanguage}</p>

        <div className="flex flex-wrap gap-2">
          <Badge tone={confidenceTone(insight.confidence)} className="bg-white/50 dark:bg-slate-950/50">{insight.confidence} confidence</Badge>
          {insight.supportingMetric ? <Badge className="bg-white/50 dark:bg-slate-950/50">{insight.supportingMetric}</Badge> : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1 flex flex-col pt-0">
        <div className="space-y-3 flex-1">
          <div className="rounded-2xl bg-white/60 dark:bg-slate-950/40 p-4 text-sm leading-relaxed text-muted-foreground border border-white/20 dark:border-slate-800/50">
            {insight.summary}
          </div>

          <details className="group rounded-xl border bg-white/40 dark:bg-slate-950/20 px-4 py-2 text-sm">
            <summary className="flex cursor-pointer items-center justify-between font-bold text-xs uppercase tracking-wider text-muted-foreground py-1">
              Why this matters
              <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90" />
            </summary>
            <p className="mt-2 text-muted-foreground pb-2">{insight.whyItMatters}</p>
          </details>

          {insight.possibleReasons && insight.possibleReasons.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Possible reasons</p>
              <div className="flex flex-wrap gap-1.5">
                {insight.possibleReasons.map(reason => (
                  <Badge key={reason} tone="neutral" className="bg-white/40 dark:bg-slate-950/20 text-[10px]">
                    {reason}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {insight.suggestedUserAction && (
            <div className="rounded-xl bg-primary/5 dark:bg-primary/10 p-4 border border-primary/10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">What to do next</p>
              <p className="text-sm font-medium text-primary/90">{insight.suggestedUserAction}</p>
              {insight.nextTrackingSteps && (
                <p className="mt-2 text-xs text-primary/70 italic border-t border-primary/10 pt-2">
                  {insight.nextTrackingSteps}
                </p>
              )}
            </div>
          )}

          {insight.limitations?.length ? (
            <div className="rounded-xl bg-amber-50/50 dark:bg-amber-950/10 p-4 border border-amber-100 dark:border-amber-900/30">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500 mb-1">Data limitation</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-200/60 leading-relaxed">{insight.limitations[0]}</p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 rounded-full bg-white dark:bg-slate-950 px-4 text-xs font-bold" 
            type="button"
            onClick={() => onViewChart?.(insight)}
          >
            <BarChart3 className="mr-2 h-3 w-3" />
            View Chart
          </Button>
          <Button 
            size="sm" 
            variant={added ? "secondary" : "ghost"} 
            className="h-9 rounded-full px-4 text-xs font-bold" 
            type="button" 
            onClick={() => onToggleReport?.(insight.id)}
          >
            {added ? <CheckCircle2 className="mr-2 h-3 w-3" /> : <Plus className="mr-2 h-3 w-3" />}
            {added ? "In Report" : "Add to Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
