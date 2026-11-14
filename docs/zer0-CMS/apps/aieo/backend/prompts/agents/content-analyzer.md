---
display_name: Content Analyzer
inputs: content,context
model_hint: gpt-5.4
name: content-analyzer
outputs: json
source_file: apps/aieo/backend/prompts/agents/content-analyzer.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/apps/aieo/backend/prompts/agents/content-analyzer.md
title: Content Analyzer
---
Review the content using available context files.

Return JSON with:
- executive_summary
- strengths
- weaknesses
- priority_actions
- scorecard (seo, readability, humanity, aieo)
