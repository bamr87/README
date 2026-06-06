#!/usr/bin/env python3
"""
MkDocs Documentation Quality Reporter

Analyzes documentation for MkDocs compatibility and quality:
- Link health and validity
- Frontmatter consistency
- Navigation structure
- MkDocs compatibility issues
- Generates comprehensive quality report
"""

import re
import yaml
import json
import argparse
from pathlib import Path
from typing import Dict, List, Set, Tuple, Optional
from collections import defaultdict
from dataclasses import dataclass, asdict
from urllib.parse import urlparse


@dataclass
class FileReport:
    """Report for a single file"""
    path: str
    has_frontmatter: bool
    has_title: bool
    link_count: int
    external_links: int
    internal_links: int
    broken_links: List[str]
    absolute_links: List[str]
    jekyll_links: List[str]
    missing_anchors: List[str]
    heading_count: int
    issues: List[str]
    warnings: List[str]


@dataclass
class QualityReport:
    """Overall quality report"""
    total_files: int
    files_with_frontmatter: int
    files_without_frontmatter: int
    total_links: int
    external_links: int
    internal_links: int
    broken_links: int
    absolute_links: int
    jekyll_links: int
    missing_anchors: int
    total_issues: int
    total_warnings: int
    categories: Dict[str, int]
    file_reports: List[FileReport]


class MkDocsQualityAnalyzer:
    """Analyze documentation quality for MkDocs"""
    
    def __init__(self, docs_root: Path):
        """
        Initialize analyzer.
        
        Args:
            docs_root: Root directory of documentation
        """
        self.docs_root = Path(docs_root).resolve()
        self.all_files = self._index_files()
        self.all_anchors = {}
        self.file_reports = []
    
    def _index_files(self) -> Dict[str, Path]:
        """Index all markdown files"""
        files = {}
        for md_file in self.docs_root.rglob('*.md'):
            rel_path = str(md_file.relative_to(self.docs_root))
            files[rel_path] = md_file
            files[md_file.name] = md_file
        return files
    
    def _extract_frontmatter(self, content: str) -> Tuple[Optional[Dict], str]:
        """
        Extract YAML frontmatter from content.
        
        Returns:
            Tuple of (frontmatter dict, body content)
        """
        if not content.startswith('---'):
            return None, content
        
        try:
            parts = content.split('---', 2)
            if len(parts) >= 3:
                fm_content = parts[1]
                body_content = parts[2]
                frontmatter = yaml.safe_load(fm_content)
                return frontmatter, body_content
        except yaml.YAMLError:
            pass
        
        return None, content
    
    def _extract_headings(self, content: str) -> List[str]:
        """Extract all markdown headings"""
        heading_pattern = r'^#{1,6}\s+(.+)$'
        return re.findall(heading_pattern, content, re.MULTILINE)
    
    def _extract_anchors(self, content: str) -> Set[str]:
        """Extract heading anchors in MkDocs format"""
        headings = self._extract_headings(content)
        anchors = set()
        
        for heading in headings:
            # Remove markdown formatting
            heading = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', heading)
            heading = re.sub(r'[*_`]', '', heading)
            
            # Convert to anchor format
            anchor = heading.lower()
            anchor = re.sub(r'[^\w\s-]', '', anchor)
            anchor = re.sub(r'[-\s]+', '-', anchor).strip('-')
            anchors.add(anchor)
        
        return anchors
    
    def _extract_links(self, content: str) -> List[Tuple[str, str]]:
        """
        Extract all markdown links.
        
        Returns:
            List of (link_text, link_url) tuples
        """
        link_pattern = r'\[([^\]]+)\]\(([^)]+)\)'
        return re.findall(link_pattern, content)
    
    def _is_external_link(self, link: str) -> bool:
        """Check if link is external"""
        parsed = urlparse(link)
        return bool(parsed.scheme and parsed.netloc)
    
    def _is_absolute_link(self, link: str) -> bool:
        """Check if link is absolute (starts with /)"""
        return link.startswith('/') and not link.startswith('//')
    
    def _is_jekyll_link(self, link: str) -> bool:
        """Check if link contains Jekyll/Hugo liquid syntax"""
        jekyll_patterns = [
            r'\{\{.*\}\}',
            r'\{%.*%\}',
        ]
        return any(re.search(pattern, link) for pattern in jekyll_patterns)
    
    def _validate_internal_link(
        self,
        link_url: str,
        current_file: Path
    ) -> Tuple[bool, Optional[str]]:
        """
        Validate an internal link.
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Split link and anchor
        link_parts = link_url.split('#', 1)
        link_path = link_parts[0]
        anchor = link_parts[1] if len(link_parts) > 1 else None
        
        if not link_path:
            # Anchor-only link to current file
            if anchor:
                if current_file not in self.all_anchors:
                    content = current_file.read_text(encoding='utf-8', errors='ignore')
                    _, body = self._extract_frontmatter(content)
                    self.all_anchors[current_file] = self._extract_anchors(body)
                
                if anchor not in self.all_anchors[current_file]:
                    return False, f"Missing anchor: #{anchor}"
            return True, None
        
        # Resolve file path
        if self._is_absolute_link(link_url):
            # Absolute link
            clean_path = link_path.lstrip('/')
            if clean_path.endswith('.md'):
                target_file = self.all_files.get(clean_path)
            else:
                # Try with .md extension
                target_file = self.all_files.get(f"{clean_path}.md")
                if not target_file:
                    # Try as index
                    target_file = self.all_files.get(f"{clean_path}/index.md")
        else:
            # Relative link
            target_path = (current_file.parent / link_path).resolve()
            if target_path.exists():
                target_file = target_path
            else:
                return False, f"File not found: {link_path}"
        
        if not target_file or not target_file.exists():
            return False, f"Broken link: {link_url}"
        
        # Validate anchor if present
        if anchor:
            if target_file not in self.all_anchors:
                content = target_file.read_text(encoding='utf-8', errors='ignore')
                _, body = self._extract_frontmatter(content)
                self.all_anchors[target_file] = self._extract_anchors(body)
            
            if anchor not in self.all_anchors[target_file]:
                return False, f"Missing anchor in {target_file.name}: #{anchor}"
        
        return True, None
    
    def analyze_file(self, file_path: Path) -> FileReport:
        """
        Analyze a single markdown file.
        
        Args:
            file_path: Path to markdown file
        
        Returns:
            FileReport instance
        """
        try:
            content = file_path.read_text(encoding='utf-8', errors='ignore')
        except Exception as e:
            return FileReport(
                path=str(file_path.relative_to(self.docs_root)),
                has_frontmatter=False,
                has_title=False,
                link_count=0,
                external_links=0,
                internal_links=0,
                broken_links=[],
                absolute_links=[],
                jekyll_links=[],
                missing_anchors=[],
                heading_count=0,
                issues=[f"Error reading file: {e}"],
                warnings=[]
            )
        
        # Extract frontmatter
        frontmatter, body = self._extract_frontmatter(content)
        has_frontmatter = frontmatter is not None
        has_title = bool(frontmatter and frontmatter.get('title')) if frontmatter else False
        
        # Extract headings
        headings = self._extract_headings(body)
        heading_count = len(headings)
        
        # Extract and analyze links
        links = self._extract_links(content)
        link_count = len(links)
        external_links = []
        internal_links = []
        broken_links = []
        absolute_links = []
        jekyll_links = []
        missing_anchors = []
        
        for link_text, link_url in links:
            # Check for Jekyll syntax
            if self._is_jekyll_link(link_url):
                jekyll_links.append(link_url)
            
            # Categorize link
            if self._is_external_link(link_url):
                external_links.append(link_url)
            else:
                internal_links.append(link_url)
                
                # Check for absolute links
                if self._is_absolute_link(link_url):
                    absolute_links.append(link_url)
                
                # Validate internal link
                is_valid, error = self._validate_internal_link(link_url, file_path)
                if not is_valid:
                    if 'Missing anchor' in error:
                        missing_anchors.append(link_url)
                    else:
                        broken_links.append(link_url)
        
        # Collect issues and warnings
        issues = []
        warnings = []
        
        if not has_frontmatter:
            issues.append("Missing YAML frontmatter")
        
        if not has_title:
            warnings.append("No title in frontmatter")
        
        if heading_count == 0:
            warnings.append("No headings found")
        
        if broken_links:
            issues.append(f"{len(broken_links)} broken link(s)")
        
        if absolute_links:
            warnings.append(f"{len(absolute_links)} absolute link(s) (may break)")
        
        if jekyll_links:
            issues.append(f"{len(jekyll_links)} Jekyll/Hugo link(s) need conversion")
        
        return FileReport(
            path=str(file_path.relative_to(self.docs_root)),
            has_frontmatter=has_frontmatter,
            has_title=has_title,
            link_count=link_count,
            external_links=len(external_links),
            internal_links=len(internal_links),
            broken_links=broken_links,
            absolute_links=absolute_links,
            jekyll_links=jekyll_links,
            missing_anchors=missing_anchors,
            heading_count=heading_count,
            issues=issues,
            warnings=warnings
        )
    
    def analyze_all(self, verbose: bool = False) -> QualityReport:
        """
        Analyze all markdown files.
        
        Args:
            verbose: Print progress
        
        Returns:
            QualityReport instance
        """
        file_reports = []
        categories = defaultdict(int)
        
        for md_file in self.docs_root.rglob('*.md'):
            if verbose:
                print(f"Analyzing: {md_file.relative_to(self.docs_root)}")
            
            report = self.analyze_file(md_file)
            file_reports.append(report)
            
            # Categorize by directory
            parts = Path(report.path).parts
            if len(parts) > 0:
                category = parts[0]
                categories[category] += 1
        
        # Aggregate statistics
        total_files = len(file_reports)
        files_with_frontmatter = sum(1 for r in file_reports if r.has_frontmatter)
        files_without_frontmatter = total_files - files_with_frontmatter
        total_links = sum(r.link_count for r in file_reports)
        external_links = sum(r.external_links for r in file_reports)
        internal_links = sum(r.internal_links for r in file_reports)
        broken_links = sum(len(r.broken_links) for r in file_reports)
        absolute_links = sum(len(r.absolute_links) for r in file_reports)
        jekyll_links = sum(len(r.jekyll_links) for r in file_reports)
        missing_anchors = sum(len(r.missing_anchors) for r in file_reports)
        total_issues = sum(len(r.issues) for r in file_reports)
        total_warnings = sum(len(r.warnings) for r in file_reports)
        
        return QualityReport(
            total_files=total_files,
            files_with_frontmatter=files_with_frontmatter,
            files_without_frontmatter=files_without_frontmatter,
            total_links=total_links,
            external_links=external_links,
            internal_links=internal_links,
            broken_links=broken_links,
            absolute_links=absolute_links,
            jekyll_links=jekyll_links,
            missing_anchors=missing_anchors,
            total_issues=total_issues,
            total_warnings=total_warnings,
            categories=dict(categories),
            file_reports=file_reports
        )
    
    def print_report(self, report: QualityReport, show_details: bool = False):
        """Print quality report"""
        print("\n" + "="*70)
        print("MkDocs Documentation Quality Report")
        print("="*70)
        
        # File statistics
        print(f"\n📁 File Statistics:")
        print(f"  Total Files:              {report.total_files}")
        print(f"  With Frontmatter:         {report.files_with_frontmatter} ({report.files_with_frontmatter/report.total_files*100:.1f}%)")
        print(f"  Without Frontmatter:      {report.files_without_frontmatter} ({report.files_without_frontmatter/report.total_files*100:.1f}%)")
        
        # Link statistics
        print(f"\n🔗 Link Statistics:")
        print(f"  Total Links:              {report.total_links}")
        print(f"  External Links:           {report.external_links}")
        print(f"  Internal Links:           {report.internal_links}")
        print(f"  Broken Links:             {report.broken_links} ❌")
        print(f"  Absolute Links:           {report.absolute_links} ⚠️")
        print(f"  Jekyll/Hugo Links:        {report.jekyll_links} ⚠️")
        print(f"  Missing Anchors:          {report.missing_anchors} ⚠️")
        
        # Issue summary
        print(f"\n⚡ Issues & Warnings:")
        print(f"  Total Issues:             {report.total_issues}")
        print(f"  Total Warnings:           {report.total_warnings}")
        
        # Categories
        print(f"\n📂 Categories:")
        for category, count in sorted(report.categories.items()):
            print(f"  {category:25s} {count:4d} files")
        
        # Top issues
        if show_details:
            print(f"\n🔍 Files with Most Issues:")
            issues_sorted = sorted(
                report.file_reports,
                key=lambda r: len(r.issues) + len(r.warnings),
                reverse=True
            )[:10]
            
            for file_report in issues_sorted:
                if file_report.issues or file_report.warnings:
                    print(f"\n  {file_report.path}")
                    for issue in file_report.issues:
                        print(f"    ❌ {issue}")
                    for warning in file_report.warnings:
                        print(f"    ⚠️  {warning}")
        
        print("\n" + "="*70 + "\n")
    
    def export_json(self, report: QualityReport, output_file: Path):
        """Export report as JSON"""
        report_dict = asdict(report)
        
        with open(output_file, 'w') as f:
            json.dump(report_dict, f, indent=2)
        
        print(f"Report exported to: {output_file}")


def main():
    parser = argparse.ArgumentParser(
        description='Analyze documentation quality for MkDocs'
    )
    parser.add_argument(
        'docs_root',
        type=Path,
        help='Root directory of documentation'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print detailed progress'
    )
    parser.add_argument(
        '--show-details',
        action='store_true',
        help='Show detailed file-level issues'
    )
    parser.add_argument(
        '--export-json',
        type=Path,
        help='Export report as JSON to specified file'
    )
    
    args = parser.parse_args()
    
    if not args.docs_root.exists():
        print(f"Error: Documentation root '{args.docs_root}' does not exist")
        return 1
    
    analyzer = MkDocsQualityAnalyzer(args.docs_root)
    
    print(f"\nAnalyzing documentation in: {args.docs_root}\n")
    
    report = analyzer.analyze_all(verbose=args.verbose)
    analyzer.print_report(report, show_details=args.show_details)
    
    if args.export_json:
        analyzer.export_json(report, args.export_json)
    
    return 0


if __name__ == '__main__':
    exit(main())
