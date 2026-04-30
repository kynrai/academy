# Day 5 – Project: Typed Inventory System

## Today's Focus

Build a typed inventory system that brings together the week's concepts: the `Product` type, a list-backed store, map-based grouping, and a generic search function. Implement the same system in all four languages.

## Specification

```text
Inventory system operations:
  - add(product)              Add a product; error if name already exists
  - remove(name)              Remove by name; error if not found
  - get(name)                 Return product by name; error if not found
  - list_all()                Return all products sorted by name
  - search(query)             Return products whose name contains query (case-insensitive)
  - by_category()             Return map of category -> []Product
  - cheapest_per_category()   Return map of category -> cheapest Product
  - total_value()             Sum of all prices
```

## Python

```python
from dataclasses import dataclass
from typing import DefaultDict
from collections import defaultdict

@dataclass
class Product:
    name:     str
    price:    float
    category: str
    in_stock: bool = True

class Inventory:
    def __init__(self) -> None:
        self._store: dict[str, Product] = {}

    def add(self, product: Product) -> None:
        if product.name in self._store:
            raise ValueError(f"product already exists: {product.name!r}")
        self._store[product.name] = product

    def remove(self, name: str) -> None:
        if name not in self._store:
            raise KeyError(f"product not found: {name!r}")
        del self._store[name]

    def get(self, name: str) -> Product:
        if name not in self._store:
            raise KeyError(f"product not found: {name!r}")
        return self._store[name]

    def list_all(self) -> list[Product]:
        return sorted(self._store.values(), key=lambda p: p.name)

    def search(self, query: str) -> list[Product]:
        q = query.lower()
        return [p for p in self._store.values() if q in p.name.lower()]

    def by_category(self) -> dict[str, list[Product]]:
        groups: dict[str, list[Product]] = defaultdict(list)
        for p in self._store.values():
            groups[p.category].append(p)
        return dict(groups)

    def cheapest_per_category(self) -> dict[str, Product]:
        result: dict[str, Product] = {}
        for cat, products in self.by_category().items():
            result[cat] = min(products, key=lambda p: p.price)
        return result

    def total_value(self) -> float:
        return sum(p.price for p in self._store.values())


# Usage
inv = Inventory()
inv.add(Product("Laptop",   999.0, "Electronics"))
inv.add(Product("Notebook", 4.99,  "Books"))
inv.add(Product("Headset",  79.0,  "Electronics"))
inv.add(Product("Novel",    12.99, "Books"))
inv.add(Product("T-Shirt",  19.99, "Clothing"))

print(inv.total_value())
for cat, product in inv.cheapest_per_category().items():
    print(f"{cat}: {product.name} £{product.price:.2f}")
```

## TypeScript

```typescript
interface Product {
    name:     string;
    price:    number;
    category: string;
    inStock:  boolean;
}

class Inventory {
    private store = new Map<string, Product>();

    add(product: Product): void {
        if (this.store.has(product.name))
            throw new Error(`product already exists: "${product.name}"`);
        this.store.set(product.name, product);
    }

    remove(name: string): void {
        if (!this.store.has(name))
            throw new Error(`product not found: "${name}"`);
        this.store.delete(name);
    }

    get(name: string): Product {
        const p = this.store.get(name);
        if (!p) throw new Error(`product not found: "${name}"`);
        return p;
    }

    listAll(): Product[] {
        return [...this.store.values()].sort((a, b) => a.name.localeCompare(b.name));
    }

    search(query: string): Product[] {
        const q = query.toLowerCase();
        return [...this.store.values()].filter(p => p.name.toLowerCase().includes(q));
    }

    byCategory(): Record<string, Product[]> {
        const groups: Record<string, Product[]> = {};
        for (const p of this.store.values()) {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
        }
        return groups;
    }

    cheapestPerCategory(): Record<string, Product> {
        const result: Record<string, Product> = {};
        for (const [cat, products] of Object.entries(this.byCategory())) {
            result[cat] = products.reduce((a, b) => a.price < b.price ? a : b);
        }
        return result;
    }

    totalValue(): number {
        return [...this.store.values()].reduce((acc, p) => acc + p.price, 0);
    }
}
```

## C#

```csharp
record Product(string Name, double Price, string Category, bool InStock = true);

class Inventory
{
    private readonly Dictionary<string, Product> _store = new();

    public void Add(Product product)
    {
        if (_store.ContainsKey(product.Name))
            throw new ArgumentException($"product already exists: {product.Name}");
        _store[product.Name] = product;
    }

    public void Remove(string name)
    {
        if (!_store.Remove(name))
            throw new KeyNotFoundException($"product not found: {name}");
    }

    public Product Get(string name)
        => _store.TryGetValue(name, out var p)
            ? p
            : throw new KeyNotFoundException($"product not found: {name}");

    public IEnumerable<Product> ListAll()
        => _store.Values.OrderBy(p => p.Name);

    public IEnumerable<Product> Search(string query)
        => _store.Values.Where(p =>
            p.Name.Contains(query, StringComparison.OrdinalIgnoreCase));

    public Dictionary<string, List<Product>> ByCategory()
        => _store.Values
            .GroupBy(p => p.Category)
            .ToDictionary(g => g.Key, g => g.ToList());

    public Dictionary<string, Product> CheapestPerCategory()
        => _store.Values
            .GroupBy(p => p.Category)
            .ToDictionary(g => g.Key, g => g.MinBy(p => p.Price)!);

    public double TotalValue() => _store.Values.Sum(p => p.Price);
}
```

## Go

```go
package main

import (
    "errors"
    "fmt"
    "sort"
    "strings"
)

type Product struct {
    Name     string
    Price    float64
    Category string
    InStock  bool
}

type Inventory struct {
    store map[string]Product
}

func NewInventory() *Inventory {
    return &Inventory{store: make(map[string]Product)}
}

func (inv *Inventory) Add(p Product) error {
    if _, exists := inv.store[p.Name]; exists {
        return fmt.Errorf("product already exists: %q", p.Name)
    }
    inv.store[p.Name] = p
    return nil
}

func (inv *Inventory) Remove(name string) error {
    if _, exists := inv.store[name]; !exists {
        return fmt.Errorf("product not found: %q", name)
    }
    delete(inv.store, name)
    return nil
}

func (inv *Inventory) Get(name string) (Product, error) {
    p, ok := inv.store[name]
    if !ok {
        return Product{}, fmt.Errorf("product not found: %q", name)
    }
    return p, nil
}

func (inv *Inventory) ListAll() []Product {
    products := make([]Product, 0, len(inv.store))
    for _, p := range inv.store {
        products = append(products, p)
    }
    sort.Slice(products, func(i, j int) bool {
        return products[i].Name < products[j].Name
    })
    return products
}

func (inv *Inventory) Search(query string) []Product {
    q := strings.ToLower(query)
    var results []Product
    for _, p := range inv.store {
        if strings.Contains(strings.ToLower(p.Name), q) {
            results = append(results, p)
        }
    }
    return results
}

func (inv *Inventory) ByCategory() map[string][]Product {
    groups := make(map[string][]Product)
    for _, p := range inv.store {
        groups[p.Category] = append(groups[p.Category], p)
    }
    return groups
}

func (inv *Inventory) CheapestPerCategory() map[string]Product {
    result := make(map[string]Product)
    for cat, products := range inv.ByCategory() {
        cheapest := products[0]
        for _, p := range products[1:] {
            if p.Price < cheapest.Price {
                cheapest = p
            }
        }
        result[cat] = cheapest
    }
    return result
}

func (inv *Inventory) TotalValue() float64 {
    var total float64
    for _, p := range inv.store {
        total += p.Price
    }
    return total
}
```

## Tasks

1. Run each implementation and add 5 products. Call every method and print the results. Confirm the outputs match across all four languages.

2. Add an `update(name, changes)` method that replaces only the provided fields. In Go, use a struct with pointer fields to represent "optionally provided". In TypeScript, use `Partial<Product>`.

3. Try calling `remove("Nonexistent")` in each language. How does the error appear? What is the caller's responsibility in each language?

4. Add a `most_expensive(n: int)` method that returns the top N products by price. Use sorting in all four languages.

5. Write a test for `cheapest_per_category` in each language that asserts specific expected values for the 5-product dataset. Run the tests.

## Reference

- Week 6 Day 1–4 — you now have all the building blocks.
- Python: [dataclasses](https://docs.python.org/3/library/dataclasses.html)
- TypeScript: [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- Go: [Effective Go — data](https://go.dev/doc/effective_go#data)
