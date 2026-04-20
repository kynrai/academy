# Day 5 – Dependency Audits and Workflow

## Today's Focus
Audit dependencies for vulnerabilities, manage updates safely, and integrate all scripts into a complete project workflow.

## Tasks
- Run `npm audit` and read the full output. For each vulnerability listed: note its severity, which package is affected, and whether a fix is available. Run `npm audit fix` and re-run to confirm resolved issues. If `npm audit fix --force` is needed, understand what it is doing before running it.
- Run `npx npm-check-updates` (install with `npm install -g npm-check-updates`) to list available updates. Update a minor version (`ncu -u --target minor`) and run your full test suite to confirm nothing broke.
- Deliberately install a package with a known vulnerability from an old version (check [Snyk's vulnerability database](https://security.snyk.io/) for examples). Run `npm audit` and confirm it is detected. Upgrade and verify.
- Write a `ci` npm script that chains: `npm run typecheck && npm run lint && npm run format:check && npm run test && npm audit`. This is your complete CI simulation — it should exit non-zero if any step fails.
- Add a `.nvmrc` file specifying the Node version your project requires. Confirm that `nvm use` picks it up automatically.
- Review the whole project: ensure the `README.md` covers prerequisites, `npm install`, available scripts, and how to run the project. Have a classmate (or yourself after a fresh clone) follow the README to verify it is complete.

## Reading / Reference
- npm docs: [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit).
- [Snyk: npm security best practices](https://snyk.io/blog/ten-npm-security-best-practices/).
- [npm-check-updates README](https://github.com/raineorshine/npm-check-updates).
