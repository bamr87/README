---
source_file: docs/amendments/README.md
source_repo: bamr87/cv-pro
source_url: https://github.com/bamr87/cv-pro/blob/main/docs/amendments/README.md
title: Amendments — cv-pro
---
# Amendments — cv-pro

> The append-only log of changes to [the constitution](../constitution.md), one numbered record per amendment.

Process: constitution § 8.

- File name: `NNNN-kebab-slug.md`, next free number, never reused. Copy [0000-template.md](0000-template.md).
- Status: `proposed` → `ratified` (PR merged) | `rejected` | `withdrawn` | `superseded`.
- Validate: `python3 <bamr87/bamr87>/tools/governance_lint.py check .`

| # | Title | Status | Affects |
| --- | --- | --- | --- |
| [0001](0001-ratify-constitution.md) | Ratify the constitution | ratified on merge | whole constitution |
