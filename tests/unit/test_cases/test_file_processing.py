"""
Unit tests for file processing functionality.
"""

import re
import sys
import tempfile
import unittest
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from scripts.process import (
    extract_title_from_content,
    generate_front_matter,
    process_markdown_file,
)


class TestTitleExtraction(unittest.TestCase):
    """Test cases for title extraction."""
    
    def test_extract_title_from_h1(self):
        """Test title extraction from H1 heading."""
        content = """# My Document Title

This is the content of the document.
"""
        result = extract_title_from_content(content)
        self.assertEqual(result, "My Document Title")
    
    def test_extract_title_from_front_matter(self):
        """Test title extraction from front matter."""
        content = """---
title: "Front Matter Title"
description: "A test document"
---

# H1 Title

Content here.
"""
        result = extract_title_from_content(content)
        self.assertEqual(result, "Front Matter Title")
    
    def test_extract_title_no_title(self):
        """Test title extraction when no title is found."""
        content = """This is just some content without a title.

More content here.
"""
        result = extract_title_from_content(content)
        self.assertIsNone(result)
    
    def test_extract_title_multiple_h1(self):
        """Test title extraction with multiple H1 headings."""
        content = """# First Title

Some content.

# Second Title

More content.
"""
        result = extract_title_from_content(content)
        self.assertEqual(result, "First Title")
    
    def test_extract_title_malformed_front_matter(self):
        """Test title extraction with malformed front matter."""
        content = """---
title: "Test Title"
invalid: yaml: content
---

# H1 Title

Content here.
"""
        result = extract_title_from_content(content)
        # Should fall back to H1 title
        self.assertEqual(result, "H1 Title")

class TestFrontMatterGeneration(unittest.TestCase):
    """Test cases for front matter generation."""
    
    def test_generate_front_matter_basic(self):
        """Test basic front matter generation."""
        content = """# API Documentation

This document describes our REST API endpoints.
"""
        result = generate_front_matter(content, "api-docs.md")

        self.assertEqual(result["title"], "API Documentation")
        self.assertEqual(result["source_file"], "api-docs.md")

    def test_generate_front_matter_with_existing_front_matter(self):
        """Test front matter generation with existing front matter."""
        content = """---
title: "Existing Title"
author: "Test Author"
---

# API Documentation

This document describes our REST API endpoints.
"""
        result = generate_front_matter(content, "api-docs.md")

        # Title from the existing front matter wins over the H1
        self.assertEqual(result["title"], "Existing Title")
        self.assertEqual(result["source_file"], "api-docs.md")

    def test_generate_front_matter_empty_content(self):
        """Test front matter generation with empty content."""
        result = generate_front_matter("", "empty.md")

        # Title falls back to the prettified filename stem
        self.assertEqual(result["title"], "Empty")
        self.assertEqual(result["source_file"], "empty.md")

class TestFileProcessing(unittest.TestCase):
    """Test cases for file processing."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.raw_dir = Path(self.temp_dir) / "raw_docs" / "test_repo"
        self.raw_dir.mkdir(parents=True)
        self.dest_dir = Path(self.temp_dir) / "docs"
        self.dest_dir.mkdir()
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def test_process_markdown_file_basic(self):
        """Test basic markdown file processing."""
        # Create test file
        test_file = self.raw_dir / "test.md"
        test_file.write_text("""# Test Document

This is a test document for API documentation.
""")
        
        # Process the file
        process_markdown_file(test_file, self.dest_dir)

        # Check if file was created in correct location (docs/{repo_name}/...)
        expected_path = self.dest_dir / "test_repo" / "test.md"
        self.assertTrue(expected_path.exists())

        # Check content
        content = expected_path.read_text()
        self.assertIn("---", content)  # Should have front matter
        self.assertIn("title: Test Document", content)
        self.assertIn("source_file: test.md", content)
        self.assertIn("# Test Document", content)
    
    def test_process_markdown_file_with_existing_front_matter(self):
        """Test processing file with existing front matter."""
        # Create test file with front matter
        test_file = self.raw_dir / "test.md"
        test_file.write_text("""---
title: "Existing Title"
author: "Test Author"
---

# Test Document

This is a test document for API documentation.
""")
        
        # Process the file
        process_markdown_file(test_file, self.dest_dir)

        # Check if file was created (docs/{repo_name}/...)
        expected_path = self.dest_dir / "test_repo" / "test.md"
        self.assertTrue(expected_path.exists())

        # Check that existing front matter was preserved
        content = expected_path.read_text()
        self.assertIn("author: Test Author", content)
        # The title should be updated to the H1 title, not the front matter title
        self.assertIn("title: Test Document", content)
    
    def test_process_markdown_file_error_handling(self):
        """Test error handling in file processing."""
        # Create a file that will cause an error (invalid path)
        invalid_file = Path("/invalid/path/test.md")
        
        # This should not raise an exception
        try:
            process_markdown_file(invalid_file, self.dest_dir)
        except Exception as e:
            self.fail(f"File processing should handle errors gracefully: {e}")


class TestSecretScreen(unittest.TestCase):
    """A credential committed upstream never reaches docs/ (README #53)."""

    REPO_ROOT = Path(__file__).resolve().parents[3]

    def setUp(self):
        import shutil
        from tests.fixtures.fake_secrets import PLACEHOLDERS, fake_secrets
        self.fakes, self.placeholders = fake_secrets(), PLACEHOLDERS
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)
        repo = self.tmp / "raw_docs" / "demo"
        (repo / "guides").mkdir(parents=True)
        (repo / "README.md").write_text("# Demo\n\nNothing secret here.\n", encoding="utf-8")
        self.page = repo / "guides" / "setup.md"

    def _write_leaky_page(self):
        """One fake credential per kind, then the placeholders; records each line."""
        text = "---\ntitle: Setup\n---\n\n# Setup\n\n"
        self.lines = {}
        for kind, value in self.fakes.items():
            self.lines[kind] = text.count("\n") + 1
            text += f"{kind}: {value}\n"
        text += "\nPlaceholders:\n\n" + "".join(f"- `{p}`\n" for p in self.placeholders)
        self.page.write_text(text, encoding="utf-8")

    def _process(self):
        import subprocess
        return subprocess.run([sys.executable, str(self.REPO_ROOT / "scripts" / "process.py")],
                              cwd=self.tmp, capture_output=True, text=True, timeout=120)

    def _screen(self):
        import json
        path = self.tmp / "docs" / "results" / "secret_screen.json"
        return path.read_text(encoding="utf-8"), json.loads(path.read_text(encoding="utf-8"))

    def test_credentials_are_redacted_listed_and_fail_the_run(self):
        self._write_leaky_page()
        done = self._process()
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)

        page = (self.tmp / "docs" / "demo" / "guides" / "setup.md").read_text(encoding="utf-8")
        report_text, report = self._screen()
        for kind, value in self.fakes.items():
            self.assertIn(f"{kind}: [REDACTED:{kind}]", page)
            for surface in (page, report_text, done.stdout, done.stderr):
                self.assertNotIn(value, surface)
        for placeholder in self.placeholders:
            self.assertIn(f"- `{placeholder}`", page)

        self.assertEqual(report["pages_screened"], 2)
        self.assertEqual(report["hits"], [
            {"project": "demo", "path": "guides/setup.md", "line": line, "kind": kind}
            for kind, line in sorted(self.lines.items(), key=lambda item: item[1])])
        self.assertFalse((self.tmp / "raw_docs").exists())

    def test_a_clean_crawl_passes_and_leaves_no_report(self):
        """Nothing new lands in the committed corpus; a stale report goes."""
        stale = self.tmp / "docs" / "results" / "secret_screen.json"
        stale.parent.mkdir(parents=True)
        stale.write_text("{}\n", encoding="utf-8")
        self.page.write_text("# Setup\n\nUse `gh auth login`.\n", encoding="utf-8")
        done = self._process()
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertFalse(stale.exists())
        written = sorted(p.relative_to(self.tmp / "docs").as_posix()
                         for p in (self.tmp / "docs").rglob("*") if p.is_file())
        self.assertEqual(written, ["demo/README.md", "demo/guides/setup.md"])

    def test_process_markdown_file_returns_the_page_hits(self):
        self._write_leaky_page()
        hits = process_markdown_file(self.page, self.tmp / "docs")
        self.assertEqual([(h["project"], h["path"], h["line"], h["kind"]) for h in hits],
                         [("demo", "guides/setup.md", line, kind)
                          for kind, line in self.lines.items()])

    def test_aggregate_fails_when_process_fails(self):
        """aggregate.sh finishes the corpus, then exits with process.py's status."""
        import importlib.util
        import os
        import shutil
        import subprocess
        if not (shutil.which("bash") and importlib.util.find_spec("yaml")
                and importlib.util.find_spec("requests")):
            self.skipTest("needs bash, and yaml + requests so aggregate.sh builds no venv")
        work = self.tmp / "crawl"
        for folder in ("scripts", "tools", "bin"):
            (work / folder).mkdir(parents=True)
        shutil.copy(self.REPO_ROOT / "scripts" / "aggregate.sh", work / "scripts")
        (work / "repos.txt").write_text("", encoding="utf-8")
        (work / "tools" / "unwrap-prose.py").write_text(
            "open('unwrapped', 'w').close()\n", encoding="utf-8")
        shim = work / "bin" / "python3"
        shim.write_text(f'#!/bin/sh\nexec "{sys.executable}" "$@"\n', encoding="utf-8")
        shim.chmod(0o755)
        env = {**os.environ, "PATH": f"{shim.parent}{os.pathsep}{os.environ.get('PATH', '')}"}

        for status in (3, 0):
            with self.subTest(status=status):
                (work / "scripts" / "process.py").write_text(
                    f"raise SystemExit({status})\n", encoding="utf-8")
                done = subprocess.run(["bash", "scripts/aggregate.sh"], cwd=work, env=env,
                                      capture_output=True, text=True, timeout=120)
                self.assertEqual(done.returncode, status, done.stdout + done.stderr)
                self.assertTrue((work / "unwrapped").exists(), "the corpus was not finished")
                self.assertFalse((work / "temp").exists(), "temp/ was not cleaned up")
                (work / "unwrapped").unlink()


class TestIngestProseNormalization(unittest.TestCase):
    """The crawl must leave the corpus in the state the prose gate expects."""

    REPO_ROOT = Path(__file__).resolve().parents[3]

    def setUp(self):
        self.aggregate = (self.REPO_ROOT / "scripts" / "aggregate.sh").read_text()
        self.workflow = (
            self.REPO_ROOT / ".github" / "workflows" / "markdown-oneline.yml"
        ).read_text()

    @staticmethod
    def _excludes(text):
        return set(re.findall(r"--exclude '([^']+)'", text))

    def test_aggregate_unwraps_the_corpus_after_processing(self):
        """aggregate.sh unwraps docs/ once process.py has written it."""
        self.assertIn("tools/unwrap-prose.py --write docs", self.aggregate)
        self.assertLess(
            self.aggregate.index("scripts/process.py"),
            self.aggregate.index("tools/unwrap-prose.py"),
            "the unwrap step must run after process.py writes docs/",
        )

    CORPUS_BOUNDARY = "^docs/"

    def test_the_gate_leaves_the_corpus_to_ingest(self):
        """Only one side may rewrite docs/, or the two undo each other.

        The crawl re-imports upstream prose wrapped and unwraps it on the way
        in; the pull-request gate must therefore skip docs/ entirely. When
        both covered it, every refresh handed the next markdown PR a
        whole-corpus rewrite that the following crawl undid.
        """
        self.assertIn(self.CORPUS_BOUNDARY, self._excludes(self.workflow),
                      "markdown-oneline.yml must exclude ^docs/: the corpus is "
                      "normalized at ingest by aggregate.sh")
        self.assertIn("tools/unwrap-prose.py --write docs", self.aggregate,
                      "aggregate.sh must be the side that normalizes docs/")

    def test_ingest_and_gate_agree_outside_the_corpus(self):
        """Where both sides can touch a file, they must skip the same ones.

        The two differ only by the corpus boundary above: everything else -
        SCHEMA.md, CHANGELOG.md - has to match, or a file one side unwraps
        is a file the other re-wraps.
        """
        gate_excludes = self._excludes(self.workflow)
        self.assertTrue(gate_excludes, "no --exclude found in markdown-oneline.yml")
        self.assertEqual(self._excludes(self.aggregate),
                         gate_excludes - {self.CORPUS_BOUNDARY})


if __name__ == "__main__":
    unittest.main()
