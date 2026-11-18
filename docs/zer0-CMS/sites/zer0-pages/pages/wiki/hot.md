---
source_file: sites/zer0-pages/pages/wiki/hot.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/hot.md
title: Hot Cache
type: meta
updated: 2026-07-06
---

# Recent Context

## Last Updated
2026-07-06. Ran a full pre-PR cleanup pass: fixed real contract-compliance gaps, and — per the repo owner's explicit instruction this session — established that zer0-pages' declared purpose is to be a **second brain for [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/zer0-mistakes|zer0-mistakes]]**, the upstream theme repo, which previously had no wiki presence at all.

## Key Recent Facts
- **This branch (`claude/beautiful-driscoll-82fb01`) carries the entire architecture** — PRD, vault conversion, claude-obsidian submodule, and the Jekyll/Obsidian bridge pipeline — as commits not yet merged to `main`. This cleanup pass was preparation for that first PR.
- **Contract-compliance fixes**: `pages/index.md` was missing `description`/`permalink`/`aliases`; `pages/posts.md` was missing `permalink`/`aliases` and, worse, its *default* Jekyll URL wouldn't have matched `/posts/`, which `_data/navigation/home.yml` and `main.yml` already hardcode — a real latent bug, now fixed.
- **`_posts/` permalink "gap" is by design, not a defect**: 31 of 38 post files lack explicit permalink/aliases, but `_config.yml` confirms `_posts` is Jekyll's native collection (sitewide `permalink: pretty`, no custom `collections:` entry) — root `CLAUDE.md` now says so explicitly so this doesn't get re-flagged as a bug next audit.
- **New entity**: [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/zer0-mistakes|zer0-mistakes]] — first wiki page for the theme repo itself. Documents the real gem-consumption relationship (layouts/includes/Bootstrap from the gem, `_data/` supplied locally, `obsidian_links.rb` deliberately not reused) and is explicit that the "second brain" relationship is **declared, not yet built out** — no zer0-mistakes-internals content has been ingested here yet, only the existing consumer-facing `_docs/development/` docs.
- **README.md, PRD.md, wiki/overview.md** all now state the second-brain purpose and/or caveat the PRD's aspirational Django+React framing (previously that awareness existed only inside the wiki, not in the documents a first-time visitor would actually read).
- **Verification**: unit tests 93/93 passing. Full local `jekyll build` isn't possible in this sandbox (Ruby 2.6.10 vs. theme's >=3.2 requirement) — matches documented CI-only build capability.
- Wiki orphans fixed: `wiki/sources/_index.md`, `wiki/concepts/_index.md`, `wiki/entities/_index.md` are now actually linked from `wiki/index.md` (were zero-inbound before).
- Content scope unchanged — docs / posts / notes only, 89 / 38 / 6 ([[zer0-CMS/sites/zer0-pages-remote/index|_moc/Home]]).

## Recent Changes
- Edited `pages/index.md`, `pages/posts.md` (frontmatter fixes), root `CLAUDE.md` (`_posts` permalink clarification), `README.md` (second-brain paragraph + PRD caveat), `PRD.md` (status-note callout).
- Created `wiki/entities/zer0-mistakes.md`.
- Updated `wiki/index.md` (orphan-fix + new entity link), `wiki/entities/_index.md`, `wiki/entities/zer0-pages.md` (cross-link), `wiki/overview.md` (second-brain framing), this hot cache, and appended `wiki/log.md`.

## Active Threads
- **Biggest open gap**: zer0-mistakes' own internals (architecture, release-automation, plugin design) are not yet ingested into this wiki — only surface-level consumer docs exist. Next real second-brain step: `/autoresearch` or `/wiki-ingest` against the zer0-mistakes repo's own `docs/` directory.
- `.raw/` still holds `README.md` un-ingested; drop further sources and say "ingest [filename]".
- `scripts/wiki-lock.sh` remains inoperable here (`flock` missing) — solo passes only; no addresses (DragonScale off in this vault).
- This branch has not yet been pushed or opened as a PR — that's the next step once this cleanup is reviewed.
