# Day 5 – Packaging and Publishing

## Today's Focus
Audit your dependencies for vulnerabilities, understand lock files, and publish a minimal package to TestPyPI.

## Tasks
- Run `pip-audit` (install with `pip install pip-audit`) against your project's dependencies. Read the output and look up at least one reported CVE on the [NVD database](https://nvd.nist.gov/). Upgrade the affected package and re-run to confirm it is clean.
- Examine your lock file (`requirements.txt`, `Pipfile.lock`, or `poetry.lock`): find a transitive dependency (a package your package depends on but you did not list directly) and trace back which of your direct dependencies pulled it in.
- Add `pip-audit` to your `Makefile` as `make audit` and wire it into your CI-equivalent flow: `make install && make lint && make test && make audit` should all pass.
- Prepare your package for distribution: ensure `pyproject.toml` has all required fields (`name`, `version`, `description`, `license`, `authors`, `readme`). Build with `python -m build` and inspect the generated `.whl` and `.tar.gz` in `dist/`.
- Publish to [TestPyPI](https://test.pypi.org/) using `twine upload --repository testpypi dist/*`. Install it back from TestPyPI in a fresh venv and confirm it works: `pip install --index-url https://test.pypi.org/simple/ your-package`.
- Write a `CHANGELOG.md` entry for `v0.1.0` using the [Keep a Changelog](https://keepachangelog.com/) format. List Added, Changed, and Fixed sections.

## Reading / Reference
- [pip-audit documentation](https://pypi.org/project/pip-audit/).
- [Python Packaging User Guide: Packaging and distributing projects](https://packaging.python.org/en/latest/guides/distributing-packages-using-setuptools/).
- [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) — the format most Python projects use for release notes.
