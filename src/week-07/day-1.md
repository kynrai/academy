# Day 1 – Go Toolchain and CLI

## Today's Focus
Set up Go toolchain, understand Go's package model, and build a working CLI utility.

## Tasks
- Install Go via the [official installer](https://go.dev/dl/). Run `go version` and `go env GOPATH`. Initialise a new module: `go mod init github.com/yourname/week5-go`.
- Write a `main.go` that implements a CLI tool: a word frequency counter that reads a text file (path passed as a command-line argument using `os.Args`), counts word occurrences, and prints the top 10 words sorted by frequency.
- Define a `struct` for `WordCount { Word string; Count int }` and a function `TopN(counts map[string]int, n int) []WordCount`. Keep business logic out of `main()`.
- Handle errors explicitly: `os.Open` returns an error — check it, print a useful message to `os.Stderr`, and call `os.Exit(1)`. Do not use `panic` for expected errors.
- Split your code into two files: `main.go` (entry point) and `wordcount.go` (logic). Both should be in `package main`. Run `go build ./...` and `go vet ./...` — fix any issues.
- Write two test functions in `wordcount_test.go` using the `testing` package. Run them with `go test -v ./...`.

## Reading / Reference
- [A Tour of Go](https://go.dev/tour/) — Basics section: packages, variables, functions, flow control, structs.
- Go docs: [Effective Go](https://go.dev/doc/effective_go) — Names, Control structures, Functions, and Data sections.
- [Go by Example](https://gobyexample.com/) — Command-Line Arguments, Structs, Maps, Sorting.
