---
categories:
- docs
- development
description: Aperçu du processus de publication pour le thème Zer0-Mistakes. Consultez
  docs/ pour la référence complète de l'automatisation des versions.
difficulty: advanced
estimated_reading_time: 5 minutes
lang: fr
lastmod: 2026-06-16 00:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/development/release-management/
preview: /images/previews/release-management.png
sidebar:
  nav: docs
source_file: release-management.md
tags:
- release
- versioning
- changelog
- rubygems
title: Gestion des versions
translated_from_sha: 7d4039713c7b
translation_of: pages/_docs/development/release-management.md
translation_source_url: /docs/development/release-management/
---
# Gestion des versions

Les versions suivent [Conventional Commits](https://www.conventionalcommits.org/) et [Semantic Versioning](https://semver.org/). Le processus de publication est entièrement automatisé via `scripts/bin/release` :

```bash
./scripts/bin/release patch           # e.g. 1.9.8 → 1.9.9
./scripts/bin/release minor           # e.g. 1.9.8 → 1.10.0
./scripts/bin/release patch --dry-run # preview without changes
```

La commande gère l'incrémentation de version, la génération du CHANGELOG, la construction de la gem, la publication sur RubyGems et la création de la release GitHub en une seule étape.

## Référence complète

Le guide complet d'automatisation des versions — workflow en 10 étapes, options, dépannage, architecture des bibliothèques — se trouve dans la documentation des contributeurs :

**[Automatisation des versions → docs/systems/release-automation.md](https://github.com/bamr87/zer0-mistakes/blob/main/docs/systems/release-automation.md)**

Voir aussi : [Système de version automatisé → docs/systems/automated-version-system.md](https://github.com/bamr87/zer0-mistakes/blob/main/docs/systems/automated-version-system.md)
