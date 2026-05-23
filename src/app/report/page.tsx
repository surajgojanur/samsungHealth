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
  "This report is based on user-exported wearable wellness data. It may be incomplete or inaccurate and is for personal tracking and doctor discussion only. It does not replace professional medical advice.";

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
    write("HealthLens Doctor Discussion Report", 16);
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
          <p className="mt-2 text-muted-foreground">One-page masked summary for doctor discussion. Charts remain available on the dashboard.</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard">Review dashboard</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ExportCard title="Download PDF" description="Doctor-friendly summary with disclaimer." icon={Download} onClick={exportPdf} />
        <ExportCard title="Summary CSV" description="Compact metrics table." icon={FileText} onClick={exportSummaryCsv} />
        <ExportCard title="Normalized JSON" description="Parsed records without raw rows." icon={FileJson} onClick={() => downloadTextFile("healthlens-normalized.json", JSON.stringify(active.data, null, 2), "application/json")} />
        <ExportCard title="Parser report JSON" description="Inventory, warnings, and detection table." icon={FileJson} onClick={() => downloadTextFile("healthlens-parser-report.json", JSON.stringify(active.report, null, 2), "application/json")} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>One-page summary preview</CardTitle>
          <CardDescription>Short, factual, non-diagnostic wording based only on files and symptoms in HealthLens.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p><span className="font-medium">Date range:</span> {doctorSummary.dateRange}</p>
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
