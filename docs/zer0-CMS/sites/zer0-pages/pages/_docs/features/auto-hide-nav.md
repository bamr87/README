---
aliases:
- /docs/features/auto-hide-nav/
categories:
- docs
- features
description: Smart navigation bar that hides on scroll down and reappears on scroll
  up for maximum content visibility on mobile and desktop.
difficulty: beginner
estimated_reading_time: 4 minutes
lastmod: 2026-06-30 00:00:00+00:00
layout: default
permalink: /docs/features/auto-hide-nav/
sidebar:
  nav: docs
source_file: sites/zer0-pages/pages/_docs/features/auto-hide-nav.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/_docs/features/auto-hide-nav.md
tags:
- ui
- navigation
- scroll
- mobile
title: Auto-hide Navigation
type: doc
---

# Auto-hide Navigation

The top navigation bar gets out of the way while you read: it slides up and hides as you scroll **down** the page, then reappears the moment you scroll **up**. This reclaims vertical space — especially valuable on small screens — without removing access to the menu.

## Overview

- **Hide on scroll down** — the navbar translates off-screen once you scroll past a small threshold, so long-form content gets the full viewport.
- **Show on scroll up** — any upward scroll brings the navbar straight back.
- **Smooth CSS transitions** — the show/hide uses a CSS transform, not a layout change, so it stays smooth and doesn't reflow the page.
- **Mobile-optimised** — the behaviour is most useful on touch devices where screen real estate is scarce.

## How it works

The behaviour is a small, dependency-free controller in [`assets/js/auto-hide-nav.js`](https://github.com/bamr87/zer0-mistakes/blob/main/assets/js/auto-hide-nav.js). It listens to scroll events passively, compares the current scroll position to the previous one, and toggles a CSS class on the navbar that drives the transform. Because the listener is passive and the visual change is a transform, scrolling stays jank-free.

## Implementation

| File | Role |
| --- | --- |
| `assets/js/auto-hide-nav.js` | Scroll-direction controller that toggles the navbar's hidden state. |
| `_includes/navigation/navbar.html` | The navbar markup the controller targets. |

## Related features

- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/sidebar-navigation|Enhanced Sidebar Navigation]]
- [[zer0-CMS/sites/zer0-pages/pages/_docs/features/keyboard-navigation|Keyboard Navigation]]
