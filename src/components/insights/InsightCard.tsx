"use client";

import { Activity, AlertCircle, BarChart3, Droplets, Dumbbell, FilePlus2, HeartPulse, LineChart, Moon, Scale, ShieldCheck, Sparkles, Stethoscope, ToggleLeft, ToggleRight, Utensils } from "lucide-react";
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

export function InsightCard({ insight, added, onToggleReport }: { insight: HealthInsight; added?: boolean; onToggleReport?: (id: string) => void }) {
  const Icon = icons[insight.category];
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <CardTitle className="leading-snug">{insight.title}</CardTitle>
              <p className="mt-2 text-sm text-muted-foreground">{insight.plainLanguage}</p>
            </div>
          </div>
          <Badge tone={insightTone(insight.tone)}>{insight.tone.replace("_", " ")}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={confidenceTone(insight.confidence)}>{insight.confidence} confidence</Badge>
          {insight.supportingMetric ? <Badge>{insight.supportingMetric}</Badge> : null}
          {insight.doctorDiscussion ? <Badge tone="warn">doctor-worthy</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{insight.summary}</p>
        <details className="rounded-md border bg-muted/35 p-3 text-sm">
          <summary className="cursor-pointer font-medium">Why this matters</summary>
          <p className="mt-2 text-muted-foreground">{insight.whyItMatters}</p>
        </details>
        {insight.limitations?.length ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            <p className="font-medium">Data limitation</p>
            <p className="mt-1">{insight.limitations[0]}</p>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" type="button">
            <BarChart3 className="h-4 w-4" />
            View chart
          </Button>
          <Button size="sm" variant={added ? "secondary" : "ghost"} type="button" onClick={() => onToggleReport?.(insight.id)}>
            {added ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {added ? "Added to report" : "Add to report"}
          </Button>
          {insight.doctorDiscussion ? (
            <Button size="sm" variant="ghost" type="button">
              <FilePlus2 className="h-4 w-4" />
              Doctor note
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

