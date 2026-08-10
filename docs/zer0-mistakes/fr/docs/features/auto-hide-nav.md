---
categories:
- docs
- features
description: Barre de navigation intelligente qui se masque au défilement vers le
  bas et réapparaît au défilement vers le haut pour une visibilité maximale du contenu
  sur mobile et ordinateur de bureau.
difficulty: beginner
estimated_reading_time: 4 minutes
lang: fr
lastmod: 2026-07-13 00:00:00+00:00
layout: default
machine_translated: true
permalink: /fr/docs/features/auto-hide-nav/
preview: /images/previews/auto-hide-navigation.png
sidebar:
  nav: docs
source_file: auto-hide-nav.md
tags:
- ui
- navigation
- scroll
- mobile
title: Navigation à masquage automatique
translated_from_sha: 1ecda7444935
translation_of: pages/_docs/features/auto-hide-nav.md
translation_source_url: /docs/features/auto-hide-nav/
---
# Navigation à masquage automatique

La barre de navigation supérieure s'efface pendant que vous lisez : elle glisse vers le haut et se masque lorsque vous faites défiler la page vers le **bas**, puis réapparaît dès que vous faites défiler vers le **haut**. Cela permet de récupérer de l'espace vertical — particulièrement précieux sur les petits écrans — sans supprimer l'accès au menu.

## Aperçu

- **Masquage au défilement vers le bas** — la barre de navigation se déplace hors de l'écran dès que vous faites défiler
  au-delà d'un petit seuil, afin que le contenu long occupe toute la fenêtre d'affichage.
- **Affichage au défilement vers le haut** — tout défilement vers le haut ramène immédiatement la barre de navigation.
- **Transitions CSS fluides** — l'affichage/masquage utilise une transformation CSS, et non une modification
  de la mise en page, ce qui garantit une fluidité et évite de recomposer la page.
- **Optimisée pour le mobile** — le comportement est particulièrement utile sur les appareils tactiles où
  l'espace à l'écran est limité.

## Fonctionnement

Le comportement repose sur un petit contrôleur sans dépendances dans [`assets/js/auto-hide-nav.js`](https://github.com/bamr87/zer0-mistakes/blob/main/assets/js/auto-hide-nav.js). Il écoute passivement les événements de défilement, compare la position de défilement actuelle à la précédente et bascule une classe CSS sur la barre de navigation qui pilote la transformation. Comme l'écouteur est passif et que le changement visuel est une transformation, le défilement reste fluide.

## Implémentation

| Fichier | Rôle |
| --- | --- |
| `assets/js/auto-hide-nav.js` | Contrôleur de sens de défilement qui bascule l'état masqué de la barre de navigation. |
| `_includes/navigation/navbar.html` | Le balisage de la barre de navigation ciblé par le contrôleur. |

## Fonctionnalités associées

- [Navigation améliorée de la barre latérale](/docs/features/sidebar-navigation/)
- [Navigation au clavier](/docs/features/keyboard-navigation/)
