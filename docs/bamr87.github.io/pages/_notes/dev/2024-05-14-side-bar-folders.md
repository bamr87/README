---
author: bamr87
categories:
- sidebar
date: 2024-05-14 15:47:06.342000+00:00
description: null
excerpt: null
keywords: {}
lastmod: 2024-05-16 01:45:59.214000+00:00
layout: null
preview: null
slug: side-bar-folders
snippet: null
source_file: pages/_notes/dev/2024-05-14-side-bar-folders.md
source_repo: bamr87/bamr87.github.io
source_url: https://github.com/bamr87/bamr87.github.io/blob/main/pages/_notes/dev/2024-05-14-side-bar-folders.md
sub-title: null
tags: []
title: side-bar-folders
type: default
---

## All Notes Section

{% assign root_folder = site.collections | where: "label", page.collection | first %}
Root Directory: {{ root_folder.label }}
{% for doc in root_folder.docs %}
File: {{ doc.path }}
{% endfor %}

## Notes Collection File Structure

{% assign root_folder = site.collections | where: "label", page.collection | first %}
<h2>{{ root_folder.label }}</h2>
{% assign docs = root_folder.docs | sort: 'path' %}
{% assign prev_path = "" %}
<ul class="list-group list-group-flush">
{% for doc in docs %}
  {% assign current_path = doc.path | split: '/' | pop %}
  {% if current_path != prev_path %}
    {% for folder in current_path %}
      {% if forloop.index != 1 %}
        <li class="folder ">{{ folder }}</li>
      {% endif %}
    {% endfor %}
    {% assign prev_path = current_path %}
  {% endif %}
  <li class="file list-group-item list-group-item-action"><a href="{{ doc.url }}">{{ doc.title }}</a></li>
{% endfor %}
</ul>