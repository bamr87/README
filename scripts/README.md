---
title: Documentation Processing Scripts
description: Comprehensive collection of Python and Bash scripts for documentation aggregation, processing, validation, AI-powered harmonization, and quality assurance
author: Amr Abdel-Motaleb
created: 2025-12-04
lastModified: 2025-12-04
version: 1.1.0
tags:
  - documentation
  - automation
  - python
  - bash
  - quality-assurance
  - ai
  - grok
category: scripts
---

# Documentation Processing Scripts

This directory contains a comprehensive suite of automation scripts for documentation aggregation, processing, validation, AI-powered harmonization, and quality assurance. These scripts work together to maintain consistent, high-quality documentation across multiple repositories.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Script Inventory](#script-inventory)
  - [Aggregation Scripts](#aggregation-scripts)
  - [Processing Scripts](#processing-scripts)
  - [Quality Assurance Scripts](#quality-assurance-scripts)
  - [AI Harmonization System](#ai-harmonization-system)
  - [Orchestration Scripts](#orchestration-scripts)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Workflow Integration](#workflow-integration)

---

## Overview

The documentation processing pipeline automates the following tasks:

1. **Aggregation**: Clone/update repositories and extract documentation files
2. **Processing**: Categorize, add frontmatter, and organize documentation
3. **Validation**: Check for missing metadata, formatting issues, and consistency
4. **Cleanup**: Normalize tags, fix whitespace, and standardize structure
5. **AI Harmonization**: Intelligent analysis, reorganization, and improvement using Grok API

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Repository    │────▶│   Aggregation   │────▶│   Processing    │
│   Sources       │     │   (aggregate.sh)│     │   (process.py)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┘
                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Quality       │◀────│   Validation    │◀────│   Organized     │
│   Reports       │     │   Scripts       │     │   docs/         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                        │
                        ┌───────────────────────────────┘
                        ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Harmonized    │◀────│   AI Analysis   │◀────│   Grok API      │
│   Documentation │     │   & Actions     │     │   Agent         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

---

## Architecture

### Directory Structure

```
scripts/
├── aggregate.py            # Repository operations module
├── aggregate.sh            # Main aggregation orchestrator
├── process.py              # Documentation processing pipeline
├── check_frontmatter.py    # YAML frontmatter validator
├── clean_frontmatter.py    # Frontmatter normalizer
├── fix_h1.py               # H1 heading fixer
├── fix_whitespace.py       # Trailing whitespace remover
├── generate_docs_index.py  # Comprehensive JSON index generator
├── generate_docs_report.py # Quality report generator
├── lint_docs.py            # Documentation linter
├── normalize_tags.py       # Tag normalization utility
├── run_doc_checks.sh       # Quality check orchestrator
├── harmonize_docs.py       # AI harmonization CLI
├── harmonize/              # AI harmonization package
│   ├── __init__.py         # Package exports
│   ├── schemas.py          # JSON schemas and tool definitions
│   ├── analyzer.py         # Document analysis module
│   ├── grok_agent.py       # Grok API integration
│   └── engine.py           # Harmonization orchestration engine
└── README.md               # This documentation
```

### Data Flow

| Stage | Input | Output | Scripts |
|-------|-------|--------|---------|
| 1. Aggregation | `repos.txt` | `raw_docs/` | `aggregate.sh`, `aggregate.py` |
| 2. Processing | `raw_docs/` | `docs/` | `process.py` |
| 3. Validation | `docs/` | Reports/Fixes | All validation scripts |
| 4. Indexing | `docs/` | `docs/docs_index.json` | `generate_docs_index.py` |
| 5. Harmonization | `docs/` | Reorganized docs | `harmonize_docs.py` |

---

## Script Inventory

### MkDocs-Optimized Scripts

These scripts are specifically designed for MkDocs compatibility and should be used when working with MkDocs documentation sites.

#### fix_mkdocs_links.py
**Purpose**: Convert and fix links in markdown files for MkDocs compatibility

**Key Features:**
- Converts absolute site links (`/docs/page.md`) to relative paths
- Handles Jekyll/Hugo liquid tags (`{{ '/path' | relative_url }}`)
- Validates internal links and anchors
- Reports broken links and compatibility issues

**Usage:**
```bash
# Dry run to analyze issues
./fix_mkdocs_links.py ../docs --dry-run --verbose

# Fix links with site URL context
./fix_mkdocs_links.py ../docs --site-url https://example.com

# Apply fixes
./fix_mkdocs_links.py ../docs
```

**Output**: Fixed markdown files, detailed compatibility report

#### aggregate_mkdocs.py
**Purpose**: Aggregate documentation from multiple repositories with MkDocs-optimized structure

**Key Features:**
- Organizes docs into MkDocs-friendly categories (setup, api, architecture, etc.)
- Normalizes YAML frontmatter for MkDocs
- Preserves source repository structure
- Generates category index files
- Creates metadata for navigation

**Usage:**
```bash
# Aggregate with structure preservation
./aggregate_mkdocs.py ../temp ../docs

# Flatten structure
./aggregate_mkdocs.py ../temp ../docs --flatten

# Skip automatic index creation
./aggregate_mkdocs.py ../temp ../docs --no-create-indexes
```

**Output**: Categorized documentation, index files, repos_metadata.yaml

#### mkdocs_quality_report.py
**Purpose**: Analyze documentation quality and MkDocs compatibility

**Key Features:**
- Validates link health (broken, external, internal)
- Checks frontmatter consistency
- Identifies MkDocs compatibility issues
- Generates comprehensive quality metrics
- Exports detailed JSON reports

**Usage:**
```bash
# Quick summary report
./mkdocs_quality_report.py ../docs

# Detailed file-level analysis
./mkdocs_quality_report.py ../docs --show-details --verbose

# Export as JSON for CI/CD integration
./mkdocs_quality_report.py ../docs --export-json quality_report.json
```

**Output**: Quality metrics, issue list, optional JSON export

---

### Aggregation Scripts

#### `aggregate.sh`

**Purpose**: Main orchestration script for cloning/updating repositories and extracting documentation files.

**Features**:
- Reads repository URLs from `repos.txt`
- Clones new repositories or pulls updates for existing ones
- Extracts markdown files while skipping `.git` directories
- Sets up Python virtual environment with required dependencies
- Invokes `process.py` for documentation processing

**Usage**:
```bash
./scripts/aggregate.sh
```

**Input**: `repos.txt` (one repository URL per line, supports comments with `#`)

**Output Directories**:
- `temp/` - Temporary clone directory (cleaned up after processing)
- `raw_docs/` - Extracted documentation files
- `docs/` - Processed and organized documentation

**Example `repos.txt`**:
```text
# Main documentation repositories
https://github.com/owner/repo1
https://github.com/owner/repo2.git

# Skipped (commented out)
# https://github.com/owner/archived-repo
```

---

#### `aggregate.py`

**Purpose**: Python module providing core repository operations for the aggregation pipeline.

**Functions**:

| Function | Description |
|----------|-------------|
| `extract_repo_name(repo_url)` | Extract repository name from URL (handles `.git` suffix) |
| `is_valid_repo_url(repo_url)` | Validate GitHub/GitLab repository URLs |
| `git_clone_repo(repo_url, dest_dir)` | Clone a repository with timeout handling |
| `git_pull_repo(repo_dir)` | Pull latest changes from existing repository |
| `find_documentation_files(repo_dir)` | Find `.md`, `README`, `.rst`, `.txt` files |
| `copy_documentation_files(source_dir, dest_dir)` | Copy documentation preserving structure |
| `process_repository(repo_url, temp_dir, raw_docs_dir)` | Process a single repository end-to-end |

**Supported URL Patterns**:
- `https://github.com/owner/repo`
- `https://github.com/owner/repo.git`
- `git@github.com:owner/repo.git`
- `https://gitlab.com/owner/repo`

---

### Processing Scripts

#### `process.py`

**Purpose**: Core documentation processing pipeline that categorizes, enriches, and organizes documentation files.

**Features**:
- **Content Categorization**: Automatically categorizes docs into `api`, `setup`, `user-guides`, `development`, `architecture`, or `misc`
- **YAML Frontmatter Generation**: Creates comprehensive metadata for each file
- **AI-Enhanced Analysis** (optional): Uses AI API for enhanced content analysis
- **Tag Generation**: Extracts technology and category tags from content
- **Summary Extraction**: Generates summaries from first substantial paragraph

**Categories**:

| Category | Keywords Detected |
|----------|-------------------|
| `setup` | install, installation, setup, configuration, deployment |
| `api` | api, endpoint, rest, graphql, swagger, openapi, reference |
| `user-guides` | guide, tutorial, how-to, walkthrough, getting started |
| `development` | development, contributing, build, testing, ci/cd, pipeline |
| `architecture` | architecture, design, overview, concepts, principles |
| `misc` | Default for uncategorized content |

**Generated Frontmatter**:
```yaml
---
title: Extracted or generated title
summary: First paragraph summary (max 200 chars)
tags:
  - detected-technology
  - category-tag
category: determined-category
source_file: original-filename.md
last_updated: null
---
```

**Usage**:
```bash
python3 scripts/process.py
```

**Environment Variables**:
- `XAI_API_KEY`: Optional API key for AI-enhanced content analysis

---

### Quality Assurance Scripts

#### `lint_docs.py`

**Purpose**: Lint documentation files for common issues including formatting, structure, and consistency.

**Checks Performed**:
- Lines exceeding 120 characters
- Trailing whitespace
- Missing H1 (`#`) heading
- Unbalanced code fences (odd number of ``` blocks)

**Usage**:
```bash
python3 scripts/lint_docs.py
```

**Output**:
```
docs/api/example.md
  45: Line too long
  67: Trailing whitespace
docs/setup/installation.md
  -: Missing H1 heading
Checked 42 files; found 15 issues.
```

**Exit Codes**:
- `0`: No issues found
- `1`: Issues detected

---

#### `check_frontmatter.py`

**Purpose**: Validate and optionally fix YAML frontmatter in documentation files.

**Validation Rules**:
- Required fields: `title`, `tags`, `category`
- Tags must be lowercase
- Valid YAML syntax

**Usage**:
```bash
# Check only (report issues)
python3 scripts/check_frontmatter.py

# Check and auto-fix issues
python3 scripts/check_frontmatter.py --fix

# Quiet mode (minimal output)
python3 scripts/check_frontmatter.py --quiet
```

**Auto-Fix Behavior**:
- Missing `title`: Uses filename as title
- Missing `tags`: Adds `['uncategorized']`
- Missing `category`: Sets to `misc`
- Non-lowercase tags: Normalizes to lowercase
- Missing `last_updated`: Adds with `null` value

---

#### `clean_frontmatter.py`

**Purpose**: Normalize frontmatter to a compact, canonical format with consistent field ordering.

**Normalized Fields** (in order):
1. `title`
2. `category`
3. `tags`
4. `last_updated`
5. `source_file`

**Usage**:
```bash
python3 scripts/clean_frontmatter.py
```

**Note**: This script removes any fields not in the normalized list. Use with caution if you have custom frontmatter fields.

---

#### `fix_h1.py`

**Purpose**: Ensure every markdown file has a top-level H1 heading.

**Behavior**:
- Checks if file has an H1 (`# Title`) heading
- If missing, extracts title from frontmatter
- Falls back to filename if no frontmatter title
- Creates frontmatter if none exists

**Usage**:
```bash
python3 scripts/fix_h1.py
```

**Output**:
```
Added H1 to 12/45 files
```

---

#### `fix_whitespace.py`

**Purpose**: Remove trailing whitespace from all lines in markdown files.

**Usage**:
```bash
python3 scripts/fix_whitespace.py
```

**Output**:
```
Whitespace fixer: processed 45 files, fixed 8 files
```

---

#### `normalize_tags.py`

**Purpose**: Normalize tags in YAML frontmatter to lowercase and remove duplicates.

**Transformations**:
- Convert all tags to lowercase
- Remove leading/trailing whitespace
- Deduplicate tags while preserving order

**Usage**:
```bash
python3 scripts/normalize_tags.py
```

**Output**:
```
Normalized tags in 5/45 files
```

---

#### `generate_docs_report.py`

**Purpose**: Generate a comprehensive JSON quality report for CI/CD integration.

**Report Contents**:
- Lint results (files checked, issues found, exit code)
- Frontmatter validation results
- Whitespace issue count
- Top 20 files with most issues

**Usage**:
```bash
python3 scripts/generate_docs_report.py
```

**Output Location**: `docs/results/docs_quality_report.json`

**Sample Report**:
```json
{
  "lint": {
    "files_checked": 42,
    "issues_found": 15,
    "exit_code": 1
  },
  "frontmatter": {
    "files_checked": 42,
    "files_updated": 3,
    "exit_code": 0
  },
  "whitespace_issues": 8,
  "top_issues": [
    ["docs/api/long-file.md", 12],
    ["docs/setup/config.md", 5]
  ]
}
```

---

#### `generate_docs_index.py`

**Purpose**: Generate a comprehensive JSON index of all documentation files for easy searching and indexing.

**Features**:
- **Full Metadata Extraction**: Parses all YAML frontmatter fields
- **Content Analysis**: Extracts headings, links, code blocks, word counts
- **Multi-Index Generation**: Creates indices by category, tag, repository, and code language
- **Statistics Calculation**: Aggregate stats for all documentation
- **Change Detection**: MD5 content hashes for detecting modifications
- **Reading Time Estimation**: Automatic reading time calculation

**Usage**:
```bash
# Basic usage
python3 scripts/generate_docs_index.py

# Pretty-printed output with progress
python3 scripts/generate_docs_index.py --pretty --verbose

# Custom output location
python3 scripts/generate_docs_index.py --output custom/path/index.json
```

**Command Line Options**:
| Option | Description |
|--------|-------------|
| `--docs-dir PATH` | Path to docs directory (default: `docs`) |
| `--output, -o PATH` | Output JSON file path (default: `docs/docs_index.json`) |
| `--pretty, -p` | Pretty-print JSON with indentation |
| `--verbose, -v` | Print progress information |

**Output Location**: `docs/docs_index.json`

**Index Structure**:
```json
{
  "metadata": {
    "generated_at": "2025-12-04T10:30:00",
    "generator": "generate_docs_index.py",
    "version": "1.0.0",
    "docs_root": "/absolute/path/to/docs"
  },
  "statistics": {
    "total_documents": 2749,
    "valid_documents": 2745,
    "documents_with_errors": 4,
    "documents_with_frontmatter": 2700,
    "total_words": 1250000,
    "total_reading_time_minutes": 6250,
    "unique_tags": 150,
    "categories": {
      "api": 450,
      "setup": 380,
      "user-guides": 520,
      "development": 610,
      "architecture": 290,
      "misc": 499
    }
  },
  "indices": {
    "by_category": {
      "api": ["doc_id_1", "doc_id_2"],
      "setup": ["doc_id_3"]
    },
    "by_tag": {
      "python": ["doc_id_1", "doc_id_4"],
      "docker": ["doc_id_2", "doc_id_5"]
    },
    "by_repository": {
      "repo-name": ["doc_id_1", "doc_id_2"]
    },
    "code_languages": {
      "python": 450,
      "javascript": 320,
      "bash": 180
    }
  },
  "documents": [
    {
      "id": "api_repo_file_md",
      "path": "api/repo/file.md",
      "filename": "file.md",
      "category": "api",
      "repository": "repo",
      "title": "Document Title",
      "description": "Document description",
      "tags": ["tag1", "tag2"],
      "frontmatter": { /* all frontmatter fields */ },
      "headings": [
        {"level": 1, "text": "Main Title", "anchor": "main-title"}
      ],
      "links": {
        "internal": ["./other-doc.md"],
        "external": ["https://example.com"]
      },
      "code_blocks": [
        {"language": "python", "lines": 15}
      ],
      "word_count": 1250,
      "reading_time_minutes": 6,
      "content_hash": "abc123...",
      "file_stats": {
        "size_bytes": 4096,
        "created": "2025-01-01T00:00:00",
        "modified": "2025-12-04T10:00:00"
      },
      "has_frontmatter": true,
      "has_yaml_error": false
    }
  ]
}
```

**Use Cases**:
- **Search Implementation**: Use indices for fast tag/category lookups
- **Static Site Generation**: Feed metadata to site generators
- **Documentation Auditing**: Identify missing frontmatter or broken links
- **Change Detection**: Compare content hashes between runs
- **Analytics**: Track documentation growth and coverage

---

### AI Harmonization System

The AI Harmonization System provides intelligent, automated documentation analysis and reorganization using the Grok API. It systematically processes documentation to identify redundancies, suggest reorganizations, and generate improved metadata.

#### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    harmonize_docs.py (CLI)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│  │   Scopes    │    │   State     │    │   Reports   │        │
│  │  (api,      │    │  Management │    │  & Export   │        │
│  │   setup,    │    │  (checkpts) │    │             │        │
│  │   all...)   │    │             │    │             │        │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘        │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                   │
│  ┌─────────────────────────┴─────────────────────────┐        │
│  │              HarmonizationEngine                   │        │
│  │  - Document discovery & batching                  │        │
│  │  - AI analysis coordination                       │        │
│  │  - Action application                             │        │
│  └─────────────────────────┬─────────────────────────┘        │
│                            │                                   │
│  ┌────────────┬────────────┴────────────┬────────────┐        │
│  │            │                         │            │        │
│  ▼            ▼                         ▼            ▼        │
│ ┌──────┐  ┌──────────┐            ┌──────────┐  ┌────────┐   │
│ │Schema│  │ Analyzer │            │GrokAgent │  │ State  │   │
│ │Tools │  │          │            │          │  │ Files  │   │
│ └──────┘  └──────────┘            └──────────┘  └────────┘   │
│                                         │                     │
│                                         ▼                     │
│                                  ┌────────────┐              │
│                                  │  Grok API  │              │
│                                  │  (x.ai)    │              │
│                                  └────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

#### `harmonize_docs.py` (CLI)

**Purpose**: Command-line interface for AI-powered documentation harmonization.

**Key Features**:
- **Scoped Analysis**: Target specific documentation categories (api, setup, development, etc.)
- **Incremental Processing**: Resume interrupted sessions with checkpointing
- **Batch Processing**: Handle large document sets with rate limiting
- **Dry Run Mode**: Preview changes before applying
- **Detailed Reporting**: Generate markdown and JSON reports

**Usage Examples**:

```bash
# List available scopes
python scripts/harmonize_docs.py --list-scopes

# Analyze API documentation with mock AI (for testing)
python scripts/harmonize_docs.py --scope api --mock --batch-size 10

# Analyze with real Grok API
export XAI_API_KEY="your-api-key"
python scripts/harmonize_docs.py --scope api --batch-size 10

# Resume a previous session
python scripts/harmonize_docs.py --resume abc12345

# List existing sessions
python scripts/harmonize_docs.py --list-sessions

# Generate a report
python scripts/harmonize_docs.py --report abc12345 --output report.md

# Export results to JSON
python scripts/harmonize_docs.py --export abc12345 --output results.json

# Apply changes (dry run)
python scripts/harmonize_docs.py --apply abc12345 --dry-run

# Apply changes for real (after review)
python scripts/harmonize_docs.py --apply abc12345 --no-dry-run --force
```

**Command Line Options**:

| Option | Description |
|--------|-------------|
| `--scope SCOPE` | Scope to analyze: `api`, `setup`, `development`, `architecture`, `user-guides`, `all` |
| `--resume SESSION_ID` | Resume a previous session |
| `--batch-size N` | Documents per batch (default: 10) |
| `--max-batches N` | Maximum batches to process |
| `--delay SECONDS` | Delay between API calls (default: 1.0) |
| `--mock` | Use mock AI client for testing |
| `--dry-run` | Don't modify files (default) |
| `--no-dry-run` | Actually modify files |
| `--force` | Apply without approval |
| `--list-scopes` | List available scopes |
| `--list-sessions` | List existing sessions |
| `--report SESSION_ID` | Generate report |
| `--export SESSION_ID` | Export to JSON |
| `--apply SESSION_ID` | Apply recommendations |
| `--verbose, -v` | Verbose output |

---

#### `harmonize/schemas.py`

**Purpose**: Defines JSON schemas, data classes, and tool definitions for AI agent interactions.

**Key Components**:

**Predefined Scopes**:
| Scope | Description | Target Category |
|-------|-------------|-----------------|
| `api` | API docs, endpoints, schemas | api |
| `setup` | Installation, config, deployment | setup |
| `development` | Dev guides, contributing | development |
| `architecture` | System design, patterns | architecture |
| `user-guides` | End-user tutorials | user-guides |
| `all` | All documentation files | - |

**AI Agent Tools** (for Grok function calling):
- `analyze_document`: Assess content, quality, and categorization
- `recommend_action`: Suggest reorganization actions
- `generate_frontmatter`: Create/update metadata
- `find_related_documents`: Identify document relationships
- `suggest_content_improvements`: Recommend content fixes

**Action Types**:
- `move`: Relocate to better category
- `merge`: Combine with similar documents
- `delete`: Remove redundant content
- `update_frontmatter`: Improve metadata
- `rewrite`: Content needs improvement
- `split`: Break into focused documents
- `keep`: Document is well-organized
- `create_index`: Create section index

---

#### `harmonize/analyzer.py`

**Purpose**: Document content extraction and analysis module.

**Features**:
- Parse YAML frontmatter
- Extract headings, links, code blocks
- Calculate word counts and reading time
- Find related documents by content similarity
- Detect potential duplicates
- Generate context summaries for AI

**Key Functions**:
```python
# Analyze a single document
analyzer = DocumentAnalyzer("docs")
doc = analyzer.analyze_document(Path("docs/api/guide.md"))

# Find documents matching a scope
files = analyzer.find_documents_by_scope(
    include_patterns=["docs/api/**/*.md"],
    exclude_patterns=["**/node_modules/**"]
)

# Find related documents
related = analyzer.find_related_by_content(doc, all_docs, threshold=0.3)

# Detect duplicates
duplicates = analyzer.find_potential_duplicates(doc, all_docs)
```

---

#### `harmonize/grok_agent.py`

**Purpose**: Grok API integration with tool-use capabilities.

**Features**:
- Automatic retry with exponential backoff
- Rate limit handling
- Tool call parsing
- Mock client for testing

**Configuration**:
```python
from harmonize import GrokConfig, GrokClient

config = GrokConfig(
    api_key="your-api-key",
    api_url="https://api.x.ai/v1/chat/completions",
    model="grok-beta",
    max_tokens=4096,
    temperature=0.3,
    timeout=60
)

client = GrokClient(config)
```

**Environment Variables**:
- `XAI_API_KEY`: Grok API key
- `GROK_API_KEY`: Alternative API key variable

---

#### `harmonize/engine.py`

**Purpose**: Main orchestration engine for harmonization workflow.

**Features**:
- Session management with checkpointing
- Batch processing with progress tracking
- State persistence for resume capability
- Action application with dry-run support
- Markdown and JSON report generation

**Workflow**:
```
1. Start Session
   └─▶ Discover documents in scope
   └─▶ Create processing state
   └─▶ Save initial checkpoint

2. Process Batches
   └─▶ For each document:
       ├─▶ Analyze content
       ├─▶ Find related documents
       ├─▶ Generate AI context
       ├─▶ Get AI recommendations
       ├─▶ Save result
       └─▶ Checkpoint every 5 docs

3. Review Results
   └─▶ Generate report
   └─▶ Export to JSON
   └─▶ Approve recommendations

4. Apply Changes
   └─▶ Filter by action/priority
   └─▶ Apply approved changes
   └─▶ Archive deleted documents
```

**State Directory**: `docs/.harmonize/`

**State File Structure**:
```json
{
  "session_id": "abc12345",
  "started_at": "2025-12-04T10:00:00",
  "scope": "api",
  "total_documents": 100,
  "processed_count": 45,
  "pending_documents": ["path/to/doc1.md", ...],
  "completed_documents": ["path/to/doc2.md", ...],
  "failed_documents": ["path/to/doc3.md", ...],
  "results": {
    "path/to/doc.md": {
      "status": "recommended",
      "analysis": {...},
      "action": {...},
      "frontmatter": {...}
    }
  }
}
```

---

### Orchestration Scripts

#### `run_doc_checks.sh`

**Purpose**: Orchestrate all documentation quality checks with optional auto-fix capability.

**Usage**:
```bash
# Run checks only (read-only)
./scripts/run_doc_checks.sh

# Run checks and apply safe fixes
./scripts/run_doc_checks.sh --apply

# Quiet mode
./scripts/run_doc_checks.sh --quiet

# Combined options
./scripts/run_doc_checks.sh --apply --quiet
```

**Execution Order** (when `--apply` is used):
1. `lint_docs.py` - Report issues
2. `check_frontmatter.py` - Validate frontmatter
3. `fix_whitespace.py` - Remove trailing whitespace
4. `normalize_tags.py` - Normalize tags
5. `fix_h1.py` - Add missing H1 headings
6. `clean_frontmatter.py` - Normalize frontmatter format
7. `generate_docs_index.py` - Regenerate documentation index

---

## Usage Guide

### Quick Start

1. **Setup repositories list**:
   ```bash
   cp repos.txt.example repos.txt
   # Edit repos.txt with your repository URLs
   ```

2. **Run full aggregation pipeline**:
   ```bash
   ./scripts/aggregate.sh
   ```

3. **Run quality checks**:
   ```bash
   ./scripts/run_doc_checks.sh
   ```

4. **Apply auto-fixes**:
   ```bash
   ./scripts/run_doc_checks.sh --apply
   ```

### Individual Script Usage

```bash
# Process raw docs into organized structure
python3 scripts/process.py

# Validate frontmatter
python3 scripts/check_frontmatter.py --fix

# Lint for issues
python3 scripts/lint_docs.py

# Generate quality report
python3 scripts/generate_docs_report.py
```

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `XAI_API_KEY` | API key for AI-enhanced content analysis in `process.py` | No |

### File-Based Configuration

| File | Purpose |
|------|---------|
| `repos.txt` | List of repository URLs to aggregate |
| `requirements.txt` | Python dependencies |

---

## Dependencies

### Python Packages

```
pyyaml
requests
```

### System Requirements

- Python 3.7+
- Git
- Bash (for shell scripts)

### Installation

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or use virtual environment (handled automatically by aggregate.sh)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Workflow Integration

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
name: Documentation Quality

on: [push, pull_request]

jobs:
  docs-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Run documentation checks
        run: ./scripts/run_doc_checks.sh
      
      - name: Generate quality report
        run: python3 scripts/generate_docs_report.py
      
      - name: Upload report artifact
        uses: actions/upload-artifact@v4
        with:
          name: docs-quality-report
          path: docs/results/docs_quality_report.json
```

### Pre-commit Hook

Add to `.pre-commit-config.yaml`:

```yaml
repos:
  - repo: local
    hooks:
      - id: docs-lint
        name: Lint documentation
        entry: python3 scripts/lint_docs.py
        language: system
        files: \.md$
        pass_filenames: false
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `No python interpreter found` | Install Python 3.7+ and ensure it's in PATH |
| `Module yaml not found` | Run `pip install pyyaml` or let `aggregate.sh` create venv |
| `Permission denied` | Make scripts executable: `chmod +x scripts/*.sh` |
| `Git clone timeout` | Check network connection; increase timeout in `aggregate.py` |

### Debug Mode

For verbose output, examine script execution:

```bash
# Run with bash debug mode
bash -x scripts/aggregate.sh

# Check Python script errors
python3 scripts/lint_docs.py 2>&1 | tee lint_output.log
```

---

## Related Documentation

- [Parent README](../README.md) - Main project documentation
- [Testing Framework](../tests/TESTING_FRAMEWORK.md) - Test suite documentation
- [Documentation Checks](../README_DOCS_CHECKS.md) - Quality check standards

---

## Contributing

When adding new scripts:

1. Follow existing naming conventions (`snake_case.py`, `kebab-case.sh`)
2. Include docstrings/comments explaining purpose and usage
3. Add error handling and meaningful exit codes
4. Update this README with the new script documentation
5. Add tests if applicable

---

*Last Modified: 2025-12-04*
