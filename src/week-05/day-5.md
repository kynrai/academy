# Day 5 – Project: CLI Utility in All Four Languages

## Today's Focus

Build the same command-line tool in Python, TypeScript, C#, and Go. It takes a product name, price, and category as arguments, validates the input, calculates a discounted price, and prints a formatted summary.

Every concept from this week — variables, conditionals, loops, functions, error handling — appears in this program.

## Specification

```text
Usage:
  price-calc <name> <price> <category>

Arguments:
  name      Product name (non-empty string)
  price     Price in pounds (positive number)
  category  One of: Electronics, Books, Clothing, Food, Other

Behaviour:
  - Electronics: 10% discount
  - Books: 5% discount
  - Clothing: 15% discount
  - Food: 0% discount
  - Other: 0% discount
  - Print: "Widget Pro [Electronics]: £99.99 → £89.99 (10% off)"
  - Exit 1 with a message if any argument is invalid
```

## Python

```python
#!/usr/bin/env python3
import sys

DISCOUNTS: dict[str, float] = {
    "Electronics": 0.10,
    "Books":       0.05,
    "Clothing":    0.15,
    "Food":        0.00,
    "Other":       0.00,
}

def validate_args(args: list[str]) -> tuple[str, float, str]:
    if len(args) != 3:
        raise ValueError("usage: price-calc <name> <price> <category>")

    name, price_str, category = args
    if not name.strip():
        raise ValueError("name cannot be empty")

    try:
        price = float(price_str)
    except ValueError:
        raise ValueError(f"price must be a number, got: {price_str!r}")

    if price <= 0:
        raise ValueError(f"price must be positive, got: {price}")

    if category not in DISCOUNTS:
        valid = ", ".join(DISCOUNTS.keys())
        raise ValueError(f"unknown category {category!r}. Valid: {valid}")

    return name, price, category

def calculate(name: str, price: float, category: str) -> str:
    discount = DISCOUNTS[category]
    final = price * (1 - discount)
    pct = int(discount * 100)
    if pct > 0:
        return f"{name} [{category}]: £{price:.2f} → £{final:.2f} ({pct}% off)"
    return f"{name} [{category}]: £{price:.2f}"

def main() -> None:
    try:
        name, price, category = validate_args(sys.argv[1:])
        print(calculate(name, price, category))
    except ValueError as e:
        print(f"error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
```

Run: `python price_calc.py "Widget Pro" 99.99 Electronics`

## TypeScript

```typescript
const DISCOUNTS: Record<string, number> = {
    Electronics: 0.10,
    Books:       0.05,
    Clothing:    0.15,
    Food:        0.00,
    Other:       0.00,
};

function validateArgs(args: string[]): [string, number, string] {
    if (args.length !== 3) {
        throw new Error("usage: price-calc <name> <price> <category>");
    }
    const [name, priceStr, category] = args;

    if (!name.trim()) throw new Error("name cannot be empty");

    const price = parseFloat(priceStr);
    if (isNaN(price)) throw new Error(`price must be a number, got: "${priceStr}"`);
    if (price <= 0) throw new Error(`price must be positive, got: ${price}`);

    if (!(category in DISCOUNTS)) {
        throw new Error(`unknown category "${category}". Valid: ${Object.keys(DISCOUNTS).join(", ")}`);
    }
    return [name, price, category];
}

function calculate(name: string, price: number, category: string): string {
    const discount = DISCOUNTS[category];
    const final = price * (1 - discount);
    const pct = Math.round(discount * 100);
    return pct > 0
        ? `${name} [${category}]: £${price.toFixed(2)} → £${final.toFixed(2)} (${pct}% off)`
        : `${name} [${category}]: £${price.toFixed(2)}`;
}

const args = process.argv.slice(2);
try {
    const [name, price, category] = validateArgs(args);
    console.log(calculate(name, price, category));
} catch (err) {
    console.error(`error: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
}
```

Run: `npx ts-node price-calc.ts "Widget Pro" 99.99 Electronics`

## C#

```csharp
using System;
using System.Collections.Generic;

var discounts = new Dictionary<string, double>
{
    ["Electronics"] = 0.10,
    ["Books"]       = 0.05,
    ["Clothing"]    = 0.15,
    ["Food"]        = 0.00,
    ["Other"]       = 0.00,
};

if (args.Length != 3)
{
    Console.Error.WriteLine("usage: price-calc <name> <price> <category>");
    Environment.Exit(1);
}

string name = args[0];
string priceStr = args[1];
string category = args[2];

if (string.IsNullOrWhiteSpace(name))
{
    Console.Error.WriteLine("error: name cannot be empty");
    Environment.Exit(1);
}

if (!double.TryParse(priceStr, out double price) || price <= 0)
{
    Console.Error.WriteLine($"error: price must be a positive number, got: {priceStr}");
    Environment.Exit(1);
}

if (!discounts.ContainsKey(category))
{
    string valid = string.Join(", ", discounts.Keys);
    Console.Error.WriteLine($"error: unknown category \"{category}\". Valid: {valid}");
    Environment.Exit(1);
}

double discount = discounts[category];
double final = price * (1 - discount);
int pct = (int)(discount * 100);

string output = pct > 0
    ? $"{name} [{category}]: £{price:F2} → £{final:F2} ({pct}% off)"
    : $"{name} [{category}]: £{price:F2}";

Console.WriteLine(output);
```

Run: `dotnet run -- "Widget Pro" 99.99 Electronics`

## Go

```go
package main

import (
    "fmt"
    "math"
    "os"
    "strconv"
    "strings"
)

var discounts = map[string]float64{
    "Electronics": 0.10,
    "Books":       0.05,
    "Clothing":    0.15,
    "Food":        0.00,
    "Other":       0.00,
}

func validate(args []string) (name string, price float64, category string, err error) {
    if len(args) != 3 {
        return "", 0, "", fmt.Errorf("usage: price-calc <name> <price> <category>")
    }
    name, priceStr, category := args[0], args[1], args[2]

    if strings.TrimSpace(name) == "" {
        return "", 0, "", fmt.Errorf("name cannot be empty")
    }

    price, parseErr := strconv.ParseFloat(priceStr, 64)
    if parseErr != nil || price <= 0 {
        return "", 0, "", fmt.Errorf("price must be a positive number, got: %q", priceStr)
    }

    if _, ok := discounts[category]; !ok {
        keys := make([]string, 0, len(discounts))
        for k := range discounts {
            keys = append(keys, k)
        }
        return "", 0, "", fmt.Errorf("unknown category %q. Valid: %s", category, strings.Join(keys, ", "))
    }
    return name, price, category, nil
}

func calculate(name string, price float64, category string) string {
    discount := discounts[category]
    final := price * (1 - discount)
    pct := int(math.Round(discount * 100))
    if pct > 0 {
        return fmt.Sprintf("%s [%s]: £%.2f → £%.2f (%d%% off)", name, category, price, final, pct)
    }
    return fmt.Sprintf("%s [%s]: £%.2f", name, category, price)
}

func main() {
    name, price, category, err := validate(os.Args[1:])
    if err != nil {
        fmt.Fprintf(os.Stderr, "error: %v\n", err)
        os.Exit(1)
    }
    fmt.Println(calculate(name, price, category))
}
```

Run: `go run . "Widget Pro" 99.99 Electronics`

## What to observe

Run each program with:

- Valid input: `"Widget Pro" 99.99 Electronics`
- Missing argument: `"Widget Pro" 99.99`
- Bad price: `"Widget Pro" abc Electronics`
- Negative price: `"Widget Pro" -5 Electronics`
- Unknown category: `"Widget Pro" 99.99 Gadgets`

Observe how each language reports the error. Check the exit code with `echo $?` after each run.

## Tasks

1. Add a `--verbose` flag to each program that prints a breakdown: original price, discount percentage, savings amount, and final price on separate lines.

2. Add a `--list-categories` flag that prints the available categories and their discount rates, then exits with code 0.

3. In Python, add a `--currency` option that accepts `GBP`, `USD`, or `EUR` and uses the appropriate symbol.

4. Compare the Go error-handling style with the Python/TypeScript/C# style. In the validation function, count how many times you write `if err != nil` in Go vs `throw` in the others. Which do you find clearer?

5. In all four languages, add a unit test (or a simple test script) that calls `calculate()` directly and asserts the output for known inputs.
