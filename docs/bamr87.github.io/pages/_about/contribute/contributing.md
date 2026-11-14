---
author: bamr87
categories:
- about
date: 2024-05-20 17:42:21.099000+00:00
description: null
draft: true
excerpt: null
lastmod: 2024-05-20 17:42:21.099000+00:00
meta: null
permalink: /about/contributing
snippet: null
source_file: pages/_about/contribute/contributing.md
source_repo: bamr87/bamr87.github.io
source_url: https://github.com/bamr87/bamr87.github.io/blob/main/pages/_about/contribute/contributing.md
tags:
- contributing
title: contributing
username: $GITHUB_USERNAME
---


https://opensource.guide/

TODO: Right contribution instructions.

Here's a list of contributors:

- [[bamr87.github.io/pages/_about/contribute/contributors/bamr87/README|Amr]]

Start with Contribution framework

- Collaboration Too: [Github]
- Source Code Repo: [Github]
- DevOps Model: 
- Tech Stack Design
- Build instructions
- Automated testing harness
-  


## Add your github profile as a subtree

```shell

cd ~/github/it-journey

# Add the GitHub profile repository as a remote repository

git remote add {{ page.username | default: '$GITHUB_USERNAME' }} https://github.com/{{ page.username | default: '$GITHUB_USERNAME' }}/{{ page.username | default: '$GITHUB_USERNAME' }}.git

# Add the remote repository as a subtree

git subtree add --prefix=pages/_about/contributors/{{ page.username | default: '$GITHUB_USERNAME' }} {{ page.username | default: '$GITHUB_USERNAME' }} main

```