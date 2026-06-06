#!/usr/bin/env python3
"""
Generate a comprehensive JSON index of all documentation files.

This script scans the docs/ directory and creates a single JSON file containing:
- All document metadata and frontmatter
- File paths and hierarchical structure
- Category and tag indices for easy searching
- Statistics and summary information

Usage:
    python scripts/generate_docs_index.py [--output PATH] [--pretty] [--verbose]

Output:
    docs/docs_index.json - Comprehensive documentation index
"""

import argparse
import hashlib
import json
import os
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    import yaml
except ImportError:
    print("Error: PyYAML is required. Install with: pip install pyyaml")
    sys.exit(1)


# Configuration
DOCS_DIR = 'docs'
DEFAULT_OUTPUT = 'docs/docs_index.json'
SUPPORTED_EXTENSIONS = {'.md', '.markdown', '.rst', '.txt'}


def parse_frontmatter(content: str) -> Tuple[Dict[str, Any], str]:
    """
    Parse YAML frontmatter from document content.
    
    Args:
        content: Full document content
        
    Returns:
        Tuple of (frontmatter dict, body content)
    """
    if not content.startswith('---'):
        return {}, content
    
    try:
        # Find the closing ---
        end_idx = content.find('---', 3)
        if end_idx == -1:
            return {}, content
        
        raw_fm = content[3:end_idx]
        body = content[end_idx + 3:].lstrip('\n')
        
        fm = yaml.safe_load(raw_fm)
        if fm is None:
            fm = {}
        
        return fm, body
    except yaml.YAMLError as e:
        return {'_yaml_error': str(e)}, content


def extract_headings(content: str) -> List[Dict[str, Any]]:
    """
    Extract all headings from markdown content.
    
    Args:
        content: Markdown body content
        
    Returns:
        List of heading objects with level, text, and anchor
    """
    headings = []
    # Match markdown headings (# Heading)
    pattern = r'^(#{1,6})\s+(.+?)(?:\s+#*)?$'
    
    for match in re.finditer(pattern, content, re.MULTILINE):
        level = len(match.group(1))
        text = match.group(2).strip()
        # Generate anchor slug
        anchor = re.sub(r'[^\w\s-]', '', text.lower())
        anchor = re.sub(r'[\s_]+', '-', anchor).strip('-')
        
        headings.append({
            'level': level,
            'text': text,
            'anchor': anchor
        })
    
    return headings


def extract_links(content: str) -> Dict[str, List[str]]:
    """
    Extract internal and external links from content.
    
    Args:
        content: Markdown body content
        
    Returns:
        Dict with 'internal' and 'external' link lists
    """
    links = {'internal': [], 'external': []}
    
    # Match markdown links [text](url)
    pattern = r'\[([^\]]+)\]\(([^)]+)\)'
    
    for match in re.finditer(pattern, content):
        url = match.group(2)
        if url.startswith(('http://', 'https://', '//')):
            links['external'].append(url)
        elif not url.startswith('#'):  # Skip anchor links
            links['internal'].append(url)
    
    return links


def extract_code_blocks(content: str) -> List[Dict[str, Any]]:
    """
    Extract code block information from content.
    
    Args:
        content: Markdown body content
        
    Returns:
        List of code block objects with language and line count
    """
    code_blocks = []
    
    # Match fenced code blocks
    pattern = r'```(\w*)\n(.*?)```'
    
    for match in re.finditer(pattern, content, re.DOTALL):
        language = match.group(1) or 'plaintext'
        code = match.group(2)
        line_count = len(code.strip().split('\n')) if code.strip() else 0
        
        code_blocks.append({
            'language': language,
            'lines': line_count
        })
    
    return code_blocks


def calculate_reading_time(content: str) -> int:
    """
    Estimate reading time in minutes.
    
    Args:
        content: Document body content
        
    Returns:
        Estimated reading time in minutes
    """
    # Average reading speed: 200-250 words per minute
    words = len(re.findall(r'\w+', content))
    return max(1, round(words / 200))


def calculate_content_hash(content: str) -> str:
    """
    Calculate MD5 hash of content for change detection.
    
    Args:
        content: Full document content
        
    Returns:
        MD5 hash string
    """
    return hashlib.md5(content.encode('utf-8')).hexdigest()


def get_file_stats(file_path: Path) -> Dict[str, Any]:
    """
    Get file system statistics for a document.
    
    Args:
        file_path: Path to the file
        
    Returns:
        Dict with file statistics
    """
    stat = file_path.stat()
    return {
        'size_bytes': stat.st_size,
        'created': datetime.fromtimestamp(stat.st_ctime).isoformat(),
        'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
    }


def process_document(file_path: Path, docs_root: Path) -> Dict[str, Any]:
    """
    Process a single document and extract all metadata.
    
    Args:
        file_path: Path to the document
        docs_root: Root docs directory path
        
    Returns:
        Document metadata dictionary
    """
    try:
        content = file_path.read_text(encoding='utf-8')
    except Exception as e:
        return {
            'path': str(file_path.relative_to(docs_root)),
            'error': f"Failed to read file: {str(e)}"
        }
    
    frontmatter, body = parse_frontmatter(content)
    rel_path = file_path.relative_to(docs_root)
    
    # Extract path components for hierarchy
    parts = rel_path.parts
    category = parts[0] if len(parts) > 1 else 'root'
    repo = parts[1] if len(parts) > 2 else None
    
    # Build document entry
    doc = {
        # Identity
        'id': str(rel_path).replace('/', '_').replace('.', '_'),
        'path': str(rel_path),
        'filename': file_path.name,
        'extension': file_path.suffix,
        
        # Hierarchy
        'category': category,
        'repository': repo,
        'depth': len(parts),
        'parent_path': str(rel_path.parent) if len(parts) > 1 else None,
        
        # Frontmatter (all fields)
        'frontmatter': frontmatter,
        
        # Extracted metadata
        'title': frontmatter.get('title', file_path.stem),
        'description': frontmatter.get('description') or frontmatter.get('summary'),
        'tags': frontmatter.get('tags', []),
        'author': frontmatter.get('author'),
        'date': str(frontmatter.get('date')) if frontmatter.get('date') else None,
        'last_updated': str(frontmatter.get('last_updated') or frontmatter.get('lastmod')) if frontmatter.get('last_updated') or frontmatter.get('lastmod') else None,
        'draft': frontmatter.get('draft', False),
        'permalink': frontmatter.get('permalink'),
        
        # Content analysis
        'headings': extract_headings(body),
        'links': extract_links(body),
        'code_blocks': extract_code_blocks(body),
        'word_count': len(re.findall(r'\w+', body)),
        'reading_time_minutes': calculate_reading_time(body),
        
        # File info
        'content_hash': calculate_content_hash(content),
        'file_stats': get_file_stats(file_path),
        
        # Flags
        'has_frontmatter': bool(frontmatter),
        'has_yaml_error': '_yaml_error' in frontmatter
    }
    
    return doc


def build_category_index(documents: List[Dict[str, Any]]) -> Dict[str, List[str]]:
    """
    Build an index of documents by category.
    
    Args:
        documents: List of processed documents
        
    Returns:
        Dict mapping category names to document IDs
    """
    index = defaultdict(list)
    for doc in documents:
        if 'error' not in doc:
            index[doc['category']].append(doc['id'])
    return dict(index)


def build_tag_index(documents: List[Dict[str, Any]]) -> Dict[str, List[str]]:
    """
    Build an index of documents by tag.
    
    Args:
        documents: List of processed documents
        
    Returns:
        Dict mapping tag names to document IDs
    """
    index = defaultdict(set)  # Use set to avoid duplicates
    for doc in documents:
        if 'error' not in doc:
            for tag in doc.get('tags', []):
                if tag:
                    tag_normalized = str(tag).lower().strip()
                    index[tag_normalized].add(doc['id'])
    # Convert sets to sorted lists for JSON serialization
    return {k: sorted(list(v)) for k, v in index.items()}


def build_repository_index(documents: List[Dict[str, Any]]) -> Dict[str, List[str]]:
    """
    Build an index of documents by source repository.
    
    Args:
        documents: List of processed documents
        
    Returns:
        Dict mapping repository names to document IDs
    """
    index = defaultdict(list)
    for doc in documents:
        if 'error' not in doc and doc.get('repository'):
            index[doc['repository']].append(doc['id'])
    return dict(index)


def build_language_index(documents: List[Dict[str, Any]]) -> Dict[str, int]:
    """
    Build an index of code block languages used.
    
    Args:
        documents: List of processed documents
        
    Returns:
        Dict mapping language names to occurrence counts
    """
    index = defaultdict(int)
    for doc in documents:
        if 'error' not in doc:
            for block in doc.get('code_blocks', []):
                index[block['language']] += 1
    return dict(sorted(index.items(), key=lambda x: x[1], reverse=True))


def calculate_statistics(documents: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Calculate aggregate statistics for all documents.
    
    Args:
        documents: List of processed documents
        
    Returns:
        Statistics dictionary
    """
    valid_docs = [d for d in documents if 'error' not in d]
    
    total_words = sum(d.get('word_count', 0) for d in valid_docs)
    total_reading_time = sum(d.get('reading_time_minutes', 0) for d in valid_docs)
    total_code_blocks = sum(len(d.get('code_blocks', [])) for d in valid_docs)
    total_headings = sum(len(d.get('headings', [])) for d in valid_docs)
    
    # Documents with/without frontmatter
    with_frontmatter = sum(1 for d in valid_docs if d.get('has_frontmatter'))
    with_yaml_errors = sum(1 for d in valid_docs if d.get('has_yaml_error'))
    
    # Tag statistics
    all_tags = []
    for d in valid_docs:
        all_tags.extend(d.get('tags', []))
    unique_tags = len(set(str(t).lower() for t in all_tags if t))
    
    # Category distribution
    category_counts = defaultdict(int)
    for d in valid_docs:
        category_counts[d['category']] += 1
    
    return {
        'total_documents': len(documents),
        'valid_documents': len(valid_docs),
        'documents_with_errors': len(documents) - len(valid_docs),
        'documents_with_frontmatter': with_frontmatter,
        'documents_with_yaml_errors': with_yaml_errors,
        'total_words': total_words,
        'total_reading_time_minutes': total_reading_time,
        'total_code_blocks': total_code_blocks,
        'total_headings': total_headings,
        'unique_tags': unique_tags,
        'total_tag_usages': len(all_tags),
        'categories': dict(category_counts),
        'average_words_per_document': round(total_words / len(valid_docs)) if valid_docs else 0,
        'average_reading_time_minutes': round(total_reading_time / len(valid_docs)) if valid_docs else 0
    }


def generate_docs_index(
    docs_dir: str = DOCS_DIR,
    output_path: str = DEFAULT_OUTPUT,
    pretty: bool = False,
    verbose: bool = False
) -> Dict[str, Any]:
    """
    Generate the comprehensive documentation index.
    
    Args:
        docs_dir: Path to docs directory
        output_path: Path for output JSON file
        pretty: Whether to pretty-print JSON
        verbose: Whether to print progress
        
    Returns:
        The generated index dictionary
    """
    docs_root = Path(docs_dir)
    
    if not docs_root.exists():
        print(f"Error: Docs directory '{docs_dir}' does not exist")
        sys.exit(1)
    
    if verbose:
        print(f"Scanning documentation in: {docs_root.absolute()}")
    
    # Find all documentation files
    documents = []
    file_count = 0
    
    for ext in SUPPORTED_EXTENSIONS:
        for file_path in docs_root.rglob(f'*{ext}'):
            # Skip the index file itself
            if file_path.name == 'docs_index.json':
                continue
            
            file_count += 1
            if verbose and file_count % 100 == 0:
                print(f"  Processed {file_count} files...")
            
            doc = process_document(file_path, docs_root)
            documents.append(doc)
    
    if verbose:
        print(f"  Total files processed: {file_count}")
    
    # Sort documents by path for consistent output
    documents.sort(key=lambda d: d.get('path', ''))
    
    # Build indices
    if verbose:
        print("Building indices...")
    
    category_index = build_category_index(documents)
    tag_index = build_tag_index(documents)
    repository_index = build_repository_index(documents)
    language_index = build_language_index(documents)
    
    # Calculate statistics
    if verbose:
        print("Calculating statistics...")
    
    statistics = calculate_statistics(documents)
    
    # Build the complete index
    index = {
        'metadata': {
            'generated_at': datetime.now().isoformat(),
            'generator': 'generate_docs_index.py',
            'version': '1.0.0',
            'docs_root': str(docs_root.absolute())
        },
        'statistics': statistics,
        'indices': {
            'by_category': category_index,
            'by_tag': tag_index,
            'by_repository': repository_index,
            'code_languages': language_index
        },
        'documents': documents
    }
    
    # Write output
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        if pretty:
            json.dump(index, f, indent=2, ensure_ascii=False, default=str)
        else:
            json.dump(index, f, ensure_ascii=False, default=str)
    
    if verbose:
        print(f"\nIndex written to: {output_file}")
        print(f"  Documents indexed: {statistics['total_documents']}")
        print(f"  Categories: {len(category_index)}")
        print(f"  Unique tags: {statistics['unique_tags']}")
        print(f"  Repositories: {len(repository_index)}")
    
    return index


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Generate comprehensive JSON index of documentation files',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
Examples:
    python scripts/generate_docs_index.py
    python scripts/generate_docs_index.py --pretty --verbose
    python scripts/generate_docs_index.py --output custom/path/index.json
        '''
    )
    
    parser.add_argument(
        '--docs-dir',
        default=DOCS_DIR,
        help=f'Path to docs directory (default: {DOCS_DIR})'
    )
    parser.add_argument(
        '--output', '-o',
        default=DEFAULT_OUTPUT,
        help=f'Output JSON file path (default: {DEFAULT_OUTPUT})'
    )
    parser.add_argument(
        '--pretty', '-p',
        action='store_true',
        help='Pretty-print JSON output with indentation'
    )
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Print progress information'
    )
    
    args = parser.parse_args()
    
    try:
        index = generate_docs_index(
            docs_dir=args.docs_dir,
            output_path=args.output,
            pretty=args.pretty,
            verbose=args.verbose
        )
        
        # Print summary
        stats = index['statistics']
        print(f"Documentation index generated successfully!")
        print(f"  Total documents: {stats['total_documents']}")
        print(f"  Total words: {stats['total_words']:,}")
        print(f"  Categories: {', '.join(stats['categories'].keys())}")
        
        return 0
        
    except Exception as e:
        print(f"Error generating index: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
