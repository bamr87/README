---
categories:
- docs
- analytics
description: Options d'intégration d'analytics pour le thème Zer0-Mistakes, incluant
  PostHog, Google Analytics et Tag Manager.
difficulty: beginner
estimated_reading_time: 5 minutes
lang: fr
lastmod: 2026-04-18 19:30:03+00:00
layout: default
machine_translated: true
permalink: /fr/docs/analytics/
preview: /images/previews/analytics.png
sidebar:
  nav: docs
source_file: fr/docs/analytics/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/fr/docs/analytics/index.md
tags:
- analytics
- tracking
- privacy
title: Analytics
translated_from_sha: 3e75b181bb84
translation_of: pages/_docs/analytics/index.md
translation_source_url: /docs/analytics/
---

# Analytics

Le thème Zer0-Mistakes prend en charge plusieurs plateformes d'analytics avec des configurations privilégiant la confidentialité.

## Intégrations disponibles

| Plateforme | Priorité confidentialité | Offre gratuite |
|----------|--------------|-----------|
| [[zer0-mistakes/pages/_docs/features/posthog-analytics\|PostHog]] | Oui (auto-hébergeable) | 1M d'événements/mois |
| [[zer0-mistakes/pages/_docs/analytics/google-analytics\|Google Analytics]] | Limitée | 10M de hits/mois |
| [[zer0-mistakes/pages/_docs/analytics/google-tag-manager\|Google Tag Manager]] | Variable | Illimité |

## Comparaison rapide

### PostHog (recommandé)

- **Confidentialité** : conforme RGPD, auto-hébergeable
- **Fonctionnalités** : analytics, enregistrement de sessions, feature flags
- **Idéal pour** : les sites soucieux de la confidentialité

### Google Analytics

- **Confidentialité** : données envoyées à Google
- **Fonctionnalités** : analytics complètes
- **Idéal pour** : les analyses marketing

### Google Tag Manager

- **Confidentialité** : dépend des balises utilisées
- **Fonctionnalités** : gestion centralisée des balises
- **Idéal pour** : les équipes marketing

## Aperçu de la configuration

### PostHog

```yaml
# _config.yml
posthog:
  enabled: true
  api_key: 'phc_YOUR_KEY'
  api_host: 'https://us.i.posthog.com'
```

### Google Analytics

```yaml
# _config.yml
google_analytics:
  tracking_id: 'G-XXXXXXXXXX'
```

### Google Tag Manager

```yaml
# _config.yml
google_tag_manager:
  container_id: 'GTM-XXXXXXX'
```

## Chargement selon l'environnement

Toutes les analytics ne se chargent qu'en production :

```liquid
{% raw %}{% if jekyll.environment == 'production' %}
  {% include analytics/posthog.html %}
{% endif %}{% endraw %}
```

## Conformité en matière de confidentialité

Consultez [[zer0-mistakes/pages/_docs/features/cookie-consent|Cookie Consent]] pour une gestion du consentement conforme au RGPD/CCPA.

## Ressources associées

- [[zer0-mistakes/pages/_docs/features/posthog-analytics|PostHog Analytics]]
- [[zer0-mistakes/pages/_docs/analytics/google-analytics|Google Analytics]]
- [[zer0-mistakes/pages/_docs/analytics/google-tag-manager|Google Tag Manager]]
- [[zer0-mistakes/pages/_docs/features/cookie-consent|Cookie Consent]]
- [[zer0-mistakes/pages/privacy-policy|Politique de confidentialité]]

## Voir aussi

- [[zer0-mistakes/features/README|Features]]
- [[zer0-mistakes/docs/ui/customization|Customization]]
- [[SEO]]
- [[zer0-mistakes/pages/_docs/deployment/index|Deployment]]
