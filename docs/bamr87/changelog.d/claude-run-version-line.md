---
source_file: changelog.d/claude-run-version-line.md
source_repo: bamr87/bamr87
source_url: https://github.com/bamr87/bamr87/blob/main/changelog.d/claude-run-version-line.md
title: Claude Run Version Line
---
### Fixed

- `claude-run`: after the install, the step always prints `claude-run: Claude Code <version> on Node <version>`, and warns, naming `$RUNNER_TEMP/npm-install.log`, when an install that exited 0 left no `claude` on PATH, so an install that "succeeded" with the wrong release is visible in the run log (#499).
