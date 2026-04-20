# Weekend Challenges

## Extended Challenges
- **Advanced type gymnastics**: Implement a `DeepReadonly<T>` utility type that recursively marks all nested properties as `readonly`. Test it against a deeply nested domain model. Then implement `DeepPartial<T>`. These are common interview questions and reveal how conditional and mapped types work.
- **Template literal types**: Use TypeScript's template literal types to define a type `HttpMethod` that only allows `"GET"`, `"POST"`, `"PUT"`, `"PATCH"`, `"DELETE"`, and a type `ApiRoute` that must match the pattern `"/api/${string}"`. Write a typed `apiClient` function that uses both.
- **Branded types**: Implement branded/nominal types (`UserId`, `OrderId`) so that functions accepting a `UserId` reject a plain `string` or an `OrderId` at compile time. This prevents a common class of bugs where two different ID types are confused.
- **Module augmentation**: Extend the `Express.Request` type (or any other library type) to add a custom `user` property via module augmentation in a `types/express.d.ts` file. This is a real-world pattern needed whenever you add middleware that attaches data to request objects.
- **Performance**: Write a TypeScript program that processes a large array (1 million items) using different strategies: `for` loop, `Array.reduce`, `Array.map` chained operations. Benchmark with `performance.now()` and explain the results.

## Recommended Reading
- [Effective TypeScript by Dan Vanderkam](https://effectivetypescript.com/) — Items 11–25 on the type system.
- [TypeScript Handbook: Type Manipulation](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) — Conditional Types, Mapped Types, Template Literal Types.
- [Matt Pocock's Total TypeScript tutorials](https://www.totaltypescript.com/) — free beginner and intermediate exercises.
- [You Don't Know JS: Scope & Closures](https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/README.md) — the JS fundamentals TypeScript compiles down to.

## Reflection
- What is structural typing (duck typing) as TypeScript implements it? How is it different from nominal typing in languages like Java? What are the trade-offs?
- When does using `any` make sense, and when is it a code smell? What intermediate options exist (`unknown`, type assertions, `// @ts-expect-error`)?
- You now have both Python (Week 3) and TypeScript (Week 4) project setups. Compare the tooling ecosystems: what does each do well? What is harder to set up?
- Look at your domain models: are there any places where the type system is not expressive enough to prevent a runtime bug? What would you need (e.g. branded types, opaque types) to close that gap?
- If `npm audit` reports a vulnerability in a dependency you cannot update (because a newer version has breaking changes), what are your options?
