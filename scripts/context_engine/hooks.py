"""
Lifecycle hook runner.

At each build stage the engine executes every executable file in
hooks.d/<stage>/ in lexical order (NN-name convention), passing context
through CONTEXT_* environment variables. Hooks let automation (AI agents,
CI, local tooling) observe or extend the pipeline without editing engine
code. Hook failures are reported but non-fatal unless CONTEXT_HOOKS_STRICT=1.

A hook does not inherit the build's whole environment: the build step holds
the AI provider keys, so a hook sees only the allowlist below plus the names
an operator lists in CONTEXT_HOOK_ENV, and its output is run through the
secret screen before it is printed or returned.
"""

import os
import re
import subprocess
from pathlib import Path
from typing import Dict, List, Mapping, Optional

from . import ENGINE_VERSION
from .config import HOOKS_DIR, HOOK_STAGES, ROOT
from .redact import redact

HOOK_TIMEOUT = 120

# What a hook inherits from the build's environment: enough to find and run
# an interpreter (actions/setup-python exports LD_LIBRARY_PATH) and nothing
# that authenticates.
HOOK_ENV_NAMES = frozenset({
    "PATH", "HOME", "USER", "LOGNAME", "SHELL", "TERM", "TZ", "LANG",
    "LANGUAGE", "TMPDIR", "TEMP", "TMP", "VIRTUAL_ENV", "CI",
    "LD_LIBRARY_PATH", "DYLD_LIBRARY_PATH", "DYLD_FALLBACK_LIBRARY_PATH",
})
HOOK_ENV_PREFIXES = ("LC_", "PYTHON", "CONTEXT_")
# A prefix match never carries a credential-looking name; name it in
# CONTEXT_HOOK_ENV when a hook really needs it.
_CREDENTIAL_NAME = re.compile(r"KEY|TOKEN|SECRET|PASSW(OR)?D|CREDENTIAL", re.IGNORECASE)


def hook_environment(environ: Optional[Mapping[str, str]] = None) -> Dict[str, str]:
    """The part of `environ` (default: os.environ) a hook may see."""
    environ = os.environ if environ is None else environ
    opted_in = set(re.split(r"[\s,]+", environ.get("CONTEXT_HOOK_ENV", "").strip())) - {""}
    allowed = {}
    for name, value in environ.items():
        if name in opted_in or name in HOOK_ENV_NAMES or (
                name.startswith(HOOK_ENV_PREFIXES) and not _CREDENTIAL_NAME.search(name)):
            allowed[name] = value
    return allowed


def run_hooks(stage: str, extra_env: Optional[Dict[str, str]] = None,
              hooks_dir: Path = HOOKS_DIR) -> List[Dict]:
    """Run all hooks for a stage; returns one result dict per hook."""
    if stage not in HOOK_STAGES:
        raise ValueError(f"unknown hook stage: {stage} (expected one of {HOOK_STAGES})")
    stage_dir = hooks_dir / stage
    if not stage_dir.is_dir():
        return []

    env = {
        **hook_environment(),
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
        output, _ = redact(output)
        results.append({"hook": hook.name, "stage": stage, "ok": ok, "output": output})
        prefix = "ok" if ok else "FAILED"
        print(f"[hooks/{stage}] {hook.name}: {prefix}")
        if output:
            for line in output.splitlines()[:10]:
                print(f"    {line}")
        if not ok and strict:
            raise RuntimeError(f"hook failed in strict mode: {stage}/{hook.name}")
    return results
