"""
Unit tests for file processing functionality.
"""

import re
import shutil
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
    strip_hidden,
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


class TestHiddenCarriers(unittest.TestCase):
    """Ingest drops what a reader never sees but an agent reads (issue #52)."""

    FAMILY = "\U0001F468\u200d\U0001F469\u200d\U0001F467"   # an emoji ZWJ sequence
    SCOTLAND = ("\U0001F3F4\U000E0067\U000E0062\U000E0073"   # a subdivision flag:
                "\U000E0063\U000E0074\U000E007F")             # tag letters + cancel tag
    RAW = (
        "---\ntitle: Carriers\n---\n\n"
        "# Carriers\n\n"
        "Visible text.<!-- hidden --> More text, then a \u202e bidi override.\n\n"
        "```html\n<!-- kept: a comment in a code sample is content -->\n```\n\n"
        "Inline `<!-- kept too -->` code, a family " + FAMILY
        + " and a flag " + SCOTLAND + ".\n"
    )

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)

    def _process(self, text, repo="test_repo", name="page.md"):
        raw = self.tmp / "raw_docs" / repo
        raw.mkdir(parents=True, exist_ok=True)
        (raw / name).write_text(text, encoding="utf-8")
        process_markdown_file(raw / name, self.tmp / "docs")
        return (self.tmp / "docs" / repo / name).read_text(encoding="utf-8")

    def test_prose_loses_hidden_carriers_and_keeps_content(self):
        out = self._process(self.RAW)
        self.assertNotIn("<!-- hidden -->", out)
        self.assertNotIn("\u202e", out)
        self.assertIn("Visible text. More text, then a ", out)
        self.assertIn("```html\n<!-- kept: a comment in a code sample is content -->\n```", out)
        self.assertIn("`<!-- kept too -->`", out)
        self.assertIn(self.FAMILY, out)
        self.assertIn(self.SCOTLAND, out)

    def test_a_second_run_changes_nothing(self):
        first = self._process(self.RAW)
        self.assertEqual(self._process(first, repo="again"), first)
        self.assertEqual(strip_hidden(strip_hidden(self.RAW)), strip_hidden(self.RAW))

    def test_joiners_survive_only_between_non_ascii_characters(self):
        hindi = "\u0915\u094d\u200d\u0937"     # KA, VIRAMA, ZWJ, SSA
        persian = "\u0645\u06cc\u200c\u062e"    # a ZWNJ inside a word
        self.assertEqual(strip_hidden(f"{hindi} {persian}"), f"{hindi} {persian}")
        # Between ASCII letters a joiner only splits a keyword out of a screen.
        self.assertEqual(strip_hidden("ig\u200dnore pre\u200cvious"), "ignore previous")

    def test_tag_characters_are_dropped_outside_a_flag(self):
        smuggled = "".join(chr(0xE0000 + ord(c)) for c in "obey me")
        self.assertEqual(strip_hidden(f"text{smuggled} end"), "text end")

    def test_a_comment_only_line_keeps_the_paragraph_break(self):
        self.assertEqual(strip_hidden("one\n<!-- a note\nover two lines -->\ntwo\n"),
                         "one\n\ntwo\n")
        self.assertEqual(strip_hidden("one\n\n<!-- note -->\n\ntwo\n"), "one\n\ntwo\n")

    def test_a_comment_behind_a_block_marker_leaves_no_bare_marker(self):
        # A bare `-` under a list item is a setext underline: Python-Markdown
        # would turn "b" into a heading. The comment is emptied instead.
        raw = "- a\n- b\n- <!-- x -->\n\nNext.\n"
        out = strip_hidden(raw)
        self.assertNotIn("<!-- x -->", out)
        self.assertNotIn("-", [line.strip() for line in out.split("\n")])
        self.assertEqual(out, "- a\n- b\n- <!---->\n\nNext.\n")
        self.assertEqual(strip_hidden(out), out)
        # An ordered list keeps its numbering, a trailing comment does not
        # become a setext underline, and the comments behind a nested marker
        # become one empty comment.
        for raw, kept in (
                ("1. a\n2. <!-- x -->\n3. b\n", "1. a\n2. <!---->\n3. b\n"),
                ("Title\n=== <!-- x -->\n", "Title\n=== <!---->\n"),
                ("> q\n> - <!-- a --> <!-- b -->\n", "> q\n> - <!---->\n")):
            self.assertEqual(strip_hidden(raw), kept)
            self.assertEqual(strip_hidden(kept), kept)

    def test_empty_and_unclosed_comments_are_left_alone(self):
        separator = "1. a\n2. b\n<!-- -->\n1. c\n"   # an empty comment splits two lists
        self.assertEqual(strip_hidden(separator), separator)
        unclosed = "a literal <!-- that never closes\n"
        self.assertEqual(strip_hidden(unclosed), unclosed)

    def test_front_matter_values_lose_formatting_characters(self):
        out = self._process("---\ndescription: \"De\u200bscrip\u202etion\"\n---\n\nBody text.\n")
        self.assertIn("description: Description", out)
        self.assertNotIn("\u200b", out)

    def test_a_leading_bom_does_not_hide_the_front_matter(self):
        out = self._process("\ufeff---\nauthor: Someone\n---\n\n# Bom\n")
        self.assertTrue(out.startswith("---\n"))
        self.assertIn("author: Someone", out)
        self.assertNotIn("\ufeff", out)


if __name__ == "__main__":
    unittest.main()
