---
display_name: PRD Lineage
inputs: repo_root
model_hint: gpt-5.4
name: prd
outputs: json
source_file: apps/aieo/backend/prompts/commands/prd.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/apps/aieo/backend/prompts/commands/prd.md
title: Prd
---
Search a product repository, identify every PRD element and lineage witness (README, CHANGELOG, agent instructions, docs, packaging), then return completeness, drift, and alignment actions.

Do not invent product facts. Preserve original intent. Label hypotheses. Every improvement must make the spec more buildable or the lineage more consistent.

Return JSON with: product_name, canonical_prd, maturity, completeness, drift, lineage, prd_improvements, alignment_actions, open_questions, context_brief.
