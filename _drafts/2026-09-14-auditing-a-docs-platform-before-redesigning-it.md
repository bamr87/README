---
title: "Audit Before You Redesign: Lessons From a Docs Platform"
description: "How auditing a documentation context engine with an AI pair found drift its own gates missed, and how the findings shaped a five-stage redesign plan"
date: 2026-09-14T12:00:00.000Z
lastmod: 2026-09-14T12:00:00.000Z
author: bamr87
categories:
  - Posts
  - DevOps
  - Tools & Environment
tags:
  - documentation
  - automation
  - ai-agents
  - claude-code
  - mcp
  - github-actions
  - python
excerpt: "A weekly cron was quietly leaving the main branch red. The fix was one line of .gitignore, but the lesson was about what a drift gate has to compare against."
keywords:
  - documentation drift
  - context engine
  - gitignore pitfalls
  - github actions gates
  - llms.txt
  - model context protocol
  - documentation health score
  - ai-assisted planning
draft: true
---

## The setup

The `bamr87/README` repo is not a README. It is a small machine that crawls every project in a fleet of repositories, copies their markdown into one corpus, distills that corpus into a pyramid of context (structured facts, one card per project, a consolidated README at the apex), derives a navigation tree from the folder hierarchy, and serves the whole thing to AI clients over the Model Context Protocol (MCP). A weekly GitHub Actions cron reruns the pipeline and commits the result, so the context evolves as the fleet does.

The ask was to plan its next incarnation: a platform that gathers, organizes, analyzes, summarizes, and distributes documentation for humans and models, with automated drift checks, documentation-gap detection, and a continuous-improvement loop. The temptation with a request like that is to start drawing boxes. We started by measuring instead, and the measurements rewrote the plan.

## Audit first, with commands, not opinions

Before writing a word of the plan, the AI pair ran the repo's own gates on a clean checkout of `main`: the unit suite (80 tests, green), the schema lint (clean), and the navigation drift check. The nav check failed. On `main`. That is supposed to be impossible: the navigation files are generated from the corpus, and the cron had regenerated them a week earlier.

Diffing what the navigator renders now against what was committed showed the gap: three sidebar entries pointed at pages that did not exist in the repository, and several fact sheets counted more documents than git tracked. The committed files were right for the working tree the cron had seen, and wrong for the commit it produced.

## The one-line root cause

`git check-ignore -v` answered it in one call. The repo's `.gitignore` carried the usual Python-virtualenv block: `lib/`, `build/`, `dist/`, `env/`, `.vscode/`, and a dozen more. None of them were anchored to the repo root, so they matched at any depth. When an upstream project has a `scripts/lib/README.md`, the crawl copies it into `docs/<project>/scripts/lib/`, the navigator indexes it, the fact sheet counts it, and then the auto-commit action drops it, because git ignores it. Fifteen patterns in that file swallow corpus directories.

The second finding compounded the first: the pipeline had never deleted a corpus file in its entire history. The processing script only writes, and the crawl only copies, so upstream renames and removals leave ghosts. One project already carried a byte-for-byte duplicate tree of 56 documents.

The third finding was about the gates themselves. The cron committed straight to `main` and ran only one of the two drift checks. Every pull request branched from `main` then failed the check the cron had skipped, whatever the branch touched. The owner's most recent PR was, understandably, a change to make that failure message clearer. It was a good change. It also was not the bug.

## What a drift gate has to compare against

The general lesson is worth stating plainly, because it applies to any generated artifact: a drift check must compare the generated surface against **what will be committed**, not against what is on disk. A working tree in CI contains everything the build produced, including files the repository will never accept. If the check runs before the ignore rules are applied, it validates a fiction.

Two rules fell out of that:

- Anchor ignore patterns (`/lib/`, not `lib/`) or scope them to the one directory they are for (`.venv/`). An unanchored pattern is a wildcard on your whole tree.
- Add a check that every path a generated file references is a git-tracked file. It is a ten-line check, and it would have caught this on the first run.

And one rule about automation: whatever gates you impose on humans, the cron must pass too. The cleanest way is to have the scheduled job open a rolling pull request that auto-merges when the checks are green, so branch protection applies to the robot exactly as it applies to you.

## Linters that contradict the house style

The quality report on every PR listed issues by the tens of thousands (40,370 on the current corpus). Nobody acted on them, and the audit showed why: 30,761 of them were "line too long", and the same repo enforces *one paragraph per line* in a separate workflow. One tool demanded the opposite of what another tool auto-fixed. A second rule required `tags` and `category` frontmatter on every aggregated page, which content copied from other repositories cannot satisfy. A report that cannot reach zero is a report people learn to scroll past. The plan replaces both rules with checks that measure defects the repo can fix.

## From findings to a plan

With the audit in hand, the redesign wrote itself around five verbs, each a pipeline stage with one command and one kind of output:

1. **Gather** with provenance: every document records the upstream commit it came from, its last-changed date, and a link to its source. Nothing downstream can say "stale" or "cite your source" without this, so it comes first.
2. **Organize** with pruning and a doc-type classifier, so ghosts die and READMEs, guides, changelogs, and agent-instruction files can be treated differently.
3. **Analyze** with a catalogue of checks, each emitting findings as data with stable keys: drift (generated surfaces, freshness, ghosts, link health, self-consistency), gaps (governance files by project kind, README section coverage, undocumented directories, orphans, stubs), quality, and fleet alignment (files that are supposed to be identical across repos). A weighted health score per project rolls them up.
4. **Summarize** with cached, verified AI enrichment: the cache is keyed by corpus fingerprint and prompt version so an unchanged fleet costs zero tokens, and a verifier rejects any generated sentence that names a path or number absent from the facts it was given.
5. **Distribute** beyond one README: MCP v2 with document reads and snippet search, `llms.txt` for model consumption, token-budgeted context packs, health badges fleet repos can embed, a change digest and feed, and one rolling "documentation health" issue per project that updates in place.

The loop closes with proposals: a finding with a mechanical remedy (a missing SECURITY.md, an out-of-sync shared file) ships with a ready-to-apply patch, and the fleet's existing agent workflows carry it upstream. The platform never edits another repo directly; it makes the fix cheap to accept.

## Tips for planning with an AI pair

- **Make the model measure before it designs.** Ask for the commands and the numbers. "The nav check fails on main" is a fact; "the nav could drift" is a vibe.
- **Have it read the code paths that produce the artifacts, not just the artifacts.** The no-prune bug was visible in two functions; no amount of staring at `docs/` would have shown it.
- **Give findings IDs and a class.** D5, G3, A1. It forces each check to be specific enough to test, and it lets the plan reference them without re-explaining.
- **Ground every claim the model writes.** The same rule the redesign applies to AI-generated cards applies to AI-generated plans: every number in the document came from a command that is listed in an appendix.
- **Separate the live defect from the roadmap.** Phase 0 of the plan is three small pull requests that make `main` green again. Everything ambitious waits behind them, because a platform for detecting drift should not itself be drifted.
- **Keep the repo's own conventions in the loop.** The house rule of one paragraph per line, the schema protocol that requires every new top-level file to be registered, the read-only MCP rule: an AI pair will follow them if they are in the project instructions, and violate them if they are only in someone's head.

## What's next

Phase 0 lands first: anchor the ignore patterns, add the tracked-integrity check, prune the ghosts, make the cron pass its own gates. Then provenance, then the check catalogue, then summaries worth caching, then distribution, then the loop. The full plan lives in the repo as `PLAN.md`, next to the product spec it extends.
