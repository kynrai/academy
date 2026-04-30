# Day 1 – File I/O and JSON

## Today's Focus

Read and write files in all four languages. Serialise the product inventory to JSON and reload it. This is how most real programs persist data between runs.

## The data file

Create `products.json` once. All four programs load from the same file.

```json
[
  { "name": "Laptop",   "price": 999.0,  "category": "Electronics", "inStock": true },
  { "name": "Notebook", "price": 4.99,   "category": "Books",       "inStock": true },
  { "name": "Headset",  "price": 79.0,   "category": "Electronics", "inStock": false },
  { "name": "Novel",    "price": 12.99,  "category": "Books",       "inStock": true },
  { "name": "T-Shirt",  "price": 19.99,  "category": "Clothing",    "inStock": true }
]
```

## Reading text files

```python
# Read entire file as string
with open("products.json", "r", encoding="utf-8") as f:
    content = f.read()

# Read line by line
with open("notes.txt", "r") as f:
    for line in f:
        print(line.rstrip())
```

```typescript
import { readFileSync, readFile } from "fs";
import { promises as fs } from "fs";

// Synchronous
const content = readFileSync("products.json", "utf-8");

// Async (preferred in real code)
const contentAsync = await fs.readFile("products.json", "utf-8");
```

```csharp
// Synchronous
string content = File.ReadAllText("products.json");

// Read all lines
string[] lines = File.ReadAllLines("notes.txt");

// Async
string contentAsync = await File.ReadAllTextAsync("products.json");
```

```go
import "os"

// Read entire file as bytes, convert to string
data, err := os.ReadFile("products.json")
if err != nil {
    log.Fatal(err)
}
content := string(data)
```

## Writing text files

```python
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("line one\n")
    f.write("line two\n")

# Append mode
with open("log.txt", "a") as f:
    f.write("new entry\n")
```

```typescript
import { writeFileSync } from "fs";

writeFileSync("output.txt", "line one\nline two\n", "utf-8");
// or: await fs.writeFile("output.txt", "...")
```

```csharp
File.WriteAllText("output.txt", "line one\nline two\n");
await File.WriteAllTextAsync("output.txt", "...");
```

```go
err := os.WriteFile("output.txt", []byte("line one\nline two\n"), 0644)
if err != nil {
    log.Fatal(err)
}
```

## JSON serialisation

Convert between a file (string) and in-memory typed structures.

### Load products from JSON

```python
import json

with open("products.json") as f:
    data = json.load(f)             # list of dicts

# Deserialise into typed dataclasses
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    category: str
    inStock: bool

products = [Product(**item) for item in data]
```

```typescript
import { readFileSync } from "fs";

interface Product {
    name: string; price: number; category: string; inStock: boolean;
}

const raw = readFileSync("products.json", "utf-8");
const products: Product[] = JSON.parse(raw);
```

```csharp
using System.Text.Json;

record Product(string Name, double Price, string Category, bool InStock);

string json = File.ReadAllText("products.json");
var products = JsonSerializer.Deserialize<List<Product>>(json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
```

```go
import (
    "encoding/json"
    "os"
)

type Product struct {
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    Category string  `json:"category"`
    InStock  bool    `json:"inStock"`
}

data, _ := os.ReadFile("products.json")
var products []Product
if err := json.Unmarshal(data, &products); err != nil {
    log.Fatal(err)
}
```

### Save products to JSON

```python
import json

with open("products.json", "w") as f:
    json.dump([vars(p) for p in products], f, indent=2)
```

```typescript
import { writeFileSync } from "fs";

writeFileSync("products.json", JSON.stringify(products, null, 2));
```

```csharp
string json = JsonSerializer.Serialize(products,
    new JsonSerializerOptions { WriteIndented = true });
File.WriteAllText("products.json", json);
```

```go
data, err := json.MarshalIndent(products, "", "  ")
if err != nil {
    log.Fatal(err)
}
os.WriteFile("products.json", data, 0644)
```

## Tasks

1. Load `products.json` in all four languages and print the name and price of each product in the format `Laptop: £999.00`.

2. Add a new product to the in-memory list, then save the updated list back to `products.json`. Reload and verify the new product appears.

3. Write a function `load_products(path)` that handles: file not found, invalid JSON, and missing required fields. Return an empty list with a warning on any error. Implement in all four languages.

4. In Go, use struct tags (`json:"name"`) to control how field names map between Go (`InStock`) and JSON (`inStock`). What happens if you omit the tags?

5. Write a program that reads `products.json`, filters to in-stock products only, and writes the result to `in_stock.json`. Run it and verify the output file.

## Reference

- Python: [json module](https://docs.python.org/3/library/json.html)
- TypeScript: [Node.js fs promises](https://nodejs.org/api/fs.html#promises-api)
- C#: [System.Text.Json](https://learn.microsoft.com/en-us/dotnet/standard/serialization/system-text-json/overview)
- Go: [encoding/json](https://pkg.go.dev/encoding/json)
