# Day 3 – HTTP Servers: Routing and Responses

## Today's Focus

Build a small HTTP server in all four languages that serves the product inventory as JSON. The server loads products from `products.json` (Day 1) and exposes two routes: list all and get by name.

You built these same servers in Week 3 — now you understand the types, structs, and data loading behind them.

## Routes to implement

```text
GET  /products         → JSON array of all products
GET  /products/{name}  → JSON object for one product, 404 if not found
POST /products         → Add a product from the request body, 201 on success
```

## Python (FastAPI)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json

app = FastAPI()

class Product(BaseModel):
    name: str
    price: float
    category: str
    inStock: bool = True

def load_products() -> list[Product]:
    with open("products.json") as f:
        return [Product(**item) for item in json.load(f)]

products: list[Product] = load_products()

@app.get("/products")
def list_products() -> list[Product]:
    return products

@app.get("/products/{name}")
def get_product(name: str) -> Product:
    for p in products:
        if p.name.lower() == name.lower():
            return p
    raise HTTPException(status_code=404, detail=f"product not found: {name}")

@app.post("/products", status_code=201)
def add_product(product: Product) -> Product:
    for p in products:
        if p.name.lower() == product.name.lower():
            raise HTTPException(status_code=409, detail="product already exists")
    products.append(product)
    return product
```

Run: `uvicorn main:app --reload --port 8000`

## TypeScript (Express)

```typescript
import express, { Request, Response } from "express";
import { readFileSync } from "fs";

interface Product {
    name: string; price: number; category: string; inStock: boolean;
}

const app = express();
app.use(express.json());

const products: Product[] = JSON.parse(readFileSync("products.json", "utf-8"));

app.get("/products", (_req: Request, res: Response) => {
    res.json(products);
});

app.get("/products/:name", (req: Request, res: Response) => {
    const product = products.find(
        p => p.name.toLowerCase() === req.params.name.toLowerCase()
    );
    if (!product) {
        res.status(404).json({ error: `product not found: ${req.params.name}` });
        return;
    }
    res.json(product);
});

app.post("/products", (req: Request, res: Response) => {
    const body = req.body as Product;
    const exists = products.some(
        p => p.name.toLowerCase() === body.name.toLowerCase()
    );
    if (exists) {
        res.status(409).json({ error: "product already exists" });
        return;
    }
    products.push(body);
    res.status(201).json(body);
});

app.listen(3000, () => console.log("listening on :3000"));
```

Run: `npx ts-node server.ts`

## C# (ASP.NET Core minimal API)

```csharp
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

record Product(string Name, double Price, string Category, bool InStock = true);

var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
var json = File.ReadAllText("products.json");
var products = JsonSerializer.Deserialize<List<Product>>(json, options)!;

app.MapGet("/products", () => Results.Ok(products));

app.MapGet("/products/{name}", (string name) =>
{
    var product = products.FirstOrDefault(
        p => p.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
    return product is null
        ? Results.NotFound(new { error = $"product not found: {name}" })
        : Results.Ok(product);
});

app.MapPost("/products", (Product product) =>
{
    if (products.Any(p => p.Name.Equals(product.Name, StringComparison.OrdinalIgnoreCase)))
        return Results.Conflict(new { error = "product already exists" });
    products.Add(product);
    return Results.Created($"/products/{product.Name}", product);
});

app.Run("http://localhost:5000");
```

Run: `dotnet run`

## Go (net/http)

```go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "os"
    "strings"
)

type Product struct {
    Name     string  `json:"name"`
    Price    float64 `json:"price"`
    Category string  `json:"category"`
    InStock  bool    `json:"inStock"`
}

var products []Product

func loadProducts() {
    data, err := os.ReadFile("products.json")
    if err != nil {
        log.Fatal(err)
    }
    if err := json.Unmarshal(data, &products); err != nil {
        log.Fatal(err)
    }
}

func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}

func main() {
    loadProducts()
    mux := http.NewServeMux()

    mux.HandleFunc("GET /products", func(w http.ResponseWriter, r *http.Request) {
        writeJSON(w, http.StatusOK, products)
    })

    mux.HandleFunc("GET /products/{name}", func(w http.ResponseWriter, r *http.Request) {
        name := r.PathValue("name")
        for _, p := range products {
            if strings.EqualFold(p.Name, name) {
                writeJSON(w, http.StatusOK, p)
                return
            }
        }
        writeJSON(w, http.StatusNotFound, map[string]string{
            "error": fmt.Sprintf("product not found: %s", name),
        })
    })

    mux.HandleFunc("POST /products", func(w http.ResponseWriter, r *http.Request) {
        var p Product
        if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
            writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
            return
        }
        for _, existing := range products {
            if strings.EqualFold(existing.Name, p.Name) {
                writeJSON(w, http.StatusConflict, map[string]string{"error": "product already exists"})
                return
            }
        }
        products = append(products, p)
        writeJSON(w, http.StatusCreated, p)
    })

    log.Println("listening on :8080")
    log.Fatal(http.ListenAndServe(":8080", mux))
}
```

Run: `go run .`

## Testing with curl

```sh
# List all products
curl http://localhost:8000/products | jq .

# Get one product
curl http://localhost:8000/products/Laptop | jq .

# Get a missing product (should return 404)
curl -i http://localhost:8000/products/Nonexistent

# Add a product
curl -X POST http://localhost:8000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Cable","price":9.99,"category":"Electronics","inStock":true}'
```

## Tasks

1. Start all four servers and run the curl commands against each. Confirm you get matching JSON responses.

2. Add a `GET /products?category=Electronics` query parameter filter to all four servers. Return only products matching the category.

3. Add a `DELETE /products/{name}` route that removes a product by name. Return 204 on success, 404 if not found.

4. Add request logging middleware that prints the method, path, and response time for every request. In Python add it via FastAPI middleware, in Express via a `use()` call, in C# via `app.Use()`, in Go manually before calling the handler.

5. Point the TypeScript CSR frontend from Week 3 Day 4 at your Python server, then at your Go server. Does it work without changes? What does this demonstrate?

## Reference

- Week 3 for the HTTP fundamentals behind these servers.
- Python: [FastAPI](https://fastapi.tiangolo.com/)
- TypeScript: [Express](https://expressjs.com/)
- C#: [ASP.NET Core minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- Go: [net/http](https://pkg.go.dev/net/http)
