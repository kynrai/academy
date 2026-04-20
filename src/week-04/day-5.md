# Day 5 – Redis: Key-Value Stores and Choosing the Right Database

## Today's Focus

Learn what Redis is and what problems it solves, connect to it from all four languages, then step back and build a mental model for choosing between database types.

## What is Redis?

Redis (Remote Dictionary Server) is an in-memory key-value store. It is primarily used as a cache, session store, rate limiter, and message broker — not as a primary database.

Because data lives in RAM, reads and writes are orders of magnitude faster than a disk-based database. A typical Redis read takes under a millisecond; a PostgreSQL query on an unindexed table might take tens or hundreds of milliseconds.

Redis also supports expiry — you can set a TTL (time to live) on any key, and it will be automatically deleted after that many seconds. This makes it ideal for session tokens, cache entries, and any data that should naturally expire.

## Redis Data Structures

Redis is not just a simple string store — it supports multiple data structures:

| Type | Example use |
| ---- | ----------- |
| String | Cache a rendered HTML page, store a session token |
| List | Message queue, recent activity feed |
| Set | Unique visitors per day, tag sets |
| Hash | User profile fields (name, email, role) |
| Sorted Set | Leaderboard, rate limiting with scores |
| Expiry (TTL) | Set any key to auto-delete after N seconds |

## Installing Redis

macOS:

```sh
brew install redis
brew services start redis
```

Linux:

```sh
sudo apt install redis-server
sudo service redis-server start
```

Verify: `redis-cli ping` should return `PONG`.

## Redis CLI Basics

```sh
redis-cli

SET name "Academy"
GET name

SET counter 0
INCR counter
INCR counter
GET counter

SET session:abc123 '{"user":"alice"}' EX 3600
TTL session:abc123

DEL name
KEYS *
```

`EX 3600` sets the TTL to 3600 seconds (one hour). `TTL` returns how many seconds remain. When it reaches 0, `GET` returns `nil`.

## Redis in All Four Languages

### Python

```python
import redis
import json

r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# Basic string
r.set("greeting", "Hello from Python")
print(r.get("greeting"))

# Cache with TTL — simulate caching an API response
cache_key = "languages:all"
cached = r.get(cache_key)

if cached:
    print("Cache hit:", json.loads(cached))
else:
    # Simulate fetching from a database
    data = [
        {"name": "Python", "typing": "dynamic"},
        {"name": "Go", "typing": "static"},
    ]
    r.set(cache_key, json.dumps(data), ex=60)  # cache for 60 seconds
    print("Cache miss — stored:", data)

# Counter — rate limiting pattern
r.set("requests:alice", 0)
for _ in range(5):
    r.incr("requests:alice")
print("Request count:", r.get("requests:alice"))
```

Setup: `uv add redis`

### Node.js

```js
const Redis = require('ioredis')
const redis = new Redis()

async function main() {
  await redis.set('greeting', 'Hello from Node.js')
  console.log(await redis.get('greeting'))

  const cacheKey = 'languages:all'
  const cached = await redis.get(cacheKey)

  if (cached) {
    console.log('Cache hit:', JSON.parse(cached))
  } else {
    const data = [{ name: 'Python' }, { name: 'Go' }]
    await redis.set(cacheKey, JSON.stringify(data), 'EX', 60)
    console.log('Cache miss — stored:', data)
  }

  await redis.set('requests:bob', 0)
  await redis.incr('requests:bob')
  await redis.incr('requests:bob')
  console.log('Count:', await redis.get('requests:bob'))

  redis.disconnect()
}

main().catch(console.error)
```

Setup: `npm install ioredis`

### C\#

```csharp
using StackExchange.Redis;
using System.Text.Json;

var mux = await ConnectionMultiplexer.ConnectAsync("localhost:6379");
var db = mux.GetDatabase();

await db.StringSetAsync("greeting", "Hello from C#");
Console.WriteLine(await db.StringGetAsync("greeting"));

const string cacheKey = "languages:all";
var cached = await db.StringGetAsync(cacheKey);

if (cached.HasValue)
{
    Console.WriteLine("Cache hit: " + cached);
}
else
{
    var data = new[] { new { name = "C#" }, new { name = "Go" } };
    await db.StringSetAsync(cacheKey, JsonSerializer.Serialize(data), TimeSpan.FromSeconds(60));
    Console.WriteLine("Cache miss — stored");
}

await db.StringSetAsync("requests:charlie", 0);
await db.StringIncrementAsync("requests:charlie");
await db.StringIncrementAsync("requests:charlie");
Console.WriteLine("Count: " + await db.StringGetAsync("requests:charlie"));
```

Setup: `dotnet add package StackExchange.Redis`

### Go

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "log"
    "time"

    "github.com/redis/go-redis/v9"
)

func main() {
    ctx := context.Background()
    rdb := redis.NewClient(&redis.Options{Addr: "localhost:6379"})
    defer rdb.Close()

    rdb.Set(ctx, "greeting", "Hello from Go", 0)
    val, _ := rdb.Get(ctx, "greeting").Result()
    fmt.Println(val)

    cacheKey := "languages:all"
    cached, err := rdb.Get(ctx, cacheKey).Result()
    if err == redis.Nil {
        data := []map[string]string{{"name": "Go"}, {"name": "Python"}}
        b, _ := json.Marshal(data)
        rdb.Set(ctx, cacheKey, b, 60*time.Second)
        fmt.Println("Cache miss — stored")
    } else if err != nil {
        log.Fatal(err)
    } else {
        fmt.Println("Cache hit:", cached)
    }

    rdb.Set(ctx, "requests:dave", 0, 0)
    rdb.Incr(ctx, "requests:dave")
    rdb.Incr(ctx, "requests:dave")
    count, _ := rdb.Get(ctx, "requests:dave").Result()
    fmt.Println("Count:", count)
}
```

Setup: `go get github.com/redis/go-redis/v9`

## Choosing the Right Database

| Question | Points to |
| -------- | --------- |
| Does your data have clear relationships and a stable schema? | PostgreSQL |
| Do you need ACID transactions across multiple records? | PostgreSQL |
| Does your data structure vary significantly between records? | MongoDB |
| Do you need to embed arrays or nested objects naturally? | MongoDB |
| Do you need sub-millisecond reads or writes? | Redis |
| Are you caching API responses or database query results? | Redis |
| Do you need data to expire automatically? | Redis |
| Is this a small local app or prototype with no server? | SQLite |
| Are you storing time-series metrics? | InfluxDB / TimescaleDB |

Most production applications use more than one database type:

- PostgreSQL for the primary transactional data (users, orders, payments)
- MongoDB for flexible content (product descriptions, event logs, user-generated content)
- Redis as a cache in front of PostgreSQL to reduce query load
- SQLite for local development, testing, or embedded scenarios

This is not over-engineering — each tool is doing the job it was designed for.

## Tasks

- Install Redis and verify with `redis-cli ping`.

- Run all four language examples. After each one, open `redis-cli` and run `KEYS *` to see all keys that were set. Notice that the same cache key (`languages:all`) is shared across runs.

- Set a key with a short TTL and watch it expire:

```sh
redis-cli SET test "hello" EX 10
redis-cli TTL test
# wait a few seconds, run again
redis-cli TTL test
# wait until it reaches 0
redis-cli GET test
```

- Implement a simple cache in front of a PostgreSQL query. Write a function that:
  1. Checks Redis for a cached result
  2. If found, returns it immediately (cache hit)
  3. If not found, queries PostgreSQL, stores the result in Redis with a 30-second TTL, and returns it (cache miss)

Test it by calling the function twice in a row. The first call should print "cache miss"; the second should print "cache hit" without querying the database.

- Review all four database types from this week. Write a short paragraph (3–5 sentences) explaining which database you would use for a social media platform's core data (users, posts, likes, followers) and why. Consider: what queries are needed? What are the consistency requirements? What data is hot (accessed constantly) vs cold?

## Reading / Reference

- [Redis Documentation](https://redis.io/docs/)
- [Redis Data Types](https://redis.io/docs/data-types/)
- [redis-py documentation](https://redis-py.readthedocs.io/)
- [ioredis documentation](https://github.com/redis/ioredis)
- [StackExchange.Redis documentation](https://stackexchange.github.io/StackExchange.Redis/)
- [go-redis documentation](https://redis.uptrace.dev/)
