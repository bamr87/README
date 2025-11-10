"""
Unit tests for content categorization functionality.
"""

import sys
import unittest
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

from scripts.process import categorize_content, generate_summary, generate_tags


class TestCategorization(unittest.TestCase):
    """Test cases for content categorization."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.test_cases = [
            {
                "content": "# API Reference\n\nThis document describes our REST API endpoints.",
                "expected_category": "api",
                "description": "API documentation content"
            },
            {
                "content": "# User Guide\n\nThis tutorial will help you get started.",
                "expected_category": "user-guides",
                "description": "User guide content"
            },
            {
                "content": "# Installation Guide\n\nFollow these steps to install the application.",
                "expected_category": "setup",
                "description": "Installation content"
            },
            {
                "content": "# Contributing\n\nHow to contribute to this project.",
                "expected_category": "development",
                "description": "Development content"
            },
            {
                "content": "# Architecture Overview\n\nSystem design and concepts.",
                "expected_category": "architecture",
                "description": "Architecture content"
            },
            {
                "content": "# Random Document\n\nSome miscellaneous content.",
                "expected_category": "misc",
                "description": "Miscellaneous content"
            }
        ]
    
    def test_categorization_basic(self):
        """Test basic categorization functionality."""
        for case in self.test_cases:
            with self.subTest(description=case["description"]):
                result = categorize_content(case["content"])
                self.assertEqual(result, case["expected_category"])
    
    def test_categorization_case_insensitive(self):
        """Test that categorization is case insensitive."""
        content = "# API REFERENCE\n\nThis document describes our REST API endpoints."
        result = categorize_content(content)
        self.assertEqual(result, "api")
    
    def test_categorization_multiple_keywords(self):
        """Test categorization with multiple keywords."""
        content = "# API Guide and Tutorial\n\nThis is both an API reference and a tutorial."
        result = categorize_content(content)
        # Should match the first pattern found (api comes before user-guides in the function)
        self.assertEqual(result, "api")
    
    def test_categorization_empty_content(self):
        """Test categorization with empty content."""
        result = categorize_content("")
        self.assertEqual(result, "misc")
    
    def test_categorization_whitespace(self):
        """Test categorization with whitespace-only content."""
        result = categorize_content("   \n\t  \n  ")
        self.assertEqual(result, "misc")

class TestTagGeneration(unittest.TestCase):
    """Test cases for tag generation."""
    
    def setUp(self):
        """Set up test fixtures."""
        self.test_cases = [
            {
                "content": "This is a Python API with Django framework.",
                "expected_tags": ["python", "api"],
                "description": "Python API content"
            },
            {
                "content": "JavaScript React application with Node.js backend.",
                "expected_tags": ["javascript"],
                "description": "JavaScript React content"
            },
            {
                "content": "Docker containerization with Kubernetes deployment.",
                "expected_tags": ["docker", "kubernetes"],
                "description": "Container content"
            },
            {
                "content": "AWS S3 storage with Lambda functions.",
                "expected_tags": ["aws"],
                "description": "AWS content"
            },
            {
                "content": "Unit testing with pytest framework.",
                "expected_tags": ["testing"],
                "description": "Testing content"
            }
        ]
    
    def test_tag_generation_basic(self):
        """Test basic tag generation."""
        for case in self.test_cases:
            with self.subTest(description=case["description"]):
                result = generate_tags(case["content"])
                for expected_tag in case["expected_tags"]:
                    self.assertIn(expected_tag, result)
    
    def test_tag_generation_empty_content(self):
        """Test tag generation with empty content."""
        result = generate_tags("")
        self.assertEqual(result, ["documentation"])
    
    def test_tag_generation_no_tech_keywords(self):
        """Test tag generation with no technology keywords."""
        result = generate_tags("Just some random text without technology keywords.")
        self.assertIn("documentation", result)

class TestSummaryGeneration(unittest.TestCase):
    """Test cases for summary generation."""
    
    def test_summary_generation_basic(self):
        """Test basic summary generation."""
        content = """# Test Document

This is the first paragraph that should be used as a summary. It contains meaningful content that describes what this document is about.

This is a second paragraph that should not be included in the summary.
"""
        result = generate_summary(content)
        # The summary should contain meaningful content from the first paragraph
        self.assertIn("first paragraph", result)
        self.assertNotIn("second paragraph", result)
    
    def test_summary_generation_with_front_matter(self):
        """Test summary generation with front matter."""
        content = """---
title: Test Document
---

# Test Document

This is the content that should be used for summary generation.
"""
        result = generate_summary(content)
        self.assertIn("content that should be used", result)
    
    def test_summary_generation_empty_content(self):
        """Test summary generation with empty content."""
        result = generate_summary("")
        self.assertEqual(result, "No summary available")
    
    def test_summary_generation_only_headers(self):
        """Test summary generation with only headers."""
        content = """# Header 1
## Header 2
### Header 3
"""
        result = generate_summary(content)
        self.assertEqual(result, "No summary available")

if __name__ == "__main__":
    unittest.main()
