---
aliases:
- /docs/liquid/
categories:
- docs
- liquid
description: Liquid templating basics used by Jekyll and this theme.
difficulty: beginner
estimated_reading_time: 5 minutes
lastmod: 2026-06-14 00:00:00+00:00
layout: default
permalink: /docs/liquid/
prerequisites: []
preview: /images/previews/liquid.png
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/liquid/index.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/liquid/index.md
tags:
- liquid
- jekyll
title: Liquid
type: doc
---

# Liquid

Liquid is the templating language used by Jekyll to process templates and create dynamic content.

## Basic Syntax

### Output (Double Braces)

```liquid
{{ page.title }}
{{ site.description }}
{{ content }}
```

### Logic (Braces with Percent)

```liquid
{% if page.title %}
  <h1>{{ page.title }}</h1>
{% endif %}

{% for post in site.posts %}
  <li>{{ post.title }}</li>
{% endfor %}
```

## Common Filters

### Text Manipulation

```liquid
{{ "hello" | capitalize }}       <!-- Hello -->
{{ "hello world" | upcase }}     <!-- HELLO WORLD -->
{{ page.content | truncate: 100 }}
{{ page.content | strip_html }}
```

### URL Helpers

```liquid
{{ "/about/" | relative_url }}   <!-- Prepends baseurl -->
{{ "/about/" | absolute_url }}   <!-- Full URL with domain -->
```

### Date Formatting

```liquid
{{ page.date | date: "%B %d, %Y" }}  <!-- January 15, 2025 -->
{{ page.date | date_to_xmlschema }}   <!-- 2025-01-15T00:00:00+00:00 -->
```

### Arrays

```liquid
{{ page.tags | join: ", " }}
{{ site.posts | size }}
{{ page.categories | first }}
```

## Control Flow

### Conditionals

```liquid
{% if page.layout == "post" %}
  <!-- Post content -->
{% elsif page.layout == "page" %}
  <!-- Page content -->
{% else %}
  <!-- Default content -->
{% endif %}
```

### Loops

```liquid
{% for post in site.posts limit:5 %}
  <a href="{{ post.url }}">{{ post.title }}</a>
{% endfor %}

{% for tag in page.tags %}
  <span>{{ tag }}</span>
{% endfor %}
```

## Includes

Include reusable components:

```liquid
{% include navigation/navbar.html %}
{% include components/post-card.html post=post %}
```

Pass parameters to includes:

```liquid
{% include card.html 
   title="My Card" 
   content="Card content here" 
%}
```

## Theme Examples

Explore Liquid usage in Zer0-Mistakes:

- `_layouts/` - Page templates
- `_includes/` - Reusable components
- `_includes/navigation/` - Navigation components

## Resources

- [Liquid Documentation](https://shopify.github.io/liquid/)
- [Jekyll Liquid Reference](https://jekyllrb.com/docs/liquid/)
- [Liquid Cheat Sheet](https://www.shopify.com/partners/shopify-cheat-sheet)

## Related

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll Guide]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/front-matter|Front Matter]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll Liquid Templating]]

## See also

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Jekyll]]
- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/_index|Customization]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/front-matter|front-matter]]
