# Day 3 – Environment Variables and Environments

## Today's Focus

Understand what environment variables are, why they exist, and how the same code can behave differently in local, dev, and production environments purely through configuration — without changing a single line of application logic.

## What are Environment Variables?

Environment variables are named values that live in the shell's environment and are inherited by any process the shell starts. They are the standard way to pass configuration into a running program without hardcoding values into the code itself.

```sh
echo $HOME
echo $USER
echo $SHELL
```

Run `env` to see every environment variable currently set in your session.

## Key Concepts

| Concept | Explanation |
| ------- | ----------- |
| `env` | Print all environment variables in the current session. |
| `VAR=value` | Set a variable for the current shell only — child processes do not inherit it. |
| `export VAR=value` | Set and export a variable so child processes inherit it. |
| `unset VAR` | Remove a variable from the environment. |
| `$VAR` | Reference a variable's value. |
| `.env` file | A plain text file of `KEY=value` pairs, loaded by tools like `dotenv` or `docker compose`. |
| `APP_ENV` | Common convention for a variable that names the current environment: `local`, `dev`, `staging`, `production`. |

## Why Programs Use Environment Variables

Consider a web server that needs a database connection string. The database lives in a different place depending on where the code is running:

| Environment | Database host |
| ----------- | ------------- |
| Local | `localhost:5432` |
| Dev | `dev-db.internal:5432` |
| Production | `prod-db.internal:5432` |

Rather than hardcoding each host, the program reads a single environment variable — `DATABASE_URL` — and the value changes per environment. The code never changes; only the environment does.

This pattern applies to: API keys, feature flags, log levels, service URLs, port numbers, and anything else that differs between environments.

## Tasks

- Print all environment variables with `env`. Find `HOME`, `USER`, `SHELL`, and `PATH` in the output.

- Set a variable without exporting it and observe that a child process cannot see it:

  ```sh
  MESSAGE="hello from parent"
  bash -c 'echo $MESSAGE'
  ```

  The output will be empty. Now export it and repeat:

  ```sh
  export MESSAGE="hello from parent"
  bash -c 'echo $MESSAGE'
  ```

- Write a script `~/bin/greet` that uses an environment variable to change its behaviour:

  ```sh
  #!/bin/sh
  NAME=${GREET_NAME:-"World"}
  echo "Hello, $NAME!"
  ```

  Make it executable and run it a few ways:

  ```sh
  chmod +x ~/bin/greet
  greet
  GREET_NAME="Alice" greet
  GREET_NAME="Bob" greet
  ```

  Note that `VAR=value command` sets the variable only for that single command — it does not persist in your session.

- Create a script `~/bin/deploy-info` that reads an `APP_ENV` variable and prints configuration values that would differ per environment:

  ```sh
  #!/bin/sh
  APP_ENV=${APP_ENV:-"local"}

  case "$APP_ENV" in
    local)
      DB_HOST="localhost"
      LOG_LEVEL="debug"
      ;;
    dev)
      DB_HOST="dev-db.internal"
      LOG_LEVEL="info"
      ;;
    production)
      DB_HOST="prod-db.internal"
      LOG_LEVEL="warn"
      ;;
    *)
      echo "Unknown environment: $APP_ENV"
      exit 1
      ;;
  esac

  echo "Environment : $APP_ENV"
  echo "Database    : $DB_HOST"
  echo "Log level   : $LOG_LEVEL"
  ```

  Make it executable and run it for each environment:

  ```sh
  chmod +x ~/bin/deploy-info
  deploy-info
  APP_ENV=dev deploy-info
  APP_ENV=production deploy-info
  APP_ENV=staging deploy-info
  ```

  The script is identical in all three cases — only the environment variable changes.

- Create a `.env` file to simulate how a project stores its local configuration:

  ```sh
  cat > ~/academy/.env <<EOF
  APP_ENV=local
  DB_HOST=localhost
  DB_PORT=5432
  LOG_LEVEL=debug
  EOF
  ```

  Load the file and run the deploy-info script using those values:

  ```sh
  set -a && source ~/academy/.env && set +a
  deploy-info
  ```

  `set -a` automatically exports every variable that is set, so `source` makes them available to child processes. `set +a` turns that behaviour back off.

- Understand why `.env` files must never be committed to version control. They often contain secrets (passwords, API keys) and environment-specific values that differ per developer. Add `.env` to a `.gitignore` file:

  ```sh
  echo ".env" >> ~/academy/.gitignore
  ```

## Local vs Dev vs Production

Real projects run code in multiple environments, each serving a different purpose:

| Environment | Purpose | Who uses it |
| ----------- | ------- | ----------- |
| Local | Development on a developer's own machine | Individual developer |
| Dev / Staging | Shared testing environment, mirrors production | QA, team |
| Production | Live system serving real users | End users |

Each environment has its own configuration — different databases, different API keys, different log verbosity. Environment variables are the mechanism that makes one codebase serve all three without change.

A developer's local environment is intentionally different from production: it runs on `localhost`, logs everything, and often uses a local database with test data. Production has real credentials, minimal logging, and connects to hardened infrastructure. This separation prevents accidental data corruption, reduces the blast radius of mistakes, and means developers can experiment freely without risk to live users.

## Reading / Reference

- `man env` — documentation for the `env` command.
- [The Twelve-Factor App: Config](https://12factor.net/config) — the industry standard for how applications should handle environment-based configuration.
- [dotenv on npm](https://www.npmjs.com/package/dotenv) — the most common library for loading `.env` files in Node.js projects; the same pattern exists in Python (`python-dotenv`) and other languages.
