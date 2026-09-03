---
admin_section: Component Showcase
excerpt: Galerie en direct des motifs de composants réutilisables Bootstrap 5 rendus
  par l'include component-showcase.
icon: material/view-grid
source_icon: bi-grid-3x3-gap
lang: fr
lastmod: 2026-06-26 00:00:00+00:00
layout: admin
machine_translated: true
permalink: /fr/about/settings/components/
preview: /images/previews/theme-preview.png
source_file: components.md
title: Components
translated_from_sha: a775b0ade22f
translation_of: pages/_about/settings/components.md
translation_source_url: /about/settings/components/
---
<p class="text-body-secondary">
Rendu en direct de <code>_includes/components/component-showcase.html</code> — la galerie de motifs réutilisables Bootstrap 5.3. Le fil d'Ariane et les entrées list-group présents ici ne sont que <strong>des liens de démonstration</strong> : ils sont volontairement inertes (<code>href="#"</code>) afin que cet include n'injecte jamais de chemins absolus au site qui provoqueraient des erreurs 404 chez les consommateurs de remote-theme (issue #219).
</p>

{% include components/component-showcase.html %}
