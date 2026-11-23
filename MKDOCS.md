# MkDocs Documentation Site

> How the published site at bamr87.github.io/README is built from the aggregated corpus: the config files, the generated navigation, and the build and deploy commands.

This repo (`bamr87/README`) builds a standalone [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) site from the aggregated documentation under [`docs/`](docs/) and publishes it to GitHub Pages at **<https://bamr87.github.io/README/>**.

> `docs/` is **generated aggregation output** (produced by the pipeline — see [`AGENTS.md`](AGENTS.md) and [`scripts/README.md`](scripts/README.md)). Don't hand-edit pages under `docs/` to fix content or build issues; fix the upstream repo or the processing script and re-run the pipeline.

## Files that drive the site

| File | Purpose |
|------|---------|
| [`mkdocs.yml`](mkdocs.yml) | Site config — theme, extensions, `docs_dir: docs`, `site_url`; pulls the nav in with `INHERIT: ./nav.yml` |
| [`nav.yml`](nav.yml) | **Generated** — the `nav` tree and the `exclude_docs` rules, rendered by the context engine's navigator |
| [`overrides/`](overrides/) | Hand-written theme overrides wired by `theme.custom_dir`: `main.html` (SEO and Open Graph meta, skip link, the development-only page bridge), `404.html`, `assets/fleet-tokens.css` (design tokens, registered under `extra_css`) |
| [`brain_site/hook.py`](brain_site/hook.py) | MkDocs hook: resolves `[[wikilinks]]` and callouts, adds backlinks, publishes the graph and the browser assets in [`brain_site/assets/`](brain_site/assets/) (the views in `brain.js`, the workspace in `workspace.js`) |
| [`requirements-docs.txt`](requirements-docs.txt) | Site build deps (`mkdocs`, `mkdocs-material`, `pymdown-extensions`); the hook also needs `requirements.txt` |
| [`.github/workflows/deploy-pages.yaml`](.github/workflows/deploy-pages.yaml) | Builds and deploys to GitHub Pages |
| [`docs/`](docs/) | Source content (generated; one folder per aggregated repo) |

> The parent `bamr87/bamr87` monorepo *also* has a root `mkdocs.yml` that builds this same `docs/` tree (as `docs_dir: README/docs`). The config here is the **standalone** one for the `README` repo's own Pages site.

## Quick start (local)

```bash
# from the repo root
python3 -m venv .venv && source .venv/bin/activate   # a .venv/ already exists in-tree
pip install -r requirements.txt -r requirements-docs.txt

mkdocs serve            # dev server with live reload
mkdocs build            # static build into site/
```

Then open **<http://localhost:8000/README/>** — note the `/README/` path. The dev server honors the `site_url` base path, so the bare `http://localhost:8000/` 302-redirects to `/README/`.

To serve without the base-path redirect during quick edits, point `mkdocs serve` at a different address: `mkdocs serve -a localhost:8001`.

To let a Claude Code session see the page you have open, serve with the fleet's page bridge on: `FLEET_ASSIST=1 mkdocs serve`. It is a developer tool: without the variable no page carries the `<fleet-assist>` tag, and the published site is built without it (see [Theme overrides](#theme-overrides)).

## Build behavior (read this before "fixing" warnings)

- **The build is intentionally non-strict.** `mkdocs build` exits 0 but prints several hundred `WARNING` lines about broken links and missing anchors. These are inherent to aggregating Markdown from many independent repos (relative links point at files that weren't aggregated). They are expected — do **not** add `--strict` to the deploy, and don't hand-edit `docs/` to chase them.
- **Navigation is generated, not curated.** `mkdocs.yml` carries no `nav:` key; it pulls `nav.yml` in with `INHERIT`, and the context engine's navigator renders that file from the `docs/` folder hierarchy plus the `navigation:` contract in `_data/projects.yml`. Every published page has a sidebar entry. Never hand-edit `nav.yml` and never add a `nav:` key to `mkdocs.yml` — it would shadow the generated tree and the sidebar would silently stop tracking the corpus.
- **`nav.yml` also carries `exclude_docs` and `not_in_nav`.** `exclude_docs` drops what the registry excludes and re-includes the dot-directories MkDocs skips by default; `not_in_nav` then declares those same dot-paths as deliberately unlisted. Every nav entry points at a page the site builds, and MkDocs does not warn about the pages that are built without one.
- **Dot-directories no longer reach the corpus.** The crawl drops them as plumbing unless a project claims one back with `collect.include`, and renames those it keeps (`.github` → `dot-github`). `navigation.publish_hidden` is `false`, which also keeps `docs/.obsidian/` out of the site. The next paragraph is why.
- **GitHub Pages does not serve dot-paths.** GitHub Pages does not serve a URL containing a dot-prefixed segment — verified against the live site: `_underscore` and plain paths return 200, every `/.dot/` path returns 404. So `navigation.navigate_hidden` is `false` in the registry: the ~1,000 pages under `.github/`, `.claude/`, `.cms/` and friends stay in the build (and the sitemap) but get no sidebar entry, because a sidebar entry for them would be a dead link. Set `navigate_hidden: true` only if those paths ever become servable — e.g. if the corpus renames dot-directories at ingest.
- **Upstream `icon:` frontmatter is normalized at ingest.** Material resolves `page.meta.icon` as a bundled SVG for every nav entry, so a Jekyll value like `icon: globe` used to fail the whole build — which is why the nav was hand-curated before. `scripts/fix_frontmatter_icons.py` now maps those onto Material icons (keeping the original as `source_icon`), so every page is safe to place in the nav.
- Adding a new aggregated repo? Add it to `_data/projects.yml` and rebuild — `python3 -m scripts.context_engine build` regenerates `nav.yml`, `context/nav/` and `docs/browse/`. There is nothing to add here by hand.

## Theme overrides

`overrides/` is hand-written source, unlike `docs/`. `mkdocs.yml` points `theme.custom_dir` at it and lists `assets/fleet-tokens.css` under `extra_css`; MkDocs copies the file from `overrides/assets/` into the built site, so the stylesheet is served at `assets/fleet-tokens.css`.

- `overrides/main.html` extends Material's `base.html`. It emits `description`, `og:title`, `og:description`, `og:type`, `og:url` (from `page.canonical_url`) and `og:site_name` in `<head>`, taking the description from the page's `description` frontmatter and falling back to `site_description`. It prepends a visible-on-focus skip link before the header and puts the `#main-content` anchor at the top of the content block.
- `overrides/main.html` also mounts the fleet's page bridge, `<fleet-assist>`, at the end of `<body>` (its `scripts` block), and only when `extra.fleet_assist.enabled` is true. `mkdocs.yml` reads that key from the environment (`!ENV [FLEET_ASSIST, false]`), so `FLEET_ASSIST=1 mkdocs serve` turns it on and a plain `mkdocs build` emits no tag. The tag tells a paired session the repository, the branch and the file behind the page: `docs/` plus the page's source path, or `overrides/404.html` on the not-found page. `navigation.instant` swaps pages without a reload and keeps the tag, so a `document$` subscriber copies the new page's source and title from the `<template id="fleet-assist-page">` in the content block. The payload, `docs/assets/js/fleet-assist.js`, is vendored from the hub's assistant kit ([`templates/assistant/`](https://github.com/bamr87/bamr87/tree/main/templates/assistant), which also explains pairing) and held byte-identical to it: never edit it here. MkDocs copies that file into every build; without the tag no page loads it.
- `overrides/404.html` extends `main.html` and gives GitHub Pages a custom `site/404.html` with a short message, a link to the site root and a button that opens the search box.
- `overrides/assets/fleet-tokens.css` declares the `--fleet-color-*`, `--fleet-space-*` and `--fleet-font-*` custom properties (the indigo palette from `mkdocs.yml`) and the `.skip-link` rule. Keep the `--fleet-color-` prefix: the hub conformance check (UPS-FE-01) looks for it.

These overrides cover UPS-FE-01, UPS-FE-11 and UPS-FE-25. UPS-FE-15 (no 404 page) stays red in the hub checker until it also accepts a 404 template under a MkDocs `custom_dir`; do not add a root `404.html` to satisfy it.

## Obsidian on the site

`docs/` stays a plain Obsidian vault. The hook reads `context/vault/graph.json`, and it resolves links with the engine's own `Resolver`, so the site and the app agree. What it adds:

| Obsidian | On the site | Where |
|---|---|---|
| The app window | `/brain/workspace/`: files, tabs, split panes, links, outline, commands | `workspace.js` (next section) |
| Wikilinks, callouts | Links and admonitions | `hook.py`, at render time; `docs/` is not changed |
| Graph view | `/brain/graph/`: filter, groups, forces, orphans | `brain.js` on `/brain/graph/` |
| Local graph | Right sidebar of each page | `brain.js` |
| Backlinks, outgoing links | Panel at the foot of each page | `hook.py` |
| Page preview | Hovering an internal link | `brain.js` |
| Quick switcher | `Ctrl+O` / `Cmd+O`, or the header button | `brain.js` |
| Canvas | `/brain/canvas/`, drawn from `brain/fleet.canvas` | `brain.js` |
| Bases | `/brain/pages/`, a sortable table | `brain.js` |
| Tag pane | `/brain/tags/` | generated |

Everything re-attaches on `document$`, because `navigation.instant` swaps pages without a reload. A build needs `context/vault/graph.json`, so run `python3 -m scripts.context_engine build` first. To use the vault in the app, open `docs/` as a vault; the graph colours and core plugins are in `docs/.obsidian/`.

### The workspace

`/brain/workspace/` lays the vault out the way the Obsidian app does, in the browser, with nothing to install. The header button with the three columns opens it from any page.

| Part | What it does |
|---|---|
| Ribbon | Switches the left sidebar between files, search, tags and bookmarks; opens the graph, the canvas, the quick switcher and the command palette; leaves the workspace |
| Files | The vault's folders, one colour per repository as in the graph. Only the rows on screen exist, so 4,000 notes scroll like 40. Arrow keys move, Enter opens |
| Search | Titles, tags, paths and summaries, ranked. `tag:`, `project:`, `kind:` and `path:` narrow it, quotes keep a phrase together and a leading minus excludes. Page text stays with the header search |
| Tabs and panes | A click opens a note in the current tab and keeps its history; Ctrl or Cmd with a click opens a new tab; `Split right` puts up to three panes side by side |
| Note details | The note's local graph (one to three links away), backlinks, outgoing links, outline and properties |
| Command palette | `Ctrl+P` / `Cmd+P`: every action above by name, with its key |

It adds no second renderer and no second resolver. A note in a tab is the article of the page MkDocs already built for it, fetched and placed in the tab, so wikilinks, callouts and code look as they do on the page; the explorer, the search and the links all come from `assets/brain/graph.json`. What the published page cannot do without Material's own scripts (Mermaid diagrams, the code copy button) the tab does not do either; `Open on the site` is one click away.

The address is the note: `/brain/workspace/#/it-journey/README.md` opens that note, and `#/graph` and `#/canvas` open those views, so a link to the workspace can be a link to a note. Open tabs, the sidebars, bookmarks and recent notes are kept in the reader's own `localStorage` (key `brain-workspace`) and nowhere else: the workspace makes no request but a GET for the graph and the pages. A saved layout is checked against the current graph when it is restored, so a note a later build removed is dropped rather than shown broken.

Under 760 pixels the workspace shows one pane, puts the ribbon along the bottom and turns the sidebars into drawers.

The logic with no DOM in it (the folder tree, the search, the saved layout) is at the top of `workspace.js` and is what `tests/js/workspace.test.cjs` loads under node; `tests/unit/test_cases/test_brain_site.py` runs that suite, checks both scripts parse, and fails if a generated view page asks for a view the browser does not have. A new view is a function that takes a host element and returns `{ destroy() }`: add it to `BrainVault.views` in `brain.js`, or call `BrainVault.register(name, mount)` from a script loaded after it, and list the script in `SCRIPTS` in `hook.py`.

## Deployment (GitHub Pages)

Deployment is automated by [`.github/workflows/deploy-pages.yaml`](.github/workflows/deploy-pages.yaml):

- **Triggers:** each successful run of `Aggregate Documentation`, because a commit made with `GITHUB_TOKEN` starts no workflow; pushes to `main` touching `docs/**`, `brain_site/**`, `context/vault/**`, `mkdocs.yml`, `nav.yml`, `requirements-docs.txt`, or the workflow itself; plus manual `workflow_dispatch`.
- **How:** builds with `mkdocs build`, uploads the `site/` artifact, and publishes via the official `actions/deploy-pages` (no `gh-pages` branch — uses the Pages artifact flow).

**One-time setup:** in the repo's **Settings → Pages**, set **Source = "GitHub Actions"**. Until that's done the workflow build will succeed but the deploy step has nowhere to publish.

## Theme & features (`mkdocs.yml`)

- **Material theme** with light/dark palette toggle.
- **Search** across all aggregated docs (client-side).
- **Navigation:** tabs (one per corpus), sections, `navigation.indexes` (a folder's `README.md`/`index.md` acts as the section landing page — the navigator emits it as the section's first child), `navigation.prune` (only the active branch is rendered, which is what keeps a 3,100-page nav fast), back-to-top.
- **Markdown extensions:** admonitions, footnotes, `pymdownx.superfences` (incl. Mermaid), tabbed content, task lists, syntax highlighting with copy button, emoji.

## Authoring conventions

These apply when you edit *source* docs (upstream repos / processing scripts), since `docs/` itself is generated.

### Links

```markdown
[Same dir](setup-guide.md)        # ✅ relative
[Parent](../README.md)            # ✅ relative
[Section](../guide.md#section)    # ✅ anchor
[GitHub](https://github.com/...)  # ✅ external as-is
```

Avoid absolute site paths (`/absolute/path`) and Jekyll/Hugo templating (`{{ '/x' | relative_url }}`) — MkDocs doesn't process them.

### Frontmatter

```yaml
---
title: Document Title
description: Brief description for search and preview
tags:
  - topic
---
```

MkDocs ignores Jekyll/Hugo keys like `layout:` and `permalink:`, but the navigator reads a few:

| Key | Effect on the sidebar |
|---|---|
| `title` | The entry's label (falls back to the first H1, then the humanized filename) |
| `nav_order` / `order` / `weight` / `sidebar_position` | Pins the entry's position within its section |
| `nav_exclude: true` | Keeps the page out of the sidebar |
| `icon` | Shown next to the entry — normalized to a bundled Material icon at ingest, original kept as `source_icon` |

### Anchors

Headings become anchors automatically: lowercased, spaces → hyphens, special characters dropped (`## API Reference` → `#api-reference`).

## Troubleshooting

**Build fails with `'.icons/<name>.svg' not found`** — an aggregated page carries an `icon:` value Material can't resolve. Run `python3 scripts/fix_frontmatter_icons.py --apply` (or `bash scripts/run_doc_checks.sh --apply`), then rebuild. If the value is a vocabulary the mapping doesn't know yet, add it to `BOOTSTRAP_TO_MATERIAL` in that script.

**A page exists but has no sidebar entry** — MkDocs logs "pages exist in the docs directory, but are not included in the nav". The nav and the site's page set are generated together, so this means the two drifted: rebuild with `python3 -m scripts.context_engine build`. If it persists, the page is being excluded by a `navigation.exclude` / `nav.exclude` glob in `_data/projects.yml` while still being published — fix the glob, not the nav.

**The sidebar is missing a whole folder** — if it starts with `.`, that is deliberate (see *Build behavior* above): those paths 404 on GitHub Pages, so `navigation.navigate_hidden` keeps them out of the nav. Otherwise check the `exclude` globs in `_data/projects.yml`.

**Port already in use** — `mkdocs serve -a localhost:8001`.

**Stale build** — `rm -rf site && mkdocs build`.

**Virtualenv issues** — `deactivate; rm -rf .venv; python3 -m venv .venv; source .venv/bin/activate; pip install -r requirements-docs.txt`.

---

*Documentation powered by MkDocs Material.*
