---
source_file: docs/amendments/README.md
source_repo: bamr87/gitorio
source_url: https://github.com/bamr87/gitorio/blob/main/docs/amendments/README.md
title: Amendments — gitorio
---
<!-- kit: governance v0.1.0 -->
# Amendments — gitorio

The append-only log of changes to [the constitution](../constitution.md). Process: constitution § 8.

- File name: `NNNN-kebab-slug.md`, next free number, never reused. Copy [0000-template.md](0000-template.md).
- Status: `proposed` → `ratified` (PR merged) | `rejected` | `withdrawn` | `superseded`.
- Validate: `python3 <bamr87/bamr87>/tools/governance_lint.py check .`

| # | Title | Status | Affects |
| --- | --- | --- | --- |
| [0001](0001-ratify-constitution.md) | Ratify the constitution | ratified on merge | whole constitution |
