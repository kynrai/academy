# Day 4 – Data Processing Pipelines

## Today's Focus

Chain filtering, transformation, and aggregation steps into a clean pipeline. Process the product dataset and a CSV file using each language's preferred style. Learn when a loop is clearer than a functional chain.

## The pipeline pattern

A pipeline takes raw data and moves it through steps, each step producing output for the next:

```text
raw data → filter → transform → aggregate → output
```

Applied to products: load all → keep in-stock → apply discount → total price.

## Filter → Map → Reduce

```python
products = load_products()  # list of Product dataclasses

# Filter: in-stock only
available = [p for p in products if p.inStock]

# Map: apply 10% discount
discounted = [
    Product(p.name, round(p.price * 0.9, 2), p.category, p.inStock)
    for p in available
]

# Reduce: total cost
total = sum(p.price for p in discounted)
print(f"Total after discount: £{total:.2f}")
```

```typescript
const total = products
    .filter(p => p.inStock)
    .map(p => ({ ...p, price: Math.round(p.price * 0.9 * 100) / 100 }))
    .reduce((acc, p) => acc + p.price, 0);

console.log(`Total after discount: £${total.toFixed(2)}`);
```

```csharp
double total = products
    .Where(p => p.InStock)
    .Select(p => p with { Price = Math.Round(p.Price * 0.9, 2) })
    .Sum(p => p.Price);

Console.WriteLine($"Total after discount: £{total:F2}");
```

```go
var total float64
for _, p := range products {
    if !p.InStock {
        continue
    }
    discounted := math.Round(p.Price*0.9*100) / 100
    total += discounted
}
fmt.Printf("Total after discount: £%.2f\n", total)
```

## Grouping and summarising

```python
from collections import defaultdict

# Group by category, then summarise
by_category: dict[str, list[Product]] = defaultdict(list)
for p in products:
    by_category[p.category].append(p)

summary = {
    cat: {
        "count": len(items),
        "total": round(sum(p.price for p in items), 2),
        "avg":   round(sum(p.price for p in items) / len(items), 2),
    }
    for cat, items in by_category.items()
}
```

```typescript
type Summary = { count: number; total: number; avg: number };

const summary = products.reduce<Record<string, Summary>>((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, total: 0, avg: 0 };
    acc[p.category].count++;
    acc[p.category].total += p.price;
    acc[p.category].avg = acc[p.category].total / acc[p.category].count;
    return acc;
}, {});
```

```csharp
var summary = products
    .GroupBy(p => p.Category)
    .Select(g => new {
        Category = g.Key,
        Count    = g.Count(),
        Total    = Math.Round(g.Sum(p => p.Price), 2),
        Avg      = Math.Round(g.Average(p => p.Price), 2),
    });
```

```go
type Summary struct {
    Count int
    Total float64
    Avg   float64
}

groups := make(map[string][]Product)
for _, p := range products {
    groups[p.Category] = append(groups[p.Category], p)
}

summary := make(map[string]Summary)
for cat, items := range groups {
    var total float64
    for _, p := range items {
        total += p.Price
    }
    summary[cat] = Summary{
        Count: len(items),
        Total: math.Round(total*100) / 100,
        Avg:   math.Round(total/float64(len(items))*100) / 100,
    }
}
```

## Sorting pipelines

Sort by multiple criteria (primary: category, secondary: price within category).

```python
sorted_products = sorted(
    products,
    key=lambda p: (p.category, p.price)
)
```

```typescript
const sorted = [...products].sort((a, b) =>
    a.category !== b.category
        ? a.category.localeCompare(b.category)
        : a.price - b.price
);
```

```csharp
var sorted = products
    .OrderBy(p => p.Category)
    .ThenBy(p => p.Price)
    .ToList();
```

```go
sort.Slice(products, func(i, j int) bool {
    if products[i].Category != products[j].Category {
        return products[i].Category < products[j].Category
    }
    return products[i].Price < products[j].Price
})
```

## CSV processing

Load a simple CSV file and build products from it.

```text
name,price,category,inStock
Laptop,999.0,Electronics,true
Notebook,4.99,Books,true
Headset,79.0,Electronics,false
```

```python
import csv

def load_csv(path: str) -> list[Product]:
    products = []
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                products.append(Product(
                    name=row["name"],
                    price=float(row["price"]),
                    category=row["category"],
                    inStock=row["inStock"].lower() == "true",
                ))
            except (KeyError, ValueError) as e:
                print(f"skipping bad row {row}: {e}")
    return products
```

```typescript
import { readFileSync } from "fs";

function loadCsv(path: string): Product[] {
    const lines = readFileSync(path, "utf-8").trim().split("\n");
    const headers = lines[0].split(",");
    return lines.slice(1).flatMap(line => {
        const values = line.split(",");
        const row = Object.fromEntries(headers.map((h, i) => [h, values[i]]));
        try {
            return [{ name: row.name, price: parseFloat(row.price),
                      category: row.category, inStock: row.inStock === "true" }];
        } catch {
            return [];
        }
    });
}
```

## Tasks

1. Write the full filter → map → reduce pipeline in all four languages. Print the total discounted value of all in-stock products.

2. Produce a category summary (count, total, average price) in all four languages. Print the results in a formatted table.

3. Sort the products by price descending, then print a numbered leaderboard.

4. In Python, rewrite the pipeline using `itertools.chain`, `filter`, and `map` (built-in functions) instead of list comprehensions. Compare readability.

5. Load the products from `products.csv` (create it from the sample above). Write a pipeline that filters bad rows, transforms the data, and produces the same summary as your JSON-based pipeline.

## Reference

- Python: [functools](https://docs.python.org/3/library/functools.html) and [itertools](https://docs.python.org/3/library/itertools.html)
- TypeScript: [Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- C#: [LINQ](https://learn.microsoft.com/en-us/dotnet/csharp/linq/standard-query-operators/)
- Go: [sort package](https://pkg.go.dev/sort)
