---
title: "One Docs Framework for 24 Repos, Enforced by Code"
description: "A fleet-wide documentation pass became a spec, a generated index, a fixed prose bug and one review report, plus what AI agents got wrong at that scale."
date: 2026-10-22T02:00:00.000Z
lastmod: 2026-10-22T02:00:00.000Z
author: bamr87
categories:
  - Posts
  - DevOps
  - Tools & Environment
tags:
  - documentation
  - automation
  - ai-agents
  - python
  - markdown
  - monorepo
excerpt: "The request was 'make the docs consistent across every repo.' The useful answer was a rule a machine can check, a generator for everything else, and one report that shows the whole fleet."
keywords:
  - documentation framework
  - generated documentation
  - docs as code
  - markdown linting
  - multi-repo maintenance
  - ai assisted development
  - claude code
draft: true
---

## The request

The ask was short: review the documentation in every repository, make it follow one pattern, cut the redundancy, generate whatever can be generated from source, and use the README repository as the place to review it all. The fleet is about two dozen repositories: Jekyll sites, Django apps, a Godot workspace, a VS Code extension, shell tooling, a Rails CMS. Each one had its own docs habits.

"Consistent" can't be checked by a machine. So the first job wasn't editing at all. It was turning "consistent" into rules that a script can pass or fail.

## Step one: write the rule down

The fleet already had a standard for repository layout and agent context files. Documentation had no area of its own. It became `specs/DOCS.md`, with ten requirements. Most of them come down to three ideas:

- **Each fact has one home.** The README is for visitors. `AGENTS.md` is for agents and contributors. `docs/` holds depth, and the changelog holds history. When two files explain the same command, one of them goes stale. The hub's `CLAUDE.md` was 6,450 words, most of it restated from other docs. It became a six-line pointer, and the facts only it held moved into `AGENTS.md`.
- **Every document says what it is in one sentence**, either as a front-matter `description:` or a `>` line under the title. That sounds cosmetic, but it's what makes the next rule possible.
- **Anything derivable from source is generated, with a check.** Once every document carries its own summary line, `docs/README.md` doesn't need hand-maintaining. A 300-line stdlib script reads the summaries and writes the index between two HTML comment markers. `--check` fails CI when a document is added without updating the index.

The CLI reference was the clearest case for generation. The hub's command table in `docs/DASH.md` was a hand copy of `tools/dash help`, and it had fallen a dozen commands behind. Now a generator parses the help output (the bold escape codes mark exactly where each command name starts and ends) and the drift gate runs it in `--check` mode. The help text is the one place commands are defined, so it's the only place to edit them.

## Step two: one implementation, two consumers

The README repository already had a "survey" that cloned every fleet repo and scored its docs. The tempting move was to add the new rules there as separate checks. Instead, the survey imports the same vendored `docs_index.py` that each repository runs in its own CI.

That decision paid off right away. A review that disagrees with the gate a repository actually runs is worse than no review: maintainers learn to ignore it. With one implementation behind both, a stale index in the consolidated report is the same stale index the repository's own `--check` would catch. The survey also gained a `--workspace` mode that reviews local checkouts instead of default branches, so in-flight branches can be reviewed before they merge.

## Step three: the formatter had a bug

Every fleet repo enforces "one paragraph per line" in Markdown with a small vendored unwrapper, and CI pushes the fix back onto the branch. While harmonizing docs I found it corrupting list items. A list item's second paragraph is indented to stay inside the item:

```markdown
- First item

  A second paragraph that belongs
  to the first item.
```

The tool joined those lines and stripped the indent, which moved the paragraph out of the list. It had been doing that quietly in every repo.

The fix was easy. Knowing it was safe took more work. Before shipping, the new version ran over all 11,122 tracked Markdown files in the 24 checkouts, with three assertions: running it twice changes nothing, no fence, heading or table line is lost, and the count of changed files is plausible. It reported 1,385 files with list items to join.

Then it got more interesting. My first fix also joined a flush-left line onto the list item above it, which is what CommonMark rendering does (a "lazy continuation"). The fleet-wide run caught a case where that's wrong: an agent prompt read as raw text, not rendered HTML.

```markdown
3. residual risks needing a human
Never approve baseline updates yourself.
```

A renderer folds the second line into item 3. The model reading the raw file sees a new instruction. Joining them would have quietly changed what an agent was told to do. So now only indented continuations join, and a regression test pins that exact case. **The data a tool processes includes how that data will be read.**

## Step four: fan out, then check the work

Each repository got its own branch and draft PR, done by parallel agents working from one written brief: the spec, the skeleton, the commands to run, and the rules each repo states for itself. Without that brief, two dozen agents would make two dozen interpretations of the same request.

The interesting part was where repositories said no:

- **it-journey** forbids agents from touching `.github/workflows/`. The new formatter would have rewrapped a README in that directory, so that repo kept its old formatter, and the update is flagged for a human.
- **zer0-CMS** hosts the theme package, which another PR was already editing. Updating the formatter there would have made CI rewrite 118 theme files and collide with that PR, so it waits until both merge.
- Generated files stayed generated. A rebuild of the README repo's context pyramid without an API key fell back to heuristics and downgraded summaries an earlier AI-enriched run had written. The rebuild was reverted, and only the hand-owned schema file was kept.

## What AI got wrong, and how it was caught

Agents at this scale are fast, and they're confidently wrong about one time in a few dozen. Three habits caught it:

1. **Verify every claim that changes a decision.** One agent reported that a template was "hand-written, not generated." Reading the file took five seconds: it already had the generated span. Acting on that report would have meant "fixing" something that wasn't broken.
2. **Run the transform over everything, not a sample.** The raw-prompt case wasn't in any fixture I would have written. It turned up because the check covered every file.
3. **Let the repository's own gate be the referee.** Each branch ran its own test suite after the tools were updated: Django apps, the Python survey, unittest suites, docs tests. "The agent says it's done" was never the evidence.

## Tips for running your own docs pass with AI

- Turn "consistent" into rules a script can fail before you edit anything. Agents follow a checkable rule better than a vibe.
- Generate indexes and references from their source, and gate them with `--check`. The best way to remove documentation is to make it an output.
- Use one implementation for both the per-repo gate and the fleet-wide report.
- Give parallel agents one brief, and tell them to read each repo's own rules first. Exceptions are part of the fleet.
- Trust a transform only after it has run over every file and the results look right.
