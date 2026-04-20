# Day 4 – Git Core Workflow

## Today's Focus

Understand what Git is, how it relates to GitHub and other hosting services, and practise the standard day-to-day workflow: init, stage, commit, branch, and merge. Write commits that communicate intent using the Conventional Commits standard.

## Git vs GitHub

**Git** is a version control system — a program that runs on your machine and tracks changes to files over time. It has no network component by itself.

**GitHub** is a cloud service that hosts Git repositories. It adds a web interface, pull requests, issue tracking, and CI/CD on top of plain Git. When you push to GitHub you are copying your local Git history to a remote server.

The distinction matters: Git is the tool; GitHub is one place to store and share the results. Other services host Git repositories too:

| Service | Notes |
| ------- | ----- |
| GitHub | Most widely used; home of most open-source projects. |
| GitLab | Strong built-in CI/CD; popular in enterprises; can be self-hosted. |
| Bitbucket | Integrated with the Atlassian suite (Jira, Confluence). |
| Azure DevOps Repos | Microsoft ecosystem; common in enterprise Windows shops. |
| Gitea / Forgejo | Lightweight self-hosted options. |

All of these speak the same Git protocol — the commands you learn today work identically regardless of which service hosts the remote.

## Key Commands

| Command | Description |
| ------- | ----------- |
| `git init` | Initialise a new repository in the current directory. |
| `git status` | Show what has changed and what is staged. |
| `git add <file>` | Stage a file for the next commit. |
| `git add -p` | Stage changes interactively, hunk by hunk. |
| `git commit -m "msg"` | Record staged changes as a commit. |
| `git log --oneline --graph` | Display commit history as a compact graph. |
| `git diff` | Show unstaged changes. `git diff --staged` for staged. |
| `git branch <name>` | Create a new branch. |
| `git switch <name>` | Switch to a branch (`git checkout -b` creates and switches). |
| `git merge <branch>` | Merge a branch into the current branch. |
| `git rebase <branch>` | Reapply commits on top of another branch. |
| `git stash` | Temporarily shelve uncommitted changes. |

## Conventional Commits

Conventional Commits is a lightweight standard for commit message formatting. A well-formed message looks like this:

```text
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

Common types:

| Type | When to use |
| ---- | ----------- |
| `feat` | A new feature visible to users. |
| `fix` | A bug fix. |
| `docs` | Documentation only. |
| `chore` | Tooling, dependencies, config — no production code change. |
| `refactor` | Code restructuring with no behaviour change. |
| `test` | Adding or updating tests. |
| `ci` | Changes to CI/CD pipelines. |

Examples:

```text
feat(auth): add JWT token validation
fix(api): return 404 when user not found
docs(readme): add local setup instructions
chore: upgrade eslint to v9
```

The format is machine-readable (tools like `semantic-release` can cut releases automatically from it) and human-readable (reviewers immediately understand the intent of a commit without opening the diff).

## Branching Strategies

Branches let you work on a change in isolation without affecting the main line of code. The standard practice:

```sh
git switch -c feat/add-login
# make changes
git add .
git commit -m "feat(auth): add login endpoint"
git switch main
git merge feat/add-login
```

Keep branch names short and descriptive. Common prefixes: `feat/`, `fix/`, `chore/`, `docs/`.

## Merge Strategies

When integrating a branch back into `main`, there are three common approaches:

**Merge commit** — preserves the full branch history with a dedicated merge commit:

```sh
git merge --no-ff feat/add-login
```

The graph shows the branch existed and when it was integrated. Good for features where the development history has value.

**Squash merge** — collapses all commits on the branch into one before merging:

```sh
git merge --squash feat/add-login
git commit -m "feat(auth): add login endpoint"
```

Keeps `main` clean — one commit per feature. The branch's intermediate commits are discarded. Most common in teams that value a linear, readable history.

**Rebase** — replays the branch commits on top of the latest `main`, then fast-forwards:

```sh
git switch feat/add-login
git rebase main
git switch main
git merge feat/add-login   # fast-forward, no merge commit
```

Produces a perfectly linear history with no merge commits. Useful for long-lived branches that need to stay current. Avoid rebasing commits that have already been pushed to a shared remote.

## Tasks

- Initialise a new repository, create a few files, and walk through the full cycle:

  ```sh
  mkdir ~/academy/git-practice && cd ~/academy/git-practice
  git init
  touch README.md main.sh
  git status
  git add README.md
  git commit -m "docs: add readme"
  git add main.sh
  git commit -m "chore: add main script"
  git log --oneline --graph
  ```

- Write a `.gitignore` and commit it:

  ```sh
  cat > .gitignore <<EOF
  .env
  *.log
  node_modules/
  __pycache__/
  dist/
  EOF
  git add .gitignore
  git commit -m "chore: add gitignore"
  ```

- Create a feature branch, make two commits on it using Conventional Commit format, then merge it back:

  ```sh
  git switch -c feat/greeting
  echo '#!/bin/sh' > greet.sh
  echo 'echo "Hello!"' >> greet.sh
  git add greet.sh
  git commit -m "feat: add greeting script"
  echo 'echo "Goodbye!"' >> greet.sh
  git add greet.sh
  git commit -m "feat: add goodbye line"
  git switch main
  git merge --no-ff feat/greeting -m "chore: merge feat/greeting"
  git log --oneline --graph
  ```

- Repeat the exercise using squash merge and observe the difference in the log:

  ```sh
  git switch -c feat/farewell
  echo 'echo "See you!"' >> greet.sh && git add . && git commit -m "wip: first attempt"
  echo 'echo "Take care!"' >> greet.sh && git add . && git commit -m "wip: second attempt"
  git switch main
  git merge --squash feat/farewell
  git commit -m "feat: add farewell lines"
  git log --oneline --graph
  ```

- Deliberately create a merge conflict and resolve it:

  ```sh
  git switch -c fix/branch-a
  echo "branch A change" > conflict.txt && git add . && git commit -m "fix: branch a"
  git switch main
  git switch -c fix/branch-b
  echo "branch B change" > conflict.txt && git add . && git commit -m "fix: branch b"
  git switch main
  git merge fix/branch-a
  git merge fix/branch-b   # this will conflict
  ```

  Open `conflict.txt`, remove the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), keep the content you want, then:

  ```sh
  git add conflict.txt
  git commit -m "fix: resolve merge conflict"
  ```

- Use `git stash` to shelve work in progress, switch branches, and restore it:

  ```sh
  echo "work in progress" >> README.md
  git stash
  git status          # working tree is clean
  git stash pop
  git status          # change is back
  ```

## Reading / Reference

- [Pro Git Book](https://git-scm.com/book/en/v2) — Chapters 2 (Git Basics) and 3 (Branching).
- [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) — full spec with examples.
- [Oh Shit, Git!](https://ohshitgit.com/) — a practical reference for undoing mistakes.
- `git help log` — focus on `--graph`, `--decorate`, `--all`, and `--pretty=format` options.
