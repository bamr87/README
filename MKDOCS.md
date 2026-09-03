# MkDocs Documentation Site

This repo (`bamr87/README`) builds a standalone [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) site from the aggregated documentation under [`docs/`](docs/) and publishes it to GitHub Pages at **<https://bamr87.github.io/README/>**.

> `docs/` is **generated aggregation output** (produced by the pipeline — see [`CLAUDE.md`](CLAUDE.md) and [`scripts/README.md`](scripts/README.md)). Don't hand-edit pages under `docs/` to fix content or build issues; fix the upstream repo or the processing script and re-run the pipeline.

## Files that drive the site

| File | Purpose |
|------|---------|
| [`mkdocs.yml`](mkdocs.yml) | Site config — theme, extensions, `docs_dir: docs`, `site_url`; pulls the nav in with `INHERIT: ./nav.yml` |
| [`nav.yml`](nav.yml) | **Generated** — the `nav` tree and the `exclude_docs` rules, rendered by the context engine's navigator |
| [`requirements-docs.txt`](requirements-docs.txt) | Site build deps (`mkdocs`, `mkdocs-material`, `pymdown-extensions`) |
| [`.github/workflows/deploy-pages.yaml`](.github/workflows/deploy-pages.yaml) | Builds and deploys to GitHub Pages |
| [`docs/`](docs/) | Source content (generated; one folder per aggregated repo) |

> The parent `bamr87/bamr87` monorepo *also* has a root `mkdocs.yml` that builds this same `docs/` tree (as `docs_dir: README/docs`). The config here is the **standalone** one for the `README` repo's own Pages site.

## Quick start (local)

```bash
# from the repo root
python3 -m venv .venv && source .venv/bin/activate   # a .venv/ already exists in-tree
pip install -r requirements-docs.txt

mkdocs serve            # dev server with live reload
mkdocs build            # static build into site/
```

Then open **<http://localhost:8000/README/>** — note the `/README/` path. The dev server honors the `site_url` base path, so the bare `http://localhost:8000/` 302-redirects to `/README/`.

To serve without the base-path redirect during quick edits, point `mkdocs serve` at a different address: `mkdocs serve -a localhost:8001`.

## Build behavior (read this before "fixing" warnings)

- **The build is intentionally non-strict.** `mkdocs build` exits 0 but prints several hundred `WARNING` lines about broken links and missing anchors. These are inherent to aggregating Markdown from many independent repos (relative links point at files that weren't aggregated). They are expected — do **not** add `--strict` to the deploy, and don't hand-edit `docs/` to chase them.
- **Navigation is generated, not curated.** `mkdocs.yml` carries no `nav:` key; it pulls `nav.yml` in with `INHERIT`, and the context engine's navigator renders that file from the `docs/` folder hierarchy plus the `navigation:` contract in `_data/projects.yml`. Every published page has a sidebar entry. Never hand-edit `nav.yml` and never add a `nav:` key to `mkdocs.yml` — it would shadow the generated tree and the sidebar would silently stop tracking the corpus.
- **`nav.yml` also carries `exclude_docs` and `not_in_nav`.** `exclude_docs` drops what the registry excludes and re-includes the dot-directories MkDocs skips by default; `not_in_nav` then declares those same dot-paths as deliberately unlisted. Every nav entry points at a page the site builds, and MkDocs does not warn about the pages that are built without one.
- **Dot-directories are built but not navigable.** GitHub Pages does not serve a URL containing a dot-prefixed segment — verified against the live site: `_underscore` and plain paths return 200, every `/.dot/` path returns 404. So `navigation.navigate_hidden` is `false` in the registry: the ~1,000 pages under `.github/`, `.claude/`, `.cms/` and friends stay in the build (and the sitemap) but get no sidebar entry, because a sidebar entry for them would be a dead link. Set `navigate_hidden: true` only if those paths ever become servable — e.g. if the corpus renames dot-directories at ingest.
- **Upstream `icon:` frontmatter is normalized at ingest.** Material resolves `page.meta.icon` as a bundled SVG for every nav entry, so a Jekyll value like `icon: globe` used to fail the whole build — which is why the nav was hand-curated before. `scripts/fix_frontmatter_icons.py` now maps those onto Material icons (keeping the original as `source_icon`), so every page is safe to place in the nav.
- Adding a new aggregated repo? Add it to `_data/projects.yml` and rebuild — `python3 -m scripts.context_engine build` regenerates `nav.yml`, `context/nav/` and `docs/browse/`. There is nothing to add here by hand.

## Deployment (GitHub Pages)

Deployment is automated by [`.github/workflows/deploy-pages.yaml`](.github/workflows/deploy-pages.yaml):

- **Triggers:** pushes to `main` touching `docs/**`, `mkdocs.yml`, `requirements-docs.txt`, or the workflow itself; plus manual `workflow_dispatch`.
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
