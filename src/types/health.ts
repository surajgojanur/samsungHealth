export type Confidence = "high" | "medium" | "low";

export type CategoryKey =
  | "heartRate"
  | "activity"
  | "sleep"
  | "workouts"
  | "spo2"
  | "body"
  | "calories"
  | "nutrition"
  | "water"
  | "stress"
  | "bloodPressure"
  | "ecg"
  | "menstrualCycle"
  | "metadata"
  | "unknown";

export interface SourceRef {
  fileName: string;
  tableName?: string;
  rowIndex?: number;
  deviceIdMasked?: string;
  timeOffset?: string;
  confidence: Confidence;
}

export interface ParserWarning {
  severity: "low" | "medium" | "high";
  code: string;
  fileName?: string;
  message: string;
  recommendation?: string;
}

export interface HeartRateSample {
  timestamp: string;
  localDate: string;
  bpm: number;
  source: SourceRef;
}

export interface DailyActivity {
  date: string;
  steps?: number;
  distanceMeters?: number;
  caloriesKcal?: number;
  activeTimeMs?: number;
  exerciseTimeMs?: number;
  floors?: number;
  source: SourceRef;
}

export interface SleepSession {
  id: string;
  startTime: string;
  endTime: string;
  localDate: string;
  durationMinutes: number;
  sleepScore?: number;
  efficiency?: number;
  stages?: SleepStageSegment[];
  source: SourceRef;
}

export interface SleepStageSegment {
  startTime: string;
  endTime: string;
  stage: "awake" | "light" | "deep" | "rem" | "unknown";
}

export interface WorkoutSession {
  id: string;
  startTime: string;
  endTime?: string;
  localDate: string;
  exerciseType?: string;
  durationMinutes?: number;
  caloriesKcal?: number;
  distanceMeters?: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  source: SourceRef;
}

export interface SpO2Sample {
  timestamp: string;
  localDate: string;
  spo2: number;
  source: SourceRef;
}

export interface BodyMetricSample {
  timestamp: string;
  localDate: string;
  weightKg?: number;
  heightCm?: number;
  bodyFatPercent?: number;
  skeletalMuscleMassKg?: number;
  bodyFatMassKg?: number;
  basalMetabolicRate?: number;
  totalBodyWater?: number;
  source: SourceRef;
}

export interface NutritionEntry {
  timestamp: string;
  localDate: string;
  mealType?: string;
  caloriesKcal?: number;
  carbohydrateG?: number;
  proteinG?: number;
  fatG?: number;
  source: SourceRef;
}

export interface WaterIntake {
  timestamp: string;
  localDate: string;
  amountMl: number;
  source: SourceRef;
}

export interface StressSample {
  timestamp: string;
  localDate: string;
  score?: number;
  kind: "stress" | "breathing" | "mood" | "vitality";
  durationSeconds?: number;
  source: SourceRef;
}

export interface DataSourceMetadata {
  sourceId?: string;
  manufacturer?: string;
  model?: string;
  appPackage?: string;
  firstSeen?: string;
  lastSeen?: string;
  masked: true;
}

export interface SymptomLog {
  id: string;
  timestamp: string;
  localDate: string;
  symptomType:
    | "muscle_twitch"
    | "palpitation"
    | "dizziness"
    | "headache"
    | "pain"
    | "fatigue"
    | "other";
  customSymptom?: string;
  bodyLocation?: string;
  durationSeconds?: number;
  severity?: number;
  notes?: string;
  beforeEvent?: string;
  flags?: {
    caffeine?: boolean;
    workout?: boolean;
    poorSleep?: boolean;
    doctorNote?: boolean;
  };
}

export interface FileInventoryItem {
  path: string;
  fileName: string;
  extension: string;
  size: number;
  category: CategoryKey;
  tableName?: string;
  schemaVersion?: string;
  rowCount?: number;
  parsedCount?: number;
  skippedCount?: number;
  confidence: Confidence;
  status: "parsed" | "skipped" | "rejected" | "failed" | "unsupported";
  notes?: string;
  warnings: ParserWarning[];
}

export interface CategoryDetection {
  category: CategoryKey;
  label: string;
  status: "Available" | "Missing" | "Partially available" | "Unknown format";
  fileCount: number;
  rowCount: number;
  dateRange?: { start: string; end: string };
  confidence: Confidence;
  notes: string;
}

export interface NormalizedHealthData {
  heartRate: HeartRateSample[];
  activity: DailyActivity[];
  sleep: SleepSession[];
  workouts: WorkoutSession[];
  spo2: SpO2Sample[];
  body: BodyMetricSample[];
  nutrition: NutritionEntry[];
  water: WaterIntake[];
  stress: StressSample[];
  metadata: DataSourceMetadata[];
}

export interface ParserReport {
  generatedAt: string;
  dateRange?: { start: string; end: string };
  inventory: FileInventoryItem[];
  detections: CategoryDetection[];
  warnings: ParserWarning[];
  unsupportedFiles: FileInventoryItem[];
  totals: {
    files: number;
    csvFiles: number;
    jsonFiles: number;
    imageFiles: number;
    unsupportedFiles: number;
    parsedRows: number;
    sidecarFiles: number;
    compressedBytes?: number;
    uncompressedBytes?: number;
  };
}

export interface ImportResult {
  data: NormalizedHealthData;
  report: ParserReport;
  debugPreview?: Array<Record<string, string | number | null>>;
}

