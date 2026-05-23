import type { NormalizedHealthData, ParserWarning } from "@/types/health";
import type { SamsungCsvFile } from "@/lib/parser/samsungCsv";
import { parseActivity } from "./activityParser";
import { parseBody } from "./bodyParser";
import { parseHeartRate } from "./heartRateParser";
import { parseMetadata } from "./metadataParser";
import { parseNutrition } from "./nutritionParser";
import { parseSleep } from "./sleepParser";
import { parseSpO2 } from "./spo2Parser";
import { parseStress } from "./stressParser";
import { parseWater } from "./waterParser";
import { parseWorkouts } from "./workoutParser";

export function parseNormalizedHealth(files: SamsungCsvFile[]): { data: NormalizedHealthData; warnings: ParserWarning[] } {
  const heart = parseHeartRate(files);
  const activity = parseActivity(files);
  const sleep = parseSleep(files);
  const workouts = parseWorkouts(files);
  const spo2 = parseSpO2(files);
  const body = parseBody(files);
  const nutrition = parseNutrition(files);
  const water = parseWater(files);
  const stress = parseStress(files);
  const metadata = parseMetadata(files);

  return {
    data: {
      heartRate: heart.samples,
      activity: activity.activity,
      sleep: sleep.sleep,
      workouts: workouts.workouts,
      spo2: spo2.spo2,
      body: body.body,
      nutrition: nutrition.nutrition,
      water: water.water,
      stress: stress.stress,
      metadata: metadata.metadata
    },
    warnings: [
      ...heart.warnings,
      ...activity.warnings,
      ...sleep.warnings,
      ...workouts.warnings,
      ...spo2.warnings,
      ...body.warnings,
      ...nutrition.warnings,
      ...water.warnings,
      ...stress.warnings,
      ...metadata.warnings
    ]
  };
}

