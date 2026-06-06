---
author: bamr87
categories:
- notes
- dev
- jekyll
- sidebar
date: 2024-05-14 22:06:19+00:00
description: Jekyll Liquid template code for generating dynamic sidebar navigation
  with folder structures from collections
draft: false
excerpt: Implementation guide for creating organized sidebar navigation that displays
  collection files in a hierarchical folder structure
lastmod: 2024-05-16 01:45:59.214000+00:00
slug: side-bar-folders
source_file: 2024-05-14-side-bar-folders.md
tags:
- jekyll
- liquid
- sidebar
- navigation
- collections
- file-structure
title: 2024 05 14 Side Bar Folders
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