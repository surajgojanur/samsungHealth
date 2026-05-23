"use client";

import type { CategoryDetection } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function DetectionTable({ detections }: { detections: CategoryDetection[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Detection</CardTitle>
        <CardDescription>Availability is based on report-backed Samsung Health filename and header targets.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
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
                  <Badge tone={item.status === "Available" ? "good" : item.status === "Partially available" ? "warn" : "neutral"}>{item.status}</Badge>
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
      </CardContent>
    </Card>
  );
}

