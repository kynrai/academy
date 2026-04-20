# Weekend Challenges

## Challenges

### Challenge 1: Multi-Database API

Extend your Week 3 full-stack server (from any language) to persist data. Replace the in-memory `languages` list with a PostgreSQL table. The `GET /api/languages` endpoint should read from the database, and `POST /api/languages` should insert into it.

Test that restarting the server does not lose data — this is the fundamental test that persistence is working. Also test that sending a duplicate language name returns an appropriate error response rather than crashing.

### Challenge 2: MongoDB Flexible Schema

Insert 10 different programming languages into a MongoDB collection. Vary the documents deliberately:

- Some should have a `frameworks` array
- Some should have a `year_created` field
- Some should have both
- Some should have neither

Write three queries:

- Find all documents that have a `frameworks` field
- Find languages created after the year 2000
- Find languages with more than two entries in their `frameworks` array

This exercises MongoDB's flexible schema and its query operators (`$exists`, `$gt`, `$size`, `$where`). Look up the correct operator for each case in the MongoDB documentation.

### Challenge 3: Redis Cache Layer

Add Redis caching to the PostgreSQL API from Challenge 1. Cache the result of `GET /api/languages` for 30 seconds.

The logic:

1. On each request, check Redis for a cached result under the key `languages:all`
2. If found, return it immediately
3. If not found, query PostgreSQL, store the JSON result in Redis with a 30-second TTL, then return it

Add a response header `X-Cache: HIT` or `X-Cache: MISS` so callers can see whether the cache was used. Test by watching your application logs — after the first request, subsequent requests within 30 seconds should not log any database queries.

### Challenge 4: Cross-Language Database Access

Run the PostgreSQL database from Day 3. Write `INSERT` statements from one language (e.g. Python) and `SELECT` statements from a different language (e.g. Go). Confirm both programs see the same rows.

This demonstrates a core principle: the database is independent of the application language. The SQL contract is the interface — not the runtime. Any language with a PostgreSQL driver can read and write the same data.

Try a three-language version: Python inserts rows, Node.js updates them, Go reads them. Verify the final state with `psql`.

### Challenge 5: SQLite to PostgreSQL Migration

Take the SQLite code from Day 2 and adapt it to work with PostgreSQL from Day 3. The only changes required are:

- The driver import
- The connection string
- `AUTOINCREMENT` → `SERIAL`
- Parameter placeholders: `?` → `$1`, `$2`, `$3` (for languages that use positional placeholders)

The SQL queries themselves should be nearly identical. Note any differences you encounter — they reveal where SQLite and PostgreSQL diverge in SQL dialect.

## Reflection Questions

- You queried the same PostgreSQL database from four different languages. What was identical across all four? What differed?

- Why is it dangerous to build a SQL query by concatenating user input as a string? What attack does parameterised query syntax prevent?

- When would you choose to embed related data (a MongoDB document with a `frameworks` array) vs normalise it into a separate table with a foreign key? What is the deciding factor?

- You cached an API response in Redis with a 30-second TTL. What is the trade-off of a longer TTL vs a shorter one? What type of data should never be cached, or only cached with a very short TTL?

- If you had to choose only one database for a brand-new project, and you did not yet know the full access patterns, which would you choose and why?
