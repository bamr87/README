---
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
source_file: pages/_docs/jekyll/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/pages/_docs/jekyll/index.md
tags:
- jekyll
- getting-started
- docker
title: Jekyll
---

# Jekyll

Jekyll is the static site generator that powers Zer0-Mistakes. This section covers everything you need to work with Jekyll effectively.

## Quick Start

### Prerequisites

- Complete the [[zer0-mistakes/pages/_docs/installation|Installation Guide]]
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
- `_quests/` - Tutorials and learning paths
- `_about/` - About pages

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

- [[zer0-mistakes/pages/_docs/jekyll/index|Jekyll Configuration]] — Site settings and options
- [[zer0-mistakes/pages/_docs/front-matter|Front Matter]] — Page metadata and options
- [[zer0-mistakes/pages/_docs/jekyll/code-highlighting|Code Highlighting]] — Syntax highlighting
- [[zer0-mistakes/pages/_docs/jekyll/pagination|Pagination]] — Post navigation

### Features

See the [[zer0-mistakes/pages/_docs/features/index|Features]] section for:

- [[zer0-mistakes/pages/_docs/features/mermaid-diagrams|Mermaid Diagrams]] — Flowcharts and diagrams
- [[zer0-mistakes/pages/_docs/features/mathjax-math|MathJax Math]] — Mathematical notation
- [[zer0-mistakes/pages/_docs/features/giscus-comments|Giscus Comments]] — GitHub Discussions comments
- [[zer0-mistakes/pages/_docs/features/posthog-analytics|PostHog Analytics]] — Privacy-first analytics

### Deployment

See the [[zer0-mistakes/pages/_docs/deployment/index|Deployment]] section for:

- [[zer0-mistakes/pages/_docs/deployment/github-pages|GitHub Pages]] — Free hosting with GitHub
- [[zer0-mistakes/pages/_docs/deployment/netlify|Netlify]] — Advanced hosting features
- [[zer0-mistakes/pages/_docs/deployment/custom-domain|Custom Domain]] — Use your own domain

## Resources

- [Official Jekyll Documentation](https://jekyllrb.com/docs/)
- [Jekyll GitHub Repository](https://github.com/jekyll/jekyll)
- [Liquid Template Language](https://shopify.github.io/liquid/)

## Related

- [[zer0-mistakes/pages/_docs/ruby/index|Ruby & Bundler]] — Ruby dependency management
- [[zer0-mistakes/pages/_docs/liquid/index|Liquid Templating]] — Template language reference
- [[zer0-mistakes/pages/_docs/docker/index|Docker Development]] — Container-based workflow

## See also

- [[zer0-mistakes/fr/docs/liquid/index|Liquid]]
- [[zer0-mistakes/fr/docs/ruby/index|Ruby]]
- [[zer0-mistakes/docker/README|Docker]]
- [[zer0-mistakes/docs/ui/customization|Customization]]
- [[zer0-mistakes/fr/docs/front-matter|front-matter]]
