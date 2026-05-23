# HealthLens Privacy Model

## Default Mode

HealthLens is local-first. User files are parsed in the browser and are not uploaded to a server by default. The app has no cloud account requirement and no analytics tracking by default.

## Data Flow

1. User selects ZIP, folder, or CSV/JSON files.
2. Files are transferred to a Web Worker for local extraction and parsing.
3. Worker emits normalized records and warnings.
4. Raw rows are discarded unless debug mode is explicitly enabled.
5. IndexedDB persistence is disabled until the user grants consent.

## Masking Rules

Mask or exclude by default:
- Names
- Emails
- Account IDs
- Device IDs
- UUIDs
- Locations and route coordinates
- Comments and notes
- Food names in strict privacy mode
- Meal images and profile images

## Upload and ZIP Safety

Allowed extensions:
- `.csv`
- `.json`
- `.jpg` only when image support is explicitly enabled

Ignored files:
- `__MACOSX`
- `.DS_Store`
- hidden/system files
- thumbnails and cache-like paths

Rejected files:
- Executables
- HTML files
- Absolute paths
- Paths containing `../`
- ZIPs exceeding configured size, file count, or compression-ratio limits

## Persistence

IndexedDB can store normalized records, symptoms, settings, and parser summaries only after explicit consent. Reset must clear IndexedDB, object URLs, parser state, symptom logs, and cached normalized records.

## Reporting

Doctor reports and exports must not include raw identifiers. Reports include masked source metadata, data quality warnings, missing categories, and this disclaimer:

`This report is based on user-exported wearable wellness data. It may be incomplete or inaccurate and is for personal tracking and doctor discussion only. It does not diagnose, treat, or replace medical advice.`

