"""
Unit test runner for the documentation aggregator.
"""

import json
import sys
import unittest
from datetime import datetime
from pathlib import Path

# Add the project root to the path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from tests.config import get_test_output_path


class TestRunner:
    """Test runner for unit tests."""
    
    def __init__(self, output_dir: str = None):
        """Initialize the test runner."""
        self.output_dir = Path(output_dir) if output_dir else get_test_output_path()
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'test_type': 'unit',
            'total_tests': 0,
            'passed': 0,
            'failed': 0,
            'errors': 0,
            'test_results': []
        }
    
    def run_all_tests(self) -> dict:
        """Run all unit tests."""
        print("Running unit tests...")
        
        # Discover and run tests
        loader = unittest.TestLoader()
        start_dir = Path(__file__).parent / "test_cases"
        suite = loader.discover(start_dir, pattern='test_*.py')
        
        # Run tests
        runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
        result = runner.run(suite)
        
        # Update results
        self.results['total_tests'] = result.testsRun
        self.results['passed'] = result.testsRun - len(result.failures) - len(result.errors)
        self.results['failed'] = len(result.failures)
        self.results['errors'] = len(result.errors)
        
        # Store detailed results
        for test, traceback in result.failures:
            self.results['test_results'].append({
                'test_name': str(test),
                'status': 'failed',
                'error': traceback
            })
        
        for test, traceback in result.errors:
            self.results['test_results'].append({
                'test_name': str(test),
                'status': 'error',
                'error': traceback
            })
        
        # Save results
        self.save_results()
        
        return self.results
    
    def run_specific_test(self, test_module: str, test_class: str = None, test_method: str = None) -> dict:
        """Run a specific test."""
        print(f"Running specific test: {test_module}")
        
        # Import the test module
        test_module_path = Path(__file__).parent / "test_cases" / f"{test_module}.py"
        if not test_module_path.exists():
            raise FileNotFoundError(f"Test module not found: {test_module}")
        
        # Load and run specific test
        loader = unittest.TestLoader()
        suite = loader.loadTestsFromName(f"tests.unit.test_cases.{test_module}")
        
        if test_class:
            suite = loader.loadTestsFromName(f"tests.unit.test_cases.{test_module}.{test_class}")
        
        if test_method:
            suite = loader.loadTestsFromName(f"tests.unit.test_cases.{test_module}.{test_class}.{test_method}")
        
        # Run tests
        runner = unittest.TextTestRunner(verbosity=2, stream=sys.stdout)
        result = runner.run(suite)
        
        # Update results
        self.results['total_tests'] = result.testsRun
        self.results['passed'] = result.testsRun - len(result.failures) - len(result.errors)
        self.results['failed'] = len(result.failures)
        self.results['errors'] = len(result.errors)
        
        # Store detailed results
        for test, traceback in result.failures:
            self.results['test_results'].append({
                'test_name': str(test),
                'status': 'failed',
                'error': traceback
            })
        
        for test, traceback in result.errors:
            self.results['test_results'].append({
                'test_name': str(test),
                'status': 'error',
                'error': traceback
            })
        
        # Save results
        self.save_results()
        
        return self.results
    
    def save_results(self):
        """Save test results to file."""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results_file = self.output_dir / f"unit_test_results_{timestamp}.json"
        
        with open(results_file, 'w') as f:
            json.dump(self.results, f, indent=2)
        
        print(f"Test results saved to: {results_file}")
    
    def print_summary(self):
        """Print test summary."""
        print("\n" + "="*50)
        print("UNIT TEST SUMMARY")
        print("="*50)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']}")
        print(f"Failed: {self.results['failed']}")
        print(f"Errors: {self.results['errors']}")
        print(f"Success Rate: {(self.results['passed'] / self.results['total_tests'] * 100):.1f}%")
        print("="*50)

def main():
    """Main function for running unit tests."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Run unit tests for documentation aggregator')
    parser.add_argument('--module', help='Specific test module to run')
    parser.add_argument('--class', dest='test_class', help='Specific test class to run')
    parser.add_argument('--method', help='Specific test method to run')
    parser.add_argument('--output', help='Output directory for test results')
    
    args = parser.parse_args()
    
    runner = TestRunner(args.output)
    
    if args.module:
        results = runner.run_specific_test(args.module, args.test_class, args.method)
    else:
        results = runner.run_all_tests()
    
    runner.print_summary()
    
    # Exit with error code if tests failed
    if results['failed'] > 0 or results['errors'] > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
