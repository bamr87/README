---
title: "623 False Positives: Auditing Your Own Auditor"
description: "Building a documentation health scanner for 30 repositories, discovering most of its findings were wrong, and the discipline that catches that"
date: 2026-09-15T03:00:00.000Z
lastmod: 2026-09-15T03:00:00.000Z
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
  - git
  - testing
excerpt: "The scanner reported 1,022 problems across the fleet. I sampled three by hand. All three were fine. The bug was one call to lstrip."
keywords:
  - documentation health
  - static analysis false positives
  - git partial clone
  - shallow clone
  - link checker
  - repository audit
  - ai assisted development
draft: true
---

## The instrument before the measurement

I built a tool that scores the documentation of every public repository in a fleet: does it have a README worth reading, a license, sections a newcomer needs, directories that explain themselves, links that go somewhere. Thirty repositories. The first run produced **1,022 findings** and a neat worst-to-best ranking.

The ranking was wrong. Not slightly wrong — 623 of those findings did not exist.

The way I found out is the only part of this worth copying: before trusting a number, I picked three findings at random and checked them by hand. All three "broken links" pointed at files that were sitting right there in the repository.

## The bug

One check produced 68% of all findings, so it got the scrutiny. The link resolver did this:

```python
resolved = str(Path(base) / link) if base else link
resolved = str(Path(resolved)).lstrip("./")
```

Two defects in two lines.

**`lstrip` strips characters, not prefixes.** The intent was "remove a leading `./`". What it actually does is remove every leading character that is either a dot or a slash. So `.github/workflows/ci.yml` becomes `github/workflows/ci.yml`, and every link into any dot-directory is reported broken. In a fleet full of `.github/`, `.claude/` and `.devcontainer/`, that is hundreds of phantom findings.

**`Path()` does not normalize `..`.** Joining `docs` and `../CONTRIBUTING.md` gives you the literal string `docs/../CONTRIBUTING.md`, which matches nothing. Every link that climbed out of a subdirectory was reported broken too.

The fix is `posixpath.normpath` and an honest prefix strip. Findings fell from 1,022 to 399, and this time when I sampled twelve survivors by hand, twelve were genuinely broken.

## Two more, found by reading the output

Fixing the obvious bug is not the same as trusting the tool. Two more defects only surfaced by asking "does this ranking describe repositories I recognize?"

**A check that ignored the answer.** One repository scored badly for having sixteen "undocumented directories". It carries a 1,655-word architecture document with a module map, a dependency graph, and a table naming every one of those directories. The check looked for a README *inside* each directory and nowhere else. Teaching it to read a central map moved that repository from 72 to 84 — not by lowering the bar, but by looking where the documentation actually was.

**Findings charged to the wrong account.** The score has components: governance, readme, links, structure, metadata, quality. Per-file "this page is thin" findings were being charged to the *readme* component, so eight short pages buried somewhere in a repository could sink the score of a repository whose README was excellent. Each finding now names the component it charges.

After all three fixes: 328 findings, mean health 88.6, up from a falsely pessimistic 81.3.

## Gathering thirty repositories without downloading them

A technique worth stealing. To check documentation you need the file tree and a handful of file contents — not the history, not the binaries, not the whole working copy.

```bash
git clone --depth=1 --filter=blob:none --no-checkout <url> <dir>
git -C <dir> ls-tree -r --name-only HEAD     # complete tree, offline
git -C <dir> show HEAD:README.md             # fetches just this blob
```

That is a *blobless partial clone*. You get the commit and every tree object, but no file contents until you ask for one, and then only that one. A repository whose full clone is 500 MB takes under a second and about 200 KB. Thirty repositories, warm cache, twenty-five seconds.

The trap: `--filter=blob:none` keeps trees, so `ls-tree` works offline. Its cousin `--filter=tree:0` omits trees too, and then every path lookup hits the network.

## Findings as data, not log lines

Every finding carries a stable key of the form `check:repository:subject`, and the key must never contain anything volatile — no counts, no dates, no fingerprints. That one constraint buys a lot:

- The same defect keeps its identity across runs, so you can diff two runs and see what opened and what closed.
- A defect fixed upstream simply *disappears*, which is a much better signal than a number going down.
- Findings can be deduplicated, trended, gated in CI, or synced to issues, without any of those consumers re-parsing prose.

A finding that says "12 broken links in docs/" is a sentence. A finding keyed `D8:barodybroject:docs/configuration/README.md->./security-config.md` is a fact you can track.

## Then actually fix something

A scanner nobody acts on is a scoreboard. The tool named the worst component in the fleet: one repository with a link health score of 0 out of 15, twenty-nine dead links.

None of the targets was actually lost. Reading the repository's own documentation index explained it: a cleanup had reorganized and removed files, and the links were leftovers. They sorted into four groups:

- **Renamed** — five changelog links pointing at old filenames whose content now lives under new ones.
- **Wrong base** — links written as if from the repository root but living three directories down, so `./docs/changelog/archive/` resolved to `docs/changelog/docs/changelog/archive/`.
- **Promised as files, written as sections** — an index advertising four configuration guides that all exist, as sections of a single document. The fix was to link the anchors, and to verify each anchor exists.
- **Genuinely gone** — two directories the cleanup removed, and one that never existed.

Result: 75 (C) to 94 (A), zero warnings. Merged. Re-running the survey against the merged branch confirmed the findings were gone, and the fleet report updated itself: 328 findings to 297, mean health 88.6 to 89.2.

That last step matters more than the fix. It is the difference between "I believe this helped" and "the instrument that found the problem now reports it absent."

## What to take from this

- **Validate the instrument before you publish the measurement.** Sample findings at random and check them by hand. Three samples caught a bug that had corrupted two thirds of the output.
- **Be most suspicious of your highest-volume check.** If one rule produces most of your findings, it is either the most important thing about your codebase or it is broken. It is usually broken.
- **`lstrip` and `rstrip` take character sets, not prefixes.** `"...".lstrip("./")` is almost never what anyone means. Python 3.9 added `removeprefix` for exactly this.
- **A report that cannot reach zero gets ignored.** The same codebase had a linter reporting 30,000 "line too long" warnings while a different workflow enforced long lines by design. Nobody had read that report in months.
- **Make the tool prove the fix.** I added a mode that runs the checks over an uncommitted working tree, so the effect of a change on the findings is visible before it is pushed, and again after it merges.

## On working this way with an AI pair

The failure mode to design against is an assistant that is confidently productive. Producing 1,022 findings is easy and looks like progress; noticing that 623 are fabricated requires deliberately trying to falsify your own output.

Three habits that help:

- **Ask for the verification, not the result.** "Check twelve of these by hand against the actual repository" produces something a summary never will.
- **Demand computable criteria.** Every check here reads a file tree or a file. None of them decides whether documentation is *good*, because that is not checkable and would have been applied inconsistently.
- **Write the regression test at the moment of the fix.** Each false-positive class from that first run is now a named test case. The suite documents what the tool used to get wrong, which is more useful than documenting what it gets right.
