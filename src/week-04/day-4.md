# Day 4 – MongoDB: Document Databases

## Today's Focus

Learn what a document database is, understand when schema flexibility is valuable, and connect to MongoDB from all four languages to perform CRUD operations.

## What is a Document Database?

In MongoDB, data is stored as BSON documents (Binary JSON) in collections. There is no fixed schema — different documents in the same collection can have different fields.

This is useful when:

- The data structure varies between records (e.g. products with different attributes)
- You need to store nested objects or arrays naturally without joins
- The schema evolves rapidly during development
- You are storing event logs, user activity, or content that does not fit neatly into rows and columns

## Relational vs Document: The Same Data, Two Models

The same "language with frameworks" data looks very different in each model.

Relational — two tables, requires a JOIN:

```sql
SELECT l.name, f.name
FROM languages l
JOIN frameworks f ON f.language_id = l.id
```

Document — one document per language with an embedded array:

```json
{
  "name": "Python",
  "typing": "dynamic",
  "frameworks": ["FastAPI", "Django", "Flask"]
}
```

The document approach avoids the JOIN and makes reads simpler when you always want the full language with its frameworks. The trade-off: if you need to query frameworks independently (e.g. "which language uses Django?"), the document model requires scanning all documents or building an index on the array field.

Neither model is universally better. The right choice depends on how the data is accessed.

## Installing MongoDB

macOS:

```sh
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

Linux: follow the official apt repository instructions at [docs.mongodb.com](https://www.mongodb.com/docs/manual/administration/install-on-linux/).

Verify:

```sh
mongosh --version
mongosh
```

## MongoDB Shell Basics

```js
use academy

db.languages.insertOne({ name: "Python", typing: "dynamic", frameworks: ["FastAPI", "Django"] })

db.languages.find()

db.languages.find({ typing: "static" })

db.languages.updateOne(
  { name: "Python" },
  { $push: { frameworks: "Flask" } }
)

db.languages.deleteOne({ name: "Python" })
```

## MongoDB in All Four Languages

### Python

```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["academy"]
collection = db["languages"]

collection.drop()  # start fresh each run

collection.insert_many([
    {"name": "Python", "typing": "dynamic", "paradigm": "multi-paradigm", "frameworks": ["FastAPI", "Django"]},
    {"name": "JavaScript", "typing": "dynamic", "paradigm": "multi-paradigm", "frameworks": ["Express", "Next.js"]},
    {"name": "C#", "typing": "static", "paradigm": "object-oriented", "frameworks": ["ASP.NET Core"]},
    {"name": "Go", "typing": "static", "paradigm": "procedural", "frameworks": ["Gin", "Echo"]},
])

for doc in collection.find({"typing": "static"}):
    print(doc["name"], doc.get("frameworks", []))

collection.update_one({"name": "Go"}, {"$push": {"frameworks": "Fiber"}})
print(collection.find_one({"name": "Go"}))
```

Setup: `uv add pymongo`

### Node.js

```js
const { MongoClient } = require('mongodb')

async function main() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()

  const db = client.db('academy')
  const coll = db.collection('languages')

  await coll.drop().catch(() => {})  // ignore error if collection does not exist

  await coll.insertMany([
    { name: 'Python', typing: 'dynamic', frameworks: ['FastAPI', 'Django'] },
    { name: 'JavaScript', typing: 'dynamic', frameworks: ['Express', 'Next.js'] },
    { name: 'C#', typing: 'static', frameworks: ['ASP.NET Core'] },
    { name: 'Go', typing: 'static', frameworks: ['Gin', 'Echo'] },
  ])

  const staticLangs = await coll.find({ typing: 'static' }).toArray()
  console.log(staticLangs.map(l => l.name))

  await coll.updateOne({ name: 'Go' }, { $push: { frameworks: 'Fiber' } })

  await client.close()
}

main().catch(console.error)
```

Setup: `npm install mongodb`

### C\#

```csharp
using MongoDB.Driver;
using MongoDB.Bson;

var client = new MongoClient("mongodb://localhost:27017");
var db = client.GetDatabase("academy");
var coll = db.GetCollection<BsonDocument>("languages");

await coll.DeleteManyAsync(new BsonDocument());

await coll.InsertManyAsync(new[]
{
    new BsonDocument
    {
        ["name"] = "Python",
        ["typing"] = "dynamic",
        ["frameworks"] = new BsonArray { "FastAPI", "Django" },
    },
    new BsonDocument
    {
        ["name"] = "JavaScript",
        ["typing"] = "dynamic",
        ["frameworks"] = new BsonArray { "Express" },
    },
    new BsonDocument
    {
        ["name"] = "C#",
        ["typing"] = "static",
        ["frameworks"] = new BsonArray { "ASP.NET Core" },
    },
    new BsonDocument
    {
        ["name"] = "Go",
        ["typing"] = "static",
        ["frameworks"] = new BsonArray { "Gin", "Echo" },
    },
});

var filter = Builders<BsonDocument>.Filter.Eq("typing", "static");
var docs = await coll.Find(filter).ToListAsync();
foreach (var doc in docs)
    Console.WriteLine($"{doc["name"]}: {doc["frameworks"]}");
```

Setup: `dotnet add package MongoDB.Driver`

### Go

```go
package main

import (
    "context"
    "fmt"
    "log"

    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
    ctx := context.Background()
    client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        log.Fatal(err)
    }
    defer client.Disconnect(ctx)

    coll := client.Database("academy").Collection("languages")
    coll.Drop(ctx)

    docs := []interface{}{
        bson.D{{"name", "Python"}, {"typing", "dynamic"}, {"frameworks", bson.A{"FastAPI", "Django"}}},
        bson.D{{"name", "JavaScript"}, {"typing", "dynamic"}, {"frameworks", bson.A{"Express"}}},
        bson.D{{"name", "C#"}, {"typing", "static"}, {"frameworks", bson.A{"ASP.NET Core"}}},
        bson.D{{"name", "Go"}, {"typing", "static"}, {"frameworks", bson.A{"Gin", "Echo"}}},
    }
    coll.InsertMany(ctx, docs)

    cursor, err := coll.Find(ctx, bson.D{{"typing", "static"}})
    if err != nil {
        log.Fatal(err)
    }
    defer cursor.Close(ctx)

    for cursor.Next(ctx) {
        var result bson.M
        cursor.Decode(&result)
        fmt.Println(result["name"], result["frameworks"])
    }
}
```

Setup: `go get go.mongodb.org/mongo-driver/mongo`

## Tasks

- Install MongoDB and verify it is running:

```sh
mongosh
db.runCommand({ ping: 1 })
```

- Run all four language examples. After each one, open `mongosh`, switch to the `academy` database, and inspect the documents:

```js
use academy
db.languages.find().pretty()
```

- Add a `year_created` field to the Python document only, using an update from whichever language you prefer:

```python
collection.update_one({"name": "Python"}, {"$set": {"year_created": 1991}})
```

Then run `db.languages.find()` in `mongosh` and observe that only the Python document has `year_created`. The other documents are unaffected. This is schema flexibility in action.

- Research the correct MongoDB query operator to find documents whose `frameworks` array contains more than one entry. The `$size` operator matches arrays of an exact length, but for "greater than", you need a different approach — look up `$where` and `$expr` in the MongoDB documentation, or use `$exists` with `$gt` on an index. Write the query that works.

- Discuss: when would you choose MongoDB over PostgreSQL for the `languages` data? When would PostgreSQL be the better fit? Consider: what queries do you need? How often does the schema change? Do you need transactions across multiple documents?

## Reading / Reference

- [MongoDB CRUD Operations](https://www.mongodb.com/docs/manual/crud/)
- [PyMongo documentation](https://pymongo.readthedocs.io/)
- [MongoDB Node.js Driver documentation](https://www.mongodb.com/docs/drivers/node/current/)
- [MongoDB.Driver for C# documentation](https://www.mongodb.com/docs/drivers/csharp/current/)
- [mongo-go-driver documentation](https://www.mongodb.com/docs/drivers/go/current/)
