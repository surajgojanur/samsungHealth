"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ChartGrid } from "@/components/dashboard/Charts";
import { DetectionTable } from "@/components/dashboard/DetectionTable";
import { CorrelationExplorer } from "@/components/insights/CorrelationExplorer";
import { HealthStoryCard } from "@/components/insights/HealthStoryCard";
import { InsightHub } from "@/components/insights/InsightHub";
import { PeriodSummary } from "@/components/insights/PeriodSummary";
import { SymptomPatternPanel } from "@/components/symptoms/SymptomPatternPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateHealthStory } from "@/lib/insights/healthStory";
import { generateInsights } from "@/lib/insights/insightEngine";
import { generateDoctorOnePageSummary } from "@/lib/insights/doctorSummaryGenerator";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";

export default function DemoPage() {
  const sample = makeSampleImport();
  const symptoms = makeSampleSymptoms();
  const insights = generateInsights({ data: sample.data, symptoms, report: sample.report, dateRange: sample.report.dateRange });
  const story = generateHealthStory(sample.data, symptoms, sample.report.dateRange);
  const doctor = generateDoctorOnePageSummary({ data: sample.data, symptoms, report: sample.report, insights });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold">Demo mode</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone="warn">Sample data</Badge>
            <p className="text-muted-foreground">You are viewing fake sample data. No personal health files are loaded.</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/upload">
            Analyze my export
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardContent className="p-5 text-sm text-amber-950 dark:text-amber-100">
          You are viewing fake sample data. No personal health files are loaded.
        </CardContent>
      </Card>
      <HealthStoryCard story={story} confidence="high" />
      <InsightHub insights={insights} />
      <SymptomPatternPanel data={sample.data} symptoms={symptoms} />
      <CorrelationExplorer data={sample.data} symptoms={symptoms} />
      <ChartGrid data={sample.data} symptoms={symptoms} />
      <DetectionTable detections={sample.report.detections} />
      <Card>
        <CardHeader>
          <CardTitle>Doctor report preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p>{doctor.dateRange}</p>
          <p>{doctor.dataQualityNote}</p>
          <p>{doctor.symptomSummary}</p>
          <p>{doctor.patternSummary}</p>
        </CardContent>
      </Card>
      <PeriodSummary insights={insights} />
    </div>
  );
}
