# Day 3 – Testing with pytest

## Today's Focus
Write unit tests with pytest: test the logic you have built, handle edge cases, and understand what good test coverage looks like.

## Tasks
- Install `pytest` and write a `tests/` directory alongside your `catalogue/` package. Write at least 10 unit tests covering: normal cases, boundary conditions (empty input, single item), and expected exceptions.
- Use `pytest.mark.parametrize` to test your filter function against a table of inputs and expected outputs instead of writing a separate test for each case.
- Write a test that uses `tmp_path` (pytest's built-in fixture) to create a temporary CSV file, run your CLI against it, and assert the output. This tests file I/O without touching real files.
- Mock an external call (e.g. pretend your CSV loader calls an HTTP endpoint) using `unittest.mock.patch`. Assert the mock was called with the correct arguments.
- Run `pytest --cov=catalogue --cov-report=term-missing` (install `pytest-cov`) and aim for at least 80% coverage. Identify which branches are untested and add tests for them.
- Configure `pytest` in `pyproject.toml` with `[tool.pytest.ini_options]`: set `testpaths = ["tests"]`, enable warnings as errors, and add a custom marker `slow` that you can skip with `-m "not slow"`.

## Reading / Reference
- [pytest documentation](https://docs.pytest.org/en/stable/) — Getting Started, How-to guides for fixtures and parametrize.
- [Real Python: Effective Python Testing with pytest](https://realpython.com/pytest-python-testing/).
- Python docs: [`unittest.mock`](https://docs.python.org/3/library/unittest.mock.html) — the Mock and patch sections.
