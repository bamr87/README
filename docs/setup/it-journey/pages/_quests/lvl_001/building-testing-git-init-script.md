---
author: IT-Journey Team
categories:
- Quests
- Development
category: setup
comments: true
date: 2025-11-13 10:00:00+00:00
description: Hands-on quest to build, extend, and test `git_init.sh` — an interactive
  and headless repo initializer with programmatic scaffolding.
difficulty: 🟢 Easy
estimated_time: 45-75 minutes
excerpt: Add features, scaffolding, and tests to `git_init.sh` so it is safe and testable
  in both interactive and headless modes.
last_updated: null
lastmod: 2025-11-13 10:30:00+00:00
layout: journals
permalink: /quests/level-0001-git-init-testing/
source_file: building-testing-git-init-script.md
sub-title: 'Level 0001 (1) Quest: Shell Script Unit & Integration Testing'
summary: You have a powerful repository initializer — scripts/gitinit.sh — that supports
  interactive prompts and programmatic headless invocations. This quest will guide
  you through validating the script's beh...
tags:
- python
- testing
- setup
title: install bats-core
---


## The Challenge: Safe automation without surprises

You have a powerful repository initializer — `scripts/git_init.sh` — that supports interactive prompts and programmatic `--headless` invocations. This quest will guide you through validating the script's behavior, adding tests, and ensuring it behaves well in CI.

Why this matters:
- Scripts are often used in automation and CI; they must behave predictably and be testable.
- Headless behavior must be non-destructive and reliable; interactive commands can't be used in CI loops.
- Creating files via programmatic scaffolding must be done with a clear contract and test coverage.

## Objectives

- Verify script syntax with `bash -n` and lint with `shellcheck`.
- Add Bats tests to confirm `--headless` operations do not push.
- Ensure easy to run `--no-push` for local tests.
- Add CI step instructions for running tests.

## Tests and Tools

We suggest two layers of tests:

1. Unit-ish validations using local filesystem checks via `bats`.
2. Linting static validation with `shellcheck`.

### Example Bats Test (save in `tests/bats/test_headless.bats`)

```bash
#!/usr/bin/env bats

setup() {
  TMPDIR=$(mktemp -d)
  cd "$TMPDIR"
}

teardown() {
  rm -rf "$TMPDIR"
}

@test "headless mode creates a repo and does not push" {
  run bash /path/to/scripts/git_init.sh --headless -n sample-test --no-push
  [ "$status" -eq 0 ]
  [ -d "$HOME/github/sample-test/.git" ]
}
```

### ShellCheck linting

Install with `brew install shellcheck` on macOS and run `shellcheck scripts/git_init.sh`.

### Syntax check

Use `bash -n scripts/git_init.sh` to detect syntax issues early.

## Try it locally

1. Syntax check

```bash
bash -n scripts/git_init.sh
```

2. Run headless mode locally without pushing

```bash
bash scripts/git_init.sh --headless -n test-quest-sample --no-push --gitignore python,macos --scaffold python
```

3. Run Bats tests

```bash
# install bats-core
brew install bats-core
bats tests/bats
```

4. Run ShellCheck

```bash
brew install shellcheck
shellcheck scripts/git_init.sh
```

## Acceptance Criteria

- `bash -n` returns no error
- `shellcheck` returns no major errors
- `bats tests/bats/test_headless.bats` returns pass for headless creation
- `--gitignore` creates a `.gitignore` file when requested
- `--scaffold python` creates `src` and `tests`
 - `--dry-run` prints operations and does not create files or push

## Next Steps (Optional)

- Try `--dry-run` to preview changes without applying them.
- Create a GitHub Actions job that installs bats and shellcheck and runs tests on PRs.

---

Complete this quest to prove you can safely add features to a script and make it testable in automation.

Good luck! 🛠️
