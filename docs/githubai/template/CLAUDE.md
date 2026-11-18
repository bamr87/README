---
source_file: template/CLAUDE.md
source_repo: bamr87/githubai
source_url: https://github.com/bamr87/githubai/blob/main/template/CLAUDE.md
title: CLAUDE.md
---
# CLAUDE.md

Installed by GitHubAI (github.com/bamr87/githubai). This file is the context Claude Code loads for interactive `@claude` sessions and local work in this repo. Replace the placeholders and keep it current — stale agent context produces stale automation.

## What this repository is

## How it is developed

- Build:
- Test:
- Lint:

## Conventions that matter here

- Commits follow Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`...).
- Every change goes through a PR; CI must be green before merge.
- <!---->

## GitHubAI automation in this repo

This repo runs the GitHubAI framework: Claude triages new issues, implements issues labeled `claude:implement`, reviews PRs, evaluates `claude:auto-merge` candidates, and runs weekly maintenance. Configuration lives in `.github/githubai.yml`; label `claude:skip` opts any issue or PR out. Mention `@claude` in any issue or PR comment for interactive help.
