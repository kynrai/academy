---
title: "Day 2 – HTTP, Browsers, and Server-Side Rendering"
---

## Today's Focus

Learn the fundamentals of HTTP — the protocol every web interaction in this course is built on — and understand what actually happens between typing a URL and seeing a rendered page. Then build the same HTML page in all four languages to see what Server-Side Rendering (SSR) means in practice.

## HTTP Basics

HTTP (HyperText Transfer Protocol) is the language a browser uses to ask a server for something, and the language a server uses to reply. Every interaction follows the same pattern:

1. The client sends a **request** — a method (`GET`, `POST`, etc.), a URL, and headers.
2. The server sends a **response** — a status code, headers, and a body.

```text
GET /index.html HTTP/1.1
Host: example.com

HTTP/1.1 200 OK
Content-Type: text/html
...body...
```

The `Content-Type` header tells the client what kind of data is in the body. The two most common types in web development:

| Content-Type | What it means |
| ------------ | ------------- |
| `text/html` | The body is an HTML document — the browser renders it as a page. |
| `application/json` | The body is JSON data — used by APIs. |

### HTTP Methods

| Method | Typical use |
| ------ | ----------- |
| `GET` | Retrieve a resource — no body, safe to repeat. |
| `POST` | Create a new resource — body contains the data. |
| `PUT` | Replace a resource entirely. |
| `PATCH` | Update part of a resource. |
| `DELETE` | Remove a resource. |

### Path Parameters and Query Parameters

A **path parameter** is a variable segment embedded in the URL path — it identifies a specific resource:

```text
GET /api/v2/pokemon/pikachu
                   ^^^^^^^^ path parameter — the Pokémon name
```

**Query parameters** appear after `?` as `key=value` pairs separated by `&`. They modify or filter a request without identifying a different resource:

```text
GET /api/v2/pokemon?limit=5&offset=10
                    ^^^^^^^  ^^^^^^^^
                    page size  skip first 10
```

### Common Headers

| Header | Purpose |
| ------ | ------- |
| `Host` | The domain the request is directed to. |
| `Accept` | The content types the client wants back. |
| `Content-Type` | The format of the request or response body. |
| `Authorization` | Credentials — commonly `Bearer <token>` for APIs. |
| `Cache-Control` | How long and where the response can be cached. |

### Status Codes

| Range | Meaning | Common examples |
| ----- | ------- | --------------- |
| `2xx` | Success | `200 OK`, `201 Created`, `204 No Content` |
| `3xx` | Redirect | `301 Moved Permanently`, `302 Found` |
| `4xx` | Client error | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `5xx` | Server error | `500 Internal Server Error`, `503 Service Unavailable` |

### Three Ways a Page Can Work

**1 — Server returns HTML directly.** No JavaScript required. Static sites and server-rendered apps work this way.

```text
Browser  →  GET /index.html  →  Server
Browser  ←  200 text/html    ←  Server
Browser renders the HTML
```

**2 — Server returns JSON (an API).** The client decides what to do with the data.

```text
Client   →  GET /api/pokemon/pikachu  →  Server
Client   ←  200 application/json      ←  Server
```

**3 — Browser loads HTML, then JavaScript calls an API.** Most modern single-page apps work this way.

```text
Browser  →  GET /index.html              →  Server
Browser  ←  200 text/html (+ script)     ←  Server
Script   →  GET /api/pokemon/pikachu     →  API
Script   ←  200 application/json         ←  API
Script builds HTML from the JSON and updates the page
```

These three patterns map onto the rest of this week: pattern 1 is today's focus (SSR), pattern 2 is Day 3 (REST APIs), pattern 3 is Day 4 (CSR), and Day 5 combines all three in one server.

### Try it with curl

Before moving on, get hands-on with the protocol using `curl`:

```sh
# Path parameter — fetch one resource
curl https://pokeapi.co/api/v2/pokemon/pikachu

# -i includes response headers — find Content-Type and Cache-Control
curl -i https://pokeapi.co/api/v2/pokemon/pikachu

# Query parameters for pagination
curl "https://pokeapi.co/api/v2/pokemon?limit=5&offset=0"

# Trigger a 404 deliberately
curl -i https://pokeapi.co/api/v2/pokemon/notarealname
```

Open DevTools (F12 → Network tab) and visit the same URLs in your browser. Compare the request headers your browser sends automatically vs the ones `curl` sent.

---

## From URL to Rendered Page

When you type `https://example.com/about` and press Enter, six things happen before you see anything:

1. **DNS lookup** — The browser asks a DNS resolver to translate `example.com` into an IP address. If the address is cached locally, this step is instant.
2. **TCP connection** — The browser opens a connection to that IP on port 443 (HTTPS). A TLS handshake establishes encryption.
3. **HTTP request** — The browser sends a `GET /about HTTP/1.1` request.
4. **HTTP response** — The server sends back a status code, headers, and a body.
5. **Browser processes the response** — The browser reads the `Content-Type` header. If it is `text/html`, it begins parsing.
6. **Render** — The browser turns the HTML into pixels on screen.

## The Browser Rendering Pipeline

The browser does not draw pixels from raw HTML text. It converts the HTML through several stages:

```text
Bytes → Characters → Tokens → DOM nodes → DOM tree
CSS bytes → CSSOM tree
DOM tree + CSSOM tree → Render tree → Layout → Paint
```

| Stage | What happens |
| ----- | ------------ |
| Bytes → Characters | Raw bytes decoded using the charset in `Content-Type` (usually UTF-8). |
| Characters → Tokens | The HTML parser emits tokens: `StartTag`, `EndTag`, `Character`, etc. |
| Tokens → DOM nodes | Each token becomes a node object in memory. |
| DOM tree | Nodes arranged according to HTML nesting. |
| CSSOM | CSS parsed separately into a tree of style rules. |
| Render tree | DOM and CSSOM combined — only visible nodes included. |
| Layout | Browser calculates position, width, height of each element. |
| Paint | Pixels drawn to screen. |

## How JavaScript Affects Rendering

By default, a `<script>` tag **blocks HTML parsing**. When the parser hits `<script src="app.js">`, it stops, downloads the script, executes it, then resumes. Two attributes change this:

| Attribute | Effect |
| --------- | ------ |
| `defer` | Downloads in parallel, executes after HTML is fully parsed. |
| `async` | Downloads in parallel, executes as soon as downloaded (may interrupt parsing). |

For most scripts that manipulate the DOM, `defer` is the right choice.

## What Server-Side Rendering Means

**Server-Side Rendering (SSR)** means the server builds the complete HTML string — including all the data — and sends it as the response body with `Content-Type: text/html`. The browser receives finished HTML and renders it immediately. No JavaScript is required to see the content.

| Concern | SSR | JavaScript-only CSR |
| ------- | --- | ------------------- |
| Works without JavaScript | Yes | No |
| SEO | Search engines see real content | May see an empty shell |
| First paint | Fast — HTML already has content | Slower — JS must run first |
| Subsequent updates | Full page reloads | JS updates DOM without reload |

## Building the Same SSR Page in All Four Languages

Each server returns the same HTML page: a list of four programming languages. The HTML is assembled on the server — no JavaScript is sent to the browser.

### Python — FastAPI on port 8000

```sh
mkdir ~/projects/ssr-python && cd ~/projects/ssr-python
uv init
uv add fastapi uvicorn
```

`main.py`:

```python
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI()

languages = [
    {"name": "Python", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "JavaScript", "typing": "dynamic", "paradigm": "multi-paradigm"},
    {"name": "C#", "typing": "static", "paradigm": "object-oriented"},
    {"name": "Go", "typing": "static", "paradigm": "procedural"},
]

@app.get("/", response_class=HTMLResponse)
def index():
    items = "\n".join(
        f"  <li><strong>{l['name']}</strong> — {l['typing']} typing, {l['paradigm']}</li>"
        for l in languages
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Languages</title></head>
<body>
  <h1>Programming Languages</h1>
  <ul>
{items}
  </ul>
  <p><em>Rendered server-side by Python. No JavaScript required.</em></p>
</body>
</html>"""
```

```sh
uv run uvicorn main:app --port 8000 --reload
```

### Node.js — Express on port 3000

```sh
mkdir ~/projects/ssr-node && cd ~/projects/ssr-node
npm init -y
npm install express
```

`index.js`:

```js
const express = require('express')
const app = express()

const languages = [
  { name: 'Python', typing: 'dynamic', paradigm: 'multi-paradigm' },
  { name: 'JavaScript', typing: 'dynamic', paradigm: 'multi-paradigm' },
  { name: 'C#', typing: 'static', paradigm: 'object-oriented' },
  { name: 'Go', typing: 'static', paradigm: 'procedural' },
]

app.get('/', (req, res) => {
  const items = languages
    .map(l => `  <li><strong>${l.name}</strong> — ${l.typing} typing, ${l.paradigm}</li>`)
    .join('\n')

  res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Languages</title></head>
<body>
  <h1>Programming Languages</h1>
  <ul>
${items}
  </ul>
  <p><em>Rendered server-side by Node.js. No JavaScript required.</em></p>
</body>
</html>`)
})

app.listen(3000, () => console.log('http://localhost:3000'))
```

```sh
node index.js
```

### C# — ASP.NET Core on port 5000

```sh
dotnet new web -o ssr-csharp && cd ssr-csharp
```

`Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var languages = new[]
{
    new { Name = "Python", Typing = "dynamic", Paradigm = "multi-paradigm" },
    new { Name = "JavaScript", Typing = "dynamic", Paradigm = "multi-paradigm" },
    new { Name = "C#", Typing = "static", Paradigm = "object-oriented" },
    new { Name = "Go", Typing = "static", Paradigm = "procedural" },
};

app.MapGet("/", () =>
{
    var items = string.Join("\n", languages.Select(
        l => $"  <li><strong>{l.Name}</strong> — {l.Typing} typing, {l.Paradigm}</li>"));

    var html = $"""
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8"><title>Languages</title></head>
        <body>
          <h1>Programming Languages</h1>
          <ul>
        {items}
          </ul>
          <p><em>Rendered server-side by C#. No JavaScript required.</em></p>
        </body>
        </html>
        """;

    return Results.Content(html, "text/html");
});

app.Run("http://localhost:5000");
```

```sh
dotnet run
```

### Go — net/http on port 8080

```sh
mkdir ~/projects/ssr-go && cd ~/projects/ssr-go
go mod init ssr-go
```

`main.go`:

```go
package main

import (
    "fmt"
    "net/http"
    "strings"
)

type Language struct {
    Name     string
    Typing   string
    Paradigm string
}

var languages = []Language{
    {"Python", "dynamic", "multi-paradigm"},
    {"JavaScript", "dynamic", "multi-paradigm"},
    {"C#", "static", "object-oriented"},
    {"Go", "static", "procedural"},
}

func index(w http.ResponseWriter, r *http.Request) {
    var items []string
    for _, l := range languages {
        items = append(items, fmt.Sprintf(
            "  <li><strong>%s</strong> — %s typing, %s</li>",
            l.Name, l.Typing, l.Paradigm,
        ))
    }
    w.Header().Set("Content-Type", "text/html; charset=utf-8")
    fmt.Fprintf(w, `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Languages</title></head>
<body>
  <h1>Programming Languages</h1>
  <ul>
%s
  </ul>
  <p><em>Rendered server-side by Go. No JavaScript required.</em></p>
</body>
</html>`, strings.Join(items, "\n"))
}

func main() {
    http.HandleFunc("/", index)
    http.ListenAndServe(":8080", nil)
}
```

```sh
go run main.go
```

## Tasks

- Run all four servers. Visit each in the browser and confirm you see the rendered HTML page with the language list.

- Open DevTools → **Network** tab → click the document request → look at **Response Headers** → find `Content-Type`. It should be `text/html`.

- Open DevTools → **Elements** tab → expand the `<ul>` element. All four `<li>` elements are already present in the DOM. The server put them there — no JavaScript was involved.

- Disable JavaScript in your browser (DevTools → Settings → Debugger → Disable JavaScript). Reload all four pages. They still display the full language list. SSR does not depend on JavaScript.

- Re-enable JavaScript. Use **View Page Source** (`Cmd+U` / `Ctrl+U`) on each server. The raw HTML the server returned contains the language list. Compare it to what you see in the Elements tab — for SSR they are identical, because no JavaScript modifies the DOM after load.

## Reading / Reference

- MDN: [An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- MDN: [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- MDN: [HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- MDN: [How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)
- MDN: [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
- web.dev: [Rendering on the Web](https://web.dev/articles/rendering-on-the-web)
