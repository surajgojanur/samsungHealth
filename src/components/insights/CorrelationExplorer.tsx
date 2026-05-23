"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from "recharts";
import type { NormalizedHealthData, SymptomLog } from "@/types/health";
import { calculateHealthCorrelations } from "@/lib/analytics/correlations";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CorrelationExplorer({ data, symptoms }: { data: NormalizedHealthData; symptoms: SymptomLog[] }) {
  const relationships = useMemo(() => calculateHealthCorrelations(data, symptoms), [data, symptoms]);
  const [selected, setSelected] = useState(relationships[0]?.id ?? "");
  const active = relationships.find((item) => item.id === selected) ?? relationships[0];

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">Explore relationships</h2>
        <p className="mt-1 text-sm text-muted-foreground">Relationship cards compare overlapping dates only and avoid cause claims.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {relationships.map((relationship) => (
          <button
            key={relationship.id}
            type="button"
            onClick={() => setSelected(relationship.id)}
            className="rounded-md border bg-card p-4 text-left transition hover:border-primary"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{relationship.metricX.replace(/[A-Z]/g, " $&")} + {relationship.metricY.replace(/[A-Z]/g, " $&")}</p>
              <Badge tone={relationship.confidence === "high" ? "good" : relationship.confidence === "medium" ? "neutral" : "warn"}>{relationship.confidence}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{relationship.plainLanguage}</p>
            <p className="mt-2 text-xs text-muted-foreground">n={relationship.sampleSize}{relationship.coefficient !== undefined ? `, r=${relationship.coefficient.toFixed(2)}` : ""}</p>
          </button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scatter plot</CardTitle>
          <CardDescription>{active?.plainLanguage ?? "Not enough overlapping data yet."}</CardDescription>
        </CardHeader>
        <CardContent>
          {active && active.points.length >= 3 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart data={active.points}>
                  <CartesianGrid />
                  <XAxis dataKey="x" name={active.metricX} />
                  <YAxis dataKey="y" name={active.metricY} />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <ReferenceLine ifOverflow="extendDomain" stroke="hsl(var(--muted-foreground))" />
                  <Scatter dataKey="y" fill="hsl(var(--primary))" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">Not enough data for a scatter plot.</div>
          )}
          <div className="mt-4 rounded-md border bg-muted/40 p-3 text-sm">
            <p className="font-medium">Explain this in simple words</p>
            <p className="mt-1 text-muted-foreground">{active?.plainLanguage ?? "Not enough data for reliable relationship analysis."}</p>
            {active?.limitation ? <p className="mt-1 text-muted-foreground">{active.limitation}</p> : null}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

