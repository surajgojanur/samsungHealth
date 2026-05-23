# Security

HealthLens is designed for local-first processing of sensitive health exports.

## Reporting Issues

Please report security issues privately to the maintainer before opening a public issue. Include:

- Affected version or commit
- Steps to reproduce
- Expected and actual behavior
- Any privacy impact

Do not attach real Samsung Health exports.

## Security Model

- Raw uploads are parsed locally by default.
- IndexedDB persistence requires explicit consent.
- Parser import rejects unsafe paths and unsupported file types.
- Reports should not include raw device/account identifiers.

