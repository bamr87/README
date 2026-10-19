---
source_file: README.md
title: assets Directory
---

# assets Directory

## Purpose
This directory contains static assets used by the barodybroject Django application, including client-side JavaScript files and image resources. These assets provide frontend functionality and visual components for the parody news generator's user interface.

## Contents
- `images/`: Subdirectory containing screenshot images and visual assets for documentation and UI
- `js/`: Scripts served by Django at `/static/js/…`, independent of the Vite build:
  - `fleet-feedback.js`: the "Improve this page" widget (`<fleet-feedback>`), loaded by
    `src/frontend/src/components/FeedbackButton.tsx`
  - `fleet-feedback-capture.js`: its console/error capture buffer, loaded first in
    `<head>` of `parodynews/templates/spa/index.html`

Both are **vendored byte-identical** from the [bamr87/bamr87](https://github.com/bamr87/bamr87) feedback kit (`templates/feedback/fleet-feedback.js` and `capture.js`), **kit version 0.2.0**. Don't edit them here: change the kit upstream and re-vendor, or the hub's drift check reports this copy as diverged.

## Usage
Static assets are served through Django's static file system:

```python
# In Django templates
{% load static %}
<script src="{% static 'js/content_detail.js' %}"></script>
<img src="{% static 'images/home.png' %}" alt="Application screenshot">
```

```bash
# Collect static files for production deployment
python manage.py collectstatic
```

The assets include:
- Interactive JavaScript for dynamic form handling
- UI enhancement scripts (halfmoon.js)
- Content management functionality
- Screenshot images for documentation
- Visual assets for the application interface

## Container Configuration
Static assets are handled through Django's static file configuration:
- Collected during build process with `collectstatic`
- Served via web server (nginx/apache) in production
- Accessible through `STATIC_URL` configuration
- Mounted as volumes in development containers for live editing

## Related Paths
- Incoming: Referenced by Django templates and served through static file URLs
- Outgoing: Delivered to web browsers as client-side assets
