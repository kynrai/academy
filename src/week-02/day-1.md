# Day 1 – Python: Installation, Environments, and uv

## Today's Focus

Install Python correctly, understand why virtual environments exist and how to use them, and get familiar with `uv` — the modern Python project manager that replaces `pip` and `venv` with a single fast tool.

## Installing Python

Install Python via your OS package manager so it integrates with your system PATH and receives updates automatically. Avoid downloading installers from python.org — they create isolated copies that are harder to manage.

**macOS (Homebrew):**

```sh
brew install python
python3 --version
pip3 --version
```

**Linux (apt):**

```sh
sudo apt update && sudo apt install python3 python3-pip
python3 --version
```

### Managing Multiple Python Versions

Different projects sometimes require different Python versions. **pyenv** lets you install and switch between them without affecting the system Python:

```sh
brew install pyenv           # macOS
# or: curl https://pyenv.run | bash   # Linux

pyenv install 3.12.0
pyenv install 3.11.8
pyenv global 3.12.0          # set the default
python3 --version

pyenv local 3.11.8           # pin a specific version for the current directory
cat .python-version          # pyenv reads this file automatically
```

## Why Python Needs Virtual Environments

Python installs packages into a single global location shared by every project. This causes conflicts:

- Project A requires `requests==2.28.0`
- Project B requires `requests==2.31.0`
- Only one version can be installed globally at a time

A **virtual environment** is an isolated copy of Python and pip scoped to one directory. Packages installed inside it are invisible to everything outside.

### Using venv (the built-in tool)

```sh
python3 -m venv .venv
source .venv/bin/activate       # macOS / Linux
# .venv\Scripts\activate        # Windows

pip install requests
pip list                        # only shows packages in this env

deactivate                      # leave the environment
```

You must `source .venv/bin/activate` in every new terminal session — there is no automatic activation.

### Tracking dependencies with pip

```sh
pip install requests fastapi uvicorn
pip freeze > requirements.txt   # snapshot current packages
pip install -r requirements.txt # restore on another machine
```

The problem with `pip freeze` is that it captures every transitive dependency at whatever version happened to be installed. There is no proper lock file, and `requirements.txt` files drift over time.

## uv — A Better Alternative

**uv** is a Python package and project manager written in Rust. It replaces `pip`, `venv`, and `pip-tools` with one tool that is significantly faster and more reliable.

| Feature | pip + venv | uv |
| ------- | ---------- | -- |
| Dependency resolution speed | Slow (pure Python) | 10–100× faster (Rust) |
| Lock file | Manual (`pip freeze`) | Automatic (`uv.lock`) |
| Virtual environment | Manual (`python -m venv`) | Automatic, per project |
| Python version pinning | Requires pyenv separately | Built in (`uv python pin`) |
| Reproducible installs | Fragile | Guaranteed via lock file |

### Installing uv

```sh
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.zshrc
uv --version
```

### Starting a project with uv

```sh
mkdir ~/projects/hello-python && cd ~/projects/hello-python
uv init
```

This creates:

- `pyproject.toml` — project metadata and dependencies
- `.python-version` — the pinned Python version
- `hello_python.py` — a starter script
- `uv.lock` — the lock file (generated on first `uv sync`)

```sh
uv add requests          # installs and records in pyproject.toml
uv run python hello_python.py
```

`uv run` automatically creates and activates the virtual environment for that command. You never need to manually activate anything.

## Writing and Running Python

Edit `hello_python.py`:

```python
name = "Academy"
languages = ["Python", "JavaScript", "Go", "C#"]

print(f"Hello from {name}!")
print(f"This course covers: {', '.join(languages)}")

for i, lang in enumerate(languages, 1):
    print(f"  {i}. {lang}")
```

Run it:

```sh
uv run python hello_python.py
```

## Tasks

- Install Python 3 via Homebrew or apt and verify with `python3 --version`.
- Install pyenv and use it to install two Python versions. Use `pyenv local` to pin one version in a test directory and confirm `python3 --version` reflects it.
- Create a project with `python3 -m venv .venv`, activate it, install a package with `pip`, run `pip list`, then deactivate and confirm the package is gone.
- Install `uv`. Create a new project with `uv init`, add a dependency, and run a script with `uv run`. Inspect `pyproject.toml` and `uv.lock` — note what each file contains.
- Write a Python script that prints a message using an f-string, loops over a list, and calls a function you define. Run it with `uv run`.

## Reading / Reference

- [uv documentation](https://docs.astral.sh/uv/)
- [pyenv README](https://github.com/pyenv/pyenv)
- [Real Python: Python Virtual Environments primer](https://realpython.com/python-virtual-environments-a-primer/)
- [Python packaging user guide](https://packaging.python.org/en/latest/)
