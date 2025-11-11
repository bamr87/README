---
title: 2024 05 14 Side Bar Folders
category: misc
tags:
- documentation
last_updated: null
source_file: 2024-05-14-side-bar-folders.md
---
# 2024 05 14 Side Bar Folders

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