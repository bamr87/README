"""
Entry point. Supports both invocation styles from the repo root:

    python3 -m scripts.context_engine <command>
    python3 scripts/context_engine <command>
"""

import sys
from pathlib import Path

if __package__ in (None, ""):
    # Direct-path invocation: put the repo root on sys.path and re-import
    # ourselves as a package so relative imports work.
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    from scripts.context_engine.cli import main
else:
    from .cli import main

if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
