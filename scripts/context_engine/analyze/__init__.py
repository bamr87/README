"""
Analyze stage: turn gathered sources into findings.

A check is a small function registered in `checks.py` with an id, a class
(`gap`, `quality`, `drift`, `alignment`), a default severity and a scope. It
returns `Finding` objects carrying a stable key (`CHECK:repo:subject`), so
the same defect has the same identity across runs and can be deduplicated,
trended, gated and synced to issues.

Nothing here is a judgment call: every check reads the source manifest or a
file in the clone and reports what is or is not there.
"""

from .finding import Finding, SEVERITIES  # noqa: F401
from .checks import CHECKS, CheckSpec, run_checks  # noqa: F401
from .health import HEALTH_WEIGHTS, score_repo  # noqa: F401
from .report import build_report, render_markdown  # noqa: F401
