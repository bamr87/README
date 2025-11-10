"""
Main test runner for the documentation aggregator testing framework.
"""

import argparse
import json
import sys
from datetime import datetime
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent))

from tests.config import get_test_output_path
from tests.integration.test_repo_runner import RepoTestRunner
from tests.unit.test_runner import TestRunner as UnitTestRunner


class MainTestRunner:
    """Main test runner that coordinates all testing activities."""
    
    def __init__(self, output_dir: str = None):
        """Initialize the main test runner."""
        self.output_dir = Path(output_dir) if output_dir else get_test_output_path()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'test_suite': 'documentation_aggregator',
            'unit_tests': None,
            'integration_tests': None,
            'overall_success': False
        }
    
    def run_unit_tests(self) -> dict:
        """Run unit tests."""
        print("="*60)
        print("RUNNING UNIT TESTS")
        print("="*60)
        
        unit_runner = UnitTestRunner(str(self.output_dir))
        unit_results = unit_runner.run_all_tests()
        
        self.results['unit_tests'] = unit_results
        return unit_results
    
    def run_integration_tests(self, repo_urls: list = None) -> dict:
        """Run integration tests against repositories."""
        print("\n" + "="*60)
        print("RUNNING INTEGRATION TESTS")
        print("="*60)
        
        integration_runner = RepoTestRunner(str(self.output_dir))
        integration_results = integration_runner.run_tests(repo_urls)
        
        self.results['integration_tests'] = integration_results
        return integration_results
    
    def run_all_tests(self, repo_urls: list = None) -> dict:
        """Run all tests (unit and integration)."""
        print("Starting comprehensive test suite...")
        
        # Run unit tests
        unit_results = self.run_unit_tests()
        
        # Run integration tests
        integration_results = self.run_integration_tests(repo_urls)
        
        # Determine overall success
        unit_success = unit_results['failed'] == 0 and unit_results['errors'] == 0
        integration_success = integration_results['failed_repos'] == 0
        
        self.results['overall_success'] = unit_success and integration_success
        
        # Save combined results
        self.save_combined_results()
        
        # Print overall summary
        self.print_overall_summary()
        
        return self.results
    
    def save_combined_results(self):
        """Save combined test results."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = self.output_dir / f"combined_test_results_{timestamp}.json"
        
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"\nCombined test results saved to: {results_file}")
    
    def print_overall_summary(self):
        """Print overall test summary."""
        print("\n" + "="*60)
        print("OVERALL TEST SUMMARY")
        print("="*60)
        
        if self.results['unit_tests']:
            unit = self.results['unit_tests']
            print(f"Unit Tests: {unit['passed']}/{unit['total_tests']} passed")
            if unit['failed'] > 0:
                print(f"  Failed: {unit['failed']}")
            if unit['errors'] > 0:
                print(f"  Errors: {unit['errors']}")
        
        if self.results['integration_tests']:
            integration = self.results['integration_tests']
            print(f"Integration Tests: {integration['successful_repos']}/{integration['repos_tested']} repos successful")
            print(f"  Files Processed: {integration['total_files_processed']}")
            print(f"  Files Organized: {integration['total_files_organized']}")
        
        print(f"\nOverall Success: {'✓ PASSED' if self.results['overall_success'] else '✗ FAILED'}")
        print("="*60)
    
    def run_quick_tests(self) -> dict:
        """Run quick tests (unit tests only)."""
        print("Running quick test suite (unit tests only)...")
        
        unit_results = self.run_unit_tests()
        self.results['unit_tests'] = unit_results
        self.results['overall_success'] = unit_results['failed'] == 0 and unit_results['errors'] == 0
        
        self.save_combined_results()
        self.print_overall_summary()
        
        return self.results

def main():
    """Main function for running tests."""
    parser = argparse.ArgumentParser(description='Test runner for documentation aggregator')
    parser.add_argument('--type', choices=['unit', 'integration', 'all', 'quick'], 
                       default='all', help='Type of tests to run')
    parser.add_argument('--repos', nargs='+', help='Specific repositories to test (for integration tests)')
    parser.add_argument('--output', help='Output directory for test results')
    parser.add_argument('--config', help='Path to custom test configuration')
    
    args = parser.parse_args()
    
    runner = MainTestRunner(args.output)
    
    try:
        if args.type == 'unit':
            results = runner.run_unit_tests()
        elif args.type == 'integration':
            results = runner.run_integration_tests(args.repos)
        elif args.type == 'quick':
            results = runner.run_quick_tests()
        else:  # 'all'
            results = runner.run_all_tests(args.repos)
        
        # Exit with error code if tests failed
        if not results['overall_success']:
            sys.exit(1)
    
    except KeyboardInterrupt:
        print("\nTest execution interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"Test execution failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
