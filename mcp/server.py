#!/usr/bin/env python3
"""
MCP server for the README context engine.

Exposes the committed context pyramid (context/) to AI clients over the
Model Context Protocol: stdio transport, newline-delimited JSON-RPC 2.0,
stdlib only. Read-only by design - it serves the committed context and
reports staleness; rebuilding stays an explicit engine invocation.

Run directly (registered for Claude Code in .mcp.json):

    python3 mcp/server.py

Tools:    list_projects, get_project, search_context, get_readme,
          get_schema, context_status
Resources: context://apex, context://index, context://manifest,
           context://cards/<name>, context://facts/<name>
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from scripts.context_engine import ENGINE_VERSION                    # noqa: E402
from scripts.context_engine.query import (                           # noqa: E402
    ContextMissing, get_apex, get_card, get_facts, get_manifest,
    list_projects, load_index, search,
)

SERVER_INFO = {"name": "readme-context-engine", "version": ENGINE_VERSION}
PROTOCOL_VERSION = "2025-06-18"

TOOLS: List[Dict[str, Any]] = [
    {
        "name": "list_projects",
        "description": "List every project in the bamr87 fleet with kind, "
                       "status, corpus size, and context locations.",
        "inputSchema": {"type": "object", "properties": {},
                        "additionalProperties": False},
    },
    {
        "name": "get_project",
        "description": "Get the distilled context card (markdown) and "
                       "structured facts (JSON) for one project.",
        "inputSchema": {
            "type": "object",
            "properties": {"name": {"type": "string",
                                    "description": "Project name from list_projects"}},
            "required": ["name"],
            "additionalProperties": False,
        },
    },
    {
        "name": "search_context",
        "description": "Search the context pyramid (cards, facts, apex) for "
                       "terms; results point into the docs/ corpus.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Search terms"},
                "limit": {"type": "integer", "minimum": 1, "maximum": 25},
            },
            "required": ["query"],
            "additionalProperties": False,
        },
    },
    {
        "name": "get_readme",
        "description": "Get the consolidated README (apex of the context "
                       "pyramid) describing the whole fleet.",
        "inputSchema": {"type": "object", "properties": {},
                        "additionalProperties": False},
    },
    {
        "name": "get_schema",
        "description": "Read a SCHEMA.md from the repo's structure pyramid "
                       "(default: the root schema).",
        "inputSchema": {
            "type": "object",
            "properties": {"path": {
                "type": "string",
                "description": "Directory relative to the repo root, e.g. "
                               "'scripts' or 'context' (default: root)"}},
            "additionalProperties": False,
        },
    },
    {
        "name": "context_status",
        "description": "Freshness manifest: when the pyramid was generated, "
                       "by which engine/enrichment, and per-project corpus "
                       "fingerprints.",
        "inputSchema": {"type": "object", "properties": {},
                        "additionalProperties": False},
    },
]


def _text_result(text: str, is_error: bool = False) -> Dict:
    return {"content": [{"type": "text", "text": text}], "isError": is_error}


def _tool_list_projects(_args: Dict) -> Dict:
    return _text_result(json.dumps(list_projects(), indent=2))


def _tool_get_project(args: Dict) -> Dict:
    name = args.get("name", "")
    card = get_card(name)
    facts = get_facts(name)
    return _text_result(card + "\n\n---\nFACTS (JSON)\n---\n"
                        + json.dumps(facts, indent=2, sort_keys=True))


def _tool_search_context(args: Dict) -> Dict:
    terms = str(args.get("query", "")).split()
    if not terms:
        return _text_result("empty query", is_error=True)
    limit = int(args.get("limit", 10))
    results = search(terms, limit=limit)
    if not results:
        return _text_result("no matches in the context layer")
    return _text_result(json.dumps(results, indent=2))


def _tool_get_readme(_args: Dict) -> Dict:
    return _text_result(get_apex())


def _tool_get_schema(args: Dict) -> Dict:
    rel = str(args.get("path", "")).strip().strip("/")
    target = (ROOT / rel / "SCHEMA.md").resolve()
    if not str(target).startswith(str(ROOT)) or not target.is_file():
        return _text_result(f"no SCHEMA.md at '{rel or '.'}'", is_error=True)
    return _text_result(target.read_text(encoding="utf-8"))


def _tool_context_status(_args: Dict) -> Dict:
    return _text_result(json.dumps(get_manifest(), indent=2))


TOOL_HANDLERS = {
    "list_projects": _tool_list_projects,
    "get_project": _tool_get_project,
    "search_context": _tool_search_context,
    "get_readme": _tool_get_readme,
    "get_schema": _tool_get_schema,
    "context_status": _tool_context_status,
}


def _resource_catalog() -> List[Dict]:
    resources = [
        {"uri": "context://apex", "name": "Consolidated README",
         "description": "L0 apex of the context pyramid", "mimeType": "text/markdown"},
        {"uri": "context://index", "name": "Context index",
         "description": "Query index over the pyramid", "mimeType": "application/json"},
        {"uri": "context://manifest", "name": "Freshness manifest",
         "description": "Generation metadata and fingerprints", "mimeType": "application/json"},
    ]
    try:
        for project in list_projects():
            name = project["name"]
            resources.append({
                "uri": f"context://cards/{name}", "name": f"{name} card",
                "description": f"Distilled context card for {name}",
                "mimeType": "text/markdown"})
            resources.append({
                "uri": f"context://facts/{name}", "name": f"{name} facts",
                "description": f"Structured facts for {name}",
                "mimeType": "application/json"})
    except ContextMissing:
        pass
    return resources


def _read_resource(uri: str) -> Dict:
    if uri == "context://apex":
        return {"uri": uri, "mimeType": "text/markdown", "text": get_apex()}
    if uri == "context://index":
        return {"uri": uri, "mimeType": "application/json",
                "text": json.dumps(load_index(), indent=2)}
    if uri == "context://manifest":
        return {"uri": uri, "mimeType": "application/json",
                "text": json.dumps(get_manifest(), indent=2)}
    if uri.startswith("context://cards/"):
        return {"uri": uri, "mimeType": "text/markdown",
                "text": get_card(uri.rsplit("/", 1)[1])}
    if uri.startswith("context://facts/"):
        return {"uri": uri, "mimeType": "application/json",
                "text": json.dumps(get_facts(uri.rsplit("/", 1)[1]), indent=2)}
    raise ValueError(f"unknown resource: {uri}")


def handle_request(request: Dict) -> Optional[Dict]:
    """Dispatch one JSON-RPC request; None for notifications (no response)."""
    method = request.get("method", "")
    params = request.get("params") or {}
    request_id = request.get("id")

    def result(payload: Dict) -> Dict:
        return {"jsonrpc": "2.0", "id": request_id, "result": payload}

    def error(code: int, message: str) -> Dict:
        return {"jsonrpc": "2.0", "id": request_id,
                "error": {"code": code, "message": message}}

    if method.startswith("notifications/"):
        return None

    if method == "initialize":
        client_version = params.get("protocolVersion") or PROTOCOL_VERSION
        return result({
            "protocolVersion": client_version,
            "capabilities": {"tools": {}, "resources": {}},
            "serverInfo": SERVER_INFO,
            "instructions": (
                "Read-only context engine for the bamr87 fleet. Start with "
                "list_projects or search_context; get_readme returns the "
                "consolidated fleet README. If context_status reports stale "
                "data, rebuild with `python3 -m scripts.context_engine build`."),
        })
    if method == "ping":
        return result({})
    if method == "tools/list":
        return result({"tools": TOOLS})
    if method == "tools/call":
        name = params.get("name")
        handler = TOOL_HANDLERS.get(name)
        if handler is None:
            return error(-32602, f"unknown tool: {name}")
        try:
            return result(handler(params.get("arguments") or {}))
        except ContextMissing as exc:
            return result(_text_result(str(exc), is_error=True))
        except Exception as exc:  # tool errors -> isError result, not protocol error
            return result(_text_result(f"tool failed: {exc}", is_error=True))
    if method == "resources/list":
        return result({"resources": _resource_catalog()})
    if method == "resources/read":
        try:
            return result({"contents": [_read_resource(str(params.get("uri", "")))]})
        except (ValueError, ContextMissing) as exc:
            return error(-32602, str(exc))
    return error(-32601, f"method not found: {method}")


def main() -> int:
    """Newline-delimited JSON-RPC loop over stdio."""
    print(f"readme-context-engine MCP server v{ENGINE_VERSION} ready",
          file=sys.stderr, flush=True)
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            request = json.loads(line)
        except json.JSONDecodeError:
            response = {"jsonrpc": "2.0", "id": None,
                        "error": {"code": -32700, "message": "parse error"}}
            print(json.dumps(response), flush=True)
            continue
        if not isinstance(request, dict):
            response = {"jsonrpc": "2.0", "id": None,
                        "error": {"code": -32600, "message": "invalid request"}}
            print(json.dumps(response), flush=True)
            continue
        response = handle_request(request)
        if response is not None:
            print(json.dumps(response), flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
