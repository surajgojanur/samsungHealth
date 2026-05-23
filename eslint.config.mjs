import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "coverage/**", "playwright-report/**"]
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin
    },
    rules: {
      ...tseslint.configs.recommended[1].rules,
      ...nextPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];
