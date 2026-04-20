# Day 2 – SQLite: Relational Databases in All Four Languages

## Today's Focus

Learn SQL fundamentals using SQLite — a relational database stored in a single file with no server to run. SQLite is ideal for learning because it requires no installation beyond the language library.

## What is SQLite?

SQLite is a relational database engine embedded directly in the application. Instead of connecting to a server, you open a file. The entire database lives in a single `.db` file on disk.

It is the most widely deployed database in the world — used in every smartphone, browser, and many desktop applications. Every iOS and Android device runs SQLite. Every Chrome and Firefox installation uses SQLite internally.

For learning SQL and for small applications where a full server would be overkill, it is the right choice.

## SQL Fundamentals

The core SQL statements you need to know:

```sql
-- Create a table
CREATE TABLE languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    typing TEXT NOT NULL,
    paradigm TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Insert rows
INSERT INTO languages (name, typing, paradigm) VALUES
    ('Python', 'dynamic', 'multi-paradigm'),
    ('JavaScript', 'dynamic', 'multi-paradigm'),
    ('C#', 'static', 'object-oriented'),
    ('Go', 'static', 'procedural');

-- Select all rows
SELECT * FROM languages;

-- Filter and sort
SELECT name, typing FROM languages WHERE typing = 'static' ORDER BY name;

-- Update a row
UPDATE languages SET paradigm = 'compiled procedural' WHERE name = 'Go';

-- Delete a row
DELETE FROM languages WHERE name = 'JavaScript';

-- Remove the table entirely
DROP TABLE languages;
```

Key points:

- `PRIMARY KEY AUTOINCREMENT` — SQLite assigns a unique integer id automatically
- `NOT NULL` — the database rejects rows that omit this column
- `UNIQUE` — the database rejects duplicate values in this column
- `DEFAULT` — used when no value is provided on insert
- `WHERE` — filters rows; without it, UPDATE and DELETE affect every row

## SQLite in All Four Languages

### Python

Python includes `sqlite3` in the standard library — no installation needed.

```python
import sqlite3

conn = sqlite3.connect("languages.db")
conn.row_factory = sqlite3.Row  # rows behave like dicts

cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        typing TEXT NOT NULL,
        paradigm TEXT NOT NULL
    )
""")

cur.execute(
    "INSERT OR IGNORE INTO languages (name, typing, paradigm) VALUES (?, ?, ?)",
    ("Python", "dynamic", "multi-paradigm")
)
conn.commit()

rows = cur.execute("SELECT * FROM languages").fetchall()
for row in rows:
    print(dict(row))

conn.close()
```

Run with: `uv run python main.py`

### Node.js

Install `better-sqlite3`, which provides a synchronous API that is easier to follow for learning:

```js
const Database = require('better-sqlite3')

const db = new Database('languages.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    typing TEXT NOT NULL,
    paradigm TEXT NOT NULL
  )
`)

const insert = db.prepare(
  'INSERT OR IGNORE INTO languages (name, typing, paradigm) VALUES (?, ?, ?)'
)
insert.run('JavaScript', 'dynamic', 'multi-paradigm')

const rows = db.prepare('SELECT * FROM languages').all()
console.log(rows)
```

Setup: `npm install better-sqlite3`

### C\#

Install `Microsoft.Data.Sqlite`:

```csharp
using Microsoft.Data.Sqlite;

using var conn = new SqliteConnection("Data Source=languages.db");
conn.Open();

var createCmd = conn.CreateCommand();
createCmd.CommandText = """
    CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        typing TEXT NOT NULL,
        paradigm TEXT NOT NULL
    )
""";
createCmd.ExecuteNonQuery();

var insertCmd = conn.CreateCommand();
insertCmd.CommandText =
    "INSERT OR IGNORE INTO languages (name, typing, paradigm) VALUES ($name, $typing, $paradigm)";
insertCmd.Parameters.AddWithValue("$name", "C#");
insertCmd.Parameters.AddWithValue("$typing", "static");
insertCmd.Parameters.AddWithValue("$paradigm", "object-oriented");
insertCmd.ExecuteNonQuery();

var selectCmd = conn.CreateCommand();
selectCmd.CommandText = "SELECT * FROM languages";
using var reader = selectCmd.ExecuteReader();
while (reader.Read())
    Console.WriteLine($"{reader["id"]}: {reader["name"]} ({reader["typing"]})");
```

Setup: `dotnet add package Microsoft.Data.Sqlite`

### Go

Use `database/sql` (stdlib) with the `modernc.org/sqlite` driver (pure Go, no CGO required):

```go
package main

import (
    "database/sql"
    "fmt"
    "log"

    _ "modernc.org/sqlite"
)

func main() {
    db, err := sql.Open("sqlite", "languages.db")
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    _, err = db.Exec(`CREATE TABLE IF NOT EXISTS languages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        typing TEXT NOT NULL,
        paradigm TEXT NOT NULL
    )`)
    if err != nil {
        log.Fatal(err)
    }

    db.Exec(
        "INSERT OR IGNORE INTO languages (name, typing, paradigm) VALUES (?, ?, ?)",
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

Setup: `go get modernc.org/sqlite`

## A Note on Parameterised Queries

Every example above uses placeholders (`?` in Python, Node.js, and Go; `$name` in C#) instead of building SQL by concatenating strings. This is not just style — it is a security requirement.

If you interpolate user input directly into a SQL string, an attacker can inject arbitrary SQL. For example, if `name` comes from a form and contains `'; DROP TABLE languages; --`, a naive concatenation would execute that DROP. Parameterised queries pass the value separately from the SQL text, so the database driver handles escaping correctly and the injection is impossible.

**Never build SQL queries by string concatenation with user-supplied input.**

## Tasks

- Run each example in its own project directory. Confirm all four create a `languages.db` file and insert a row.

- Add a fifth language (`Rust`, `static`, `systems`) by running an INSERT from each language's code. After all four programs have run, open the SQLite file and verify five rows exist.

- Add a `SELECT` with a `WHERE` clause that filters by `typing = 'static'` and verify only the static languages appear.

- Try to insert the same language name twice (remove the `OR IGNORE` qualifier). Observe the UNIQUE constraint error. Then add error handling that catches the constraint violation and prints a helpful message instead of crashing.

- Open the SQLite file from the command line and explore it:

```sh
sqlite3 languages.db
.tables
.schema languages
SELECT * FROM languages;
.quit
```

## Reading / Reference

- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [SQLite Tutorial](https://www.sqlitetutorial.net/) — covers all core SQL with SQLite-specific examples
- [better-sqlite3 documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [modernc.org/sqlite README](https://pkg.go.dev/modernc.org/sqlite)
