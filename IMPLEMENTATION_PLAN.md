# HealthLens Implementation Plan

## Source of Truth

The MVP parser and UI are based on `SAMSUNG_HEALTH_SCHEMA_ANALYSIS_REPORT.md`. Samsung Health structure must be treated as report-driven, not inferred from generic CSV assumptions.

## Build Order

1. Project setup: Next.js App Router, TypeScript strict mode, Tailwind CSS, client-side worker parsing, tests.
2. Parser architecture: file inventory, security validation, Samsung CSV reader, sidecar resolver, normalized models.
3. Upload workflow: ZIP, folder, and manual file list support with progress and reset.
4. Category parsers: activity, heart rate, sleep, workouts, SpO2, body metrics, nutrition, water, stress, metadata.
5. Analytics engine: daily/weekly aggregation, rolling averages, baseline comparison, outliers, coverage, missing days.
6. Product UI: landing, upload, dashboard, report, privacy, settings, debug parser.
7. Symptom log: local manual entries and timeline overlays.
8. Doctor report: browser PDF, summary CSV, normalized JSON, parser report JSON.
9. Privacy and persistence: local-first default, IndexedDB only after consent, masking, reset.
10. Verification: anonymized fixtures, parser/security/timezone tests, lint, typecheck, build.

## MVP Scope

Ready categories:
- Steps/activity
- Heart rate
- Sleep
- Exercise/workouts
- SpO2
- Body metrics
- Calories/activity
- Data quality
- Doctor report

Limited categories:
- Nutrition
- Water
- Stress/recovery

Missing categories shown explicitly:
- Blood pressure
- ECG
- Menstrual cycle

## Architecture

- Browser-only parsing through a Web Worker.
- Main thread handles upload UI, state, charts, report export, and persistence consent.
- Worker handles ZIP extraction, file inventory, Samsung CSV parsing, category normalization, and parser warnings.
- Raw rows are not kept in application state after normalization unless debug mode is enabled.
- JSON sidecars are indexed by filename and parsed lazily when a category parser asks for them.

## Key Risks

- Samsung CSV line 1 is metadata and line 2 is the true header.
- Timestamp formats are mixed between local strings, epoch milliseconds, and epoch seconds.
- Daily charts must group by local date, not UTC date alone.
- JSON sidecars are numerous and can be large.
- Location, device IDs, UUIDs, comments, food names, and images must be masked or excluded by default.
- Unknown files must be visible but safely unsupported.

