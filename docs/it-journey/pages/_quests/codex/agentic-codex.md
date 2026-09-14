---
author: IT-Journey Team
categories:
- Quests
- Agentic-AI
- AI/ML
- Certifications
- DevOps
comments: true
date: '2026-06-30T00:00:00.000Z'
description: Earn the GitHub GH-600 — six chapters that build, evaluate, and govern
  autonomous AI agents on GitHub-native rails, from the SDLC to the Warden Pact.
difficulty: ⚔️ Epic
draft: false
estimated_time: 40-60 hours
excerpt: A six-chapter GH-600 campaign — build, tool, remember, evaluate, coordinate,
  and govern AI agents with Copilot, MCP, Actions, and the Models API.
fmContentType: quest
keywords:
  primary:
  - gh-600
  - agentic-ai
  - github-copilot
  secondary:
  - mcp
  - multi-agent
  - guardrails
  - certification
lastmod: '2026-09-13T04:45:00.000Z'
layout: quest
learning_style: project-based
level: '1100'
mermaid: true
permalink: /quests/codex/agentic-codex/
prerequisites:
  knowledge_requirements:
  - Comfortable with Git branches, commits, and pull requests
  - Working knowledge of GitHub Actions and YAML workflows
  - Hands-on experience with GitHub Copilot in an editor
  system_requirements:
  - A GitHub account with a repository you own
  - GitHub Copilot access (free trial is enough for most chapters)
  - Git and an editor with the Copilot extension (VS Code, JetBrains, or Neovim)
primary_technology: github-copilot
quest_arc: Earn the GH-600
quest_dependencies:
  recommended_quests: []
  required_quests: []
  unlocks_quests:
  - /quests/0111/agentic-codex-01-agents-in-the-sdlc/
  - /quests/1000/agentic-codex-02-tool-use-and-environment/
  - /quests/1001/agentic-codex-03-memory-state-and-execution/
  - /quests/1010/agentic-codex-04-evaluation-and-tuning/
  - /quests/1011/agentic-codex-05-multi-agent-coordination/
  - /quests/1100/agentic-codex-06-guardrails-and-accountability/
quest_line: The Agentic Codex
quest_series: The Agentic Codex
quest_type: epic_quest
redirect_from:
- /docs/agentic-codex/
- /quests/gh-600/
rewards:
  badges:
  - 👑 GH-600 Agentic Architect — completed all six domains of the Agentic Codex
  - 🏛️ Codex Master — survived the Grand Capstone trial
  - 🛡️ Warden of Autonomy — passed the guardrails-and-accountability chapter
  progression_points: 200
  skills_unlocked:
  - 🤖 Designing bounded, observable agents in the SDLC
  - 🔧 Tooling agents with MCP, scoped permissions, and safe execution
  - 🕸️ Orchestrating and governing multi-agent systems on GitHub
  unlocks_features:
  - The Grand Capstone — Trial of the Agentic Codex
skill_focus: ai-ml
source_file: agentic-codex.md
tags:
- '1100'
- github-copilot
- epic_quest
- agentic-ai
- gh-600
- mcp
- ci-cd
- project-based
title: Agentic Codex
validation_criteria:
  completion_requirements:
  - All six chapters completed and their domain seals broken
  - The Grand Capstone passed with a working multi-agent system on GitHub
  knowledge_checks:
  - Understands the three memory tiers and when each applies
  - Can classify an agent action by risk and choose the right human-in-the-loop gate
  skill_demonstrations:
  - Can map an agentic task to the six GH-600 domains
  - Can configure an MCP server, a least-privilege permissions block, and an autonomy
    gate
---
Six chapters. Six GH-600 domains. Build, tool, remember, evaluate, coordinate, and govern agents on GitHub-native rails — then prove it in the Grand Capstone.

This campaign is exam prep for **[GH-600: Developing in Agentic AI Systems](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600)**. Domain weights below are **ranges from Microsoft Learn** ("Skills at a glance") — Learn does not publish fixed percents. Passing score: **700 or greater**. Certification renews annually via a free Learn assessment.

## Quest objectives

- [ ] **D1 — Agents in the SDLC** — integrate agents in the lifecycle; separate plan vs execute; observability and control
- [ ] **D2 — Tool Use & Environment** — select tools and permissions; configure MCP; safe execution and retries
- [ ] **D3 — Memory, State & Execution** — memory strategies; persist state and detect drift; continuity across tools
- [ ] **D4 — Evaluation & Tuning** — success criteria and signals; failure root-cause analysis; tune from evidence
- [ ] **D5 — Multi-Agent Coordination** — orchestration; multi-agent observability; failure recovery; agent lifecycle
- [ ] **D6 — Guardrails & Accountability** — autonomy levels; guardrails and human-in-the-loop

You will know you are ready when you can map a task to the six domains, write a least-privilege `permissions:` block and an MCP allow-list, diagnose a failing agent from logs, and keep irreversible actions behind an explicit human gate (the Warden Pact).

## Campaign — six chapters

Play in order. Weights cite Learn ranges only.

| # | Chapter | Level | Domain (Learn weight) | Difficulty |
|---|---|---|---|---|
| I | [Initiation Rites: Agents in the SDLC](/quests/0111/agentic-codex-01-agents-in-the-sdlc/) | `0111` | D1 · Agentic AI in the SDLC (**15–20%**) | 🟡 Medium |
| II | [Forging the Arsenal: Tool Use & Environment](/quests/1000/agentic-codex-02-tool-use-and-environment/) | `1000` | D2 · Tools & Environment (**20–25%**) | 🔴 Hard |
| III | [Vaults of Recollection: Memory & State](/quests/1001/agentic-codex-03-memory-state-and-execution/) | `1001` | D3 · Memory, State & Execution (**10–15%**) | 🔴 Hard |
| IV | [The Oracle Rubric: Evaluation & Tuning](/quests/1010/agentic-codex-04-evaluation-and-tuning/) | `1010` | D4 · Evaluation & Tuning (**15–20%**) | 🔴 Hard |
| V | [The Council of Many: Multi-Agent Systems](/quests/1011/agentic-codex-05-multi-agent-coordination/) | `1011` | D5 · Multi-Agent Coordination (**15–20%**) | 🔴 Hard |
| VI | [The Warden Pact: Guardrails & Accountability](/quests/1100/agentic-codex-06-guardrails-and-accountability/) | `1100` | D6 · Guardrails & Accountability (**10–15%**) | 🔴 Hard |

Source: [GH-600 study guide — Skills at a glance](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600).

> Every chapter ends in a hands-on lab (mostly `bash` / `jq` / `gh`). The [Grand Capstone](/quests/1100/agentic-codex-capstone-exam-trial/) gates behind all six chapters.

**Campaign XP (front matter):** hub `progression_points: 200`; chapters and capstone sum to roughly +600 across the series. The level-banner `6000–7000` range comes from the binary level hub (`1100` in `_data/quests/levels.yml`), not this campaign’s score — treat front-matter `progression_points` as the source of truth for Agentic Codex XP.

## Start here

→ **[Chapter I — Initiation Rites: Agents in the SDLC](/quests/0111/agentic-codex-01-agents-in-the-sdlc/)**

Optional map: [GH-600 Study Hub](/notes/gh-600/) · [Skills checklist](/notes/gh-600/skills-checklist/) · [Implemented in IT-Journey](/notes/gh-600/implemented-in-it-journey/) · [Grand Capstone](/quests/1100/agentic-codex-capstone-exam-trial/)

## Study apparatus

- [GH-600 Study Guide (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-600) — official skills-measured source of truth
- [GitHub Copilot coding agent docs](https://docs.github.com/en/copilot/using-github-copilot/using-copilot-coding-agent-to-work-on-tasks)
- [Model Context Protocol specification](https://modelcontextprotocol.io/)
- [Extending Copilot with MCP](https://docs.github.com/en/copilot/customizing-copilot/extending-copilot-chat-with-mcp)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [GitHub Models](https://docs.github.com/en/github-models)

## Campaign completion checklist

- [ ] Completed all six chapters in order
- [ ] Broke every domain seal (D1 through D6)
- [ ] Earned the Warden of Autonomy and Codex Master badges
- [ ] Passed the Grand Capstone with a governed multi-agent system
