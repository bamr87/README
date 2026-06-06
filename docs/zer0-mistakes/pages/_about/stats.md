---
description: Comprehensive analytics and metrics for the Zer0-Mistakes knowledge base
excerpt: Comprehensive analytics and metrics for your site content.
icon: bi-bar-chart-line
lastmod: 2026-04-04 00:00:00+00:00
layout: admin
permalink: /about/stats/
source_file: stats.md
title: Stats
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
