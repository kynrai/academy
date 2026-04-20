# Day 5 – Go and Rust Comparison

## Today's Focus
Compare Go and Rust side by side, benchmark both implementations, and reflect on language trade-offs.

## Tasks
- Ensure both your Go and Rust CLIs solve the identical problem (word frequency counter with `--format` and top-N flags). Review the code side by side and document differences in a `COMPARISON.md` file: error handling style, memory model, concurrency approach, binary size.
- Benchmark both binaries against the same large text file (e.g. a Project Gutenberg novel): `time ./go-wordcount book.txt` vs `time ./rust-wordcount book.txt`. Note wall time, user time, and maximum RSS memory. Use `hyperfine ./go-wordcount book.txt ./rust-wordcount book.txt` if you have it installed.
- Compile both with optimisations: Go's `go build -ldflags="-s -w"` and Rust's `cargo build --release`. Compare binary sizes. Use `upx` (if available) to compress and re-measure.
- Add an external HTTP dependency to each: Go (`go get github.com/go-resty/resty/v2`) and Rust (`cargo add reqwest --features blocking`). Write a sub-command in each CLI that fetches a URL and counts words in the response body.
- Update a dependency in each ecosystem: use `go get -u github.com/spf13/cobra@latest` in Go and `cargo update` in Rust. Read what changed. In Go, verify `go.sum` was updated. In Rust, check the `Cargo.lock` diff.
- Write a one-page decision guide (in `COMPARISON.md`): when would you choose Go over Rust, and vice versa? Consider: team familiarity, compile times, memory safety guarantees, concurrency model, ecosystem.

## Reading / Reference
- [Go vs Rust — Jon Gjengset (YouTube)](https://www.youtube.com/watch?v=BZS6M8RV07Q) — a practitioner's comparison.
- [Rust Performance Book](https://nnethercote.github.io/perf-book/) — Benchmarking chapter.
- [Go modules: go get](https://go.dev/ref/mod#go-get) and [cargo update](https://doc.rust-lang.org/cargo/commands/cargo-update.html).
