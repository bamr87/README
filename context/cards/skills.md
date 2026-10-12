---
title: "Agent Skills"
repo: bamr87/skills
category: project-card
kind: docs
status: active
generated: true
generated_by: context_engine 1.0.0
enrichment: ai:anthropic
source_fingerprint: a595ab0372a11167
tags:
  - agents
  - ai
  - featured
  - learning
  - mcp
  - memory
  - productivity
  - prompts
  - reflection
---

# Agent Skills

> Agent Skills is an active, work-in-progress repository collecting reusable AI development building blocks—prompts, MCP server configurations, and agent patterns—organized as a browsable skill catalog across 712 documents and multiple languages including Python, TypeScript, Java, and Rust. It ships a scaffolding workflow, security policy, and test suite, with skills spanning themes like learning, memory, reflection, and productivity. Open it to find ready-made skills and SDK patterns for building agents, or to contribute new ones to the growing collection.

| | |
|---|---|
| Repository | [bamr87/skills](https://github.com/bamr87/skills) |
| Kind | docs |
| Status | active |
| Branch | default |
| Corpus | `docs/skills` - 712 docs |
| External | no |

## Signals

- has AGENTS.md operating manual
- has a security policy
- ~509,396 words across 712 indexed documents
- code samples in: python, java, typescript, csharp, bash, plaintext, rust, markdown

## Navigation

7 published pages in 3 sections (max depth 3) — [browse the full map](../../docs/browse/skills.md) · [tree as JSON](../nav/skills.json)

- **Documentation** (1 pages)
- **Repository & tooling** (3 pages)

## Key documents

- [`README.md`](../../docs/skills/README.md)
- [`SECURITY.md`](../../docs/skills/SECURITY.md)
- [`.github/prompts/scaffold-foundry-app.prompt.md`](../../docs/skills/.github/prompts/scaffold-foundry-app.prompt.md)
- [`.github/docs/skills.md`](../../docs/skills/.github/docs/skills.md)
- [`tests/AGENTS.md`](../../docs/skills/tests/AGENTS.md)
- [`Agents.md`](../../docs/skills/Agents.md)
- [`.github/copilot-instructions.md`](../../docs/skills/.github/copilot-instructions.md)
- [`.github/agents/scaffolder.agent.md`](../../docs/skills/.github/agents/scaffolder.agent.md)

## Query this context

```bash
python3 -m scripts.context_engine query skills
python3 -m scripts.context_engine facts skills
python3 -m scripts.context_engine nav skills
```

MCP: `get_project` with `{"name": "skills"}` (server: `mcp/server.py`, registered in `.mcp.json`).
