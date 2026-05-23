# Final Medical Language Audit

Validation date: 2026-05-23

## Terms Searched

- diagnosis
- disease
- you have
- heart problem
- dangerous condition
- emergency caused
- guaranteed
- proves

Command used:

```bash
rg -n -i "diagnosis|disease|you have|heart problem|dangerous condition|emergency caused|guaranteed|proves" . --glob '!node_modules/**' --glob '!.next/**' --glob '!playwright-report/**' --glob '!test-results/**' --glob '!docs/assets/**'
```

## Findings

No unsafe user-facing medical-claim wording was found in app routes.

Remaining matches are allowed exceptions:

- `src/lib/safety/medicalClaimGuard.ts` contains the forbidden phrase list and rewrite rules.
- `tests/e2e/report.spec.ts` intentionally checks forbidden phrases.
- `FINAL_MEDICAL_LANGUAGE_AUDIT.md` lists the search terms and therefore matches itself.
- `SAMSUNG_HEALTH_SCHEMA_ANALYSIS_REPORT.md` documents forbidden wording and non-diagnostic report guidance.

## Fixes Made

- Added e2e coverage to scan release routes for forbidden phrases.
- Preserved allowed disclaimer wording: “It does not diagnose, treat, or replace medical advice.”
- Kept symptom insight wording non-causal: “This does not prove a cause...”

## Remaining Allowed Exceptions

- Documentation and tests may mention forbidden phrases when explaining or validating the safety guard.
- “does not diagnose” is allowed as disclaimer language.
- “Not a diagnosis tool” is allowed if used in future disclaimer copy.
