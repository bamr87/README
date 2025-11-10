"""
Integration tests for the documentation aggregator.
"""

import os
import sys
import tempfile
import unittest
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.aggregate import process_repository
from scripts.process import main as process_main


class TestIntegration(unittest.TestCase):
    """Integration tests for the full documentation aggregator workflow."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.raw_docs_dir = Path(self.temp_dir) / "raw_docs"
        self.docs_dir = Path(self.temp_dir) / "docs"
        self.raw_docs_dir.mkdir()
        self.docs_dir.mkdir()
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def test_full_workflow_simple_repo(self):
        """Test the full workflow with a simple repository."""
        # Test with a simple repository
        repo_url = "https://github.com/octocat/Hello-World"
        
        # Process repository
        result = process_repository(repo_url, self.temp_dir, str(self.raw_docs_dir))
        
        # Check repository processing
        self.assertTrue(result['success'])
        self.assertGreater(result['files_found'], 0)
        self.assertGreater(result['files_copied'], 0)
        
        # Check if files were copied
        raw_files = list(self.raw_docs_dir.rglob("*"))
        self.assertGreater(len(raw_files), 0)
        
        # Process the files
        os.chdir(self.temp_dir)
        process_main()
        
        # Check if organized files were created
        organized_files = list(self.docs_dir.rglob("*.md"))
        self.assertGreater(len(organized_files), 0)
        
        # Check if files have front matter
        for file_path in organized_files:
            content = file_path.read_text()
            self.assertIn("---", content)  # Should have front matter
            self.assertIn("title:", content)
            self.assertIn("category:", content)
    
    def test_workflow_with_multiple_repos(self):
        """Test workflow with multiple repositories."""
        repos = [
            "https://github.com/octocat/Hello-World",
            # Add more repos as needed for testing
        ]
        
        results = []
        for repo_url in repos:
            result = process_repository(repo_url, self.temp_dir, str(self.raw_docs_dir))
            results.append(result)
        
        # Check that all repositories were processed successfully
        for result in results:
            self.assertTrue(result['success'])
            self.assertGreater(result['files_found'], 0)
    
    def test_error_handling_invalid_repo(self):
        """Test error handling with invalid repository URL."""
        invalid_repo = "https://github.com/nonexistent/repo"
        
        result = process_repository(invalid_repo, self.temp_dir, str(self.raw_docs_dir))
        
        # Should handle error gracefully
        self.assertFalse(result['success'])
        self.assertIsNotNone(result['error'])
        self.assertEqual(result['files_found'], 0)
        self.assertEqual(result['files_copied'], 0)
    
    def test_file_organization_by_category(self):
        """Test that files are organized correctly by category."""
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
        
        # Check organization
        expected_categories = {
            "api-docs.md": "api",
            "user-guide.md": "user-guides",
            "installation.md": "setup",
            "misc-doc.md": "misc"
        }
        
        for filename, expected_category in expected_categories.items():
            expected_path = self.docs_dir / expected_category / "test_repo" / filename
            self.assertTrue(expected_path.exists(), f"File {filename} not found in {expected_category} category")
            
            # Check front matter
            content = expected_path.read_text()
            self.assertIn(f"category: {expected_category}", content)
    
    def test_front_matter_generation(self):
        """Test front matter generation for different content types."""
        test_cases = [
            {
                "filename": "api-docs.md",
                "content": "# API Documentation\n\nThis document describes our REST API endpoints.",
                "expected_category": "api",
                "expected_tags": ["api"]
            },
            {
                "filename": "tutorial.md",
                "content": "# Getting Started Tutorial\n\nThis tutorial will help you get started.",
                "expected_category": "user-guides",
                "expected_tags": ["user-guides"]
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
            expected_path = self.docs_dir / case["expected_category"] / "test_repo" / case["filename"]
            self.assertTrue(expected_path.exists())
            
            content = expected_path.read_text()
            
            # Check front matter
            self.assertIn("---", content)
            self.assertIn("title:", content)
            self.assertIn("summary:", content)
            self.assertIn("tags:", content)
            self.assertIn(f"category: {case['expected_category']}", content)
            
            # Check specific tags
            for tag in case["expected_tags"]:
                self.assertIn(tag, content)

if __name__ == "__main__":
    unittest.main()
