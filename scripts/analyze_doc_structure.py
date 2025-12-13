#!/usr/bin/env python3
"""
Analyze documentation structure to identify consolidation opportunities
without requiring API calls.
"""

import os
import json
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Tuple
import re

class DocStructureAnalyzer:
    """Analyze documentation structure for consolidation opportunities"""
    
    def __init__(self, docs_dir: str):
        self.docs_dir = Path(docs_dir)
        self.files = []
        self.analysis = {
            'total_files': 0,
            'empty_files': [],
            'small_files': [],  # < 500 bytes
            'duplicate_names': defaultdict(list),
            'readme_files': [],
            'changelog_files': [],
            'test_files': [],
            'by_directory': defaultdict(list),
            'by_extension': defaultdict(list),
        }
    
    def discover_files(self):
        """Discover all markdown files"""
        print(f"🔍 Discovering files in {self.docs_dir}...")
        
        for root, dirs, files in os.walk(self.docs_dir):
            # Skip hidden directories
            dirs[:] = [d for d in dirs if not d.startswith('.')]
            
            for file in files:
                if file.endswith('.md'):
                    filepath = Path(root) / file
                    self.files.append(filepath)
        
        self.analysis['total_files'] = len(self.files)
        print(f"   Found {len(self.files)} markdown files\n")
    
    def analyze_file_sizes(self):
        """Identify empty and very small files"""
        print("📏 Analyzing file sizes...")
        
        for filepath in self.files:
            try:
                size = filepath.stat().st_size
                
                if size == 0:
                    self.analysis['empty_files'].append(str(filepath.relative_to(self.docs_dir)))
                elif size < 500:
                    self.analysis['small_files'].append({
                        'path': str(filepath.relative_to(self.docs_dir)),
                        'size': size
                    })
            except Exception as e:
                print(f"   ⚠️  Error analyzing {filepath}: {e}")
        
        print(f"   Empty files: {len(self.analysis['empty_files'])}")
        print(f"   Small files (<500 bytes): {len(self.analysis['small_files'])}\n")
    
    def analyze_naming_patterns(self):
        """Identify files with same names in different directories"""
        print("🏷️  Analyzing naming patterns...")
        
        name_to_paths = defaultdict(list)
        
        for filepath in self.files:
            filename = filepath.name
            rel_path = str(filepath.relative_to(self.docs_dir))
            name_to_paths[filename].append(rel_path)
            
            # Categorize special file types
            filename_lower = filename.lower()
            if 'readme' in filename_lower:
                self.analysis['readme_files'].append(rel_path)
            elif 'changelog' in filename_lower or 'changes' in filename_lower:
                self.analysis['changelog_files'].append(rel_path)
            elif 'test' in filename_lower:
                self.analysis['test_files'].append(rel_path)
        
        # Find duplicates
        for name, paths in name_to_paths.items():
            if len(paths) > 1:
                self.analysis['duplicate_names'][name] = paths
        
        print(f"   Duplicate filenames: {len(self.analysis['duplicate_names'])}")
        print(f"   README files: {len(self.analysis['readme_files'])}")
        print(f"   CHANGELOG files: {len(self.analysis['changelog_files'])}")
        print(f"   Test files: {len(self.analysis['test_files'])}\n")
    
    def analyze_directory_structure(self):
        """Group files by directory to identify consolidation opportunities"""
        print("📂 Analyzing directory structure...")
        
        for filepath in self.files:
            rel_path = filepath.relative_to(self.docs_dir)
            
            # Get immediate parent directory
            if len(rel_path.parts) > 1:
                parent_dir = str(Path(rel_path.parts[0]) / rel_path.parts[1] if len(rel_path.parts) > 2 else rel_path.parts[0])
            else:
                parent_dir = 'root'
            
            self.analysis['by_directory'][parent_dir].append(str(rel_path))
        
        # Find directories with many files
        large_dirs = [(dir, len(files)) for dir, files in self.analysis['by_directory'].items() if len(files) > 10]
        large_dirs.sort(key=lambda x: x[1], reverse=True)
        
        print(f"   Total directories: {len(self.analysis['by_directory'])}")
        print(f"   Directories with >10 files: {len(large_dirs)}")
        if large_dirs:
            print(f"   Top 5 largest directories:")
            for dir, count in large_dirs[:5]:
                print(f"      {dir}: {count} files")
        print()
    
    def generate_consolidation_recommendations(self) -> List[Dict]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Recommendation 1: Delete empty files
        if self.analysis['empty_files']:
            recommendations.append({
                'priority': 'high',
                'action': 'delete',
                'category': 'cleanup',
                'title': 'Remove empty markdown files',
                'description': f'Found {len(self.analysis["empty_files"])} empty files that can be safely deleted',
                'files': self.analysis['empty_files'][:10],  # Show first 10
                'total_count': len(self.analysis['empty_files'])
            })
        
        # Recommendation 2: Review small files for consolidation
        if len(self.analysis['small_files']) > 5:
            recommendations.append({
                'priority': 'medium',
                'action': 'review',
                'category': 'consolidation',
                'title': 'Review very small files for potential merging',
                'description': f'Found {len(self.analysis["small_files"])} files under 500 bytes - may be stubs or fragments',
                'files': [f['path'] for f in self.analysis['small_files'][:10]],
                'total_count': len(self.analysis['small_files'])
            })
        
        # Recommendation 3: Consolidate duplicate README files
        if len(self.analysis['readme_files']) > 10:
            # Group READMEs by directory
            readme_dirs = defaultdict(list)
            for readme_path in self.analysis['readme_files']:
                dir_path = str(Path(readme_path).parent)
                readme_dirs[dir_path].append(readme_path)
            
            duplicate_readme_dirs = {d: files for d, files in readme_dirs.items() if len(files) > 1}
            
            if duplicate_readme_dirs:
                recommendations.append({
                    'priority': 'high',
                    'action': 'merge',
                    'category': 'consolidation',
                    'title': 'Consolidate multiple README files in same directories',
                    'description': f'Found {len(duplicate_readme_dirs)} directories with multiple README files',
                    'directories': list(duplicate_readme_dirs.keys())[:5],
                    'total_count': len(duplicate_readme_dirs)
                })
        
        # Recommendation 4: Review duplicate filenames
        if len(self.analysis['duplicate_names']) > 10:
            # Find most duplicated names
            top_duplicates = sorted(
                self.analysis['duplicate_names'].items(),
                key=lambda x: len(x[1]),
                reverse=True
            )[:10]
            
            recommendations.append({
                'priority': 'medium',
                'action': 'review',
                'category': 'consolidation',
                'title': 'Review files with duplicate names across directories',
                'description': f'Found {len(self.analysis["duplicate_names"])} filenames appearing in multiple locations',
                'examples': [
                    {'name': name, 'count': len(paths), 'paths': paths[:3]}
                    for name, paths in top_duplicates
                ]
            })
        
        # Recommendation 5: Organize large directories
        large_dirs = [(dir, files) for dir, files in self.analysis['by_directory'].items() if len(files) > 20]
        if large_dirs:
            recommendations.append({
                'priority': 'low',
                'action': 'reorganize',
                'category': 'structure',
                'title': 'Consider sub-categorizing large directories',
                'description': f'Found {len(large_dirs)} directories with >20 files that might benefit from subcategories',
                'directories': [{'path': d, 'file_count': len(f)} for d, f in large_dirs[:5]]
            })
        
        return recommendations
    
    def run_analysis(self) -> Dict:
        """Run complete analysis"""
        self.discover_files()
        self.analyze_file_sizes()
        self.analyze_naming_patterns()
        self.analyze_directory_structure()
        
        recommendations = self.generate_consolidation_recommendations()
        
        return {
            'analysis': self.analysis,
            'recommendations': recommendations,
            'summary': {
                'total_files': self.analysis['total_files'],
                'issues_found': len(self.analysis['empty_files']) + len(self.analysis['small_files']),
                'duplicate_names': len(self.analysis['duplicate_names']),
                'recommendations_count': len(recommendations)
            }
        }
    
    def print_report(self, results: Dict):
        """Print human-readable report"""
        print("\n" + "="*70)
        print("📊 DOCUMENTATION STRUCTURE ANALYSIS REPORT")
        print("="*70 + "\n")
        
        summary = results['summary']
        print(f"📈 Summary:")
        print(f"   Total Files: {summary['total_files']}")
        print(f"   Issues Found: {summary['issues_found']}")
        print(f"   Duplicate Names: {summary['duplicate_names']}")
        print(f"   Recommendations: {summary['recommendations_count']}\n")
        
        print("🎯 Recommendations:\n")
        for i, rec in enumerate(results['recommendations'], 1):
            priority_icon = {'high': '🔴', 'medium': '🟡', 'low': '🟢'}.get(rec['priority'], '⚪')
            action_icon = {'delete': '🗑️', 'merge': '🔀', 'review': '👀', 'reorganize': '📁'}.get(rec['action'], '⚙️')
            
            print(f"{i}. {priority_icon} {action_icon} [{rec['priority'].upper()}] {rec['title']}")
            print(f"   {rec['description']}")
            
            if 'files' in rec:
                print(f"   Files (showing {len(rec['files'])} of {rec.get('total_count', len(rec['files']))}):")
                for file in rec['files'][:5]:
                    print(f"      • {file}")
                if rec.get('total_count', 0) > 5:
                    print(f"      ... and {rec['total_count'] - 5} more")
            
            if 'directories' in rec:
                print(f"   Directories:")
                for dir_info in rec['directories'][:5]:
                    if isinstance(dir_info, dict):
                        print(f"      • {dir_info['path']} ({dir_info['file_count']} files)")
                    else:
                        print(f"      • {dir_info}")
            
            if 'examples' in rec:
                print(f"   Top examples:")
                for ex in rec['examples'][:3]:
                    print(f"      • {ex['name']} (appears {ex['count']} times)")
                    for path in ex['paths']:
                        print(f"         - {path}")
            
            print()
        
        print("="*70)
        print(f"✅ Analysis complete! Found {len(results['recommendations'])} recommendations.")
        print("="*70 + "\n")
    
    def save_results(self, results: Dict, output_file: str):
        """Save results to JSON file"""
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"💾 Results saved to: {output_file}")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Analyze documentation structure')
    parser.add_argument('--docs-dir', default='docs', help='Documentation directory')
    parser.add_argument('--output', default='output/analysis/doc_structure_analysis.json', help='Output JSON file')
    
    args = parser.parse_args()
    
    analyzer = DocStructureAnalyzer(args.docs_dir)
    results = analyzer.run_analysis()
    analyzer.print_report(results)
    analyzer.save_results(results, args.output)


if __name__ == '__main__':
    main()
