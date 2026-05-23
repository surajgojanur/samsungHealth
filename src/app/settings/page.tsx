"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useHealthStore } from "@/store/healthStore";

export default function SettingsPage() {
  const persistenceConsent = useHealthStore((state) => state.persistenceConsent);
  const debugMode = useHealthStore((state) => state.debugMode);
  const strictPrivacy = useHealthStore((state) => state.strictPrivacy);
  const setPersistenceConsent = useHealthStore((state) => state.setPersistenceConsent);
  const setDebugMode = useHealthStore((state) => state.setDebugMode);
  const setStrictPrivacy = useHealthStore((state) => state.setStrictPrivacy);
  const reset = useHealthStore((state) => state.reset);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="mt-2 text-muted-foreground">Control local persistence, debug visibility, and privacy masking.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Privacy and parser settings</CardTitle>
          <CardDescription>Persistence stores normalized records and symptoms in IndexedDB only after consent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Toggle label="IndexedDB persistence consent" checked={persistenceConsent} onChange={(value) => void setPersistenceConsent(value)} />
          <Toggle label="Strict privacy masking" checked={strictPrivacy} onChange={setStrictPrivacy} />
          <Toggle label="Parser debug panel" checked={debugMode} onChange={setDebugMode} />
          <Button variant="danger" onClick={() => void reset()}>
            <RotateCcw className="h-4 w-4" />
            Delete/reset all local data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between rounded-md border p-3">
      <span className="font-medium">{label}</span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 accent-primary" />
    </label>
  );
}

