# Privacy Model

HealthLens is local-first by default.

- Your files are processed entirely inside your browser.
- You can disconnect from the internet after loading the app, and local analysis will still work.
- Raw Samsung Health exports stay in the browser unless the user chooses otherwise.
- No server upload is enabled by default.
- No cloud account is required.
- No analytics tracking is enabled by default.
- IndexedDB persistence requires explicit consent: "Remember this analysis on this browser" is unchecked by default.
- Delete local analysis clears uploaded data, normalized records, parser summaries, symptoms, and local settings from this browser.
- Reports should exclude raw identifiers.
- Demo mode uses fake data only.

Do not commit real exports, screenshots containing personal data, or ZIP files.
