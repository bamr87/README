---
backlinks: true
categories:
- Documentation
- Obsidian
description: Modifiez le contenu de Zer0-Mistakes comme un coffre Obsidian et obtenez
  un rendu identique sur GitHub Pages.
lang: fr
lastmod: '2026-04-24T15:06:30Z'
layout: default
machine_translated: true
permalink: /fr/docs/obsidian/
preview: /images/previews/obsidian-vault-integration.png
source_file: fr/docs/obsidian/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/fr/docs/obsidian/index.md
tags:
- obsidian
- authoring
- workflow
title: Intégration de coffre Obsidian
translated_from_sha: 1c166b90ed27
translation_of: pages/_docs/obsidian/index.md
translation_source_url: /docs/obsidian/
---

# Intégration de coffre Obsidian

Le dépôt Zer0-Mistakes est un coffre [Obsidian](https://obsidian.md) entièrement fonctionnel. Ouvrez la racine du dépôt (ou tout sous-dossier contenant des notes) comme coffre et chaque fichier Markdown devient modifiable avec les wiki-links, intégrations, encarts, vue graphe et rétroliens d'Obsidian. Les mêmes fichiers s'affichent sur GitHub Pages avec une présentation équivalente — pas de duplication, pas d'étape de synchronisation distincte.

## Dans cette section

| Page | Contenu abordé |
| --- | --- |
| [[zer0-mistakes/pages/_docs/obsidian/getting-started\|Prise en main]] | Ouvrir le dépôt comme coffre, plugins recommandés, règles de frontmatter. |
| [[zer0-mistakes/pages/_docs/obsidian/syntax-reference\|Référence de syntaxe]] | Chaque fonctionnalité Obsidian et son rendu sur le site. |
| [[zer0-mistakes/pages/_docs/obsidian/graph\|Vue graphe]] | Carte interactive à disposition dynamique de chaque page et wiki-link. |
| [[zer0-mistakes/pages/_docs/obsidian/authoring-workflow\|Flux de rédaction]] | Boucle note quotidienne → commit → publication. |
| [[zer0-mistakes/pages/_docs/obsidian/troubleshooting\|Dépannage]] | Liens brisés, intégrations manquantes, conflits. |

## Fonctionnement

L'intégration comporte deux volets :

1. **Émission de données côté serveur.** Un modèle Liquid émet
`assets/data/wiki-index.json` à chaque build Jekyll, listant chaque document de collection et chaque page autonome (titre, nom de base, permalien, tags, alias, extrait). Cela fonctionne sur le build GitHub Pages `remote_theme` par défaut, sans plugin personnalisé requis.
2. **Résolveur côté client.** `assets/js/obsidian-wiki-links.js` charge
l'index dans le navigateur et réécrit `⟦10⟧`, `⟦11⟧`, les `#tags` en ligne et les encarts Obsidian sous forme de citations en HTML stylisé avec Bootstrap. Le résultat est indiscernable d'un rendu côté serveur pour les lecteurs, et permet à l'intégration de fonctionner sur GH Pages standard sans workflow CI personnalisé.

Pour les utilisateurs qui construisent eux-mêmes avec Jekyll standard (sans gem `github-pages`), un plugin Ruby optionnel (`_plugins/obsidian_links.rb`) réalise les mêmes transformations côté serveur pour un SEO légèrement meilleur. Consultez la [[zer0-mistakes/pages/_docs/obsidian/syntax-reference|référence de syntaxe]] pour la matrice complète des fonctionnalités.

## Voir aussi

- [[zer0-mistakes/pages/_docs/obsidian/getting-started|Getting Started with the Obsidian Vault]]
- [[zer0-mistakes/pages/_docs/obsidian/syntax-reference|Obsidian Syntax Reference]]
- [[zer0-mistakes/pages/_docs/obsidian/graph|Obsidian Graph View]]
- [[zer0-mistakes/pages/_docs/obsidian/authoring-workflow|Obsidian Authoring Workflow]]
- [[zer0-mistakes/pages/_docs/obsidian/troubleshooting|Obsidian Integration Troubleshooting]]
- [[zer0-mistakes/fr/docs/front-matter|front-matter]]
- [[zer0-mistakes/fr/docs/installation|Installation]]
