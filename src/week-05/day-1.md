# Day 1 – Python Syntax and Data Structures

## Today's Focus
Get fluent with Python syntax, control flow, and the built-in data structures you will use every day.

## Tasks
- Write a Python script that reads a plain text file of names (one per line) and produces a summary: total count, alphabetically sorted list, names longer than 8 characters, and the most common first letter. Use only built-in functions — no imports yet.
- Implement a function that takes a list of integers and returns a dictionary with keys `"min"`, `"max"`, `"mean"`, and `"median"` computed without using the `statistics` module. Handle the edge case of an empty list by raising a `ValueError` with a clear message.
- Practice list comprehensions and generator expressions: rewrite three `for`-loop solutions as comprehensions. Measure the difference with `timeit` and note which is faster.
- Build a nested data structure representing a small library catalogue (a list of dicts, each with `title`, `author`, `year`, and `tags` as a list). Write functions to filter by tag, sort by year, and search by partial title match.
- Use `try/except/else/finally` to wrap a file-open operation. Catch `FileNotFoundError` separately from a general `Exception`. Print a different message for each case and always close the file in `finally` (or use a `with` statement and explain why it is equivalent).

## Reading / Reference
- [Python Official Tutorial](https://docs.python.org/3/tutorial/) — Chapters 3–5: numbers, strings, lists, flow control, and data structures.
- [Real Python: Python Data Structures](https://realpython.com/python-data-structures/) — a practical tour of lists, dicts, sets, and tuples.
- Python docs: [`timeit` — Measure execution time](https://docs.python.org/3/library/timeit.html).
