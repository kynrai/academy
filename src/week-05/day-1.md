# Day 1 – Variables, Types, and Expressions

## Today's Focus

Learn how Python, TypeScript, C#, and Go declare variables, express types, and format strings — before writing a single `if` or `for`.

The same product data appears in all four languages throughout weeks 5, 6, and 7. Get familiar with it now.

## Variable Declaration

Each language has its own syntax but the same three concepts: a name, a type, and a value.

```python
# Python – dynamic typing, type inferred at runtime
name = "Widget Pro"
price = 49.99
in_stock = True
rating = 4.2
```

```typescript
// TypeScript – static typing, type inferred or explicit
const name: string = "Widget Pro";
const price: number = 49.99;
const inStock: boolean = true;
const rating = 4.2;          // inferred as number
```

```csharp
// C# – static typing with var keyword for inference
string name = "Widget Pro";
var price = 49.99;            // inferred as double
var inStock = true;           // inferred as bool
double rating = 4.2;
```

```go
// Go – static typing with := shorthand
name := "Widget Pro"          // inferred as string
var price float64 = 49.99    // explicit type
inStock := true
rating := 4.2
```

### Type inference comparison

| Concept            | Python   | TypeScript       | C#           | Go              |
| ------------------ | -------- | ---------------- | ------------ | --------------- |
| Declaration        | `x = 1`  | `let x = 1`      | `var x = 1`  | `x := 1`        |
| Explicit type      | `x: int` | `let x: number`  | `int x = 1`  | `var x int = 1` |
| Constant           | none     | `const x = 1`    | `const x = 1`| none (use caps) |
| Reassign blocked   | no       | `const` blocks   | `const` blocks| no              |

## String Formatting

Embedding values into strings is a daily task. Each language has a preferred idiom.

```python
name = "Widget Pro"
price = 49.99
print(f"{name} costs £{price:.2f}")
```

```typescript
const name = "Widget Pro";
const price = 49.99;
console.log(`${name} costs £${price.toFixed(2)}`);
```

```csharp
string name = "Widget Pro";
double price = 49.99;
Console.WriteLine($"{name} costs £{price:F2}");
```

```go
name := "Widget Pro"
price := 49.99
fmt.Printf("%s costs £%.2f\n", name, price)
// or build a string: s := fmt.Sprintf(...)
```

## Constants

Use constants for values that should never change after the program starts.

```python
MAX_PRICE = 999.99          # convention: ALL_CAPS
TAX_RATE = 0.20
```

```typescript
const MAX_PRICE = 999.99;
const TAX_RATE = 0.20;
```

```csharp
const double MaxPrice = 999.99;
const double TaxRate = 0.20;
```

```go
const MaxPrice = 999.99
const TaxRate = 0.20
// or group them:
const (
    MaxPrice = 999.99
    TaxRate  = 0.20
)
```

## Tasks

1. Declare variables for a product in all four languages: `name` (string), `price` (float), `category` (string), `inStock` (bool), `rating` (float). Print each with a formatted string that reads naturally: `Widget Pro [Electronics] £49.99 ★4.2`.

2. In TypeScript, declare the same variable with `let`, `const`, and no keyword. Observe what the compiler allows. Try assigning a new value to a `const` — read the error message.

3. In Go, declare a variable with `var x int` without assigning a value. Print it. What is the zero value? Find the zero values for `string`, `bool`, and `float64` by repeating this.

4. In Python, annotate your variables with type hints (`name: str = "Widget Pro"`) and run `mypy` on the file. Try assigning an integer to the name variable and see what mypy says vs what the runtime does.

5. In C#, declare price as `int` then assign `49.99`. Read the compiler error. Change it to `double`. What does implicit conversion mean in C#?

## Reference

- Python: [Variables and types](https://docs.python.org/3/tutorial/introduction.html)
- TypeScript: [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- C#: [Types](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/types/)
- Go: [A Tour of Go — Basics](https://go.dev/tour/basics)
