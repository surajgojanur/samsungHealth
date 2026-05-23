import { describe, expect, it } from "vitest";
import { validateExtension, validateVirtualPath, defaultParserLimits } from "@/lib/parser/security";

describe("parser security", () => {
  it("rejects traversal paths", () => {
    expect(validateVirtualPath("../secret.csv")?.code).toBe("PATH_TRAVERSAL_REJECTED");
  });

  it("rejects executable and HTML-like files", () => {
    expect(validateExtension("run.exe", defaultParserLimits)?.code).toBe("DANGEROUS_FILE_REJECTED");
    expect(validateExtension("index.html", defaultParserLimits)?.code).toBe("DANGEROUS_FILE_REJECTED");
  });

  it("skips images by default", () => {
    expect(validateExtension("meal.jpg", defaultParserLimits)?.code).toBe("IMAGE_SKIPPED");
  });
});

