---
author: bamr87
catagories:
- docs
- home
date: 2021-09-24 19:32:44.876000+00:00
description: Index of all doc pages and instructions on how to add new doc sections
draft: true
lastmod: 2024-05-21 18:27:46.013000+00:00
layout: collection
permalink: /docs/
sidebar:
  nav: docs
source_file: pages/_docs/index.md
source_repo: bamr87/bamr87.github.io
source_url: https://github.com/bamr87/bamr87.github.io/blob/main/pages/_docs/index.md
title: Docs (~) Index
toc_sticky: true
---

You have reached the documentation (library) section of this site, which will contain detailed information of various components of this site (e.g., jekyll, bootstrap, etc.). The ultimate goal is to house a documentation site that operates very similar to Microsoft's doc site [here](https://learn.microsoft.com/en-us/docs/).

These docs are sourced using the git module function, cleaned up with some scripts, and then generated using jekyll. In the future, these docs will have multiple engines to created (i.e., using Hugo to create the docs site).

Current, we have docs for the following applications:

- Ruby
- Jekyll
- Liquid
- Bootstrap
- 

To add to this collection, you need to run the following commands on your local development environment:

## Jekyll
[official docs](https://jekyllrb.com/docs/)

```sh
git submodule add https://github.com/jekyll/jekyll.git jekyll-docs
```

```sh
cd jekyll-docs/docs/_docs
git sparse-checkout init --cone
git sparse-checkout set jekyll-docs/docs/_docs
git sparse-checkout set docs/_docs
```
