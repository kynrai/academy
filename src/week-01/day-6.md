# Weekend Challenges

These challenges extend what you practised during the week. Each one is self-contained — pick any order, or attempt all of them.

## Challenge 1 — Expand Your Custom Commands

You added `~/bin/hello` to your PATH on Day 2. Now build it out into something useful.

Write a command `~/bin/mkproject` that accepts a project name as its first argument and:

1. Creates a directory `~/projects/<name>`
2. Initialises a Git repo inside it
3. Creates a `README.md` with the project name as the heading
4. Creates a `.env.example` with `APP_ENV=local` and `APP_VERSION=0.1.0`
5. Creates a `.gitignore` containing `.env`
6. Makes an initial commit: `chore: initialise project`

```sh
mkproject my-new-app
# should produce ~/projects/my-new-app with a git history of one commit
```

Handle the case where no argument is given — print a usage message and exit with a non-zero status code.

## Challenge 2 — Multi-Environment Configuration Script

Extend the `deploy-info` script from Day 3 so it validates its inputs and produces a more complete configuration report.

Requirements:

- Read at least five environment variables: `APP_ENV`, `APP_VERSION`, `DB_HOST`, `DB_PORT`, `LOG_LEVEL`
- If `APP_ENV` is not one of `local`, `dev`, `staging`, `production` — print an error and exit with status `1`
- If `APP_VERSION` is not set and `APP_ENV` is `production` — print an error and exit with status `1` (a production deploy must have an explicit version)
- Print a formatted config report showing all values
- Write a matching `.env.example` that documents each variable

Test it by running it under each environment and deliberately triggering each error condition.

## Challenge 3 — Branch and Merge Practice

In your `envar-demo` repository from Day 5, practise all three merge strategies back to back on real changes:

1. Create `feat/add-timestamp` — add a line to `bin/app-info` that prints the current date with `$(date)`. Merge into `main` using a **merge commit** (`--no-ff`).

2. Create `feat/add-hostname` — add a line that prints the machine hostname with `$(hostname)`. Merge into `main` using **squash merge**, writing a single clean Conventional Commit.

3. Create `feat/add-uptime` — add a line that prints uptime with `$(uptime)`. **Rebase** onto `main` before merging, then fast-forward.

After all three merges, run `git log --oneline --graph` and compare the shape of the history each strategy produced.

## Challenge 4 — Extend the GitHub Actions Workflow

Add a second job to the `run-app-info.yml` workflow in `envar-demo`.

The new job should:

- Run only after the first job succeeds (`needs: run`)
- Print each environment variable on a separate line using `echo "KEY: $VALUE"` for `APP_ENV`, `APP_VERSION`, and `GREETING`
- Use a **different value** for `APP_ENV` than the first job (`staging` instead of `production`)
- Use `workflow_dispatch` inputs so the workflow can be triggered manually with a custom `GREETING` value from the GitHub UI

Push the changes on a branch, open a pull request, and trigger the workflow both from the push and manually using the **Run workflow** button in the Actions tab.

## Challenge 5 — Dotfiles Repository

Your shell configuration files (`~/.zshrc`, `~/.zprofile`) and your `~/bin` scripts are valuable — they represent your working environment. Back them up with Git.

1. Create a new repository called `dotfiles` on GitHub
2. Create `~/.dotfiles` locally and initialise it as a Git repo
3. Move your `~/.zshrc` (or `~/.bashrc`) into `~/.dotfiles/zshrc` and create a symlink back:

   ```sh
   mv ~/.zshrc ~/.dotfiles/zshrc
   ln -s ~/.dotfiles/zshrc ~/.zshrc
   ```

4. Copy your `~/bin` scripts into `~/.dotfiles/bin/`
5. Commit everything with meaningful Conventional Commit messages
6. Push to GitHub — verify that cloning the repo and running `ln -s` restores your environment

The goal is that on a fresh machine you can clone this repo and be productive in minutes.

## Reflection

Answer these in a notes file or discuss with a peer:

- On Day 2 you added `~/bin` to your PATH in both `~/.zshrc` and `~/.zprofile`. What is the difference between those two files, and what would happen if you only set it in one of them?
- You used `${VAR:-"default"}` in your scripts. What does that syntax do, and what would happen if you used `$VAR` alone when the variable is unset?
- You used three merge strategies this week: merge commit, squash, and rebase. Which would you choose for a team working on a shared repository, and why?
- Your `.env` file is in `.gitignore` but `.env.example` is committed. Explain why each decision is correct.
- Look at the commit history of `envar-demo`. Would a colleague understand what changed in each commit without reading the diff? Revise any commits that don't meet the Conventional Commits standard.
