---
categories:
- docs
- jekyll
description: Notions de base de Jekyll et flux de travail de développement Zer0-Mistakes
  (priorité à Docker).
difficulty: beginner
draft: false
estimated_reading_time: 10 minutes
lang: fr
lastmod: 2026-06-14 00:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/jekyll/
prerequisites:
- Docker Desktop (recommended) or Ruby + Bundler
preview: /images/previews/jekyll.png
sidebar:
  nav: docs
source_file: fr/docs/jekyll/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/fr/docs/jekyll/index.md
tags:
- jekyll
- getting-started
- docker
title: Jekyll
translated_from_sha: fa145fad7d08
translation_of: pages/_docs/jekyll/index.md
translation_source_url: /docs/jekyll/
---

# Jekyll

Jekyll est le générateur de site statique qui propulse Zer0-Mistakes. Cette section couvre tout ce dont vous avez besoin pour travailler efficacement avec Jekyll.

## Démarrage rapide

### Prérequis

- Suivez le [[zer0-mistakes/pages/_docs/installation|Guide d'installation]]
- Ayez Docker Desktop en cours d'exécution (ou Ruby + Bundler installés)

### Exécuter en local

```bash
# With Docker (recommended)
docker-compose up

# Without Docker
bundle exec jekyll serve --config "_config.yml,_config_dev.yml"
```

Votre site sera accessible à l'adresse [http://localhost:4000](http://localhost:4000).

## Concepts clés

### Structure des répertoires

| Répertoire | Rôle |
|-----------|---------|
| `_layouts/` | Modèles de pages (HTML avec Liquid) |
| `_includes/` | Composants réutilisables |
| `_data/` | Fichiers de données du site (YAML, JSON) |
| `_sass/` | Fragments de feuilles de style |
| `pages/` | Collections de contenu |
| `assets/` | Fichiers statiques (CSS, JS, images) |

### Fichiers de configuration

| Fichier | Rôle |
|------|---------|
| `_config.yml` | Configuration de production |
| `_config_dev.yml` | Surcharges de développement |
| `Gemfile` | Dépendances Ruby |

### Collections de contenu

Zer0-Mistakes organise le contenu en collections sous `pages/` :

- `_posts/` - Articles de blog
- `_docs/` - Documentation
- `_quests/` - Tutoriels et parcours d'apprentissage
- `_about/` - Pages « À propos »

## Commandes essentielles

```bash
# Build the site
docker-compose exec jekyll jekyll build

# Build with verbose output
docker-compose exec jekyll jekyll build --verbose

# Check for configuration issues
docker-compose exec jekyll jekyll doctor

# Clean build artifacts
docker-compose exec jekyll jekyll clean
```

## Sujets de documentation

### Configuration et installation

- [[zer0-mistakes/pages/_docs/jekyll/index|Configuration de Jekyll]] — Paramètres et options du site
- [[zer0-mistakes/pages/_docs/front-matter|Front Matter]] — Métadonnées et options de page
- [[zer0-mistakes/pages/_docs/jekyll/code-highlighting|Coloration syntaxique]] — Mise en évidence du code
- [[zer0-mistakes/pages/_docs/jekyll/pagination|Pagination]] — Navigation entre les articles

### Fonctionnalités

Consultez la section [[zer0-mistakes/pages/_docs/features/index|Fonctionnalités]] pour :

- [[zer0-mistakes/pages/_docs/features/mermaid-diagrams|Diagrammes Mermaid]] — Organigrammes et diagrammes
- [[zer0-mistakes/pages/_docs/features/mathjax-math|Mathématiques MathJax]] — Notation mathématique
- [[zer0-mistakes/pages/_docs/features/giscus-comments|Commentaires Giscus]] — Commentaires via GitHub Discussions
- [[zer0-mistakes/pages/_docs/features/posthog-analytics|Analytique PostHog]] — Analytique respectueuse de la vie privée

### Déploiement

Consultez la section [[zer0-mistakes/pages/_docs/deployment/index|Déploiement]] pour :

- [[zer0-mistakes/pages/_docs/deployment/github-pages|GitHub Pages]] — Hébergement gratuit avec GitHub
- [[zer0-mistakes/pages/_docs/deployment/netlify|Netlify]] — Fonctionnalités d'hébergement avancées
- [[zer0-mistakes/pages/_docs/deployment/custom-domain|Domaine personnalisé]] — Utilisez votre propre domaine

## Ressources

- [Documentation officielle de Jekyll](https://jekyllrb.com/docs/)
- [Dépôt GitHub de Jekyll](https://github.com/jekyll/jekyll)
- [Langage de templates Liquid](https://shopify.github.io/liquid/)

## Voir aussi

- [[zer0-mistakes/pages/_docs/ruby/index|Ruby et Bundler]] — Gestion des dépendances Ruby
- [[zer0-mistakes/pages/_docs/liquid/index|Templating Liquid]] — Référence du langage de templates
- [[zer0-mistakes/pages/_docs/docker/index|Développement Docker]] — Flux de travail basé sur les conteneurs

## Voir aussi

- [[zer0-mistakes/fr/docs/liquid/index|Liquid]]
- [[zer0-mistakes/fr/docs/ruby/index|Ruby]]
- [[zer0-mistakes/docker/README|Docker]]
- [[zer0-mistakes/docs/ui/customization|Customization]]
- [[zer0-mistakes/fr/docs/front-matter|front-matter]]
