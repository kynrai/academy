# Day 4 – Rust Enums and Cargo

## Today's Focus
Deepen Rust knowledge with enums, pattern matching, and Cargo dependency management.

## Tasks
- Refactor your Rust CLI to use `clap` for argument parsing: `cargo add clap --features derive`. Use the derive macro to define a struct with `#[derive(Parser)]` and subcommands for `count` and `top`. Read the generated help text with `--help`.
- Implement a custom error type using an `enum MyError { IoError(std::io::Error), ParseError(String) }` and implement `std::fmt::Display` for it. Replace `Box<dyn Error>` with `MyError` in your function signatures.
- Use `match` exhaustively on your `MyError` enum in `main()` to print a different message for each variant. Add a new variant and confirm the compiler forces you to handle it everywhere.
- Explore Rust's `Option<T>`: rewrite a function that previously returned a sentinel value (e.g. `""` for "not found") to return `Option<&str>`. Call it with `.unwrap_or("default")`, `.map(|s| s.to_uppercase())`, and `if let Some(v) = result { ... }`.
- Inspect `Cargo.toml` and `Cargo.lock`: add a dependency with a feature flag (e.g. `serde` with `features = ["derive"]`) and one marked `optional = true`. Understand the difference between `Cargo.lock` (committed in binaries) and when to omit it (libraries).
- Run `cargo audit` (install with `cargo install cargo-audit`) to check your dependencies. Investigate any advisory reported.

## Reading / Reference
- [The Rust Book](https://doc.rust-lang.org/book/) — Chapters 10 (Generics), 6 (Enums and Pattern Matching), 9 (Error Handling).
- [Cargo Book](https://doc.rust-lang.org/cargo/) — Specifying Dependencies and Features sections.
- [clap documentation](https://docs.rs/clap/latest/clap/) — Derive tutorial.
