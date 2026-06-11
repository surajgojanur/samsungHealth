"use client";

import { useState } from "react";
import { Info, Plus, Trash2 } from "lucide-react";
import type { SymptomLog } from "@/types/health";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHealthStore } from "@/store/healthStore";

const symptomTypes: Array<{ value: SymptomLog["symptomType"]; label: string }> = [
  { value: "muscle_twitch", label: "Muscle twitching" },
  { value: "palpitation", label: "Palpitations" },
  { value: "dizziness", label: "Dizziness" },
  { value: "headache", label: "Headache" },
  { value: "pain", label: "Pain" },
  { value: "fatigue", label: "Fatigue" },
  { value: "other", label: "Other" }
];

export function SymptomLogPanel() {
  const symptoms = useHealthStore((state) => state.symptoms);
  const addSymptom = useHealthStore((state) => state.addSymptom);
  const removeSymptom = useHealthStore((state) => state.removeSymptom);
  const [type, setType] = useState<SymptomLog["symptomType"]>("muscle_twitch");
  const [custom, setCustom] = useState("");
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16));
  const [severity, setSeverity] = useState(5);
  const [duration, setDuration] = useState("");
  const [bodyLocation, setBodyLocation] = useState("");
  const [beforeEvent, setBeforeEvent] = useState("");
  const [notes, setNotes] = useState("");
  const [flags, setFlags] = useState({ caffeine: false, workout: false, poorSleep: false, stress: false, doctorNote: false });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const timestamp = new Date(dateTime).toISOString();
    await addSymptom({
      id: crypto.randomUUID(),
      timestamp,
      localDate: timestamp.slice(0, 10),
      symptomType: type,
      customSymptom: custom || undefined,
      severity,
      durationSeconds: duration ? Number(duration) * 60 : undefined,
      bodyLocation: bodyLocation || undefined,
      beforeEvent: beforeEvent || undefined,
      notes: notes || undefined,
      flags: {
        caffeine: flags.caffeine,
        workout: flags.workout,
        poorSleep: flags.poorSleep,
        stress: flags.stress,
        doctorNote: flags.doctorNote
      }
    });
    setNotes("");
    setCustom("");
    setBeforeEvent("");
    setFlags({ caffeine: false, workout: false, poorSleep: false, stress: false, doctorNote: false });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Symptom Pattern Timeline</CardTitle>
        <CardDescription>Samsung Health does not include symptoms in this export, so HealthLens stores these local notes separately.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        <form className="space-y-3" onSubmit={(event) => void submit(event)}>
          <Field label="Symptom type">
            <select id="symptom-type" className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={type} onChange={(event) => setType(event.target.value as SymptomLog["symptomType"])}>
            {symptomTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
            </select>
          </Field>
          {type === "other" ? (
            <Field label="Custom symptom">
              <Input id="custom-symptom" value={custom} onChange={(event) => setCustom(event.target.value)} />
            </Field>
          ) : null}
          <Field label="Date/time">
            <Input id="symptom-date-time" type="datetime-local" value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
          </Field>
          <Field label="Body location">
            <Input id="body-location" value={bodyLocation} onChange={(event) => setBodyLocation(event.target.value)} />
          </Field>
          <Field label="Severity 1-10">
            <Input id="severity" aria-describedby="severity-help" type="number" min={1} max={10} value={severity} onChange={(event) => setSeverity(Number(event.target.value))} />
          </Field>
          <p id="severity-help" className="sr-only">Choose a severity from 1 to 10.</p>
          <Field label="Duration in minutes">
            <Input id="duration" inputMode="numeric" value={duration} onChange={(event) => setDuration(event.target.value)} />
          </Field>
          <Field label="What happened before?">
            <Input id="before-event" value={beforeEvent} onChange={(event) => setBeforeEvent(event.target.value)} />
          </Field>
          <div className="grid gap-2 rounded-md border p-3 text-sm">
            <Checkbox label="Caffeine recently?" checked={flags.caffeine} onChange={(value) => setFlags((current) => ({ ...current, caffeine: value }))} />
            <Checkbox label="Workout recently?" checked={flags.workout} onChange={(value) => setFlags((current) => ({ ...current, workout: value }))} />
            <Checkbox label="Poor sleep?" checked={flags.poorSleep} onChange={(value) => setFlags((current) => ({ ...current, poorSleep: value }))} />
            <Checkbox label="Stress?" checked={flags.stress} onChange={(value) => setFlags((current) => ({ ...current, stress: value }))} />
            <Checkbox label="Mark for doctor report" checked={flags.doctorNote} onChange={(value) => setFlags((current) => ({ ...current, doctorNote: value }))} />
          </div>
          <Field label="Notes">
            <textarea
              id="symptom-notes"
              className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </Field>
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4" />
            Add symptom
          </Button>
        </form>
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Logged Symptoms</p>
          {symptoms.length === 0 ? (
            <div className="flex flex-col h-full min-h-[400px] items-center justify-center rounded-3xl border-2 border-dashed p-10 text-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <p className="text-lg font-bold text-slate-700 dark:text-slate-300">No symptoms logged yet</p>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                Want better health patterns? Add symptoms like <span className="font-medium text-foreground">headache, fatigue, chest discomfort, dizziness, or stress</span> to see how they correlate with your wearable data.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-2 w-full max-w-sm">
                <Badge tone="neutral" className="justify-center py-2">Fatigue</Badge>
                <Badge tone="neutral" className="justify-center py-2">Caffeine</Badge>
                <Badge tone="neutral" className="justify-center py-2">Poor Sleep</Badge>
                <Badge tone="neutral" className="justify-center py-2">Stress</Badge>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              {symptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-950 p-4 shadow-sm hover:border-primary/30 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold">{symptom.customSymptom || symptomTypes.find((item) => item.value === symptom.symptomType)?.label}</p>
                      <Badge tone={symptom.severity && symptom.severity > 7 ? "bad" : "warn"} className="rounded-full px-2 py-0 h-5 text-[10px]">
                        Severity {symptom.severity}/10
                      </Badge>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-tight">
                      {new Date(symptom.timestamp).toLocaleString()}
                    </p>
                    {symptom.beforeEvent && (
                      <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                        <Info className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>Before: {symptom.beforeEvent}</span>
                      </div>
                    )}
                    {symptom.notes && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{symptom.notes}</p>}
                    
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {symptom.flags?.caffeine && <Badge tone="neutral" className="text-[9px] uppercase font-bold">Caffeine</Badge>}
                      {symptom.flags?.poorSleep && <Badge tone="neutral" className="text-[9px] uppercase font-bold">Poor Sleep</Badge>}
                      {symptom.flags?.stress && <Badge tone="neutral" className="text-[9px] uppercase font-bold">Stress</Badge>}
                      {symptom.flags?.doctorNote && <Badge tone="good" className="text-[9px] uppercase font-bold">Doctor Report</Badge>}
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 rounded-full" onClick={() => void removeSymptom(symptom.id)} aria-label="Delete symptom">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactElement<{ id?: string }> }) {
  return (
    <div className="space-y-1">
      <label htmlFor={children.props.id} className="text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-primary" />
      <span>{label}</span>
    </label>
  );
}
