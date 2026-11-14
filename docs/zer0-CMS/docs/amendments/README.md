---
source_file: docs/amendments/README.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/docs/amendments/README.md
title: Amendments — zer0-CMS
---
<!-- kit: governance v0.1.0 -->
# Amendments — zer0-CMS

> The numbered, append-only record of every change to the constitution, with its status.

The append-only log of changes to [the constitution](../constitution.md). Process: constitution § 8.

- File name: `NNNN-kebab-slug.md`, next free number, never reused. Copy [0000-template.md](0000-template.md).
- Status: `proposed` → `ratified` (PR merged) | `rejected` | `withdrawn` | `superseded`.
- Validate: `python3 <bamr87/bamr87>/tools/governance_lint.py check .`

| # | Title | Status | Affects |
| --- | --- | --- | --- |
| [0001](0001-ratify-constitution.md) | Ratify the constitution | ratified on merge | whole constitution |
| [0002](0002-retire-the-rails-invariants.md) | Retire the Rails invariants | proposed | constitution §2 |
