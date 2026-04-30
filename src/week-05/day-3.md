# Day 3 – Loops and Iteration

## Today's Focus

Iterate over collections in all four languages using range-based loops, while loops, and functional-style operations (map, filter, reduce). The running example is a list of products.

## The product list

This data appears in all examples today.

```python
products = [
    {"name": "Laptop",   "price": 999.0, "category": "Electronics"},
    {"name": "Notebook", "price": 4.99,  "category": "Books"},
    {"name": "Headset",  "price": 79.0,  "category": "Electronics"},
    {"name": "Novel",    "price": 12.99, "category": "Books"},
    {"name": "T-Shirt",  "price": 19.99, "category": "Clothing"},
]
```

```typescript
const products = [
    { name: "Laptop",   price: 999.0, category: "Electronics" },
    { name: "Notebook", price: 4.99,  category: "Books" },
    { name: "Headset",  price: 79.0,  category: "Electronics" },
    { name: "Novel",    price: 12.99, category: "Books" },
    { name: "T-Shirt",  price: 19.99, category: "Clothing" },
];
```

```csharp
var products = new[]
{
    new { Name = "Laptop",   Price = 999.0, Category = "Electronics" },
    new { Name = "Notebook", Price = 4.99,  Category = "Books" },
    new { Name = "Headset",  Price = 79.0,  Category = "Electronics" },
    new { Name = "Novel",    Price = 12.99, Category = "Books" },
    new { Name = "T-Shirt",  Price = 19.99, Category = "Clothing" },
};
```

```go
type Product struct {
    Name     string
    Price    float64
    Category string
}

products := []Product{
    {"Laptop",   999.0, "Electronics"},
    {"Notebook", 4.99,  "Books"},
    {"Headset",  79.0,  "Electronics"},
    {"Novel",    12.99, "Books"},
    {"T-Shirt",  19.99, "Clothing"},
}
```

## Range-based loops

Iterate every item without managing an index.

```python
for product in products:
    print(f"{product['name']}: £{product['price']:.2f}")
```

```typescript
for (const product of products) {
    console.log(`${product.name}: £${product.price.toFixed(2)}`);
}
```

```csharp
foreach (var product in products)
{
    Console.WriteLine($"{product.Name}: £{product.Price:F2}");
}
```

```go
for _, product := range products {
    fmt.Printf("%s: £%.2f\n", product.Name, product.Price)
}
// use index: for i, product := range products
```

## While / condition loops

Useful when you don't know how many iterations you need up front.

```python
price = 1.0
while price < 100:
    price *= 2
print(price)  # 128.0
```

```typescript
let price = 1.0;
while (price < 100) {
    price *= 2;
}
console.log(price);
```

```csharp
double price = 1.0;
while (price < 100)
{
    price *= 2;
}
Console.WriteLine(price);
```

```go
price := 1.0
for price < 100 {          // Go has no "while" keyword; for serves both
    price *= 2
}
fmt.Println(price)
```

## break and continue

```python
for product in products:
    if product["price"] > 500:
        break                   # stop at the first expensive item
    if product["category"] == "Books":
        continue                # skip books
    print(product["name"])
```

TypeScript, C#, and Go use the same `break` and `continue` keywords with identical behaviour.

## Filter, map, and reduce

These three patterns cover most data transformation needs.

### Filter – keep items that match a condition

```python
expensive = [p for p in products if p["price"] > 50]
# or: list(filter(lambda p: p["price"] > 50, products))
```

```typescript
const expensive = products.filter(p => p.price > 50);
```

```csharp
var expensive = products.Where(p => p.Price > 50).ToArray();
```

```go
// Go has no built-in filter; use a loop
var expensive []Product
for _, p := range products {
    if p.Price > 50 {
        expensive = append(expensive, p)
    }
}
```

### Map – transform every item

```python
discounted = [{"name": p["name"], "price": p["price"] * 0.9} for p in products]
```

```typescript
const discounted = products.map(p => ({ ...p, price: p.price * 0.9 }));
```

```csharp
var discounted = products.Select(p => new { p.Name, Price = p.Price * 0.9 }).ToArray();
```

```go
for i := range products {
    products[i].Price *= 0.9    // modify in place
}
```

### Reduce – aggregate to a single value

```python
total = sum(p["price"] for p in products)
# or: from functools import reduce; reduce(lambda acc, p: acc + p["price"], products, 0)
```

```typescript
const total = products.reduce((acc, p) => acc + p.price, 0);
```

```csharp
double total = products.Sum(p => p.Price);
```

```go
var total float64
for _, p := range products {
    total += p.Price
}
```

## Tasks

1. Print all products with a price between £10 and £100 using a range-based loop in all four languages.

2. Write a loop that counts how many products are in each category. Store the result in a variable named `counts`. You will need a dictionary/map — that is fine to use today even before the dedicated chapter.

3. In Python, rewrite your filter using a list comprehension, then using `filter()` + `lambda`. Which do you find more readable?

4. In TypeScript, chain `.filter()`, `.map()`, and `.reduce()` in a single expression: filter to Electronics only, apply a 10% discount, then sum the total cost. What is the final value?

5. In Go, write a `sumPrices` function that takes a `[]Product` and returns `float64`. Call it with the full list and then with only the Electronics products (filtered separately).

## Reference

- Python: [List comprehensions](https://docs.python.org/3/tutorial/datastructures.html#list-comprehensions)
- TypeScript: [Array methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- C#: [LINQ overview](https://learn.microsoft.com/en-us/dotnet/csharp/linq/)
- Go: [Range](https://go.dev/tour/moretypes/16)
