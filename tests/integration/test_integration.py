"""
Integration test for the collect stage, against a local git repository.
"""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.context_engine.collect import collect
from scripts.context_engine.registry import CollectRules, Project, Registry


def _git(cwd: Path, *args: str) -> None:
    subprocess.run(["git", "-c", "user.name=t", "-c", "user.email=t@example.com", *args],
                   cwd=cwd, check=True, capture_output=True)


class TestCollectFromGit(unittest.TestCase):
    def test_clone_select_and_prune(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            source = root / "origin"
            (source / "docs").mkdir(parents=True)
            (source / "tests").mkdir()
            (source / "README.md").write_text("# Hello\n\nSee [[Guide]].\n")
            (source / "docs" / "guide.md").write_text("---\ntitle: Guide\n---\nBody\n")
            (source / "tests" / "fixture.md").write_text("# Fixture\n")
            _git(source, "init", "-q", "-b", "main")
            _git(source, "add", "-A")
            _git(source, "commit", "-qm", "seed")

            project = Project(name="demo", repo="o/demo", url=str(source))
            registry = Registry(hub={}, projects=[project],
                                collect=CollectRules(exclude=["tests/**"]))
            kwargs = dict(docs_dir=root / "docs", cache_dir=root / "cache" / "collect",
                          manifest_path=root / "m.json", log_path=root / "l.jsonl")
            collect(registry, **kwargs)
            readme = (root / "docs" / "demo" / "README.md").read_text()
            self.assertIn("[[demo/docs/guide|Guide]]", readme)
            self.assertFalse((root / "docs" / "demo" / "tests").exists())

            _git(source, "rm", "-q", "docs/guide.md")
            _git(source, "commit", "-qm", "drop")
            collect(registry, **kwargs)
            self.assertFalse((root / "docs" / "demo" / "docs" / "guide.md").exists())


if __name__ == "__main__":
    unittest.main()
