"use client";

import { useState } from "react";
import { FilePlus2, ShieldCheck, Sparkles } from "lucide-react";
import type { HealthStory } from "@/lib/insights/insightTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HealthStoryCard({ story, confidence = "medium" }: { story: HealthStory; confidence?: "high" | "medium" | "low" }) {
  const [added, setAdded] = useState(false);
  const bullets = [story.topPositivePattern, story.topAttentionPattern, story.symptomPattern].filter(Boolean).slice(0, 3);
  return (
    <Card className="border-primary/25 bg-card shadow-md">
      <CardHeader className="gap-3">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-2xl">{story.title}</CardTitle>
                <Badge tone={confidence === "high" ? "good" : confidence === "medium" ? "neutral" : "warn"}>{confidence} confidence</Badge>
                <Badge tone="good">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Processed locally
                </Badge>
              </div>
              <p className="mt-2 max-w-4xl text-lg text-muted-foreground">{story.oneLineSummary}</p>
            </div>
          </div>
          <Button type="button" variant={added ? "secondary" : "primary"} onClick={() => setAdded((value) => !value)}>
            <FilePlus2 className="h-4 w-4" />
            {added ? "Added to doctor report" : "Add to doctor report"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          {bullets.map((bullet) => (
            <div key={bullet} className="rounded-md border bg-background p-4 text-sm">
              {bullet}
            </div>
          ))}
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{story.detailedSummary}</p>
        {story.dataLimitations.length ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
            {story.dataLimitations[0]}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

