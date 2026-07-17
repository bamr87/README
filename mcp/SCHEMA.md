---
schema: "0.1"
coverage: full
---

# SCHEMA — mcp

> The query surface of the context engine: an MCP server that lets AI
> clients (Claude Code and any other MCP client) read and search the
> committed context pyramid.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `README.md` | file | Server usage, tool reference, client registration | required |
| `SCHEMA.md` | file | This file | required |
| `server.py` | file | Stdio JSON-RPC MCP server (stdlib-only, read-only) | required |

## Placement

- New MCP tool or resource → `server.py` (`TOOLS` / `TOOL_HANDLERS` /
  `_resource_catalog`), documented in `README.md`, covered in
  `tests/unit/test_cases/test_context_engine.py`.

## Forbidden

- No write/mutate tools — the server stays read-only; rebuilding the
  pyramid is an explicit `python3 -m scripts.context_engine build`.
