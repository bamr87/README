# ADR 0002 — Treat docs/ as an Obsidian vault with one link resolver

- **Status**: accepted
- **Date**: 2026-11-06
- **Deciders**: the maintainers
- **Related**: `scripts/context_engine/vault.py`, `brain_site/hook.py`, PRD § 4 items 9 to 11

## Context

The corpus held every Markdown file of seven repositories, including agent configuration, test fixtures and generated reports, and it was built by four scripts through a temporary tree. Most links were dead: of about 9,900 internal links, roughly a quarter used Jekyll permalinks, and about 1,800 of 2,300 wikilinks named a page by title. Neither Obsidian nor MkDocs resolves those. Nothing connected repositories that do not link to each other, and the pages under dot-directories could be neither served by GitHub Pages nor seen in Obsidian.

## Decision

`docs/` is an Obsidian vault. `vault.py` is the only definition of a note and of what a link points at; the crawl, the generated notes, the query layer and the MkDocs hook all use it. One `collect` stage replaces the crawl scripts and selects official documentation with registry rules. It renames dot-prefixed path segments (`.github` to `dot-github`) and weaves permalink and title links into path-qualified wikilinks. The engine generates `docs/brain/` on each build, and `notes/` is the one hand-written source.

The site side is a local MkDocs hook rather than third-party plugins, so that there is one resolver and the graph includes ordinary Markdown links.

## Consequences

**Positive**

- A link means the same thing in Obsidian, on the site and over MCP.
- The corpus holds documentation only, and every remaining page is navigable.
- Concept notes connect repositories that never link to each other.

**Negative**

- Corpus paths under renamed directories, and URLs for dropped pages, change once.
- The custom graph and views are ours to maintain, including their vendored `d3-force` bundle.
- The site build now needs `context/vault/graph.json` and the engine's dependencies.

## Alternatives considered

- **`mkdocs-obsidian-interactive-graph-plugin` with a wikilink plugin** — its graph needs wikilinks, so it misses most of the corpus's links, and it would add a second resolver that can disagree with the engine.
- **Installing the claude-obsidian plugin over a separate vault** — it manages a personal vault through reviewed transactions; here the vault is a build output, regenerated from sources, so the pattern fits and the tool does not.
- **Keeping dot-directories and rewriting only their URLs** — fixes Pages, but Obsidian would still hide them.

## Supersedes / Superseded by

None.
