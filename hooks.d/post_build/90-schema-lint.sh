#!/bin/sh
# Drift gate: validate the SCHEMA.md pyramid after every context build.
exec python3 "${CONTEXT_ROOT:-.}/scripts/schema_lint.py" check "${CONTEXT_ROOT:-.}"
