"""
Run the crawler, scripts/aggregate.sh, in a scratch working directory.

aggregate.sh works on its current directory: it reads repos.txt, clones into
temp/, copies Markdown into raw_docs/, then runs scripts/process.py and
tools/unwrap-prose.py, which write docs/. A test gives it a directory of its
own, holding copies of scripts/ and tools/ and the repos.txt the test asks
for, so a crawl never touches this repository's corpus.
"""

import os
import shlex
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Dict, Iterable, Optional

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def repo_dir_name(repo_spec: str) -> str:
    """The directory aggregate.sh files a repos.txt line under (`basename URL .git`)."""
    name = repo_spec.split("#", 1)[0].rstrip("/").rsplit("/", 1)[-1]
    # removesuffix, not rstrip: rstrip(".git") strips characters, which turns
    # "githubai" into "githuba".
    return name.removesuffix(".git")


def run_aggregate(work_dir: Path, repo_specs: Iterable[str],
                  env: Optional[Dict[str, str]] = None,
                  timeout: int = 900) -> subprocess.CompletedProcess:
    """Run scripts/aggregate.sh over `repo_specs` (repos.txt lines) in work_dir.

    `env` adds to (or overrides) the inherited environment. The crawl's
    outputs land in work_dir: docs/<repo>/ for each repository it fetched.
    """
    work_dir.mkdir(parents=True, exist_ok=True)
    skip = shutil.ignore_patterns("__pycache__", "*.pyc")
    for name in ("scripts", "tools"):
        shutil.copytree(PROJECT_ROOT / name, work_dir / name, ignore=skip,
                        dirs_exist_ok=True)
    (work_dir / "repos.txt").write_text(
        "".join(f"{spec}\n" for spec in repo_specs), encoding="utf-8")

    # aggregate.sh runs the first python3 on PATH and builds a virtualenv when
    # that interpreter lacks the requirements. Put this interpreter, which has
    # them, first on PATH, so a crawl under test never installs anything.
    bin_dir = work_dir / ".bin"
    bin_dir.mkdir(exist_ok=True)
    shim = bin_dir / "python3"
    shim.write_text(f'#!/bin/sh\nexec {shlex.quote(sys.executable)} "$@"\n',
                    encoding="utf-8")
    shim.chmod(0o755)

    run_env = {**os.environ, **(env or {})}
    run_env["PATH"] = f"{bin_dir}{os.pathsep}{run_env.get('PATH', '')}"
    return subprocess.run(["bash", "scripts/aggregate.sh"], cwd=work_dir, env=run_env,
                          stdin=subprocess.DEVNULL, capture_output=True, text=True,
                          timeout=timeout)
