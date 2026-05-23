"use client";

import { create } from "zustand";
import type { ImportResult, SymptomLog } from "@/types/health";
import { clearAllStoredData, db } from "@/lib/storage/db";

interface HealthState {
  importResult?: ImportResult;
  symptoms: SymptomLog[];
  persistenceConsent: boolean;
  debugMode: boolean;
  strictPrivacy: boolean;
  setImportResult: (result: ImportResult) => Promise<void>;
  setSymptoms: (symptoms: SymptomLog[]) => void;
  addSymptom: (symptom: SymptomLog) => Promise<void>;
  removeSymptom: (id: string) => Promise<void>;
  setPersistenceConsent: (value: boolean) => Promise<void>;
  setDebugMode: (value: boolean) => void;
  setStrictPrivacy: (value: boolean) => void;
  hydrate: () => Promise<void>;
  reset: () => Promise<void>;
}

export const useHealthStore = create<HealthState>((set, get) => ({
  symptoms: [],
  persistenceConsent: false,
  debugMode: false,
  strictPrivacy: true,
  async setImportResult(result) {
    set({ importResult: result });
    if (get().persistenceConsent) {
      await db.imports.put({ id: "latest", createdAt: new Date().toISOString(), result });
    }
  },
  setSymptoms(symptoms) {
    set({ symptoms });
  },
  async addSymptom(symptom) {
    const symptoms = [...get().symptoms, symptom].sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    set({ symptoms });
    if (get().persistenceConsent) await db.symptoms.put(symptom);
  },
  async removeSymptom(id) {
    set({ symptoms: get().symptoms.filter((symptom) => symptom.id !== id) });
    if (get().persistenceConsent) await db.symptoms.delete(id);
  },
  async setPersistenceConsent(value) {
    set({ persistenceConsent: value });
    if (!value) await clearAllStoredData();
    if (value && get().importResult) {
      await db.imports.put({ id: "latest", createdAt: new Date().toISOString(), result: get().importResult! });
      await db.symptoms.bulkPut(get().symptoms);
    }
  },
  setDebugMode(value) {
    set({ debugMode: value });
  },
  setStrictPrivacy(value) {
    set({ strictPrivacy: value });
  },
  async hydrate() {
    const latest = await db.imports.get("latest");
    const symptoms = await db.symptoms.toArray();
    set({ importResult: latest?.result, symptoms });
  },
  async reset() {
    await clearAllStoredData();
    set({ importResult: undefined, symptoms: [], persistenceConsent: false, debugMode: false, strictPrivacy: true });
  }
}));
