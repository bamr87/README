---
source_file: docs/README.md
source_repo: bamr87/scripts
source_url: https://github.com/bamr87/scripts/blob/main/docs/README.md
title: scripts documentation
---
# scripts documentation

> Every document in this repository, one line each: start with the root README's tool index, and see AGENTS.md for how to work here.

**Backlog of record:** GitHub Issues with the fleet labels. The repo's SDLC declaration (type, backlog mode, modules) is [`.github/sdlc.yml`](../dot-github/sdlc.yml). Each script's `--help` is the authoritative list of its flags.

### Repository root

| Document | What it covers |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | scripts' direction is to become the ultimate open home for all things project and repository automation: data, tools, resources and transparency, with standalone Bash utilities for scaffolding, GitHub management and multi-repo maintenance… |
| [`CHANGELOG.md`](../CHANGELOG.md) | Release history: the notable changes in each version, newest first. |
| [`SECURITY.md`](../SECURITY.md) | Which version is supported (the tip of main) and how to report a vulnerability privately. |
| [`PRD.md`](../PRD.md) | The product requirements for bamr87/scripts: the problem, users, goals, features, requirements, success measures and open questions. |
| [`FORKME/`](../FORKME/README.md) | ForkMe at a glance: what it does, its prerequisites, a quick start, and where each ForkMe document lives. |
| [`STASHME/`](../STASHME/README.md) | StashMe at a glance: what it does, how it works, its use cases, and where each StashMe document lives. |
| [`tools/`](../tools/README.md) | The maintenance tools in tools/, both vendored from the hub, and what each one does. |

### `docs/`

| Document | What it covers |
| --- | --- |
| [`docs/constitution.md`](constitution.md) | The rules every change to this repo must satisfy, whoever makes it — a human or an AI agent. Agents read this before [AGENTS.md](../AGENTS.md) conventions, the [PRD](../PRD.md), or the [feature catalog](../features/features.yml). Ratified… |
| [`docs/rename-directory-quick-reference.md`](rename-directory-quick-reference.md) | How to use rename-directory.sh: common renames, previews and unattended runs, the pre-flight checks and prompts, what is preserved, follow-up steps and recovering from a backup. |
| [`docs/adr/`](adr/README.md) | The architecture decision log for this repo: when to write an ADR, the format, and the list of decisions. |
| [`docs/amendments/`](amendments/README.md) | The append-only log of changes to [the constitution](constitution.md). |
