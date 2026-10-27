---
author: Barodybroject Team <team@example.com>
breaking: false
date: '2026-10-11'
impact: low
related_issues:
- '#42'
related_prs: []
reviewers: []
source_file: 2026-10-11-page-feedback-widget.md
title: 'Feature: "Improve this page" on every route'
type: feature
version: 0.6.0
---
# Feature: "Improve this page" on every route

> **Summary**: Users can now file a feature request, or any other feedback, from inside the app. An
> **Improve this page** button opens a dialog and then opens a prefilled GitHub issue in
> `bamr87/barodybroject`. The issue carries the route, the environment and recently captured
> console errors, and is labelled `page-feedback` plus the type's label.

## Why

The app's only route to GitHub was a footer link to a bare template chooser. That link rendered only when `GITHUB_ISSUE_REPO` was set, and nothing set it. The bamr87 fleet already ships a zero-dependency widget with a React adapter for exactly this, so this change adopts it rather than building one.

## What changed

| File | Change |
|---|---|
| `src/assets/js/fleet-feedback.js`, `src/assets/js/fleet-feedback-capture.js` | **New**: byte-identical copies of the hub kit's `fleet-feedback.js` and `capture.js` (kit v0.2.0). Served by Django at `/static/js/…`. |
| `src/parodynews/templates/spa/index.html` | Loads the capture buffer first in `<head>`, so errors thrown during load are captured. |
| `src/frontend/src/components/FeedbackButton.tsx` | **New**: the kit's React adapter, unchanged. |
| `src/frontend/src/components/Layout.tsx` | Mounts `<FeedbackButton>` once when `site.github_issue_repo` is set (`assignee=""`, `route` = current path). The footer link now opens `?template=page_feedback.yml`. |
| `src/barodybroject/settings/base.py` | `GITHUB_ISSUE_REPO` defaults to `bamr87/barodybroject`. The env var or secret still overrides it. |
| `.github/ISSUE_TEMPLATE/page_feedback.yml` | **New**: the kit's no-JS issue form. |

Out of scope: `mode="proxy"`, which needs a server-side token, and the server-side error reporter (`GITHUB_ISSUE_REPORTER`), which is unchanged and still has no default repository.

## Testing

- `src/frontend/src/components/Layout.test.tsx`: exactly one `fleet-feedback` element with
`repo="bamr87/barodybroject"`, none when the repo is empty, the vendored script loaded from `/static/js/`, and the footer link pointing at `page_feedback.yml`. Three of its four cases fail on the previous `Layout.tsx`. The empty-repo case holds both before and after.
- `src/parodynews/tests/test_templates.py`: the capture script is in the shell's `<head>`, and `GITHUB_ISSUE_REPO` defaults to this repository.
- Browser check against a running app (Django + built bundle, Playwright Chromium, light and dark themes).
The dialog opens. With **Feature request** selected and a `console.error("probe")` fired first, submitting opens `https://github.com/bamr87/barodybroject/issues/new?…` with `labels=page-feedback,feature`, the Page context / Environment / Console & error logs sections (with `probe` in the logs), and the body ending in `<!-- fleet-feedback v1 type=feature -->`.

| Light | Dark |
|---|---|
| ![Feedback dialog, light theme](2026-10-11-page-feedback-widget/feedback-dialog-light.png) | ![Feedback dialog, dark theme](2026-10-11-page-feedback-widget/feedback-dialog-dark.png) |

## Upgrading the kit

Don't edit the vendored files here. Change the kit in bamr87/bamr87 `templates/feedback/`, then re-copy both files and update the version recorded in `src/assets/README.md`.

## Related

- Issue [#42](https://github.com/bamr87/barodybroject/issues/42)
- [`src/frontend/README.md`](../../../src/frontend/README.md): "Feedback widget"
