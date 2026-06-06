#!/usr/bin/env python3
"""
MkDocs Link Fixer

Converts and fixes links in markdown files to be MkDocs-compatible:
- Converts absolute site links to relative paths
- Fixes broken internal links
- Handles Jekyll/Hugo-style liquid tags
- Validates anchor references
- Reports link health
"""

import re
import argparse
from pathlib import Path
from typing import Dict, List, Tuple, Set
from urllib.parse import urlparse


class MkDocsLinkFixer:
    """Fix and validate links for MkDocs compatibility"""
    
    def __init__(self, docs_root: Path, site_url: str = ""):
        """
        Initialize the link fixer.
        
        Args:
            docs_root: Root directory of documentation
            site_url: Base URL of the site (optional)
        """
        self.docs_root = Path(docs_root).resolve()
        self.site_url = site_url.rstrip('/') if site_url else ""
        self.all_files = self._index_files()
        self.all_anchors = {}
        self.stats = {
            'files_processed': 0,
            'links_fixed': 0,
            'absolute_links_converted': 0,
            'broken_links_found': 0,
            'jekyll_links_converted': 0,
            'warnings': []
        }
    
    def _index_files(self) -> Dict[str, Path]:
        """Index all markdown files for quick lookup"""
        files = {}
        for md_file in self.docs_root.rglob('*.md'):
            # Store by relative path from docs root
            rel_path = str(md_file.relative_to(self.docs_root))
            files[rel_path] = md_file
            
            # Also store basename for easier matching
            basename = md_file.name
            if basename not in files:
                files[basename] = md_file
        
        return files
    
    def _extract_anchors(self, file_path: Path) -> Set[str]:
        """Extract all heading anchors from a markdown file"""
        anchors = set()
        
        try:
            content = file_path.read_text(encoding='utf-8')
            
            # Find all markdown headings
            heading_pattern = r'^#{1,6}\s+(.+)$'
            for match in re.finditer(heading_pattern, content, re.MULTILINE):
                heading_text = match.group(1).strip()
                
                # Convert heading to MkDocs anchor format
                # Remove markdown formatting
                heading_text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', heading_text)
                heading_text = re.sub(r'[*_`]', '', heading_text)
                
                # Convert to lowercase and replace spaces/special chars with hyphens
                anchor = heading_text.lower()
                anchor = re.sub(r'[^\w\s-]', '', anchor)
                anchor = re.sub(r'[-\s]+', '-', anchor).strip('-')
                
                anchors.add(anchor)
        
        except Exception as e:
            self.stats['warnings'].append(f"Error extracting anchors from {file_path}: {e}")
        
        return anchors
    
    def _is_external_link(self, link: str) -> bool:
        """Check if link is external"""
        parsed = urlparse(link)
        return bool(parsed.scheme and parsed.netloc)
    
    def _is_absolute_site_link(self, link: str) -> bool:
        """Check if link is absolute but to the same site"""
        if not link.startswith('/'):
            return False
        
        # Exclude protocol-relative URLs
        if link.startswith('//'):
            return False
        
        return True
    
    def _convert_absolute_to_relative(self, link: str, current_file: Path) -> str:
        """Convert absolute site link to relative path"""
        if not self._is_absolute_site_link(link):
            return link
        
        # Remove leading slash and anchor/query
        link_parts = link.lstrip('/').split('#', 1)
        link_path = link_parts[0].split('?', 1)[0]
        anchor = f"#{link_parts[1]}" if len(link_parts) > 1 else ""
        
        # Try to find the target file
        target_file = None
        
        # Try direct path match
        if link_path in self.all_files:
            target_file = self.all_files[link_path]
        else:
            # Try appending .md
            md_path = f"{link_path}.md" if not link_path.endswith('.md') else link_path
            if md_path in self.all_files:
                target_file = self.all_files[md_path]
            else:
                # Try as directory index
                index_path = f"{link_path}/index.md"
                if index_path in self.all_files:
                    target_file = self.all_files[index_path]
        
        if target_file:
            # Calculate relative path
            current_dir = current_file.parent
            rel_path = Path(target_file).relative_to(self.docs_root)
            
            # Calculate path from current file to target
            try:
                from_current = Path('../' * (len(current_dir.relative_to(self.docs_root).parts)))
                relative_link = str(from_current / rel_path).replace('\\', '/')
                
                # Clean up the path
                relative_link = re.sub(r'/+', '/', relative_link)
                if relative_link.startswith('./'):
                    relative_link = relative_link[2:]
                
                self.stats['absolute_links_converted'] += 1
                return f"{relative_link}{anchor}"
            
            except ValueError:
                # Can't make relative path
                pass
        
        # Return original if can't convert
        return link
    
    def _fix_jekyll_links(self, content: str) -> str:
        """Convert Jekyll/Hugo liquid tags to standard markdown"""
        modified = False
        
        # Pattern: {{ '/path' | relative_url }} or {{ site.baseurl }}/path
        jekyll_patterns = [
            (r"\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}", r'\1'),
            (r"\{\{\s*site\.baseurl\s*\}\}(/[^'\s}]+)", r'\1'),
            (r"\{\{\s*site\.github_user\s*\}\}\.github\.io", r''),
        ]
        
        for pattern, replacement in jekyll_patterns:
            if re.search(pattern, content):
                content = re.sub(pattern, replacement, content)
                self.stats['jekyll_links_converted'] += 1
                modified = True
        
        return content
    
    def _fix_markdown_links(self, content: str, current_file: Path) -> str:
        """Fix markdown links in content"""
        
        def replace_link(match):
            link_text = match.group(1)
            link_url = match.group(2)
            
            # Skip external links
            if self._is_external_link(link_url):
                return match.group(0)
            
            # Convert absolute site links to relative
            fixed_url = self._convert_absolute_to_relative(link_url, current_file)
            
            if fixed_url != link_url:
                self.stats['links_fixed'] += 1
                return f"[{link_text}]({fixed_url})"
            
            return match.group(0)
        
        # Pattern for markdown links
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        return re.sub(link_pattern, replace_link, content)
    
    def _validate_links(self, content: str, current_file: Path) -> List[str]:
        """Validate all links in content and return warnings"""
        warnings = []
        
        # Find all markdown links
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        for match in re.finditer(link_pattern, content):
            link_url = match.group(2)
            
            # Skip external links
            if self._is_external_link(link_url):
                continue
            
            # Split link and anchor
            link_parts = link_url.split('#', 1)
            link_path = link_parts[0]
            anchor = link_parts[1] if len(link_parts) > 1 else None
            
            # Validate file exists (for relative links)
            if link_path and not self._is_absolute_site_link(link_url):
                target = (current_file.parent / link_path).resolve()
                
                if not target.exists():
                    warnings.append(f"Broken link in {current_file.name}: '{link_url}'")
                    self.stats['broken_links_found'] += 1
                elif anchor:
                    # Validate anchor exists
                    if target not in self.all_anchors:
                        self.all_anchors[target] = self._extract_anchors(target)
                    
                    if anchor not in self.all_anchors[target]:
                        warnings.append(f"Missing anchor in {current_file.name}: '{link_url}'")
        
        return warnings
    
    def process_file(self, file_path: Path, fix: bool = True) -> Tuple[str, List[str]]:
        """
        Process a single markdown file.
        
        Args:
            file_path: Path to markdown file
            fix: Whether to apply fixes (True) or just report (False)
        
        Returns:
            Tuple of (processed content, warnings)
        """
        try:
            content = file_path.read_text(encoding='utf-8')
            original_content = content
            warnings = []
            
            # Fix Jekyll/Hugo liquid tags
            content = self._fix_jekyll_links(content)
            
            # Fix markdown links
            content = self._fix_markdown_links(content, file_path)
            
            # Validate links
            warnings = self._validate_links(content, file_path)
            
            # Write back if modified and fix is enabled
            if fix and content != original_content:
                file_path.write_text(content, encoding='utf-8')
                self.stats['files_processed'] += 1
            
            return content, warnings
        
        except Exception as e:
            error_msg = f"Error processing {file_path}: {e}"
            return "", [error_msg]
    
    def process_all(self, fix: bool = True, verbose: bool = False) -> Dict:
        """
        Process all markdown files in docs root.
        
        Args:
            fix: Whether to apply fixes or just report
            verbose: Print detailed progress
        
        Returns:
            Statistics dictionary
        """
        for file_path in self.docs_root.rglob('*.md'):
            if verbose:
                print(f"Processing: {file_path.relative_to(self.docs_root)}")
            
            _, warnings = self.process_file(file_path, fix)
            
            if warnings:
                self.stats['warnings'].extend(warnings)
                if verbose:
                    for warning in warnings:
                        print(f"  WARNING: {warning}")
        
        return self.stats
    
    def print_report(self):
        """Print summary report"""
        print("\n" + "="*70)
        print("MkDocs Link Fixer Report")
        print("="*70)
        print(f"Files Processed:           {self.stats['files_processed']}")
        print(f"Links Fixed:               {self.stats['links_fixed']}")
        print(f"Absolute Links Converted:  {self.stats['absolute_links_converted']}")
        print(f"Jekyll Links Converted:    {self.stats['jekyll_links_converted']}")
        print(f"Broken Links Found:        {self.stats['broken_links_found']}")
        print(f"Total Warnings:            {len(self.stats['warnings'])}")
        
        if self.stats['warnings']:
            print("\nWarnings:")
            for warning in self.stats['warnings'][:20]:  # Show first 20
                print(f"  - {warning}")
            
            if len(self.stats['warnings']) > 20:
                print(f"  ... and {len(self.stats['warnings']) - 20} more warnings")
        
        print("="*70 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Fix and validate links for MkDocs compatibility'
    )
    parser.add_argument(
        'docs_root',
        type=Path,
        help='Root directory of documentation (e.g., README/docs)'
    )
    parser.add_argument(
        '--site-url',
        default='',
        help='Base URL of the site (optional)'
    )
    parser.add_argument(
        '--dry-run',
        action='store_true',
        help='Report issues without making changes'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print detailed progress'
    )
    
    args = parser.parse_args()
    
    if not args.docs_root.exists():
        print(f"Error: Documentation root '{args.docs_root}' does not exist")
        return 1
    
    fixer = MkDocsLinkFixer(args.docs_root, args.site_url)
    
    fix_mode = not args.dry_run
    mode_str = "Fixing" if fix_mode else "Analyzing"
    
    print(f"\n{mode_str} links in: {args.docs_root}")
    print(f"Site URL: {args.site_url if args.site_url else '(not specified)'}\n")
    
    fixer.process_all(fix=fix_mode, verbose=args.verbose)
    fixer.print_report()
    
    return 0


if __name__ == '__main__':
    exit(main())
