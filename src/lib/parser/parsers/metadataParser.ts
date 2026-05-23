import type { DataSourceMetadata, ParserWarning } from "@/types/health";
import { firstString, type SamsungCsvFile } from "@/lib/parser/samsungCsv";

export function parseMetadata(files: SamsungCsvFile[]): { metadata: DataSourceMetadata[]; warnings: ParserWarning[] } {
  const metadata: DataSourceMetadata[] = [];
  const warnings: ParserWarning[] = [];
  for (const file of files) {
    if (!/(device_profile|user_profile)/.test(file.fileName.toLowerCase())) continue;
    file.rows.forEach((row) => {
      metadata.push({
        manufacturer: firstString(row, ["manufacturer"]),
        model: firstString(row, ["model", "fixed_name"]),
        appPackage: "[MASKED_ID]",
        firstSeen: firstString(row, ["create_time"]),
        lastSeen: firstString(row, ["update_time"]),
        masked: true
      });
    });
  }
  return { metadata, warnings };
}

