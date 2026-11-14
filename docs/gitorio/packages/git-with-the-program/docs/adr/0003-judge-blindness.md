---
source_file: packages/git-with-the-program/docs/adr/0003-judge-blindness.md
source_repo: bamr87/gitorio
source_url: https://github.com/bamr87/gitorio/blob/main/packages/git-with-the-program/docs/adr/0003-judge-blindness.md
title: 'ADR-0003: Judges are author-blind and accumulator-blind'
---
# ADR-0003: Judges are author-blind and accumulator-blind

**Status:** Accepted · **Date:** 2026-07-23 · **Deciders:** Amr

## Context
Evidence accumulation assumes conditionally independent samples. Judges with access to authorship or running totals produce biased, autocorrelated verdicts.

## Decision
The evidence assembler structurally cannot pass author identity or accumulator state to any judge. Authorship is used only downstream, in dispersion statistics at firing time. Verdict and sentencing are separate branches.

## Consequences
- Easier: accumulated surprise remains valid evidence; verdicts attach to conduct, not identity.
- Harder: some genuinely useful context (e.g., "this author owns this module") is unavailable to judges by design; route such cases to human review instead.
- Invariant: any code path leaking author or accumulator data to a judge is a framework bug of the highest class.
