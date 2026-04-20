# Day 2 – Modules and CLI Utilities

## Today's Focus
Structure Python code into functions and modules, and build a small CLI utility that reads and parses real data.

## Tasks
- Refactor yesterday's library catalogue code into a proper module structure: `catalogue/models.py` (data structures), `catalogue/filters.py` (filter/search logic), `catalogue/cli.py` (entry point). Use relative imports between them.
- Write a CLI utility using `argparse` that accepts a CSV file path and one of the subcommands `summary`, `filter`, or `sort`. Each subcommand should have its own arguments (e.g. `filter --column genre --value fiction`).
- Parse the CSV using the `csv` module (not pandas). Validate that required columns exist; if not, print a helpful error message and exit with code `1`.
- Add a `--verbose` flag that enables debug-level logging using the `logging` module. Use `logging.DEBUG` statements throughout your parsing logic so they appear only when the flag is set.
- Write a `__main__.py` so your package can be run with `python -m catalogue`. Test it works from a clean directory.
- Add docstrings (Google or NumPy style) to every function. Run `pydoc catalogue.filters` to confirm they render correctly.

## Reading / Reference
- Python docs: [argparse tutorial](https://docs.python.org/3/howto/argparse.html).
- Python docs: [logging HOWTO](https://docs.python.org/3/howto/logging.html) — the basic and intermediate sections.
- [Real Python: Python Modules and Packages](https://realpython.com/python-modules-packages/).
