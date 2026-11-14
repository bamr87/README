---
name: second-brain
description: Work with the fleet's Obsidian vault and second brain. USE FOR questions that span repositories ("how does X work across the fleet", "what links to Y", "what changed lately"), for filing an answer worth keeping, for vault health, and for adding repositories or concepts. READS the vault through the context engine. DO NOT USE to edit docs/ by hand; it is generated.
---

# Second brain

`docs/` is an Obsidian vault of every repository's official documentation, and `docs/brain/` is what the engine writes about it. The pattern follows [Codex-obsidian](https://github.com/AgriciDaniel/claude-obsidian) and Karpathy's LLM wiki: raw sources stay untouched, generated notes compound on them, and a hot cache says where to start.

## Query

Start with the hot cache, then follow links rather than searching blind. Over MCP use `get_hot`, `search_context`, `get_note` and `get_neighbours`. On the command line:

```bash
python3 -m scripts.context_engine hot
python3 -m scripts.context_engine query docker compose
python3 -m scripts.context_engine note "Docker"          # text, backlinks, links
python3 -m scripts.context_engine neighbours "Docker" --depth 2
```

Cite the note paths an answer came from. If the vault does not say, say so.

## Save

File an answer only when the user asks to keep it. Notes live in `notes/`, the only hand-written part of the vault:

```bash
python3 -m scripts.context_engine save "Why the crawl freezes pages" "Body text" --source "brain/hot" --tag decisions
python3 -m scripts.context_engine build
```

## Ingest

A new source is a registry change, never a file dropped into `docs/`. Add the repository to `_data/projects.yml`, with `collect:` rules if the default selection is wrong, then run `collect` and `build`.

## Lint

```bash
python3 -m scripts.context_engine lint
```

Lint observes; it fixes nothing. `docs/brain/health.md` has the same findings. Fix a dead link in the repository that owns the page. A target many pages ask for becomes a stub concept on its own: write that page upstream, or a note in `notes/`.

## Never

- Edit `docs/**`, `context/**` or `nav.yml` by hand. Change the registry, the upstream repository, `notes/` or the engine, then rebuild.
- Add a write tool to the MCP server. `save` is a command, not a tool, on purpose.
