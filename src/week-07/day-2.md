# Day 2 – Go Interfaces and Concurrency

## Today's Focus
Explore Go interfaces, concurrency primitives, and Go modules with external dependencies.

## Tasks
- Define a `Formatter` interface with a `Format(counts []WordCount) string` method. Implement two structs that satisfy it: `PlainFormatter` (plain text table) and `JSONFormatter` (JSON output). Your `main.go` should accept a `--format` flag and select the right implementation.
- Write a concurrent version of the file reader: use `goroutines` and a `channel` to process multiple files in parallel (pass multiple file paths as arguments). Use a `sync.WaitGroup` to wait for all goroutines to complete before printing results.
- Add an external dependency: `go get github.com/spf13/cobra` (or `github.com/urfave/cli/v2`). Refactor your CLI to use it for argument parsing and help text. Run `go mod tidy` and inspect `go.mod` and `go.sum`.
- Understand `go.sum`: find your new dependency's hash in `go.sum`. Explain in a comment why `go.sum` is committed to version control but should never be hand-edited.
- Run `go list -m all` to see the full dependency graph. Identify a transitive dependency you did not add directly.
- Add `go generate` support: add a comment `//go:generate go fmt ./...` and run `go generate ./...`. Discuss what `go generate` is typically used for in larger projects.

## Reading / Reference
- [A Tour of Go](https://go.dev/tour/) — Interfaces and Concurrency sections.
- Go docs: [Go Modules Reference](https://go.dev/ref/mod) — the module file, go.sum, and `go mod tidy`.
- [Go by Example](https://gobyexample.com/) — Goroutines, Channels, WaitGroups, Interfaces.
