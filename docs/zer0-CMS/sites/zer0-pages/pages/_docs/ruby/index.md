---
aliases:
- /docs/ruby/
categories:
- docs
- ruby
description: Ruby versioning and Bundler tips for Zer0-Mistakes.
difficulty: beginner
estimated_reading_time: 5 minutes
lastmod: 2025-12-20 22:15:46.090000+00:00
layout: default
permalink: /docs/ruby/
prerequisites: []
preview: /images/previews/ruby.png
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/ruby/index.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/ruby/index.md
tags:
- ruby
- bundler
title: Ruby
type: doc
---

# Ruby & Bundler

Jekyll is built with Ruby. Understanding the basics helps with troubleshooting and customization.

## Quick Reference

### Check Versions

```bash
# Ruby version
ruby --version

# Bundler version
bundle --version

# Jekyll version
bundle exec jekyll --version
```

### Common Commands

```bash
# Install dependencies from Gemfile
bundle install

# Update all gems
bundle update

# Update specific gem
bundle update jekyll

# Run Jekyll through Bundler
bundle exec jekyll serve
```

## Key Files

| File | Purpose |
|------|---------|  
| `Gemfile` | Lists Ruby gem dependencies |
| `Gemfile.lock` | Locks exact versions |
| `jekyll-theme-zer0.gemspec` | Theme gem specification |

## With Docker

When using Docker, Ruby commands run inside the container:

```bash
# Check Ruby version in container
docker-compose exec jekyll ruby --version

# Update gems in container
docker-compose exec jekyll bundle update
```

## Troubleshooting

### Gem Installation Errors

```bash
# Clear bundle cache
bundle clean --force

# Reinstall everything
rm -rf vendor/bundle
bundle install
```

### Version Conflicts

```bash
# Check for outdated gems
bundle outdated

# Update Gemfile.lock
bundle update
```

## Learn More

- [[zer0-CMS/sites/zer0-pages/pages/_docs/ruby-101|Ruby 101]] - Detailed Ruby basics
- [Official Ruby Documentation](https://www.ruby-lang.org/en/documentation/)
- [Bundler Documentation](https://bundler.io/docs.html)

## Related

- [[zer0-CMS/sites/zer0-pages/pages/_docs/installation|Installation Guide]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll Guide]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Docker Development]]

## See also

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Docker]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/installation|Installation]]
