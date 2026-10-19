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
├── unit/                          # Unit tests
│   ├── test_cases/                # unittest modules (discovered by the runner)
│   │   ├── test_context_engine.py # registry, extractor, navigator, synthesizer, index/query, AI provider, schema lint, MCP
│   │   ├── test_file_processing.py
│   │   ├── test_fleet_survey.py   # fleet survey checks + health report
│   │   ├── test_repo_operations.py
│   │   └── test_tracked_surfaces.py
│   ├── test_docs_tools.py         # pytest-style; NOT run by the harness (see below)
│   └── test_runner.py             # Unit test runner (--module/--class/--method)
├── integration/                   # Integration tests
│   ├── test_integration.py        # Integration test cases
│   └── test_repo_runner.py        # Repository test runner
├── fixtures/                      # Test fixtures and sample data
│   └── sample_docs.py             # Sample documentation files
├── test-docs/                     # Sample markdown fixtures
├── results/                       # Test results storage (generated)
├── config.py                      # Test configuration
├── test_runner.py                 # Main test runner
├── TESTING_FRAMEWORK.md           # Framework architecture notes
├── SCHEMA.md                      # Structure contract for this directory
└── README.md                      # This file
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

Unit tests verify individual components in isolation. The runner discovers every `tests/unit/test_cases/test_*.py` module:

- **Context engine** (`test_context_engine.py`): registry, extractor, navigator, icon normalizer, synthesizer/assembler, index and query, AI provider selection, schema lint, MCP dispatch — all against fixtures
- **Fleet survey** (`test_fleet_survey.py`): link resolver, governance/structure/quality/metadata checks, health scoring, report rendering, fleet inventory
- **Tracked surfaces** (`test_tracked_surfaces.py`): `scripts/check_tracked_surfaces.py` against clean and broken fixture repos
- **File processing** (`test_file_processing.py`): title extraction, front matter generation, ingest prose normalization
- **Repository operations** (`test_repo_operations.py`): git operations and file discovery

`tests/unit/test_docs_tools.py` sits outside `test_cases/` and uses bare pytest functions, so the custom harness does not run it; run it with `python -m pytest tests/unit/test_docs_tools.py`.

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
from scripts.process import extract_title_from_content

class TestTitleExtraction(unittest.TestCase):
    def test_h1_becomes_title(self):
        content = "# API Reference\n\nThis is API documentation."
        self.assertEqual(extract_title_from_content(content), "API Reference")
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

There is no dedicated test workflow in this repo. `.github/workflows/ci.yml` is a thin caller of the hub's shared `standard-ci.yml` gate (`bamr87/bamr87`), and `docs-quality-check.yaml` runs the schema, navigation and tracked-surfaces gates on PRs. Before pushing, run the same fast path locally:

```bash
python tests/test_runner.py --type quick
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
# Test only the context engine
python tests/unit/test_runner.py --module test_context_engine

# Test specific test class
python tests/unit/test_runner.py --module test_context_engine --class TestNavigator
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
