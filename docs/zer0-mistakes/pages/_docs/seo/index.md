---
categories:
- docs
- seo
description: Search engine optimization features including meta tags, structured data,
  and sitemap generation.
difficulty: beginner
estimated_time: 5 minutes
layout: default
permalink: /docs/seo/
sidebar:
  nav: docs
source_file: index.md
tags:
- seo
- meta
- sitemap
- search
title: SEO Features
---
# SEO Features

The Zer0-Mistakes theme includes comprehensive SEO features for better search engine visibility.

## Features

| Feature | Purpose |
|---------|---------|
| [Meta Tags](/docs/seo/meta-tags/) | Open Graph, Twitter Cards, canonical URLs |
| [Sitemap](/docs/seo/sitemap/) | XML sitemap and JSON search index |
| [Breadcrumbs](/docs/features/breadcrumbs/) | Structured navigation markup |

## Quick Setup

Most SEO features work automatically. Configure site-wide defaults:

```yaml
# _config.yml
title: "Your Site Title"
description: "Your site description for search engines"
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
image: "/assets/images/page-image.png"
author: "Specific Author"
---
```

## Validation Tools

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## Related

- [Meta Tags](/docs/seo/meta-tags/)
- [Sitemap](/docs/seo/sitemap/)
- [Breadcrumbs](/docs/features/breadcrumbs/)
