import Dexie, { type Table } from "dexie";
import type { ImportResult, SymptomLog } from "@/types/health";

interface StoredImport {
  id: string;
  createdAt: string;
  result: ImportResult;
}

class HealthLensDb extends Dexie {
  imports!: Table<StoredImport, string>;
  symptoms!: Table<SymptomLog, string>;

  constructor() {
    super("healthlens");
    this.version(1).stores({
      imports: "id, createdAt",
      symptoms: "id, localDate, symptomType"
    });
  }
}

export const db = new HealthLensDb();

export async function clearAllStoredData(): Promise<void> {
  await db.transaction("rw", db.imports, db.symptoms, async () => {
    await db.imports.clear();
    await db.symptoms.clear();
  });
}

