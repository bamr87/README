---
title: "The Slash That Cost a Week of Green CI"
description: "An un-anchored pattern in .gitignore matches at any depth. It swallowed generated files for a week and git never said a word about it."
date: 2026-09-15T04:30:00.000Z
lastmod: 2026-09-15T04:30:00.000Z
author: bamr87
categories:
  - Posts
  - DevOps
  - Tools & Environment
tags:
  - git
  - ci-cd
  - automation
  - documentation
  - testing
  - ai-agents
excerpt: "Every pull request was failing the same gate, and none of them had caused it. The defect was a missing forward slash, committed months earlier."
keywords:
  - gitignore patterns
  - gitignore anchoring
  - continuous integration
  - generated artifacts
  - build pipeline integrity
  - red main branch
  - ai assisted debugging
draft: true
---

## Four pull requests, one failure, zero causes

I opened four pull requests against a documentation repository over two days. All four failed the same check — a navigation gate that verifies the generated sidebar matches the generated corpus. None of the four had touched navigation. None of them had touched the corpus. The first one was a plan document.

The tempting read is "flaky gate." The correct read is that a branch inherits its base, and the base was already broken. `main` had been failing its own gate since a scheduled job ran a week earlier. Every branch cut from it started red, and would stay red no matter what it contained.

That is worth sitting with for a second, because it is the expensive part. A persistently red default branch does not cost you one failing job. It costs you the signal. Once "the gate is red" stops meaning "you broke something," everyone — humans and agents alike — starts reading failures as weather. The next real defect arrives dressed identically to the noise.

## The mechanism

The gate was telling the truth. The generated `nav.yml` named three pages:

```
docs/zer0-mistakes/scripts/lib/README.md
docs/zer0-mistakes/scripts/lib/install/README.md
docs/zer0-mistakes/scripts/lib/install/deploy/README.md
```

Those files were not in the repository. They had never been in the repository. But the pipeline that generated `nav.yml` had definitely seen them, because it wrote them to disk itself.

Here is the sequence, repeated weekly by a cron job:

1. The crawl clones a fleet of repositories and mirrors their markdown into `docs/`. It writes `docs/zer0-mistakes/scripts/lib/README.md` to disk. This succeeds.
2. The navigator walks `docs/` and renders `nav.yml` from the directory hierarchy. It sees the file on disk and lists it. This succeeds.
3. The fact extractor counts the corpus: 727 documents for that project. This succeeds.
4. The job runs `git add -A && git commit`. Git skips the file. **This also succeeds.**

Step 4 is the interesting one. `git add` does not fail on an ignored path — it silently declines to stage it, exit code 0, no output. So the commit lands, containing a navigation file that references a page the same commit does not contain, and a fact sheet claiming ten documents that are not there. Nothing in the pipeline raises anything. The only artifact of the disagreement is a gate that starts failing on every subsequent branch.

## The actual bug

The repository's `.gitignore` had, inside an ordinary Python block copied from a template years ago:

```gitignore
build/
lib/
var/
venv/
.venv/
.vscode/
.idea/
```

This is the part a lot of people have wrong, and it is worth knowing precisely.

**In `.gitignore`, a pattern containing no slash — or whose only slash is the trailing one — matches at every level of the tree, not just the root.** `lib/` does not mean "the `lib` directory here." It means "any directory named `lib`, anywhere, at any depth." A leading slash is what anchors a pattern to the directory containing the `.gitignore`.

So `lib/` matched `docs/zer0-mistakes/scripts/lib/`. `.vscode/` matched `docs/it-journey/.vscode/`. `var/`, `build/` and `dist/` were all sitting there waiting for any upstream repository to have a directory by that name — and when you aggregate thirty other people's repositories into one tree, *every* common directory name eventually shows up.

The fix is one character per line:

```gitignore
/build/
/lib/
/var/
/venv/
/.venv/
/.vscode/
/.idea/
```

## Prove it in both directions

A fix that only demonstrates the new behavior is half a fix. The question is never just "does the corpus file survive now" — it is also "do I still ignore my own virtualenv." `git check-ignore` answers both, and it is the tool to reach for any time you touch an ignore file:

```console
$ for p in docs/zer0-mistakes/scripts/lib/README.md \
           docs/it-journey/.vscode/README.md \
           lib/x build/x .venv/bin/python .vscode/settings.json; do
    printf '%-48s ' "$p"
    git check-ignore -q "$p" && echo IGNORED || echo "not ignored"
  done
docs/zer0-mistakes/scripts/lib/README.md         not ignored
docs/it-journey/.vscode/README.md                not ignored
lib/x                                            IGNORED
build/x                                          IGNORED
.venv/bin/python                                 IGNORED
.vscode/settings.json                            IGNORED
```

Two rows prove the bug is gone. Four rows prove I did not trade it for a worse one. `git check-ignore -v <path>` goes further and prints the exact file and line number of the pattern that matched — which is how you find out that the thing eating your build output was line 27 of a template nobody has read since the repository was created.

## Don't fix the drift. Fix the ability to drift silently.

Anchoring the patterns repairs today's damage. It does nothing about the next generator that writes a path git happens to ignore.

The general defect here is not "gitignore was wrong." It is that **a build which commits its own output had no step verifying the output survived the commit.** Every stage checked its own work and every stage was individually correct. Nobody checked the seam.

So the change that matters is a gate, about 160 lines, asserting three invariants:

- every path the generated navigation names is a file git actually tracks;
- nothing under the generated corpus directory is ignored by any pattern;
- each generated fact sheet's document count equals the number of files git tracks for that project.

Run against the broken commit, it prints the defect in full instead of leaving a downstream gate to hint at it:

```
error: nav.yml names `docs/zer0-mistakes/scripts/lib/README.md`, which git does not track
error: barodybroject facts claim 307 documents, git tracks 301
error: it-journey facts claim 1167 documents, git tracks 1166
error: zer0-mistakes facts claim 727 documents, git tracks 724
```

Run after the fix: `3216 tracked documents, 2133 navigation targets, 0 problem(s)`.

And then the part that closes the loop: the cron job that caused this now runs that gate **before** its commit step, not after. It previously ran only a schema linter, which is how it committed drifted navigation in the first place. A generator that is allowed to commit without verification will eventually commit something wrong; the only question is how long before anyone notices. In this case, eight scheduled runs.

## A second, quieter lesson: a red test is a claim, not a verdict

The same repository had a unit test failing on `main` for an unrelated reason, and it is a useful contrast.

An earlier change had deliberately made two configuration sets *complementary*: the ingest step now rewrites prose in the aggregated corpus, so the repository-wide prose gate must exclude that corpus — otherwise the two tools fight, one re-wrapping what the other unwraps, forever. That was correct, and it fixed a real flip-flop.

But a test still asserted the two sets were *identical*. It had been written when they were, and it went red the moment the design intentionally changed.

The reflex — make the test pass — would have meant reverting a correct design. The opposite reflex, deleting the test, would have discarded a real invariant. What the situation actually called for was deciding *which side was stale*, and then writing down what has to be true now:

- exactly one side may rewrite the corpus (the gate must exclude it; ingest must target it);
- the two must agree on everything outside that boundary, or a file one unwraps is a file the other re-wraps.

Two tests, expressing the invariant the design has today rather than the coincidence it had last month. When a test fails after an intentional change, the honest question is not "how do I get this green" but "what did this test believe, and is it still true?"

## Using AI well on a problem like this

Every one of these fixes was done with an AI agent doing the work. A few things made the difference between it finding the root cause and it papering over the symptom.

**Ask for the mechanism, not the patch.** "Fix this failing gate" invites a change to the generated file, which would have been overwritten by the next cron run. "What would have to be true for the generated navigation to name a file that does not exist?" forces the chain — written to disk, indexed, then dropped — and lands on `git add` silently skipping ignored paths. Phrase the prompt so that a symptomatic fix does not satisfy it.

**Insist on a two-sided proof.** Agents are good at demonstrating that the new behavior works and much less inclined, unprompted, to demonstrate that the old behavior still works. "Show me both what changed and what must not change" is one sentence, and it is the difference between fixing an ignore file and quietly committing your virtualenv.

**Give it the means to verify locally.** The loop is only fast if the agent can run the actual gate before pushing. Every check quoted in the pull request here was run in the working tree first; the CI run was a confirmation, not a discovery. If your verification requires a push, an agent will iterate in public, six commits deep, and you will pay for every round.

**Pin every claim in a description to a command you can re-run.** "Fact counts now match" is a sentence anyone can type. `307 → 301, 1167 → 1166, 727 → 724`, each traceable to a `git ls-files | wc -l`, is a claim a reviewer can falsify in ten seconds. Ask for numbers with provenance, and the review gets cheaper for everyone.

**Timestamp your known failures.** This one bit me. After correctly establishing that a gate failure was pre-existing on the base branch — twice, with evidence — I had built a small heuristic: *this check is red for reasons that are not mine.* That heuristic was true on Monday and would have been actively harmful on Tuesday, because by then I was working on the change that fixed it. Attributing a failure to a known defect is fine. Letting it become a standing assumption is not. When you write down "this failure is not ours," write down the condition under which that stops being true — and if you are directing an agent across sessions, put that expiry in the handoff, in plain language: *this branch should be green; if it is not, that is new, investigate it properly.*

**Let the tool disagree with its author.** The most valuable single line in this whole change is the gate that checks the seam between two stages that both thought they were correct. Ask an agent "what part of this pipeline does nothing verify?" more often than you ask it to add another feature to the part that already works.

## The short version

A trailing slash is not an anchor; a leading slash is. `git add` declines to stage ignored files without saying so, which means any pipeline that generates files and then commits them can produce a manifest describing a repository that does not exist. Check the seams between stages, because every stage will pass its own tests. And when you have established that a failure is not yours, give that conclusion an expiry date.
