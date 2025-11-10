"""
Unit tests for repository operations functionality.
"""

import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import MagicMock, patch

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))


class TestRepoOperations(unittest.TestCase):
    """Test cases for repository operations."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.temp_dir = tempfile.mkdtemp()
        self.test_repo_url = "https://github.com/octocat/Hello-World"
    
    def tearDown(self):
        """Clean up test fixtures."""
        import shutil
        shutil.rmtree(self.temp_dir)
    
    def test_repo_name_extraction(self):
        """Test repository name extraction from URL."""
        from scripts.aggregate import extract_repo_name
        
        test_cases = [
            ("https://github.com/octocat/Hello-World", "Hello-World"),
            ("https://github.com/user/repo.git", "repo"),
            ("https://github.com/org/project-name", "project-name"),
            ("git@github.com:user/repo.git", "repo"),
        ]
        
        for url, expected in test_cases:
            with self.subTest(url=url):
                result = extract_repo_name(url)
                self.assertEqual(result, expected)
    
    def test_repo_url_validation(self):
        """Test repository URL validation."""
        from scripts.aggregate import is_valid_repo_url
        
        valid_urls = [
            "https://github.com/user/repo",
            "https://github.com/user/repo.git",
            "git@github.com:user/repo.git",
            "https://gitlab.com/user/repo",
        ]
        
        invalid_urls = [
            "not-a-url",
            "https://github.com/",
            "https://github.com/user/",
            "",
            None,
        ]
        
        for url in valid_urls:
            with self.subTest(url=url):
                self.assertTrue(is_valid_repo_url(url))
        
        for url in invalid_urls:
            with self.subTest(url=url):
                self.assertFalse(is_valid_repo_url(url))
    
    @patch('subprocess.run')
    def test_git_clone_success(self, mock_run):
        """Test successful git clone operation."""
        from scripts.aggregate import git_clone_repo

        # Mock successful git clone
        mock_run.return_value = MagicMock(returncode=0)
        
        result = git_clone_repo(self.test_repo_url, self.temp_dir)
        self.assertTrue(result)
        mock_run.assert_called_once()
    
    @patch('subprocess.run')
    def test_git_clone_failure(self, mock_run):
        """Test failed git clone operation."""
        from scripts.aggregate import git_clone_repo

        # Mock failed git clone
        mock_run.return_value = MagicMock(returncode=1)
        
        result = git_clone_repo(self.test_repo_url, self.temp_dir)
        self.assertFalse(result)
    
    def test_find_documentation_files(self):
        """Test finding documentation files in a directory."""
        from scripts.aggregate import find_documentation_files

        # Create test directory structure
        test_dir = Path(self.temp_dir) / "test_repo"
        test_dir.mkdir()
        
        # Create test files
        (test_dir / "README.md").write_text("# Test README")
        (test_dir / "docs").mkdir(parents=True)
        (test_dir / "docs" / "api.md").write_text("# API Documentation")
        (test_dir / "docs" / "guide.md").write_text("# User Guide")
        (test_dir / "src").mkdir(parents=True)
        (test_dir / "src" / "main.py").write_text("print('hello')")
        (test_dir / ".git").mkdir(parents=True)
        (test_dir / ".git" / "config").write_text("git config")
        
        # Find documentation files
        files = find_documentation_files(test_dir)
        
        # Should find .md files but not .git files
        self.assertIn(test_dir / "README.md", files)
        self.assertIn(test_dir / "docs" / "api.md", files)
        self.assertIn(test_dir / "docs" / "guide.md", files)
        self.assertNotIn(test_dir / "src" / "main.py", files)
        self.assertNotIn(test_dir / ".git" / "config", files)
    
    def test_copy_documentation_files(self):
        """Test copying documentation files."""
        from scripts.aggregate import copy_documentation_files

        # Create test directory structure
        test_dir = Path(self.temp_dir) / "test_repo"
        test_dir.mkdir()
        
        # Create test files
        (test_dir / "README.md").write_text("# Test README")
        (test_dir / "docs").mkdir(parents=True)
        (test_dir / "docs" / "api.md").write_text("# API Documentation")
        
        # Create destination directory
        dest_dir = Path(self.temp_dir) / "raw_docs" / "test_repo"
        
        # Copy files
        copy_documentation_files(test_dir, dest_dir)
        
        # Check if files were copied
        self.assertTrue((dest_dir / "README.md").exists())
        self.assertTrue((dest_dir / "docs" / "api.md").exists())
        
        # Check content
        self.assertEqual((dest_dir / "README.md").read_text(), "# Test README")
        self.assertEqual((dest_dir / "docs" / "api.md").read_text(), "# API Documentation")

if __name__ == "__main__":
    unittest.main()
