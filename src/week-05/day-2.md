# Day 2 – Conditionals and Pattern Matching

## Today's Focus

Write conditional logic in all four languages using the same problem: categorise a product and apply a discount. Learn how each language's `if`, `switch`, and match expressions differ.

## if / else if / else

The most basic form works the same way everywhere.

```python
price = 75.0

if price > 100:
    tier = "premium"
elif price > 50:
    tier = "standard"
else:
    tier = "budget"

print(tier)  # standard
```

```typescript
const price = 75.0;

let tier: string;
if (price > 100) {
    tier = "premium";
} else if (price > 50) {
    tier = "standard";
} else {
    tier = "budget";
}

console.log(tier);
```

```csharp
double price = 75.0;

string tier;
if (price > 100)
    tier = "premium";
else if (price > 50)
    tier = "standard";
else
    tier = "budget";

Console.WriteLine(tier);
```

```go
price := 75.0

var tier string
if price > 100 {
    tier = "premium"
} else if price > 50 {
    tier = "standard"
} else {
    tier = "budget"
}

fmt.Println(tier)
```

## switch and match

Switch statements test a single value against many cases. The syntax differs significantly between languages.

### Discount by category

```python
category = "Electronics"

# Python 3.10+: match-case
match category:
    case "Electronics":
        discount = 0.10
    case "Books":
        discount = 0.05
    case "Clothing":
        discount = 0.15
    case _:
        discount = 0.0
```

```typescript
const category = "Electronics";

// TypeScript: switch (falls through unless break is used)
let discount: number;
switch (category) {
    case "Electronics":
        discount = 0.10;
        break;
    case "Books":
        discount = 0.05;
        break;
    case "Clothing":
        discount = 0.15;
        break;
    default:
        discount = 0.0;
}
```

```csharp
string category = "Electronics";

// C# switch expression (returns a value directly)
double discount = category switch
{
    "Electronics" => 0.10,
    "Books"       => 0.05,
    "Clothing"    => 0.15,
    _             => 0.0,
};
```

```go
category := "Electronics"

// Go: switch without fallthrough by default
var discount float64
switch category {
case "Electronics":
    discount = 0.10
case "Books":
    discount = 0.05
case "Clothing":
    discount = 0.15
default:
    discount = 0.0
}
```

## Combining conditions

Boolean operators and compound conditions work consistently.

```python
price = 75.0
in_stock = True

if price < 100 and in_stock:
    print("affordable and available")

if not in_stock or price > 500:
    print("skip this one")
```

```typescript
const price = 75.0;
const inStock = true;

if (price < 100 && inStock) {
    console.log("affordable and available");
}

if (!inStock || price > 500) {
    console.log("skip this one");
}
```

```csharp
double price = 75.0;
bool inStock = true;

if (price < 100 && inStock)
    Console.WriteLine("affordable and available");

if (!inStock || price > 500)
    Console.WriteLine("skip this one");
```

```go
price := 75.0
inStock := true

if price < 100 && inStock {
    fmt.Println("affordable and available")
}

if !inStock || price > 500 {
    fmt.Println("skip this one")
}
```

## Null / nil / None checks

Every language has a concept of "no value". The name and behaviour differs.

| Language   | No-value keyword | Equality check                   |
| ---------- | ---------------- | -------------------------------- |
| Python     | `None`           | `if x is None:`                  |
| TypeScript | `null`/`undefined` | `if (x == null):` (covers both) |
| C#         | `null`           | `if (x is null)` or `x == null` |
| Go         | `nil`            | `if x == nil` (pointers/slices) |

## Tasks

1. Write a `price_label(price)` function in all four languages that returns `"cheap"`, `"mid-range"`, or `"expensive"` based on thresholds you choose. Call it with five different prices and print the results.

2. In Python, rewrite your category discount logic using `match-case`. Add a guard: `case "Electronics" if price > 200: discount = 0.20`. What does the guard do?

3. In C#, rewrite the tier classification using a switch expression that returns the `tier` string directly (assign it with `var tier = price switch { ... }`). Compare readability to the if/else version.

4. In Go, write a switch with multiple cases on one line: `case "Books", "Magazines": discount = 0.05`. Test it works.

5. In TypeScript, try using a switch without `break` and add a second `case` below it. What happens? What is "fall-through" and why is it considered dangerous?

## Reference

- Python: [match statement](https://docs.python.org/3/reference/compound_stmts.html#match)
- TypeScript: [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- C#: [switch expression](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/operators/switch-expression)
- Go: [switch](https://go.dev/tour/flowcontrol/9)
