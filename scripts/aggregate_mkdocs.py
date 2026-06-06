#!/usr/bin/env python3
"""
MkDocs-Optimized Documentation Aggregator

Aggregates documentation from multiple repositories with MkDocs compatibility:
- Organizes docs into MkDocs-friendly structure
- Normalizes frontmatter
- Preserves relative link context
- Generates navigation metadata
- Handles external repository links
"""

import re
import yaml
import shutil
import argparse
from pathlib import Path
from typing import Dict, List, Set, Optional
from dataclasses import dataclass, asdict


@dataclass
class RepoMetadata:
    """Metadata for an aggregated repository"""
    name: str
    url: str
    category: str
    files_count: int
    last_updated: str


class MkDocsAggregator:
    """Aggregate documentation with MkDocs optimization"""
    
    CATEGORY_MAPPING = {
        'setup': ['README', 'INSTALL', 'SETUP', 'GETTING_STARTED', 'QUICKSTART'],
        'api': ['API', 'REFERENCE', 'FUNCTIONS'],
        'architecture': ['ARCHITECTURE', 'DESIGN', 'STRUCTURE'],
        'development': ['DEVELOPMENT', 'CONTRIBUTING', 'WORKFLOW'],
        'user-guides': ['GUIDE', 'TUTORIAL', 'HOW-TO', 'USAGE'],
        'misc': []  # Catch-all for uncategorized
    }
    
    EXCLUDED_PATTERNS = [
        '.git',
        'node_modules',
        '__pycache__',
        '.venv',
        'venv',
        'build',
        'dist',
        '.pytest_cache',
        '.mypy_cache',
        'site',  # MkDocs output
    ]
    
    def __init__(self, docs_root: Path, preserve_structure: bool = True):
        """
        Initialize aggregator.
        
        Args:
            docs_root: Root directory for aggregated documentation
            preserve_structure: Whether to preserve source repository structure
        """
        self.docs_root = Path(docs_root).resolve()
        self.preserve_structure = preserve_structure
        self.repos_metadata: Dict[str, RepoMetadata] = {}
        self.stats = {
            'repos_processed': 0,
            'files_copied': 0,
            'files_skipped': 0,
            'categories_created': set(),
            'errors': []
        }
    
    def _should_exclude(self, path: Path) -> bool:
        """Check if path should be excluded"""
        path_parts = path.parts
        return any(
            excluded in path_parts 
            for excluded in self.EXCLUDED_PATTERNS
        )
    
    def _categorize_file(self, file_path: Path, repo_root: Path) -> str:
        """
        Determine appropriate category for a file.
        
        Args:
            file_path: Path to file
            repo_root: Root of repository
        
        Returns:
            Category name
        """
        # Get path relative to repo root
        try:
            rel_path = file_path.relative_to(repo_root)
            path_upper = str(rel_path).upper()
        except ValueError:
            return 'misc'
        
        # Check against category keywords
        for category, keywords in self.CATEGORY_MAPPING.items():
            if any(keyword in path_upper for keyword in keywords):
                return category
        
        # Check directory structure for hints
        parts = rel_path.parts
        if len(parts) > 1:
            first_dir = parts[0].lower()
            
            # Common directory names
            if first_dir in ['docs', 'documentation']:
                return 'user-guides'
            elif first_dir in ['api', 'reference']:
                return 'api'
            elif first_dir in ['architecture', 'design']:
                return 'architecture'
            elif first_dir in ['dev', 'development', '.github']:
                return 'development'
            elif first_dir in ['setup', 'install', 'getting-started']:
                return 'setup'
        
        # Default category
        return 'misc'
    
    def _normalize_frontmatter(self, content: str, file_path: Path, repo_name: str) -> str:
        """
        Normalize YAML frontmatter for MkDocs compatibility.
        
        Args:
            content: File content
            file_path: Path to file
            repo_name: Name of source repository
        
        Returns:
            Normalized content
        """
        # Check if file has frontmatter
        if not content.startswith('---'):
            # Add minimal frontmatter
            title = file_path.stem.replace('-', ' ').replace('_', ' ').title()
            frontmatter = {
                'title': title,
                'source_repo': repo_name
            }
            
            fm_yaml = yaml.dump(frontmatter, default_flow_style=False)
            return f"---\n{fm_yaml}---\n\n{content}"
        
        # Parse existing frontmatter
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                fm_content = parts[1]
                body_content = parts[2]
                
                frontmatter = yaml.safe_load(fm_content) or {}
                
                # Add source_repo if not present
                if 'source_repo' not in frontmatter:
                    frontmatter['source_repo'] = repo_name
                
                # Ensure title exists
                if 'title' not in frontmatter:
                    frontmatter['title'] = file_path.stem.replace('-', ' ').replace('_', ' ').title()
                
                # Remove problematic fields that MkDocs doesn't use
                for field in ['layout', 'permalink', 'nav_order']:
                    frontmatter.pop(field, None)
                
                # Reserialize
                fm_yaml = yaml.dump(frontmatter, default_flow_style=False)
                return f"---\n{fm_yaml}---{body_content}"
        
        except yaml.YAMLError:
            # If frontmatter is malformed, keep original
            pass
        
        return content
    
    def _find_markdown_files(self, repo_dir: Path) -> List[Path]:
        """
        Find all markdown files in repository.
        
        Args:
            repo_dir: Repository directory
        
        Returns:
            List of markdown file paths
        """
        md_files = []
        
        for md_file in repo_dir.rglob('*.md'):
            if not self._should_exclude(md_file):
                md_files.append(md_file)
        
        # Also look for common documentation files
        for pattern in ['README*', 'readme*', 'CHANGELOG*', 'CONTRIBUTING*']:
            for doc_file in repo_dir.glob(pattern):
                if doc_file.is_file() and doc_file not in md_files:
                    md_files.append(doc_file)
        
        return md_files
    
    def _copy_with_category(
        self, 
        source_file: Path, 
        repo_root: Path,
        repo_name: str,
        dest_root: Path
    ) -> Optional[Path]:
        """
        Copy file to categorized destination.
        
        Args:
            source_file: Source file path
            repo_root: Root of source repository
            repo_name: Repository name
            dest_root: Destination root directory
        
        Returns:
            Destination path if successful, None otherwise
        """
        try:
            # Determine category
            category = self._categorize_file(source_file, repo_root)
            self.stats['categories_created'].add(category)
            
            # Determine destination path
            if self.preserve_structure:
                # Preserve repository structure within category
                rel_path = source_file.relative_to(repo_root)
                dest_path = dest_root / category / repo_name / rel_path
            else:
                # Flatten structure
                filename = f"{repo_name}_{source_file.name}"
                dest_path = dest_root / category / filename
            
            # Create destination directory
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Read, normalize, and write
            content = source_file.read_text(encoding='utf-8', errors='ignore')
            normalized = self._normalize_frontmatter(content, source_file, repo_name)
            
            dest_path.write_text(normalized, encoding='utf-8')
            
            self.stats['files_copied'] += 1
            return dest_path
        
        except Exception as e:
            self.stats['errors'].append(f"Error copying {source_file}: {e}")
            self.stats['files_skipped'] += 1
            return None
    
    def aggregate_repository(
        self,
        repo_dir: Path,
        repo_name: str,
        repo_url: str = ""
    ) -> RepoMetadata:
        """
        Aggregate documentation from a repository.
        
        Args:
            repo_dir: Repository directory
            repo_name: Repository name
            repo_url: Repository URL (optional)
        
        Returns:
            Repository metadata
        """
        from datetime import datetime
        
        print(f"\nProcessing repository: {repo_name}")
        print(f"  Source: {repo_dir}")
        
        # Find markdown files
        md_files = self._find_markdown_files(repo_dir)
        print(f"  Found: {len(md_files)} markdown files")
        
        # Copy files with categorization
        copied_count = 0
        for md_file in md_files:
            dest_path = self._copy_with_category(
                md_file,
                repo_dir,
                repo_name,
                self.docs_root
            )
            if dest_path:
                copied_count += 1
        
        print(f"  Copied: {copied_count} files")
        
        # Create metadata
        metadata = RepoMetadata(
            name=repo_name,
            url=repo_url,
            category="mixed",  # Could be refined
            files_count=copied_count,
            last_updated=datetime.now().isoformat()
        )
        
        self.repos_metadata[repo_name] = metadata
        self.stats['repos_processed'] += 1
        
        return metadata
    
    def create_category_indexes(self):
        """Create index.md files for each category"""
        print("\nCreating category index files...")
        
        for category in self.stats['categories_created']:
            category_dir = self.docs_root / category
            index_file = category_dir / 'index.md'
            
            if not index_file.exists():
                # Generate category index
                title = category.replace('-', ' ').replace('_', ' ').title()
                content = f"""---
title: {title}
---

# {title}

This section contains aggregated documentation from multiple repositories.

## Contents

"""
                # List subdirectories (repos)
                for repo_dir in sorted(category_dir.iterdir()):
                    if repo_dir.is_dir() and repo_dir.name != 'index.md':
                        repo_readme = repo_dir / 'README.md'
                        if repo_readme.exists():
                            content += f"- [{repo_dir.name}]({repo_dir.name}/README.md)\n"
                        else:
                            content += f"- [{repo_dir.name}]({repo_dir.name}/)\n"
                
                index_file.write_text(content, encoding='utf-8')
                print(f"  Created: {category}/index.md")
    
    def generate_metadata_file(self):
        """Generate metadata file for all aggregated repositories"""
        metadata_file = self.docs_root / 'repos_metadata.yaml'
        
        metadata_dict = {
            repo_name: asdict(metadata)
            for repo_name, metadata in self.repos_metadata.items()
        }
        
        with open(metadata_file, 'w') as f:
            yaml.dump(metadata_dict, f, default_flow_style=False)
        
        print(f"\nGenerated metadata: {metadata_file}")
    
    def print_summary(self):
        """Print aggregation summary"""
        print("\n" + "="*70)
        print("Documentation Aggregation Summary")
        print("="*70)
        print(f"Repositories Processed:  {self.stats['repos_processed']}")
        print(f"Files Copied:            {self.stats['files_copied']}")
        print(f"Files Skipped:           {self.stats['files_skipped']}")
        print(f"Categories Created:      {len(self.stats['categories_created'])}")
        print(f"  Categories: {', '.join(sorted(self.stats['categories_created']))}")
        
        if self.stats['errors']:
            print(f"\nErrors: {len(self.stats['errors'])}")
            for error in self.stats['errors'][:10]:
                print(f"  - {error}")
            if len(self.stats['errors']) > 10:
                print(f"  ... and {len(self.stats['errors']) - 10} more errors")
        
        print("="*70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Aggregate documentation from repositories with MkDocs optimization'
    )
    parser.add_argument(
        'source_dir',
        type=Path,
        help='Source directory containing cloned repositories'
    )
    parser.add_argument(
        'docs_root',
        type=Path,
        help='Destination root for aggregated documentation'
    )
    parser.add_argument(
        '--flatten',
        action='store_true',
        help='Flatten repository structure instead of preserving it'
    )
    parser.add_argument(
        '--create-indexes',
        action='store_true',
        default=True,
        help='Create index.md files for categories (default: True)'
    )
    
    args = parser.parse_args()
    
    if not args.source_dir.exists():
        print(f"Error: Source directory '{args.source_dir}' does not exist")
        return 1
    
    # Create destination
    args.docs_root.mkdir(parents=True, exist_ok=True)
    
    aggregator = MkDocsAggregator(
        args.docs_root,
        preserve_structure=not args.flatten
    )
    
    print(f"Aggregating documentation...")
    print(f"  Source: {args.source_dir}")
    print(f"  Destination: {args.docs_root}")
    print(f"  Preserve structure: {not args.flatten}")
    
    # Process each subdirectory as a repository
    for repo_dir in args.source_dir.iterdir():
        if repo_dir.is_dir() and not repo_dir.name.startswith('.'):
            aggregator.aggregate_repository(
                repo_dir,
                repo_dir.name,
                repo_url=f"https://github.com/user/{repo_dir.name}"  # Placeholder
            )
    
    # Post-processing
    if args.create_indexes:
        aggregator.create_category_indexes()
    
    aggregator.generate_metadata_file()
    aggregator.print_summary()
    
    return 0


if __name__ == '__main__':
    exit(main())
