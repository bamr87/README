---
source_file: ai-seed/seed/kernel/CONCEPT.md
source_repo: bamr87/githubai
source_url: https://github.com/bamr87/githubai/blob/main/ai-seed/seed/kernel/CONCEPT.md
title: CONCEPT — __SEED_NAME__
---
# CONCEPT — __SEED_NAME__

This file is the repo's genome: the machine-readable statement of what this repository is and how it grows. Every germinate and grow pass reads it top to bottom before writing anything; §8 is the tick clock that makes growth auditable and resumable. Keep §1–§7 current as the project matures (the verify pass may propose updates in its PR); only the workflow and the verify pass append to §8.

## §1 Vision

## §2 Capabilities

- [ ] Capability 1
- [ ] Capability 2
- [ ] Capability 3

## §3 Architecture intent

## §4 Structure

| Path | Purpose |
|---|---|
| `README.md` | Front door |

## §5 Quality bars

- Every increment ships with tests that pass.
- `python3 .seed/tools/seed.py check .` stays green.

## §6 Sources & references

## §7 Conventions

- Conventional Commits: `type(scope): description`.
- Default branch is `__SEED_DEFAULT_BRANCH__` — all autonomous writes land on `seed/*` branches as draft PRs; never push to the default branch.
- README-First, README-Last: read the nearest `README.md` before changing a directory, and update it after.
- One bounded increment per grow tick.

## §8 Evolution Log

Append-only. One entry per tick, newest last, exact format: `### G<generation>-T<sequence> — <YYYY-MM-DD> — Tick <N>: <short summary>`. Never rewrite or delete existing entries.

### G1-T0 — __SEED_PLANTED__ — Tick 0: planted

**Action**: Kernel planted from __SEED_PLANTED_FROM__ (kernel v__SEED_KERNEL_VERSION__). Awaiting germination.
