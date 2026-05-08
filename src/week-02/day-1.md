# Day 1 – Installing the Language Runtimes and Building Hello World CLIs

## Today's Focus

Install Python, Node.js, C#, and Go on your machine. Build a minimal `greet` CLI in each to see how each ecosystem handles the same task differently. Along the way, learn how command-line interfaces actually work — what arguments and flags are, how programs receive them, and the conventions every CLI tool follows.

Work through each language in order. Verify the install before moving on.

---

## How CLIs Work

Every command-line program receives its input as an array of strings. When you type:

```sh
greet --upper --language es Alice
```

the operating system runs the `greet` binary and hands it the strings `--upper`, `--language`, `es`, and `Alice` as command-line arguments. The program's job is to interpret them.

### Three kinds of token

| Token | Example | Meaning |
| ----- | ------- | ------- |
| **Positional argument** | `Alice` | A value identified by its position. The program decides what each position means (first positional = name, second = greeting, etc.). |
| **Boolean flag** | `--upper`, `-u` | A switch that turns something on or off. Present means `true`. |
| **Flag with value** | `--language es`, `-l es`, `--language=es` | A flag that takes a value. The value is either the next token, or after `=`. |

### Conventions every CLI follows

- **Long form vs short form.** `--verbose` and `-v` are equivalent. Short flags can sometimes be combined: `-rf` is shorthand for `-r -f`.
- **`--` ends flag parsing.** Everything after a bare `--` is treated as a positional argument, even if it looks like a flag. This is why `dotnet run -- Alice` was needed in this week's C# example: `dotnet run` treats `--` as "the rest is for the program, not for me".
- **`--help` / `-h`** prints usage and exits with status `0`. Every CLI should support this.
- **`--version`** prints the program version.
- **Exit codes.** `0` means success. Non-zero means failure — `1` for general errors, `2` for misuse (bad arguments). The shell uses these codes to chain commands: `cmd1 && cmd2` only runs `cmd2` if `cmd1` exited with `0`.
- **stdout vs stderr.** Normal output goes to **stdout**. Errors and diagnostics go to **stderr**. This lets users redirect them separately:

  ```sh
  greet Alice > output.txt    # capture stdout; errors still print
  greet Alice 2> errors.txt   # capture stderr only
  greet Alice > out 2> err    # capture both separately
  ```

These conventions are why standard tools feel consistent. `git`, `ls`, `curl`, `docker`, `kubectl` all follow them.

### Where each language exposes the arguments

| Language | Argument array | First element | First positional arg | Stdlib flag parser |
| -------- | -------------- | ------------- | -------------------- | ------------------ |
| Python | `sys.argv` | program path | `sys.argv[1]` | `argparse` |
| Node.js | `process.argv` | path to `node` | `process.argv[2]` (script path is `[1]`) | `node:util parseArgs` |
| C# | `args` (entry point) | first positional arg | `args[0]` | none — use `System.CommandLine` |
| Go | `os.Args` | program path | `os.Args[1]` | `flag` |

The simple `greet` programs below read positional arguments directly. Adding flag parsing is one of the tasks at the end of the day.

---

## Python

### Install Python

**macOS (Homebrew):**

```sh
brew install python
python3 --version
```

**Linux (apt):**

```sh
sudo apt update && sudo apt install python3 python3-pip
python3 --version
```

Install `uv` — the project and package manager used throughout this course:

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.zshrc   # or ~/.bashrc on Linux
uv --version
```

### Hello World CLI – Python

```sh
mkdir ~/projects/greet-python && cd ~/projects/greet-python
uv init
```

Replace the starter script with `greet.py`:

```python
import sys

if len(sys.argv) < 2:
    print("Error: please provide a name.", file=sys.stderr)
    print(f"Usage: {sys.argv[0]} <name>")
    sys.exit(1)

print(f"Hello, {sys.argv[1]}!")
```

```sh
uv run python greet.py Alice
uv run python greet.py        # error path
```

Key files created by `uv init`: `pyproject.toml` (project metadata and dependencies), `uv.lock` (exact dependency versions). Dependencies installed with `uv add` are recorded in `pyproject.toml` and pinned in `uv.lock`.

---

## Node.js

### Install Node.js

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.zshrc
nvm install 20
nvm alias default 20
node --version    # v20.x.x
npm --version
```

### Hello World CLI – Node.js

```sh
mkdir ~/projects/greet-node && cd ~/projects/greet-node
npm init -y
```

Create `greet.js`:

```js
const name = process.argv[2];

if (!name) {
  console.error("Error: please provide a name.");
  console.log(`Usage: ${process.argv[1]} <name>`);
  process.exit(1);
}

console.log(`Hello, ${name}!`);
```

```sh
node greet.js Alice
node greet.js         # error path
```

Key files: `package.json` (project metadata, scripts, dependencies), `package-lock.json` (created on first `npm install`, records exact resolved versions), `node_modules/` (installed packages — never commit this).

---

## C# and .NET

### Install C# and .NET

**macOS (Homebrew):**

```sh
brew install --cask dotnet-sdk
dotnet --version
```

**Linux (apt):**

```sh
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update && sudo apt install dotnet-sdk-8.0
dotnet --version
```

### Hello World CLI – C#

```sh
mkdir ~/projects/greet-dotnet && cd ~/projects/greet-dotnet
dotnet new console
```

Replace `Program.cs`:

```csharp
if (args.Length == 0)
{
    Console.Error.WriteLine("Error: please provide a name.");
    Console.WriteLine("Usage: greet <name>");
    Environment.Exit(1);
}

Console.WriteLine($"Hello, {args[0]}!");
```

```sh
dotnet run -- Alice
dotnet run              # error path
```

The `--` separator tells `dotnet run` that what follows are arguments for your program, not for `dotnet`. Key files: `.csproj` (project file — dependencies, target framework), `bin/` (compiled output). Packages are installed from NuGet with `dotnet add package <name>`.

---

## Go

### Install Go

**macOS (Homebrew):**

```sh
brew install go
go version
```

**Linux (apt):**

```sh
sudo apt update && sudo apt install golang
go version
```

### Hello World CLI – Go

```sh
mkdir ~/projects/greet-go && cd ~/projects/greet-go
go mod init greet-go
```

Create `main.go`:

```go
package main

import (
    "fmt"
    "os"
)

func main() {
    if len(os.Args) < 2 {
        fmt.Fprintln(os.Stderr, "Error: please provide a name.")
        fmt.Printf("Usage: %s <name>\n", os.Args[0])
        os.Exit(1)
    }

    fmt.Printf("Hello, %s!\n", os.Args[1])
}
```

```sh
go run main.go Alice
go run main.go          # error path

go build -o greet
./greet Alice           # runs as a compiled binary
```

Key files: `go.mod` (module path and dependencies), `go.sum` (cryptographic hashes of all dependencies). No separate package manager — `go get`, `go build`, and `go run` are all built into the Go toolchain. The compiled binary is self-contained: it runs on the target machine with no Go installation required.

---

## Comparing the Four Ecosystems

|                         | Python                   | Node.js                     | C#                 | Go                  |
| ----------------------- | ------------------------ | --------------------------- | ------------------ | ------------------- |
| Arguments               | `sys.argv[1]`            | `process.argv[2]`           | `args[0]`          | `os.Args[1]`        |
| Run command             | `uv run python greet.py` | `node greet.js`             | `dotnet run --`    | `go run main.go`    |
| Dependency file         | `pyproject.toml`         | `package.json`              | `.csproj`          | `go.mod`            |
| Package store           | per-project `.venv`      | per-project `node_modules/` | global NuGet cache | global module cache |
| Output                  | Interpreted script       | Interpreted script          | JIT-compiled IL    | Native binary       |
| Needs runtime on target | Yes (Python)             | Yes (Node)                  | Yes (.NET)         | No                  |

---

## Tasks

- Install all four runtimes. Verify each with its version command before moving on.
- Build the `greet` program in each language. Confirm both the success path (`greet Alice`) and the error path (no argument) work correctly.
- In the Go project, run `go build -o greet` and copy the binary to a different directory. Run it from there — confirm it works with no `go` installation visible to that path.
- Open `pyproject.toml`, `package.json`, `.csproj`, and `go.mod` side by side. Note what each file records: project name, dependencies, target runtime version.
- **Practise stdout vs stderr.** In each greet program, run:

  ```sh
  greet Alice > out.txt 2> err.txt
  greet > out.txt 2> err.txt
  ```

  Open both files after each run and confirm: success output went to `out.txt`, error output went to `err.txt`.

- **Inspect the exit code.** After running each program, check `$?` (the previous command's exit code):

  ```sh
  greet Alice && echo "success"
  greet || echo "exit code was $?"
  ```

- **Add a `--upper` flag** to one of the four `greet` programs of your choosing. When present, the greeting should be uppercased: `greet Alice --upper` prints `HELLO, ALICE!`. Both argument orders should work: `greet --upper Alice` and `greet Alice --upper`. Use `argparse` (Python), `node:util parseArgs` (Node), `args.Contains` (C#), or `flag` (Go).

## Reading / Reference

- [uv documentation](https://docs.astral.sh/uv/)
- [nvm README](https://github.com/nvm-sh/nvm)
- [.NET SDK download page](https://dotnet.microsoft.com/en-us/download)
- [Go installation guide](https://go.dev/doc/install)
- Python: [argparse tutorial](https://docs.python.org/3/howto/argparse.html)
- Node.js: [util.parseArgs](https://nodejs.org/api/util.html#utilparseargsconfig)
- Go: [flag package](https://pkg.go.dev/flag)
- [POSIX Utility Argument Syntax conventions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html)
