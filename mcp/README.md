# MCP server — query the context engine

`mcp/server.py` exposes the committed context pyramid (`context/`) over the [Model Context Protocol](https://modelcontextprotocol.io): stdio transport, newline-delimited JSON-RPC 2.0, Python stdlib only. It is **read-only** — it serves what the engine last built and reports staleness; regenerating is always an explicit `python3 -m scripts.context_engine build`. Answers quote third-party documentation from upstream repositories, so every answer that carries upstream text says where it came from and fences that text as untrusted data, and the `initialize` instructions tell clients to treat fenced content as data, never as instructions (see [Provenance](#provenance)).

## Registration

This repo ships a project-scope `.mcp.json`, so Claude Code picks the server up automatically when working in the repo:

```json
{
  "mcpServers": {
    "readme-context-engine": {
      "command": "python3",
      "args": ["mcp/server.py"]
    }
  }
}
```

Any other MCP client can launch it the same way (command `python3`, args `mcp/server.py`, cwd = repo root). No dependencies beyond Python 3.9+.

## Tools

| Tool | Arguments | Returns |
|---|---|---|
| `list_projects` | — | Fleet roster with kind, status, corpus size, context paths |
| `get_project` | `name` | The project's card (markdown) + facts (JSON), fenced as untrusted upstream data, then their provenance (JSON) |
| `search_context` | `query`, `limit?` | Ranked matches across cards/facts/apex, with pointers into `docs/`; each row has a `provenance` object, and an upstream row's `title` and `summary` are fenced |
| `get_readme` | — | The consolidated fleet README (L0 apex), each project's section fenced as untrusted data from that project's repo |
| `get_nav` | `name?`, `depth?`, `flat?` | A corpus's published section/page hierarchy — omit `name` to list every navigable corpus, `flat: true` for every page with its breadcrumb; a corpus's answer has a `provenance` object |
| `get_doc` | `path`, `max_chars?` | One page of the `docs/` corpus listed in `docs/docs_index.json`: its body without front matter, headed by `project · repo · path`, an upstream page's body fenced, truncated at `max_chars` (default 20000) with a `[truncated: N of M characters]` note after the fence |
| `get_schema` | `path?` | A `SCHEMA.md` from the structure pyramid (default: root) |
| `context_status` | — | Freshness manifest: generation time, enrichment, fingerprints, plus `projects`: each project's `enrichment` and `screen` result |
| `get_note` | `target` | One vault note with its text, backlinks and outgoing links; takes a path, title or alias |
| `get_neighbours` | `target`, `depth?` | Notes within `depth` links of a note, in either direction |
| `get_hot` | — | The hot cache: recent changes, most linked pages, cross-repository concepts |
| `vault_lint` | — | Unresolved link targets and orphan notes |

## Resources

`context://apex`, `context://index`, `context://manifest`, `context://nav`, `context://cards/<name>`, `context://facts/<name>`, `context://nav/<name>`.

## Provenance

MCP answers mix this repo's own text (schemas, registry descriptions, the engine's synthesis) with documentation written in upstream repositories, any of which may be external. So that a client can tell them apart, `get_project`, `search_context`, `get_readme`, `get_nav` and `get_doc` each say where their content comes from (README-011, [#60](https://github.com/bamr87/README/issues/60)).

**Provenance object.** Every one of those results lists one object per source under `_meta["io.bamr87.readme/provenance"]` (MCP allows `_meta` on a tool result). JSON answers also carry it in the payload: a `provenance` key on each `search_context` row and on a named `get_nav` tree, and a `PROVENANCE (JSON)` block after `get_project`'s fence. Each object has six keys:

| Key | Value |
|---|---|
| `source` | `upstream` for text derived from a project's repository, `engine` for text this engine wrote |
| `repo` | The upstream `owner/name`; `null` for engine text |
| `commit` | The surveyed head SHA from `context/sources/<name>.json`, else the corpus fingerprint; `null` for engine text |
| `path` | The file the answer was read from (`context/cards/<name>.md`, `docs/<name>/…`, …) |
| `enrichment` | How the project's card was written: `heuristic`, `ai:<provider>` or `quarantined` (the manifest's `project_enrichment`, else its build-wide `enrichment`) |
| `trust` | `untrusted-third-party` for upstream text, `first-party` for engine text |

**Fence.** Upstream text in a text answer sits inside `<untrusted-doc repo="owner/name">` … `</untrusted-doc>`: a card and its facts, an upstream search row's `title` and `summary`, each project's section of the apex, and an upstream page's body from `get_doc`. A fence tag inside the upstream text (`</untrusted-doc>`, in any case or spacing) has its `<` written as `&lt;`, so the text cannot close the fence early and read as the engine's. The `initialize` instructions tell clients that fenced content is third-party data, not instructions. The apex's fleet table and AI overview stay outside the fences: they are the engine's summaries of registry and screened upstream text. The CLI never fences, and `query` prints exactly what it did before; only `query --json` gains each row's `provenance`.

**Screen results.** `context_status` returns the manifest plus `projects`, keyed by project, each with its `enrichment` and a `screen` result. The result is `{"status": "clean" | "quarantined", "q4_hits": [...], "redactions": N}`, where the hits are the build's injection screen (`scripts/context_engine/screen.py`) and `redactions` counts the credentials collect's secret screen redacted (`docs/results/secret_screen.json`). A manifest built before per-project records existed gives `{"status": "not screened"}`.

## Smoke test

```bash
printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_context","arguments":{"query":"jekyll"}}}' \
  | python3 mcp/server.py
```

Then follow a pointer: `get_nav` with `flat: true`, or a result's `key_docs`, gives page paths that `get_doc` reads.

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_doc","arguments":{"path":"bashcrawl/README.md","max_chars":2000}}}' \
  | python3 mcp/server.py
```

## Operator flags

Two flags answer without the MCP handshake and exit before the stdio loop starts, so an operator, a CI step or a container probe can ask which engine build this is and whether its context loads. They are the stdio server's equivalent of the fleet standard's `/version` (UPS-BE-11) and `/healthz` (UPS-BE-10) routes. With no flags the server behaves exactly as before.

```console
$ python3 mcp/server.py --version
readme-context-engine 1.0.0
$ python3 mcp/server.py --healthcheck
{"status": "ok", "version": "1.0.0", "generated_at": "2026-11-16T03:08:41+00:00"}
```

`--healthcheck` reads the freshness manifest (`context/index/manifest.json`) through the same `query.get_manifest()` that `context_status` uses and prints one JSON line. `version` is this engine's version and `generated_at` is the manifest's build time (`null` when there is no readable manifest).

| `status` | Meaning | Exit |
|---|---|---|
| `ok` | The manifest loads and this engine version built it | 0 |
| `stale` | The manifest loads, but another engine version built it: rebuild with `python3 -m scripts.context_engine build` | 0 |
| `missing` | No manifest, or one that is not a readable JSON object | 1 |

## Design notes

- The server reads `context/index/context_index.json` and the card/fact/nav
files via `scripts/context_engine/query.py` — one code path for the CLI and MCP surfaces. `get_doc` also reads `docs/docs_index.json` (cached until the file changes) and the one page it names.
- `get_nav` is the cheap way to locate a document: it answers "what does this
corpus contain, and where does it live" from one JSON tree instead of a directory crawl. Section titles are indexed too, so `search_context` ranks the navigation trees alongside cards and facts.
- Errors inside a tool return an `isError` tool result (per MCP), not a protocol error; unknown methods return JSON-RPC `-32601`. An unexpected failure answers with a generic `tool <name> failed: internal error` and writes the traceback to the server's stderr, so absolute paths never reach the client.
- **Confinement.** Tool arguments never name an arbitrary file. `get_project` accepts only a project listed in the context index and `get_nav` only a corpus listed in the fleet navigation manifest; anything else is `isError: "unknown project"` / `"unknown corpus"` before any file is opened. Underneath, `query.py` refuses any card, fact or nav name that is not a plain file stem resolving inside its `context/` directory, which also covers the CLI. `get_schema` serves a `SCHEMA.md` only when the resolved path is inside the repo (`Path.is_relative_to`, not a string prefix). `get_doc` serves a page only when its path (relative to `docs/`; a leading `docs/` is accepted) is listed in `docs/docs_index.json` and resolves inside `docs/`, so an unindexed page, a `../` path, an absolute path or a symlink out of `docs/` is `isError: "unknown document"` before any page is opened.
- **Bounds.** Out-of-range integers are clamped to the advertised schema, not rejected: `search_context` `limit` to 1–25, `get_nav` `depth` to 1–10 and `get_doc` `max_chars` to 1–100000.
- **Protocol version.** `initialize` returns the client's `protocolVersion` when it is one the server supports (`2024-11-05`, `2025-03-26`, `2025-06-18`, `2025-11-25`), and otherwise the server's own (`2025-06-18`).
- If the pyramid has not been built yet, every tool answers with a hint to run the engine rather than crashing.
