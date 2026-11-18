---
aliases:
- Dual-compatibility architecture
- Obsidian↔Jekyll bridge
complexity: advanced
created: 2026-07-05
description: 'The actual architecture of this repo: one Markdown tree that is simultaneously
  an Obsidian vault (for authoring/browsing) and a Jekyll source (for publishing),
  kept in sync by a build-time bridge rather than a runtime backend.'
domain: static site architecture
related:
- '[[wiki/entities/zer0-pages]]'
- '[[wiki/entities/claude-obsidian]]'
- '[[wiki/concepts/github-pages-deployment]]'
- '[[wiki/concepts/ai-content-engine]]'
source_file: sites/zer0-pages/pages/wiki/concepts/jekyll-obsidian-dual-rendering.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/concepts/jekyll-obsidian-dual-rendering.md
sources:
- '[[wiki/sources/zer0-pages-prd]]'
status: seed
tags:
- concept
- architecture
- jekyll
- obsidian
title: Jekyll/Obsidian Dual-Rendering Architecture
type: concept
updated: 2026-07-05
---

# Jekyll/Obsidian Dual-Rendering Architecture

## Definition

This is the pattern actually implemented in this repository: a single body of Markdown content under `pages/` serves two consumers — **Obsidian**, for human/AI authoring and browsing (wikilinks, callouts, a Dataview-powered graph of Maps of Content), and **Jekyll**, for publishing to GitHub Pages. The vault is never polluted with Liquid, and the published site never requires Obsidian to render correctly. It stands in contrast to the [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/zer0-pages-prd|zer0-pages PRD]]'s vision of a Django-backed hybrid ("Django's robust backend with Jekyll's lightning-fast static site generation" — PRD §1), which this repo does not implement at all.

## How It Works

- `pages/` is opened directly as an Obsidian vault and is also the Jekyll `source:` directory (`_config.yml` sets `source: pages`).
- Content lives in exactly three Jekyll collections — `_docs/`, `_posts/`, `_notes/` — plus `_moc/` (Dataview-powered Maps of Content) and a handful of root index pages.
- Authoring happens through [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/claude-obsidian|claude-obsidian]]'s skills (`/wiki-ingest`, `/save`, `/autoresearch`, `/wiki-query`) or directly in Obsidian; either way the same conventions apply (flat YAML frontmatter, path-qualified `[[wikilinks]]`, no Liquid in content).
- At build time (CI, on push to `main`), Ruby plugins under `pages/_plugins/` are the **sole** Obsidian→HTML converter: they rewrite wikilinks/Dataview fences/callouts into standard HTML, and a companion plugin (`obsidian_graph_index.rb`) emits `/assets/data/wiki-index.json`, which the theme's Cytoscape-based graph UI consumes client-side at `/docs/obsidian/graph/`. Source Markdown files are never rewritten by the bridge.
- Liquid is confined to `_includes/` (plus the one opt-in exception, `_docs/obsidian/graph.md`, which sets `render_with_liquid: true` for a single `{% include %}` line). There is no local `_layouts/` — every layout name resolves into the theme gem.
- The site's UI (layouts, includes, Bootstrap 5) comes from the published `jekyll-theme-zer0` gem; this repo supplies only two local include overrides (bug-fix forks of theme partials, filed upstream) and its own `_data/` (Jekyll never loads `_data` from theme gems).

## Why It Matters

This is the single most important piece of *evergreen* architectural knowledge worth extracting from the PRD-ingestion pass — not because the PRD describes it (it doesn't), but because the PRD's Django+Jekyll hybrid vision makes a useful **foil**: it shows what this repo chose *not* to build. Instead of a runtime backend translating between a CMS database and static output, this repo uses a build-time bridge translating between two *file-format* conventions (Obsidian Markdown extensions vs. plain HTML/Liquid) over the *same* source tree. That is simpler, has no server component beyond GitHub Actions + GitHub Pages, and needs no database.

## Examples

- The pre-existing doc [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Obsidian Vault Integration]] describes an *earlier* version of this idea (a client-side JS resolver reading a Liquid-emitted `wiki-index.json`) that predates the current server-side Ruby-plugin bridge documented in the root `CLAUDE.md` — a useful reminder that even the "actual" architecture has evolved and vault docs can lag behind it.
- The graph page [[zer0-CMS/sites/zer0-pages/pages/_docs/obsidian/graph|Graph view]] is the one file in the entire vault permitted to use live Liquid, precisely because it renders the bridge's own graph-index output.

## Connections

- [[zer0-CMS/sites/zer0-pages/README|zer0-pages]] — the repo this architecture actually belongs to (as opposed to the PRD's Django+React vision for the same name).
- [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/claude-obsidian|claude-obsidian]] — supplies the authoring half of this architecture.
- [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/github-pages-deployment|GitHub Pages Deployment Model]] — the publishing half / end state of this architecture.
- [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/ai-content-engine|AI Content Engine]] — the content produced by claude-obsidian's skills flows into this same dual-rendered tree.
- [[zer0-CMS/sites/zer0-pages/pages/_docs/obsidian/getting-started|Getting Started with the Obsidian Vault]] and [[zer0-CMS/sites/zer0-pages/pages/_docs/obsidian/authoring-workflow|Authoring workflow]] — vault-content docs for the human-facing side of this architecture.

## Sources

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/zer0-pages-prd|zer0-pages PRD]] §1, §4 — describes a different (Django+Jekyll) hybrid; cited here as contrast, not as source of this concept's actual mechanics.
- Root `CLAUDE.md` and `pages/CLAUDE.md` — authoritative description of the real architecture (read directly during this ingestion, not `.raw/` sources).
