---
source_file: apps/aieo/docs/INTEGRATIONS.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/apps/aieo/docs/INTEGRATIONS.md
title: Integrations
---
# Integrations

Integration modules live in `backend/app/integrations/`.

## Sources

- Google Analytics (`google_analytics.py`)
- Google Search Console (`google_search_console.py`)
- DataForSEO (`dataforseo.py`)

Each integration is optional. If credentials are missing, the service returns mock/cache output so workflows continue without hard failure.

## API endpoints

- `GET /api/v1/aieo/data/ga/top-pages`
- `GET /api/v1/aieo/data/gsc/queries`
- `POST /api/v1/aieo/data/dfs/serp`

## Environment variables

- `GA4_PROPERTY_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GSC_SITE_URL`
- `DATAFORSEO_LOGIN`
- `DATAFORSEO_PASSWORD`
