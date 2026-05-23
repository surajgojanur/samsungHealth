import { describe, expect, it } from "vitest";
import { activityCsv, badCsv, heartRateCsv } from "../fixtures/samsungCsvFixture";
import { parseVirtualFiles } from "@/lib/parser/importer";

describe("HealthLens importer", () => {
  it("continues after a bad file and parses known categories", async () => {
    const result = await parseVirtualFiles([
      { path: "com.samsung.shealth.tracker.heart_rate.20260523103346.csv", size: heartRateCsv.length, text: heartRateCsv },
      { path: "com.samsung.shealth.tracker.pedometer_day_summary.20260523103346.csv", size: activityCsv.length, text: activityCsv },
      { path: "bad.csv", size: badCsv.length, text: badCsv }
    ]);
    expect(result.data.heartRate).toHaveLength(1);
    expect(result.data.activity).toHaveLength(1);
    expect(result.report.detections.find((item) => item.category === "bloodPressure")?.status).toBe("Unsupported");
  });

  it("does not keep raw Samsung data UUIDs as normalized record IDs", async () => {
    const sleepCsv = `com.samsung.health.sleep,1,3
com.samsung.health.sleep.start_time,com.samsung.health.sleep.end_time,com.samsung.health.sleep.datauuid
2026-05-01 22:00:00.000,2026-05-02 06:00:00.000,[RAW_SLEEP_UUID]
`;
    const workoutCsv = `com.samsung.health.exercise,1,5
com.samsung.health.exercise.start_time,com.samsung.health.exercise.end_time,com.samsung.health.exercise.datauuid,com.samsung.health.exercise.duration,com.samsung.health.exercise.calorie
2026-05-02 08:00:00.000,2026-05-02 08:30:00.000,[RAW_WORKOUT_UUID],1800000,220
`;
    const result = await parseVirtualFiles([
      { path: "com.samsung.health.sleep.20260502.csv", size: sleepCsv.length, text: sleepCsv },
      { path: "com.samsung.health.exercise.20260502.csv", size: workoutCsv.length, text: workoutCsv }
    ]);
    expect(JSON.stringify(result.data)).not.toContain("[RAW_SLEEP_UUID]");
    expect(JSON.stringify(result.data)).not.toContain("[RAW_WORKOUT_UUID]");
  });
});
