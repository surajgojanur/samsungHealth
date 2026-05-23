# Screenshots

All public screenshots must use fake sample data only. Use `/demo` or `/report` generated from sample data. Do not capture real Samsung Health exports, real symptoms, account details, route maps, meal images, or profile images.

## Captured Assets

| File | Viewport | Route | What should be visible |
| --- | --- | --- | --- |
| `docs/assets/overview.png` | 1440 x 1100 | `/demo` | Sample-data banner, Health Story, and top demo dashboard context |
| `docs/assets/insight-hub.png` | 1440 x 1100 | `/demo` scrolled to Insight Hub | Insight tabs, filters, confidence labels, and cards |
| `docs/assets/symptom-patterns.png` | 1440 x 1100 | `/demo` scrolled to Symptom Pattern Timeline | Symptom pattern summary and doctor-ready symptom note |
| `docs/assets/doctor-report.png` | 1440 x 1100 | `/report` | Doctor Report heading, disclaimer, export cards, and report preview |
| `docs/assets/demo.gif` | 1280 x 820 source, 960 px rendered width | `/`, `/demo`, `/report` | 20-30 second portfolio flow |

## Manual Capture Instructions

1. Run `npm run build`.
2. Run `PORT=3002 npm run start`.
3. Open `http://127.0.0.1:3002/demo`.
4. Use a 1440 x 1100 viewport for PNG screenshots.
5. Use fake sample data only. The page must show “You are viewing fake sample data. No personal health files are loaded.”
6. Capture the files listed above with the exact filenames.

## Recommended Demo GIF Flow

Record a 20-30 second GIF using a 1280 x 820 viewport:

1. Landing page hero.
2. Demo dashboard top with sample-data banner.
3. Health Story card.
4. Insight Hub tabs and insight cards.
5. Symptom Pattern Timeline.
6. Doctor report preview.
7. Doctor Report page.

Keep the GIF calm and readable. Do not include real files, upload dialogs with personal paths, or browser extensions.
