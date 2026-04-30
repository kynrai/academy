# Day 4 – Generics and Type Safety

## Today's Focus

Write functions and types that work for any type `T` rather than a single concrete type. Generics let you avoid duplicating logic for `[]string`, `[]int`, `[]Product`, and so on. See how each language expresses type parameters and constraints.

## The problem generics solve

Without generics, you write the same logic multiple times:

```python
def first_string(items: list[str]) -> str | None:
    return items[0] if items else None

def first_int(items: list[int]) -> int | None:
    return items[0] if items else None
```

With generics, one function handles any type:

```python
from typing import TypeVar

T = TypeVar("T")

def first(items: list[T]) -> T | None:
    return items[0] if items else None

first(["Laptop", "Notebook"])   # str
first([999.0, 4.99])            # float
first([])                       # None
```

## Generic syntax in all four languages

### A generic `first` function

```python
from typing import TypeVar, Sequence

T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None
```

```typescript
function first<T>(items: T[]): T | undefined {
    return items.length > 0 ? items[0] : undefined;
}
```

```csharp
static T? First<T>(IEnumerable<T> items)
{
    foreach (var item in items)
        return item;
    return default;
}
```

```go
func First[T any](items []T) (T, bool) {
    if len(items) == 0 {
        var zero T
        return zero, false
    }
    return items[0], true
}
```

## Generic container: Stack

A stack works identically for `string`, `Product`, or any other type.

```python
from typing import Generic

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if not self._items:
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T | None:
        return self._items[-1] if self._items else None

    def is_empty(self) -> bool:
        return len(self._items) == 0
```

```typescript
class Stack<T> {
    private items: T[] = [];

    push(item: T): void { this.items.push(item); }

    pop(): T {
        if (this.isEmpty()) throw new Error("pop from empty stack");
        return this.items.pop()!;
    }

    peek(): T | undefined { return this.items.at(-1); }

    isEmpty(): boolean { return this.items.length === 0; }
}
```

```csharp
class Stack<T>
{
    private readonly List<T> _items = new();

    public void Push(T item) => _items.Add(item);

    public T Pop()
    {
        if (IsEmpty) throw new InvalidOperationException("stack is empty");
        T item = _items[^1];
        _items.RemoveAt(_items.Count - 1);
        return item;
    }

    public T? Peek() => IsEmpty ? default : _items[^1];
    public bool IsEmpty => _items.Count == 0;
}
```

```go
type Stack[T any] struct {
    items []T
}

func (s *Stack[T]) Push(item T) {
    s.items = append(s.items, item)
}

func (s *Stack[T]) Pop() (T, error) {
    if s.IsEmpty() {
        var zero T
        return zero, errors.New("stack is empty")
    }
    last := s.items[len(s.items)-1]
    s.items = s.items[:len(s.items)-1]
    return last, nil
}

func (s *Stack[T]) Peek() (T, bool) {
    if s.IsEmpty() {
        var zero T
        return zero, false
    }
    return s.items[len(s.items)-1], true
}

func (s *Stack[T]) IsEmpty() bool { return len(s.items) == 0 }
```

## Type constraints

Sometimes you need to restrict which types `T` can be. For example, a `sum` function only makes sense for numeric types.

```python
from typing import TypeVar
from numbers import Number

N = TypeVar("N", int, float)   # constrained to int or float

def total(items: list[N]) -> N:
    return sum(items)
```

```typescript
// TypeScript: union constraint
function total<T extends number | bigint>(items: T[]): number {
    return items.reduce((acc, n) => acc + Number(n), 0);
}
```

```csharp
// C#: where T : struct constrains to value types
static T Sum<T>(IEnumerable<T> items) where T : struct, INumber<T>
{
    T total = T.Zero;
    foreach (var item in items) total += item;
    return total;
}
```

```go
// Go 1.18+: type constraints via interface
import "golang.org/x/exp/constraints"

func Sum[T constraints.Ordered](items []T) T {
    var total T
    for _, v := range items {
        total += v
    }
    return total
}
```

## Utility types (TypeScript)

TypeScript ships with generic utility types that are used constantly:

```typescript
// Partial<T> — all properties optional
function update(product: Product, changes: Partial<Product>): Product {
    return { ...product, ...changes };
}

// Readonly<T> — prevent mutation
const catalogueEntry: Readonly<Product> = createProduct("Laptop", 999, "Electronics");

// Pick<T, Keys> — select a subset of properties
type ProductSummary = Pick<Product, "name" | "price">;

// Record<K, V> — map type
const discounts: Record<string, number> = {
    Electronics: 0.10,
    Books: 0.05,
};
```

## Tasks

1. Use the generic `Stack` in all four languages: push five products onto a stack, then pop them all and print them. Observe they come out in reverse order.

2. Write a generic `filter<T>(items, predicate)` function in TypeScript and Go. In TypeScript, the predicate is `(item: T) => boolean`. In Go, use a function type. Call it with products filtered by `inStock == true`.

3. In Python, add a constraint to the `Stack` so it only accepts types that implement `__str__`. Use a `Protocol` with a `__str__` method. Test that `Stack[int]` still works.

4. In C#, the `Stack<T>` you wrote accepts any type. Add a constraint `where T : class` so it only accepts reference types. What does this prevent?

5. In TypeScript, write a function `groupBy<T, K extends string>(items: T[], key: (item: T) => K): Record<K, T[]>`. Call it with products grouped by category.

## Reference

- Python: [Generic types](https://docs.python.org/3/library/typing.html#generics)
- TypeScript: [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html) and [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- C#: [Generics](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/generics)
- Go: [Type Parameters](https://go.dev/blog/intro-generics)
