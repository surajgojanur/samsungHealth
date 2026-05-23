import { describe, expect, it } from "vitest";
import { heartRateCsv } from "../fixtures/samsungCsvFixture";
import { normalizeHeader, parseSamsungCsv } from "@/lib/parser/samsungCsv";

describe("Samsung CSV parser", () => {
  it("skips metadata line and uses line 2 as the header", () => {
    const parsed = parseSamsungCsv("heart.csv", heartRateCsv);
    expect(parsed.tableName).toBe("com.samsung.shealth.tracker.heart_rate");
    expect(parsed.headers).toContain("com_samsung_health_heart_rate_start_time");
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.rows[0].com_samsung_health_heart_rate_heart_rate).toBe(82);
  });

  it("normalizes headers to snake case", () => {
    expect(normalizeHeader("com.samsung.health.heart-rate Start Time")).toBe("com_samsung_health_heart_rate_start_time");
  });
});

