# Final Privacy Audit

Validation date: 2026-05-23

## Terms Searched

- deviceuuid
- datauuid
- account id
- email
- location
- latitude
- longitude
- route
- comment
- raw_data
- binning_data
- profile image
- meal image
- console.

Command used:

```bash
rg -n -i "deviceuuid|datauuid|account id|email|location|latitude|longitude|route|comment|raw_data|binning_data|profile image|meal image|console\\." src tests README.md docs .github --glob '!node_modules/**' --glob '!.next/**' --glob '!docs/assets/**'
```

## Findings

- Parser fixtures contain fake `deviceuuid` and `datauuid` fields for test coverage.
- Parser helpers mask device IDs through `deviceIdMasked`.
- Debug preview masks fields containing UUID, device, account, email, name, comment, note, location, latitude, longitude, or ID.
- Report page copy explicitly excludes raw identifiers, locations, route coordinates, private comments, and images.
- No production `console.log` or raw record logging was found.

## Fixes Made

- Changed sleep and workout parsers so raw Samsung `datauuid` values are not retained as normalized record IDs.
- Added parser test coverage to ensure raw sleep/workout UUIDs do not appear in normalized data.
- Sitewide footer now repeats local-first and non-affiliation trust copy.

## Verified Privacy Controls

- Raw IDs are masked or excluded from user-facing report summaries.
- Doctor summary states that device and account identifiers are not included.
- Report export path uses generated summary data, not raw rows.
- Debug mode is opt-in and displays masked parser previews.
- Meal/profile images remain skipped by default and inventory-only.
- Route/location data is not parsed into report output.
- IndexedDB persistence remains consent-based.

## Remaining Notes

The optional “Normalized JSON” export intentionally exposes normalized health records for the user’s own local export. After this audit, normalized sleep and workout IDs use synthetic parser IDs instead of raw Samsung UUIDs.
