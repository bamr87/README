---
title: "Agent Skills"
repo: bamr87/skills
category: project-card
kind: docs
status: active
generated: true
generated_by: context_engine 1.0.0
enrichment: heuristic
source_fingerprint: dd818354495728d6
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

> Agent skills — prompts, MCP configurations, and AI development patterns. [!NOTE] Work in Progress — This repository is under active development. More skills are being added, existing skills are being updated to use the latest SDK patterns, and tests are being expanded to ensure quality. Contributions welcome!.

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
- ~509,370 words across 712 indexed documents
- code samples in: python, java, typescript, csharp, bash, plaintext, rust, markdown

## Structure

- `.github/` (705 docs)
- `tests/` (2 docs)
- `docs-site/` (1 docs)
- `hooks/` (1 docs)

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
```

MCP: `get_project` with `{"name": "skills"}` (server: `mcp/server.py`, registered in `.mcp.json`).
