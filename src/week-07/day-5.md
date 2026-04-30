# Day 5 – Integration Project: Read, Process, Serve, Fetch

## Today's Focus

Connect everything from weeks 5, 6, and 7 into one end-to-end program. Each language implements the same pipeline:

```text
1. Load products.json from disk
2. Process: filter, discount, summarise
3. Serve the results over HTTP (/products, /stats)
4. Fetch from another language's server to verify interoperability
```

Pick one language as your primary server. Use another language to fetch from it.

## The /stats endpoint

This is the new endpoint. It runs the data processing pipeline and returns a summary.

```text
GET /stats
Response:
{
  "total_products": 5,
  "in_stock": 4,
  "total_value": 1115.97,
  "by_category": {
    "Electronics": { "count": 2, "avg_price": 539.0, "in_stock": 1 },
    "Books":        { "count": 2, "avg_price": 8.99,  "in_stock": 2 },
    "Clothing":     { "count": 1, "avg_price": 19.99, "in_stock": 1 }
  }
}
```

## Python reference implementation

This shows the complete integration. The other languages follow the same structure.

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from collections import defaultdict
import json, uvicorn

app = FastAPI()

class Product(BaseModel):
    name: str
    price: float
    category: str
    inStock: bool = True

class CategoryStats(BaseModel):
    count: int
    avg_price: float
    in_stock: int

class Stats(BaseModel):
    total_products: int
    in_stock: int
    total_value: float
    by_category: dict[str, CategoryStats]

def load() -> list[Product]:
    with open("products.json") as f:
        return [Product(**item) for item in json.load(f)]

products = load()

@app.get("/products")
def list_products(category: str | None = None) -> list[Product]:
    if category:
        return [p for p in products if p.category.lower() == category.lower()]
    return products

@app.get("/products/{name}")
def get_product(name: str) -> Product:
    for p in products:
        if p.name.lower() == name.lower():
            return p
    raise HTTPException(404, f"not found: {name}")

@app.get("/stats")
def stats() -> Stats:
    groups: dict[str, list[Product]] = defaultdict(list)
    for p in products:
        groups[p.category].append(p)

    by_category = {
        cat: CategoryStats(
            count=len(items),
            avg_price=round(sum(p.price for p in items) / len(items), 2),
            in_stock=sum(1 for p in items if p.inStock),
        )
        for cat, items in groups.items()
    }

    return Stats(
        total_products=len(products),
        in_stock=sum(1 for p in products if p.inStock),
        total_value=round(sum(p.price for p in products), 2),
        by_category=by_category,
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Go client that fetches from the Python server

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
)

type CategoryStats struct {
    Count    int     `json:"count"`
    AvgPrice float64 `json:"avg_price"`
    InStock  int     `json:"in_stock"`
}

type Stats struct {
    TotalProducts int                       `json:"total_products"`
    InStock       int                       `json:"in_stock"`
    TotalValue    float64                   `json:"total_value"`
    ByCategory    map[string]CategoryStats  `json:"by_category"`
}

func main() {
    resp, err := http.Get("http://localhost:8000/stats")
    if err != nil {
        log.Fatal(err)
    }
    defer resp.Body.Close()

    var stats Stats
    if err := json.NewDecoder(resp.Body).Decode(&stats); err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Total products: %d (%d in stock)\n", stats.TotalProducts, stats.InStock)
    fmt.Printf("Total value: £%.2f\n", stats.TotalValue)
    fmt.Println("\nBy category:")
    for cat, s := range stats.ByCategory {
        fmt.Printf("  %-15s %d items, avg £%.2f, %d in stock\n",
            cat, s.Count, s.AvgPrice, s.InStock)
    }
}
```

## TypeScript client

```typescript
interface CategoryStats {
    count: number; avg_price: number; in_stock: number;
}

interface Stats {
    total_products: number;
    in_stock: number;
    total_value: number;
    by_category: Record<string, CategoryStats>;
}

const stats = await fetch("http://localhost:8000/stats")
    .then(r => r.json() as Promise<Stats>);

console.log(`Total products: ${stats.total_products} (${stats.in_stock} in stock)`);
console.log(`Total value: £${stats.total_value.toFixed(2)}`);
console.log("\nBy category:");
for (const [cat, s] of Object.entries(stats.by_category)) {
    console.log(`  ${cat.padEnd(15)} ${s.count} items, avg £${s.avg_price.toFixed(2)}, ${s.in_stock} in stock`);
}
```

## What to build

Each student should:

1. **Start your primary server** (any language) with `/products`, `/products/{name}`, and `/stats` routes loaded from `products.json`.

2. **Write a client in a second language** that fetches `/stats` and prints a formatted report.

3. **Point the Week 3 CSR frontend** at your server's `/products` endpoint. It should display the product list without any changes to the frontend code.

4. **Add a new product** via `POST /products` and verify it appears in both `/products` and the updated `/stats` totals.

5. **Swap servers**: start a classmate's server (different language) and point your client at it. Confirm everything still works.

## Tasks

1. Implement the full server (with `/stats`) in your chosen language. Run it and verify all three endpoints with `curl`.

2. Write a client in a different language that fetches and prints the stats report.

3. Add POST support: accept a new product as JSON, validate it (non-empty name, positive price, known category), and append it to the in-memory list.

4. Make the stats endpoint dynamic: if you POST a new product, a subsequent GET `/stats` should reflect the change.

5. Write a short comparison: which language felt most natural for the server role? Which for the client? What would you choose for a production service and why?

## Reference

- Week 7 Day 1: file loading
- Week 7 Day 2: HTTP clients
- Week 7 Day 3: HTTP servers
- Week 7 Day 4: data processing
- Week 3: HTTP protocol, SSR, REST, CSR
