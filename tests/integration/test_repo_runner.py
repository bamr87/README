"""
Integration test runner for testing against real GitHub repositories.
"""

import json
import os
import sys
import tempfile
import time
from datetime import datetime
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from scripts.aggregate import process_repository
from scripts.process import main as process_main
from tests.config import TEST_CONFIG, get_test_output_path


class RepoTestRunner:
    """Test runner for testing against real GitHub repositories."""
    
    def __init__(self, output_dir: str = None):
        """Initialize the test runner."""
        self.output_dir = Path(output_dir) if output_dir else get_test_output_path()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.temp_dir = tempfile.mkdtemp()
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'test_type': 'integration_repos',
            'repos_tested': 0,
            'successful_repos': 0,
            'failed_repos': 0,
            'total_files_processed': 0,
            'total_files_organized': 0,
            'repo_results': []
        }
    
    def test_repository(self, repo_url: str, expected_files: list = None, expected_categories: list = None) -> dict:
        """Test a single repository."""
        print(f"\nTesting repository: {repo_url}")
        
        repo_result = {
            'repo_url': repo_url,
            'success': False,
            'files_found': 0,
            'files_copied': 0,
            'files_organized': 0,
            'categories_found': set(),
            'processing_time': 0,
            'error': None,
            'file_details': []
        }
        
        start_time = time.time()
        
        try:
            # Process repository
            raw_docs_dir = Path(self.temp_dir) / "raw_docs"
            raw_docs_dir.mkdir(exist_ok=True)
            
            process_result = process_repository(repo_url, self.temp_dir, str(raw_docs_dir))
            
            if not process_result['success']:
                repo_result['error'] = process_result['error']
                return repo_result
            
            repo_result['files_found'] = process_result['files_found']
            repo_result['files_copied'] = process_result['files_copied']
            
            # Process files with Python script
            docs_dir = Path(self.temp_dir) / "docs"
            docs_dir.mkdir(exist_ok=True)
            
            # Change to temp directory for processing
            original_cwd = os.getcwd()
            os.chdir(self.temp_dir)
            
            try:
                process_main()
                
                # Count organized files
                organized_files = list(docs_dir.rglob("*.md"))
                repo_result['files_organized'] = len(organized_files)
                
                # Analyze file details
                for file_path in organized_files:
                    try:
                        content = file_path.read_text()
                        
                        # Extract front matter
                        if content.startswith('---'):
                            fm_end = content.find('---', 3)
                            if fm_end > 0:
                                import yaml
                                fm_content = content[3:fm_end]
                                fm_data = yaml.safe_load(fm_content)
                                
                                if fm_data and 'category' in fm_data:
                                    repo_result['categories_found'].add(fm_data['category'])
                                
                                file_detail = {
                                    'path': str(file_path.relative_to(docs_dir)),
                                    'category': fm_data.get('category', 'unknown') if fm_data else 'unknown',
                                    'title': fm_data.get('title', 'unknown') if fm_data else 'unknown',
                                    'tags': fm_data.get('tags', []) if fm_data else [],
                                    'has_summary': 'summary' in fm_data if fm_data else False
                                }
                                repo_result['file_details'].append(file_detail)
                    except Exception as e:
                        print(f"Error analyzing file {file_path}: {e}")
                
                repo_result['success'] = True
                
            finally:
                os.chdir(original_cwd)
            
        except Exception as e:
            repo_result['error'] = str(e)
        
        finally:
            repo_result['processing_time'] = time.time() - start_time
        
        return repo_result
    
    def run_tests(self, repo_urls: list = None) -> dict:
        """Run tests against a list of repositories."""
        if repo_urls is None:
            repo_urls = [repo['url'] for repo in TEST_CONFIG['test_repos']]
        
        print(f"Running integration tests against {len(repo_urls)} repositories...")
        
        for repo_url in repo_urls:
            repo_result = self.test_repository(repo_url)
            self.results['repo_results'].append(repo_result)
            self.results['repos_tested'] += 1
            
            if repo_result['success']:
                self.results['successful_repos'] += 1
                self.results['total_files_processed'] += repo_result['files_found']
                self.results['total_files_organized'] += repo_result['files_organized']
            else:
                self.results['failed_repos'] += 1
                print(f"Failed to process {repo_url}: {repo_result['error']}")
        
        # Save results
        self.save_results()
        
        return self.results
    
    def save_results(self):
        """Save test results to file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = self.output_dir / f"integration_repo_results_{timestamp}.json"
        
        # Convert sets to lists for JSON serialization
        for repo_result in self.results['repo_results']:
            if 'categories_found' in repo_result:
                repo_result['categories_found'] = list(repo_result['categories_found'])
        
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"Integration test results saved to: {results_file}")
    
    def print_summary(self):
        """Print test summary."""
        print("\n" + "="*60)
        print("INTEGRATION TEST SUMMARY")
        print("="*60)
        print(f"Repositories Tested: {self.results['repos_tested']}")
        print(f"Successful: {self.results['successful_repos']}")
        print(f"Failed: {self.results['failed_repos']}")
        print(f"Success Rate: {(self.results['successful_repos'] / self.results['repos_tested'] * 100):.1f}%")
        print(f"Total Files Processed: {self.results['total_files_processed']}")
        print(f"Total Files Organized: {self.results['total_files_organized']}")
        
        if self.results['repo_results']:
            print("\nRepository Details:")
            for repo_result in self.results['repo_results']:
                if repo_result['success']:
                    print(f"  ✓ {repo_result['repo_url']}")
                    print(f"    Files: {repo_result['files_found']} found, {repo_result['files_organized']} organized")
                    print(f"    Categories: {', '.join(repo_result['categories_found'])}")
                    print(f"    Time: {repo_result['processing_time']:.2f}s")
                else:
                    print(f"  ✗ {repo_result['repo_url']}")
                    print(f"    Error: {repo_result['error']}")
        
        print("="*60)
    
    def cleanup(self):
        """Clean up temporary files."""
        import shutil
        shutil.rmtree(self.temp_dir)

def main():
    """Main function for running integration tests."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Run integration tests against GitHub repositories')
    parser.add_argument('--repos', nargs='+', help='Specific repositories to test')
    parser.add_argument('--output', help='Output directory for test results')
    parser.add_argument('--config', help='Path to custom test configuration')
    
    args = parser.parse_args()
    
    runner = RepoTestRunner(args.output)
    
    try:
        if args.repos:
            results = runner.run_tests(args.repos)
        else:
            results = runner.run_tests()
        
        runner.print_summary()
        
        # Exit with error code if tests failed
        if results['failed_repos'] > 0:
            sys.exit(1)
    
    finally:
        runner.cleanup()

if __name__ == "__main__":
    main()
