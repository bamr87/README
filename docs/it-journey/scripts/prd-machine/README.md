---
source_file: README.md
title: PRD MACHINE v2
---
# PRD MACHINE v2

*PR-Driven Product Reality Distillery*

## Overview

PRD Machine maintains a living PRD.md by updating only **marker-delimited dynamic sections** while preserving all human-authored content. It runs on PR merges (not a cron), does a quick check first to avoid unnecessary work, and optionally uses the GitHub Models API for semantic analysis.

**Key changes in v2:**
- **Hybrid content model** — human sections are never overwritten
- **PR-merge trigger** — replaces 6-hour cron schedule
- **Quick check** — determines if updates are needed before running sync
- **AI analysis** — optional GitHub Models API integration
- **PR-based updates** — opens a PR instead of committing directly to main

## Quick Start

```bash
# Navigate to the repository root
cd /path/to/it-journey

# Initialize a new PRD.md with markers (first time only)
./scripts/prd-machine/prd-machine init

# Quick check: does PRD need updating?
./scripts/prd-machine/prd-machine check

# Update dynamic sections
./scripts/prd-machine/prd-machine sync

# Check PRD health
./scripts/prd-machine/prd-machine status

# Show detected conflicts
./scripts/prd-machine/prd-machine conflicts
```

## Installation

Python 3.8+ with no external dependencies. PyYAML is optional (for `features/features.yml` parsing).

## Commands

### `init`

Create a new PRD.md with marker scaffolding and static section templates.

```bash
prd-machine init                     # Create PRD.md in repo root
prd-machine init -o docs/PRD.md      # Custom output path
```

### `sync`

Update only the marker-delimited dynamic sections in an existing PRD.md.

```bash
prd-machine sync                     # Update dynamic sections
prd-machine sync --days 7            # Analyze last 7 days of commits
prd-machine sync -o my-prd.md        # Custom output path
```

**What it updates (marker-delimited):**
- `metadata` — frontmatter timestamps and version
- `status_line` — version badge
- `mvp_status` — content counts (quests, posts, features, commits)
- `edge_issues` — recently detected requirement issues

**What it preserves (human-authored):**
- WHY, UX, API, NFR, OOS, ROAD, RISK, DONE sections

### `check`

Determine if the PRD needs updating based on changed files. Returns JSON and uses exit codes for CI integration.

```bash
prd-machine check                    # Check since last PRD modification
prd-machine check --pr-json ev.json  # Analyze a specific PR event
prd-machine check --ai               # Enable AI analysis via GitHub Models
prd-machine check --ai --model openai/gpt-4o  # Use a specific model
```

**Exit codes:**
- `0` — No update needed
- `1` — Update recommended

**Environment variables:**
- `GITHUB_TOKEN` / `GH_TOKEN` — Required for AI analysis
- `PRD_AI_MODEL` — Override default AI model (default: `openai/gpt-4o-mini`)

### `status`

Check PRD health and freshness.

```bash
prd-machine status
```

### `conflicts`

Detect requirement conflicts from recent commits.

```bash
prd-machine conflicts                # Last 30 days
prd-machine conflicts --days 7       # Last 7 days
```

## Marker System

PRD Machine uses HTML comment markers to delineate auto-updated sections:

```markdown
<!-- AUTO:BEGIN:section_name -->
Auto-generated content goes here...
<!-- AUTO:END:section_name -->
```

Markers are invisible in rendered markdown. Everything outside markers is human-owned and never touched by the machine.

### Section Relevance Map

The `check` command maps file-path patterns to PRD sections:

| File Pattern | Affected Sections |
|-------------|-------------------|
| `pages/_quests/**` | mvp |
| `pages/_posts/**` | mvp |
| `features/**` | mvp, edge |
| `scripts/**` | mvp |
| `.github/workflows/**` | mvp |
| `Gemfile*`, `Dockerfile*` | edge |

## CI/CD Integration

The workflow (`.github/workflows/prd-sync.yml`) triggers on PR merges:

```
PR merged → check (needs update?) → sync → open PR with changes
```

| Job | Purpose |
|-----|---------|
| `check` | Quick check — should we update? |
| `sync` | Update dynamic sections, open PR |
| `check-conflicts` | Detect requirement issues, create GitHub issue |

Manual dispatch is available with options for force sync and AI analysis.

## Architecture

```
820 lines (v1) → ~500 lines (v2)

v1: Full regeneration of all 10 sections every run
v2: Marker-based partial updates of 4 dynamic sections only
```

## PRD Structure

The generated PRD.md follows a standardized structure:

| Section | Description |
|---------|-------------|
| **0. WHY** | Mission and key success metric |
| **1. MVP** | Minimum Viable Promise and current signal status |
| **2. UX** | User experience flow with Mermaid diagrams |
| **3. API** | CLI commands and programmatic interface |
| **4. NFR** | Non-functional requirements with metrics |
| **5. EDGE** | Edge cases, dependencies, and gotchas |
| **6. OOS** | Out of scope items |
| **7. ROAD** | Roadmap with milestones and status |
| **8. RISK** | Top risks with mitigation strategies |
| **9. DONE** | Definition of done and success criteria |

## Roadmap

| Milestone | Objective | Status |
|-----------|-----------|--------|
| v1.0 | Single-repo, CLI-based full regeneration | ✅ Complete |
| v2.0 | Hybrid model, PR-trigger, check command, AI | ✅ Complete |
| v2.1 | Config file (`.prd-machine.yml`) support | 📋 Planned |
| v3.0 | Multi-source signal ingestion (issues, PRs) | 🔮 Vision |

## Philosophy

The PRD Machine embodies several core principles:

1. **Hybrid Ownership**: Machines update data; humans own strategy and narrative
2. **PR-Driven**: Changes flow through PRs for review, not direct commits
3. **Check Before Acting**: Quick check avoids unnecessary CI noise
4. **Zero Dependencies**: stdlib-only Python — no pip install needed
5. **Marker Boundaries**: Clear, invisible delimiters separate human and machine content

## Contributing

Contributions are welcome! The PRD Machine is part of the IT-Journey ecosystem.

### Development

```bash
# Syntax check
python3 -c "import py_compile; py_compile.compile('scripts/prd-machine/prd-machine.py', doraise=True)"

# Run locally
python3 scripts/prd-machine/prd-machine.py check
python3 scripts/prd-machine/prd-machine.py sync
```

### Adding New Dynamic Sections

1. Add a `_gen_<name>()` method to `PRDMachine`
2. Add the section name to the `updates` dict in `sync()`
3. Add `<!-- AUTO:BEGIN:<name> -->` / `<!-- AUTO:END:<name> -->` markers to PRD.md
4. Update `SECTION_RELEVANCE` map if new file patterns affect the section

## License

MIT License - Part of the IT-Journey project.

**Last Modified:** 2025-07-08

---

*Reality fully armed. The distillery now distills distilleries.* 🚀
