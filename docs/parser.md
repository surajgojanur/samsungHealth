# Parser Notes

Samsung Health CSV files use a nonstandard shape:

1. Line 1 is metadata.
2. Line 2 is the real header.
3. Line 3 onward contains data rows.

HealthLens preserves this behavior in `src/lib/parser/samsungCsv.ts`.

Parser responsibilities:

- File inventory
- Safety checks
- CSV metadata/header handling
- Header normalization
- Known category mapping
- Normalized TypeScript models
- Parser warnings and data-quality signals

Insight generation must happen above normalized data.

