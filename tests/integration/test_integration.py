"""
Integration tests for the documentation aggregator. The crawl tests run the
real crawler, scripts/aggregate.sh, against GitHub, so they need the network.
"""

import os
import sys
import tempfile
import unittest
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.process import main as process_main
from tests.crawl import repo_dir_name, run_aggregate


class TestIntegration(unittest.TestCase):
    """Integration tests for the full documentation aggregator workflow."""

    def setUp(self):
        """Set up test fixtures."""
        self.orig_cwd = os.getcwd()
        self.temp_dir = tempfile.mkdtemp()
        self.raw_docs_dir = Path(self.temp_dir) / "raw_docs"
        self.docs_dir = Path(self.temp_dir) / "docs"
        self.raw_docs_dir.mkdir()
        self.docs_dir.mkdir()
        # aggregate.sh gets a working directory of its own
        self.crawl_dir = Path(self.temp_dir) / "crawl"

    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        # Restore cwd — tests chdir into temp_dir; leaking it breaks
        # later tests that rely on repo-relative paths.
        os.chdir(self.orig_cwd)
        shutil.rmtree(self.temp_dir)

    def crawled_files(self, repo_url):
        corpus = self.crawl_dir / "docs" / repo_dir_name(repo_url)
        return [p for p in corpus.rglob("*") if p.is_file()]

    def test_full_workflow_simple_repo(self):
        """Crawl a small public repository end to end with scripts/aggregate.sh."""
        repo_url = "https://github.com/octocat/Hello-World"

        result = run_aggregate(self.crawl_dir, [repo_url])
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

        # Hello-World ships a bare "README" with no .md extension; filenames
        # are preserved
        organized_files = self.crawled_files(repo_url)
        self.assertGreater(len(organized_files), 0)

        # Check if files have front matter
        for file_path in organized_files:
            content = file_path.read_text()
            self.assertIn("---", content)  # Should have front matter
            self.assertIn("title:", content)
            self.assertIn("source_file:", content)

    def test_workflow_with_multiple_repos(self):
        """Test workflow with multiple repositories."""
        repos = [
            "https://github.com/octocat/Hello-World",
            # Add more repos as needed for testing
        ]

        result = run_aggregate(self.crawl_dir, repos)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

        # Check that every repository reached the corpus
        for repo_url in repos:
            self.assertGreater(len(self.crawled_files(repo_url)), 0, repo_url)

    def test_error_handling_invalid_repo(self):
        """A repository that cannot be cloned fails the crawl and is named."""
        invalid_repo = "https://github.com/nonexistent/repo"

        result = run_aggregate(self.crawl_dir, [invalid_repo])

        self.assertEqual(result.returncode, 1, result.stdout + result.stderr)
        self.assertIn(f"  - {invalid_repo}\n", result.stderr)
        self.assertEqual(self.crawled_files(invalid_repo), [])

    def test_file_organization_by_repo(self):
        """Test that files are organized under docs/{repo_name}/."""
        # Create test files with different content
        test_files = {
            "api-docs.md": "# API Reference\n\nThis is API documentation.",
            "user-guide.md": "# User Guide\n\nThis is a user guide.",
            "installation.md": "# Installation\n\nHow to install the software.",
            "misc-doc.md": "# Random Document\n\nSome random content."
        }

        # Create raw docs structure
        raw_repo_dir = self.raw_docs_dir / "test_repo"
        raw_repo_dir.mkdir()

        for filename, content in test_files.items():
            (raw_repo_dir / filename).write_text(content)

        # Process files
        os.chdir(self.temp_dir)
        process_main()

        # Check organization: docs/{repo_name}/{filename}
        for filename in test_files:
            expected_path = self.docs_dir / "test_repo" / filename
            self.assertTrue(expected_path.exists(), f"File {filename} not found under test_repo")

            # Check front matter
            content = expected_path.read_text()
            self.assertIn("title:", content)
            self.assertIn(f"source_file: {filename}", content)
    
    def test_front_matter_generation(self):
        """Test front matter generation for different content types."""
        test_cases = [
            {
                "filename": "api-docs.md",
                "content": "# API Documentation\n\nThis document describes our REST API endpoints.",
                "expected_title": "API Documentation"
            },
            {
                "filename": "tutorial.md",
                "content": "# Getting Started Tutorial\n\nThis tutorial will help you get started.",
                "expected_title": "Getting Started Tutorial"
            }
        ]

        # Create test files
        raw_repo_dir = self.raw_docs_dir / "test_repo"
        raw_repo_dir.mkdir()

        for case in test_cases:
            (raw_repo_dir / case["filename"]).write_text(case["content"])

        # Process files
        os.chdir(self.temp_dir)
        process_main()

        # Check results
        for case in test_cases:
            expected_path = self.docs_dir / "test_repo" / case["filename"]
            self.assertTrue(expected_path.exists())

            content = expected_path.read_text()

            # Check front matter
            self.assertIn("---", content)
            self.assertIn(f"title: {case['expected_title']}", content)
            self.assertIn(f"source_file: {case['filename']}", content)

if __name__ == "__main__":
    unittest.main()
