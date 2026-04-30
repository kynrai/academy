# Day 1 – Arrays and Lists

## Today's Focus

Work with ordered collections in all four languages: create them, access items by index, append and remove elements, slice sub-ranges, and sort. Use the same product data as last week.

## Creating lists

```python
# Python: list — dynamic, any type
names: list[str] = ["Laptop", "Notebook", "Headset", "Novel", "T-Shirt"]
prices: list[float] = [999.0, 4.99, 79.0, 12.99, 19.99]
mixed = ["Widget", 49.99, True]    # allowed but not recommended
```

```typescript
// TypeScript: Array<T> or T[]
const names: string[] = ["Laptop", "Notebook", "Headset", "Novel", "T-Shirt"];
const prices: number[] = [999.0, 4.99, 79.0, 12.99, 19.99];
// Array<string> is identical to string[]
```

```csharp
// C#: List<T> for dynamic, T[] for fixed size
var names = new List<string> { "Laptop", "Notebook", "Headset", "Novel", "T-Shirt" };
double[] prices = { 999.0, 4.99, 79.0, 12.99, 19.99 };  // fixed array
```

```go
// Go: slice — dynamic; array — fixed
names := []string{"Laptop", "Notebook", "Headset", "Novel", "T-Shirt"}
prices := []float64{999.0, 4.99, 79.0, 12.99, 19.99}

// fixed array (rarely used directly)
var fixed [3]string = [3]string{"a", "b", "c"}
```

## Indexing and length

```python
print(names[0])       # Laptop
print(names[-1])      # T-Shirt  (negative index from end)
print(len(names))     # 5
```

```typescript
console.log(names[0]);        // Laptop
console.log(names.at(-1));    // T-Shirt  (negative index via .at())
console.log(names.length);    // 5
```

```csharp
Console.WriteLine(names[0]);          // Laptop
Console.WriteLine(names[^1]);         // T-Shirt  (^ index from end)
Console.WriteLine(names.Count);       // 5 (List); names.Length for array
```

```go
fmt.Println(names[0])         // Laptop
fmt.Println(names[len(names)-1])  // T-Shirt  (no negative indexing)
fmt.Println(len(names))       // 5
```

## Adding and removing

```python
names.append("Cable")          # add to end
names.insert(1, "Charger")     # insert at index 1
names.remove("Novel")          # remove first matching value
del names[0]                   # remove by index
popped = names.pop()           # remove and return last item
```

```typescript
names.push("Cable");           // add to end
names.splice(1, 0, "Charger"); // insert at index 1
names.splice(names.indexOf("Novel"), 1);  // remove by value
names.shift();                 // remove first item
const popped = names.pop();    // remove and return last item
```

```csharp
names.Add("Cable");
names.Insert(1, "Charger");
names.Remove("Novel");         // removes first matching value
names.RemoveAt(0);             // remove by index
```

```go
names = append(names, "Cable")

// Insert at index 1 (no built-in; use slice tricks)
names = append(names[:1], append([]string{"Charger"}, names[1:]...)...)

// Remove by index 2
names = append(names[:2], names[3:]...)
```

## Slicing

Extract a sub-range without modifying the original.

```python
first_three = names[:3]        # index 0, 1, 2
last_two    = names[-2:]       # last two items
middle      = names[1:4]       # index 1, 2, 3
```

```typescript
const firstThree = names.slice(0, 3);   // index 0, 1, 2
const lastTwo    = names.slice(-2);     // last two items
const middle     = names.slice(1, 4);  // index 1, 2, 3
```

```csharp
var firstThree = names.GetRange(0, 3);  // start index, count
// or LINQ: names.Take(3).ToList()
var lastTwo    = names.TakeLast(2).ToList();
```

```go
firstThree := names[:3]    // index 0, 1, 2
lastTwo    := names[len(names)-2:]  // last two
middle     := names[1:4]   // index 1, 2, 3
// Note: slices share memory with the original; copy if needed
```

## Sorting

```python
prices.sort()                          # sort in place
names.sort(reverse=True)              # descending
sorted_prices = sorted(prices)        # returns new list
names.sort(key=lambda n: len(n))      # custom key
```

```typescript
prices.sort((a, b) => a - b);        // ascending (must provide comparator)
names.sort();                         // lexicographic
names.sort((a, b) => b.length - a.length);  // by length descending
const sorted = [...prices].sort((a, b) => a - b);  // non-mutating copy
```

```csharp
prices.Sort();                         // in place (List only)
names.Sort((a, b) => a.Length - b.Length);  // custom comparator
var sorted = prices.OrderBy(p => p).ToList();       // LINQ, new list
var desc   = prices.OrderByDescending(p => p).ToList();
```

```go
import "sort"

sort.Float64s(prices)                  // ascending in place
sort.Strings(names)                    // alphabetical in place
sort.Slice(names, func(i, j int) bool {
    return len(names[i]) < len(names[j])  // custom comparator
})
```

## Stack and queue patterns

A list can act as a stack (LIFO) or a queue (FIFO).

```python
stack = []
stack.append("first")
stack.append("second")
top = stack.pop()     # "second" — LIFO

from collections import deque
queue = deque()
queue.append("first")
queue.append("second")
front = queue.popleft()  # "first" — FIFO
```

TypeScript, C#, and Go follow the same patterns: `push`/`pop` for stack, `shift`/`unshift` (TS) or `Queue<T>` (C#) or a channel (Go) for queues.

## Tasks

1. Create a `prices` list in all four languages. Sort it ascending and descending. Print both.

2. Write a function `most_expensive(items, n)` that returns the top `n` products by price. Implement it in all four languages without using a sort-then-slice shortcut — instead use a loop that tracks the maximum.

3. In Go, create a slice with `make([]string, 0, 10)`. What does the second argument (capacity) do? Print `len` and `cap` before and after appending items.

4. In TypeScript, compare `names.sort()` vs `[...names].sort()`. Modify the original list and observe which approach mutates it.

5. Implement a stack in all four languages using only the built-in list/slice type: `push`, `pop`, and `peek` operations. Raise/return an error when popping an empty stack.

## Reference

- Python: [Lists](https://docs.python.org/3/tutorial/datastructures.html)
- TypeScript: [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- C#: [List<T>](https://learn.microsoft.com/en-us/dotnet/api/system.collections.generic.list-1)
- Go: [Slices](https://go.dev/blog/slices-intro)
