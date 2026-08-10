---
categories:
- docs
- development
description: Aperçu de la suite de tests du thème Zer0-Mistakes. Consultez la référence
  destinée aux contributeurs dans docs/ pour le guide de test complet.
difficulty: intermediate
estimated_reading_time: 5 minutes
lang: fr
lastmod: 2026-06-16 00:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/development/testing/
preview: /images/previews/testing.png
sidebar:
  nav: docs
source_file: testing.md
tags:
- testing
- ci-cd
- quality
title: Tests
translated_from_sha: 61cc694046fe
translation_of: pages/_docs/development/testing.md
translation_source_url: /docs/development/testing/
---
# Tests

Le thème Zer0-Mistakes inclut une suite de tests complète couvrant la validation préalable, les fonctionnalités de base, la préparation au déploiement, les contrôles de qualité et les tests de régression visuelle Playwright.

Les tests s'exécutent automatiquement via GitHub Actions à chaque push et pull request. La suite utilise des scripts shell (sans dépendance à RSpec), afin que les contributeurs puissent exécuter les tests localement avec Docker ou un environnement Ruby natif.

## Démarrage rapide

```bash
# Run all tests (from repo root)
./test/test_runner.sh

# Run smoke tests only
./test/test_runner.sh --scope smoke

# Run with retry on failure
./test/test_runner.sh --retry-failed
```

## Référence complète

Le guide de test complet — structure des tests, écriture de nouveaux tests, attentes en matière de couverture, intégration CI/CD et configuration de Playwright — se trouve dans la documentation destinée aux contributeurs :

**[Guide de test → docs/development/testing.md](https://github.com/bamr87/zer0-mistakes/blob/main/docs/development/testing.md)**
