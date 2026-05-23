"use client";

import type { CategoryDetection } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DetectionTable({ detections }: { detections: CategoryDetection[] }) {
  const score = qualityScore(detections);
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div>
            <CardTitle>Data Detection</CardTitle>
            <CardDescription>
              Availability is based on report-backed Samsung Health filename and header targets. Missing categories are normal when a metric was not recorded or not included in the export.
            </CardDescription>
          </div>
          <Badge tone={score.tone}>{score.label} data quality</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{score.description}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <caption className="sr-only">Samsung Health data category availability and quality notes</caption>
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Files</th>
                <th className="py-2 pr-3">Rows</th>
                <th className="py-2 pr-3">Date range</th>
                <th className="py-2 pr-3">Confidence</th>
                <th className="py-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {detections.map((item) => (
                <tr key={item.category} className="border-b last:border-0">
                  <td className="py-3 pr-3 font-medium">{item.label}</td>
                  <td className="py-3 pr-3">
                    <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                  </td>
                  <td className="py-3 pr-3">{item.fileCount}</td>
                  <td className="py-3 pr-3">{item.rowCount.toLocaleString()}</td>
                  <td className="py-3 pr-3">{item.dateRange ? `${item.dateRange.start.slice(0, 10)} to ${item.dateRange.end.slice(0, 10)}` : "Not found in this export."}</td>
                  <td className="py-3 pr-3">{item.confidence}</td>
                  <td className="py-3 text-muted-foreground">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function statusTone(status: CategoryDetection["status"]): "neutral" | "good" | "warn" | "bad" {
  if (status === "Available") return "good";
  if (status === "Limited" || status === "Experimental") return "warn";
  return "neutral";
}

function qualityScore(detections: CategoryDetection[]): { label: "Excellent" | "Good" | "Limited" | "Sparse"; tone: "neutral" | "good" | "warn"; description: string } {
  const core = detections.filter((item) => ["activity", "heartRate", "sleep", "workouts", "spo2", "body"].includes(item.category));
  const available = core.filter((item) => item.status === "Available").length;
  if (available >= 5) return { label: "Excellent", tone: "good", description: "Most core wellness categories are available, so HealthLens can compare patterns with higher confidence." };
  if (available >= 3) return { label: "Good", tone: "good", description: "Several core categories are available. Some insights may still be limited by missing or sparse records." };
  if (available >= 1) return { label: "Limited", tone: "warn", description: "Only a small set of core categories is available, so HealthLens keeps insight confidence conservative." };
  return { label: "Sparse", tone: "warn", description: "Very little supported health data was found. Missing categories are not errors; they usually mean those metrics were not recorded or exported." };
}
