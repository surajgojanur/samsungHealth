"use client";

import { useMemo, useState } from "react";
import type { HealthInsight, InsightCategory } from "@/lib/insights/insightTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InsightCard } from "./InsightCard";

const tabs: Array<{ key: string; label: string; categories?: InsightCategory[]; important?: boolean; doctor?: boolean }> = [
  { key: "all", label: "All" },
  { key: "important", label: "Important", important: true },
  { key: "heart", label: "Heart", categories: ["heart"] },
  { key: "sleep", label: "Sleep", categories: ["sleep"] },
  { key: "activity", label: "Activity", categories: ["activity"] },
  { key: "workouts", label: "Workouts", categories: ["workout"] },
  { key: "symptoms", label: "Symptoms", categories: ["symptom"] },
  { key: "doctor", label: "Doctor discussion", doctor: true },
  { key: "quality", label: "Data quality", categories: ["data_quality"] }
];

export function InsightHub({ insights }: { insights: HealthInsight[] }) {
  const [tab, setTab] = useState("all");
  const [confidence, setConfidence] = useState("all");
  const [category, setCategory] = useState("all");
  const [doctorOnly, setDoctorOnly] = useState(false);
  const [hideLimited, setHideLimited] = useState(false);
  const [range, setRange] = useState("all");
  const [reportIds, setReportIds] = useState<string[]>([]);

  const categories = useMemo(() => [...new Set(insights.map((insight) => insight.category))].sort(), [insights]);
  const filtered = useMemo(() => {
    const activeTab = tabs.find((item) => item.key === tab) ?? tabs[0];
    const now = new Date();
    const minDate =
      range === "7"
        ? new Date(now.getTime() - 7 * 86_400_000).toISOString().slice(0, 10)
        : range === "30"
          ? new Date(now.getTime() - 30 * 86_400_000).toISOString().slice(0, 10)
          : range === "90"
            ? new Date(now.getTime() - 90 * 86_400_000).toISOString().slice(0, 10)
            : undefined;
    return insights.filter((insight) => {
      if (activeTab.categories && !activeTab.categories.includes(insight.category)) return false;
      if (activeTab.important && insight.priorityScore < 70) return false;
      if (activeTab.doctor && !insight.doctorDiscussion && insight.category !== "doctor_discussion") return false;
      if (confidence !== "all" && insight.confidence !== confidence) return false;
      if (category !== "all" && insight.category !== category) return false;
      if (doctorOnly && !insight.doctorDiscussion && insight.category !== "doctor_discussion") return false;
      if (hideLimited && insight.tone === "limited_data") return false;
      if (minDate && insight.dateRange?.end && insight.dateRange.end < minDate) return false;
      return true;
    });
  }, [category, confidence, doctorOnly, hideLimited, insights, range, tab]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h2 className="text-2xl font-semibold">Insight Hub</h2>
          <p className="mt-1 text-sm text-muted-foreground">Plain-language patterns with supporting metrics, confidence, limitations, and doctor-discussion context.</p>
        </div>
        <Badge>{filtered.length} insights</Badge>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((item) => (
          <Button key={item.key} type="button" size="sm" variant={tab === item.key ? "primary" : "secondary"} onClick={() => setTab(item.key)}>
            {item.label}
          </Button>
        ))}
      </div>
      <div className="grid gap-3 rounded-md border bg-card p-3 md:grid-cols-5">
        <label className="sr-only" htmlFor="insight-range">Insight date range</label>
        <select id="insight-range" className="h-10 rounded-md border bg-background px-3 text-sm" value={range} onChange={(event) => setRange(event.target.value)}>
          <option value="all">All time</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
        <label className="sr-only" htmlFor="insight-confidence">Insight confidence</label>
        <select id="insight-confidence" className="h-10 rounded-md border bg-background px-3 text-sm" value={confidence} onChange={(event) => setConfidence(event.target.value)}>
          <option value="all">All confidence</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label className="sr-only" htmlFor="insight-category">Insight category</label>
        <select id="insight-category" className="h-10 rounded-md border bg-background px-3 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>
        <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
          <input type="checkbox" checked={doctorOnly} onChange={(event) => setDoctorOnly(event.target.checked)} />
          Only doctor-worthy
        </label>
        <label className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm">
          <input type="checkbox" checked={hideLimited} onChange={(event) => setHideLimited(event.target.checked)} />
          Hide limited data
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((insight) => (
          <InsightCard
            key={insight.id}
            insight={insight}
            added={reportIds.includes(insight.id)}
            onToggleReport={(id) => setReportIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]))}
          />
        ))}
      </div>
    </section>
  );
}
