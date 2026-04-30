# Day 2 – Maps and Dictionaries

## Today's Focus

Store and retrieve data by key in all four languages. Maps (also called dictionaries, hash maps, or objects) are the second most-used collection after lists. Learn to create, read, update, delete, and iterate over them — then use them to group products by category.

## Creating maps

```python
# Python: dict
product = {
    "name":     "Laptop",
    "price":    999.0,
    "category": "Electronics",
    "in_stock": True,
}
```

```typescript
// TypeScript: object literal or Map<K, V>
const product: Record<string, unknown> = {
    name:     "Laptop",
    price:    999.0,
    category: "Electronics",
    inStock:  true,
};

// Map<K, V> for non-string keys or iteration order guarantees
const counts = new Map<string, number>();
```

```csharp
// C#: Dictionary<TKey, TValue>
var product = new Dictionary<string, object>
{
    ["name"]     = "Laptop",
    ["price"]    = 999.0,
    ["category"] = "Electronics",
    ["inStock"]  = true,
};
```

```go
// Go: map[KeyType]ValueType
product := map[string]any{
    "name":     "Laptop",
    "price":    999.0,
    "category": "Electronics",
    "inStock":  true,
}

// Create with make (starts empty)
counts := make(map[string]int)
```

## Reading and updating

```python
print(product["name"])            # Laptop
print(product.get("rating", 0))  # 0 — safe default if key missing

product["price"] = 849.0          # update
product["rating"] = 4.5           # add new key
del product["in_stock"]           # delete
```

```typescript
console.log(product["name"]);      // Laptop
console.log(product.name);         // same — dot notation works on objects

product["price"] = 849.0;
product.rating = 4.5;
delete product.inStock;
```

```csharp
Console.WriteLine(product["name"]);

// Safe read with TryGetValue
if (product.TryGetValue("rating", out object? rating))
    Console.WriteLine(rating);

product["price"] = 849.0;
product["rating"] = 4.5;
product.Remove("inStock");
```

```go
fmt.Println(product["name"])

// Comma-ok idiom: check if key exists
if val, ok := product["rating"]; ok {
    fmt.Println(val)
}

product["price"] = 849.0
product["rating"] = 4.5
delete(product, "inStock")
```

## Iterating over key-value pairs

```python
for key, value in product.items():
    print(f"{key}: {value}")

# Keys only
for key in product:
    print(key)
```

```typescript
for (const [key, value] of Object.entries(product)) {
    console.log(`${key}: ${value}`);
}

// Map iteration (Map preserves insertion order)
for (const [key, value] of counts) {
    console.log(`${key}: ${value}`);
}
```

```csharp
foreach (var (key, value) in product)
{
    Console.WriteLine($"{key}: {value}");
}
```

```go
for key, value := range product {
    fmt.Printf("%s: %v\n", key, value)
}
// Note: Go map iteration order is random on purpose
```

## Counting and grouping

A common pattern: count occurrences or group items into lists.

### Count products per category

```python
products = [
    {"name": "Laptop",   "category": "Electronics"},
    {"name": "Notebook", "category": "Books"},
    {"name": "Headset",  "category": "Electronics"},
    {"name": "Novel",    "category": "Books"},
    {"name": "T-Shirt",  "category": "Clothing"},
]

counts: dict[str, int] = {}
for p in products:
    category = p["category"]
    counts[category] = counts.get(category, 0) + 1

# {"Electronics": 2, "Books": 2, "Clothing": 1}
```

```typescript
const counts: Record<string, number> = {};
for (const p of products) {
    counts[p.category] = (counts[p.category] ?? 0) + 1;
}
```

```csharp
var counts = new Dictionary<string, int>();
foreach (var p in products)
{
    counts.TryGetValue(p.Category, out int current);
    counts[p.Category] = current + 1;
    // or with LINQ: products.GroupBy(p => p.Category)
    //                       .ToDictionary(g => g.Key, g => g.Count())
}
```

```go
counts := make(map[string]int)
for _, p := range products {
    counts[p.Category]++    // zero value of int is 0, so this is safe
}
```

### Group names by category

```python
from collections import defaultdict

groups: dict[str, list[str]] = defaultdict(list)
for p in products:
    groups[p["category"]].append(p["name"])
```

```typescript
const groups: Record<string, string[]> = {};
for (const p of products) {
    if (!groups[p.category]) groups[p.category] = [];
    groups[p.category].push(p.name);
}
```

```csharp
var groups = new Dictionary<string, List<string>>();
foreach (var p in products)
{
    if (!groups.ContainsKey(p.Category))
        groups[p.Category] = new List<string>();
    groups[p.Category].Add(p.Name);
}
```

```go
groups := make(map[string][]string)
for _, p := range products {
    groups[p.Category] = append(groups[p.Category], p.Name)
}
```

## Tasks

1. Build a `price_by_name` map from the product list (name → price) in all four languages. Look up the price of `"Headset"` using the safe-default method.

2. In Go, attempt to read from a nil map (`var m map[string]int`). What happens? Then attempt to write to it. What happens? Why does Go distinguish nil maps from empty maps?

3. Write `most_per_category(products)` that returns the name of the most expensive product in each category. The result is a `map[string]string` (category → product name). Implement in all four languages.

4. In TypeScript, compare a plain object (`{}`) with a `Map<string, number>`. When would you prefer `Map`? Try using a number as a key in both.

5. In Python, use `collections.Counter` to count categories in one line. Compare its brevity to the manual loop approach.

## Reference

- Python: [dict](https://docs.python.org/3/tutorial/datastructures.html#dictionaries) and [collections.defaultdict](https://docs.python.org/3/library/collections.html#collections.defaultdict)
- TypeScript: [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- C#: [Dictionary<TKey,TValue>](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.dictionary-2)
- Go: [Maps](https://go.dev/blog/maps)
