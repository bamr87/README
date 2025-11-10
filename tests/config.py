"""
Configuration for the testing framework.
"""

from pathlib import Path
from typing import Any, Dict, List

# Test configuration
TEST_CONFIG = {
    "test_repos": [
        {
            "url": "https://github.com/octocat/Hello-World",
            "expected_files": ["README"],
            "expected_categories": ["misc"],
            "description": "Simple repository with basic README"
        },
        {
            "url": "https://github.com/facebook/react",
            "expected_files": ["README.md"],
            "expected_categories": ["user-guides", "development", "api"],
            "description": "Large repository with comprehensive documentation"
        },
        {
            "url": "https://github.com/microsoft/vscode",
            "expected_files": ["README.md"],
            "expected_categories": ["user-guides", "development", "api"],
            "description": "Complex repository with extensive docs"
        }
    ],
    "test_categories": {
        "api": ["api", "endpoint", "rest", "graphql", "swagger", "openapi", "reference"],
        "user-guides": ["guide", "tutorial", "how-to", "walkthrough", "getting started", "quick start"],
        "setup": ["install", "setup", "configuration", "config", "deployment"],
        "development": ["development", "contributing", "build", "testing", "ci/cd", "pipeline"],
        "architecture": ["architecture", "design", "overview", "concepts", "principles"],
        "misc": []  # Default category
    },
    "test_file_types": [".md", "README", "readme"],
    "timeout_seconds": 300,  # 5 minutes timeout for repo operations
    "max_files_per_repo": 100,  # Limit for testing
    "test_output_dir": "tests/results",
    "fixtures_dir": "tests/fixtures"
}

# Test result storage configuration
RESULT_STORAGE = {
    "format": "json",  # json, yaml, csv
    "include_metadata": True,
    "include_file_contents": False,  # Set to True for detailed analysis
    "include_timing": True,
    "include_errors": True
}

# Test environment setup
TEST_ENV = {
    "temp_dir": "tests/temp",
    "cleanup_after_test": True,
    "parallel_execution": False,  # Set to True for parallel repo processing
    "max_parallel_repos": 3
}

def get_test_repo_config(repo_url: str) -> Dict[str, Any]:
    """Get configuration for a specific test repository."""
    for repo in TEST_CONFIG["test_repos"]:
        if repo["url"] == repo_url:
            return repo
    return {}

def get_expected_categories() -> List[str]:
    """Get list of expected categories."""
    return list(TEST_CONFIG["test_categories"].keys())

def get_test_output_path() -> Path:
    """Get the test output directory path."""
    return Path(TEST_CONFIG["test_output_dir"])

def get_fixtures_path() -> Path:
    """Get the fixtures directory path."""
    return Path(TEST_CONFIG["fixtures_dir"])
