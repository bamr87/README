# MCP server — query the context engine

`mcp/server.py` exposes the committed context pyramid (`context/`) over the [Model Context Protocol](https://modelcontextprotocol.io): stdio transport, newline-delimited JSON-RPC 2.0, Python stdlib only. It is **read-only** — it serves what the engine last built and reports staleness; regenerating is always an explicit `python3 -m scripts.context_engine build`. Answers quote third-party documentation from upstream repositories, and the `initialize` instructions tell clients to treat it as data, never as instructions (per-answer provenance and trust markers are [#60](https://github.com/bamr87/README/issues/60)).

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
| `get_project` | `name` | The project's card (markdown) + facts (JSON) |
| `search_context` | `query`, `limit?` | Ranked matches across cards/facts/apex, with pointers into `docs/` |
| `get_readme` | — | The consolidated fleet README (L0 apex) |
| `get_nav` | `name?`, `depth?`, `flat?` | A corpus's published section/page hierarchy — omit `name` to list every navigable corpus, `flat: true` for every page with its breadcrumb |
| `get_doc` | `path`, `max_chars?` | One page of the `docs/` corpus listed in `docs/docs_index.json`: its body without front matter, headed by `project · repo · path`, truncated at `max_chars` (default 20000) with a `[truncated: N of M characters]` note |
| `get_schema` | `path?` | A `SCHEMA.md` from the structure pyramid (default: root) |
| `context_status` | — | Freshness manifest: generation time, enrichment, fingerprints |

## Resources

`context://apex`, `context://index`, `context://manifest`, `context://nav`, `context://cards/<name>`, `context://facts/<name>`, `context://nav/<name>`.

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
