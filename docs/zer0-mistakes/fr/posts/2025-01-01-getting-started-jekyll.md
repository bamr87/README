---
author: Zer0-Mistakes Team
categories:
- Tutorial
- Development
date: 2025-01-01 08:00:00+00:00
description: Un tutoriel accessible aux débutants pour créer votre premier site web
  Jekyll à partir de zéro, avec des instructions étape par étape.
draft: true
estimated_reading_time: 15 minutes
featured: false
lang: fr
lastmod: 2026-07-13 00:00:00+00:00
layout: article
machine_translated: true
permalink: /fr/posts/2025/01/01/getting-started-jekyll/
preview: /images/previews/getting-started-with-jekyll-your-first-static-site.png
source_file: 2025-01-01-getting-started-jekyll.md
tags:
- jekyll
- beginner
- static-site
- getting-started
title: 2025 01 01 Getting Started Jekyll
translated_from_sha: 8d3fbba92fb2
translation_of: pages/_posts/2025-01-01-getting-started-jekyll.md
translation_source_url: /posts/2025/01/01/getting-started-jekyll/
---
Bienvenue dans Jekyll ! Ce tutoriel vous guidera dans la création de votre premier site web statique avec Jekyll, le générateur de sites statiques populaire.

## Qu'est-ce que Jekyll ?

Jekyll est un générateur de sites statiques qui transforme du texte brut en sites web statiques :

- **Prise en charge de Markdown** : Rédigez le contenu en Markdown
- **Templates Liquid** : Créez des mises en page dynamiques
- **Prêt pour GitHub Pages** : Hébergement gratuit sur GitHub
- **Écosystème de plugins** : Étendez les fonctionnalités

## Prérequis

Avant de commencer, assurez-vous d'avoir :

- Ruby 2.5+ installé
- Le gestionnaire de paquets RubyGems
- Des connaissances de base en ligne de commande
- Un éditeur de texte

Ou utilisez simplement Docker (recommandé) !

## Créer votre premier site

### Étape 1 : Installer Jekyll

```bash
gem install bundler jekyll
```

### Étape 2 : Créer un nouveau site

```bash
jekyll new my-awesome-site
cd my-awesome-site
```

### Étape 3 : Servir en local

```bash
bundle exec jekyll serve
```

Rendez-vous sur `http://localhost:4000` pour voir votre site !

## Comprendre la structure

```text
my-awesome-site/
├── _config.yml      # Site configuration
├── _posts/          # Blog posts
├── _layouts/        # Page templates
├── _includes/       # Reusable components
└── index.md         # Homepage
```

## Créer votre premier article

Créez un nouveau fichier dans `_posts/` :

```markdown
---
layout: post
title: "My First Post"
date: 2025-01-01
---

Hello, Jekyll world!
```

## Prochaines étapes

- Explorez les thèmes Jekyll
- Apprenez les templates Liquid
- Configurez le déploiement sur GitHub Pages
- Ajoutez des plugins pour des fonctionnalités supplémentaires

Bonne création !
