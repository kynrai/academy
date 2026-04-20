# Day 3 – PostgreSQL: Production Relational Databases

## Today's Focus

Move from SQLite to PostgreSQL — a full client-server relational database used in production by companies of all sizes. Connect to it from all four languages and learn how schemas and environment variables keep credentials out of code.

## PostgreSQL vs SQLite

SQLite is a library embedded in the application. PostgreSQL is a separate server process that accepts network connections.

| Feature | SQLite | PostgreSQL |
| ------- | ------ | ---------- |
| Server process | No — library only | Yes — runs as a daemon |
| Concurrent writes | Limited | Full concurrent access |
| Network access | No | Yes — any language, any host |
| Types | Loose (TEXT, INTEGER, REAL, BLOB) | Rich: arrays, JSON, UUID, enums, hstore |
| Use case | Local, embedded, learning | Production web applications |

The SQL is nearly identical between SQLite and PostgreSQL. The main syntax differences you will encounter: `SERIAL` instead of `AUTOINCREMENT`, `VARCHAR`/`TIMESTAMP` instead of SQLite's loose `TEXT`, and `$1`/`$2` parameter placeholders instead of `?` in most PostgreSQL drivers.

## Installing PostgreSQL

macOS:

```sh
brew install postgresql@16
brew services start postgresql@16
```

Linux:

```sh
sudo apt install postgresql
sudo service postgresql start
```

Verify the installation:

```sh
psql --version
psql -U postgres
```

## Creating a Database and User

```sql
psql -U postgres

CREATE DATABASE academy;
CREATE USER academy_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE academy TO academy_user;
\q
```

## The languages Table in PostgreSQL

```sql
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    typing VARCHAR(50) NOT NULL,
    paradigm VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

Note the differences from SQLite:

- `SERIAL` — PostgreSQL's auto-incrementing integer type (equivalent to SQLite's `AUTOINCREMENT`)
- `VARCHAR(100)` — a string with a maximum length (SQLite's `TEXT` has no enforced limit)
- `TIMESTAMP` — a proper timestamp type (SQLite stores dates as text)
- `NOW()` — a PostgreSQL function returning the current timestamp

## PostgreSQL in All Four Languages

The connection string pattern for all examples: `postgresql://academy_user:password@localhost:5432/academy`

### Python

```python
import psycopg2
import psycopg2.extras

conn = psycopg2.connect("postgresql://academy_user:password@localhost:5432/academy")
cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

cur.execute("""
    CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        typing VARCHAR(50) NOT NULL,
        paradigm VARCHAR(100) NOT NULL
    )
""")
conn.commit()

cur.execute(
    "INSERT INTO languages (name, typing, paradigm) VALUES (%s, %s, %s) ON CONFLICT (name) DO NOTHING",
    ("Python", "dynamic", "multi-paradigm")
)
conn.commit()

cur.execute("SELECT * FROM languages")
for row in cur.fetchall():
    print(dict(row))

cur.close()
conn.close()
```

Setup: `uv add psycopg2-binary`

Note: `%s` is the placeholder syntax for psycopg2 (not `?` as in SQLite). `ON CONFLICT (name) DO NOTHING` is PostgreSQL's equivalent of SQLite's `INSERT OR IGNORE`.

### Node.js

```js
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://academy_user:password@localhost:5432/academy',
})

async function main() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS languages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      typing VARCHAR(50) NOT NULL,
      paradigm VARCHAR(100) NOT NULL
    )
  `)

  await pool.query(
    'INSERT INTO languages (name, typing, paradigm) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
    ['JavaScript', 'dynamic', 'multi-paradigm']
  )

  const { rows } = await pool.query('SELECT * FROM languages')
  console.log(rows)

  await pool.end()
}

main().catch(console.error)
```

Setup: `npm install pg`

### C\#

```csharp
using Npgsql;

await using var conn = new NpgsqlConnection(
    "Host=localhost;Database=academy;Username=academy_user;Password=password"
);
await conn.OpenAsync();

await using var createCmd = new NpgsqlCommand("""
    CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        typing VARCHAR(50) NOT NULL,
        paradigm VARCHAR(100) NOT NULL
    )
""", conn);
await createCmd.ExecuteNonQueryAsync();

await using var insertCmd = new NpgsqlCommand(
    "INSERT INTO languages (name, typing, paradigm) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
    conn
);
insertCmd.Parameters.AddWithValue("C#");
insertCmd.Parameters.AddWithValue("static");
insertCmd.Parameters.AddWithValue("object-oriented");
await insertCmd.ExecuteNonQueryAsync();

await using var selectCmd = new NpgsqlCommand("SELECT * FROM languages", conn);
await using var reader = await selectCmd.ExecuteReaderAsync();
while (await reader.ReadAsync())
    Console.WriteLine($"{reader["id"]}: {reader["name"]} ({reader["typing"]})");
```

Setup: `dotnet add package Npgsql`

### Go

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "github.com/jackc/pgx/v5/stdlib"
)

func main() {
    db, err := sql.Open("pgx", "postgresql://academy_user:password@localhost:5432/academy")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    _, err = db.Exec(`CREATE TABLE IF NOT EXISTS languages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        typing VARCHAR(50) NOT NULL,
        paradigm VARCHAR(100) NOT NULL
    )`)
    if err != nil {
        log.Fatal(err)
    }

    db.Exec(
        "INSERT INTO languages (name, typing, paradigm) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
        "Go", "static", "procedural",
    )

    rows, err := db.Query("SELECT id, name, typing FROM languages")
    if err != nil {
        log.Fatal(err)
    }
    defer rows.Close()

    for rows.Next() {
        var id int
        var name, typing string
        rows.Scan(&id, &name, &typing)
        fmt.Printf("%d: %s (%s)\n", id, name, typing)
    }
}
```

Setup: `go get github.com/jackc/pgx/v5`

## Environment Variables for Connection Strings

Never hard-code database credentials in source code. Use an environment variable instead:

```sh
export DATABASE_URL="postgresql://academy_user:password@localhost:5432/academy"
```

Reading it in each language:

```python
# Python
import os
conn = psycopg2.connect(os.environ["DATABASE_URL"])
```

```js
// Node.js
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

```csharp
// C#
var connStr = Environment.GetEnvironmentVariable("DATABASE_URL");
await using var conn = new NpgsqlConnection(connStr);
```

```go
// Go
import "os"
db, err := sql.Open("pgx", os.Getenv("DATABASE_URL"))
```

This keeps credentials out of git history and makes it easy to change the database URL between environments (development, staging, production) without changing code.

## Tasks

- Install PostgreSQL and create the `academy` database and `academy_user` as shown above.

- Run all four language examples against the same database. Each program inserts a different language. After all four have run, verify all four rows are present:

```sh
psql -U academy_user -d academy -c "SELECT * FROM languages;"
```

- Move the connection string to a `DATABASE_URL` environment variable in each project and update the code to read from the environment.

- Add a second table `frameworks` with columns `id`, `name`, `language_id` (foreign key to `languages.id`), and `released_year`. Insert at least one framework per language. Then write a `JOIN` query that returns each framework alongside its language name:

```sql
SELECT f.name AS framework, l.name AS language, f.released_year
FROM frameworks f
JOIN languages l ON f.language_id = l.id
ORDER BY l.name, f.name;
```

## Reading / Reference

- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) — SELECT, Joins, and Constraints sections
- [psycopg2 documentation](https://www.psycopg.org/docs/)
- [node-postgres (pg) documentation](https://node-postgres.com/)
- [Npgsql documentation](https://www.npgsql.org/doc/)
- [pgx documentation](https://github.com/jackc/pgx)
