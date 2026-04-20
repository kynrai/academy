# Day 4 – Virtual Envs and Dependencies

## Today's Focus
Set up a professional Python project with virtual environments, dependency management, and a reproducible install.

## Tasks
- Create a fresh project directory and set up a virtual environment three ways: `python -m venv .venv`, then `pipenv install`, then `poetry init`. Compare the resulting files (`requirements.txt` vs `Pipfile` vs `pyproject.toml`). Pick one approach and stick with it for the rest of the week.
- Using your chosen tool, add `pytest`, `ruff`, and `black` as dev dependencies and your project's runtime dependencies separately. Confirm they appear in the correct dependency groups.
- Pin all dependencies to exact versions: `pip freeze > requirements.txt` (for venv) or equivalent. Explain in a comment why pinning matters for reproducibility in CI.
- Write a `pyproject.toml` that defines your project metadata (`name`, `version`, `description`, `requires-python`) alongside `[tool.ruff]` and `[tool.black]` config sections.
- Create a `Makefile` with targets: `make install` (set up venv and install deps), `make test` (run pytest), `make lint` (run ruff and black --check), `make format` (run black). Test each target from scratch in a new shell.
- Delete your virtual environment, run `make install`, and confirm all tests still pass — this validates your lockfile / pinned deps.

## Reading / Reference
- [Python Packaging User Guide](https://packaging.python.org/en/latest/) — the "Managing Application Dependencies" tutorial.
- [Poetry documentation](https://python-poetry.org/docs/) — Dependency specification and Dependency groups.
- [Ruff documentation](https://docs.astral.sh/ruff/) — Rules reference and pyproject.toml configuration.
