import type { HealthInsight } from "./insightTypes";
import { tonePriority } from "./insightText";

export function scoreInsight(insight: Omit<HealthInsight, "priorityScore">, impact = 30): number {
  const confidenceBonus = insight.confidence === "high" ? 20 : insight.confidence === "medium" ? 12 : 4;
  const actionBonus = insight.doctorDiscussion || insight.suggestedUserAction ? 10 : 0;
  const limitationPenalty = insight.limitations?.length ? -6 : 0;
  return Math.max(1, Math.min(100, impact + tonePriority(insight.tone) + confidenceBonus + actionBonus + limitationPenalty));
}

export function sortInsights(insights: HealthInsight[]): HealthInsight[] {
  return [...insights].sort((a, b) => b.priorityScore - a.priorityScore || a.title.localeCompare(b.title));
}

