---
author: IT-Journey Team
categories:
- Notes
date: '2026-07-01T00:00:00.000Z'
description: Every GH-600 domain implemented in the IT-Journey repo — live workflows,
  policy data, and scripts demonstrating each exam skill, mapped file by file.
draft: false
lastmod: '2026-07-01T00:00:00.000Z'
layout: default
permalink: /notes/gh-600/implemented-in-it-journey/
source_file: implemented-in-it-journey.md
tags:
- gh-600
- agentic-ai
- reference-implementation
- automation
title: 'GH-600 in the Wild: Implemented in IT-Journey'
---
# GH-600 in the Wild: Implemented in IT-Journey

The Agentic Codex is not a thought experiment — **this repository runs on the disciplines the exam tests.** An AI fleet drafts content, walks quests as a learner, repairs what it witnessed breaking, triages issues, and audits itself — every lane behind kill switches, deterministic gates, and a human merge button. This note maps each GH-600 domain to the live artifact that implements it, so you can read real source instead of imagining it.

**How to use this page:** study a chapter, then open the artifact and see the same pattern holding production weight. Each path links to the source on GitHub; each row names the chapter that teaches the concept.

## The control plane in one workflow

[`.github/workflows/agent-plan-then-act.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/agent-plan-then-act.yml) is the campaign's reference pipeline, live: a `plan` job that only plans, an `execute` job held **Waiting** behind the `agent-approval` Environment, the plan crossing the boundary as an artifact, a drift-guard verify before acting, a correlation ID threading every step, and an audit artifact recording instruction → action → outcome. It is OFF by default behind `AGENT_DEMO_ENABLED`, exactly like every other agent lane here.

## Domain 1 — Agentic AI in the SDLC (18%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Bounded agents with defined entry/exit | [`_data/agents/registry.yml`](https://github.com/bamr87/it-journey/blob/main/_data/agents/registry.yml) + [`.claude/agents/`](https://github.com/bamr87/it-journey/tree/main/.claude/agents) | Nine named agents, each with ONE role, a lane (read-only vs content-write), and a kill switch |
| Plan vs action separation | [`agent-plan-then-act.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/agent-plan-then-act.yml); walk→fix split in [`quest-perfection.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/quest-perfection.yml) | The quest loop's *walker* only witnesses (read-only); a separate *fixer* acts — planning and acting are different jobs, even different workflows |
| Observability & control | Workflow step summaries + committed [`.quests/ledger.json`](https://github.com/bamr87/it-journey/blob/main/.quests/README.md) + `.quests/DASHBOARD.md` | Every autonomous run leaves a trace a human can audit without re-running |

*Taught by [Chapter I — Initiation Rites](/quests/0111/agentic-codex-01-agents-in-the-sdlc/).*

## Domain 2 — Tool Use & Environment (18%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Tool selection & least privilege | `permissions:` blocks in every workflow (default `contents: read`); [`scripts/ai/run.sh`](https://github.com/bamr87/it-journey/blob/main/scripts/ai/run.sh) `--tools` allow-list | Grants are per-job and by omission; the runner passes agents only the tools the task names |
| MCP server configuration | [`.vscode/mcp.json`](https://github.com/bamr87/it-journey/blob/main/.vscode/mcp.json) (editor, `promptString` token) + [`scripts/ai/mcp/github-readonly.json`](https://github.com/bamr87/it-journey/blob/main/scripts/ai/mcp/github-readonly.json) (runner, env token) | Declared servers, secrets never committed, allow-list at the call site |
| Environment integration | [`AGENTS.md`](https://github.com/bamr87/it-journey/blob/main/AGENTS.md) + [`.github/copilot-instructions.md`](https://github.com/bamr87/it-journey/blob/main/.github/copilot-instructions.md) + [`_data/ai.yml`](https://github.com/bamr87/it-journey/blob/main/_data/ai.yml) | The realm's law, written for the agent; ONE config file for every model call |
| Safe execution paths | Claude-Code→API fallback in `run.sh`; `timeout-minutes` + `concurrency` on every lane; `needs-human` escalation | Failures retry once (fallback), then surface loudly — never a silent green |

*Taught by [Chapter II — Forging the Arsenal](/quests/1000/agentic-codex-02-tool-use-and-environment/).*

## Domain 3 — Memory, State & Execution (19%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Three memory tiers | Job outputs (ephemeral) · walk-plan/evidence **artifacts** between walk and fix jobs (session) · committed [`.quests/ledger.json`](https://github.com/bamr87/it-journey/blob/main/.quests/README.md) + [`.cms/`](https://github.com/bamr87/it-journey/blob/main/.cms/README.md) index (persistent) | State lives in the tier that matches how long it must survive |
| Durable progress, resumability | The quest-perfection **ledger**: each slice's status survives across daily runs; stuck/needs_human slices are skipped, not repeated | The next run reads the register and continues instead of repeating |
| Context-drift detection | [`scripts/ai/drift-guard.sh`](https://github.com/bamr87/it-journey/blob/main/scripts/ai/drift-guard.sh), wired between plan and act in the reference pipeline | Snapshot at plan time, verify before acting, exit 78 aborts on a moved world |

*Taught by [Chapter III — Vaults of Recollection](/quests/1001/agentic-codex-03-memory-state-and-execution/).*

## Domain 4 — Evaluation & Tuning (19%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Machine-verifiable success criteria | [`scripts/quest/quest_audit.py`](https://github.com/bamr87/it-journey/blob/main/scripts/quest/quest_audit.py) (tier-1 score ≥ 70%) · [`scripts/ci/brand_lint.py`](https://github.com/bamr87/it-journey/blob/main/scripts/ci/brand_lint.py) · [`scripts/ci/classify_changes.py`](https://github.com/bamr87/it-journey/blob/main/scripts/ci/classify_changes.py) | "Done" is a function of signals, not an opinion — drift blocks the merge |
| The model never grades itself | The **deterministic keep/revert gate** in [`quest-fix.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/quest-fix.yml) | An edit is kept only if the deterministic signal improved — never on the model's own grade |
| Failure RCA | [`docs/agents/rca-template.md`](https://github.com/bamr87/it-journey/blob/main/docs/agents/rca-template.md) + `gh run download` forensics convention | Classify by layer, 5-Why to a root cause in *our* system, then ship the prevention |
| Instructions as code | [`docs/agents/instructions-changelog.md`](https://github.com/bamr87/it-journey/blob/main/docs/agents/instructions-changelog.md) | Every behavior change carries its reason and its measured outcome |

*Taught by [Chapter IV — The Oracle Rubric](/quests/1010/agentic-codex-04-evaluation-and-tuning/).*

## Domain 5 — Multi-Agent Coordination (17%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Orchestration patterns | [`quest-perfection.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/quest-perfection.yml) **chains** walk → fix per slice; the fleet's daily lanes run in parallel isolation (one PR each, non-overlapping scopes) | Chain for dependent work, fan-out for independent work, reconciliation at the join (auto-merge lanes) |
| Distributed tracing | Correlation ID threaded through jobs, summaries, and artifact names in [`agent-plan-then-act.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/agent-plan-then-act.yml); slice ids + ledger entries across walk/fix | One identifier reassembles a multi-job run into a single narrative |
| Failure recovery | `continue-on-error`/skip semantics in the perfection loop; ledger marks slices `stuck`/`needs_human` (escalate) instead of blind retry | Stalled vs conflicting handled differently; escalation is a first-class outcome |
| Lifecycle management | [`_data/agents/registry.yml`](https://github.com/bamr87/it-journey/blob/main/_data/agents/registry.yml) + weekly [`agent-audit.yml`](https://github.com/bamr87/it-journey/blob/main/.github/workflows/agent-audit.yml) | Provision by row, deprecate by status flip, audited quarterly (`review_date`) |

*Taught by [Chapter V — The Council of Many](/quests/1011/agentic-codex-05-multi-agent-coordination/).*

## Domain 6 — Guardrails & Accountability (9%)

| Sub-skill | Implemented by | What it proves |
|---|---|---|
| Risk-based autonomy levels | [`_data/agents/autonomy-matrix.yml`](https://github.com/bamr87/it-journey/blob/main/_data/agents/autonomy-matrix.yml) | Every recurring action classified L0–L4 by reversibility, blast radius, predictability — with the guardrails that justify the level |
| File-scope boundary | [`.github/CODEOWNERS`](https://github.com/bamr87/it-journey/blob/main/.github/CODEOWNERS) | The workflow tree and quest framework demand a named human reviewer |
| Human approval gate | The `agent-approval` Environment in the reference pipeline; every AI lane's `*_ENABLED` kill switch + auth secret (both required, OFF by default) | Autonomy is opt-in twice, and the irreversible half waits for a human |
| Forbidden-actions pact | The Warden Pact in [`AGENTS.md`](https://github.com/bamr87/it-journey/blob/main/AGENTS.md) | A constraint that holds regardless of instruction — decline, comment, label, stop |
| Audit trail | Committed ledger + Actions run logs + PR history + the audit artifact in the reference pipeline | Instruction, action, and outcome reconstructable from the repo's own history |

*Taught by [Chapter VI — The Warden Pact](/quests/1100/agentic-codex-06-guardrails-and-accountability/).*

## Try it yourself

1. Read a chapter, then its artifact above — the pattern is identical, at scale.
2. Run the reference pipeline in your fork: create the `agent-approval`
Environment with yourself as required reviewer, set `AGENT_DEMO_ENABLED=true`, dispatch **🜂 Agent Plan-then-Act**, and watch the execute job wait for your seal.
3. Face the [Grand Capstone](/quests/1100/agentic-codex-capstone-exam-trial/) —
   this repository is a worked answer key, but the trial wants *your* build.

## Related

- [Epic Quest: The Agentic Codex](/quests/codex/agentic-codex/) — the campaign hub
- [GH-600 Study Hub](/notes/gh-600/) — domains, weights, and the quest line
- [Epic Quest: The Self-Operating Website](/quests/codex/self-operating-website/) — the campaign that *builds* a fleet like this one
