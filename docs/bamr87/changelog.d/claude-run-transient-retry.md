---
source_file: changelog.d/claude-run-transient-retry.md
source_repo: bamr87/bamr87
source_url: https://github.com/bamr87/bamr87/blob/main/changelog.d/claude-run-transient-retry.md
title: Claude Run Transient Retry
---
### Changed

- `claude-run` (and so `ai-lane.yml`): a transient API failure (529, 503, 502, `overloaded`) is retried inside the run, on the same credential and only when the failed call's payload shows that nothing was billed (zero cost, zero tokens, at most one turn). It used to fail the step on the first one. Two optional step environment variables tune it: `AI_TRANSIENT_RETRIES` (default `2`, at most `5`, `0` turns it off) and `AI_TRANSIENT_BACKOFF` (default `30 90` seconds). A call that billed anything is never re-run, and the budget, turn-cap, auth and quota paths are unchanged (`ai-runner` kit 0.4.1).
