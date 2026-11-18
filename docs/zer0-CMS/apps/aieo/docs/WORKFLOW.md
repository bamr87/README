---
source_file: apps/aieo/docs/WORKFLOW.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/apps/aieo/docs/WORKFLOW.md
title: Unified Workflow
---
# Unified Workflow

This repository now supports an end-to-end workflow:

1. `topics/` - capture ideas
2. `research/` - generate briefs with `/aieo/research`
3. `drafts/` - create long-form drafts with `/aieo/write`
4. `rewrites/` - improve existing drafts with `/aieo/rewrite`
5. `published/` - move finalized content through `/aieo/publish/wordpress`

All artifacts are stored in `.aieo-workspace/` and can be managed from:

- Frontend routes (`/workspace`, `/topics`, `/research`, `/drafts`, `/rewrites`, `/published`)
- API endpoints under `/api/v1/aieo/*`
- MCP tools (`aieo_workspace_*`, `aieo_research`, `aieo_write`, `aieo_rewrite`)
- CLI workflow commands in `tools/aieo_runner`
