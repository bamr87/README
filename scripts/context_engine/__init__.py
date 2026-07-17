"""
Context engine for the bamr87 monorepo's consolidated README.

Distills the aggregated docs/ corpus (L3) into structured facts (L2),
per-project cards (L1), and a consolidated apex README (L0), then builds a
query index served by the CLI and the MCP server (mcp/server.py).

Pipeline: registry -> extract -> synthesize -> assemble -> index
Lifecycle hooks (hooks.d/<stage>/) and an optional AI enrichment layer
(Anthropic / xAI / mock) plug into each stage.
"""

ENGINE_VERSION = "1.0.0"
