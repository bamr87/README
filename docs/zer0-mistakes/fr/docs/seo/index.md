---
categories:
- docs
- seo
description: Configurez le SEO intégré du thème Zer0-Mistakes — balises meta Open
  Graph et Twitter, données structurées JSON-LD, sitemaps XML et index de recherche.
difficulty: beginner
estimated_reading_time: 5 minutes
keywords:
- jekyll seo
- meta tags
- open graph
- structured data
- xml sitemap
lang: fr
lastmod: 2026-06-14 06:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/seo/
preview: /images/previews/seo.png
sidebar:
  nav: docs
source_file: fr/docs/seo/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/fr/docs/seo/index.md
tags:
- seo
- meta
- sitemap
- search
title: 'Fonctionnalités SEO de Jekyll : balises meta, sitemaps et schema'
translated_from_sha: 56c57c81e52f
translation_of: pages/_docs/seo/index.md
translation_source_url: /docs/seo/
---

# Fonctionnalités SEO

Le thème Zer0-Mistakes intègre des balises meta Open Graph et Twitter Card, des données structurées JSON-LD, un sitemap XML et un index de recherche — le tout activé automatiquement sans plugin requis.

## Fonctionnalités

| Fonctionnalité | Objectif |
|---------|---------|
| [[zer0-mistakes/pages/_docs/seo/meta-tags\|Balises meta]] | Open Graph, Twitter Cards, URL canoniques |
| [[zer0-mistakes/pages/_docs/seo/sitemap\|Sitemap]] | Sitemap XML et index de recherche JSON |
| [[zer0-mistakes/pages/_docs/features/breadcrumbs\|Fil d'Ariane]] | Balisage de navigation structuré |

## Configuration rapide

La plupart des fonctionnalités SEO fonctionnent automatiquement. Configurez les valeurs par défaut à l'échelle du site :

```yaml
# _config.yml
title: "Your Site Title"
description: "Your site description for search engines"
preview: /images/previews/seo.png
url: "https://yoursite.com"
author:
  name: "Your Name"
  twitter: "@yourusername"
og_image: "/assets/images/og-default.png"
```

## SEO par page

Surchargez dans le front matter :

```yaml
---
title: "Page Title"
description: "Page-specific description"
preview: /images/previews/seo.png
image: "/assets/images/page-image.png"
author: "Specific Author"
---
```

## Outils de validation

- [Test des résultats enrichis Google](https://search.google.com/test/rich-results)
- [Débogueur de partage Facebook](https://developers.facebook.com/tools/debug/)
- [Validateur de Twitter Card](https://cards-dev.twitter.com/validator)

## Associés

- [[zer0-mistakes/pages/_docs/seo/meta-tags|Balises meta]]
- [[zer0-mistakes/pages/_docs/seo/sitemap|Sitemap]]
- [[zer0-mistakes/pages/_docs/features/breadcrumbs|Fil d'Ariane]]

## Voir aussi

- [[zer0-mistakes/fr/docs/analytics/index|Analytics]]
- [[zer0-mistakes/fr/docs/front-matter|front-matter]]
- [[zer0-mistakes/features/README|Features]]
- [[zer0-mistakes/pages/_docs/deployment/index|Deployment]]
