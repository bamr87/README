#!/usr/bin/env python3
"""
Documentation processing script for the centralized docs aggregator.
Copies markdown files from raw_docs into docs/{repo_name}/ preserving
the original directory structure, and adds YAML front matter.
"""

import os
import re
from pathlib import Path
from typing import Dict, Optional

import yaml

# Configuration
RAW_DIR = 'raw_docs'
ORGANIZED_DIR = 'docs'


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


def process_markdown_file(src_path: Path, dest_base: Path) -> None:
    """
    Process a single markdown file. Output goes to docs/{repo_name}/{relative_path}.
    """
    try:
        with open(src_path, 'r', encoding='utf-8') as f:
            content = f.read()

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

        # Extract repo name and relative path from raw_docs/{repo_name}/...
        path_parts = src_path.parts
        raw_docs_index = path_parts.index(RAW_DIR) if RAW_DIR in path_parts else 0
        if raw_docs_index + 1 < len(path_parts):
            repo_name = path_parts[raw_docs_index + 1]
            relative_path = Path(*path_parts[raw_docs_index + 2:])
        else:
            repo_name = "unknown"
            relative_path = Path(src_path.name)

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


def main():
    """
    Main processing function.
    """
    print("Starting documentation processing...")

    # Create organized directory
    Path(ORGANIZED_DIR).mkdir(exist_ok=True)

    # Process all markdown files
    processed_count = 0
    for root, dirs, files in os.walk(RAW_DIR):
        for file in files:
            if file.endswith('.md') or file.upper().startswith('README'):
                src_path = Path(root) / file
                process_markdown_file(src_path, Path(ORGANIZED_DIR))
                processed_count += 1

    print(f"Processed {processed_count} documentation files")

    # Clean up raw_docs after processing
    print("Cleaning up raw documentation files...")
    for root, dirs, files in os.walk(RAW_DIR, topdown=False):
        for file in files:
            os.remove(Path(root) / file)
        for d in dirs:
            os.rmdir(Path(root) / d)

    if os.path.exists(RAW_DIR):
        os.rmdir(RAW_DIR)

    print("Documentation processing completed!")


if __name__ == "__main__":
    main()

