---
created: 2026-07-05
description: The Claude Code plugin/submodule that is the vault's actual content-creation
  engine — skills for ingesting sources, answering questions, saving conversations,
  and researching, all operating directly on this Obsidian vault.
entity_type: product
first_mentioned: '[[wiki/sources/zer0-pages-prd]]'
related:
- '[[wiki/entities/zer0-pages]]'
- '[[wiki/concepts/jekyll-obsidian-dual-rendering]]'
- '[[wiki/concepts/ai-content-engine]]'
role: Authoring/AI engine (git submodule)
source_file: sites/zer0-pages/pages/wiki/entities/claude-obsidian.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/entities/claude-obsidian.md
sources:
- '[[wiki/sources/zer0-pages-prd]]'
status: seed
tags:
- entity
- product
- claude-obsidian
title: claude-obsidian
type: entity
updated: 2026-07-05
---

# claude-obsidian

## Overview

claude-obsidian is a Claude Code plugin, vendored into this repository as a git submodule at `claude-obsidian/`, that implements the "LLM Wiki" pattern: drop a source into `.raw/`, ask a question, or have a conversation, and its skills turn that into structured, cross-linked notes inside an Obsidian vault. In this repo, that vault **is** `pages/` — the same directory that is also the Jekyll source for the published site. claude-obsidian is not mentioned anywhere in the [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/zer0-pages-prd|zer0-pages PRD]], yet it is the real system fulfilling the PRD's vision of an "AI Layer" plus content-management admin: where the PRD imagines a Django AI service and a React content editor, this repo actually has claude-obsidian's skills operating on Markdown files.

## Key Facts

- Ships as a git submodule (`claude-obsidian/`) — per the root `CLAUDE.md`, it must never be modified directly; it is an upstream dependency.
- Core skills: `/wiki` (setup/scaffold), `/wiki-ingest` (file a source from `.raw/` into `wiki/`), `/wiki-query` (answer from the vault), `/wiki-lint` (health check), `/save` (capture a conversation as a note), `/autoresearch` (web-research loop that files findings), `/canvas` (visual layer for images/PDFs).
- v1.7+ adds `/wiki-cli` (Obsidian CLI transport wrapper), `/wiki-retrieve` (hybrid BM25 + cosine-rerank retrieval, opt-in), and per-file advisory locking (`scripts/wiki-lock.sh`) for safe multi-writer ingest — though `wiki-lock.sh` depends on `flock`, which is not present on this machine's macOS/bash by default (confirmed during this ingestion: `flock: command not found`).
- v1.8+ adds `/wiki-mode`, letting a vault opt into an organizational methodology (generic / LYT / PARA / Zettelkasten) via `.vault-meta/mode.json`; this vault has no such file, so it runs in the v1.7-compatible **generic** mode (flat `wiki/sources/` · `wiki/concepts/` · `wiki/entities/` layout).
- v1.9 adds `/think`, a ten-principle reasoning workflow other skills can invoke for architectural decisions and ambiguous requests.
- The vault it maintains here (`pages/wiki/`) is the knowledge base this very page lives in — see [[zer0-CMS/sites/zer0-pages/pages/wiki/index|the wiki index]], [[zer0-CMS/sites/zer0-pages/pages/wiki/hot|hot cache]], and [[zer0-CMS/sites/zer0-pages/pages/wiki/log|log]].

## Connections

- [[zer0-CMS/sites/zer0-pages/README|zer0-pages]] — the repo/vault claude-obsidian operates on; the PRD assigned to "zer0-pages" a Django+React role that claude-obsidian actually fills, differently.
- [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/jekyll-obsidian-dual-rendering|Jekyll/Obsidian Dual-Rendering Architecture]] — claude-obsidian is the authoring half of this architecture; the `pages/_plugins/` bridge is the publishing half.
- [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/ai-content-engine|AI Content Engine]] — claude-obsidian's ingest/save/autoresearch skills are the real-world analog of the PRD's imagined "AI Content Engine."
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Obsidian Vault Integration]] and [[zer0-CMS/sites/zer0-pages/pages/_docs/obsidian/getting-started|Getting Started with the Obsidian Vault]] — vault-content docs describing (a related but not identical, possibly stale) Obsidian↔Jekyll integration.

## Sources

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/zer0-pages-prd|zer0-pages PRD]] — does not name claude-obsidian, but its "AI Layer" / admin-dashboard vision is the closest analog.
- Root `CLAUDE.md` and `pages/CLAUDE.md` (not `.raw/` sources; read directly as part of this ingestion) — the authoritative description of claude-obsidian's actual role in this repo.
