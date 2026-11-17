---
created: 2026-07-06
description: The U.S. Securities and Exchange Commission's public corporate-filing
  system, exposing structured XBRL 'company facts' via a JSON API — the raw public-data
  source in the wizard post's transparency pipeline.
entity_type: service
first_mentioned: '[[wiki/sources/wizard-topples-capitalist-dominance]]'
related:
- '[[wiki/concepts/radical-transparency]]'
- '[[wiki/entities/gleif]]'
role: Public financial-data source / API
source_file: sites/zer0-pages/pages/wiki/entities/sec-edgar.md
source_repo: bamr87/zer0-CMS
source_url: https://github.com/bamr87/zer0-CMS/blob/main/sites/zer0-pages/pages/wiki/entities/sec-edgar.md
sources:
- '[[wiki/sources/wizard-topples-capitalist-dominance]]'
status: seed
tags:
- entity
- service
- open-data
- fintech
title: SEC EDGAR
type: entity
updated: 2026-07-06
---

# SEC EDGAR

## Overview

EDGAR (Electronic Data Gathering, Analysis, and Retrieval) is the U.S. SEC's public repository of corporate filings. In [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/wizard-topples-capitalist-dominance|the wizard post]] it is the archetypal input to [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/radical-transparency|the transparency pipeline]] — the "boring 30-line script that pulls a public filing" starts here. The post uses its structured **XBRL company-facts** JSON API at `data.sec.gov`.

## Key Facts

- **Endpoint used:** `https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json`, where the CIK (Central Index Key) is zero-padded to 10 digits. The post's example fetches Apple Inc. (CIK `0000320193`).
- **Access etiquette / gotchas** (from the post's FAQ):
  - EDGAR **requires a descriptive `User-Agent` with a contact email**; omitting it returns **403**.
  - Stay under ~**10 requests/second** — don't hammer the API.
- **Role in the pipeline:** one of three named public data sources (with [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/gleif|GLEIF]] and OpenCorporates); committing the fetched JSON to a public repo is "the first stone of an 'open ledger.'"
- **Reference:** the post links the [SEC EDGAR XBRL API documentation](https://www.sec.gov/edgar/sec-api-documentation).

## Connections

- [[zer0-CMS/sites/zer0-pages/pages/wiki/concepts/radical-transparency|Radical Transparency]] — EDGAR is the pipeline's first node; the full ingest snippet lives on that page.
- [[zer0-CMS/sites/zer0-pages/pages/wiki/entities/gleif|GLEIF]] — a sibling open corporate-data source.

## Sources

- [[zer0-CMS/sites/zer0-pages/pages/wiki/sources/wizard-topples-capitalist-dominance|Wizard Topples Capitalist Dominance Ingeniously]] — "Example 1: A Transparent Financial Ingest" and the EDGAR-403 FAQ.
