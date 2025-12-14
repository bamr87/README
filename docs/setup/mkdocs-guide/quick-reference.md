# MkDocs Quick Reference Guide

Quick commands and conventions for working with MkDocs documentation.

## Essential Commands

```bash
# Activate virtual environment
source .venv/bin/activate

# Start development server
mkdocs serve

# Build static site
mkdocs build

# Build with strict warnings (fail on warnings)
mkdocs build --strict

# Deploy to GitHub Pages
mkdocs gh-deploy --force
```

## Documentation Quality Workflow

```bash
# 1. Navigate to scripts directory
cd README/scripts

# 2. Check documentation quality
./mkdocs_quality_report.py ../docs

# 3. Analyze link issues (dry-run)
./fix_mkdocs_links.py ../docs --dry-run --verbose > link-report.txt

# 4. Fix link issues (if needed)
./fix_mkdocs_links.py ../docs

# 5. Build and check for warnings
cd ../..
mkdocs build 2>&1 | tee build.log
```

## Aggregating External Documentation

```bash
cd README/scripts

# Aggregate from cloned repos
./aggregate_mkdocs.py ../temp ../docs

# Review what was aggregated
cat ../docs/repos_metadata.yaml

# Check quality after aggregation
./mkdocs_quality_report.py ../docs --show-details
```

## Link Format Cheat Sheet

### ✅ Good (MkDocs-Compatible)

```markdown
# Relative links
[Setup Guide](setup-guide.md)
[Parent Doc](../README.md)
[Section](#heading-name)
[Other Doc Section](../path/file.md#section)

# External links
[GitHub](https://github.com/user/repo)
```

### ⚠️ Needs Fixing

```markdown
# Absolute site links (may break)
[Docs](/docs/path/file.md)

# Jekyll/Hugo liquid tags
{{ '/docs/path' | relative_url }}
{{ site.baseurl }}/path

# Cross-site references without full URL
[Link](/other-site/path)
```

## Frontmatter Templates

### Minimal (Required)

```yaml
---
title: Page Title
---
```

### Recommended

```yaml
---
title: Page Title
description: Brief description for SEO and previews
tags:
  - category
  - topic
---
```

### Complete

```yaml
---
title: Comprehensive Guide to Feature
description: Step-by-step tutorial covering all aspects
author: Your Name
date: 2025-12-13
tags:
  - tutorial
  - feature
  - advanced
category: user-guides
---
```

## Common Issues & Solutions

### Issue: "WARNING - Doc file contains a link, but target not found"

**Solution:**
```bash
# Find and fix broken links
cd README/scripts
./fix_mkdocs_links.py ../docs
```

### Issue: Many absolute links from external repos

**Expected**: INFO messages for external docs are normal.

**Optional Fix**: Run link fixer to convert what it can:
```bash
./fix_mkdocs_links.py ../docs --site-url https://bamr87.github.io/bamr87/
```

### Issue: Jekyll/Hugo syntax not rendering

**Solution:**
```bash
# Fix liquid tags automatically
./fix_mkdocs_links.py ../docs
```

### Issue: Missing frontmatter

**Solution:**
```bash
# Check and add frontmatter
python check_frontmatter.py
# Or use aggregate_mkdocs.py which adds it automatically
```

## Quality Metrics

### Current Baseline (Dec 13, 2025)

```
Files:             2853
Frontmatter:       99.9%
Total Links:       8845
Broken Links:      1602
Absolute Links:    753
Jekyll/Hugo:       46
```

### Target Goals

```
Files:             All aggregated
Frontmatter:       100%
Broken Links:      <100 (from internal docs)
Absolute Links:    <50 (for internal docs)
Jekyll/Hugo:       0
```

## Directory Structure

```
README/
├── docs/                    # MkDocs source
│   ├── index.md            # Homepage
│   ├── api/                # API documentation
│   ├── architecture/       # Design docs
│   ├── development/        # Dev guides
│   ├── setup/              # Getting started
│   ├── user-guides/        # Tutorials
│   └── misc/               # Other docs
├── scripts/                # Processing scripts
│   ├── fix_mkdocs_links.py
│   ├── aggregate_mkdocs.py
│   └── mkdocs_quality_report.py
├── temp/                   # Cloned repos (for aggregation)
└── output/                 # Reports and analysis

site/                       # Built static site (generated)
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Documentation Quality Check

on: [pull_request]

jobs:
  docs-quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: pip install -r requirements-docs.txt
      
      - name: Quality check
        run: |
          cd README/scripts
          ./mkdocs_quality_report.py ../docs --export-json quality.json
      
      - name: Build docs
        run: mkdocs build --strict
      
      - name: Upload quality report
        uses: actions/upload-artifact@v4
        with:
          name: quality-report
          path: README/scripts/quality.json
```

## Pro Tips

1. **Use `--dry-run` first**: Always check what scripts will do before applying changes
2. **Monitor quality over time**: Export JSON reports regularly to track improvements
3. **Address broken links first**: They cause navigation issues for users
4. **Absolute links are OK for external repos**: INFO warnings from aggregated docs are expected
5. **Frontmatter is crucial**: Ensures proper indexing and navigation
6. **Test locally**: Always run `mkdocs serve` before deploying

## Resources

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material Theme Docs](https://squidfunk.github.io/mkdocs-material/)
- [Scripts README](../../../scripts/README.md)
- [Full Workflow Guide](index.md)
- [Update Summary](update-summary.md)

---

**Quick Help:**
```bash
# Any script help
./script_name.py --help

# MkDocs help
mkdocs --help
mkdocs serve --help
mkdocs build --help
```
