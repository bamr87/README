---
categories:
- docs
- development
description: Fonctionnement du versioning sémantique et de l'incrémentation de version
  dans zer0-mistakes. Référence complète dans docs/systems/.
difficulty: intermediate
estimated_reading_time: 10 minutes
lang: fr
lastmod: 2026-06-16 00:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/development/version-bump/
prerequisites:
- GitHub repository access
- Understanding of semantic versioning
preview: /images/previews/version-bump-workflow.png
sidebar:
  nav: docs
source_file: version-bump.md
tags:
- version
- automation
- github-actions
title: Workflow d'incrémentation de version
translated_from_sha: 894bc95d515f
translation_of: pages/_docs/development/version-bump.md
translation_source_url: /docs/development/version-bump/
---
# Workflow d'incrémentation de version

Le thème utilise les [Conventional Commits](https://www.conventionalcommits.org/) pour déterminer automatiquement les incréments de version :

| Préfixe de commit | Incrément de version |
|---------------|-------------|
| `fix:` | Patch (1.0.0 → 1.0.1) |
| `feat:` | Mineur (1.0.0 → 1.1.0) |
| `feat!:` ou `BREAKING CHANGE:` | Majeur (1.0.0 → 2.0.0) |

La version est stockée dans `lib/jekyll-theme-zer0/version.rb` et `package.json`. La commande `scripts/bin/release` lit l'historique des commits, calcule l'incrément approprié et met à jour les deux fichiers.

## Référence complète

La documentation complète du système de versioning automatisé — analyse des commits conventionnels, algorithme de calcul, intégration avec GitHub Actions — se trouve dans la documentation des contributeurs :

**[Système de version automatisé → docs/systems/automated-version-system.md](https://github.com/bamr87/zer0-mistakes/blob/main/docs/systems/automated-version-system.md)**

Voir aussi : [Gestion des versions](release-management/) pour le workflow de publication de bout en bout.
