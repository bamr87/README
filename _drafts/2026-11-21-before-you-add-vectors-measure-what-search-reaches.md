---
title: "Before You Add Vectors, Measure What Search Can Reach"
description: "A fleet knowledge base that looked like it needed RAG mostly needed reach: index the sections, derive one roster, pin to commits, then measure."
date: 2026-11-21T23:30:00.000Z
lastmod: 2026-11-21T23:30:00.000Z
author: bamr87
categories:
  - Posts
  - DevOps
  - Tools & Environment
tags:
  - rag
  - mcp
  - sqlite
  - search
  - ai-agents
  - documentation
  - monorepo
excerpt: "The request was 'make the docs repo a RAG source for the console.' The first useful finding was that search could not see 99% of the documents, and no amount of embedding would have fixed that."
keywords:
  - retrieval augmented generation
  - sqlite fts5
  - bm25 ranking
  - model context protocol
  - documentation search
  - knowledge base design
  - claude code
draft: true
---

## The request

I keep about forty repositories in one monorepo of Git submodules, with a hub that runs the automation and a web console that shows it all. One of those submodules, `README`, exists only to describe the others: it crawls every project's Markdown, distills it into one card per project and a fleet-wide summary, and serves it to AI clients through an MCP server. The question for this session was simple: can the console use it as a RAG source, so that "what does this repo do and how do I run it" has one quick, accurate answer?

The tempting answer is a vector database. I asked Claude Code to measure first, and almost everything useful came out of the measuring.

## Step 1: find out who actually reads what

Before designing retrieval, map the consumers. The console turned out to have four separate knowledge paths: a raw README read from a local checkout, a semantic code index on the Mac, a content analysis of the websites, and keyword recall over past AI sessions. None of them read the README repository.

One detail mattered more than the rest. The console's built-in assistant runs Claude Code with a strict MCP configuration and exactly one server. So "just register the docs server too" was never going to reach it. That constraint lived in a few lines of Python, not in any design doc, and it decided where the new tools had to go.

Lesson: the integration point is wherever the consumer's configuration lets you in. Read the launch code, not just the architecture diagram.

## Step 2: count the lists

The hub keeps a registry of 45 projects. The docs repository keeps its own list of 24 for crawling and a third list of 38 for its documentation survey. Twenty-four hub projects had no card at all, one retired project was still described, seven descriptions had drifted, and one project was named `zer0-CMS` on one side and `zer0-cms` on the other, so a join on the name quietly failed.

None of this is anyone's fault. A copy of a list starts drifting the day it is made. The fix is structural: one side owns the roster, and the other keeps only what is genuinely its own (crawl rules, navigation overrides) as an overlay keyed by the owner's name.

## Step 3: measure the index, not the corpus

The corpus held 4,390 pages. The search index held 47 documents: the fleet summary, 22 project cards and 24 navigation trees. Every page could be read by exact path, but none could be searched. Ranking was summed term frequency, with no inverse document frequency and no length normalization.

So "release-please", which appears in 132 pages, returned nothing. "kill switch", in 159 pages, returned nothing. "token rotation oauth" ranked two unrelated projects first and never reached the hub's own token-rotation guide.

This is the finding I would have missed by jumping to embeddings. An embedding model over the same 47 summaries would have ranked them more cleverly and still never seen the page that answers the question. "No results" was a reach problem, not a ranking problem.

## Step 4: prototype in the standard library

SQLite ships with FTS5, a full-text engine with BM25 ranking, column weights and snippets, and Python's `sqlite3` module can use it with nothing to install. The prototype split every page at its H1 to H3 headings into chunks of at most 2,400 characters, kept a breadcrumb of project, path and heading, and indexed it:

```python
import sqlite3

con = sqlite3.connect("fleet.db")
con.execute(
    "create virtual table chunks using fts5("
    "project unindexed, path unindexed, title, heading, body,"
    " tokenize='porter unicode61')"
)
# ... insert one row per section ...
rows = con.execute(
    "select path, heading, snippet(chunks, 4, '[', ']', ' … ', 14)"
    " from chunks where chunks match ?"
    " order by bm25(chunks, 0, 0, 4.0, 2.0, 1.0) limit 5",
    ('"kill" OR "switch"',),
).fetchall()
```

The numbers: 41,870 sections from 4,177 pages, built in 1.9 seconds, a 61 MB file, queries in 1 to 25 milliseconds. Every query that had returned nothing now returned the section that answered it, with the matching words highlighted.

Plain BM25 had one visible bias: narrative pages won. Tutorial quests that mention a kill switch in passing outranked the governance document that defines one, and changelogs outranked guides. A small document-type prior fixed most of it: weight agent instructions, READMEs and `docs/` up, weight changelogs and blog-style pages down. It is one Python function registered with `create_function`, and it is the kind of tuning that only shows up when you look at real results.

## Step 5: run an honest eval

I asked for a skeptical evaluation, not a demo. Twenty-five questions, each with the project that should answer it:

| | Today | Prototype |
| --- | --- | --- |
| Right project first | 16 of 25 | 23 of 25 |
| Right project in the top 5 | 20 of 25 | 23 of 25 |
| Returns the answering section | No | Yes |

Then the caveats, in the same breath. The questions were written for the review, so they favour distinctive vocabulary. Twenty-five is a smoke test, not a benchmark. And the two misses were identical on both sides: projects the crawler did not know existed. Coverage again, not ranking.

That last point is why the plan keeps the vector search as the final, optional phase. Its exit criterion is written down: it ships only if it beats lexical search on the same eval. Otherwise it stays off.

## Step 6: make accuracy structural

Fast and complete is not the same as right. Three changes target accuracy directly.

First, pin the crawl to the commits the hub actually uses. Nineteen of twenty projects had been crawled at a different commit than the hub pinned. Usually a day or two apart, but nothing in an answer said so. With pinning, every answer can carry "this describes commit X; the hub pins Y", and staleness becomes a number you can alert on.

Second, read the most-asked facts from canonical files instead of generating them. Every repository in this fleet keeps an `AGENTS.md` with the same sections: what it is, stack and commands, layout, conventions, deviations. Parsing those sections into structured fields means "how do I test this repo?" is answered by quoting a line its maintainers keep current, with its path and commit, rather than by a model's paraphrase.

Third, keep the provenance and the untrusted-data fences the server already had. Retrieved documentation is someone else's text, and it should reach a model marked as data, never as instructions.

## Step 7: reconcile with the other plan

A separate, older plan for the fleet's documentation wanted this same repository to stop republishing other projects' pages, because each copy becomes a second, drifting citation target. That looks like a direct conflict with "make it the main source of content".

It is not, once you separate storage from publishing. The copied corpus is the retrieval store. The published site becomes an index of cards and maps that link to each page's real home, with `rel=canonical` on any copy still served. Both plans get what they need.

## What shipped

A proposed architecture decision record in the docs repository, with the measurements, a seven-phase rollout, the alternatives considered and three questions only the owner can answer. The first three phases need nothing from the hub and are worth having on their own. Nothing in the hub changed: it lands as its own pull request once the decision is accepted.

## Working with AI: tips from this session

- **Ask for measurements before designs.** "How many documents does search actually index?" was worth more than any architecture sketch. Have the agent print counts, sizes and real query results.
- **Prototype in a scratch directory.** The FTS5 prototype took minutes, lived outside the repository, and turned "we should try BM25" into a table of numbers.
- **Demand the caveats with the numbers.** Asking for a skeptical eval got the small sample, the biased question set and the coverage misses stated up front, which is exactly what a reviewer needs.
- **Read the consumer's launch code.** The strict single-server configuration was the most important constraint in the whole design, and it was in a function, not a document.
- **Let the agent propose, and the human decide.** The output was a `proposed` decision record with explicit questions for the owner, not a merged refactor. Research sessions should end in a decision someone can make, not in code someone has to unwind.
