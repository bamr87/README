"""Tests for the browser side of the vault: the scripts under brain_site/assets.

The logic the workspace runs with no DOM (the explorer tree, search, the saved
layout) has its own suite in tests/js, written for node's built-in test runner.
This module runs that suite, so the one command that gates a change covers it,
and checks that the engine's view pages and the browser's views agree.
"""

import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT))

from scripts.context_engine import brain  # noqa: E402
from scripts.context_engine.registry import BrainConfig, Project, Registry  # noqa: E402

ASSETS = ROOT / "brain_site" / "assets"
SCRIPTS = ("brain.js", "workspace.js")
NODE = shutil.which("node")
HOST = re.compile(r'data-brain-view="([\w-]+)"')
# brain.js adds its views as `api.views.<name> =`; a later script registers one.
REGISTERED = re.compile(r'api\.views\.([\w-]+)\s*=|api\.register\("([\w-]+)"')


def _node(*args):
    return subprocess.run([NODE, *args], capture_output=True, text=True, timeout=120, cwd=ROOT)


@unittest.skipIf(NODE is None, "node is not installed")
class TestBrowserScripts(unittest.TestCase):
    def test_the_scripts_parse(self):
        for name in SCRIPTS:
            result = _node("--check", str(ASSETS / name))
            self.assertEqual(result.returncode, 0, f"{name}: {result.stderr}")

    def test_the_workspace_logic_suite_passes(self):
        result = _node("--test", str(ROOT / "tests" / "js" / "workspace.test.cjs"))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_workspace_logic_loads_without_a_browser(self):
        result = _node("-e", "const core = require('./brain_site/assets/workspace.js');"
                             "if (typeof core.buildTree !== 'function') process.exit(1);")
        self.assertEqual(result.returncode, 0, result.stderr)


class TestViewsAgree(unittest.TestCase):
    """A view page with no view behind it is an empty page on the site."""

    def _views_in_the_browser(self):
        found = set()
        for name in SCRIPTS:
            for match in REGISTERED.finditer((ASSETS / name).read_text(encoding="utf-8")):
                found.add(match.group(1) or match.group(2))
        return found

    def test_every_view_page_has_a_view_in_the_browser(self):
        registry = Registry(hub={}, projects=[Project(name="p", repo="o/p", url="u")],
                            brain=BrainConfig())
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "docs" / "p").mkdir(parents=True)
            (root / "docs" / "p" / "a.md").write_text("---\ntitle: A\n---\nText.\n", encoding="utf-8")
            brain.generate(registry, docs_dir=root / "docs", notes_dir=root / "notes",
                           cache_path=root / "synthesis.json", log_path=root / "log.jsonl",
                           manifest_path=root / "m.json")
            asked = {}
            for page in sorted((root / "docs" / "brain").glob("*.md")):
                for view in HOST.findall(page.read_text(encoding="utf-8")):
                    asked[view] = page.name
        self.assertEqual(asked, {"graph": "graph.md", "canvas": "canvas.md", "table": "pages.md",
                                 "workspace": "workspace.md"})
        self.assertEqual(set(asked) - self._views_in_the_browser(), set())

    def test_the_workspace_reads_and_never_writes(self):
        # The vault is generated: the workspace may keep a layout in the
        # reader's browser, and nothing else. No request but a GET.
        text = (ASSETS / "workspace.js").read_text(encoding="utf-8")
        self.assertNotRegex(text, r'method\s*:\s*["\'](POST|PUT|PATCH|DELETE)')
        self.assertNotIn("XMLHttpRequest", text)
        self.assertNotIn("sendBeacon", text)
        self.assertEqual(len(re.findall(r"\bfetch\(", text)), 1)


if __name__ == "__main__":
    unittest.main()
