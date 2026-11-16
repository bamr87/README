<!-- kit: governance v0.1.0 -->
# 0002 — Missions

- **Status:** proposed
- **Date:** 2026-11-16
- **Proposed by:** Grok Bot (agent), at the maintainer's request
- **Ratified by:**
- **Affects:** constitution §1; PRD.md §1.1; README-012
- **Supersedes:** none
- **Related:** [PRD.md](../../PRD.md) §1.1

## Context

Constitution §1 was a single mission sentence or short paragraph, not one direction statement with exactly three numbered missions. The fleet rule is that every repo's constitution §1 uses that form, adopted through a numbered amendment the maintainer ratifies by merging. Mission 1 is the maintainer's own wording, adapted to this repo: provide data, tools, resources and transparency for all stakeholders, practitioners in the domain, and the general public. The ambition is the direction, not a claim that the work is already finished.

The earlier §1 text was:

> The bamr87 monorepo manages a fleet of independent project repos. Knowledge about the fleet is scattered across dozens of READMEs and doc trees that drift, duplicate, and go stale. Humans can't hold the whole picture; AI agents working on any one repo lack cheap, current context about the others. Hand-maintaining a master README does not scale past a handful of projects.

## Amendment

Retitle constitution §1 **Missions**. Replace the body of §1 with the following. Any invariants or other normative rules that already lived outside §1 are unchanged.

README's direction is to become the ultimate open home for all things fleet knowledge and project context — data, tools, resources and transparency, gathered in one place that anyone can inspect and reuse.

1. **Provide data, tools, resources and transparency for all stakeholders, maintainers, documentation practitioners, agent builders and the general public.** Humans who cannot hold the whole fleet in their head, AI agents working in any one repo, and the general public are first-class audiences. The aim is a shared, open commons: the same sources, the same tools, and the same trail of evidence for everyone.
2. **Make knowledge about every project in the fleet cheap, current and queryable, so humans and AI agents can look it up instead of relying on stale or scattered READMEs.** Crawlers and distillers build that context; an MCP interface is one way to serve it. Hand-maintaining a master README does not scale past a handful of projects — the engine exists so it does not have to.
3. **Put that context in every human's and agent's hands, and make reviewing a repository's documentation against the fleet framework effortless and repeatable.** Serve it as a context pyramid and a review path for every repository — an open toolkit for working with all things fleet knowledge and project context.

These missions set the course; they do not claim the work is finished. They serve the existing constitution and PRD problem statement: fleet knowledge is scattered and goes stale; agents lack cheap, current context. The earlier §1 paragraph is absorbed into these three. Every feature must trace to them.

_Source: [../PRD.md](../PRD.md) §1.1._

## Consequences

Agents and reviewers judge fit against these three missions before inventing scope, treating them as the direction of the repo rather than a description of what already ships. The same text is added as PRD.md §1.1 so the constitution's `_Source:` line stays accurate. The PRD purpose, goals, feature catalog and invariants outside this addition are unchanged except for a new catalog entry (README-012) and a regenerated feature-catalog block where the repo already has one. This PR also aligns the README and AGENTS.md one-liners with the missions and links them to constitution §1.
