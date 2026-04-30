# Day 3 – Structs, Classes, and Interfaces

## Today's Focus

Define a `Product` type in all four languages. Move from loose dictionaries to typed, structured objects with methods. Learn how each language models behaviour through classes, structs, and interfaces.

## Defining a Product type

```python
from dataclasses import dataclass, field

@dataclass
class Product:
    name:     str
    price:    float
    category: str
    in_stock: bool = True
    rating:   float = 0.0

    def discounted_price(self, rate: float) -> float:
        return self.price * (1 - rate)

    def label(self) -> str:
        stock = "✓" if self.in_stock else "✗"
        return f"[{stock}] {self.name} £{self.price:.2f} ({self.category})"

    def __repr__(self) -> str:
        return f"Product({self.name!r}, £{self.price:.2f})"
```

```typescript
interface Product {
    name:     string;
    price:    number;
    category: string;
    inStock:  boolean;
    rating:   number;
}

// Plain object factory (no class needed for data)
function createProduct(
    name: string, price: number, category: string,
    inStock = true, rating = 0
): Product {
    return { name, price, category, inStock, rating };
}

// Standalone functions that work with the interface
function discountedPrice(p: Product, rate: number): number {
    return p.price * (1 - rate);
}

function label(p: Product): string {
    const stock = p.inStock ? "✓" : "✗";
    return `[${stock}] ${p.name} £${p.price.toFixed(2)} (${p.category})`;
}
```

```csharp
// C# record: immutable by default, auto-generates ToString/Equals/GetHashCode
record Product(
    string Name,
    double Price,
    string Category,
    bool   InStock = true,
    double Rating  = 0
)
{
    public double DiscountedPrice(double rate) => Price * (1 - rate);

    public string Label()
    {
        string stock = InStock ? "✓" : "✗";
        return $"[{stock}] {Name} £{Price:F2} ({Category})";
    }
}
```

```go
type Product struct {
    Name     string
    Price    float64
    Category string
    InStock  bool
    Rating   float64
}

// Constructor function (Go has no built-in constructors)
func NewProduct(name string, price float64, category string) Product {
    return Product{Name: name, Price: price, Category: category, InStock: true}
}

// Methods on the struct
func (p Product) DiscountedPrice(rate float64) float64 {
    return p.Price * (1 - rate)
}

func (p Product) Label() string {
    stock := "✗"
    if p.InStock {
        stock = "✓"
    }
    return fmt.Sprintf("[%s] %s £%.2f (%s)", stock, p.Name, p.Price, p.Category)
}
```

## Creating and using instances

```python
laptop = Product(name="Laptop", price=999.0, category="Electronics")
print(laptop.label())
print(laptop.discounted_price(0.10))
```

```typescript
const laptop = createProduct("Laptop", 999.0, "Electronics");
console.log(label(laptop));
console.log(discountedPrice(laptop, 0.10));
```

```csharp
var laptop = new Product("Laptop", 999.0, "Electronics");
Console.WriteLine(laptop.Label());
Console.WriteLine(laptop.DiscountedPrice(0.10));
```

```go
laptop := NewProduct("Laptop", 999.0, "Electronics")
fmt.Println(laptop.Label())
fmt.Println(laptop.DiscountedPrice(0.10))
```

## Interfaces

Interfaces describe what a type can do, not what it is. Any type that implements the required methods satisfies the interface.

```python
from typing import Protocol

class Priceable(Protocol):
    @property
    def price(self) -> float: ...
    def discounted_price(self, rate: float) -> float: ...

def cheapest(items: list[Priceable]) -> Priceable:
    return min(items, key=lambda x: x.price)
```

```typescript
interface Priceable {
    price: number;
    discountedPrice(rate: number): number;
}

function cheapest(items: Priceable[]): Priceable {
    return items.reduce((a, b) => a.price < b.price ? a : b);
}
```

```csharp
interface IPriceable
{
    double Price { get; }
    double DiscountedPrice(double rate);
}

// Product record implicitly satisfies IPriceable if it has the members
record Product(...) : IPriceable { ... }

static IPriceable Cheapest(IEnumerable<IPriceable> items)
    => items.MinBy(p => p.Price)!;
```

```go
type Priceable interface {
    GetPrice() float64
    DiscountedPrice(rate float64) float64
}

// Product satisfies Priceable if it has these methods
// No explicit declaration needed — Go interfaces are implicit

func Cheapest(items []Priceable) Priceable {
    min := items[0]
    for _, item := range items[1:] {
        if item.GetPrice() < min.GetPrice() {
            min = item
        }
    }
    return min
}
```

## Value vs reference types

| Language   | Structs / records          | Classes               |
| ---------- | -------------------------- | --------------------- |
| Python     | dataclass (reference)      | class (reference)     |
| TypeScript | interface/object (reference)| class (reference)   |
| C#         | struct (value copy)        | class (reference)     |
| Go         | struct (value copy)        | no classes            |

In Go and C#, passing a struct to a function copies it. Mutations inside the function do not affect the original. Use a pointer (`*Product`) to mutate in Go.

```go
func applyDiscount(p *Product, rate float64) {
    p.Price *= (1 - rate)    // modifies original via pointer
}

applyDiscount(&laptop, 0.10)
```

## Tasks

1. Create a list of `Product` instances in all four languages (at least 5 products). Call `label()` on each and print the results.

2. Add an `is_on_sale()` method that returns true when the rating is above 4.0 and the product is in stock.

3. In Go, write a function that takes a `*Product` (pointer) and doubles the price. Call it and verify the original was modified. Then change the parameter to `Product` (value) and call it again — observe the difference.

4. In TypeScript, extend the `Priceable` interface to also require a `label(): string` method. Update `createProduct`'s return type accordingly. What happens if you add an object that is missing `label`?

5. In C#, change `Product` from a `record` to a `class`. What do you lose automatically (hint: check equality and `ToString`)? Add them back manually.

## Reference

- Python: [dataclasses](https://docs.python.org/3/library/dataclasses.html) and [typing.Protocol](https://docs.python.org/3/library/typing.html#typing.Protocol)
- TypeScript: [Interfaces vs types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#interfaces)
- C#: [Records](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)
- Go: [Structs](https://go.dev/tour/moretypes/2) and [Interfaces](https://go.dev/tour/methods/9)
