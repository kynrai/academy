# Day 2 – How Browsers Work and Server-Side Rendering

## Today's Focus

Understand what actually happens between typing a URL and seeing a rendered page. Then build the same HTML page in all four languages — Python, Node.js, C#, and Go — to see what Server-Side Rendering (SSR) means in practice.

## From URL to Rendered Page

When you type `https://example.com/about` and press Enter, six things happen before you see anything:

1. **DNS lookup** — The browser asks a DNS resolver to translate `example.com` into an IP address (e.g. `93.184.216.34`). If the address is cached locally, this step is instant.
2. **TCP connection** — The browser opens a connection to that IP on port 443 (HTTPS). For HTTPS, a TLS handshake follows to establish encryption.
3. **HTTP request** — The browser sends a `GET /about HTTP/1.1` request through that connection.
4. **HTTP response** — The server sends back a status code, headers, and a body. For a typical page, the body is an HTML document.
5. **Browser processes the response** — The browser reads the `Content-Type` header. If it is `text/html`, it begins parsing.
6. **Render** — The browser turns the HTML into pixels on screen.

Steps 5 and 6 are where most of the complexity lives.

## The Browser Rendering Pipeline

The browser does not draw pixels from raw HTML text. It converts the HTML through several stages:

```text
Bytes → Characters → Tokens → DOM nodes → DOM tree
CSS bytes → CSSOM tree
DOM tree + CSSOM tree → Render tree → Layout → Paint
```

Each stage in plain terms:

| Stage | What happens |
| ----- | ------------ |
| Bytes → Characters | The raw bytes from the network are decoded using the charset in the `Content-Type` header (usually UTF-8). |
| Characters → Tokens | The HTML parser reads the character stream and emits tokens: `StartTag`, `EndTag`, `Character`, `Comment`, etc. |
| Tokens → DOM nodes | Each token becomes a node object in memory. |
| DOM tree | The nodes are arranged according to the HTML nesting — a `<li>` inside a `<ul>` inside a `<body>`. |
| CSSOM | CSS is parsed separately into a CSS Object Model — a tree of style rules. |
| Render tree | DOM and CSSOM are combined. Only visible nodes are included — `display: none` elements are excluded. |
| Layout | The browser calculates where each element goes: position, width, height. |
| Paint | Pixels are drawn to the screen. |

This whole process is called the **critical rendering path**. Anything that interrupts it delays the first visible content.

## How JavaScript Affects Rendering

By default, a `<script>` tag **blocks HTML parsing**. When the parser encounters a `<script src="app.js">`, it stops, downloads the script, executes it, and only then continues parsing the HTML. This is why you have likely seen advice to put scripts at the bottom of `<body>`:

```html
<body>
  <!-- All your HTML content here -->

  <!-- Script at the bottom: HTML has already been parsed before this runs -->
  <script src="app.js"></script>
</body>
```

Two attributes change this behaviour:

| Attribute | Effect |
| --------- | ------ |
| `defer` | Script downloads in parallel, executes after HTML is fully parsed. |
| `async` | Script downloads in parallel, executes as soon as it is downloaded (may interrupt parsing). |

For most scripts that manipulate the DOM, `defer` is the right choice. For scripts that are completely independent (analytics, ads), `async` is acceptable.

## What Server-Side Rendering Means

**Server-Side Rendering (SSR)** means the server builds the complete HTML string — including all the data — and sends it as the response body with `Content-Type: text/html`.

The browser receives finished HTML and renders it immediately. No JavaScript is required to see the content.

Compare this to a page that sends an empty HTML shell and relies on JavaScript to call an API and fill in the content. With SSR:

- The browser renders the page on the first HTTP response
- If the user has JavaScript disabled, the page still works
- Search engine crawlers see the real content immediately
- The Time to First Contentful Paint is fast — the content is already in the HTML

## Why SSR Matters

| Concern | SSR | JavaScript-only CSR |
| ------- | --- | ------------------- |
| Works without JavaScript | Yes | No |
| SEO | Search engines see real content | Search engines may see an empty shell |
| First paint | Fast — HTML already has content | Slower — JS must run first |
| Architecture | One server round trip | Two round trips (HTML + API) |
| Interactivity | Requires full page reloads for updates | Can update without reloading |

SSR is not always the right choice — but for content that needs to be visible immediately, work without JavaScript, or rank in search engines, it is the appropriate default.

## Building the Same SSR Page in All Four Languages

The following servers all return the same HTML page: a list of four programming languages with their typing discipline and paradigm. The HTML is assembled on the server. No JavaScript is sent to the browser.

The shared data set used in every example:

| Name | Typing | Paradigm |
| ---- | ------ | -------- |
| Python | dynamic | multi-paradigm |
| JavaScript | dynamic | multi-paradigm |
| C# | static | object-oriented |
| Go | static | procedural |

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

Run:

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

Run:

```sh
node index.js
```

### C# — ASP.NET Core on port 5000

```sh
dotnet new web -o ssr-csharp && cd ssr-csharp
```

Replace the contents of `Program.cs`:

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

Run:

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

Run:

```sh
go run main.go
```

## Tasks

- Run all four servers. Visit each in the browser (`http://localhost:8000`, `http://localhost:3000`, `http://localhost:5000`, `http://localhost:8080`). Confirm you see the rendered HTML page with the language list.

- Open DevTools → **Network** tab. Click the document request (the first entry). Look at the **Response Headers** section and find `Content-Type` — it should be `text/html`.

- Open DevTools → **Elements** tab. Expand the `<ul>` element. Notice all four `<li>` elements are already present in the DOM. The server put them there — no JavaScript was involved.

- Disable JavaScript in your browser:
  - Chrome: DevTools → Settings (gear icon) → Preferences → Debugger → check "Disable JavaScript", or navigate to `chrome://settings/content/javascript` and block.
  - Firefox: DevTools → Settings → check "Disable JavaScript".

  Reload all four pages. They still display the full language list. SSR does not depend on JavaScript.

- Re-enable JavaScript. Use **View Page Source** (`Ctrl+U` on Windows/Linux, `Cmd+U` on macOS) on each server. Read the raw HTML the server returned. Compare it to what you see in the Elements tab — for SSR they are the same, because no JavaScript modifies the DOM after load.

- Compare the `Content-Type` header of these SSR responses to the JSON API responses from Week 2 Day 5. The SSR pages return `text/html`; the JSON APIs return `application/json`. Same HTTP, different content type, different browser behaviour.

## Reading / Reference

- MDN: [How browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)
- MDN: [Critical rendering path](https://developer.mozilla.org/en-US/docs/Web/Performance/Critical_rendering_path)
- web.dev: [Rendering on the Web](https://web.dev/articles/rendering-on-the-web)
