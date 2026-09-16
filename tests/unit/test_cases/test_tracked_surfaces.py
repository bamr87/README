"""
Unit tests for `scripts/check_tracked_surfaces.py`, the integrity gate.

Why this file exists. `main` published navigation that named pages git had
never committed, and every branch cut from it failed the nav gate for weeks
(bamr87/bamr87#264). The cause was an over-broad `.gitignore`: un-anchored
directory rules like `lib/` and `.vscode/` match at *any* depth, so they
matched inside the aggregated corpus. The crawl wrote those pages to disk, the
navigator indexed them, the fact sheets counted them — and then the
auto-commit silently dropped them.

The remedy anchored those rules and added `check_tracked_surfaces.py` to make
the mistake impossible to repeat quietly. But the gate itself had no tests, so
nothing established that it actually detects the three things it claims to: a
gate that silently stopped working would restore the original failure mode
exactly, and the next person to see it green would have no reason to doubt it.

Everything runs offline against a real temporary git repository — real, because
all three invariants are defined in terms of what `git ls-files` reports, and a
mocked git would test the mock rather than the rule.
"""

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

PROJECT_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(PROJECT_ROOT))

from scripts import check_tracked_surfaces as cts  # noqa: E402


def _git(repo: Path, *args: str) -> None:
    subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True, capture_output=True, text=True,
    )


class TrackedSurfacesFixture(unittest.TestCase):
    """A miniature corpus: one project, two pages, one nav tree, one fact sheet."""

    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(lambda: __import__("shutil").rmtree(self.tmp, ignore_errors=True))

        self.docs = self.tmp / "docs"
        self.nav_dir = self.tmp / "context" / "nav"
        self.facts_dir = self.tmp / "context" / "facts"
        (self.docs / "alpha").mkdir(parents=True)
        self.nav_dir.mkdir(parents=True)
        self.facts_dir.mkdir(parents=True)

        (self.docs / "alpha" / "index.md").write_text("# Alpha\n", encoding="utf-8")
        (self.docs / "alpha" / "guide.md").write_text("# Guide\n", encoding="utf-8")

        self.write_nav(["alpha/index.md", "alpha/guide.md"])
        self.write_tree(["alpha/index.md", "alpha/guide.md"])
        self.write_facts(2)

        _git(self.tmp, "init", "-q")
        _git(self.tmp, "config", "user.email", "t@example.com")
        _git(self.tmp, "config", "user.name", "Test")
        self.commit_all()

        patcher = mock.patch.multiple(
            cts,
            ROOT=self.tmp,
            DOCS=self.docs,
            NAV_YML=self.tmp / "nav.yml",
            NAV_DIR=self.nav_dir,
            FACTS_DIR=self.facts_dir,
        )
        patcher.start()
        self.addCleanup(patcher.stop)

    def commit_all(self) -> None:
        _git(self.tmp, "add", "-A")
        _git(self.tmp, "commit", "-q", "-m", "corpus", "--allow-empty")

    def write_nav(self, targets) -> None:
        lines = ["nav:"] + [f"  - Page: {t}" for t in targets]
        (self.tmp / "nav.yml").write_text("\n".join(lines) + "\n", encoding="utf-8")

    def write_tree(self, targets) -> None:
        tree = {
            "tree": {
                "type": "dir",
                "children": [
                    {"type": "page", "path": t, "title": t} for t in targets
                ],
            }
        }
        (self.nav_dir / "alpha.json").write_text(
            json.dumps(tree, indent=2), encoding="utf-8")

    def write_facts(self, count: int) -> None:
        (self.facts_dir / "alpha.json").write_text(
            json.dumps({"project": {"name": "alpha"}, "corpus": {"file_count": count}}),
            encoding="utf-8")

    def kinds(self):
        return sorted(p["kind"] for p in cts.check()["problems"])


class TestCleanCorpus(TrackedSurfacesFixture):
    def test_a_consistent_corpus_reports_nothing(self):
        result = cts.check()
        self.assertEqual(result["problems"], [])
        self.assertEqual(result["nav_targets"], 2)
        self.assertEqual(result["tracked_docs"], 2)

    def test_exit_code_is_zero_when_clean(self):
        self.assertEqual(cts.main([]), 0)


class TestIgnoredCorpusPath(TrackedSurfacesFixture):
    """The original defect, reproduced in miniature."""

    def test_an_ignored_directory_inside_the_corpus_is_caught(self):
        # Exactly the shape that broke main: an un-anchored rule matching at
        # any depth, so it bites inside docs/ rather than at the repo root.
        (self.tmp / ".gitignore").write_text(".vscode/\n", encoding="utf-8")
        (self.docs / "alpha" / ".vscode").mkdir()
        (self.docs / "alpha" / ".vscode" / "notes.md").write_text(
            "# Notes\n", encoding="utf-8")
        self.commit_all()

        self.assertIn("ignored-corpus-path", self.kinds())
        self.assertEqual(cts.main([]), 1)

    def test_the_same_rule_anchored_to_the_root_is_fine(self):
        # The remedy: `/.vscode/` matches the repo root only, so a real IDE
        # directory there is still ignored while the corpus is untouched.
        (self.tmp / ".gitignore").write_text("/.vscode/\n", encoding="utf-8")
        (self.tmp / ".vscode").mkdir()
        (self.tmp / ".vscode" / "settings.json").write_text("{}", encoding="utf-8")
        (self.docs / "alpha" / ".vscode").mkdir()
        (self.docs / "alpha" / ".vscode" / "notes.md").write_text(
            "# Notes\n", encoding="utf-8")
        # Three pages now, not two: anchoring the rule brings the page that was
        # being swallowed back into the corpus, which is what the fix to main
        # did to the real one. The fact sheet has to agree, and the third
        # invariant is what says so.
        self.write_facts(3)
        self.commit_all()

        self.assertEqual(cts.check()["problems"], [])

    def test_the_ignored_page_never_reaches_the_navigation(self):
        # The half that made the drift permanent rather than merely wrong: the
        # page is on disk at build time, so a generated surface can name it,
        # and is absent after the commit, so the checker must object twice.
        (self.tmp / ".gitignore").write_text(".vscode/\n", encoding="utf-8")
        (self.docs / "alpha" / ".vscode").mkdir()
        (self.docs / "alpha" / ".vscode" / "notes.md").write_text(
            "# Notes\n", encoding="utf-8")
        self.write_nav(["alpha/index.md", "alpha/.vscode/notes.md"])
        self.commit_all()

        self.assertEqual(
            self.kinds(), ["ignored-corpus-path", "untracked-nav-target"])


class TestUntrackedNavTarget(TrackedSurfacesFixture):
    def test_nav_yml_naming_a_missing_page_is_caught(self):
        # The symptom a reader sees: a sidebar entry that 404s.
        self.write_nav(["alpha/index.md", "alpha/ghost.md"])
        self.commit_all()

        problems = cts.check()["problems"]
        self.assertEqual([p["kind"] for p in problems], ["untracked-nav-target"])
        self.assertEqual(problems[0]["surface"], "nav.yml")
        self.assertIn("alpha/ghost.md", problems[0]["message"])

    def test_a_nav_tree_naming_a_missing_page_is_caught(self):
        # The trees are a separate surface from nav.yml and drift separately —
        # for it-journey and barodybroject the JSON was stale while the browse
        # pages were clean.
        self.write_tree(["alpha/index.md", "alpha/ghost.md"])
        self.commit_all()

        problems = cts.check()["problems"]
        self.assertEqual([p["kind"] for p in problems], ["untracked-nav-target"])
        self.assertEqual(problems[0]["surface"], "context/nav/*.json")

    def test_a_page_on_disk_but_never_added_is_still_untracked(self):
        # "It works on my machine" in one case: the file exists, the nav is
        # right, and the commit does not contain it.
        (self.docs / "alpha" / "draft.md").write_text("# Draft\n", encoding="utf-8")
        self.write_nav(["alpha/index.md", "alpha/draft.md"])
        _git(self.tmp, "add", "nav.yml")
        _git(self.tmp, "commit", "-q", "-m", "nav only")

        self.assertEqual(self.kinds(), ["untracked-nav-target"])


class TestFactCountMismatch(TrackedSurfacesFixture):
    def test_a_fact_sheet_that_over_counts_is_caught(self):
        # How the defect showed up in the fact sheets: they counted pages that
        # were on the build runner's disk and not in the commit.
        self.write_facts(12)
        self.commit_all()

        problems = cts.check()["problems"]
        self.assertEqual([p["kind"] for p in problems], ["fact-count-mismatch"])
        self.assertIn("claim 12 documents, git tracks 2", problems[0]["message"])

    def test_a_fact_sheet_with_no_count_is_not_a_problem(self):
        # Absent is not wrong: only a count that disagrees is.
        (self.facts_dir / "alpha.json").write_text(
            json.dumps({"project": {"name": "alpha"}, "corpus": {}}), encoding="utf-8")
        self.commit_all()

        self.assertEqual(cts.check()["problems"], [])


if __name__ == "__main__":
    unittest.main()
