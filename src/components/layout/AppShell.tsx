"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Bug, FileText, LayoutDashboard, Lock, Settings, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useHealthStore } from "@/store/healthStore";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/report", label: "Doctor Report", icon: FileText },
  { href: "/upload", label: "Upload", icon: Upload }
];

const secondaryNav = [
  { href: "/privacy", label: "Privacy", icon: Lock },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const debugMode = useHealthStore((state) => state.debugMode);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </span>
            <div className="hidden sm:block">
              <span className="block text-lg font-bold leading-tight tracking-tight">HealthLens</span>
              <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground/80">Private Health Insights</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[...mainNav, ...secondaryNav].map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            {debugMode && (
              <Link
                href="/debug/parser"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors text-amber-600 hover:bg-amber-50",
                  pathname === "/debug/parser" && "bg-amber-50"
                )}
              >
                <Bug className="h-4 w-4" />
                Debug
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="hidden sm:flex rounded-full px-5">
              <Link href="/upload">Analyze Export</Link>
            </Button>
            <Button asChild size="icon" variant="ghost" className="md:hidden">
              <Link href="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20 md:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t bg-white/95 p-2 backdrop-blur-lg dark:bg-slate-950/95 md:hidden">
        {[...mainNav, { href: "/settings", label: "Settings", icon: Settings }].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl p-2 min-w-[64px] transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <footer className="hidden border-t bg-white dark:bg-slate-950 md:block">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <div className="space-y-1">
            <p className="font-semibold text-foreground">HealthLens</p>
            <p>An independent open-source project. Not affiliated with Samsung.</p>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/settings" className="hover:text-foreground">Settings</Link>
            <p>Local-first by default. For personal tracking and doctor discussion only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
