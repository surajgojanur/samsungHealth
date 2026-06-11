"use client";

import { AlertTriangle, Lock, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthStore } from "@/store/healthStore";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const persistenceConsent = useHealthStore((state) => state.persistenceConsent);
  const debugMode = useHealthStore((state) => state.debugMode);
  const strictPrivacy = useHealthStore((state) => state.strictPrivacy);
  const setPersistenceConsent = useHealthStore((state) => state.setPersistenceConsent);
  const setDebugMode = useHealthStore((state) => state.setDebugMode);
  const setStrictPrivacy = useHealthStore((state) => state.setStrictPrivacy);
  const reset = useHealthStore((state) => state.reset);

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-20">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your local data, privacy controls, and application behavior.</p>
      </div>

      <div className="grid gap-6">
        {/* Privacy & Persistence */}
        <Card className="border-2 border-primary/10 shadow-sm">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Data Persistence & Privacy</CardTitle>
                <CardDescription>Control how your health data is stored and masked on this device.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4">
              <Toggle 
                label="Remember analysis on this browser" 
                description="Stores your parsed health records in a local browser database (IndexedDB) so you don't have to re-upload next time."
                checked={persistenceConsent} 
                onChange={(value) => void setPersistenceConsent(value)} 
              />
              <Toggle 
                label="Strict privacy masking" 
                description="Aggressively hide identifiers like device IDs and account names from all UI views and reports."
                checked={strictPrivacy} 
                onChange={setStrictPrivacy} 
              />
              <Toggle 
                label="Enable Parser Debug Panel" 
                description="Show technical parsing logs and raw data tables. Recommended for developers only."
                checked={debugMode} 
                onChange={setDebugMode} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-100 bg-red-50/30 dark:border-red-900/30 dark:bg-red-950/10">
          <CardHeader>
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-5 w-5" />
              <CardTitle>Danger Zone</CardTitle>
            </div>
            <CardDescription>Irreversible actions for your local health data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-white p-6 dark:border-red-900/30 dark:bg-slate-900">
              <div className="space-y-1">
                <p className="font-bold text-red-600 dark:text-red-400">Delete Local Analysis</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This will immediately clear all uploaded data, parsed records, symptom logs, and local settings from this browser. 
                  This action cannot be undone.
                </p>
              </div>
              <Button
                variant="danger"
                className="w-full sm:w-auto rounded-full px-8"
                onClick={() => {
                  if (window.confirm("This will permanently delete all local analysis and symptom logs from this browser. Continue?")) {
                    void reset();
                  }
                }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Delete All Local Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About / Contribution */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-none bg-slate-100 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm">HealthLens is Open Source</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We believe health tools should be transparent. You can view our source code, 
                contribute to the parser, or host your own version of HealthLens on GitHub.
              </p>
              <Button asChild variant="ghost" className="h-auto p-0 mt-3 text-xs underline">
                <a href="https://github.com/surajgojanur/samsungHealth" target="_blank" rel="noreferrer">
                  View Repository →
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="border-none bg-slate-100 dark:bg-slate-900">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <CardTitle className="text-sm">Medical Disclaimer</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                HealthLens is a data analysis tool, not a medical device. Always consult 
                a qualified healthcare professional for medical advice or diagnosis.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Toggle({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description?: string;
  checked: boolean; 
  onChange: (value: boolean) => void;
}) {
  return (
    <label className={cn(
      "flex flex-col gap-2 rounded-2xl border p-5 transition-all cursor-pointer",
      checked ? "border-primary bg-primary/5 ring-1 ring-primary/10" : "hover:border-primary/20 hover:bg-muted/30"
    )}>
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">{label}</span>
        <div className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
             style={{ backgroundColor: checked ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground) / 0.3)' }}>
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={(event) => onChange(event.target.checked)} 
            className="sr-only"
          />
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
              checked ? "translate-x-5" : "translate-x-1"
            )}
          />
        </div>
      </div>
      {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}
    </label>
  );
}
