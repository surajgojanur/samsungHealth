"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Bug, FileText, HeartPulse, Lock, Settings, Sparkles, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { href: "/dashboard", label: "Overview", icon: HeartPulse },
  { href: "/dashboard#insights", label: "Insights", icon: Sparkles },
  { href: "/dashboard#timeline", label: "Timeline", icon: BarChart3 },
  { href: "/dashboard#symptoms", label: "Symptoms", icon: Activity },
  { href: "/report", label: "Doctor Report", icon: FileText },
  { href: "/dashboard#data-quality", label: "Data Quality", icon: Lock },
  { href: "/debug/parser", label: "Parser Debug", icon: Bug },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/privacy", label: "Privacy", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="h-5 w-5" />
            </span>
            <span>HealthLens</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                    pathname === item.href && "bg-muted text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Button asChild size="sm" className="md:hidden">
            <Link href="/upload">Analyze</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">{children}</main>
    </div>
  );
}
