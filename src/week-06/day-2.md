# Day 2 – Interfaces Generics and Classes

## Today's Focus
Model a domain with interfaces, type aliases, and generics; implement classes with OOP patterns.

## Tasks
- Design typed domain models for a small e-commerce domain: `Product`, `CartItem`, `Order`, `Customer`. Use `interface` for object shapes and `type` for unions/aliases. Explain in a comment when you would choose `interface` over `type` and vice versa.
- Write a generic `Result<T, E>` type (similar to Rust's Result) with `{ ok: true; value: T }` and `{ ok: false; error: E }` variants. Write a `safeParseInt` function that returns `Result<number, string>`. Use exhaustive `if/else` on the discriminant to make TypeScript narrow the type in each branch.
- Implement a generic `Stack<T>` class with `push(item: T)`, `pop(): T | undefined`, `peek(): T | undefined`, and `isEmpty(): boolean` methods. Write a second class `BoundedStack<T>` that extends `Stack<T>` and rejects pushes when full.
- Use TypeScript utility types: apply `Partial<Order>` for an update function parameter, `Readonly<Product>` for a catalogue entry, `Pick<Customer, "id" | "email">` for a public profile type. Write a function that uses each.
- Add `readonly` modifiers to properties that should not change after construction. Verify that attempting to mutate them causes a compile error.

## Reading / Reference
- TypeScript Handbook: [Interfaces](https://www.typescriptlang.org/docs/handbook/2/objects.html), [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), [Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html).
- TypeScript Handbook: [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).
- [Effective TypeScript by Dan Vanderkam](https://effectivetypescript.com/) — Items 1–10 cover the mental model you need this week.
