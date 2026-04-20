# Day 3 – Linting Testing and Tooling

## Today's Focus
Set up ESLint, Prettier, and a test runner; write unit tests for your TypeScript domain logic.

## Tasks
- Install and configure ESLint for TypeScript: `npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin`. Create `.eslintrc.json` with `@typescript-eslint/recommended` rules. Run it and fix every reported error and warning.
- Install Prettier: `npm install --save-dev prettier`. Create `.prettierrc` with your preferences. Add a `.prettierignore` for `dist/`. Add `npm run format` (write) and `npm run format:check` (ci check) scripts.
- Set up a test runner: install `vitest` (or `jest` with `ts-jest`). Write at least 8 unit tests for your domain models and the `Result` type from Tuesday. Test both the happy path and error branches.
- Add `npm run lint`, `npm run test`, and `npm run test:coverage` scripts. Configure vitest to generate a coverage report and aim for 80% line coverage.
- Add a `.editorconfig` file to enforce consistent indentation and line endings across editors. Verify VS Code respects it.
- Create a `pre-commit` hook using `husky` and `lint-staged` that runs `eslint` and `prettier --check` on staged `.ts` files only. Commit a deliberately malformed file to confirm the hook blocks it.

## Reading / Reference
- [typescript-eslint getting started](https://typescript-eslint.io/getting-started/).
- [Vitest documentation](https://vitest.dev/guide/) — Getting Started and Features.
- [Prettier documentation](https://prettier.io/docs/en/install.html) — Installation and Integrating with Linters.
