# Day 5 – Project: Git, GitHub, and GitHub Actions

## Today's Focus

Build a small project from scratch end-to-end: create a GitHub repository, write a bash script that reads environment variables, practise a full branch-and-pull-request workflow, and wire up a GitHub Actions pipeline that runs the script in CI — passing in environment variables from the workflow.

## What you will build

A repository called `envar-demo` containing:

- A bash script that reads `APP_ENV`, `APP_VERSION`, and `GREETING` and prints a summary
- A `.env.example` file showing callers what variables are expected
- A GitHub Actions workflow that runs the script with variables defined in the workflow

## Part 1 — Create the Repository on GitHub

1. Go to GitHub and create a new **public** repository named `envar-demo`. Do not initialise it with a README — you will push from your machine.

2. Clone it locally:

   ```sh
   git clone git@github.com:<your-username>/envar-demo.git
   cd envar-demo
   ```

3. Create the initial project structure on a branch:

   ```sh
   git switch -c feat/initial-setup
   ```

## Part 2 — Write the Script

Create the main script `bin/app-info`:

```sh
#!/bin/sh
APP_ENV=${APP_ENV:-"local"}
APP_VERSION=${APP_VERSION:-"0.0.0"}
GREETING=${GREETING:-"Hello"}

echo "----------------------------------------"
echo "  $GREETING from envar-demo"
echo "----------------------------------------"
echo "  Environment : $APP_ENV"
echo "  Version     : $APP_VERSION"
echo "----------------------------------------"
```

Make it executable:

```sh
mkdir bin
# paste the script above into bin/app-info
chmod +x bin/app-info
```

Test it locally — first with no variables (defaults), then with overrides:

```sh
./bin/app-info

APP_ENV=production APP_VERSION=1.2.0 GREETING="Greetings" ./bin/app-info
```

## Part 3 — Add Supporting Files

Create `.env.example` — a committed template showing what variables the project expects, with no real secrets:

```sh
cat > .env.example <<EOF
# Copy this file to .env and fill in values for your environment.
APP_ENV=local
APP_VERSION=0.1.0
GREETING=Hello
EOF
```

Create `.gitignore` to ensure a real `.env` is never committed:

```sh
cat > .gitignore <<EOF
.env
EOF
```

Create a minimal `README.md`:

```sh
cat > README.md <<EOF
# envar-demo

Demonstrates environment variable driven configuration in bash.

## Usage

\`\`\`sh
cp .env.example .env
# edit .env with your values
source .env
./bin/app-info
\`\`\`
EOF
```

## Part 4 — Commit and Open a Pull Request

Stage and commit everything with Conventional Commit messages:

```sh
git add bin/app-info
git commit -m "feat: add app-info script"

git add .env.example .gitignore
git commit -m "chore: add env template and gitignore"

git add README.md
git commit -m "docs: add readme with usage instructions"
```

Push the branch:

```sh
git push -u origin feat/initial-setup
```

Go to GitHub — you will see a banner offering to open a pull request. Click it. Write a PR description explaining:

- What the script does
- What environment variables it reads
- How to test it locally

Merge the PR on GitHub using **Squash and merge** to keep `main` linear. Pull the updated `main` locally and delete the feature branch:

```sh
git switch main
git pull
git branch -d feat/initial-setup
```

## Part 5 — Add GitHub Actions

Create the workflow directory and file:

```sh
mkdir -p .github/workflows
```

Create `.github/workflows/run-app-info.yml`:

```yaml
name: Run app-info

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  run:
    runs-on: ubuntu-latest
    env:
      APP_ENV: production
      APP_VERSION: ${{ github.sha }}
      GREETING: Hello from CI
    steps:
      - uses: actions/checkout@v4

      - name: Make script executable
        run: chmod +x bin/app-info

      - name: Run app-info
        run: ./bin/app-info
```

Commit and push on a new branch:

```sh
git switch -c feat/add-ci
git add .github/workflows/run-app-info.yml
git commit -m "ci: add workflow to run app-info script"
git push -u origin feat/add-ci
```

Open another pull request on GitHub, merge it, then watch the Actions tab. The workflow will run automatically on the push to `main`. You should see `Hello from CI` in the log output alongside the commit SHA as the version.

## Part 6 — Observe the Difference

The script is the same file in every case. What changes is only the environment:

| Context | `APP_ENV` | `APP_VERSION` | `GREETING` |
| ------- | --------- | ------------- | ---------- |
| Local (no vars) | `local` | `0.0.0` | `Hello` |
| Local (sourced .env) | `local` | `0.1.0` | `Hello` |
| GitHub Actions | `production` | git SHA | `Hello from CI` |

This is the same principle that real applications use — the same Docker image deployed to dev and production, reading different environment variables in each.

## Tasks Summary

- [ ] Create and clone the `envar-demo` repository on GitHub
- [ ] Write `bin/app-info` and verify it reads environment variables correctly
- [ ] Add `.env.example`, `.gitignore`, and `README.md`
- [ ] Open and merge a pull request for the initial setup using Squash and merge
- [ ] Add the GitHub Actions workflow on a second branch and open a second PR
- [ ] Watch the workflow run in the Actions tab and find the script output in the logs
- [ ] Try triggering the workflow manually using the **Run workflow** button (`workflow_dispatch`)

## Reading / Reference

- [GitHub Actions quickstart](https://docs.github.com/en/actions/writing-workflows/quickstart)
- [GitHub Actions: environment variables](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables)
- [Pro Git Book](https://git-scm.com/book/en/v2) — Chapter 5: Distributed Git and pull request workflows
- [Conventional Commits](https://www.conventionalcommits.org/) — commit message specification
