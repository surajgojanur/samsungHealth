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
    expect(result.report.detections.find((item) => item.category === "bloodPressure")?.status).toBe("Missing");
  });
});

