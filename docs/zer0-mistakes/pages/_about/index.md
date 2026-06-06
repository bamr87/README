---
categories:
- about
collection: about
date: 2024-05-31 01:35:49.414000+00:00
description: This page provides information about the site, its purpose, and the principles
  guiding its development.
draft: published
excerpt: This page provides information about the site, its configuration, and the
  variables guiding its development.
lastmod: 2025-11-16 14:41:40.537000+00:00
layout: default
order: 1
permalink: /about/
sidebar:
  nav: auto
slug: about
source_file: index.md
tags:
- about
- site-info
title: Index
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
