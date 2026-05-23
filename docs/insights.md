# Insight Intelligence Layer

The insight engine lives in `src/lib/insights`.

Each `HealthInsight` includes:

- Category
- Title
- Summary
- Plain-language explanation
- Why this matters
- Confidence
- Tone
- Source metrics
- Limitations when data is sparse
- Optional doctor-discussion wording
- Priority score

## Language Rules

Use:

- unusual compared with your baseline
- worth discussing with a doctor
- may be related to sleep, activity, caffeine, illness, stress, or device accuracy
- data is limited
- not enough data to be confident

Avoid forbidden medical-claim wording. The safety guard lives in `src/lib/safety/medicalClaimGuard.ts`.

