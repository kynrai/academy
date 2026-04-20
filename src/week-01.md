# Week 1 – Command Line, Environments and Git

## Overview

Week 1 builds the foundation every developer uses every day: navigating the filesystem from the terminal, understanding how the shell resolves commands, managing configuration through environment variables, and tracking work with Git. The week ends with a real project hosted on GitHub and deployed through a CI pipeline.

## What you will learn

| Day | Topic |
| --- | ----- |
| Day 1 | Core terminal commands — navigating, creating, copying, deleting, and running files |
| Day 2 | The PATH — how the shell finds commands, and how to create your own |
| Day 3 | Environment variables — configuring the same code for local, dev, and production |
| Day 4 | Git and GitHub — commits, branches, merge strategies, and Conventional Commits |
| Day 5 | Project — build a repository end-to-end with PRs and a GitHub Actions workflow |

## Objectives

By the end of this week you will be able to:

- Navigate and manipulate the filesystem entirely from the terminal.
- Read and modify file permissions, and write executable shell scripts.
- Explain what `$PATH` is, how the shell searches it, and how to add your own commands to it.
- Create, export, and persist environment variables across sessions.
- Explain the difference between Git and GitHub, and between GitHub and alternative hosting services.
- Execute the full Git workflow: init, add, commit, branch, merge, and resolve conflicts.
- Write commit messages that follow the Conventional Commits specification.
- Choose between merge, squash, and rebase strategies and explain the trade-offs.
- Open a pull request, review it, and merge it on GitHub.
- Write a basic GitHub Actions workflow that reads environment variables and runs a script.

## Topics

### Terminal and Shell

- Core commands: `pwd`, `ls`, `cd`, `mkdir`, `touch`, `echo`, `cat`, `cp`, `mv`, `rm`, `rmdir`
- File permissions: read, write, execute; `chmod +x`
- Writing and running a shell script with a shebang line
- The `rm -rf` hazard and safe alternatives

### The PATH

- What `$PATH` is and how the shell searches it left to right
- `which` to locate a command; `export` to extend the path for a session
- `~/.zshrc` vs `~/.zprofile` — interactive vs login shell config
- `source` to reload a config file without reopening the terminal
- Creating a personal `~/bin` directory with a custom command

### Environment Variables

- What environment variables are and how programs read them
- `env`, `export`, `unset`; the difference between a shell variable and an exported variable
- `${VAR:-default}` syntax for safe fallbacks
- `.env` files and why they must never be committed
- The `APP_ENV` convention: `local`, `dev`, `staging`, `production`
- `set -a && source .env && set +a` to load a `.env` file

### Git and Version Control

- Git vs GitHub; GitHub vs GitLab, Bitbucket, Azure DevOps
- Core workflow: `git init`, `git add`, `git commit`, `git log`, `git diff`
- `git add -p` for intentional, hunk-level staging
- Conventional Commits: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`
- Branching: `git switch -c`, `git merge`, merge conflicts and resolution
- Merge strategies: merge commit (`--no-ff`), squash merge, rebase
- `git stash` and `git stash pop`
- `.gitignore` patterns

### GitHub Workflow and CI

- Creating and cloning a repository on GitHub
- Pushing a branch and opening a pull request
- PR descriptions: what changed, why, and how to test
- Merging with Squash and merge for a linear history
- GitHub Actions: workflow syntax, `on:` triggers, `env:` variables, `workflow_dispatch`
- Running a bash script in CI with environment variables supplied by the workflow

## Deliverables

- A working `~/bin` directory with at least one custom command on the PATH.
- A bash script that changes behaviour based on an environment variable.
- A `envar-demo` repository on GitHub with:
  - A `bin/app-info` script that reads three environment variables
  - A `.env.example` file
  - A `.gitignore` excluding `.env`
  - At least two merged pull requests with Conventional Commit messages
  - A GitHub Actions workflow that runs the script in CI
