"use client";

import jsPDF from "jspdf";
import Link from "next/link";
import { Download, FileJson, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { computeDashboardMetrics } from "@/lib/analytics";
import { generateDoctorOnePageSummary } from "@/lib/insights/doctorSummaryGenerator";
import { generateInsights } from "@/lib/insights/insightEngine";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";
import { downloadTextFile } from "@/lib/utils";
import { useHealthStore } from "@/store/healthStore";

const disclaimer =
  "This report is based on user-exported wearable wellness data. It may be incomplete or inaccurate and is for personal tracking and doctor discussion only. It does not diagnose, treat, or replace medical advice.";

export default function ReportPage() {
  const importResult = useHealthStore((state) => state.importResult);
  const symptoms = useHealthStore((state) => state.symptoms);
  const active = importResult ?? makeSampleImport();
  const displaySymptoms = !importResult && symptoms.length === 0 ? makeSampleSymptoms() : symptoms;
  const metrics = computeDashboardMetrics(active.data, active.report.warnings.length);
  const insights = generateInsights({ data: active.data, symptoms: displaySymptoms, report: active.report, dateRange: metrics.dateRange });
  const doctorSummary = generateDoctorOnePageSummary({ data: active.data, symptoms: displaySymptoms, report: active.report, insights });

  function exportPdf() {
    const pdf = new jsPDF();
    let y = 16;
    const write = (text: string, size = 10) => {
      pdf.setFontSize(size);
      const wrapped = pdf.splitTextToSize(text, 180);
      pdf.text(wrapped, 15, y);
      y += wrapped.length * (size * 0.45) + 4;
      if (y > 280) {
        pdf.addPage();
        y = 16;
      }
    };
    write("HealthLens — Doctor-Ready Summary", 16);
    write(doctorSummary.disclaimer);
    write(`Date range: ${doctorSummary.dateRange}`);
    write(`Data sources: ${doctorSummary.dataSources.join(", ")}`);
    write(`Data quality note: ${doctorSummary.dataQualityNote}`);
    write("Top objective observations:");
    doctorSummary.topObservations.forEach((observation) => write(`- ${observation}`));
    write(`Symptom summary: ${doctorSummary.symptomSummary}`);
    write(`Pattern summary: ${doctorSummary.patternSummary}`);
    write(`Charts to review: ${doctorSummary.chartRecommendations.join(", ")}`);
    write("Questions to ask:");
    doctorSummary.questionsToAsk.forEach((question) => write(`- ${question}`));
    pdf.addPage();
    y = 16;
    write(doctorSummary.userNotesPrompt);
    write(doctorSummary.disclaimer);
    pdf.save("healthlens-doctor-report.pdf");
  }

  function exportSummaryCsv() {
    const rows = [
      ["metric", "value"],
      ["date_range_start", metrics.dateRange?.start ?? ""],
      ["date_range_end", metrics.dateRange?.end ?? ""],
      ["coverage_score", String(metrics.coverageScore)],
      ["average_daily_steps", String(metrics.averageDailySteps ?? "")],
      ["average_sleep_hours", String(metrics.averageSleepHours ?? "")],
      ["average_heart_rate", String(metrics.averageHeartRate ?? "")],
      ["workouts", String(metrics.workoutCount)],
      ["average_spo2", String(metrics.averageSpo2 ?? "")],
      ["symptoms_logged", String(displaySymptoms.length)],
      ["parser_warnings", String(active.report.warnings.length)],
      ["doctor_pattern_summary", doctorSummary.patternSummary]
    ];
    downloadTextFile("healthlens-summary.csv", rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\n"), "text/csv");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Doctor Report</h1>
          <p className="mt-2 text-muted-foreground">A professional, masked report for doctor discussion. It avoids raw identifiers, locations, route coordinates, private comments, and images.</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Review dashboard</Link>
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardContent className="p-5 text-sm text-amber-950 dark:text-amber-100">
          {disclaimer}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ExportCard title="Download PDF" description="Doctor-friendly summary with disclaimer." icon={Download} onClick={exportPdf} />
        <ExportCard title="Summary CSV" description="Compact metrics table." icon={FileText} onClick={exportSummaryCsv} />
        <ExportCard title="Normalized JSON" description="Parsed records without raw rows." icon={FileJson} onClick={() => downloadTextFile("healthlens-normalized.json", JSON.stringify(active.data, null, 2), "application/json")} />
        <ExportCard title="Parser report JSON" description="Inventory, warnings, and detection table." icon={FileJson} onClick={() => downloadTextFile("healthlens-parser-report.json", JSON.stringify(active.report, null, 2), "application/json")} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Page 1 preview</CardTitle>
          <CardDescription>Short, factual wording based only on files and symptoms in HealthLens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><span className="font-medium">Product:</span> HealthLens — Samsung Health Insights</p>
          <p><span className="font-medium">Date range:</span> {doctorSummary.dateRange}</p>
          <p><span className="font-medium">Data sources:</span> {doctorSummary.dataSources.join(", ")}</p>
          <p><span className="font-medium">Data quality:</span> {doctorSummary.dataQualityNote}</p>
          <div>
            <p className="font-medium">Top observations</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {doctorSummary.topObservations.map((observation) => (
                <li key={observation}>{observation}</li>
              ))}
            </ul>
          </div>
          <p><span className="font-medium">Symptoms:</span> {doctorSummary.symptomSummary}</p>
          <p><span className="font-medium">Pattern summary:</span> {doctorSummary.patternSummary}</p>
          <div>
            <p className="font-medium">Questions to ask</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              {doctorSummary.questionsToAsk.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
          <p>Disclaimer: {disclaimer}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Charts included for review</CardTitle>
          <CardDescription>Use the dashboard chart tables as accessible fallbacks when printed charts are hard to read.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
          {["Heart rate", "Sleep", "Activity", "Workouts", "SpO2 if available", "Symptom timeline"].map((chart) => (
            <div key={chart} className="rounded-md border bg-background p-3">{chart}</div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Doctor report observations table</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Doctor report objective observations table</caption>
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-3">Observation</th>
                <th className="py-2 pr-3">Confidence context</th>
                <th className="py-2">Limitation</th>
              </tr>
            </thead>
            <tbody>
              {doctorSummary.topObservations.map((observation) => (
                <tr key={observation} className="border-b last:border-0">
                  <td className="py-3 pr-3">{observation}</td>
                  <td className="py-3 pr-3">Based on parsed export data and local symptom logs.</td>
                  <td className="py-3 text-muted-foreground">Wearable wellness data may be incomplete or affected by device accuracy.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function ExportCard({ title, description, icon: Icon, onClick }: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; onClick: () => void }) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <Icon className="h-6 w-6 text-primary" />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button className="w-full" onClick={onClick}>
          Export
        </Button>
      </CardContent>
    </Card>
  );
}
