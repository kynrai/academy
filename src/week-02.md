# Week 2 – Language Setup and Foundations

## Overview

Before we build web servers, CLIs, and APIs, we need working runtimes for every language used in this course. Week 2 is entirely focused on getting four languages installed correctly, understanding each one's package and dependency model, and running a basic program in each. The week ends with a hello-world HTTP server in all four languages side by side — demonstrating that the same HTTP protocol works regardless of which language is running the server.

## What you will learn

| Day | Language | Focus |
| --- | -------- | ----- |
| Day 1 | Python | Installation, virtual environments, uv, and a first script |
| Day 2 | Node.js / JavaScript | Node runtime, nvm, npm, and a first script |
| Day 3 | .NET / C# | SDK installation, dotnet CLI, and a first program |
| Day 4 | Go | Installation, modules, and a first program |
| Day 5 | All four | Hello-world HTTP server in each language |

## Objectives

By the end of this week you will be able to:

- Install and manage Python versions using your OS package manager and pyenv.
- Explain why Python requires virtual environments and create them using both venv and uv.
- Install and switch Node.js versions using nvm.
- Install the .NET SDK, use the `dotnet` CLI to create and run a project.
- Install Go, initialise a module with `go mod init`, and run a program.
- Write and run a basic script or program in each language.
- Start an HTTP server that returns JSON in Python, JavaScript, C#, and Go.
- Explain that HTTP is language-agnostic — the same protocol works across all runtimes.

## Topics

### Python

- Installing Python via Homebrew or apt; why the OS package manager is preferred over downloading installers
- Managing multiple Python versions with pyenv
- Why global `pip install` causes version conflicts across projects
- Virtual environments with `venv`: create, activate, deactivate
- `uv` as a faster, all-in-one alternative: project init, dependency management, lock files, Python version pinning
- Running a Python script

### Node.js / JavaScript

- What Node.js is and why it matters (JavaScript outside the browser)
- Installing Node via nvm; pinning a version with `.nvmrc`
- npm: initialising a project, installing packages, `package.json`, `node_modules`
- Running a JavaScript file with `node`

### .NET (C#)

- What the .NET runtime and SDK are
- Installing the .NET SDK via package manager
- The `dotnet` CLI: `new`, `run`, `build`, `add package`
- C# basics: types, methods, `Console.WriteLine`
- Running a console program

### Go

- Installing Go via package manager
- The Go module system: `go mod init`, `go.mod`, `go.sum`
- Running code with `go run`; building a binary with `go build`
- Go basics: packages, imports, `fmt.Println`, typed variables

### HTTP across all four languages

- Minimal HTTP server returning JSON in Python (FastAPI), JavaScript (Express), C# (ASP.NET Core minimal API), and Go (`net/http`)
- Observing that `curl` and the browser interact with all four identically
- HTTP is the contract; the language is the implementation detail

## Deliverables

- All four runtimes installed and verified with `--version`
- A working Python project managed by uv
- A working Node.js project with a `package.json`
- A working .NET console project
- A working Go module
- Four running HTTP servers, each returning `{"message": "Hello from <language>"}` on `GET /`
