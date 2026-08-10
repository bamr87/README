---
description: Analyses et métriques complètes pour la base de connaissances Zer0-Mistakes
excerpt: Analyses et métriques complètes pour le contenu de votre site.
icon: bi-bar-chart-line
lang: fr
lastmod: 2026-04-04 00:00:00+00:00
layout: admin
machine_translated: true
permalink: /fr/about/stats/
preview: /images/previews/site-statistics-portal.png
source_file: stats.md
title: Stats
translated_from_sha: 06c9f7519562
translation_of: pages/_about/stats.md
translation_source_url: /about/stats/
---
{% include stats/stats-header.html %}

{% if site.data.content_statistics %}

  {% include stats/stats-overview.html %}

  <div class="row g-4 mb-5">
    <div class="col-lg-6">
      {% include stats/stats-categories.html %}
    </div>
    <div class="col-lg-6">
      {% include stats/stats-tags.html %}
    </div>
  </div>

  {% include stats/stats-metrics.html %}

{% else %}

  {% include stats/stats-no-data.html %}

{% endif %}
