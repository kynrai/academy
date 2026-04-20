# Day 4 – npm and Package Management

## Today's Focus
Master npm: understand `package.json`, dependency groups, semantic versioning, and how `package-lock.json` ensures reproducible installs.

## Tasks
- Open `package.json` and map every field: `name`, `version`, `scripts`, `dependencies`, `devDependencies`, `peerDependencies`, `engines`. Explain the purpose of each. Add an `engines` field restricting to `node >= 20`.
- Compare `dependencies` and `devDependencies`: move any package used only in tests or build tooling to `devDependencies`. Confirm your app still compiles and runs. Explain why this matters for production Docker image size.
- Study `package-lock.json`: find a transitive dependency (one not in your `package.json`) and trace which direct dependency introduced it. Check its version satisfies the semver range specified.
- Understand semantic versioning: for `"vitest": "^2.1.0"`, `"~2.1.0"`, and `"2.1.0"` — write out exactly which version ranges npm would accept for each. Then pin a dependency to an exact version and explain when you would do this.
- Run `npm ls --depth=0` to see your direct dependency tree and `npm ls <package>` to find why a specific transitive package is installed.
- Add a `prepare` script that runs `npm run build` automatically after `npm install`. Test it in a fresh clone. Discuss why `prepare` runs on both `install` and `publish`.

## Reading / Reference
- npm docs: [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json).
- [Semantic Versioning 2.0.0](https://semver.org/) — the full spec is a short read.
- npm docs: [package-lock.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-lock-json).
