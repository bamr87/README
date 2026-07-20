---
applyTo: '**/*.py,docker-compose*.yml,.devcontainer/**,src/**'
description: Barodybroject-specific facts that override or supplement other instruction
  files. Use when working on Django code, Docker compose, settings, models, views,
  tests, or the dev container.
source_file: project.instructions.md
title: Project-Specific Facts (Source of Truth)
---
# Project-Specific Facts (Source of Truth)

These notes capture the *actual* state of the codebase. When they conflict with broader instruction files (`space.instructions.md`, `languages.instructions.md`, etc.), **these win**.

## Repository layout (actual)

```
barodybroject/
├── src/                              # Django root (CWD for manage.py & pytest)
│   ├── manage.py
│   ├── pytest.ini
│   ├── requirements.txt              # runtime deps
│   ├── Dockerfile                    # used by both dev and prod compose
│   ├── docker-entrypoint.sh
│   ├── gunicorn.conf.py              # production WSGI config
│   ├── barodybroject/
│   │   ├── settings/                 # base/development/production/testing settings
│   │   ├── urls.py
│   │   ├── wsgi.py / asgi.py
│   ├── parodynews/                   # main app (PACKAGE layout)
│   │   ├── models/                   # split: ai, content, conversation, publishing, config, base
│   │   ├── views/                    # split: api, assistants, content, posts, threads, schemas, base, utils
│   │   ├── admin.py, forms.py, urls.py, serializers.py
│   │   ├── management/commands/      # custom mgmt commands (e.g. ensure_admin)
│   │   ├── migrations/
│   │   ├── templates/, templatetags/
│   │   ├── tests/
│   │   └── utils/, mixins.py, resources.py, schema/
│   ├── pages/                        # Jekyll site (separate service)
│   ├── posthog/, scripts/, setup/, assets/
├── .devcontainer/
│   └── docker-compose_dev.yml        # DEV stack — used by VS Code tasks
├── docker-compose.yml                # PROD-like stack (web-prod service)
├── infra/                            # Azure Bicep IaC
├── scripts/                          # host-side automation
├── test/, tests/                     # ancillary test/infra scripts
└── requirements-dev.txt              # host venv deps (testing/linting only)
```

## Compose files & service names

| Purpose | File | Web service | DB service | Web port |
|---|---|---|---|---|
| Development | `.devcontainer/docker-compose_dev.yml` | `python` | `barodydb` | 8000 (+ 5678 debugpy) |
| Production-like | `docker-compose.yml` | `web-prod` | `barodydb` | 80 → 8000 |

Always pass `-f` explicitly when mixing modes:

```bash
docker compose -f .devcontainer/docker-compose_dev.yml up -d
docker compose -f .devcontainer/docker-compose_dev.yml exec python python manage.py migrate
```

## Dev container quirks

- Server boots with `debugpy --listen 0.0.0.0:5678 --wait-for-client` — **Django will not respond on :8000 until a debugger attaches**. Attach via VS Code "Python: Remote Attach" on port 5678, or remove `--wait-for-client` for headless runs.
- `runserver` runs with `--noreload --nothreading` (debugpy requirement). Code edits require a container restart, **not** auto-reload.
- `ensure_admin` runs on every startup using `DJANGO_SUPERUSER_USERNAME/EMAIL/PASSWORD` env vars (defaults: `admin` / `admin@localhost.local` / `admin`).
- Dependencies are installed at container start (`pip install -r requirements.txt`), not baked into the image. First boot is slow; subsequent boots reuse the layer cache only if the image is unchanged.

## Settings & environment

- Settings live in `src/barodybroject/settings/`:
	- `barodybroject.settings.development` for the dev container and `manage.py` defaults
	- `barodybroject.settings.production` for WSGI/ASGI and production compose
	- `barodybroject.settings.testing` for pytest and infrastructure tests
- Required env vars: `SECRET_KEY`, `DB_HOST`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `OPENAI_API_KEY`.
- Database: **PostgreSQL only**. No SQLite path.

## Models & views are packages, not modules

When you need to add a model:

1. Pick the right submodule under `src/parodynews/models/` based on domain (`ai.py`, `content.py`, `conversation.py`, `publishing.py`, `config.py`).
2. Make sure it is exported from `src/parodynews/models/__init__.py` so Django's app loader picks it up.
3. Run migrations inside the dev container.

Same pattern for views under `src/parodynews/views/`. URLs are wired in `src/parodynews/urls.py`.

## Testing

- Run from `src/`: `DJANGO_SETTINGS_MODULE=barodybroject.settings.testing pytest` (or use the workspace task `🔬 Test: Run Pytest`). The dev container exports development settings for the server, so pytest must override that environment variable.
- `--reuse-db --nomigrations` is on by default; if you change models, drop the test DB or pass `--create-db`.
- `e2e` tests are deselected by default. Run them with `pytest -m e2e` and ensure Playwright browsers are installed: `python -m playwright install --with-deps chromium`.

## File header policy

The aspirational verbose file headers described in `copilot-instructions.md.bak` and `languages.instructions.md` are **not** consistently used in this codebase. Match the surrounding file's style. Don't add 15-line headers to a 30-line module.

## Things to NOT do

- Don't introduce SQLite as a "dev convenience".
- Don't add a `src/parodynews/models.py` or `views.py` flat file — it will shadow the package.
- Don't run `python manage.py` on the host unless you have a host venv with all deps; prefer the dev container.
- Don't commit `src/.env`, `src/.installation`, `src/.setup_config.json`, or anything under `setup_data/`.
