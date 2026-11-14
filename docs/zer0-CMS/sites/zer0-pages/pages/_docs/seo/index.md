---
aliases:
- /docs/seo/
categories:
- docs
- seo
description: Configure the Zer0-Mistakes theme's built-in SEO — Open Graph and Twitter
  meta tags, JSON-LD structured data, XML sitemaps, and a search index.
difficulty: beginner
estimated_reading_time: 5 minutes
keywords:
- jekyll seo
- meta tags
- open graph
- structured data
- xml sitemap
lastmod: 2026-06-14 06:00:00+00:00
layout: default
permalink: /docs/seo/
preview: /images/previews/seo.png
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/seo/index.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/seo/index.md
tags:
- seo
- meta
- sitemap
- search
title: 'Jekyll SEO Features: Meta Tags, Sitemaps & Schema'
type: doc
---

# SEO Features

The Zer0-Mistakes theme ships Open Graph and Twitter Card meta tags, JSON-LD structured data, an XML sitemap, and a search index — all enabled automatically with no plugin required.

## Features

| Feature | Purpose |
|---------|---------|
| [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/meta-tags\|Meta Tags]] | Open Graph, Twitter Cards, canonical URLs |
| [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/sitemap\|_docs/seo/sitemap]] | XML sitemap and JSON search index |
| [[zer0-CMS/sites/zer0-pages/pages/_docs/features/breadcrumbs\|_docs/features/breadcrumbs]] | Structured navigation markup |

## Quick Setup

Most SEO features work automatically. Configure site-wide defaults:

```yaml
# _config.yml
title: "Your Site Title"
description: "Your site description for search engines"
preview: /images/previews/seo.png
url: "https://yoursite.com"
author:
  name: "Your Name"
  twitter: "@yourusername"
og_image: "/assets/images/og-default.png"
```

## Per-Page SEO

Override in front matter:

```yaml
---
title: "Page Title"
description: "Page-specific description"
preview: /images/previews/seo.png
image: "/assets/images/page-image.png"
author: "Specific Author"
---
```

## Validation Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Related

- [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/meta-tags|Meta Tags]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/seo/sitemap|_docs/seo/sitemap]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/breadcrumbs|_docs/features/breadcrumbs]]

## See also

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Analytics]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/front-matter|front-matter]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Features]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Deployment]]
