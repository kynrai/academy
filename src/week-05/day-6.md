# Weekend Challenges

## Extended Challenges

- **Add a product list command**: Extend the CLI utility from Day 5 to accept a `list` subcommand. It reads a plain text file where each line is `name,price,category`, processes every product, and prints a formatted table with columns aligned. Handle malformed lines with a warning and skip, continuing to the next line.

- **Implement in all four languages**: Take any function you wrote this week — `calculate_total`, `apply_discount`, or `validate_args` — and port it exactly to all four languages if you haven't already. Notice where the language forces you to think differently (error handling, type declarations, null checks).

- **Recursion**: Write a recursive function `nested_discount(price, tiers)` where `tiers` is a list of discount rates applied sequentially. `nested_discount(100, [0.1, 0.2])` should return `100 * 0.9 * 0.8 = 72.0`. Implement it in Python and Go. Add a check that prevents infinite recursion if the list is accidentally circular.

- **Higher-order functions**: Write a `compose` function that takes two functions and returns a new function that applies them in sequence. In Python: `compose(double, add_one)(5) == 11`. In TypeScript, give it a generic signature so the compiler enforces that the output type of the first function matches the input type of the second.

- **Benchmark loop styles**: In Python, compare three ways to build a list of discounted prices: a `for` loop with `.append()`, a list comprehension, and `map()`. Use `timeit` with 100,000 items. In TypeScript, compare `for...of`, `.map()`, and a `for` loop. Note and explain the results.

## Recommended Reading

- Python: [Functions — official tutorial](https://docs.python.org/3/tutorial/controlflow.html#defining-functions)
- TypeScript: [Handbook — Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- C#: [Methods](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/methods)
- Go: [Effective Go — Functions](https://go.dev/doc/effective_go#functions)

## Reflection

- Python, TypeScript, and C# all use exceptions; Go uses error return values. After this week, which approach did you find easier to write? Which was easier to read? Are these the same answer?
- What is the difference between a runtime error and a compile-time error? Give one example of each from this week's exercises.
- In Go, what does it mean that a function can return multiple values? Can you think of a case in Python or TypeScript where you needed a tuple or an object just to return two things from a function?
- You wrote the same program in four languages. Which required the most boilerplate? Which was the most concise? What did you lose by being concise?
