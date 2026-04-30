# Day 2 – HTTP Clients: Making Network Requests

## Today's Focus

Make HTTP requests from code in all four languages. Fetch data from a public API, parse the JSON response into typed structures, and handle network errors. This is the client side of the HTTP model from Week 3.

## The public API

Use the [Open Library API](https://openlibrary.org/developers/api) — no API key required.

```text
GET https://openlibrary.org/search.json?q=python&limit=5
```

Returns a JSON object with a `docs` array. Each doc has `title`, `author_name`, `first_publish_year`.

## GET requests

```python
import requests  # pip install requests

response = requests.get(
    "https://openlibrary.org/search.json",
    params={"q": "python programming", "limit": 5},
    timeout=10,
)
response.raise_for_status()   # raises on 4xx/5xx
data = response.json()

for doc in data["docs"]:
    title = doc.get("title", "Unknown")
    authors = ", ".join(doc.get("author_name", []))
    year = doc.get("first_publish_year", "?")
    print(f"{title} ({year}) — {authors}")
```

```typescript
// Node 18+: fetch is built in
const response = await fetch(
    "https://openlibrary.org/search.json?q=python+programming&limit=5"
);

if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
}

const data = await response.json() as {
    docs: Array<{
        title: string;
        author_name?: string[];
        first_publish_year?: number;
    }>;
};

for (const doc of data.docs) {
    const authors = doc.author_name?.join(", ") ?? "Unknown";
    console.log(`${doc.title} (${doc.first_publish_year ?? "?"}) — ${authors}`);
}
```

```csharp
using System.Net.Http;
using System.Text.Json;

var client = new HttpClient();
client.Timeout = TimeSpan.FromSeconds(10);

var url = "https://openlibrary.org/search.json?q=python+programming&limit=5";
var response = await client.GetAsync(url);
response.EnsureSuccessStatusCode();

var json = await response.Content.ReadAsStringAsync();
var data = JsonSerializer.Deserialize<SearchResult>(json,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;

foreach (var doc in data.Docs)
{
    var authors = string.Join(", ", doc.AuthorName ?? []);
    Console.WriteLine($"{doc.Title} ({doc.FirstPublishYear}) — {authors}");
}

record SearchResult(List<BookDoc> Docs);
record BookDoc(string Title, List<string>? AuthorName, int? FirstPublishYear);
```

```go
import (
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
    "time"
)

type SearchResult struct {
    Docs []BookDoc `json:"docs"`
}

type BookDoc struct {
    Title            string   `json:"title"`
    AuthorName       []string `json:"author_name"`
    FirstPublishYear int      `json:"first_publish_year"`
}

client := &http.Client{Timeout: 10 * time.Second}
resp, err := client.Get("https://openlibrary.org/search.json?q=python+programming&limit=5")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()

if resp.StatusCode != http.StatusOK {
    log.Fatalf("unexpected status: %s", resp.Status)
}

var result SearchResult
if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
    log.Fatal(err)
}

for _, doc := range result.Docs {
    authors := strings.Join(doc.AuthorName, ", ")
    fmt.Printf("%s (%d) — %s\n", doc.Title, doc.FirstPublishYear, authors)
}
```

## POST requests with a JSON body

```python
import requests, json

payload = {"name": "New Product", "price": 29.99, "category": "Books"}
response = requests.post(
    "http://localhost:8000/products",
    json=payload,            # sets Content-Type: application/json
    timeout=5,
)
response.raise_for_status()
created = response.json()
print(created)
```

```typescript
const response = await fetch("http://localhost:8000/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "New Product", price: 29.99, category: "Books" }),
});
const created = await response.json();
console.log(created);
```

```csharp
var payload = new { Name = "New Product", Price = 29.99, Category = "Books" };
var content = new StringContent(
    JsonSerializer.Serialize(payload),
    Encoding.UTF8,
    "application/json"
);
var response = await client.PostAsync("http://localhost:8000/products", content);
var body = await response.Content.ReadAsStringAsync();
```

```go
payload, _ := json.Marshal(map[string]any{
    "name": "New Product", "price": 29.99, "category": "Books",
})
resp, err := client.Post(
    "http://localhost:8000/products",
    "application/json",
    bytes.NewReader(payload),
)
```

## Error handling

Network requests can fail in many ways. Handle them all.

| Failure mode        | What to check                    |
| ------------------- | -------------------------------- |
| Network unreachable | Error returned from the call     |
| Timeout             | Error type / context deadline    |
| 4xx client error    | response.status >= 400           |
| 5xx server error    | response.status >= 500           |
| Invalid JSON        | Error from the deserialise step  |
| Missing field       | Null/option check after parsing  |

## Tasks

1. Fetch the Open Library search results in all four languages. Print the title, year, and first author for each book returned.

2. Change the search query to something that returns no results (a made-up word). What does the response body look like? How does your code handle an empty `docs` array?

3. Deliberately use a URL that returns 404 (e.g. `https://openlibrary.org/works/NONEXISTENT.json`). Does your code handle it gracefully? Add error handling if not.

4. Add a 1 ms timeout to force a timeout error. Observe the error message in each language. Restore a sensible timeout.

5. Write a `fetch_books(query, limit)` function in each language that returns a typed list of results. The caller should not need to know about HTTP — they just call the function and get back a list.

## Reference

- Python: [requests](https://requests.readthedocs.io/en/latest/)
- TypeScript: [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- C#: [HttpClient](https://learn.microsoft.com/en-us/dotnet/fundamentals/networking/http/httpclient)
- Go: [net/http](https://pkg.go.dev/net/http)
