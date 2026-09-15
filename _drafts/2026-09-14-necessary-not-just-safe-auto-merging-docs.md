---
title: "Necessary, Not Just Safe: Auto-Merging Docs"
description: "How to build a documentation auto-merge gate that refuses harmless churn, and wire an AI reviewer that can veto a merge but never authorize one"
date: 2026-09-14T22:00:00.000Z
lastmod: 2026-09-14T22:00:00.000Z
author: bamr87
categories:
  - Posts
  - DevOps
  - Tools & Environment
tags:
  - automation
  - ai-agents
  - github-actions
  - documentation
  - claude-code
  - security
excerpt: "Most auto-merge bots ask whether a change is safe. The more useful question, and the harder one to answer mechanically, is whether the change needed to happen at all."
keywords:
  - auto-merge
  - documentation automation
  - ai code review
  - prompt injection
  - github actions permissions
  - continuous documentation
  - merge gates
draft: true
---

## The easy three and the hard one

A documentation pipeline that regenerates itself produces a pull request every night. Nobody wants to review those forever, so the obvious move is to auto-merge them. The obvious criteria are safe, cheap, and incremental: does the change touch only generated files, is it small enough to skim, is it one step on a green base. All three are easy to check, and a system with only those three will happily merge an endless stream of harmless noise until everyone stops reading the notifications.

The criterion that earns its keep is the fourth one: **necessary**. And the trick is to define it so a machine can decide it, because "necessary" as a judgment call is exactly the thing you were trying to automate away.

## Necessity is a citation, not an opinion

The definition that works is a citation requirement. A change may merge itself only if it can name why it had to happen:

- It is **entailed**: a derived file changed because an input it is derived from changed. Evidence is the upstream commit range plus a rebuild that reproduces exactly this diff.
- It is **corrective**: it closes findings that were open before and are gone after. Evidence is the finding keys.
- It is **restorative**: a service level was breached and is now inside target. Evidence is the number before and after.
- It is **mandated**: a declared contract requires it.

No citation, no merge. That alone kills most speculative churn, because a change nobody asked for cannot name a finding it closes.

## The answer delta

The harder disqualifier is the change that cites a real input but still means nothing. To catch that, ask a different question: **does any answer change?**

A documentation platform serves a finite, addressable set of answers: the project roster, each summary card, each navigation tree, each report verdict, the search index terms, each context bundle. Rebuild that set on both sides of the change and diff it. If nothing in the set differs, the diff is real but the product is identical, and the change is churn.

Two real examples from the repository that prompted this, both of which pass safe-cheap-incremental with room to spare:

- A 13 MB index file reserialized every week into a one-line diff. Every crawl rewrites it. No card, no tree, no report, no search result changes. Pure churn, merged fifty times a year.
- A whole-corpus prose reformatter that rewrites 143 aggregated files on the first pull request after each crawl, which the next crawl undoes. Motion, not progress. The necessary fix is at the point of ingestion, not in a merge.

When the answer delta is non-empty, it is not just a pass mark. It is the evidence: this many cards, this many trees, this many report verdicts, these index terms. That text goes straight into the pull request body and the audit log, so the record of an autonomous merge always states what it changed about the answers.

## Stage gates beat an on switch

Autonomy should be a ladder, not a boolean. Four rungs cover the realistic cases:

1. **Mechanical**: regeneration with no prose delta. Deterministic checks are sufficient; no model needs to look at it.
2. **Derived**: heuristic prose moved because facts moved. Add an AI reviewer.
3. **Assisted**: model-generated prose changed. Add claim verification, and leave it off until the verifier has evaluation coverage.
4. **Substantive**: anything outside the generated-file allowlist. Always a human.

A mixed change takes the highest rung any part of it reaches. One file from rung four makes the whole pull request rung four; stages do not average down.

The practical benefit is that rung one ships early. You get real autonomy for the boring nightly regeneration long before you have an AI reviewer, a finding database, or a claim verifier.

## Two keys, and the veto that cannot become a grant

Giving a model merge rights sounds alarming until you separate two decisions that people tend to collapse:

- **What may change** is decided by a deterministic gate: a path allowlist, budget thresholds, determinism, deletion provenance. No model involved.
- **Whether a permitted change should proceed** is decided by the reviewer.

The merge requires both. Either one withholding is a stop, so an approval on a failing gate merges nothing. More importantly, the reviewer's vocabulary is only approve, request changes, or escalate. There is no output it can produce that widens the allowlist, raises the stage ceiling, or lifts a budget, because those live in a configuration file that is itself outside the allowlist. The loop cannot change the rules of the loop.

Then split the credentials to match: the review job runs with read-only repository contents and write access only to post a review. The merge job runs separately, with no model in it, and re-checks the allowlist itself. The component that can write is not the component that can be argued with.

## The token gotcha that bites twice

Here is a detail that cost the repository in question a month of stale published documentation before anyone noticed: **a push made with the default Actions token fires no workflow events**. Their nightly job committed straight to the main branch with that token, so the site deploy never ran. Eight refreshes, zero deploys, no error anywhere.

The same trap sits one level up in an auto-merge design. If your merge step uses that token, the merge lands and nothing downstream reacts. Use a GitHub App installation token, a fine-grained personal token, or GitHub's own auto-merge feature, which fires events and stores no credential of yours. And add a check that compares the commit the site was built from against the current head, so if this regresses, something says so.

## Your corpus is untrusted input

If the pipeline aggregates documentation from repositories you do not control, and then serves it to AI agents, the content is external data with a path to a model. A README somewhere upstream can contain text addressed to an assistant. An autonomous reviewer that reads raw aggregated prose is a target.

Four mitigations, none of which rely on the model resisting persuasion:

- Feed the reviewer the **structured gate report**, not the raw diff. Aggregated text appears only as quoted evidence, explicitly framed as untrusted.
- Let the **allowlist bound the blast radius**. Even a fully suborned reviewer can only approve changes to paths the deterministic gate already restricted to generated files. Workflows, scripts, and configuration are unreachable by construction.
- **Screen the corpus at ingestion** for agent-directed imperatives, tool-call syntax, credential requests, and invisible control characters. Flag them, and force those changes to a human. This check pays for itself even with no auto-merge in the picture, because a poisoned document otherwise reaches every agent your platform serves.
- Make everything **reversible and logged**. One command undoes any autonomous merge, and a revert freezes the whole layer until a person re-arms it.

## Brakes worth building before you need them

- A daily quota and a per-project cap, so one upstream repository committing hourly cannot flood your main branch.
- A cooldown window in which a newly added source always goes to a human.
- A circuit breaker that trips automatically on any revert, on the gate going red after an autonomous merge, or on a quota breach, and which only a human can reset.
- A ledger: an append-only record of what merged itself, which findings it cited, how much it changed, and who approved. "The robot merged it" should never be the entire answer to what happened.

## Tips for building this with an AI pair

- **Make the model design for its own constraint.** Asking "what can this reviewer do if it is fully compromised?" produces a better architecture than asking "how should this reviewer behave?"
- **Insist every criterion be computable.** If a rule cannot be checked without judgment, it will be applied inconsistently by humans and models alike. The answer delta exists because "is this change meaningful?" was not computable and "does any served answer differ?" is.
- **Ground the negative cases in real artifacts.** The churn definition got sharp only after pointing at two specific changes in the actual repository history that would pass every other check.
- **Ship the lowest rung first.** A design that requires a finding database, a verifier, and an evaluation suite before it does anything is a design that never ships. Rung one needs only a path allowlist and a determinism check.

## Where this landed

A section in the repository's redesign plan: four criteria, four stages, a deterministic gate and a Claude Code review as the two keys, quota and cooldown and a freeze switch, a one-command revert, and a ledger rendered onto the published site. Rung one arrives with the crawler rewrite; the reviewer runs in report-only mode for two weeks before it is allowed to approve anything.

Necessity is the whole discipline in one sentence: a merge must be able to name what it changed about the answers, and which open problem or moved input made it unavoidable.
