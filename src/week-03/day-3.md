# Day 3 – REST APIs in All Four Languages

## Today's Focus

Design a small REST API and implement it in all four languages. By the end of today every server returns the same JSON responses to the same URLs — which proves that REST is a design convention, not a technology.

## What REST Means

REST (Representational State Transfer) is a set of conventions for designing HTTP APIs:

- **Resources are identified by URLs** — a language is `/api/languages/python`, not `/getLanguageByName?name=python`
- **State is transferred as representations** — usually JSON
- **Standard HTTP methods describe the action** — `GET` to read, `POST` to create, `PUT`/`PATCH` to update, `DELETE` to remove
- **Stateless** — each request contains all the information the server needs; the server does not remember previous requests

A URL that follows REST conventions looks like a noun, not a verb:

| Good (noun) | Avoid (verb) |
| ----------- | ------------ |
| `GET /api/languages` | `GET /getLanguages` |
| `GET /api/languages/python` | `GET /getLanguageByName?name=python` |
| `POST /api/languages` | `POST /createLanguage` |

## Resource Design for Today

Three endpoints, same in every language:

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/health` | Health check — returns `{"status":"ok"}` |
| `GET` | `/api/languages` | Returns all languages. Accepts `?typing=static` or `?typing=dynamic` to filter. |
| `GET` | `/api/languages/{name}` | Returns one language by slug name. Returns `404` if not found. |

The language data is the same as Day 2, extended with a lowercase slug `name` field for URL use:

| name (slug) | display | typing | paradigm |
| ----------- | ------- | ------ | -------- |
| python | Python | dynamic | multi-paradigm |
| javascript | JavaScript | dynamic | multi-paradigm |
| csharp | C# | static | object-oriented |
| go | Go | static | procedural |

## Implementing the API in All Four Languages

### Python — FastAPI on port 8000

`main.py`:

```python
from fastapi import FastAPI, HTTPException, Query
from typing import Optional

app = FastAPI()

languages = [
    {"name": "python", "display": "Python", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "javascript", "display": "JavaScript", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "csharp", "display": "C#", "typing": "static", "paradigm": "object-oriented"},
    {"name": "go", "display": "Go", "typing": "static", "paradigm": "procedural"},
]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/languages")
def list_languages(typing: Optional[str] = Query(None)):
    if typing:
        return [l for l in languages if l["typing"] == typing]
    return languages

@app.get("/api/languages/{name}")
def get_language(name: str):
    lang = next((l for l in languages if l["name"] == name.lower()), None)
    if not lang:
        raise HTTPException(status_code=404, detail=f"Language '{name}' not found")
    return lang
```

Run:

```sh
uv run uvicorn main:app --port 8000 --reload
```

FastAPI automatically generates interactive docs at `http://localhost:8000/docs` — you can test all endpoints there without writing a single `curl` command.

### Node.js — Express on port 3000

`index.js`:

```js
const express = require('express')
const app = express()

const languages = [
  { name: 'python', display: 'Python', typing: 'dynamic', paradigm: 'multi-paradigm' },
  { name: 'javascript', display: 'JavaScript', typing: 'dynamic', paradigm: 'multi-paradigm' },
  { name: 'csharp', display: 'C#', typing: 'static', paradigm: 'object-oriented' },
  { name: 'go', display: 'Go', typing: 'static', paradigm: 'procedural' },
]

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.get('/api/languages', (req, res) => {
  const { typing } = req.query
  const result = typing ? languages.filter(l => l.typing === typing) : languages
  res.json(result)
})

app.get('/api/languages/:name', (req, res) => {
  const lang = languages.find(l => l.name === req.params.name.toLowerCase())
  if (!lang) return res.status(404).json({ error: `Language '${req.params.name}' not found` })
  res.json(lang)
})

app.listen(3000, () => console.log('http://localhost:3000'))
```

Run:

```sh
node index.js
```

### C# — ASP.NET Core on port 5000

`Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var languages = new[]
{
    new { Name = "python", Display = "Python", Typing = "dynamic", Paradigm = "multi-paradigm" },
    new { Name = "javascript", Display = "JavaScript", Typing = "dynamic", Paradigm = "multi-paradigm" },
    new { Name = "csharp", Display = "C#", Typing = "static", Paradigm = "object-oriented" },
    new { Name = "go", Display = "Go", Typing = "static", Paradigm = "procedural" },
};

app.MapGet("/health", () => new { status = "ok" });

app.MapGet("/api/languages", (string? typing) =>
    typing is not null
        ? languages.Where(l => l.Typing == typing)
        : languages);

app.MapGet("/api/languages/{name}", (string name) =>
{
    var lang = languages.FirstOrDefault(l => l.Name == name.ToLower());
    return lang is not null
        ? Results.Ok(lang)
        : Results.NotFound(new { error = $"Language '{name}' not found" });
});

app.Run("http://localhost:5000");
```

Run:

```sh
dotnet run
```

### Go — net/http on port 8080

Go's standard library does not include a router with named path parameters, so the handler for `/api/languages/` extracts the trailing segment from the URL path manually.

`main.go`:

```go
package main

import (
    "encoding/json"
    "net/http"
    "strings"
)

type Language struct {
    Name     string `json:"name"`
    Display  string `json:"display"`
    Typing   string `json:"typing"`
    Paradigm string `json:"paradigm"`
}

var languages = []Language{
    {"python", "Python", "dynamic", "multi-paradigm"},
    {"javascript", "JavaScript", "dynamic", "multi-paradigm"},
    {"csharp", "C#", "static", "object-oriented"},
    {"go", "Go", "static", "procedural"},
}

func writeJSON(w http.ResponseWriter, status int, v any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(v)
}

func main() {
    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        writeJSON(w, 200, map[string]string{"status": "ok"})
    })

    http.HandleFunc("/api/languages", func(w http.ResponseWriter, r *http.Request) {
        typing := r.URL.Query().Get("typing")
        result := []Language{}
        for _, l := range languages {
            if typing == "" || l.Typing == typing {
                result = append(result, l)
            }
        }
        writeJSON(w, 200, result)
    })

    http.HandleFunc("/api/languages/", func(w http.ResponseWriter, r *http.Request) {
        name := strings.TrimPrefix(r.URL.Path, "/api/languages/")
        for _, l := range languages {
            if l.Name == strings.ToLower(name) {
                writeJSON(w, 200, l)
                return
            }
        }
        writeJSON(w, 404, map[string]string{"error": "Language '" + name + "' not found"})
    })

    http.ListenAndServe(":8080", nil)
}
```

Run:

```sh
go run main.go
```

## Testing with curl

Test all three endpoints against each server. The commands below use port 8000 (Python) — repeat with 3000, 5000, and 8080 to verify the other servers.

**List all languages:**

```sh
curl http://localhost:8000/api/languages
```

**Get one language by name:**

```sh
curl http://localhost:8000/api/languages/python
curl http://localhost:8000/api/languages/go
```

**Filter by typing (query parameter):**

```sh
curl "http://localhost:8000/api/languages?typing=static"
curl "http://localhost:8000/api/languages?typing=dynamic"
```

**Trigger a 404 — include `-i` to see the status line:**

```sh
curl -i http://localhost:8000/api/languages/notreal
```

You should see `HTTP/1.1 404 Not Found` and a JSON error body.

**Health check:**

```sh
curl http://localhost:8000/health
```

## Status Codes

Every response should use the correct status code. For this API:

| Situation | Code | Meaning |
| --------- | ---- | ------- |
| Successful GET | `200 OK` | Request succeeded, body contains the data. |
| Resource not found | `404 Not Found` | The named resource does not exist. |
| Server error | `500 Internal Server Error` | Something went wrong on the server (not expected here, but handle defensively). |

The `404` case is important: returning `200` with an empty body or an error message inside a success response is a common mistake. When a resource does not exist, the status code should say so.

## Tasks

- Start each server on its own port. Test every endpoint from the list above with `curl`. Note the status codes.

- Compare the JSON response structure from all four languages for the same request (e.g. `GET /api/languages/go`). The shape should be identical: `name`, `display`, `typing`, `paradigm`.

- Run `curl -i http://localhost:8000/api/languages/notreal` on each server. Confirm the status line reads `404`. Note that Python and Node.js return slightly different JSON error shapes — this is normal and you will standardise error shapes when you build a larger API.

- Create a file called `requests.sh` with one `curl` command per endpoint:

```sh
#!/bin/sh
# Week 3 Day 3 — API test commands

BASE_PY=http://localhost:8000
BASE_NODE=http://localhost:3000
BASE_CSHARP=http://localhost:5000
BASE_GO=http://localhost:8080

# Health
curl "$BASE_PY/health"
curl "$BASE_NODE/health"
curl "$BASE_CSHARP/health"
curl "$BASE_GO/health"

# List all
curl "$BASE_PY/api/languages"

# Filter
curl "$BASE_PY/api/languages?typing=static"
curl "$BASE_PY/api/languages?typing=dynamic"

# Get one
curl "$BASE_PY/api/languages/python"
curl "$BASE_PY/api/languages/go"

# 404
curl -i "$BASE_PY/api/languages/notreal"
```

Make it executable and run it:

```sh
chmod +x requests.sh
./requests.sh
```

## Reading / Reference

- [RESTful API Design](https://restfulapi.net/) — practical conventions for naming resources and using HTTP correctly
- MDN: [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- FastAPI: [Path Parameters](https://fastapi.tiangolo.com/tutorial/path-params/) and [Query Parameters](https://fastapi.tiangolo.com/tutorial/query-params/)
