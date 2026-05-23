"use client";

import { useMemo, useState } from "react";
import type { HealthInsight } from "@/lib/insights/insightTypes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function PeriodSummary({ insights }: { insights: HealthInsight[] }) {
  const [range, setRange] = useState("30");
  const summary = useMemo(() => {
    const positives = insights.filter((insight) => insight.tone === "positive");
    const attention = insights.filter((insight) => insight.tone === "attention");
    const consistent = insights.filter((insight) => insight.tone === "neutral");
    const missing = insights.filter((insight) => insight.tone === "limited_data");
    const doctor = insights.find((insight) => insight.doctorDiscussion || insight.category === "doctor_discussion");
    return {
      improved: positives[0]?.plainLanguage ?? "No clear improvement pattern found yet.",
      declined: attention[0]?.plainLanguage ?? "No clear decline pattern found yet.",
      consistent: consistent[0]?.plainLanguage ?? "No strong consistency pattern found yet.",
      missing: missing[0]?.plainLanguage ?? "No major missing-data warning stood out.",
      watch: attention[1]?.plainLanguage ?? "Keep watching sleep, activity, symptoms, and device coverage.",
      doctor: doctor?.doctorDiscussion ?? doctor?.summary ?? "No strong doctor-discussion point found yet."
    };
  }, [insights]);

  return (
    <Card>
      <CardHeader className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <CardTitle>Selected period summary</CardTitle>
          <CardDescription>What improved, declined, stayed consistent, and needs better data.</CardDescription>
        </div>
        <select className="h-10 rounded-md border bg-background px-3 text-sm" value={range} onChange={(event) => setRange(event.target.value)}>
          <option value="7">7 days</option>
          <option value="30">30 days</option>
          <option value="90">90 days</option>
          <option value="all">All time</option>
          <option value="custom">Custom</option>
        </select>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <SummaryItem label="What improved" text={summary.improved} tone="good" />
        <SummaryItem label="What declined" text={summary.declined} tone="warn" />
        <SummaryItem label="Stayed consistent" text={summary.consistent} tone="neutral" />
        <SummaryItem label="Missing data" text={summary.missing} tone="warn" />
        <SummaryItem label="What to watch" text={summary.watch} tone="neutral" />
        <SummaryItem label="Doctor report" text={summary.doctor} tone="warn" />
      </CardContent>
    </Card>
  );
}

function SummaryItem({ label, text, tone }: { label: string; text: string; tone: "good" | "warn" | "neutral" }) {
  return (
    <div className="rounded-md border bg-background p-4">
      <Badge tone={tone}>{label}</Badge>
      <p className="mt-3 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}

