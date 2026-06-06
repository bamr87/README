# MkDocs Documentation Site

This repo (`bamr87/README`) builds a standalone [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) site from the aggregated documentation under [`docs/`](docs/) and publishes it to GitHub Pages at **<https://bamr87.github.io/README/>**.

> `docs/` is **generated aggregation output** (produced by the pipeline — see [`CLAUDE.md`](CLAUDE.md) and [`scripts/README.md`](scripts/README.md)). Don't hand-edit pages under `docs/` to fix content or build issues; fix the upstream repo or the processing script and re-run the pipeline.

## Files that drive the site

| File | Purpose |
|------|---------|
| [`mkdocs.yml`](mkdocs.yml) | Site config — theme, extensions, `nav`, `docs_dir: docs`, `site_url` |
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

- **The build is intentionally non-strict.** `mkdocs build` exits 0 but prints ~580 `WARNING` lines about broken links and missing anchors. These are inherent to aggregating Markdown from many independent repos (relative links point at files that weren't aggregated). They are expected — do **not** add `--strict` to the deploy, and don't hand-edit `docs/` to chase them.
- **Navigation is curated, not auto-generated.** `mkdocs.yml` lists each repo's index page explicitly under `nav:` rather than auto-building the tree. This is deliberate: some aggregated pages carry upstream Jekyll frontmatter like `icon: <bootstrap-name>` (e.g. `icon: globe`, `icon: robot`). When such a page is a **nav entry**, Material tries to resolve that value as an SVG icon (`.icons/<name>.svg`) and **fails the entire build**. Keeping those pages out of `nav` avoids the failure while MkDocs still builds and **full-text indexes every page** — so all content remains reachable via search and in-page links.
- Adding a new aggregated repo? Add one `nav:` line pointing at its index (`{repo}/README.md` or `{repo}/index.md`, whichever exists). Don't point a nav entry at a bare folder (`{repo}/`) — that does not resolve and warns.

## Deployment (GitHub Pages)

Deployment is automated by [`.github/workflows/deploy-pages.yaml`](.github/workflows/deploy-pages.yaml):

- **Triggers:** pushes to `main` touching `docs/**`, `mkdocs.yml`, `requirements-docs.txt`, or the workflow itself; plus manual `workflow_dispatch`.
- **How:** builds with `mkdocs build`, uploads the `site/` artifact, and publishes via the official `actions/deploy-pages` (no `gh-pages` branch — uses the Pages artifact flow).

**One-time setup:** in the repo's **Settings → Pages**, set **Source = "GitHub Actions"**. Until that's done the workflow build will succeed but the deploy step has nowhere to publish.

## Theme & features (`mkdocs.yml`)

- **Material theme** with light/dark palette toggle.
- **Search** across all aggregated docs (client-side).
- **Navigation:** tabs, sections, `navigation.indexes` (folder `README.md`/`index.md` acts as the section landing page), `navigation.prune`, back-to-top.
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

MkDocs ignores Jekyll/Hugo keys like `layout:`, `permalink:`, `nav_order:`. Note the `icon:` caveat above — a Jekyll `icon:` value that isn't a valid Material icon path will break the build if that page is placed in `nav`.

### Anchors

Headings become anchors automatically: lowercased, spaces → hyphens, special characters dropped (`## API Reference` → `#api-reference`).

## Troubleshooting

**Build fails with `'.icons/<name>.svg' not found`** — an aggregated page with Jekyll `icon:` frontmatter ended up in the nav. Keep it out of `nav` (see *Build behavior* above), or normalize the frontmatter in the processing step.

**Port already in use** — `mkdocs serve -a localhost:8001`.

**Stale build** — `rm -rf site && mkdocs build`.

**Virtualenv issues** — `deactivate; rm -rf .venv; python3 -m venv .venv; source .venv/bin/activate; pip install -r requirements-docs.txt`.

---

*Documentation powered by MkDocs Material.*
