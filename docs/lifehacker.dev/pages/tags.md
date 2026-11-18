---
description: Browse lifehacker.dev by tag.
layout: default
permalink: /tags/
sidebar:
  nav: main
sitemap: false
source_file: pages/tags.md
source_repo: bamr87/lifehacker.dev
source_url: https://github.com/bamr87/lifehacker.dev/blob/main/pages/tags.md
title: Tags
---

# Tags

Hand-authored (the archive plugin doesn't run on GitHub Pages). Every hack, tool review, and field note is a post now, so a single pass over `site.posts` pools every `#tag` the theme links to — and it resolves here.

{% assign all_docs = site.posts %}
{% capture tagblob %}{% for d in all_docs %}{% for t in d.tags %}{{ t }},{% endfor %}{% endfor %}{% endcapture %}
{% assign all_tags = tagblob | split: "," | uniq | sort %}
{% for tag in all_tags %}{% unless tag == "" %}
<h2 id="{{ tag | slugify }}">{{ tag }}</h2>
<ul>
{% for d in all_docs %}{% if d.tags contains tag %}<li><a href="{{ d.url | relative_url }}">{{ d.title }}</a></li>{% endif %}{% endfor %}
</ul>
{% endunless %}{% endfor %}
{% unless all_tags.size > 0 %}<p class="text-body-secondary">No tags yet.</p>{% endunless %}
