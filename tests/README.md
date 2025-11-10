# Testing Framework for Documentation Aggregator

This directory contains a comprehensive testing framework for the documentation aggregator system.

## Overview

The testing framework provides:

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test the complete workflow with real repositories
- **Repository Testing**: Test against actual GitHub repositories
- **Result Storage**: Store and analyze test results
- **Configuration**: Flexible test configuration

## Directory Structure

```
tests/
├── unit/                    # Unit tests
│   ├── test_cases/         # Individual test case files
│   │   ├── test_categorization.py
│   │   ├── test_file_processing.py
│   │   └── test_repo_operations.py
│   └── test_runner.py      # Unit test runner
├── integration/            # Integration tests
│   ├── test_integration.py # Integration test cases
│   └── test_repo_runner.py # Repository test runner
├── fixtures/              # Test fixtures and sample data
│   └── sample_docs.py     # Sample documentation files
├── results/               # Test results storage
├── config.py              # Test configuration
├── test_runner.py         # Main test runner
└── README.md              # This file
```

## Quick Start

### Run All Tests
```bash
python tests/test_runner.py
```

### Run Unit Tests Only
```bash
python tests/test_runner.py --type unit
```

### Run Integration Tests Only
```bash
python tests/test_runner.py --type integration
```

### Run Quick Tests (Unit Tests Only)
```bash
python tests/test_runner.py --type quick
```

### Test Specific Repositories
```bash
python tests/test_runner.py --type integration --repos https://github.com/octocat/Hello-World
```

## Test Types

### Unit Tests

Unit tests verify individual components in isolation:

- **Categorization Tests**: Test content categorization logic
- **File Processing Tests**: Test markdown file processing
- **Repository Operations Tests**: Test git operations and file discovery

### Integration Tests

Integration tests verify the complete workflow:

- **Full Workflow Tests**: Test the entire aggregation process
- **File Organization Tests**: Verify files are organized correctly
- **Front Matter Generation Tests**: Test YAML front matter creation

### Repository Tests

Repository tests run against real GitHub repositories:

- **Real Repository Testing**: Test with actual GitHub repositories
- **Performance Testing**: Measure processing time and resource usage
- **Error Handling Tests**: Test error handling with invalid repositories

## Configuration

### Test Configuration

Edit `tests/config.py` to customize test behavior:

```python
TEST_CONFIG = {
    "test_repos": [
        {
            "url": "https://github.com/user/repo",
            "expected_files": ["README.md"],
            "expected_categories": ["user-guides"],
            "description": "Test repository"
        }
    ],
    "test_categories": {
        "api": ["api", "endpoint", "rest"],
        "user-guides": ["guide", "tutorial"],
        # ... more categories
    },
    "timeout_seconds": 300,
    "max_files_per_repo": 100
}
```

### Adding Test Repositories

Add repositories to test in `tests/config.py`:

```python
"test_repos": [
    {
        "url": "https://github.com/your-org/your-repo",
        "expected_files": ["README.md", "docs/api.md"],
        "expected_categories": ["user-guides", "api"],
        "description": "Your test repository"
    }
]
```

## Test Results

### Result Storage

Test results are stored in JSON format in the `tests/results/` directory:

- `unit_test_results_YYYYMMDD_HHMMSS.json` - Unit test results
- `integration_repo_results_YYYYMMDD_HHMMSS.json` - Integration test results
- `combined_test_results_YYYYMMDD_HHMMSS.json` - Combined results

### Result Format

```json
{
  "timestamp": "2024-01-01T12:00:00",
  "test_type": "unit",
  "total_tests": 25,
  "passed": 23,
  "failed": 2,
  "errors": 0,
  "test_results": [
    {
      "test_name": "TestCategorization.test_categorization_basic",
      "status": "passed"
    }
  ]
}
```

## Running Tests

### Command Line Options

```bash
python tests/test_runner.py [OPTIONS]

Options:
  --type {unit,integration,all,quick}  Type of tests to run (default: all)
  --repos REPO [REPO ...]             Specific repositories to test
  --output OUTPUT                     Output directory for test results
  --config CONFIG                     Path to custom test configuration
```

### Examples

```bash
# Run all tests
python tests/test_runner.py

# Run unit tests only
python tests/test_runner.py --type unit

# Test specific repositories
python tests/test_runner.py --type integration --repos https://github.com/octocat/Hello-World

# Custom output directory
python tests/test_runner.py --output /path/to/results
```

## Writing Tests

### Unit Test Example

```python
import unittest
from scripts.process import categorize_content

class TestCategorization(unittest.TestCase):
    def test_api_categorization(self):
        content = "# API Reference\n\nThis is API documentation."
        result = categorize_content(content)
        self.assertEqual(result, "api")
```

### Integration Test Example

```python
import unittest
from tests.integration.test_repo_runner import RepoTestRunner

class TestIntegration(unittest.TestCase):
    def test_repository_processing(self):
        runner = RepoTestRunner()
        result = runner.test_repository("https://github.com/octocat/Hello-World")
        self.assertTrue(result['success'])
```

## Continuous Integration

### GitHub Actions

Add to `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - name: Install dependencies
        run: pip install -r requirements.txt
      - name: Run tests
        run: python tests/test_runner.py --type quick
```

## Troubleshooting

### Common Issues

1. **Import Errors**: Ensure the project root is in the Python path
2. **Repository Access**: Some repositories may be private or rate-limited
3. **Timeout Issues**: Increase timeout values in configuration
4. **Permission Errors**: Ensure write permissions for result directories

### Debug Mode

Run tests with verbose output:

```bash
python -m pytest tests/ -v
```

### Test Specific Components

```bash
# Test only categorization
python tests/unit/test_runner.py --module test_categorization

# Test specific test class
python tests/unit/test_runner.py --module test_categorization --class TestCategorization
```

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate test cases for edge cases
3. Update documentation
4. Ensure tests are deterministic and reliable
5. Add tests for new features

## Performance Considerations

- Repository tests may take time due to network operations
- Use small repositories for quick testing
- Consider parallel execution for multiple repositories
- Monitor resource usage during testing
