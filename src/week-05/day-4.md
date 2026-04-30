# Day 4 – Functions and Error Handling

## Today's Focus

Write reusable functions in all four languages. Learn how each language handles errors — Python, TypeScript, and C# use exceptions; Go uses error return values. Both approaches are valid but require different habits.

## Defining functions

```python
def apply_discount(price: float, discount: float) -> float:
    return price * (1 - discount)

result = apply_discount(99.99, 0.10)
print(result)  # 89.991
```

```typescript
function applyDiscount(price: number, discount: number): number {
    return price * (1 - discount);
}

const result = applyDiscount(99.99, 0.10);
console.log(result);
```

```csharp
static double ApplyDiscount(double price, double discount)
{
    return price * (1 - discount);
}

double result = ApplyDiscount(99.99, 0.10);
Console.WriteLine(result);
```

```go
func applyDiscount(price, discount float64) float64 {
    return price * (1 - discount)
}

result := applyDiscount(99.99, 0.10)
fmt.Println(result)
```

## Default parameter values

```python
def price_label(price: float, currency: str = "£") -> str:
    return f"{currency}{price:.2f}"

print(price_label(9.99))         # £9.99
print(price_label(9.99, "$"))    # $9.99
```

```typescript
function priceLabel(price: number, currency = "£"): string {
    return `${currency}${price.toFixed(2)}`;
}
```

```csharp
static string PriceLabel(double price, string currency = "£")
{
    return $"{currency}{price:F2}";
}
```

```go
// Go has no default parameters; use a helper or struct options instead
func priceLabel(price float64, currency string) string {
    return fmt.Sprintf("%s%.2f", currency, price)
}

// Caller provides the default explicitly
priceLabel(9.99, "£")
```

## Multiple return values

Go returns multiple values natively. Python uses tuples. TypeScript and C# return a single value (use an object or tuple type).

```python
def parse_price(text: str) -> tuple[float, str]:
    text = text.strip()
    if text.startswith("£"):
        return float(text[1:]), "GBP"
    if text.startswith("$"):
        return float(text[1:]), "USD"
    return float(text), "UNKNOWN"

amount, currency = parse_price("£9.99")
```

```typescript
function parsePrice(text: string): [number, string] {
    text = text.trim();
    if (text.startsWith("£")) return [parseFloat(text.slice(1)), "GBP"];
    if (text.startsWith("$")) return [parseFloat(text.slice(1)), "USD"];
    return [parseFloat(text), "UNKNOWN"];
}

const [amount, currency] = parsePrice("£9.99");
```

```csharp
static (double Amount, string Currency) ParsePrice(string text)
{
    text = text.Trim();
    if (text.StartsWith("£")) return (double.Parse(text[1..]), "GBP");
    if (text.StartsWith("$")) return (double.Parse(text[1..]), "USD");
    return (double.Parse(text), "UNKNOWN");
}

var (amount, currency) = ParsePrice("£9.99");
```

```go
func parsePrice(text string) (float64, string) {
    text = strings.TrimSpace(text)
    if strings.HasPrefix(text, "£") {
        val, _ := strconv.ParseFloat(text[len("£"):], 64)
        return val, "GBP"
    }
    if strings.HasPrefix(text, "$") {
        val, _ := strconv.ParseFloat(text[1:], 64)
        return val, "USD"
    }
    val, _ := strconv.ParseFloat(text, 64)
    return val, "UNKNOWN"
}

amount, currency := parsePrice("£9.99")
```

## Error handling

This is where the languages diverge most.

### Exception-based (Python, TypeScript, C#)

```python
def load_price(text: str) -> float:
    try:
        value = float(text)
        if value < 0:
            raise ValueError(f"price cannot be negative: {value}")
        return value
    except ValueError as e:
        print(f"invalid price: {e}")
        raise

try:
    price = load_price("abc")
except ValueError:
    price = 0.0
```

```typescript
function loadPrice(text: string): number {
    const value = parseFloat(text);
    if (isNaN(value)) throw new Error(`not a number: "${text}"`);
    if (value < 0) throw new Error(`price cannot be negative: ${value}`);
    return value;
}

try {
    const price = loadPrice("abc");
} catch (err) {
    console.error(err instanceof Error ? err.message : err);
}
```

```csharp
static double LoadPrice(string text)
{
    if (!double.TryParse(text, out double value))
        throw new FormatException($"not a number: \"{text}\"");
    if (value < 0)
        throw new ArgumentException($"price cannot be negative: {value}");
    return value;
}

try
{
    double price = LoadPrice("abc");
}
catch (FormatException ex)
{
    Console.WriteLine(ex.Message);
}
```

### Error values (Go)

```go
import (
    "errors"
    "fmt"
    "strconv"
)

func loadPrice(text string) (float64, error) {
    value, err := strconv.ParseFloat(text, 64)
    if err != nil {
        return 0, fmt.Errorf("not a number %q: %w", text, err)
    }
    if value < 0 {
        return 0, errors.New("price cannot be negative")
    }
    return value, nil
}

price, err := loadPrice("abc")
if err != nil {
    fmt.Println("error:", err)
    price = 0
}
```

### Key difference

| Aspect            | Exceptions (Python/TS/C#)           | Error values (Go)                |
| ----------------- | ----------------------------------- | -------------------------------- |
| Error propagation | Automatic up the call stack         | Must be checked at each call     |
| Ignored errors    | Silent unless caught                | Compiler warns on unused returns |
| Control flow      | Non-local jump                      | Explicit if err != nil           |
| Custom errors     | Subclass Exception / extend Error   | Implement the error interface    |

## Tasks

1. Write `calculate_total(prices: list, tax_rate: float) -> float` in all four languages. It should sum the prices and add tax. Return `0.0` (not an error) if the list is empty.

2. Add input validation: raise/throw an error if any price in the list is negative. In Go, return the error from the function. In the others, throw an exception.

3. In Python, write a `@retry` decorator that wraps a function and retries it up to 3 times if it raises a `ValueError`. Test it with a function that fails randomly.

4. In TypeScript, create a `Result<T>` type with `{ ok: true; value: T } | { ok: false; error: string }`. Rewrite `loadPrice` to return `Result<number>` instead of throwing. Compare how callers look with `try/catch` versus with the Result type.

5. In Go, use `fmt.Errorf` with `%w` to wrap an error, then use `errors.Is` and `errors.As` to inspect the wrapped error. What is error wrapping for?

## Reference

- Python: [Errors and exceptions](https://docs.python.org/3/tutorial/errors.html)
- TypeScript: [Error handling patterns](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- C#: [Exception handling](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/exceptions/)
- Go: [Error handling](https://go.dev/blog/error-handling-and-go)
