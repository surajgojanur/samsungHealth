# HealthLens

Private, local-first health insights from Samsung Health exports.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Local-first](https://img.shields.io/badge/local--first-yes-teal)
![Privacy-first](https://img.shields.io/badge/privacy--first-yes-teal)
![No server upload](https://img.shields.io/badge/no%20server%20upload-default-green)
![Open source](https://img.shields.io/badge/open%20source-MIT-blue)

HealthLens is a privacy-first local web app for Samsung Health personal data exports. It turns an export ZIP or extracted folder into a private dashboard, insight hub, symptom timeline, data-quality report, and doctor-friendly one-page summary.

## Screenshots

Screenshot placeholders are tracked in `docs/screenshots.md`.

- `docs/assets/overview.png`
- `docs/assets/insight-hub.png`
- `docs/assets/doctor-report.png`
- `docs/assets/demo.gif`

## Architecture

```text
User ZIP/folder
  -> Browser file picker
  -> Web Worker parser
  -> Normalized health models
  -> Analytics engine
  -> Insight engine
  -> Dashboard + Doctor report
```

## Why This Project Exists

Samsung Health exports contain useful personal history, but raw CSV files are difficult for normal users to interpret. HealthLens focuses on clear personal patterns:

- What is improving?
- What is getting worse?
- What days were unusual compared with your baseline?
- What data is missing or unreliable?
- What might be useful for a doctor discussion?

## What Makes It Different

- Local-first parsing by default.
- Samsung CSV behavior is preserved: line 1 metadata, line 2 real header, line 3 onward data.
- Insight Intelligence Layer above normalized data, not inside the parser.
- Symptom logs can be compared with sleep, steps, heart rate, workouts, SpO2, stress, water, and notes.
- Relationship analysis avoids cause claims.
- Sparse data is called out instead of hidden.

## Privacy Promise

- Raw health files are not uploaded to a server by default.
- No cloud account is required.
- No analytics tracking is enabled by default.
- IndexedDB persistence is disabled until explicit consent.
- Reset clears IndexedDB, parser state, cached normalized records, and symptom logs.
- Meal/profile images and route/location data are excluded by default.

Never commit real Samsung Health exports.

## Medical Disclaimer

HealthLens is for personal tracking and doctor discussion only. Wearable data can be incomplete or inaccurate. HealthLens does not replace professional medical advice.

## Supported Data Types

- Steps/activity
- Heart rate
- Sleep and sleep stages
- Workouts
- SpO2
- Body metrics
- Calories/activity
- Nutrition
- Water
- Stress/recovery wellness records
- Manual symptom log
- Doctor report
- Data quality

Unsupported or inventory-only files remain visible in the parser report.

## Insight Engine

The Insight Intelligence Layer lives in `src/lib/insights/` and generates plain-language cards with:

- Category
- Confidence
- Why this matters
- Supporting metric
- Limitations for sparse data
- Doctor-discussion wording where relevant
- Priority score

The safety guard in `src/lib/safety/medicalClaimGuard.ts` blocks forbidden medical-claim wording in tests and sanitizes generated text in production paths.

## Doctor Report

The doctor report creates a factual one-page summary with:

- Covered date range
- Data sources
- Data quality note
- Top objective observations
- Symptom summary
- Pattern summary
- Chart recommendations
- User notes prompt
- Questions to ask
- Disclaimer

Reports exclude raw device/account identifiers.

## Demo Mode

Open `/demo` for a fake dataset only. It shows the full dashboard, insight hub, symptom pattern example, relationship explorer, charts, and doctor report preview without real health data.

## Export Samsung Health Data

1. Open Samsung Health on your phone.
2. Use Samsung Health settings to export or download your personal data.
3. Keep the ZIP private.
4. Upload the ZIP or extracted folder into HealthLens.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test

```bash
npm run typecheck
npm run test
npm run build
```

End-to-end tests:

```bash
npm run test:e2e
```

## Contributing

See `CONTRIBUTING.md`, `ARCHITECTURE.md`, `docs/parser.md`, `docs/privacy.md`, and `docs/insights.md`.

# samsungHealth
