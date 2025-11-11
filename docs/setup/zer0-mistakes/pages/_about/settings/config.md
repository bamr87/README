---
title: Regenerate Config File
category: setup
tags:
- setup
last_updated: null
source_file: config.md
---
## Regenerate Config File with PowerShell

```powershell
# Regenerate Config File

cd ~/github/{{ site.local_repo }}
cp {{ page.config-file }} {{ page.config-dir  }}/config-utf16.txt
Get-Content {{ page.config-dir  }}/config-utf16.txt | Set-Content -Encoding UTF8 {{ page.config-dir }}/{{ page.config-file }}
```
## Regenerate Config File with Bash

```bash
# Regenerate Config File
cd ~/github/{{ site.local_repo }}
cp {{ page.config-file }} {{ page.config-dir  }}/{{ page.config-file }}
```

## Generated Config File

```yml
# Include sitemap/config.yml
{% include_relative {{ page.config-file }} %}
```
