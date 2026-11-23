---
schema: "0.1"
coverage: listed
---

# SCHEMA — overrides

> Hand-written MkDocs Material theme overrides, wired in through `theme.custom_dir` in `mkdocs.yml`. They add the fleet's skip link, SEO and Open Graph meta, a custom 404 page and design tokens to the published site, and mount the fleet's page bridge in development.

## Conventions

- Templates extend the theme's `base.html` and override blocks only; they never copy the theme's markup.
- The skip link targets `#main-content`, an anchor placed at the top of the content block.
- Token names start with `--fleet-color-`, `--fleet-space-` or `--fleet-font-` so the hub conformance check finds them (UPS-FE-01).
- The page bridge (`<fleet-assist>`) is mounted by `main.html` only when `extra.fleet_assist.enabled` is true (`FLEET_ASSIST=1 mkdocs serve`); the published site carries no tag. Its payload is the vendored `docs/assets/js/fleet-assist.js`, never a copy here. A template with no Markdown page behind it sets `fleet_assist_source` to its own repository path.
- This tree is hand-written source, unlike `docs/`, which is generated. Edit it here.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `assets/` | dir | Static files the theme copies into the built site (`assets/fleet-tokens.css`) | terminal |
| `404.html` | file | Custom not-found page, built to `site/404.html`; names itself as the page bridge's source | |
| `main.html` | file | Base override: og:/description meta, skip link, `#main-content` anchor, and the page bridge mount behind `extra.fleet_assist.enabled` | |

## Placement

- New page template or block override → `overrides/<name>.html`, listed above
- New static asset the theme should publish → `overrides/assets/`, and `extra_css` / `extra_javascript` in `mkdocs.yml` if it must load on every page

## Forbidden

- No `nav:` key work here or in `mkdocs.yml`; navigation is generated (`nav.yml`).
- No copies of `docs/` content.
