---
schema: "0.1"
coverage: listed
---

# SCHEMA — tests

> Unit + integration harness. The custom runner (`test_runner.py`) is the
> intended entry point; unit cases live under `unit/test_cases/`.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `README.md` | file | Testing guide | required |
| `SCHEMA.md` | file | This file | required |
| `TESTING_FRAMEWORK.md` | file | Test architecture documentation | |
| `__init__.py` | file | Package marker | required |
| `config.py` | file | Test configuration (integration repos, output paths) | required |
| `fixtures/` | dir | Test data and fixtures | |
| `integration/` | dir | Integration tests (clone real repos; network required) | terminal |
| `results/` | dir | Runner output artifacts | generated |
| `test-docs/` | dir | Sample markdown fixtures | terminal |
| `test_runner.py` | file | Main runner (`--type` unit, integration, all, quick) | required |
| `unit/` | dir | Unit runner + `test_cases/` (unittest discovery) | terminal |

## Placement

- New unit test module → `unit/test_cases/test_*.py` (unittest.TestCase;
  discovered automatically by the runner and pytest).
