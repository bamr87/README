#!/usr/bin/env python3
"""
Execute systematic documentation cleanup based on structure analysis
"""

import os
import json
import shutil
from pathlib import Path
from datetime import datetime
from typing import List, Dict


class DocCleanupExecutor:
    """Execute systematic documentation cleanup operations"""
    
    def __init__(self, docs_dir: str, backup_dir: str = None):
        self.docs_dir = Path(docs_dir)
        self.backup_dir = Path(backup_dir or 'docs/.harmonize/cleanup_backups')
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        
        self.actions_log = []
        self.stats = {
            'files_removed': 0,
            'files_moved': 0,
            'files_merged': 0,
            'bytes_freed': 0
        }
    
    def log_action(self, action_type: str, description: str, files: List[str] = None):
        """Log an action"""
        self.actions_log.append({
            'timestamp': datetime.now().isoformat(),
            'action': action_type,
            'description': description,
            'files': files or []
        })
    
    def backup_file(self, filepath: Path) -> Path:
        """Backup a file before modification/deletion"""
        rel_path = filepath.relative_to(self.docs_dir)
        backup_path = self.backup_dir / rel_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        
        if filepath.exists():
            shutil.copy2(filepath, backup_path)
        
        return backup_path
    
    def remove_large_external_repos(self, dry_run: bool = True) -> Dict:
        """
        Remove or archive large external repository documentation
        that doesn't need to be in the docs directory
        """
        print("🗑️  Removing large external repository docs...")
        
        # React repository is too large (1575 files)
        react_dirs = [
            self.docs_dir / 'misc' / 'react',
            self.docs_dir / 'api' / 'react',
            self.docs_dir / 'development' / 'react',
            self.docs_dir / 'setup' / 'react',
        ]
        
        removed = []
        for react_dir in react_dirs:
            if react_dir.exists():
                # Count files
                file_count = len(list(react_dir.rglob('*.md')))
                dir_size = sum(f.stat().st_size for f in react_dir.rglob('*') if f.is_file())
                
                if file_count > 100:  # Only remove if it's actually large
                    print(f"   Found: {react_dir.relative_to(self.docs_dir)} ({file_count} files, {dir_size/1024/1024:.1f} MB)")
                    
                    if not dry_run:
                        # Create backup
                        backup_path = self.backup_dir / react_dir.relative_to(self.docs_dir)
                        print(f"      Backing up to: {backup_path}")
                        shutil.move(str(react_dir), str(backup_path))
                        
                        # Create a reference file
                        ref_file = react_dir.with_suffix('.reference.md')
                        ref_file.write_text(f"""# React Documentation Reference

This directory contained {file_count} files from the React repository.

To reduce repository size, the full React documentation has been moved to:
- Backup: {backup_path}
- Original source: https://github.com/facebook/react

## Quick Links

- [React Official Docs](https://react.dev)
- [React GitHub](https://github.com/facebook/react)
- [React API Reference](https://react.dev/reference/react)

Backup created: {datetime.now().isoformat()}
""")
                        
                        self.stats['files_removed'] += file_count
                        self.stats['bytes_freed'] += dir_size
                        removed.append(str(react_dir.relative_to(self.docs_dir)))
                        
                        print(f"      ✅ Removed and replaced with reference file")
                    else:
                        print(f"      [DRY RUN] Would remove and create reference")
                        removed.append(str(react_dir.relative_to(self.docs_dir)))
        
        self.log_action('remove_large_repos', f'Removed {len(removed)} large external repo directories', removed)
        return {'removed': removed, 'dry_run': dry_run}
    
    def consolidate_duplicate_readmes(self, dry_run: bool = True) -> Dict:
        """Consolidate directories with multiple README files"""
        print("\n🔀 Consolidating duplicate READMEs...")
        
        # Directories known to have multiple READMEs
        target_dirs = [
            'setup/ai-evolution-engine-seed/tests',
            'setup/ai-evolution-engine-seed/prompts/templates',
            'setup/barodybroject',
            'setup/barodybroject/src/parodynews/docs',
            'setup/it-journey/scripts',
        ]
        
        consolidated = []
        for dir_path in target_dirs:
            full_dir = self.docs_dir / dir_path
            if not full_dir.exists():
                continue
            
            # Find all README files (not directories)
            readmes = [f for f in full_dir.glob('README*') if f.is_file()]
            if len(readmes) <= 1:
                continue
            
            print(f"   {dir_path}: Found {len(readmes)} README files")
            for readme in readmes:
                print(f"      - {readme.name}")
            
            if not dry_run:
                # Merge into README.md
                main_readme = full_dir / 'README.md'
                
                # Backup existing
                if main_readme.exists():
                    self.backup_file(main_readme)
                
                # Merge content
                merged_content = f"# {full_dir.name}\n\n"
                merged_content += f"*Consolidated from {len(readmes)} README files on {datetime.now().strftime('%Y-%m-%d')}*\n\n"
                
                for readme in sorted(readmes):
                    if readme.exists():
                        content = readme.read_text()
                        merged_content += f"\n---\n## From: {readme.name}\n\n{content}\n"
                        
                        if readme != main_readme:
                            readme.unlink()  # Delete non-main READMEs
                
                main_readme.write_text(merged_content)
                
                self.stats['files_merged'] += len(readmes) - 1
                consolidated.append(dir_path)
                print(f"      ✅ Merged into {main_readme.name}")
            else:
                print(f"      [DRY RUN] Would merge into README.md")
                consolidated.append(dir_path)
        
        self.log_action('consolidate_readmes', f'Consolidated READMEs in {len(consolidated)} directories', consolidated)
        return {'consolidated': consolidated, 'dry_run': dry_run}
    
    def remove_very_small_files(self, threshold: int = 200, dry_run: bool = True) -> Dict:
        """Remove or flag very small files that are likely stubs"""
        print(f"\n🧹 Reviewing files smaller than {threshold} bytes...")
        
        small_files = []
        for md_file in self.docs_dir.rglob('*.md'):
            if md_file.stat().st_size < threshold:
                rel_path = md_file.relative_to(self.docs_dir)
                small_files.append((str(rel_path), md_file.stat().st_size))
        
        print(f"   Found {len(small_files)} files < {threshold} bytes")
        
        if small_files and not dry_run:
            # Create a report file instead of auto-deleting
            report_file = self.docs_dir / '.harmonize' / 'small_files_review.md'
            report_file.parent.mkdir(parents=True, exist_ok=True)
            
            report = f"# Small Files Review\n\n"
            report += f"Generated: {datetime.now().isoformat()}\n\n"
            report += f"Found {len(small_files)} files smaller than {threshold} bytes.\n\n"
            report += "## Files to Review\n\n"
            
            for filepath, size in sorted(small_files, key=lambda x: x[1]):
                report += f"- [ ] `{filepath}` ({size} bytes)\n"
            
            report_file.write_text(report)
            print(f"   ✅ Created review file: {report_file.relative_to(self.docs_dir)}")
        else:
            print(f"   [DRY RUN] Would create review file for manual inspection")
        
        self.log_action('review_small_files', f'Identified {len(small_files)} small files for review', 
                       [f[0] for f in small_files[:20]])
        return {'small_files_count': len(small_files), 'dry_run': dry_run}
    
    def generate_cleanup_report(self) -> str:
        """Generate cleanup report"""
        report = f"""# Documentation Cleanup Report

**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

## Summary

- Files Removed: {self.stats['files_removed']}
- Files Moved: {self.stats['files_moved']}
- Files Merged: {self.stats['files_merged']}
- Space Freed: {self.stats['bytes_freed'] / 1024 / 1024:.2f} MB

## Actions Performed

"""
        for action in self.actions_log:
            report += f"\n### {action['action']} - {action['timestamp']}\n"
            report += f"{action['description']}\n"
            if action['files']:
                report += "\nFiles:\n"
                for file in action['files'][:10]:
                    report += f"- {file}\n"
                if len(action['files']) > 10:
                    report += f"... and {len(action['files']) - 10} more\n"
        
        return report
    
    def execute_cleanup(self, dry_run: bool = True):
        """Execute full cleanup process"""
        print("="*70)
        print("🧹 DOCUMENTATION CLEANUP EXECUTION")
        print("="*70)
        print(f"Mode: {'DRY RUN (no changes will be made)' if dry_run else 'LIVE (files will be modified)'}\n")
        
        # Step 1: Remove large external repos
        self.remove_large_external_repos(dry_run)
        
        # Step 2: Consolidate duplicate READMEs
        self.consolidate_duplicate_readmes(dry_run)
        
        # Step 3: Review small files
        self.remove_very_small_files(threshold=200, dry_run=dry_run)
        
        # Generate report
        print("\n" + "="*70)
        report = self.generate_cleanup_report()
        
        report_file = self.docs_dir / '.harmonize' / f'cleanup_report_{datetime.now().strftime("%Y%m%d_%H%M%S")}.md'
        report_file.parent.mkdir(parents=True, exist_ok=True)
        report_file.write_text(report)
        
        print(report)
        print(f"\n💾 Report saved to: {report_file.relative_to(self.docs_dir)}")
        print("="*70)
        
        return report


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Execute documentation cleanup')
    parser.add_argument('--docs-dir', default='docs', help='Documentation directory')
    parser.add_argument('--no-dry-run', action='store_true', help='Actually execute changes (default is dry-run)')
    
    args = parser.parse_args()
    
    executor = DocCleanupExecutor(args.docs_dir)
    executor.execute_cleanup(dry_run=not args.no_dry_run)


if __name__ == '__main__':
    main()
