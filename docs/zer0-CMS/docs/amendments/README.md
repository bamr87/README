---
source_file: docs/amendments/README.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/docs/amendments/README.md
title: Amendments — zer0-CMS
---
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
| [0003](0003-mission-statement.md) | Missions | proposed | constitution §1; PRD §1.1; ZER0-048 |
