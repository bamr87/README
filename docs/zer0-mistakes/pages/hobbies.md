---
description: Browse hobbies content.
lastmod: 2026-04-18 19:30:21+00:00
layout: default
permalink: /hobbies/
source_file: pages/hobbies.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/pages/hobbies.md
title: Hobbies
---

# Hobbies

{% if site.hobbies and site.hobbies.size > 0 %}
<ul>
  {% for hobby in site.hobbies %}
    <li><a href="{{ hobby.url | relative_url }}">{{ hobby.title | default: hobby.name }}</a></li>
  {% endfor %}
</ul>
{% else %}
<p>No hobbies published yet.</p>
{% endif %}
