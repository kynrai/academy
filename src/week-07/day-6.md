# Weekend Challenges

## Extended Challenges

- **Persist changes to disk**: Extend the Day 5 server so that `POST /products` writes the updated list back to `products.json`. Implement this in all four languages. Think carefully about what happens if two requests arrive simultaneously — is your implementation safe?

- **CSV import endpoint**: Add `POST /import` that accepts a multipart form upload of a CSV file, parses it into products, and adds them to the inventory. Return a summary: `{ added: 3, skipped: 1, errors: ["row 4: invalid price"] }`.

- **Pipeline benchmark**: Process 100,000 product records (generate them with a script). Measure the time taken for the filter → map → reduce pipeline in Python (list comprehension), TypeScript (chained methods), C# (LINQ), and Go (explicit loop). Record results and explain why Go's loop typically beats the others at scale.

- **Concurrent fetch**: Fetch from 5 different public APIs concurrently and merge the results. In Python, use `asyncio` + `httpx`. In TypeScript, use `Promise.all`. In Go, use goroutines and a channel. In C#, use `Task.WhenAll`. Compare the code structure.

- **Streaming large files**: Modify your CSV loader to process a 100 MB file without loading it all into memory at once. In Python use a line iterator, in Go use `bufio.Scanner`, in C# use `StreamReader`, in TypeScript use a readline stream. Measure peak memory usage before and after.

## Recommended Reading

- Python: [asyncio](https://docs.python.org/3/library/asyncio.html) and [httpx async](https://www.python-httpx.org/async/)
- TypeScript: [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- C#: [Task-based async](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/async/)
- Go: [Concurrency patterns](https://go.dev/blog/pipelines)

## Reflection

- You built the same server in four languages. Which had the least boilerplate? Which gave you the most confidence that your code was correct before running it?
- JSON field naming conventions differ: Go uses `json:"snake_case"` tags, TypeScript/Python use camelCase by default, C# uses PascalCase. How did you handle the mismatch? What is the risk if you forget to handle it?
- A pipeline chains operations in sequence. When would you split a pipeline into multiple passes over the data? When is one pass better?
- The integration project showed that the frontend did not care which language served the API. What makes this possible? What would break if two language servers used different JSON formats for the same data?
