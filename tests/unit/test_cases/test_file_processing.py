"""
Unit tests for file processing functionality.
"""

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
        
        self.assertIn("title", result)
        self.assertIn("summary", result)
        self.assertIn("tags", result)
        self.assertIn("category", result)
        self.assertIn("source_file", result)
        self.assertEqual(result["source_file"], "api-docs.md")
        self.assertEqual(result["category"], "api")
    
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
        
        # Should preserve existing fields and add new ones
        self.assertEqual(result["title"], "Existing Title")
        self.assertIn("summary", result)
        self.assertIn("tags", result)
        self.assertEqual(result["category"], "api")
    
    def test_generate_front_matter_empty_content(self):
        """Test front matter generation with empty content."""
        result = generate_front_matter("", "empty.md")
        
        self.assertIn("title", result)
        self.assertIn("summary", result)
        self.assertIn("tags", result)
        self.assertEqual(result["category"], "misc")

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
        
        # Check if file was created in correct location
        expected_path = self.dest_dir / "api" / "test_repo" / "test.md"
        self.assertTrue(expected_path.exists())
        
        # Check content
        content = expected_path.read_text()
        self.assertIn("---", content)  # Should have front matter
        self.assertIn("title:", content)
        self.assertIn("category: api", content)
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
        
        # Check if file was created
        expected_path = self.dest_dir / "api" / "test_repo" / "test.md"
        self.assertTrue(expected_path.exists())
        
        # Check that existing front matter was preserved
        content = expected_path.read_text()
        self.assertIn("author: Test Author", content)
        self.assertIn("category: api", content)
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

if __name__ == "__main__":
    unittest.main()
