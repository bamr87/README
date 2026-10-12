---
created: 2026-01-17 00:00:00+00:00
date: 2026-01-24 14:27:39+00:00
description: Quick reference summary of broken links across IT-Journey
lastmod: 2026-01-17 00:00:00+00:00
priority: HIGH
source_file: LINK_ISSUES.md
status: PENDING_SCAN
title: Link Issues Summary
---
# Link Issues Summary

> Quick reference for link health status. See [TODO/links/](./links/) for detailed tracking.

---

## Current Status

| Metric | Value |
|--------|-------|
| **Last Scan** | Never |
| **Total Links** | - |
| **Broken Links** | - |
| **Success Rate** | - |

---

## Quick Actions

Run a link scan to populate this summary:

```bash
python3 scripts/validation/link-checker.py --scope website
```

Or trigger via GitHub Actions:
1. Go to [Actions > Link Health Guardian](../.github/workflows/link-checker.yml)
2. Click "Run workflow"
3. Select scope and run

---

## Issue Categories

| Category | Count | Priority | Action |
|----------|-------|----------|--------|
| Internal 404s | - | Critical | Fix navigation |
| External Broken | - | High | Update references |
| SSL Errors | - | Medium | Review certificates |
| Timeouts | - | Medium | Check slow sites |
| Rate Limited | - | Low | Usually false positives |

---

## Top 10 Issues

_Run a scan to see prioritized issues._

---

## Detailed Reports

- **[Quick Actions](./links/QUICK_ACTIONS.md)** - Prioritized fix tasks
- **[Tracking](./links/TRACKING.md)** - Progress over time
- **[Data](./links/data/link-report.json)** - Machine-readable results

---

## Fix Workflow

1. **Scan**: Run link checker
2. **Review**: Check QUICK_ACTIONS.md for prioritized issues
3. **Fix**: Address critical internal links first
4. **Verify**: Re-run scan to confirm fixes
5. **Track**: Update TRACKING.md with progress

---

**Project**: [Link Health Management](./links/README.md)  
**Last Updated**: 2026-01-17
