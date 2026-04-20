# Weekend Challenges

## Extended Challenges
- **Data pipeline**: Write a Python script that downloads a public dataset (e.g. [NYC taxi data](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page) or a CSV from [Our World in Data](https://ourworldindata.org/)), validates every row against a schema (use `pydantic` or manual checks), transforms the data, and writes a cleaned output file. Handle malformed rows gracefully with a log entry and a skip.
- **Type annotations**: Add type hints to every function in your project. Install `mypy` and run `mypy catalogue/ --strict`. Fix every error until `mypy` exits cleanly. Notice how type errors reveal logic bugs.
- **Publish a real CLI tool**: Package your Week 3 CLI utility as a proper Python package with an `[project.scripts]` entry point in `pyproject.toml`. Install it locally with `pip install -e .` and run it by name from any directory.
- **Concurrency exploration**: Rewrite a slow loop (e.g. fetching data from 20 URLs sequentially) using `asyncio` with `aiohttp` or `httpx`. Compare the wall-clock time of the sequential vs async version using `time` or `timeit`.
- **Hypothesis property-based testing**: Install `hypothesis` and write a property-based test for your statistics function: assert that `mean` is always between `min` and `max` for any non-empty list of integers. Let Hypothesis find edge cases you would not have thought of.

## Recommended Reading
- [Fluent Python (2nd ed.) by Luciano Ramalho](https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/) — Chapters 1–3 on data model and sequences.
- [Python Concurrency with asyncio by Matthew Fowler](https://www.manning.com/books/python-concurrency-with-asyncio) — or the free [asyncio docs HOWTO](https://docs.python.org/3/library/asyncio.html).
- [Hypermodern Python](https://cjolowicz.github.io/posts/hypermodern-python-01-setup/) — a blog series on modern Python project tooling (nox, poetry, mypy, etc.).
- [Python Security Best Practices](https://snyk.io/blog/python-security-best-practices-cheat-sheet/) — Snyk's cheat sheet.

## Reflection
- How does a lock file differ from a pinned `requirements.txt`? In what scenario could even a pinned requirements file produce a different environment on two machines?
- What is the difference between a direct dependency and a transitive dependency? Who is responsible for fixing a vulnerability in a transitive dependency?
- Why is `mypy --strict` significantly more demanding than basic type hints? What categories of bugs did it find in your code?
- When would you choose `asyncio` over `threading` over `multiprocessing` in Python? What is the GIL and why does it matter?
- Review your test suite: are you testing behaviour or implementation? If you refactored the internals of a function without changing its public interface, should your tests still pass?
