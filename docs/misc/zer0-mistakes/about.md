---
title: About
category: misc
tags:
- documentation
last_updated: null
source_file: about.md
---
{{ site.description }}

## Quick Facts

This world was created by {{ site.founder }} and maintained by:

{:table .table .table-striped}
Name | Profile
---------|----------
{% for follower in site.maintainers -%}
  {{ follower.name }} | {{ follower.profile }}
{% endfor %}

And, most importantly, Powered By:

{:table .table .table-striped}
Name | Link
---------|----------
{% for power in site.powered_by -%}
{{ power.name }} | {{ power.url }}
{% endfor %}

## Contact Information

If you have any questions, comments, or suggestions, please feel free to reach out to us at:

- Email: {{ site.email }}
