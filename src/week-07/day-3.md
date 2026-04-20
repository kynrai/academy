# Day 3 – Rust Ownership and Error Handling

## Today's Focus
Set up Rust toolchain and build the same word-frequency CLI in Rust — focusing on ownership and borrowing.

## Tasks
- Install Rust via `rustup`. Run `rustc --version` and `cargo --version`. Create a new project: `cargo new week5-rust --bin` and explore the generated `Cargo.toml` and `src/main.rs`.
- Build the word frequency counter in Rust: read a file with `std::fs::read_to_string`, split on whitespace, collect into a `HashMap<String, usize>`, sort by frequency, and print the top 10.
- Understand ownership: write a function `count_words(text: &str) -> HashMap<String, usize>` that borrows the string rather than taking ownership. Explain in comments why `&str` vs `String` is used here.
- Handle errors with `Result`: replace any `.unwrap()` calls with proper `?` propagation in a function that returns `Result<(), Box<dyn std::error::Error>>`. Add a meaningful error message using `.map_err(|e| format!("failed to read file: {e}"))`.
- Write two unit tests inside a `#[cfg(test)]` module in the same file. Run with `cargo test -- --nocapture` to see stdout during tests.
- Run `cargo clippy` and fix every lint warning. Run `cargo fmt` to auto-format. Add both to your development habit.

## Reading / Reference
- [The Rust Book](https://doc.rust-lang.org/book/) — Chapters 1–9: getting started, ownership, structs, enums, error handling.
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/) — Primitives, Custom Types, Variable Bindings, Error Handling.
- [Rust Playground](https://play.rust-lang.org/) — use this to experiment without leaving the browser.
