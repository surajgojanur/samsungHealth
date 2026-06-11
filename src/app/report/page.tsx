"use client";

import jsPDF from "jspdf";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Download, FileJson, FileText, Printer, ShieldCheck, Stethoscope, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { computeDashboardMetrics } from "@/lib/analytics";
import { generateDoctorOnePageSummary } from "@/lib/insights/doctorSummaryGenerator";
import { generateInsights } from "@/lib/insights/insightEngine";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";
import { downloadTextFile } from "@/lib/utils";
import { useHealthStore } from "@/store/healthStore";
import { Badge } from "@/components/ui/badge";

const disclaimer =
  "This report is based on user-exported wearable wellness data. It may be incomplete or inaccurate and is for personal tracking and doctor discussion only. It does not diagnose, treat, or replace medical advice.";

export default function ReportPage() {
  const importResult = useHealthStore((state) => state.importResult);
  const symptoms = useHealthStore((state) => state.symptoms);
  const selectedInsightIds = useHealthStore((state) => state.selectedInsightIds);
  const selectedDayDates = useHealthStore((state) => state.selectedDayDates);
  const toggleInsightSelection = useHealthStore((state) => state.toggleInsightSelection);
  const toggleDaySelection = useHealthStore((state) => state.toggleDaySelection);
  const resetSelections = () => {
    useHealthStore.setState({ selectedInsightIds: [], selectedDayDates: [] });
  };

  const active = importResult ?? makeSampleImport();
  const displaySymptoms = !importResult && symptoms.length === 0 ? makeSampleSymptoms() : symptoms;
  const metrics = computeDashboardMetrics(active.data, active.report.warnings.length);
  const allInsights = generateInsights({ data: active.data, symptoms: displaySymptoms, report: active.report, dateRange: metrics.dateRange });
  
  const selectedInsights = allInsights.filter(i => selectedInsightIds.includes(i.id));
  const doctorSummary = generateDoctorOnePageSummary({ 
    data: active.data, 
    symptoms: displaySymptoms, 
    report: active.report, 
    insights: selectedInsights.length > 0 ? selectedInsights : allInsights 
  });

  function exportPdf() {
    const pdf = new jsPDF();
    let y = 20;

    const checkPage = (height: number) => {
      if (y + height > 280) {
        pdf.addPage();
        y = 20;
        return true;
      }
      return false;
    };

    const drawHeader = (text: string) => {
      pdf.setFillColor(240, 244, 255);
      pdf.rect(15, y, 180, 10, 'F');
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.setTextColor(30, 58, 138);
      pdf.text(text.toUpperCase(), 20, y + 7);
      y += 15;
      pdf.setTextColor(0);
    };

    // Cover / Header
    pdf.setFontSize(22);
    pdf.setFont("helvetica", "bold");
    pdf.text("HealthLens Report", 15, y);
    y += 10;
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleDateString()} | Date Range: ${doctorSummary.dateRange}`, 15, y);
    y += 15;

    // Disclaimer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 0, 0);
    const wrappedDisclaimer = pdf.splitTextToSize(`DISCLAIMER: ${disclaimer}`, 180);
    pdf.text(wrappedDisclaimer, 15, y);
    y += wrappedDisclaimer.length * 4 + 10;
    pdf.setTextColor(0);

    // Summary Table
    drawHeader("Executive Summary");
    const summaryRows = [
      ["Coverage Score", `${metrics.coverageScore}%`],
      ["Avg Daily Steps", formatVal(metrics.averageDailySteps)],
      ["Avg Sleep", metrics.averageSleepHours ? `${metrics.averageSleepHours.toFixed(1)}h` : "N/A"],
      ["Avg Heart Rate", metrics.averageHeartRate ? `${Math.round(metrics.averageHeartRate)} bpm` : "N/A"],
      ["Total Symptoms", `${displaySymptoms.length} logged`]
    ];
    
    pdf.setFontSize(10);
    summaryRows.forEach(([label, val]) => {
      pdf.setFont("helvetica", "bold");
      pdf.text(label, 20, y);
      pdf.setFont("helvetica", "normal");
      pdf.text(val, 80, y);
      y += 7;
    });
    y += 10;

    // Insights
    drawHeader("Priority Insights");
    const targetInsights = selectedInsights.length > 0 ? selectedInsights : allInsights.slice(0, 5);
    targetInsights.forEach(insight => {
      checkPage(30);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text(insight.title, 20, y);
      y += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      const wrapped = pdf.splitTextToSize(insight.summary, 170);
      pdf.text(wrapped, 20, y);
      y += wrapped.length * 4 + 3;
      if (insight.doctorDiscussion) {
        pdf.setFont("helvetica", "italic");
        pdf.setTextColor(80);
        pdf.text(`Note: ${insight.doctorDiscussion}`, 20, y);
        pdf.setTextColor(0);
        y += 5;
      }
      y += 5;
    });

    // Unusual Days
    if (selectedDayDates.length > 0) {
      y += 5;
      drawHeader("Highlighted Unusual Days");
      selectedDayDates.forEach(date => {
        checkPage(20);
        pdf.setFont("helvetica", "bold");
        pdf.text(date, 20, y);
        y += 5;
        const dayFlags = doctorSummary.patternSummary.split(";").filter(s => s.includes(date));
        pdf.setFont("helvetica", "normal");
        pdf.text(dayFlags.length > 0 ? dayFlags.join(", ") : "Manual selection for review.", 25, y);
        y += 8;
      });
    }

    // Chart Placeholders (Simulated)
    checkPage(40);
    drawHeader("Data Trends Review");
    pdf.setFontSize(9);
    pdf.text("Clinical Review of Steps, Sleep, and Heart Rate trends provided in digital dashboard.", 20, y);
    y += 20;

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text("HealthLens is an open-source tool. Data processed locally in user's browser.", 15, 285);

    pdf.save(`healthlens-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  function formatVal(v: any) {
    if (typeof v === 'number') return v.toLocaleString();
    return v || "N/A";
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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Stethoscope className="h-5 w-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Clinical Export</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Doctor Report Builder</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            Prepare a professional summary of your health data. Only selected insights and days will be included in the priority sections.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button onClick={exportPdf} className="rounded-full px-8 shadow-lg shadow-primary/20">
            <Printer className="mr-2 h-4 w-4" />
            Generate PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {/* Selected Insights */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Added Insights ({selectedInsights.length})
              </h2>
              {selectedInsightIds.length > 0 && (
                <Button variant="ghost" size="sm" onClick={resetSelections} className="text-muted-foreground hover:text-red-500">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
            
            {selectedInsights.length > 0 ? (
              <div className="grid gap-4">
                {selectedInsights.map(insight => (
                  <Card key={insight.id} className="border-2 border-primary/10">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{insight.title}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={() => toggleInsightSelection(insight.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{insight.summary}</p>
                      {insight.doctorDiscussion && (
                        <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-xs italic border-l-4 border-primary">
                          "{insight.doctorDiscussion}"
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed p-10 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <AlertCircle className="h-10 w-10 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-lg font-bold text-muted-foreground">No insights selected yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                  Go to your Dashboard and click "Add to Report" on the patterns you want to discuss with your doctor.
                </p>
                <Button asChild variant="outline" className="mt-6 rounded-full" size="sm">
                  <Link href="/dashboard#insights">Browse Insights</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Selected Days */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Highlighted Days ({selectedDayDates.length})
            </h2>
            {selectedDayDates.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {selectedDayDates.map(date => (
                  <Badge key={date} tone="neutral" className="pl-4 pr-2 py-2 rounded-full border-2 border-primary/10 bg-white dark:bg-slate-800 text-sm font-bold">
                    {date}
                    <button onClick={() => toggleDaySelection(date)} className="ml-2 p-1 hover:bg-slate-100 rounded-full">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border-2 border-dashed p-8 text-center bg-slate-50/50 dark:bg-slate-900/50 text-sm text-muted-foreground">
                No specific days highlighted for review.
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <Card className="bg-slate-900 text-white dark:bg-slate-950 border-none overflow-hidden">
            <CardHeader className="bg-white/10">
              <CardTitle className="text-lg flex items-center gap-2">
                <Printer className="h-5 w-5" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security & Privacy</p>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Masked identifiers (No Name/ID)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>No location/GPS data included</span>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <Button onClick={exportPdf} className="w-full rounded-xl h-12 font-bold" variant="primary">
                  <Printer className="mr-2 h-5 w-5" />
                  Download PDF
                </Button>
                <Button onClick={exportSummaryCsv} variant="ghost" className="w-full text-slate-300 hover:text-white hover:bg-white/10 rounded-xl h-12 font-bold">
                  <Download className="mr-2 h-5 w-5" />
                  Download CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-700">
                <AlertCircle className="h-4 w-4" />
                Medical Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-200/60">
                {disclaimer}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Raw Data Exports */}
      <section className="pt-10 border-t space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Advanced Exports</h2>
          <p className="text-muted-foreground">Download the normalized records for external analysis.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ExportAction 
            title="Normalized Health JSON" 
            desc="Flat JSON records of all parsed categories." 
            icon={FileJson} 
            onClick={() => downloadTextFile("healthlens-normalized.json", JSON.stringify(active.data, null, 2), "application/json")} 
          />
          <ExportAction 
            title="Parser Technical Report" 
            desc="Inventory and warnings for auditing parsing accuracy." 
            icon={FileText} 
            onClick={() => downloadTextFile("healthlens-parser-report.json", JSON.stringify(active.report, null, 2), "application/json")} 
          />
        </div>
      </section>
    </div>
  );
}

function ExportAction({ title, desc, icon: Icon, onClick }: { title: string; desc: string; icon: any; onClick: () => void }) {
  return (
    <Card className="group hover:border-primary/30 transition-all cursor-pointer" onClick={onClick}>
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 group-hover:bg-primary group-hover:text-white transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold">{title}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
        <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardContent>
    </Card>
  );
}
