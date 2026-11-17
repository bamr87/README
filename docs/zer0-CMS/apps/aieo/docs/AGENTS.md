---
source_file: apps/aieo/docs/AGENTS.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/apps/aieo/docs/AGENTS.md
title: Agent Catalog
---
# Agent Catalog

Prompt agents live in `backend/prompts/agents/` and are executed by `AgentRunner`.

## Available agents

- `content-analyzer`
- `seo-optimizer`
- `meta-creator`
- `internal-linker`
- `keyword-mapper`
- `editor`
- `performance`
- `headline-generator`
- `cro-analyst`
- `landing-page-optimizer`
- `prd-lineage-analyst`
- `prd-synthesizer`

## API

- `POST /api/v1/aieo/agent/run`
  - body: `agent_name`, `content`, optional `extra_inputs`, optional `model`

## MCP

- `aieo_editor_review`
- `aieo_headline_generate`
