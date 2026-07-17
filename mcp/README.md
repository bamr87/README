# MCP server — query the context engine

`mcp/server.py` exposes the committed context pyramid (`context/`) over the
[Model Context Protocol](https://modelcontextprotocol.io): stdio transport,
newline-delimited JSON-RPC 2.0, Python stdlib only. It is **read-only** — it
serves what the engine last built and reports staleness; regenerating is
always an explicit `python3 -m scripts.context_engine build`.

## Registration

This repo ships a project-scope `.mcp.json`, so Claude Code picks the server
up automatically when working in the repo:

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

Any other MCP client can launch it the same way (command `python3`,
args `mcp/server.py`, cwd = repo root). No dependencies beyond Python 3.9+.

## Tools

| Tool | Arguments | Returns |
|---|---|---|
| `list_projects` | — | Fleet roster with kind, status, corpus size, context paths |
| `get_project` | `name` | The project's card (markdown) + facts (JSON) |
| `search_context` | `query`, `limit?` | Ranked matches across cards/facts/apex, with pointers into `docs/` |
| `get_readme` | — | The consolidated fleet README (L0 apex) |
| `get_schema` | `path?` | A `SCHEMA.md` from the structure pyramid (default: root) |
| `context_status` | — | Freshness manifest: generation time, enrichment, fingerprints |

## Resources

`context://apex`, `context://index`, `context://manifest`,
`context://cards/<name>`, `context://facts/<name>`.

## Smoke test

```bash
printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_context","arguments":{"query":"jekyll"}}}' \
  | python3 mcp/server.py
```

## Design notes

- The server reads `context/index/context_index.json` and the card/fact
  files via `scripts/context_engine/query.py` — one code path for the CLI
  and MCP surfaces.
- Errors inside a tool return an `isError` tool result (per MCP), not a
  protocol error; unknown methods return JSON-RPC `-32601`.
- If the pyramid has not been built yet, every tool answers with a hint to
  run the engine rather than crashing.
