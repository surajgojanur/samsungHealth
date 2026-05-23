# Contributing

Thanks for improving HealthLens. This project handles sensitive health exports, so privacy and careful wording matter as much as code quality.

## Development

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm run typecheck
npm run test
npm run build
```

## Rules

- Do not commit real Samsung Health exports.
- Do not change parser behavior unless parser tests cover the change.
- Preserve Samsung CSV semantics: line 1 metadata, line 2 header, line 3 onward data.
- Build analytics and insights above normalized models.
- Avoid medical claims. Use personal-pattern language and limitations.
- Keep reports free of raw identifiers.

