---
aliases:
- /docs/jekyll/
categories:
- docs
- jekyll
description: Jekyll basics and Zer0-Mistakes development workflow (Docker-first).
difficulty: beginner
draft: false
estimated_reading_time: 10 minutes
lastmod: 2026-06-14 00:00:00+00:00
layout: default
permalink: /docs/jekyll/
prerequisites:
- Docker Desktop (recommended) or Ruby + Bundler
preview: /images/previews/jekyll.png
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/jekyll/index.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/jekyll/index.md
tags:
- jekyll
- getting-started
- docker
title: Jekyll
type: doc
---

# Jekyll

Jekyll is the static site generator that powers Zer0-Mistakes. This section covers everything you need to work with Jekyll effectively.

## Quick Start

### Prerequisites

- Complete the [[zer0-CMS/sites/zer0-pages/pages/_docs/installation|Installation Guide]]
- Have Docker Desktop running (or Ruby + Bundler installed)

### Run Locally

```bash
# With Docker (recommended)
docker-compose up

# Without Docker
bundle exec jekyll serve --config "_config.yml,_config_dev.yml"
```

Your site will be available at [http://localhost:4000](http://localhost:4000).

## Key Concepts

### Directory Structure

| Directory | Purpose |
|-----------|---------|
| `_layouts/` | Page templates (HTML with Liquid) |
| `_includes/` | Reusable components |
| `_data/` | Site data files (YAML, JSON) |
| `_sass/` | Stylesheet partials |
| `pages/` | Content collections |
| `assets/` | Static files (CSS, JS, images) |

### Configuration Files

| File | Purpose |
|------|---------|
| `_config.yml` | Production configuration |
| `_config_dev.yml` | Development overrides |
| `Gemfile` | Ruby dependencies |

### Content Collections

Zer0-Mistakes organizes content in collections under `pages/`:

- `_posts/` - Blog posts
- `_docs/` - Documentation
- `_notes/` - Cheatsheets and working notes

## Essential Commands

```bash
# Build the site
docker-compose exec jekyll jekyll build

# Build with verbose output
docker-compose exec jekyll jekyll build --verbose

# Check for configuration issues
docker-compose exec jekyll jekyll doctor

# Clean build artifacts
docker-compose exec jekyll jekyll clean
```

## Documentation Topics

### Configuration & Setup

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll Configuration]] — Site settings and options
- [[zer0-CMS/sites/zer0-pages/pages/_docs/front-matter|Front Matter]] — Page metadata and options
- [[zer0-CMS/sites/zer0-pages/pages/_docs/jekyll/code-highlighting|Code Highlighting]] — Syntax highlighting
- [[zer0-CMS/sites/zer0-pages/pages/_docs/jekyll/pagination|_docs/jekyll/pagination]] — Post navigation

### Features

See the [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Features]] section for:

- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/mermaid-diagrams|Mermaid Diagrams]] — Flowcharts and diagrams
- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/mathjax-math|MathJax Math]] — Mathematical notation
- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/giscus-comments|Giscus Comments]] — GitHub Discussions comments
- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/posthog-analytics|PostHog Analytics]] — Privacy-first analytics

### Deployment

See the [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Deployment]] section for:

- [[zer0-CMS/sites/zer0-pages/pages/_docs/deployment/github-pages|GitHub Pages]] — Free hosting with GitHub
- [[zer0-CMS/sites/zer0-pages/pages/_docs/deployment/netlify|_docs/deployment/netlify]] — Advanced hosting features
- [[zer0-CMS/sites/zer0-pages/pages/_docs/deployment/custom-domain|Custom Domain]] — Use your own domain

## Resources

- [Official Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll GitHub Repository](https://github.com/jekyll/jekyll)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Related

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Ruby & Bundler]] — Ruby dependency management
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Liquid Templating]] — Template language reference
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Docker Development]] — Container-based workflow

## See also

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Liquid]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Ruby]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Docker]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Customization]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/front-matter|front-matter]]
