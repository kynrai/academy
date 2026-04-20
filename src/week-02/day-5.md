# Day 5 – Hello World Web Servers in All Four Languages

## Today's Focus

Write a minimal HTTP server in Python, JavaScript, C#, and Go. Each server returns the same JSON response on `GET /`. The goal is to see that HTTP is language-agnostic — the browser and `curl` interact with all four identically — while every language takes a different approach to get there.

## The Target

Every server should respond to `GET /` with:

```json
{"message": "Hello from <language>"}
```

And to `GET /health` with:

```json
{"status": "ok"}
```

Test each one with:

```sh
curl http://localhost:<port>/
curl http://localhost:<port>/health
```

---

## Python – FastAPI (port 8000)

FastAPI is a modern Python web framework that uses type annotations to validate requests and auto-generate API documentation.

```sh
cd ~/projects/hello-python
uv add fastapi uvicorn
```

Create or update `main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def hello():
    return {"message": "Hello from Python"}

@app.get("/health")
def health():
    return {"status": "ok"}
```

Run:

```sh
uv run uvicorn main:app --port 8000 --reload
```

Open `http://localhost:8000/docs` — FastAPI generates interactive API documentation automatically from your code.

---

## JavaScript – Express (port 3000)

Express is a minimal web framework for Node.js.

```sh
cd ~/projects/hello-node
npm install express
```

Create or update `index.js`:

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({ message: 'Hello from JavaScript' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})
```

Run:

```sh
node index.js
```

---

## C# – ASP.NET Core Minimal API (port 5000)

ASP.NET Core's minimal API syntax lets you define routes concisely without controllers or classes.

```sh
cd ~/projects/hello-dotnet
dotnet new webapi --use-minimal-apis -n hello-dotnet
cd hello-dotnet
```

Replace the generated `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => new { message = "Hello from C#" });
app.MapGet("/health", () => new { status = "ok" });

app.Run("http://localhost:5000");
```

Run:

```sh
dotnet run
```

---

## Go – net/http (port 8080)

Go's standard library includes a production-capable HTTP server. No external packages are needed.

```sh
cd ~/projects/hello-go
```

Update `main.go`:

```go
package main

import (
    "encoding/json"
    "net/http"
)

func jsonResponse(w http.ResponseWriter, data any) {
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(data)
}

func main() {
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        jsonResponse(w, map[string]string{"message": "Hello from Go"})
    })

    http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        jsonResponse(w, map[string]string{"status": "ok"})
    })

    http.ListenAndServe(":8080", nil)
}
```

Run:

```sh
go run main.go
```

---

## Comparing All Four

With all four servers running, test them and compare the responses:

```sh
curl http://localhost:8000/          # Python
curl http://localhost:3000/          # JavaScript
curl http://localhost:5000/          # C#
curl http://localhost:8080/          # Go

curl -i http://localhost:8000/health # -i includes response headers
curl -i http://localhost:3000/health
curl -i http://localhost:5000/health
curl -i http://localhost:8080/health
```

Open each URL in your browser and in DevTools (Network tab). Compare the `Content-Type` response header across all four — it is `application/json` in every case.

### What differs

| | Python | JavaScript | C# | Go |
| - | ------ | ---------- | -- | -- |
| Framework | FastAPI | Express | ASP.NET Core | stdlib `net/http` |
| Port | 8000 | 3000 | 5000 | 8080 |
| Run command | `uv run uvicorn main:app` | `node index.js` | `dotnet run` | `go run main.go` |
| JSON serialisation | Automatic (return a dict) | `res.json()` | Automatic (anonymous object) | `encoding/json` |
| Auto docs | Yes (`/docs`) | No | Optional (Swagger) | No |

### What is identical

- The HTTP protocol
- The JSON response format
- How `curl` and the browser interact with them
- The status codes
- The `Content-Type: application/json` response header

The language is an implementation detail. HTTP is the contract.

## Tasks

- Get all four servers running simultaneously on their respective ports.
- Test each with `curl` and with the browser.
- Use `curl -i` to view response headers from each server. Note the `Content-Type`, `Server`, and any other headers that differ.
- Add a third endpoint `GET /info` to each server that returns a JSON object with the language name and version number:

  ```json
  {"language": "Python", "version": "3.12.0"}
  ```

  Hard-code the values for now.

- Stop one server and test its port with `curl`. Note the connection refused error — the server process is the thing answering requests.

## Reading / Reference

- [FastAPI documentation](https://fastapi.tiangolo.com/)
- [Express documentation](https://expressjs.com/)
- [ASP.NET Core minimal APIs](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/minimal-apis)
- [Go net/http package](https://pkg.go.dev/net/http)
