---
coverage: listed
schema: '0.1'
source_file: features/SCHEMA.md
source_repo: bamr87/SCHEMA
source_url: https://github.com/bamr87/SCHEMA/blob/main/features/SCHEMA.md
title: SCHEMA — features
---

# SCHEMA — features

> The feature catalog (schema `features/v1`, fleet verify + governance kits): one stable id per user-facing capability.

## Structure

| entry | kind | purpose | rules |
|---|---|---|---|
| `features.yml` | file | Feature catalog; PRD.md's Feature catalog block is generated from it (`governance_lint.py prd-sync`) | |

## Placement

- New capability → a new entry with the next free `SCHEMA-NNN` id; never renumber.
