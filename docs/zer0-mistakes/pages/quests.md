---
description: Browse quests and tutorials.
lastmod: 2026-04-18 19:30:22+00:00
layout: default
permalink: /quests/
source_file: pages/quests.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/pages/quests.md
title: Quests
---

# Quests

{% if site.quests and site.quests.size > 0 %}
<ul>
  {% for quest in site.quests %}
    <li><a href="{{ quest.url | relative_url }}">{{ quest.title | default: quest.name }}</a></li>
  {% endfor %}
</ul>
{% else %}
<p>No quests published yet.</p>
{% endif %}
