---
coverage: listed
schema: '0.1'
source_file: docs/prd/SCHEMA.md
source_repo: bamr87/bamr87
source_url: https://github.com/bamr87/bamr87/blob/main/docs/prd/SCHEMA.md
title: SCHEMA — docs/prd
---

# SCHEMA — docs/prd

> Sub-PRDs: detailed product requirements for one feature area. The root `PRD.md` owns every requirement id (`FRn`/`NFRn`); a sub-PRD expands them and is linked from it and from the feature's `docs:` in `features/features.yml`.

## Structure

| entry | kind | purpose | rules |
| --- | --- | --- | --- |
| `[A-Z]*.md` | pattern | One sub-PRD per feature area (`TOPIC.md`), with a Status line (Draft / proposed / accepted) | |

## Placement

- New sub-PRD → `docs/prd/TOPIC.md`; add its requirement ids to the root `PRD.md` and the feature to `features/features.yml` in the same PR.
