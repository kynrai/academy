# Weekend Challenges

These challenges extend what you practised during the week. They are harder than the daily tasks and are designed to push you to read documentation and work things out independently.

## Challenge 1 — uv Project from Scratch

Create a Python CLI tool called `langinfo` using uv that:

- Accepts a language name as a command-line argument (`python3 langinfo.py python`)
- Returns a hardcoded JSON summary for each supported language (name, current stable version, primary use cases)
- Prints formatted output to the terminal
- Exits with status `1` and a helpful message if the language is not found

Requirements:

- Use `uv init` and `uv add` to manage the project
- Use Python's `sys.argv` or `argparse` for argument parsing
- Support at least the four languages covered this week

## Challenge 2 — Node.js CLI Tool

Write a Node.js script `langinfo.js` that does the same as Challenge 1 but in JavaScript. It should:

- Use `process.argv` to read the language argument
- Print formatted JSON output using `JSON.stringify`
- Handle the unknown language case with `process.exit(1)`

Then add a `"langinfo"` script to `package.json` so it can be run with `npm run langinfo -- python`.

## Challenge 3 — Go Binary

Implement the same `langinfo` tool in Go. Compile it to a binary with `go build -o langinfo`. Copy the binary to `~/bin` so it runs from anywhere on your PATH (from Week 1 Day 2). Confirm it works from a different directory.

This demonstrates one of Go's key advantages: the compiled binary is self-contained and needs no runtime installed on the target machine.

## Challenge 4 — Extend the Web Servers

Add the following to each of the four hello-world servers from Day 5:

- `GET /languages` — returns a JSON array of all four language names
- `GET /languages/{name}` — returns details for one language or a `404` if not found

Test every endpoint with `curl` and verify the `404` case returns the correct status code.

## Challenge 5 — .NET and NuGet

In your `hello-dotnet` project:

- Add the `Spectre.Console` NuGet package (`dotnet add package Spectre.Console`)
- Rewrite the console output to use Spectre's formatted tables and colours
- Add a second project to the solution (a class library) that holds the language data, and reference it from the console app

This introduces multi-project .NET solutions and the NuGet package experience.

## Reflection

- Python, Node.js, C#, and Go all have different approaches to dependency management. What do they have in common? What is the role of a lock file in each?
- Go compiles to a self-contained binary; Python and Node require the runtime to be installed. What are the operational trade-offs when deploying each?
- You ran four HTTP servers on different ports. What would need to change to run them all on port 80? (You do not need to do this — just think through it.)
- Look at the `Content-Type` header each server returned. They all said `application/json`. If you wanted to return plain text instead, what would you change in each server?
