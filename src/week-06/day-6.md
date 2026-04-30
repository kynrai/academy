# Weekend Challenges

## Extended Challenges

- **Extend the Inventory**: Add a `restock(name, quantity)` operation to the inventory from Day 5. Products need a `quantity` field. Deduct quantity on a `purchase(name, qty)` call and raise an error if stock would go negative. Implement in all four languages.

- **Generic pagination**: Write a generic `paginate<T>(items, page, page_size)` function that returns a slice of items for the requested page number. In TypeScript, also return `{ items: T[], total: int, page: int, total_pages: int }`. Implement the same function in Go.

- **Comparable interface**: In Go, implement sorting on `[]Product` by implementing the `sort.Interface` (`Len`, `Less`, `Swap`). Sort by price, then add a second sort order by name. Compare this to Python's `key=` approach and TypeScript's comparator function.

- **Recursive data structures**: Model a category tree where each category can have sub-categories. Define the type recursively in all four languages. Write a function that flattens the tree into a list of all leaf category names.

- **Benchmark list vs map lookup**: Create 10,000 products. Measure the time to find a product by name using: (1) a linear scan through a list, (2) a lookup in a map/dictionary. Run in Python and Go. What is the difference and why?

## Recommended Reading

- Python: [Collections ABC](https://docs.python.org/3/library/collections.abc.html) — the interfaces behind Python's built-in containers.
- TypeScript: [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html) — read the full list.
- C#: [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/) — overview and query expressions.
- Go: [Data Structures in Go](https://www.opsdash.com/blog/generic-containers-golang.html) — building containers with generics.

## Reflection

- You defined `Product` as a dataclass, interface, record, and struct. Which felt most natural for expressing a "product is a thing with these properties"? Which gave you the most compile-time safety?
- In Python, a `dict` and a `dataclass` can represent the same data. Why would you choose one over the other in a real project?
- Go maps do not preserve insertion order. TypeScript `Map` does. Python `dict` does (since 3.7). When does this matter?
- What is the difference between a class and an interface? Can a struct satisfy an interface in C# and Go? How does this differ from Python's duck typing?
