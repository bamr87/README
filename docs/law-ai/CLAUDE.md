---
source_file: CLAUDE.md
source_repo: bamr87/law-ai
source_url: https://github.com/bamr87/law-ai/blob/main/CLAUDE.md
title: Law AI
---
# Law AI

The canonical agent instructions for this repo are in [AGENTS.md](AGENTS.md). Claude Code loads them through the import below; add nothing else here.

The spec-driven chain (`/spec-driven:specify` → `:clarify` → `:plan` → `:tasks` → `:implement`, `/spec-driven:evolve`) is the fleet hub's plugin, enabled in `.claude/settings.json`; [docs/spec-driven.md](docs/spec-driven.md) maps it onto this repo.

@AGENTS.md
