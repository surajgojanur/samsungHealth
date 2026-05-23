import { describe, expect, it } from "vitest";
import { deriveLocalDate, parseEpochMs, parseEpochSeconds, parseSamsungLocalTimestamp, parseTimeOffset } from "@/lib/parser/time";

describe("Samsung time parser", () => {
  it("parses UTC offset strings", () => {
    expect(parseTimeOffset("UTC+0530")).toBe(330);
    expect(parseTimeOffset("UTC-0400")).toBe(-240);
  });

  it("parses local timestamp and preserves local date", () => {
    const parsed = parseSamsungLocalTimestamp("2026-02-26 15:30:00.000", "UTC+0530");
    expect(parsed?.toISOString()).toBe("2026-02-26T10:00:00.000Z");
    expect(deriveLocalDate(parsed!, "UTC+0530")).toBe("2026-02-26");
  });

  it("parses epoch milliseconds and seconds", () => {
    expect(parseEpochMs("1772150400000")?.toISOString()).toContain("2026");
    expect(parseEpochSeconds("1762394911")?.toISOString()).toContain("2025");
  });
});

