"""
Unit tests for the crawler, scripts/aggregate.sh (pipeline stage 1), run end to
end in a scratch directory against local bare repositories, so they need no
network.
"""

import os
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

# Add the project root to the path
PROJECT_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(PROJECT_ROOT))

from tests.crawl import run_aggregate  # noqa: E402

# Keep the developer's own git configuration (hooks, signing, URL rewrites)
# out of the fixture repositories and the crawl.
GIT_ENV = {
    "GIT_CONFIG_GLOBAL": os.devnull,
    "GIT_CONFIG_NOSYSTEM": "1",
    "GIT_AUTHOR_NAME": "test",
    "GIT_AUTHOR_EMAIL": "test@example.com",
    "GIT_COMMITTER_NAME": "test",
    "GIT_COMMITTER_EMAIL": "test@example.com",
}


def git(*args, cwd=None):
    subprocess.run(["git", *args], cwd=cwd, env={**os.environ, **GIT_ENV},
                   check=True, capture_output=True, text=True)


def commit_files(checkout: Path, files: dict) -> None:
    for rel, text in files.items():
        path = checkout / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    git("add", "-A", cwd=checkout)
    git("commit", "-q", "-m", "fixture", cwd=checkout)


def make_remote(root: Path, name: str, files: dict, symlinks: dict = None) -> str:
    """A bare repository holding `files` on branch main; returns its file:// URL."""
    source = root / f"{name}-source"
    source.mkdir()
    git("init", "-q", "-b", "main", cwd=source)
    for rel, target in (symlinks or {}).items():
        (source / rel).symlink_to(target)
    commit_files(source, files)
    remote = root / f"{name}.git"
    git("clone", "-q", "--bare", str(source), str(remote))
    return remote.as_uri()


class TestAggregateScript(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)
        self.good = make_remote(self.tmp, "good", {
            "README.md": "# Good\n\nThe good repository.\n",
            "guides/install.md": "# Install\n\nRun it.\n",
            "notes.txt": "Not documentation.\n",
        }, symlinks={"linked.md": "README.md"})
        self.work = self.tmp / "work"
        self.corpus = self.work / "docs" / "good"

    def crawl(self, *specs):
        return run_aggregate(self.work, specs, env=GIT_ENV, timeout=120)

    def pages(self, corpus: Path):
        return sorted(p.relative_to(corpus).as_posix()
                      for p in corpus.rglob("*") if p.is_file())

    def test_clean_crawl_processes_every_repository(self):
        done = self.crawl(f"{self.good}#main")
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        # Markdown and READMEs only; the symlinked linked.md is never followed.
        self.assertEqual(self.pages(self.corpus), ["README.md", "guides/install.md"])
        self.assertIn("source_file: README.md",
                      (self.corpus / "README.md").read_text(encoding="utf-8"))
        self.assertFalse((self.work / "temp").exists())
        self.assertFalse((self.work / "raw_docs").exists())

    def test_a_repository_that_cannot_be_fetched_fails_the_run_not_the_others(self):
        other = make_remote(self.tmp, "other", {"README.md": "# Other\n"})
        failing = [
            (self.tmp / "missing.git").as_uri(),     # no such repository
            f"{other}#no-such-branch",               # no such branch
            (self.tmp / "..").as_uri(),              # names no directory of its own
        ]
        done = self.crawl(f"{self.good}#main", *failing)
        output = done.stdout + done.stderr
        self.assertEqual(done.returncode, 1, output)

        # The repository that could be fetched still went all the way through.
        self.assertEqual(self.pages(self.corpus), ["README.md", "guides/install.md"])
        for name in ("missing", "other"):
            self.assertFalse((self.work / "docs" / name).exists(), name)
        self.assertFalse((self.work / "temp").exists())

        # Every failure is named at the end; the fetched repository is not.
        for spec in failing:
            self.assertIn(f"  - {spec}\n", done.stderr, output)
        self.assertNotIn(f"  - {self.good}", done.stderr, output)

    def test_a_clone_left_in_temp_is_fast_forwarded_or_reported(self):
        leftover = self.work / "temp" / "good"
        git("clone", "-q", self.good, str(leftover))
        upstream = self.tmp / "upstream-checkout"
        git("clone", "-q", self.good, str(upstream))
        commit_files(upstream, {"guides/new.md": "# New\n\nAdded upstream.\n"})
        git("push", "-q", "origin", "main", cwd=upstream)

        done = self.crawl(f"{self.good}#main")
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertIn("guides/new.md", self.pages(self.corpus))

        # A leftover clone that has diverged from upstream is not merged: the
        # pull is --ff-only, so the repository is reported instead.
        git("clone", "-q", self.good, str(leftover))
        commit_files(leftover, {"local.md": "# Local only\n"})
        commit_files(upstream, {"guides/newer.md": "# Newer\n"})
        git("push", "-q", "origin", "main", cwd=upstream)

        done = self.crawl(f"{self.good}#main")
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn(f"  - {self.good}#main\n", done.stderr)
        self.assertNotIn("local.md", self.pages(self.corpus))


if __name__ == "__main__":
    unittest.main()
