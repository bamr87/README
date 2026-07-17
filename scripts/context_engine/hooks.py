"""
Lifecycle hook runner.

At each build stage the engine executes every executable file in
hooks.d/<stage>/ in lexical order (NN-name convention), passing context
through CONTEXT_* environment variables. Hooks let automation (AI agents,
CI, local tooling) observe or extend the pipeline without editing engine
code. Hook failures are reported but non-fatal unless CONTEXT_HOOKS_STRICT=1.
"""

import os
import subprocess
from pathlib import Path
from typing import Dict, List, Optional

from . import ENGINE_VERSION
from .config import HOOKS_DIR, HOOK_STAGES, ROOT

HOOK_TIMEOUT = 120


def run_hooks(stage: str, extra_env: Optional[Dict[str, str]] = None,
              hooks_dir: Path = HOOKS_DIR) -> List[Dict]:
    """Run all hooks for a stage; returns one result dict per hook."""
    if stage not in HOOK_STAGES:
        raise ValueError(f"unknown hook stage: {stage} (expected one of {HOOK_STAGES})")
    stage_dir = hooks_dir / stage
    if not stage_dir.is_dir():
        return []

    env = {
        **os.environ,
        "CONTEXT_ROOT": str(ROOT),
        "CONTEXT_STAGE": stage,
        "CONTEXT_ENGINE_VERSION": ENGINE_VERSION,
        **(extra_env or {}),
    }
    strict = os.environ.get("CONTEXT_HOOKS_STRICT") == "1"

    results: List[Dict] = []
    for hook in sorted(stage_dir.iterdir()):
        if not hook.is_file() or not os.access(hook, os.X_OK):
            continue
        try:
            completed = subprocess.run(
                [str(hook)], cwd=ROOT, env=env, timeout=HOOK_TIMEOUT,
                capture_output=True, text=True,
            )
            ok = completed.returncode == 0
            output = (completed.stdout + completed.stderr).strip()
        except (subprocess.TimeoutExpired, OSError) as exc:
            ok, output = False, str(exc)
        results.append({"hook": hook.name, "stage": stage, "ok": ok, "output": output})
        prefix = "ok" if ok else "FAILED"
        print(f"[hooks/{stage}] {hook.name}: {prefix}")
        if output:
            for line in output.splitlines()[:10]:
                print(f"    {line}")
        if not ok and strict:
            raise RuntimeError(f"hook failed in strict mode: {stage}/{hook.name}")
    return results
