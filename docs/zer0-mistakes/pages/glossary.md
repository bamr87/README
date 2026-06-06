---
categories:
- documentation
date: 2026-03-28 00:00:00+00:00
description: Definitions of key terms used in the zer0-mistakes Jekyll theme — Jekyll,
  Docker, Bootstrap, Liquid, and more.
lastmod: 2026-03-28 00:00:00+00:00
layout: default
permalink: /glossary/
source_file: glossary.md
tags:
- glossary
- reference
- documentation
title: '{{ page.title }}'
---
# {{ page.title }}

Key terms and definitions used throughout the **zer0-mistakes** Jekyll theme. Each term includes a concise definition, related concepts, and links to learn more.

---

{% for entry in site.data.glossary %}
### {{ entry.term }}

{{ entry.definition }}

{% if entry.url %}[Learn more →]({{ entry.url }}){% endif %}
{% if entry.related %}<small class="text-body-secondary">Related: {{ entry.related | join: ", " }}</small>{% endif %}

{% unless forloop.last %}---{% endunless %}

{% endfor %}
