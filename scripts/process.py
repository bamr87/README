#!/usr/bin/env python3
"""
Documentation processing script for the centralized docs aggregator.
Copies markdown files from raw_docs into docs/{repo_name}/ preserving
the original directory structure, and adds YAML front matter.

The preserved directory structure is the navigation contract: the context
engine's navigator turns docs/{repo_name}/** straight into the published
sidebar, so this stage must keep the upstream hierarchy intact and leave
every page safe to place in a navigation entry.

Every page also passes the secret screen (scripts/context_engine/redact.py):
a credential committed upstream by mistake is replaced with
[REDACTED:<kind>] before the page is written, listed in
docs/results/secret_screen.json by project, path, line and kind (never by
value), and the run exits 1 so the scheduled crawl stops before its commit.
A clean run writes no report.
"""

import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import yaml

sys.path.insert(0, str(Path(__file__).resolve().parent))
from fix_frontmatter_icons import normalize_frontmatter  # noqa: E402

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts.context_engine.redact import redact  # noqa: E402

# Configuration
RAW_DIR = 'raw_docs'
ORGANIZED_DIR = 'docs'
SECRET_SCREEN_PATH = Path(ORGANIZED_DIR) / 'results' / 'secret_screen.json'


def extract_title_from_content(content: str) -> Optional[str]:
    """
    Extract title from markdown content (front matter title or first h1).
    """
    # Look for title in front matter first
    if content.startswith('---'):
        fm_match = re.search(r'\n---\s*\n', content[3:])
        if fm_match:
            fm_end = fm_match.start() + 3
            try:
                fm_content = content[3:fm_end]
                fm_data = yaml.safe_load(fm_content)
                if isinstance(fm_data, dict) and 'title' in fm_data:
                    return fm_data['title']
            except yaml.YAMLError:
                pass

    # Look for first h1 heading
    h1_match = re.search(r'^#\s+(.+)$', content, re.MULTILINE)
    if h1_match:
        return h1_match.group(1).strip()

    return None


def generate_front_matter(content: str, filename: str) -> Dict:
    """
    Generate minimal front matter for a documentation file.
    """
    title = extract_title_from_content(content)
    if not title:
        title = Path(filename).stem.replace('_', ' ').replace('-', ' ').title()

    front_matter = {
        'title': title,
        'source_file': filename,
    }

    return front_matter


def source_location(src_path: Path) -> Tuple[str, Path]:
    """The repo name and in-repo path of a raw_docs/{repo_name}/... file."""
    path_parts = src_path.parts
    raw_docs_index = path_parts.index(RAW_DIR) if RAW_DIR in path_parts else 0
    if raw_docs_index + 1 < len(path_parts):
        return path_parts[raw_docs_index + 1], Path(*path_parts[raw_docs_index + 2:])
    return "unknown", Path(src_path.name)


def process_markdown_file(src_path: Path, dest_base: Path) -> List[Dict]:
    """
    Process a single markdown file. Output goes to docs/{repo_name}/{relative_path}.

    Returns the page's secret-screen hits, one {project, path, line, kind}
    per credential that was redacted; an empty list means a clean page.
    """
    repo_name, relative_path = source_location(src_path)
    hits = []
    try:
        with open(src_path, 'r', encoding='utf-8') as f:
            # Screen before anything else reads the page, so no credential
            # reaches the corpus, the site, AI prompts or MCP answers.
            content, hits = redact(f.read())

        # Extract existing front matter if any
        if content.startswith('---'):
            fm_match = re.search(r'\n---\s*\n', content[3:])
            if fm_match:
                fm_end = fm_match.start() + 3
                try:
                    existing_fm = yaml.safe_load(content[3:fm_end])
                    body = content[fm_end + fm_match.end() - fm_match.start():]
                except yaml.YAMLError:
                    existing_fm = {}
                    body = content
            else:
                existing_fm = {}
                body = content
        else:
            existing_fm = {}
            body = content

        # Generate new front matter
        new_fm = generate_front_matter(body, src_path.name)

        # Merge with existing front matter (new takes precedence)
        updated_fm = {**existing_fm, **new_fm}

        # Upstream icon vocabularies (Bootstrap Icons here) crash Material's
        # nav rendering; map them onto bundled icons, keeping the original.
        updated_fm, _ = normalize_frontmatter(updated_fm)

        # Normalize tags: MkDocs requires tags to be a list
        if 'tags' in updated_fm:
            if isinstance(updated_fm['tags'], str):
                updated_fm['tags'] = [updated_fm['tags']]
            elif isinstance(updated_fm['tags'], list):
                # Flatten any nested lists and ensure all items are strings
                flat = []
                for item in updated_fm['tags']:
                    if isinstance(item, list):
                        flat.extend(str(i) for i in item)
                    else:
                        flat.append(str(item))
                updated_fm['tags'] = flat

        # Output: docs/{repo_name}/{original_relative_path}
        dest_dir = dest_base / repo_name / relative_path.parent
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest_path = dest_dir / src_path.name

        # Write updated markdown file
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write('---\n')
            yaml.dump(updated_fm, f, default_flow_style=False, allow_unicode=True)
            f.write('---\n')
            f.write(body)

        print(f"Processed: {src_path} -> {dest_path}")

    except Exception as e:
        print(f"Error processing {src_path}: {e}")

    return [{"project": repo_name, "path": relative_path.as_posix(),
             "line": hit.line, "kind": hit.kind} for hit in hits]


def write_secret_screen(hits: List[Dict], pages: int,
                        path: Path = SECRET_SCREEN_PATH) -> None:
    """
    Record what the screen found - where, never the value. The report exists
    only after a crawl that redacted something (a run that fails, so it is
    never committed); a clean crawl removes a stale one.
    """
    if not hits:
        if path.exists():
            path.unlink()
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    report = {
        "description": ("Secret screen of the crawled corpus (scripts/process.py): "
                        "each credential found upstream, redacted to "
                        "[REDACTED:<kind>] in docs/. Values are never recorded."),
        "pages_screened": pages,
        "hits": sorted(hits, key=lambda h: (h["project"], h["path"], h["line"], h["kind"])),
    }
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    """
    Main processing function. Returns 1 when the secret screen redacted
    anything, so the crawl that called it stops before committing.
    """
    print("Starting documentation processing...")

    # Create organized directory
    Path(ORGANIZED_DIR).mkdir(exist_ok=True)

    # Process all markdown files
    processed_count = 0
    secret_hits: List[Dict] = []
    for root, dirs, files in os.walk(RAW_DIR):
        for file in files:
            if file.endswith('.md') or file.upper().startswith('README'):
                src_path = Path(root) / file
                secret_hits += process_markdown_file(src_path, Path(ORGANIZED_DIR))
                processed_count += 1

    print(f"Processed {processed_count} documentation files")
    write_secret_screen(secret_hits, processed_count)

    # Clean up raw_docs after processing
    print("Cleaning up raw documentation files...")
    for root, dirs, files in os.walk(RAW_DIR, topdown=False):
        for file in files:
            os.remove(Path(root) / file)
        for d in dirs:
            os.rmdir(Path(root) / d)

    if os.path.exists(RAW_DIR):
        os.rmdir(RAW_DIR)

    if secret_hits:
        print(f"SECRET SCREEN: redacted {len(secret_hits)} credential(s) found upstream "
              f"(listed in {SECRET_SCREEN_PATH}). Revoke each one and remove it from "
              "its source repository, then crawl again:")
        for hit in secret_hits:
            print(f"  {hit['project']}/{hit['path']}:{hit['line']}  {hit['kind']}")
        return 1

    print("Documentation processing completed!")
    return 0


if __name__ == "__main__":
    sys.exit(main())

