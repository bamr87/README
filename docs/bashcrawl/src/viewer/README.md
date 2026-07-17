---
source_file: README.md
title: Bashcrawl Observatory — `src/viewer/`
---
# Bashcrawl Observatory — `src/viewer/`

Self-contained Flask web application for browsing Bashcrawl session logs, screenshots, analytics, feedback reports, the dungeon map, and live sessions.

> **User guide:** [docs/viewer.md](../../docs/viewer.md)  
> **Design reference:** [docs/viewer.md](../../docs/viewer.md)

---

## Quick Start

```bash
# Install dependencies (once)
pip install -r src/viewer/requirements.txt

# Launch (auto-detects game root)
python3 -m src.viewer

# Open in browser
open http://127.0.0.1:5000/
```

## CLI Options

```
python3 -m src.viewer [OPTIONS]

  --port PORT       Port to listen on       (default: 5000)
  --host HOST       Host to bind to         (default: 127.0.0.1)
  --game-root PATH  Bashcrawl repo root     (default: auto-detect)
  --debug           Enable Flask debug mode
```

## Structure

```
src/viewer/
├── __init__.py
├── __main__.py          # Entry point (python3 -m src.viewer)
├── app.py               # Flask app factory
├── config.py            # Path config (game_root → logs/sessions, screenshots, feedback)
│
├── loaders/             # Data ingest
│   ├── sessions.py      # JSONL → Session / SessionStore
│   ├── screenshots.py   # Screenshot dirs → ScreenshotSession / ScreenshotStore
│   └── feedback.py      # Markdown reports → FeedbackReport / FeedbackStore
│
├── analytics/
│   └── engine.py        # Cross-session aggregation → AnalyticsSummary
│
├── routes/
│   ├── pages.py         # Jinja2 HTML page routes
│   └── api.py           # JSON API endpoints + SSE live stream
│
├── templates/           # Jinja2 templates (base.html + per-section)
│   ├── base.html
│   ├── index.html
│   ├── sessions/
│   ├── screenshots/
│   ├── analytics/
│   ├── feedback/
│   ├── map/
│   └── live/
│
├── static/              # CSS, JS, images (no build step)
│   ├── css/
│   ├── js/
│   └── img/
│
└── requirements.txt     # flask, markdown, watchdog
```

## Pages

| URL | Description |
|-----|-------------|
| `/` | Dashboard overview |
| `/sessions` | Paginated session list with filters |
| `/sessions/<sid>` | Event timeline, room path, inventory, HP graph |
| `/screenshots` | Screenshot session index |
| `/screenshots/<dir>` | Filmstrip + main viewer + metadata |
| `/analytics` | Cross-session charts (Chart.js) |
| `/feedback` | Markdown feedback report browser |
| `/map` | Interactive SVG dungeon map |
| `/live` | Real-time SSE event feed |

## API Endpoints

All under `/api/`. Full reference: [docs/viewer.md — JSON API](../../docs/viewer.md#json-api).

```
GET /api/sessions              # list (mode, has_screenshots, sort, page, …)
GET /api/sessions/stats        # quick stats
GET /api/sessions/<sid>        # full detail + events
GET /api/screenshots           # list screenshot sessions
GET /api/screenshots/<dir>     # session manifest
GET /api/analytics             # aggregate summary
GET /api/analytics/rooms       # room heatmap data
GET /api/analytics/timeline    # sessions-per-day
GET /api/analytics/funnel      # completion funnel
GET /api/feedback              # list reports
GET /api/feedback/<sid>        # report HTML + metrics
GET /api/live/stream           # SSE event stream
GET /api/live/active           # sessions active in last 60s
```

## Data Flow

```
logs/sessions/*.jsonl   →  SessionStore     →  /sessions, /api/sessions
logs/screenshots/*/     →  ScreenshotStore  →  /screenshots, SVG serving
logs/feedback/*.md      →  FeedbackStore    →  /feedback
SessionStore            →  AnalyticsEngine  →  /analytics, /map
                                            →  SSE stream → /live
```

Sessions are loaded on startup and cached in memory. File modification times are polled; new `.jsonl` files are appended automatically. Analytics are cached for 60 seconds.

## Dependencies

| Package | Min version | Purpose |
|---------|-------------|---------|
| `flask` | 3.0 | Web framework |
| `markdown` | 3.5 | Feedback Markdown → HTML |
| `watchdog` | 4.0 | Filesystem events for live monitor |
| Chart.js | 4.x (CDN) | Analytics charts |
| D3.js | 7.x (CDN) | Dungeon map (optional) |

## Testing

Viewer tests live in `test/unit/test_viewer/` and `test/integration/test_viewer/`.

```bash
# From repo root
cd test && pytest unit/test_viewer/
cd test && pytest integration/test_viewer/
```
