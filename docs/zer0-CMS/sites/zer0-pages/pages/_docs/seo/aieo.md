---
aliases:
- /docs/seo/aieo/
categories:
- docs
- seo
description: AI-Engine Optimization for zer0-mistakes — Schema.org JSON-LD, E-E-A-T
  signals, an FAQ page, and a glossary collection for stronger AI search and LLM grounding.
difficulty: intermediate
estimated_reading_time: 10 minutes
lastmod: 2026-06-14 00:00:00+00:00
layout: default
permalink: /docs/seo/aieo/
preview: /images/previews/aieo-ai-engine-optimization.png
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/seo/aieo.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/seo/aieo.md
tags:
- seo
- aieo
- structured-data
- faq
- glossary
- ai
title: AIEO — AI Engine Optimization
type: doc
---

# AIEO — AI Engine Optimization

**AI Engine Optimization (AIEO)** extends traditional SEO practices to improve how AI-powered search engines, LLMs, and AI assistants discover, understand, and cite your content. zer0-mistakes ships a built-in AIEO toolkit.

## Overview

| Component | Purpose |
|---|---|
| Schema.org JSON-LD | Machine-readable structured data for search engines and AI crawlers |
| E-E-A-T signals | Demonstrates Experience, Expertise, Authoritativeness, and Trustworthiness |
| FAQ page | Directly answers common questions (eligible for rich results) |
| Glossary collection | Provides LLM-grounding definitions for domain vocabulary |

## Structured Data (JSON-LD)

The theme injects Schema.org structured data via dedicated include files:

### Software Application Schema

```text
_includes/content/jsonld-software.html
```

Outputs `SoftwareApplication` markup with name, version, description, and license. Used on the home page and theme overview pages.

### FAQ Schema

```text
_includes/content/jsonld-faq.html
```

Outputs `FAQPage` markup from a page's `faq_items` frontmatter array:

```yaml
faq_items:
  - question: "What is zer0-mistakes?"
    answer: "A professional Jekyll theme…"
  - question: "Is it free?"
    answer: "Yes, MIT licensed."
```

Add `{% include content/jsonld-faq.html %}` to any layout or page to emit the FAQ structured data block.

## E-E-A-T Signals

Google and AI crawlers reward content that demonstrates:

- **Experience**: Author bios, case studies, real-world examples
- **Expertise**: Technical depth, code samples, citations
- **Authoritativeness**: Backlinks, GitHub stars, version history
- **Trustworthiness**: Privacy policy, ToS, HTTPS, contact page

Standard supporting pages worth shipping on a public site (the theme's demo site includes all four; this slimmed site omits them):

| Page | Typical permalink |
|---|---|
| Privacy Policy | `/privacy-policy/` |
| Terms of Service | `/terms-of-service/` |
| Contact | `/contact/` |
| About | `/about/` |

## FAQ Page

A FAQ page (e.g. `pages/faq.md` → `/faq/`) uses the `faq_items` frontmatter array and the `jsonld-faq.html` include to output both human-readable Q&A and machine-readable `FAQPage` JSON-LD in a single file.

## Glossary Page

A glossary page (e.g. `pages/glossary.md` → `/glossary/`) provides domain-specific definitions that help LLMs ground responses in accurate, up-to-date vocabulary — terms like Jekyll, Bootstrap, Liquid, Docker, and Obsidian.

## SEO Include (`_includes/content/seo.html`)

The main SEO include emits:

- `<title>` and `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`)
- Twitter Card tags
- Canonical URL
- `robots` meta

It is included automatically by `_includes/core/head.html` on every page.

## Configuration

```yaml
# _config.yml
title: "My Site"
description: "Site description for search engines"
preview: /images/previews/aieo-ai-engine-optimization.png
url: "https://example.com"

# Author / E-E-A-T
author:
  name: "Author Name"
  email: "author@example.com"
  bio: "Expert in …"
  twitter: "@handle"

# Schema.org type for the site
schema_type: "SoftwareApplication"
```

## Related

- [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/meta-tags|Meta Tags & SEO]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/sitemap|_docs/seo/sitemap]]

## See also

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|SEO]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Features]]
