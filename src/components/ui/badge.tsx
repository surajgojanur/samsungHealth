import { cn } from "@/lib/utils";

export function Badge({ className, tone = "neutral", children }: { className?: string; tone?: "neutral" | "good" | "warn" | "bad"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        {
          "bg-muted text-muted-foreground": tone === "neutral",
          "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200": tone === "good",
          "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200": tone === "warn",
          "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200": tone === "bad"
        },
        className
      )}
    >
      {children}
    </span>
  );
}

