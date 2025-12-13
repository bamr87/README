# MkDocs Documentation

This directory contains the MkDocs setup for generating a static documentation site from the aggregated documentation in `README/docs`.

## Quick Start

### Local Development

1. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv-docs
   source .venv-docs/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements-docs.txt
   ```

3. **Start development server:**
   ```bash
   mkdocs serve
   ```

4. **View documentation:**
   Open http://127.0.0.1:8000/bamr87/ in your browser

### Build Static Site

```bash
# Activate virtual environment
source .venv-docs/bin/activate

# Build static HTML
mkdocs build

# Output will be in site/ directory
```

## Configuration

- **`mkdocs.yml`**: Main configuration file
- **`README/docs/`**: Documentation source directory
- **`README/docs/index.md`**: Documentation homepage
- **`requirements-docs.txt`**: Python dependencies

## Features

- **Material Theme**: Modern, responsive design
- **Search**: Client-side search across all 2852+ docs
- **Auto Navigation**: Folder structure becomes navigation menu
- **Dark Mode**: Light/dark theme toggle
- **Code Highlighting**: Syntax highlighting with copy button
- **Mermaid Diagrams**: Support for diagram rendering

## Navigation Structure

Documentation is organized into these main sections:

- **Setup**: Installation and configuration guides
- **User Guides**: Tutorials and how-tos
- **API Reference**: API documentation
- **Architecture**: System design and patterns
- **Development**: Development workflows
- **Miscellaneous**: Additional resources
- **Results**: Analysis and quality reports

## Known Issues

Some broken links exist in the aggregated documentation (warnings during build). These are expected since the docs were collected from multiple repositories with different structures.

## Deployment Options

### GitHub Pages (Recommended)

Add this to `.github/workflows/docs.yml`:

```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: 3.x
      - run: pip install -r requirements-docs.txt
      - run: mkdocs gh-deploy --force
```

### Manual Deployment

Build and copy `site/` directory to your web server:

```bash
mkdocs build
# Copy site/ to your hosting provider
```

## Customization

Edit `mkdocs.yml` to customize:

- Site name and URL
- Theme colors
- Navigation structure
- Enabled features
- Search configuration
- Markdown extensions

## Troubleshooting

**Virtual environment issues:**
```bash
# Deactivate and recreate
deactivate
rm -rf .venv-docs
python3 -m venv .venv-docs
source .venv-docs/bin/activate
pip install -r requirements-docs.txt
```

**Port already in use:**
```bash
mkdocs serve -a localhost:8001
```

**Build fails:**
```bash
# Clean build
rm -rf site/
mkdocs build
```

---

*Documentation powered by MkDocs Material*
