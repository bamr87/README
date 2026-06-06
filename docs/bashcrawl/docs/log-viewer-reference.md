---
source_file: log-viewer-reference.md
title: Log & Screenshot Viewer — Design Reference
---
# Log & Screenshot Viewer — Design Reference

> **Status:** Implemented. This document is the original design plan and serves
> as an architectural reference.
>
> **User guide:** [docs/viewer.md](viewer.md)  
> **Source code:** [`src/viewer/`](../src/viewer/)  
> **Launch:** `python3 -m src.viewer` (see [viewer.md](viewer.md) for all options)
>
> **Stack:** Python 3.10+ / Flask / Jinja2 / vanilla JS + CSS (no build toolchain)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Data Layer](#2-data-layer)
3. [Feature Specifications](#3-feature-specifications)
   - [F1: Session Log Browser](#f1-session-log-browser)
   - [F2: Screenshot Gallery](#f2-screenshot-gallery)
   - [F3: Cross-Session Analytics Dashboard](#f3-cross-session-analytics-dashboard)
   - [F4: Feedback Report Viewer](#f4-feedback-report-viewer)
   - [F5: Dungeon Map Visualization](#f5-dungeon-map-visualization)
   - [F6: Real-Time Session Monitor](#f6-real-time-session-monitor)
4. [UI / Layout](#4-ui--layout)
5. [File Structure](#5-file-structure)
6. [Implementation Phases](#6-implementation-phases)
7. [API Endpoints](#7-api-endpoints)
8. [Dependencies](#8-dependencies)
9. [Testing Strategy](#9-testing-strategy)
10. [Open Questions](#10-open-questions)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (vanilla JS + CSS)                                 │
│  ┌─────────┐ ┌────────────┐ ┌───────────┐ ┌─────────────┐  │
│  │ Session  │ │ Screenshot │ │ Analytics │ │  Live       │  │
│  │ Browser  │ │ Gallery    │ │ Dashboard │ │  Monitor    │  │
│  └────┬─────┘ └─────┬──────┘ └─────┬─────┘ └──────┬──────┘  │
│       │             │              │               │         │
│       └─────────────┴──────────────┴───────────────┘         │
│                         fetch() / SSE                        │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP
┌────────────────────────┴────────────────────────────────────┐
│  Flask App  (src/viewer/)                                    │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐  │
│  │ routes/  │  │ loaders/ │  │ analytics/│  │ watchers/  │  │
│  │ pages &  │  │ JSONL &  │  │ aggregate │  │ filesystem │  │
│  │ API      │  │ manifest │  │ compute   │  │ events     │  │
│  └──────────┘  └──────────┘  └───────────┘  └────────────┘  │
│                                                              │
│  Jinja2 Templates  ←→  Static Assets (CSS/JS)               │
└────────────────────────┬────────────────────────────────────┘
                         │ filesystem reads
┌────────────────────────┴────────────────────────────────────┐
│  logs/                                                       │
│  ├── sessions/*.jsonl      (244+ session files, ~2K events)  │
│  ├── screenshots/*/        (253+ dirs, SVGs + manifest.json) │
│  └── feedback/*.md         (Markdown reports)                │
└─────────────────────────────────────────────────────────────┘
```

**Key design decisions:**

- **Read-only.** The viewer never modifies log files. Pure read + watch.
- **No database.** JSONL files are parsed on-demand and cached in memory. At
  current scale (~244 sessions, 2K total events, 61 MB logs) this fits
  comfortably in a single Python process.
- **No JS build step.** Vanilla JS modules (`<script type="module">`), CSS
  custom properties for theming. Chart.js loaded via CDN for analytics charts.
- **Fantasy theme.** The UI uses the same dungeon/adventure aesthetic as the
  game — parchment textures, fantasy fonts, dungeon map iconography.

---

## 2. Data Layer

### 2.1 Session Loader (`loaders/sessions.py`)

Parses all `logs/sessions/*.jsonl` files into structured Python objects.

```python
@dataclass
class LogEvent:
    ts: datetime
    sid: str
    event: str
    extra: dict[str, Any]

@dataclass
class Session:
    sid: str
    file_path: Path
    date: date
    mode: str              # "interactive", "integration_test", "ai_test", "launcher"
    events: list[LogEvent]
    start_time: datetime | None
    end_time: datetime | None
    duration_sec: int | None
    rooms_visited: list[str]
    encounters: list[dict]
    deaths: list[dict]
    items_collected: list[str]
    screenshots: list[dict]
    is_test: bool          # T-prefixed SID
    shell: str | None
    os_name: str | None

class SessionStore:
    """In-memory cache of all parsed sessions."""
    sessions: dict[str, Session]
    
    def load_all() -> None
    def get(sid: str) -> Session | None
    def list(
        date_from: date | None,
        date_to: date | None,
        mode: str | None,
        has_screenshots: bool | None,
        min_events: int | None,
        sort_by: str = "date",
        order: str = "desc",
    ) -> list[Session]
    def refresh() -> None      # Re-scan for new files
```

**Caching strategy:** Full load on startup (< 1 second for 244 files). A
background `watchdog` or polling loop detects new `.jsonl` files and appends
them. Individual session objects are cached; the JSONL files are only re-read
when the file mtime changes.

### 2.2 Screenshot Loader (`loaders/screenshots.py`)

```python
@dataclass
class Screenshot:
    name: str
    path: Path              # Absolute path to SVG
    trigger: str            # "agent_auto", "explicit", "milestone"
    command: str | None
    room: str | None
    ts: datetime | None
    size_bytes: int

@dataclass
class ScreenshotSession:
    dir_name: str           # e.g. "2026-02-21_095855_full_critical_path"
    dir_path: Path
    test_name: str          # Extracted from dir_name
    timestamp: datetime     # Extracted from dir_name
    total_screenshots: int
    total_size_bytes: int
    screenshots: list[Screenshot]
    manifest_path: Path | None
    linked_session_sid: str | None  # Cross-referenced from session events

class ScreenshotStore:
    sessions: dict[str, ScreenshotSession]
    
    def load_all() -> None
    def get(dir_name: str) -> ScreenshotSession | None
    def list(test_name: str | None, date: date | None) -> list[ScreenshotSession]
    def find_by_session_sid(sid: str) -> list[ScreenshotSession]
```

**Cross-referencing:** When a JSONL session contains `screenshot` events, the
`screenshot_path` field links to files inside a screenshot directory. The loader
builds a reverse index: `session SID → screenshot directory names`.

### 2.3 Feedback Loader (`loaders/feedback.py`)

```python
@dataclass
class FeedbackReport:
    file_path: Path
    session_sid: str        # Extracted from filename
    date: date
    content_md: str         # Raw Markdown
    content_html: str       # Rendered via markdown library
    metrics: dict           # Parsed from Markdown tables (rooms, encounters, etc.)

class FeedbackStore:
    reports: dict[str, FeedbackReport]
    
    def load_all() -> None
    def get(sid: str) -> FeedbackReport | None
    def list() -> list[FeedbackReport]
```

### 2.4 Analytics Engine (`analytics/engine.py`)

Computes aggregate statistics across all sessions (mirrors `lib/analyze.sh` but
richer).

```python
@dataclass
class AnalyticsSummary:
    total_sessions: int
    total_play_time_minutes: float
    total_events: int
    sessions_by_mode: dict[str, int]
    sessions_by_date: dict[str, int]       # For timeline chart
    
    # Room analytics
    top_rooms: list[tuple[str, int]]
    room_visit_heatmap: dict[str, int]
    
    # Encounter analytics
    encounter_outcomes: dict[str, dict[str, int]]  # type → outcome → count
    items_collected: dict[str, int]
    
    # Death analytics
    death_causes: dict[str, int]
    death_rate: float                      # deaths / sessions
    
    # Duration analytics
    duration_min: int
    duration_max: int
    duration_avg: float
    duration_histogram: list[tuple[str, int]]  # bucket → count
    
    # Progression analytics
    completion_rate: float                 # Sessions reaching chamber
    avg_rooms_per_session: float
    stuck_points: list[dict]               # Rooms with high revisit + help counts

class AnalyticsEngine:
    def compute(sessions: list[Session]) -> AnalyticsSummary
    def compute_filtered(
        date_from: date | None,
        date_to: date | None,
        mode: str | None,
    ) -> AnalyticsSummary
```

---

## 3. Feature Specifications

### F1: Session Log Browser

**Route:** `/sessions` (list) and `/sessions/<sid>` (detail)

#### List View (`/sessions`)

| Element | Description |
|---------|-------------|
| **Filter bar** | Date range picker, mode dropdown (all/interactive/test/launcher), checkbox "has screenshots", min events slider |
| **Sort controls** | By date, duration, event count, room count |
| **Session cards** | Each card shows: SID, date/time, mode badge, duration, room count, encounter count, death count, screenshot count, item list |
| **Pagination** | 25 per page with infinite scroll or page buttons |
| **Quick stats** | Top banner: total sessions, avg duration, total events |

#### Detail View (`/sessions/<sid>`)

| Element | Description |
|---------|-------------|
| **Header** | SID, date, mode, shell, OS, duration |
| **Event timeline** | Vertical timeline with colored event nodes. Click to expand full JSON. Color-coded: blue=room_enter, green=encounter, red=death, yellow=help, purple=screenshot, gray=other |
| **Room path** | Horizontal breadcrumb showing rooms visited in order |
| **Inventory tracker** | Running tally of items at each event |
| **HP graph** | Mini sparkline showing HP changes over time |
| **Screenshots panel** | If session has linked screenshots, show thumbnail strip. Click to open in gallery |
| **Raw JSONL** | Collapsible raw log viewer with syntax highlighting |
| **Feedback link** | If a feedback report exists for this SID, link to it |

### F2: Screenshot Gallery

**Route:** `/screenshots` (index) and `/screenshots/<dir_name>` (session gallery)

#### Index View (`/screenshots`)

| Element | Description |
|---------|-------------|
| **Grid of sessions** | Card per screenshot session showing: test name, date, screenshot count, total size, thumbnail of first screenshot |
| **Filters** | By test name (searchable), date range |
| **Sort** | By date, screenshot count, total size |
| **Grouped by test run** | Visually group sessions from the same pytest invocation (same HHMMSS prefix) |

#### Session Gallery (`/screenshots/<dir_name>`)

| Element | Description |
|---------|-------------|
| **Filmstrip** | Horizontal scrollable strip of numbered SVG thumbnails |
| **Main viewer** | Large SVG display area (responsive, zoomable) |
| **Navigation** | Previous/Next buttons, keyboard arrow keys, filmstrip click |
| **Metadata panel** | For selected screenshot: name, trigger, command, room, timestamp, file size |
| **Slideshow mode** | Auto-advance with configurable interval (1-5 sec) |
| **Comparison mode** | Side-by-side two screenshots from the same session (before/after) |
| **Download** | Download individual SVG or all as ZIP |
| **Linked session** | If associated with a JSONL session, link to session detail |

#### SVG Rendering

SVGs are served directly as `<img>` or inline `<object>` elements. Flask serves
them from `logs/screenshots/` with correct `Content-Type: image/svg+xml`.

### F3: Cross-Session Analytics Dashboard

**Route:** `/analytics`

| Panel | Chart Type | Data |
|-------|-----------|------|
| **Session Volume** | Bar chart (by day) | Sessions per day over time |
| **Mode Distribution** | Donut chart | Sessions by mode |
| **Top Rooms** | Horizontal bar chart | Top 10 most visited rooms |
| **Room Heatmap** | Dungeon map overlay | Visit count as color intensity on map |
| **Encounter Outcomes** | Stacked bar | Outcomes per encounter type |
| **Death Causes** | Pie chart | Deaths by cause |
| **Items Collected** | Icon grid with counts | Item → collection frequency |
| **Session Duration** | Histogram | Distribution of session lengths |
| **Completion Funnel** | Funnel chart | % reaching each room (entrance → cellar → armoury → chamber) |
| **Stuck Points** | Table | Rooms where players get stuck (high revisit + help count) |
| **Commands Used** | Word cloud or bar chart | Most frequent commands across all sessions |
| **Progression Over Time** | Line chart | Avg rooms/session trending over days |

**Interactivity:**
- Global date range filter affects all panels
- Click a room in heatmap → filter sessions to those visiting that room
- Click a bar segment → drill down to matching sessions

**Library:** [Chart.js](https://www.chartjs.org/) via CDN (lightweight, no build step, good default aesthetics)

### F4: Feedback Report Viewer

**Route:** `/feedback` (list) and `/feedback/<sid>` (detail)

#### List View

| Element | Description |
|---------|-------------|
| **Report cards** | SID, date, key metrics (rooms, encounters, deaths) as badges |
| **Sort** | By date, room count, death count |

#### Detail View

| Element | Description |
|---------|-------------|
| **Rendered Markdown** | Full feedback report rendered as HTML |
| **Metrics sidebar** | Key stats pulled from the report in visual cards |
| **Cross-links** | Button to view the source session log, button to view screenshots (if any) |
| **Diff view** | If multiple reports exist, compare metrics between sessions |

### F5: Dungeon Map Visualization

**Route:** `/map`

#### Static Map

An interactive SVG/canvas rendering of the full dungeon structure:

```
                    entrance/
                   ╱    │    ╲
          .chapel/    cellar/   .vault/   .scrap/   .rift/
            │           │         │                   │
        courtyard/   armoury/  stronghold/        arena/  spire/
            │           │
         aviary/     chamber/
            │
          hall/
            │
        library/
            │
         .study/
```

| Element | Description |
|---------|-------------|
| **Room nodes** | Clickable circles/rectangles with room name. Size proportional to visit count |
| **Edges** | Lines connecting rooms. Thickness proportional to traversal count |
| **Hidden rooms** | Shown with dashed border and lock icon. Filled in when unlocked in session data |
| **Room tooltip** | Hover shows: visit count, avg time spent, commands taught, encounters available |
| **Player path** | Select a session from a dropdown → animate the player's path through the dungeon with dotted trail |
| **Heatmap overlay** | Toggle color intensity based on visit frequency |
| **Legend** | Color coding for room types (visible, hidden, unlocked) |

**Implementation:** D3.js force-directed graph or hand-positioned SVG with JS
interactivity. The room topology is static and can be hardcoded as a JSON
adjacency list — it won't change often.

```python
# src/viewer/data/dungeon_map.json
{
  "rooms": [
    {"id": "entrance", "label": "Entrance", "x": 400, "y": 50, "hidden": false, "parent": null,
     "teaches": ["pwd", "ls", "cd", "cat"]},
    {"id": "cellar", "label": "Cellar", "x": 400, "y": 150, "hidden": false, "parent": "entrance",
     "teaches": ["ls -a", "./executable", "export"]},
    ...
  ],
  "edges": [
    {"from": "entrance", "to": "cellar"},
    {"from": "cellar", "to": "armoury"},
    ...
  ]
}
```

### F6: Real-Time Session Monitor

**Route:** `/live`

Uses **Server-Sent Events (SSE)** to push updates to the browser as new log
events arrive.

| Element | Description |
|---------|-------------|
| **Active session list** | Shows sessions with events in the last 60 seconds |
| **Live event feed** | Scrolling event log with auto-scroll, color-coded by event type |
| **Live map** | Dungeon map with animated player position updating in real time |
| **Live screenshots** | When a screenshot event arrives, auto-display the new SVG |
| **Session stats** | Running counters for current session (rooms, encounters, HP) |
| **Alert banner** | Flash notification on death, treasure, or unlock events |

**Backend implementation:**

```python
# File watcher using watchdog or polling
class SessionWatcher:
    """Watches logs/sessions/ for new lines in JSONL files."""
    
    def __init__(self, log_dir: Path):
        self.log_dir = log_dir
        self.file_positions: dict[Path, int] = {}  # Track read position per file
    
    def poll(self) -> list[LogEvent]:
        """Return new events since last poll."""
        new_events = []
        for jsonl_file in self.log_dir.glob("*.jsonl"):
            last_pos = self.file_positions.get(jsonl_file, 0)
            current_size = jsonl_file.stat().st_size
            if current_size > last_pos:
                with open(jsonl_file) as f:
                    f.seek(last_pos)
                    for line in f:
                        new_events.append(parse_event(line))
                self.file_positions[jsonl_file] = current_size
        return new_events

@app.route("/api/live/stream")
def live_stream():
    """SSE endpoint."""
    def generate():
        watcher = SessionWatcher(LOG_DIR)
        while True:
            events = watcher.poll()
            for event in events:
                yield f"data: {json.dumps(event)}\n\n"
            time.sleep(1)
    return Response(generate(), mimetype="text/event-stream")
```

---

## 4. UI / Layout

### Navigation

Persistent top navigation bar with fantasy theme:

```
┌──────────────────────────────────────────────────────────────────┐
│  ⚔️ Bashcrawl Observatory    Sessions  Screenshots  Analytics   │
│                               Feedback  Map  Live               │
└──────────────────────────────────────────────────────────────────┘
```

### Theme

- **Colors:** Dark parchment background (`#1a1a2e`), gold accents (`#d4a574`),
  muted text (`#c4b998`), green for success, red for death/errors
- **Typography:** Monospace for log data, serif/fantasy heading font
  (system fonts, no custom font files)
- **Cards:** Rounded corners with subtle border, shadow on hover
- **Responsive:** CSS Grid / Flexbox, works on tablet+ (not optimized for phone)

### Dark/Light Mode

CSS custom properties with toggle button. Default: dark (fits dungeon theme).

---

## 5. File Structure

```
src/viewer/
├── __init__.py
├── __main__.py              # python3 -m src.viewer entry point
├── app.py                   # Flask app factory
├── config.py                # Paths, defaults, feature flags
│
├── loaders/
│   ├── __init__.py
│   ├── sessions.py          # JSONL session parser + SessionStore
│   ├── screenshots.py       # Screenshot directory + manifest parser
│   └── feedback.py          # Markdown feedback loader
│
├── analytics/
│   ├── __init__.py
│   └── engine.py            # Cross-session aggregation
│
├── watchers/
│   ├── __init__.py
│   └── session_watcher.py   # File polling for live updates
│
├── routes/
│   ├── __init__.py
│   ├── pages.py             # HTML page routes (Jinja2)
│   ├── api.py               # JSON API endpoints
│   └── live.py              # SSE streaming endpoint
│
├── data/
│   └── dungeon_map.json     # Static room topology
│
├── templates/
│   ├── base.html            # Shared layout, nav, theme
│   ├── index.html           # Landing / dashboard overview
│   ├── sessions/
│   │   ├── list.html
│   │   └── detail.html
│   ├── screenshots/
│   │   ├── index.html
│   │   └── gallery.html
│   ├── analytics/
│   │   └── dashboard.html
│   ├── feedback/
│   │   ├── list.html
│   │   └── detail.html
│   ├── map/
│   │   └── index.html
│   └── live/
│       └── index.html
│
├── static/
│   ├── css/
│   │   ├── theme.css        # CSS custom properties, base styles
│   │   ├── components.css   # Cards, badges, tables, timeline
│   │   ├── gallery.css      # Screenshot gallery specific
│   │   └── map.css          # Dungeon map specific
│   ├── js/
│   │   ├── app.js           # Shared utilities, fetch helpers
│   │   ├── sessions.js      # Session list filtering/sorting
│   │   ├── gallery.js       # Screenshot slideshow, filmstrip
│   │   ├── analytics.js     # Chart.js chart initialization
│   │   ├── map.js           # D3/SVG dungeon map rendering
│   │   └── live.js          # SSE connection, live feed
│   └── img/
│       └── favicon.svg      # Sword/dungeon icon
│
├── requirements.txt         # Flask, markdown, watchdog
└── README.md                # Usage, screenshots, config
```

---

## 6. Implementation Phases

### Phase 1: Foundation (MVP) — ~3 days

**Goal:** Flask skeleton + Session log browser + basic screenshot serving

| Task | Details |
|------|---------|
| 1.1 | Flask app factory, config, `__main__.py`, base template with nav |
| 1.2 | `SessionStore` — parse all JSONL files, expose `list()` / `get()` |
| 1.3 | `/sessions` list page — table/cards with basic filtering (date, mode) |
| 1.4 | `/sessions/<sid>` detail page — event timeline, room path, raw JSONL |
| 1.5 | Static file serving for `logs/screenshots/` SVGs |
| 1.6 | CSS theme (dark parchment, fantasy aesthetic) |
| 1.7 | `main.sh --viewer` launcher integration |

**Deliverable:** Usable session browser. Can view any session's events.

### Phase 2: Screenshot Gallery — ~2 days

| Task | Details |
|------|---------|
| 2.1 | `ScreenshotStore` — parse manifest.json files, build index |
| 2.2 | `/screenshots` index page — grid of screenshot sessions with thumbnails |
| 2.3 | `/screenshots/<dir>` gallery — filmstrip + main viewer + metadata panel |
| 2.4 | Keyboard navigation (arrows), slideshow mode |
| 2.5 | Cross-link sessions ↔ screenshots (bidirectional) |

**Deliverable:** Full screenshot browsing with filmstrip navigation.

### Phase 3: Analytics Dashboard — ~2 days

| Task | Details |
|------|---------|
| 3.1 | `AnalyticsEngine` — compute all aggregate stats |
| 3.2 | `/analytics` page with Chart.js panels |
| 3.3 | Session volume timeline, mode distribution, top rooms |
| 3.4 | Encounter outcomes, death causes, items collected |
| 3.5 | Duration histogram, completion funnel |
| 3.6 | Date range filter affecting all charts |
| 3.7 | Click-through from chart elements to filtered session list |

**Deliverable:** Visual analytics dashboard with interactive charts.

### Phase 4: Feedback & Map — ~2 days

| Task | Details |
|------|---------|
| 4.1 | `FeedbackStore` — parse Markdown reports |
| 4.2 | `/feedback` list and detail pages |
| 4.3 | Markdown rendering to HTML (with `markdown` or `mistune` library) |
| 4.4 | `dungeon_map.json` — define room topology |
| 4.5 | `/map` page — SVG/D3 interactive dungeon map |
| 4.6 | Room heatmap overlay from analytics data |
| 4.7 | Session path animation on map |

**Deliverable:** Feedback viewer + interactive dungeon map.

### Phase 5: Real-Time Monitor — ~2 days

| Task | Details |
|------|---------|
| 5.1 | `SessionWatcher` — file polling for new JSONL lines |
| 5.2 | SSE endpoint `/api/live/stream` |
| 5.3 | `/live` page — event feed, active sessions panel |
| 5.4 | Live dungeon map with player position |
| 5.5 | Screenshot auto-display on new screenshot events |
| 5.6 | Alert banners for notable events (death, treasure, unlock) |

**Deliverable:** Real-time monitoring of active game sessions.

### Phase 6: Polish & Testing — ~2 days

| Task | Details |
|------|---------|
| 6.1 | Responsive layout refinement |
| 6.2 | Dark/light mode toggle |
| 6.3 | Loading states, empty states, error handling |
| 6.4 | Python tests for loaders, analytics engine, API endpoints |
| 6.5 | README with usage docs and screenshots |
| 6.6 | `.gitignore` updates (cache files, etc.) |
| 6.7 | CI integration — `pytest` for viewer tests |

**Deliverable:** Production-ready viewer with tests and docs.

---

## 7. API Endpoints

All JSON API endpoints are under `/api/`.

### Sessions API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/sessions` | List sessions with query params: `date_from`, `date_to`, `mode`, `has_screenshots`, `min_events`, `sort`, `order`, `page`, `per_page` |
| GET | `/api/sessions/<sid>` | Full session detail with all events |
| GET | `/api/sessions/<sid>/events` | Stream events only (for lazy loading) |
| GET | `/api/sessions/stats` | Quick stats (total, date range, mode counts) |

### Screenshots API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/screenshots` | List screenshot sessions with query params: `test_name`, `date`, `sort` |
| GET | `/api/screenshots/<dir_name>` | Session manifest + metadata |
| GET | `/api/screenshots/<dir_name>/<filename>` | Serve individual SVG file |

### Analytics API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/analytics` | Full analytics summary JSON |
| GET | `/api/analytics/rooms` | Room visit data for heatmap |
| GET | `/api/analytics/encounters` | Encounter breakdown |
| GET | `/api/analytics/timeline` | Sessions-per-day time series |
| GET | `/api/analytics/funnel` | Completion funnel data |

### Feedback API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/feedback` | List feedback reports |
| GET | `/api/feedback/<sid>` | Report content (HTML + metrics) |

### Live API

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/live/stream` | SSE stream of new events |
| GET | `/api/live/active` | Currently active sessions (events in last 60s) |

---

## 8. Dependencies

### New Python Dependencies

```
flask>=3.0
markdown>=3.5          # Markdown → HTML for feedback reports
watchdog>=4.0          # Filesystem monitoring for live updates (optional, can fall back to polling)
```

### Frontend (CDN, no install)

```
Chart.js 4.x           # Analytics charts
D3.js 7.x              # Dungeon map visualization (optional, can use pure SVG + JS)
```

### Already Available in Project

```
python 3.10+            # Required by terminal-illness
pyyaml                  # Already in test/requirements.txt
```

### Viewer-Specific Requirements File

```
# src/viewer/requirements.txt
flask>=3.0
markdown>=3.5
watchdog>=4.0
```

---

## 9. Testing Strategy

### Unit Tests (`test/unit/test_viewer/`)

| Test File | Covers |
|-----------|--------|
| `test_session_loader.py` | JSONL parsing, field extraction, filtering, T-prefix detection |
| `test_screenshot_loader.py` | Manifest parsing, cross-referencing, missing manifest handling |
| `test_feedback_loader.py` | Markdown parsing, metric extraction |
| `test_analytics_engine.py` | Aggregation correctness, edge cases (empty sessions, missing fields) |

### Integration Tests (`test/integration/test_viewer/`)

| Test File | Covers |
|-----------|--------|
| `test_routes.py` | All page routes return 200, correct templates |
| `test_api.py` | API endpoints return valid JSON, filtering works, pagination correct |
| `test_live.py` | SSE stream produces valid events when JSONL file is appended |

### Test Data

Use `lib/test_logging.sh` to generate sample session data, or create dedicated
fixtures in `test/fixtures/viewer/` with known JSONL content for deterministic
assertions.

---

## 10. Open Questions

| # | Question | Proposed Default |
|---|----------|-----------------|
| 1 | Should the viewer be embedded in the project or a separate package? | Embedded at `src/viewer/`, launched via `python3 -m src.viewer` |
| 2 | Port number? | 5000 (Flask default), configurable via `--port` |
| 3 | Should screenshots be copied to a static dir or served from `logs/` directly? | Served directly from `logs/` to avoid duplication |
| 4 | Should analytics be computed on every page load or cached? | Cached with 60-second TTL; manual refresh button |
| 5 | Should the dungeon map topology be auto-detected from the filesystem? | Start with hardcoded JSON; add auto-detection later |
| 6 | Should the viewer support multiple game instances / roots? | Single game root for MVP; `--game-root` flag for flexibility |
| 7 | Should the live monitor support multiple simultaneous SSE clients? | Yes, Flask SSE via generator supports this natively |
| 8 | Should we add export features (CSV, PDF)? | Not in MVP; add in Phase 6 if needed |

---

## Appendix: Mockup Wireframes

### Session List Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ Bashcrawl Observatory    [Sessions] Screenshots  Analytics  │
│                               Feedback   Map   Live             │
├─────────────────────────────────────────────────────────────────┤
│  📊 244 sessions │ 847 events │ 23.5 min avg │ 253 screenshots │
├─────────────────────────────────────────────────────────────────┤
│  Filters: [Date ▾] [Mode ▾] [☐ Has Screenshots] [Min Events]  │
│  Sort: [Date ▾] [↓ Desc]                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 71695588    2026-02-21 12:05    [launcher]     0m 12s    │  │
│  │ 🏰 3 rooms  ⚔️ 0 encounters  💀 0 deaths  📸 0 screenshots│  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ T71701918   2026-02-21 13:25    [ai_test]      3s        │  │
│  │ 🏰 0 rooms  ⚔️ 0 encounters  💀 0 deaths  📸 23 screenshots│  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 71266674    2026-02-16 14:03    [integration]  1s        │  │
│  │ 🏰 5 rooms  ⚔️ 5 encounters  💀 1 deaths  Items: amulet  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [◀ Prev]  Page 1 of 10  [Next ▶]                              │
└─────────────────────────────────────────────────────────────────┘
```

### Screenshot Gallery Page

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ Bashcrawl Observatory     Sessions [Screenshots] Analytics  │
├─────────────────────────────────────────────────────────────────┤
│  ← Back │ full_critical_path │ 2026-02-21 │ 23 screenshots    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │              [ Large SVG Display Area ]                    │  │
│  │              001_cd_entrance.svg                           │  │
│  │              (click to zoom)                               │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐  ← filmstrip │
│  │01│ │02│ │03│ │04│ │05│ │06│ │07│ │08│ │09│     scroll →    │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘               │
│                                                                 │
│  Metadata: trigger=agent_auto  cmd="cd entrance"  73KB         │
│  [◀ Prev] [▶ Next] [▶️ Slideshow] [⬇ Download] [🔗 Session]    │
└─────────────────────────────────────────────────────────────────┘
```

### Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚔️ Bashcrawl Observatory     Sessions  Screenshots [Analytics] │
├─────────────────────────────────────────────────────────────────┤
│  Date Range: [2026-02-16 ─── 2026-02-21]  Mode: [All ▾]       │
├────────────────────────────────┬────────────────────────────────┤
│                                │                                │
│  Session Volume (by day)       │  Mode Distribution             │
│  ┌──────────────────────┐      │  ┌──────────────────────┐      │
│  │ ██                   │      │  │    ╱ launcher 45% ╲  │      │
│  │ ██ ██          ██    │      │  │   │  test 35%      │ │      │
│  │ ██ ██ ██    ██ ██    │      │  │    ╲ interactive ╱  │      │
│  │ ██ ██ ██ ██ ██ ██    │      │  │      20%            │      │
│  └──────────────────────┘      │  └──────────────────────┘      │
│  2/16 17  18  19  20  21       │                                │
│                                │                                │
├────────────────────────────────┼────────────────────────────────┤
│                                │                                │
│  Top Rooms                     │  Completion Funnel             │
│  entrance ████████████ 120     │  entrance  ████████████  100%  │
│  cellar   ████████     85      │  cellar    █████████     80%   │
│  armoury  ██████       60      │  armoury   ██████        55%   │
│  chamber  ████         42      │  chamber   ████          35%   │
│  hall     ██           18      │                                │
│                                │                                │
└────────────────────────────────┴────────────────────────────────┘
```
