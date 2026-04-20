# Weekend Challenges

## Extended Challenges
- **Go HTTP server**: Build a small HTTP API in Go using only the standard library (`net/http`). Serve a JSON endpoint that returns the top-10 word frequencies for a given text body sent in the request. Add proper error handling, a timeout on the server, and a graceful shutdown on `SIGINT`.
- **Rust async**: Rewrite your Rust HTTP fetch sub-command using `tokio` and `reqwest` async (not blocking). Use `#[tokio::main]` and `async fn`. Compare the async code to the blocking version in terms of readability and when async would actually matter.
- **Cross-compilation**: Cross-compile your Go binary for Linux ARM64 from your Mac: `GOOS=linux GOARCH=arm64 go build -o wordcount-linux-arm64`. Cross-compile your Rust binary using `cross` (`cargo install cross`). Verify both binaries with `file`.
- **Go generics**: Rewrite your `TopN` function using Go generics (added in Go 1.18): make it work for any type `T` with a numeric count field. Use a type constraint that requires a `Count() int` method or use `golang.org/x/exp/constraints`.
- **Rust lifetimes**: Write a Rust function that returns a reference to the longest of two string slices without cloning. Add explicit lifetime annotations. Then intentionally break the lifetime constraint and observe the compiler error. Write an explanation in comments.

## Recommended Reading
- [The Rust Book](https://doc.rust-lang.org/book/) — Chapters 10 (Generics, Traits, Lifetimes), 15 (Smart Pointers), 16 (Concurrency).
- [Effective Go](https://go.dev/doc/effective_go) — complete read (it is short).
- [100 Go Mistakes and How to Avoid Them by Teiva Harsanyi](https://100go.co/) — free summaries online.
- [Rust Atomics and Locks by Mara Bos](https://marabos.nl/atomics/) — free online; covers low-level concurrency.

## Reflection
- What is Go's approach to polymorphism (interfaces satisfied implicitly) vs Rust's approach (traits with explicit `impl`)? Which did you find more intuitive and why?
- Rust has no garbage collector. How does the borrow checker achieve memory safety without one? What did the compiler prevent you from doing this week that would have caused a bug in Go or Python?
- In Go, what happens if a goroutine panics? How do you recover gracefully? What is the idiomatic pattern?
- Compare Go modules and Cargo: which dependency management experience did you prefer? What does Cargo do that Go modules do not (or vice versa)?
- After building the same program in Go and Rust, which would you choose for a new microservice that needs to be fast, deployed in containers, and maintained by a team of 5? Justify your answer.
