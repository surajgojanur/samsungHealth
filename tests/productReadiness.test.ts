import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseVirtualFiles } from "@/lib/parser/importer";
import { generateDoctorOnePageSummary } from "@/lib/insights/doctorSummaryGenerator";
import { generateInsights } from "@/lib/insights/insightEngine";
import { analyzeSymptomPatterns } from "@/lib/insights/symptomInsights";
import { makeSampleImport, makeSampleSymptoms } from "@/lib/sampleData";

describe("production readiness copy and safety", () => {
  it("keeps required privacy and positioning copy in public surfaces", () => {
    const landing = readFileSync("src/app/page.tsx", "utf8");
    const privacy = readFileSync("src/app/privacy/page.tsx", "utf8");
    const readme = readFileSync("README.md", "utf8");
    expect(landing).toContain("Turn your Samsung Health export into private, understandable insights.");
    expect(privacy).toContain("Your files are processed entirely inside your browser.");
    expect(readme).toContain("HealthLens — Samsung Health Insights");
    expect(readme).toContain("HealthLens is an independent open-source project and is not affiliated with, endorsed by, or connected to Samsung Electronics Co., Ltd.");
  });

  it("uses fake sample data for demo-mode insight and report generation", () => {
    const sample = makeSampleImport();
    const symptoms = makeSampleSymptoms();
    const insights = generateInsights({ data: sample.data, symptoms, report: sample.report });
    const doctor = generateDoctorOnePageSummary({ data: sample.data, symptoms, report: sample.report, insights });
    expect(sample.report.warnings.some((warning) => warning.code === "SAMPLE_DATA")).toBe(true);
    expect(insights.some((insight) => insight.category === "symptom")).toBe(true);
    expect(doctor.dataSources.length).toBeGreaterThan(3);
  });

  it("generates symptom pattern wording without cause claims", () => {
    const sample = makeSampleImport();
    const note = analyzeSymptomPatterns(sample.data, makeSampleSymptoms()).doctorReadyNote;
    expect(note).toContain("This does not prove a cause");
    expect(note).toContain("may be useful to discuss with a doctor if symptoms continue");
  });

  it("keeps unknown and unsafe files out of parsed health data", async () => {
    const result = await parseVirtualFiles([
      { path: "export/readme.txt", size: 12, text: "hello" },
      { path: "export/profile.jpg", size: 4, bytes: new Uint8Array([1, 2, 3, 4]) }
    ]);
    expect(result.report.unsupportedFiles.some((item) => item.extension === "txt")).toBe(true);
    expect(result.report.warnings.some((warning) => warning.code === "IMAGE_SKIPPED")).toBe(true);
    expect(result.report.warnings.some((warning) => warning.code === "NO_USEFUL_HEALTH_FILES_FOUND")).toBe(true);
  });

  it("marks data detection with normal-user statuses", () => {
    const detections = makeSampleImport().report.detections;
    expect(detections.map((item) => item.status)).toEqual(expect.arrayContaining(["Available", "Missing", "Limited", "Experimental", "Unsupported"]));
    expect(detections.find((item) => item.category === "bloodPressure")?.notes).toContain("usually means it was not recorded");
  });
});
