# MkDocs Documentation

This directory contains the MkDocs setup for generating a static documentation site from the aggregated documentation in `README/docs`.

## Quick Start

### Local Development

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements-docs.txt
   ```

3. **Start development server:**
   ```bash
   mkdocs serve
   ```

4. **View documentation:**
   Open http://127.0.0.1:8000/bamr87/ in your browser

### Build Static Site

```bash
# Activate virtual environment
source .venv/bin/activate

# Build static HTML
mkdocs build

# Output will be in site/ directory
```

## Configuration

- **`mkdocs.yml`**: Main configuration file (repository root)
- **`README/docs/`**: Documentation source directory
- **`README/docs/index.md`**: Documentation homepage
- **`requirements-docs.txt`**: Python dependencies (repository root)

> **Note**: This guide is now located at `README/docs/setup/mkdocs-guide/` for better organization within the MkDocs site structure.

## MkDocs-Specific Conventions

### Link Formatting

**Best Practices:**
- Use relative links: `[Link](../path/file.md)` ✅
- Avoid absolute links: `[Link](/absolute/path)` ⚠️
- Avoid Jekyll/Hugo syntax: `{{ '/path' | relative_url }}` ❌

**Internal Links:**
```markdown
# Same directory
[Guide](setup-guide.md)

# Parent directory
[Overview](../README.md)

# With anchor
[Section](../guide.md#section-name)
```

**External Links:**
```markdown
# External links work as-is
[GitHub](https://github.com/user/repo)
```

### Frontmatter Standards

**Required Fields:**
```yaml
---
title: Document Title
---
```

**Recommended Fields:**
```yaml
---
title: Document Title
description: Brief description for search and preview
tags:
  - category
  - topic
---
```

**Avoid (MkDocs doesn't use):**
- `layout:` - Jekyll/Hugo specific
- `permalink:` - MkDocs handles URLs automatically
- `nav_order:` - Use mkdocs.yml navigation instead

### Anchor Links

MkDocs converts headings to anchors automatically:

```markdown
## My Heading → #my-heading
### API Reference → #api-reference
#### Class: MyClass → #class-myclass
```

**Rules:**
- Lowercase
- Spaces become hyphens
- Special characters removed
- Multiple consecutive hyphens collapsed

## Workflow for MkDocs Documentation

### Initial Setup

1. **Install dependencies:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements-docs.txt
   ```

2. **Verify setup:**
   ```bash
   mkdocs --version
   ```

### Working with Aggregated Documentation

**Recommended Workflow:**

1. **Clone/update source repositories** (if aggregating from external sources):
   ```bash
   cd README/temp
   git clone https://github.com/user/repo.git
   # Or update existing:
   cd repo && git pull
   ```

2. **Run MkDocs-optimized aggregation**:
   ```bash
   cd README/scripts
   ./aggregate_mkdocs.py ../temp ../docs
   ```
   
   This will:
   - Organize docs into categories (setup, api, architecture, etc.)
   - Normalize frontmatter
   - Create index files
   - Generate metadata

3. **Fix MkDocs compatibility issues**:
   ```bash
   # Analyze issues first (dry run)
   ./fix_mkdocs_links.py ../docs --dry-run --verbose
   
   # Apply fixes
   ./fix_mkdocs_links.py ../docs --site-url https://bamr87.github.io/bamr87/
   ```

4. **Run quality report**:
   ```bash
   ./mkdocs_quality_report.py ../docs --show-details
   ```
   
   Review and address:
   - Broken links
   - Missing frontmatter
   - Jekyll/Hugo syntax
   - Missing anchors

5. **Build and serve locally**:
   ```bash
   cd ../..  # Back to repo root
   mkdocs serve
   ```
   
   Open http://127.0.0.1:8000/bamr87/

6. **Review build warnings**:
   ```bash
   mkdocs build 2>&1 | grep -E "WARNING|ERROR"
   ```
   
   Address any critical warnings before deployment.

### Handling Build Warnings

**INFO Messages** (usually safe to ignore):
- Absolute links from external repos
- Jekyll/Hugo template syntax in aggregated docs
- Links to external documentation sites

**WARNING Messages** (should fix):
- Broken internal links
- Missing target files
- Invalid frontmatter

**How to Fix:**

1. **Broken Links:**
   ```bash
   # Find and fix automatically
   ./fix_mkdocs_links.py ../docs
   ```

2. **Missing Files:**
   - Re-run aggregation if source changed
   - Create missing index files
   - Update link targets

3. **Invalid Frontmatter:**
   ```bash
   # Check and clean
   python check_frontmatter.py
   python clean_frontmatter.py
   ```

### Continuous Documentation Workflow

**Daily/Weekly:**
```bash
# Update sources and rebuild
cd README/scripts
./aggregate_mkdocs.py ../temp ../docs
./fix_mkdocs_links.py ../docs
mkdocs build
```

**Before Deployment:**
```bash
# Full quality check
cd README/scripts
./mkdocs_quality_report.py ../docs --export-json ../output/pre-deploy-report.json
mkdocs build --strict  # Fail on warnings
```

**Automated (CI/CD):**
```yaml
# .github/workflows/docs.yml
- name: Build Documentation
  run: |
    pip install -r requirements-docs.txt
    cd README/scripts
    ./mkdocs_quality_report.py ../docs --export-json quality.json
    cd ../..
    mkdocs build --strict
```

## Configuration

- **`mkdocs.yml`**: Main configuration file
- **`README/docs/`**: Documentation source directory
- **`README/docs/index.md`**: Documentation homepage
- **`requirements-docs.txt`**: Python dependencies

## Features

- **Material Theme**: Modern, responsive design
- **Search**: Client-side search across all 2852+ docs
- **Auto Navigation**: Folder structure becomes navigation menu
- **Dark Mode**: Light/dark theme toggle
- **Code Highlighting**: Syntax highlighting with copy button
- **Mermaid Diagrams**: Support for diagram rendering

## Navigation Structure

Documentation is organized into these main sections:

- **Setup**: Installation and configuration guides
- **User Guides**: Tutorials and how-tos
- **API Reference**: API documentation
- **Architecture**: System design and patterns
- **Development**: Development workflows
- **Miscellaneous**: Additional resources
- **Results**: Analysis and quality reports

## Known Issues

Some broken links exist in the aggregated documentation (warnings during build). These are expected since the docs were collected from multiple repositories with different structures.

## Deployment Options

### GitHub Pages (Recommended)

Add this to `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install -r requirements-docs.txt
      - run: mkdocs gh-deploy --force
```

### Manual Deployment

Build and copy `site/` directory to your web server:

```bash
mkdocs build
# Copy site/ to your hosting provider
```

## Customization

Edit `mkdocs.yml` to customize:

- Site name and URL
- Theme colors
- Navigation structure
- Enabled features
- Search configuration
- Markdown extensions

## Recent Updates

- **[Navigation Fix Summary](./navigation-fix-summary.md)** - How we fixed 404 errors on all category pages (2025-01-27)
- **[Update Summary](./update-summary.md)** - Virtual environment migration from .venv-docs to .venv
- **[Quick Reference](./quick-reference.md)** - Common commands and workflows

## Troubleshooting

**404 Errors on Category Pages:**

See [Navigation Fix Summary](./navigation-fix-summary.md) for the complete solution. Quick fix:

```bash
# Every directory in docs/ needs an index.md file
# Check for missing index files:
find README/docs -maxdepth 2 -type d -exec test ! -f {}/index.md \; -print
```

**Virtual environment issues:**
```bash
# Deactivate and recreate
deactivate
rm -rf .venv
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements-docs.txt
```

**Port already in use:**
```bash
mkdocs serve -a localhost:8001
```

**Build fails:**
```bash
# Clean build
rm -rf site/
mkdocs build
```

---

*Documentation powered by MkDocs Material*
