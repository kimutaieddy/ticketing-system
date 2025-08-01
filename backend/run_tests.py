#!/usr/bin/env python
"""
Comprehensive test runner script for the ticketing system
Runs all tests with coverage reporting and performance metrics
"""
import os
import sys
import subprocess
import time
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()


class TestRunner:
    """Enhanced test runner with reporting capabilities"""
    
    def __init__(self):
        self.backend_dir = Path(__file__).parent
        self.start_time = None
        self.end_time = None
    
    def run_tests(self, coverage=True, verbose=True, apps=None, specific_test=None):
        """
        Run tests with optional coverage reporting
        
        Args:
            coverage (bool): Whether to run with coverage reporting
            verbose (bool): Whether to run in verbose mode
            apps (list): Specific apps to test (default: all apps)
            specific_test (str): Specific test to run
        """
        print("🚀 Starting Ticketing System Test Suite")
        print("=" * 60)
        
        self.start_time = time.time()
        
        # Build test command
        cmd = self._build_test_command(coverage, verbose, apps, specific_test)
        
        try:
            # Run tests
            result = subprocess.run(cmd, cwd=self.backend_dir, check=False)
            
            self.end_time = time.time()
            
            # Print summary
            self._print_summary(result.returncode)
            
            return result.returncode == 0
            
        except KeyboardInterrupt:
            print("\n⚠️  Tests interrupted by user")
            return False
        except Exception as e:
            print(f"❌ Error running tests: {e}")
            return False
    
    def _build_test_command(self, coverage, verbose, apps, specific_test):
        """Build the test command based on options"""
        if coverage:
            cmd = ['coverage', 'run', '--source=.', 'manage.py', 'test']
        else:
            cmd = ['python', 'manage.py', 'test']
        
        if verbose:
            cmd.append('--verbosity=2')
        
        if specific_test:
            cmd.append(specific_test)
        elif apps:
            cmd.extend(apps)
        else:
            # Test all core apps
            cmd.extend(['core', 'accounts'])
        
        # Add test settings
        cmd.extend(['--settings=backend.settings'])
        
        return cmd
    
    def _print_summary(self, return_code):
        """Print test execution summary"""
        duration = self.end_time - self.start_time if self.end_time else 0
        
        print("\n" + "=" * 60)
        print("📊 TEST EXECUTION SUMMARY")
        print("=" * 60)
        
        if return_code == 0:
            print("✅ All tests passed!")
        else:
            print("❌ Some tests failed!")
        
        print(f"⏱️  Total execution time: {duration:.2f} seconds")
        print("=" * 60)
    
    def run_coverage_report(self):
        """Generate and display coverage report"""
        print("\n📈 Generating Coverage Report...")
        print("-" * 40)
        
        try:
            # Generate terminal report
            subprocess.run(['coverage', 'report', '--show-missing'], 
                         cwd=self.backend_dir, check=True)
            
            # Generate HTML report
            html_dir = self.backend_dir / 'htmlcov'
            subprocess.run(['coverage', 'html'], cwd=self.backend_dir, check=True)
            
            print(f"\n📄 HTML coverage report generated: {html_dir}/index.html")
            
        except subprocess.CalledProcessError:
            print("⚠️  Failed to generate coverage report")
        except FileNotFoundError:
            print("⚠️  Coverage not installed. Install with: pip install coverage")
    
    def run_linting(self):
        """Run code linting checks"""
        print("\n🔍 Running Code Quality Checks...")
        print("-" * 40)
        
        # Check if flake8 is available
        try:
            result = subprocess.run(['flake8', 'core/', 'accounts/'], 
                                  cwd=self.backend_dir, 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ No linting issues found")
            else:
                print("⚠️  Linting issues found:")
                print(result.stdout)
                
        except FileNotFoundError:
            print("⚠️  flake8 not installed. Install with: pip install flake8")
    
    def run_security_check(self):
        """Run security checks"""
        print("\n🔒 Running Security Checks...")
        print("-" * 40)
        
        try:
            # Run Django security check
            result = subprocess.run(['python', 'manage.py', 'check', '--deploy'], 
                                  cwd=self.backend_dir, 
                                  capture_output=True, text=True)
            
            if result.returncode == 0:
                print("✅ No security issues found")
            else:
                print("⚠️  Security issues found:")
                print(result.stdout)
                
        except Exception as e:
            print(f"⚠️  Error running security check: {e}")


def main():
    """Main test runner function"""
    import argparse
    
    parser = argparse.ArgumentParser(description='Run ticketing system tests')
    parser.add_argument('--no-coverage', action='store_true', 
                       help='Run tests without coverage reporting')
    parser.add_argument('--quiet', action='store_true', 
                       help='Run tests in quiet mode')
    parser.add_argument('--apps', nargs='+', 
                       help='Specific apps to test (e.g., core accounts)')
    parser.add_argument('--test', type=str, 
                       help='Specific test to run (e.g., core.test_models.UserModelTest)')
    parser.add_argument('--lint', action='store_true', 
                       help='Run linting checks')
    parser.add_argument('--security', action='store_true', 
                       help='Run security checks')
    parser.add_argument('--all', action='store_true', 
                       help='Run all checks (tests, coverage, lint, security)')
    
    args = parser.parse_args()
    
    runner = TestRunner()
    success = True
    
    if args.all:
        # Run comprehensive test suite
        success &= runner.run_tests(coverage=True, verbose=not args.quiet)
        runner.run_coverage_report()
        runner.run_linting()
        runner.run_security_check()
    else:
        # Run tests
        coverage = not args.no_coverage
        verbose = not args.quiet
        
        success &= runner.run_tests(
            coverage=coverage,
            verbose=verbose,
            apps=args.apps,
            specific_test=args.test
        )
        
        # Generate coverage report if coverage was enabled
        if coverage and not args.test:
            runner.run_coverage_report()
        
        # Run additional checks if requested
        if args.lint:
            runner.run_linting()
        
        if args.security:
            runner.run_security_check()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
