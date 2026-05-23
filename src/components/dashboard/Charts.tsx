"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyHeartRate, dailySpo2 } from "@/lib/analytics";

function EmptyChart({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">Not enough data in this export.</div>
      </CardContent>
    </Card>
  );
}

export function ChartGrid({ data, symptoms }: { data: NormalizedHealthData; symptoms: SymptomLog[] }) {
  const heart = dailyHeartRate(data.heartRate);
  const spo2 = dailySpo2(data.spo2);
  const sleep = data.sleep.map((item) => ({ date: item.localDate, hours: Number((item.durationMinutes / 60).toFixed(2)), score: item.sleepScore }));
  const workouts = data.workouts.map((item) => ({ date: item.localDate, minutes: item.durationMinutes ?? 0, calories: item.caloriesKcal ?? 0 }));
  const body = data.body.filter((item) => item.weightKg !== undefined).map((item) => ({ date: item.localDate, weight: item.weightKg }));
  const symptomCounts = symptoms.reduce<Record<string, number>>((acc, symptom) => {
    acc[symptom.localDate] = (acc[symptom.localDate] ?? 0) + 1;
    return acc;
  }, {});
  const activityWithSymptoms = data.activity.map((item) => ({ ...item, symptoms: symptomCounts[item.date] ?? 0 }));
  const fallbackRows = [
    ...heart.slice(0, 6).map((item) => ({ chart: "Heart rate trend", date: item.date, value: `${Math.round(item.bpm)} bpm` })),
    ...sleep.slice(0, 6).map((item) => ({ chart: "Sleep trend", date: item.date, value: `${item.hours} hours` })),
    ...activityWithSymptoms.slice(0, 6).map((item) => ({ chart: "Steps trend", date: item.date, value: `${item.steps?.toLocaleString() ?? 0} steps` })),
    ...symptoms.slice(0, 6).map((item) => ({ chart: "Symptom timeline", date: item.localDate, value: `${item.customSymptom ?? item.symptomType.replaceAll("_", " ")} severity ${item.severity ?? "not recorded"}` }))
  ];

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {heart.length ? (
        <MetricChart title="Heart rate trend" description="Daily average bpm from Samsung heart-rate rows. Date range follows parsed local dates.">
          <LineChart data={heart}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
            <Tooltip />
            <Line dataKey="bpm" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </MetricChart>
      ) : (
        <EmptyChart title="Heart rate trend" description="Requires heart-rate rows." />
      )}

      {data.activity.length ? (
        <MetricChart title="Steps daily trend" description="Daily step totals with symptom markers overlaid as bars.">
          <ComposedChart data={activityWithSymptoms}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Area yAxisId="left" dataKey="steps" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary))" />
            <Bar yAxisId="right" dataKey="symptoms" fill="hsl(var(--accent))" />
          </ComposedChart>
        </MetricChart>
      ) : (
        <EmptyChart title="Steps daily trend" description="Requires daily activity rows." />
      )}

      {sleep.length ? (
        <MetricChart title="Sleep duration" description="Sleep session duration in hours. Interpret trends as wellness data only.">
          <AreaChart data={sleep}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis />
            <Tooltip />
            <Area dataKey="hours" fill="hsl(var(--primary) / 0.18)" stroke="hsl(var(--primary))" />
          </AreaChart>
        </MetricChart>
      ) : (
        <EmptyChart title="Sleep duration" description="Requires sleep session rows." />
      )}

      {workouts.length ? (
        <MetricChart title="Workout duration" description="Workout minutes from exercise sessions.">
          <BarChart data={workouts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="hsl(var(--primary))" />
          </BarChart>
        </MetricChart>
      ) : (
        <EmptyChart title="Workout duration" description="Requires exercise rows." />
      )}

      {spo2.length ? (
        <MetricChart title="SpO2 trend" description="Average parsed SpO2 values. Coverage and device accuracy can affect this chart.">
          <LineChart data={spo2}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis domain={[80, 100]} />
            <Tooltip />
            <Line dataKey="spo2" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
          </LineChart>
        </MetricChart>
      ) : (
        <EmptyChart title="SpO2 trend" description="Requires oxygen saturation rows." />
      )}

      {body.length ? (
        <MetricChart title="Body weight trend" description="Body metric trend from weight rows.">
          <LineChart data={body}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" minTickGap={30} />
            <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
            <Tooltip />
            <Line dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </MetricChart>
      ) : (
        <EmptyChart title="Body weight trend" description="Requires weight rows." />
      )}
      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Chart table fallback</CardTitle>
          <CardDescription>Text summaries for important charts so trends remain accessible without relying on chart visuals.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <caption className="sr-only">Accessible fallback table for heart rate, sleep, steps, and symptom timeline charts</caption>
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th className="py-2 pr-3">Chart</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {fallbackRows.length ? (
                fallbackRows.map((row, index) => (
                  <tr key={`${row.chart}-${row.date}-${index}`} className="border-b last:border-0">
                    <td className="py-3 pr-3 font-medium">{row.chart}</td>
                    <td className="py-3 pr-3">{row.date}</td>
                    <td className="py-3 text-muted-foreground">{row.value}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-3 text-muted-foreground" colSpan={3}>Not enough parsed data for chart table summaries.</td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricChart({ title, description, children }: { title: string; description: string; children: React.ReactElement }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
