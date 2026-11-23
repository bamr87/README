---
source_file: docs/README.md
source_repo: bamr87/cv-pro
source_url: https://github.com/bamr87/cv-pro/blob/main/docs/README.md
title: cv-pro documentation
---
# cv-pro documentation

> Every document in this repository, one line each: start with the root README, and see AGENTS.md for how to work here.

**Backlog of record:** GitHub Issues with the fleet labels. The repo's SDLC declaration (type, backlog mode, modules) is [`.github/sdlc.yml`](../dot-github/sdlc.yml). Each half, `cv/` and `app/`, keeps its own README, AGENTS.md and CHANGELOG; they are listed below through their READMEs.

### Repository root

| Document | What it covers |
| --- | --- |
| [`AGENTS.md`](../AGENTS.md) | CV Pro's direction is to become the ultimate open home for all things professional CVs: data, tools, resources and transparency, with CVs as code, LaTeX typesetting, reviewed AI parsing and multi-format export for everyone… |
| [`CHANGELOG.md`](../CHANGELOG.md) | Release history: the notable changes in each version, newest first. |
| [`app/`](../app/README.md) | React web app for building CVs and résumés with LaTeX templates, Markdown/PDF export and optional AI parsing. |
| [`cv/`](../cv/README.md) | Amr's CV as code: one cv.json rendered to Markdown, LaTeX, HTML and PDF, with automated publishing and releases. |

### `docs/`

| Document | What it covers |
| --- | --- |
| [`docs/constitution.md`](constitution.md) | The rules every change to this repo must satisfy, whoever makes it — a human or an AI agent. Agents read this before [AGENTS.md](../AGENTS.md) conventions, the [PRD](../PRD.md), or the [feature catalog](../features/features.yml). Ratified… |
| [`docs/adr/`](adr/README.md) | The architecture decision log for cv-pro: when to write an ADR, the format, and the list of decisions. |
| [`docs/amendments/`](amendments/README.md) | The append-only log of changes to [the constitution](constitution.md), one numbered record per amendment. |
