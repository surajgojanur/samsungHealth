"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { SymptomLog } from "@/types/health";
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
        <div className="space-y-2">
          {symptoms.length === 0 ? (
            <div className="flex h-full min-h-64 items-center justify-center rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
              No symptoms logged yet. Add symptoms to compare them with sleep, activity, heart rate, workouts, and SpO2 trends.
            </div>
          ) : (
            symptoms.map((symptom) => (
              <div key={symptom.id} className="flex items-start justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{symptom.customSymptom || symptomTypes.find((item) => item.value === symptom.symptomType)?.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(symptom.timestamp).toLocaleString()} · severity {symptom.severity ?? "n/a"}/10
                  </p>
                  {symptom.beforeEvent ? <p className="mt-1 text-sm">Before: {symptom.beforeEvent}</p> : null}
                  {symptom.notes ? <p className="mt-1 text-sm text-muted-foreground">{symptom.notes}</p> : null}
                </div>
                <Button type="button" variant="ghost" size="icon" onClick={() => void removeSymptom(symptom.id)} aria-label="Delete symptom">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
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
