---
author: bamr87
categories:
- Posts
- Web-Development
- SEO
date: 2023-12-04 15:42:39+00:00
description: Learn how to properly configure robots.txt files for Jekyll websites
  to control search engine crawlers and optimize SEO
draft: false
excerpt: Master robots.txt configuration for Jekyll sites to guide search engine crawlers
  and improve your site's SEO performance
keywords:
  primary:
  - robots.txt
  - jekyll seo
  - web crawlers
  secondary:
  - search engine optimization
  - site indexing
  - crawler directives
lastmod: 2024-05-16 02:49:07.594000+00:00
permalink: /posts/robots-txt-jekyll/
section: Data & Analytics
snippet: robots.txt - your site's first line of communication with search engines
source_file: 2023-12-04-robots-txt-jekyll.md
sub-title: SEO and Web Crawler Management
tags:
- robots-txt
- seo
- jekyll
- web-crawlers
- search-engines
- web-development
title: 2023 12 04 Robots Txt Jekyll
type: Article
---
A `robots.txt` file is used to instruct web robots (typically search engine robots) which pages on your website to crawl and which not to. Here's an example of a `robots.txt` file that you might use for a Jekyll site:

```plaintext
User-agent: *
Disallow: /secret/
Disallow: /private/
Disallow: /tmp/
Sitemap: {{ site.url}}/sitemap.xml
```

In this example:

- `User-agent: *` means that the instructions apply to all web robots.
- `Disallow: /secret/` tells robots not to crawl pages under the `/secret/` directory.
- `Disallow: /private/` and `Disallow: /tmp/` do the same for these directories.
- `Sitemap: https://www.yoursite.com/sitemap.xml` provides the location of your site's sitemap, which is helpful for search engines to find and index your content.

Remember to replace `https://www.yoursite.com/sitemap.xml` with the actual URL of your sitemap. Also, the `Disallow` entries should be adjusted based on the specific directories or pages you want to keep private or don't want to be indexed by search engines.