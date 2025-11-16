# Documentation Aggregator

A centralized documentation hub that automatically aggregates, organizes, and maintains documentation from multiple source repositories.

## 🎯 What is this?

This repository is a **Documentation Aggregator** that:
- Pulls documentation from multiple source repositories
- Organizes files by category (API, user guides, setup, etc.)
- Adds/updates YAML front matter for better metadata
- Maintains quality through automated checks and validation
- Provides a centralized, searchable documentation repository

Currently maintaining **2,700+ documentation files** from multiple source repositories.

## 🚀 Quick Start

### Prerequisites

- Python 3.12+
- Git
- GitHub account (for Actions automation)

### Setup

```bash
# Clone the repository
git clone https://github.com/bamr87/README.git
cd README

# Install dependencies
python3 -m pip install -r requirements.txt

# Configure source repositories
# Edit repos.txt and add your repository URLs (one per line)
nano repos.txt

# Run aggregation manually
bash scripts/aggregate.sh
```

## 📁 Repository Structure

```
.
├── docs/                    # Organized documentation (2700+ files)
│   ├── api/                # API documentation
│   ├── architecture/       # Architecture guides
│   ├── development/        # Development guides
│   ├── misc/               # Miscellaneous docs
│   ├── results/            # Test and analysis results
│   ├── setup/              # Setup and installation guides
│   └── user-guides/        # User guides and tutorials
├── scripts/                # Processing and utility scripts
│   ├── aggregate.py        # Main aggregation logic
│   ├── aggregate.sh        # Bash orchestration script
│   ├── process.py          # Document processing
│   ├── check_frontmatter.py    # Validate YAML front matter
│   ├── clean_frontmatter.py    # Normalize front matter
│   ├── lint_docs.py        # Markdown linting
│   ├── fix_h1.py           # Fix heading issues
│   ├── fix_whitespace.py   # Clean whitespace
│   └── generate_docs_report.py # Generate reports
├── tests/                  # Comprehensive test suite
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── fixtures/          # Test data and fixtures
├── .github/workflows/      # GitHub Actions automation
│   ├── aggregate-docs.yaml         # Daily aggregation
│   ├── docs-quality-check.yaml     # Quality validation
│   └── docs-apply-fixes.yaml       # Auto-fix issues
├── repos.txt              # Source repository list
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🔄 How It Works

### Automated Workflow

1. **GitHub Actions** triggers daily (or manually)
2. **aggregate.sh** reads `repos.txt` and clones each repository
3. **Python scripts** discover and process documentation files:
   - Extract markdown files
   - Categorize content by topic
   - Generate/update YAML front matter
   - Organize into appropriate directories
4. **Quality checks** validate the processed documentation
5. **Auto-fixes** apply corrections where possible
6. Changes are committed back to the repository

### Categorization

Documents are automatically categorized based on content analysis:

- **api**: API references, endpoints, REST documentation
- **user-guides**: Tutorials, how-tos, user documentation
- **setup**: Installation, configuration, getting started guides
- **development**: Development guides, contributor docs
- **architecture**: System architecture, design documents
- **misc**: Other documentation

## ⚙️ Configuration

### Adding Source Repositories

Edit `repos.txt` to add repository URLs:

```bash
# Add repositories (one per line)
https://github.com/username/repo1
https://github.com/username/repo2
https://github.com/org/another-repo
```

Examples from current configuration:
```
https://github.com/bamr87/scripts
https://github.com/bamr87/barodybroject
https://github.com/bamr87/bashcrawl
https://github.com/bamr87/ai-evolution-engine-seed
```

### GitHub Actions

The repository includes three automated workflows:

#### 1. Documentation Aggregation
**File**: `.github/workflows/aggregate-docs.yaml`
- Runs daily at midnight
- Can be triggered manually
- Clones source repos and processes documentation

#### 2. Quality Checks
**File**: `.github/workflows/docs-quality-check.yaml`
- Validates YAML front matter
- Lints markdown files
- Checks for formatting issues

#### 3. Auto-Fixes
**File**: `.github/workflows/docs-apply-fixes.yaml`
- Automatically fixes common issues
- Normalizes front matter
- Cleans whitespace

## 🛠️ Available Scripts

### Core Processing

```bash
# Run full aggregation workflow
bash scripts/aggregate.sh

# Process documents with Python
python scripts/process.py
```

### Quality Tools

```bash
# Check YAML front matter
python scripts/check_frontmatter.py

# Fix missing front matter fields
python scripts/check_frontmatter.py --fix

# Lint markdown files
python scripts/lint_docs.py

# Clean and normalize front matter
python scripts/clean_frontmatter.py

# Fix H1 heading issues
python scripts/fix_h1.py

# Fix whitespace issues
python scripts/fix_whitespace.py

# Generate documentation report
python scripts/generate_docs_report.py
```

### Batch Operations

```bash
# Run all documentation checks
bash scripts/run_doc_checks.sh
```

## 🧪 Testing

The repository includes a comprehensive testing framework:

```bash
# Run all tests
python tests/test_runner.py

# Run unit tests only
python tests/test_runner.py --type unit

# Run integration tests only
python tests/test_runner.py --type integration

# Test specific repositories
python tests/test_runner.py --type integration --repos https://github.com/user/repo
```

See [tests/README.md](tests/README.md) for detailed testing documentation.

## 📊 Documentation Statistics

- **Total Files**: 2,700+ markdown documents
- **Categories**: 7 main categories
- **Source Repositories**: Multiple GitHub repositories
- **Update Frequency**: Daily automated aggregation
- **Quality Checks**: Automated linting and validation

## 🔍 Front Matter Structure

Each processed document includes YAML front matter:

```yaml
---
title: Document Title
tags: [tag1, tag2, tag3]
category: api
summary: Brief description of the document
source_repo: username/repository-name
---
```

## 🤝 Contributing

### Adding Documentation

1. Add your repository to `repos.txt`
2. Run aggregation: `bash scripts/aggregate.sh`
3. Review organized documentation in `docs/`
4. Submit a pull request

### Improving Scripts

1. Modify scripts in `scripts/` directory
2. Add/update tests in `tests/`
3. Run tests: `python tests/test_runner.py`
4. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add tests for new functionality
- Update documentation
- Ensure all tests pass before submitting

## 📋 Requirements

Python packages (from `requirements.txt`):
- `pyyaml>=6.0` - YAML parsing and generation
- `requests>=2.31.0` - HTTP requests
- `nltk>=3.8.1` - Natural language processing
- `pytest>=7.0` - Testing framework

## 🐛 Troubleshooting

### Common Issues

**Permission Errors**
```bash
chmod +x scripts/*.sh
```

**Dependency Issues**
```bash
pip install -r requirements.txt
```

**Repository Access**
- Ensure repositories in `repos.txt` are public or you have access
- Check GitHub token permissions for private repos

**Empty Results**
- Verify repository URLs are correct
- Check that source repos contain markdown files
- Review logs in GitHub Actions

## 📖 Additional Documentation

- [Product Requirements Document](PRD.md) - Detailed MVP specifications
- [Documentation Checks Guide](README_DOCS_CHECKS.md) - Quality tools overview
- [Testing Framework](tests/README.md) - Comprehensive testing guide
- [Testing Framework Details](tests/TESTING_FRAMEWORK.md) - Test architecture

## 📄 License

This repository is personal infrastructure. Source documentation retains original licenses from respective repositories.

## 🆘 Support

- **Issues**: [Open a GitHub issue](https://github.com/bamr87/README/issues)
- **Documentation**: Check the `docs/` directory
- **Questions**: Use GitHub Discussions

---

**README** - Centralized documentation aggregation and organization system.

