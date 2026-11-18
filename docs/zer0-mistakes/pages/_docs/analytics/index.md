---
categories:
- docs
- analytics
description: Analytics integration options for the Zer0-Mistakes theme including PostHog,
  Google Analytics, and Tag Manager.
difficulty: beginner
estimated_reading_time: 5 minutes
lastmod: 2026-04-18 19:30:03+00:00
layout: default
permalink: /docs/analytics/
preview: /images/previews/analytics.png
sidebar:
  nav: docs
source_file: pages/_docs/analytics/index.md
source_repo: bamr87/zer0-mistakes
source_url: https://github.com/bamr87/zer0-mistakes/blob/main/pages/_docs/analytics/index.md
tags:
- analytics
- tracking
- privacy
title: Analytics
---

# Analytics

The Zer0-Mistakes theme supports multiple analytics platforms with privacy-first configurations.

## Available Integrations

| Platform | Privacy Focus | Free Tier |
|----------|--------------|-----------|
| [[zer0-mistakes/pages/_docs/features/posthog-analytics\|PostHog]] | Yes (self-hostable) | 1M events/mo |
| [[zer0-mistakes/pages/_docs/analytics/google-analytics\|Google Analytics]] | Limited | 10M hits/mo |
| [[zer0-mistakes/pages/_docs/analytics/google-tag-manager\|Google Tag Manager]] | Varies | Unlimited |

## Quick Comparison

### PostHog (Recommended)

- **Privacy**: GDPR compliant, self-hostable
- **Features**: Analytics, session recording, feature flags
- **Best for**: Privacy-conscious sites

### Google Analytics

- **Privacy**: Data sent to Google
- **Features**: Comprehensive analytics
- **Best for**: Marketing insights

### Google Tag Manager

- **Privacy**: Depends on tags used
- **Features**: Centralized tag management
- **Best for**: Marketing teams

## Configuration Overview

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

## Environment-Aware Loading

All analytics only load in production:

```liquid
{% raw %}{% if jekyll.environment == 'production' %}
  {% include analytics/posthog.html %}
{% endif %}{% endraw %}
```

## Privacy Compliance

See [[zer0-mistakes/pages/_docs/features/cookie-consent|Cookie Consent]] for GDPR/CCPA compliant consent management.

## Related

- [[zer0-mistakes/pages/_docs/features/posthog-analytics|PostHog Analytics]]
- [[zer0-mistakes/pages/_docs/analytics/google-analytics|Google Analytics]]
- [[zer0-mistakes/pages/_docs/analytics/google-tag-manager|Google Tag Manager]]
- [[zer0-mistakes/pages/_docs/features/cookie-consent|Cookie Consent]]
- [[zer0-mistakes/pages/privacy-policy|Privacy Policy]]

## See also

- [[zer0-mistakes/features/README|Features]]
- [[zer0-mistakes/docs/ui/customization|Customization]]
- [[SEO]]
- [[zer0-mistakes/pages/_docs/deployment/index|Deployment]]
