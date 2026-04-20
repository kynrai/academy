# Day 4 – Go: Installation, Modules, and Basics

## Today's Focus

Install Go, understand its module system, and write basic Go programs. Go is notable for having batteries included — the standard library is extensive enough that many tasks need no external packages at all.

## What is Go?

Go (also called Golang) is a statically typed, compiled language created at Google. It is designed to be simple, fast, and easy to read. Key characteristics:

- **Compiled to a single binary** — no runtime to install on the target machine
- **Statically typed** — type errors are caught at compile time
- **Garbage collected** — memory is managed automatically, unlike Rust or C
- **Excellent concurrency** — goroutines and channels are built into the language
- **Fast build times** — even large projects compile in seconds

Go is used for: web servers, CLI tools, network services, container infrastructure (Docker and Kubernetes are written in Go), and anything where low latency and easy deployment matter.

## Installing Go

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

Verify the install and check where Go installed itself:

```sh
go version
go env GOROOT     # where the Go toolchain lives
go env GOPATH     # your personal Go workspace (usually ~/go)
```

## The Module System

Go uses a built-in module system — there is no separate package manager like pip or npm. A **module** is a collection of Go packages with a `go.mod` file at the root.

### Creating a module

```sh
mkdir ~/projects/hello-go && cd ~/projects/hello-go
go mod init hello-go
```

`go mod init` creates `go.mod`:

```text
module hello-go

go 1.22
```

When you add external dependencies, Go creates `go.sum` — a cryptographic hash file ensuring reproducible installs. Both files should be committed to version control.

### Adding dependencies

```sh
go get github.com/some/package@v1.2.3
```

This updates `go.mod` and `go.sum`. Unlike npm, there is no `vendor` directory by default — Go downloads to a shared module cache (`$GOPATH/pkg/mod`).

## Writing and Running Go

Create `main.go`:

```go
package main

import "fmt"

func main() {
    name := "Academy"
    languages := []string{"Python", "JavaScript", "Go", "C#"}

    fmt.Printf("Hello from %s!\n", name)

    for i, lang := range languages {
        fmt.Printf("  %d. %s\n", i+1, lang)
    }

    fmt.Println(greet("Go"))
}

func greet(language string) string {
    return fmt.Sprintf("Hello from %s", language)
}
```

Run without compiling:

```sh
go run main.go
```

Compile to a binary:

```sh
go build -o hello
./hello
```

The resulting binary has no dependencies — it can be copied to any machine with the same OS and architecture and run immediately.

## Go Basics

### Types and variables

```go
// Short declaration (type inferred)
name := "Alice"
count := 42

// Explicit type
var score float64 = 9.5
var active bool = true

// Multiple assignment
x, y := 10, 20
```

### Functions

```go
// Single return value
func add(a int, b int) int {
    return a + b
}

// Multiple return values — idiomatic Go error handling
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 3)
if err != nil {
    fmt.Println("Error:", err)
} else {
    fmt.Printf("Result: %.2f\n", result)
}
```

### Slices and maps

```go
// Slice (like a dynamic array)
fruits := []string{"apple", "banana", "cherry"}
fruits = append(fruits, "date")

for _, fruit := range fruits {
    fmt.Println(fruit)
}

// Map
ages := map[string]int{
    "Alice": 30,
    "Bob":   25,
}
ages["Charlie"] = 35

for name, age := range ages {
    fmt.Printf("%s is %d\n", name, age)
}
```

## Tasks

- Install Go and verify with `go version`. Run `go env` and identify `GOROOT` and `GOPATH`.
- Create a module with `go mod init hello-go`. Inspect the `go.mod` file.
- Write `main.go` with the example above and run it with `go run main.go`.
- Compile the program with `go build -o hello` and run the binary directly with `./hello`. Check the file size — note it contains everything it needs to run.
- Write a function that accepts a slice of strings and returns a new slice containing only the strings longer than a given length. Call it from `main` and print the result.
- Add error handling: write a function that can return an error, call it with inputs that trigger the error, and handle it with an `if err != nil` check.

## Reading / Reference

- [A Tour of Go](https://go.dev/tour/) — the official interactive tutorial, covers the full language in 90 minutes
- [Go by Example](https://gobyexample.com/) — concise examples for every language feature
- [Effective Go](https://go.dev/doc/effective_go) — idiomatic Go style and conventions
- [Go module reference](https://go.dev/ref/mod)
