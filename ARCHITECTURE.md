# Architecture

```text
User ZIP/folder
  -> Browser file picker
  -> Web Worker parser
  -> Normalized health models
  -> Analytics engine
  -> Insight engine
  -> Dashboard + Doctor report
```

## Layers

- `src/lib/parser`: Samsung Health import, classification, CSV handling, sidecars, normalization.
- `src/types/health.ts`: normalized health models and parser report types.
- `src/lib/analytics`: reusable numeric analytics such as baselines and correlations.
- `src/lib/insights`: plain-language insight generation above normalized data.
- `src/components/insights`: user-facing insight cards, health story, unusual days, period summary, and relationship explorer.
- `src/app/report`: doctor-discussion report export.

## Parser Boundary

The parser owns raw Samsung file behavior. The insight layer consumes normalized models and should not inspect raw CSV rows.

