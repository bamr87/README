---
author: bamr87
categories:
- docs
date: 2026-11-14 00:00:00+00:00
description: Why this repository keeps a numbered log of decisions that are hard to
  reverse, in docs/adr/, and how a record is written.
lastmod: 2026-11-14 00:00:00+00:00
source_file: docs/adr/0001-record-architecture-decisions.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/docs/adr/0001-record-architecture-decisions.md
tags:
- architecture
- adr
- decisions
title: 'ADR 0001: Record architecture decisions'
---

# ADR 0001 — Record architecture decisions

- **Status**: accepted
- **Date**: 2026-11-14
- **Deciders**: the maintainers
- **Related**: bamr87/bamr87 `specs/WORK.md` UPS-WORK-04

## Context

Decisions that are hard to reverse (stack, data model, security model, public interfaces) get made in issues, PR threads and chat, and the reasoning is lost. New contributors, human or agent, then re-open settled questions or undo them by accident.

## Decision

Record every such decision as an Architecture Decision Record in `docs/adr/NNNN-slug.md`, in the fleet format (decision D2 of the bamr87 SDLC harmonization), indexed in `docs/adr/README.md`, and merged in or before the PR that implements it. `AGENTS.md § Conventions` points here.

## Consequences

### Positive

- The reason behind each lasting choice is one link away.
- Agents can check a proposed change against accepted ADRs before making it.

### Negative

- A small writing cost on the PRs that need an ADR.

## Alternatives considered

- **A single `DECISIONS.md` log** — harder to link, review and supersede one decision at a time.
- **Decisions in issues only** — not versioned with the code, and lost when the tracker changes.

## Supersedes / Superseded by

- Supersedes: none
- Superseded by: none
