"""
Test configuration and utilities for the ticketing system
"""
import os
import sys
from django.test.runner import DiscoverRunner
from django.conf import settings


class CustomTestRunner(DiscoverRunner):
    """Custom test runner with enhanced reporting"""
    
    def setup_test_environment(self, **kwargs):
        super().setup_test_environment(**kwargs)
        # Disable logging during tests to reduce noise
        import logging
        logging.disable(logging.CRITICAL)
    
    def teardown_test_environment(self, **kwargs):
        super().teardown_test_environment(**kwargs)
        import logging
        logging.disable(logging.NOTSET)


# Test database settings
TEST_DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',  # Use in-memory database for faster tests
        'TEST': {
            'NAME': ':memory:',
        },
    }
}

# Test-specific settings
TEST_SETTINGS = {
    'DATABASES': TEST_DATABASES,
    'PASSWORD_HASHERS': [
        'django.contrib.auth.hashers.MD5PasswordHasher',  # Faster for tests
    ],
    'EMAIL_BACKEND': 'django.core.mail.backends.locmem.EmailBackend',
    'CELERY_TASK_ALWAYS_EAGER': True,  # Execute tasks synchronously in tests
    'CELERY_TASK_EAGER_PROPAGATES': True,
    'CACHES': {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        }
    },
    # Disable migrations for faster test database creation
    'MIGRATION_MODULES': {
        'core': None,
        'accounts': None,
    }
}


def setup_test_environment():
    """Setup test environment with optimized settings"""
    # Update Django settings for testing
    for key, value in TEST_SETTINGS.items():
        setattr(settings, key, value)
    
    # Ensure test database is properly configured
    if 'test' in sys.argv:
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')


# Test data factories for consistent test data creation
class TestDataFactory:
    """Factory for creating test data"""
    
    @staticmethod
    def create_test_user(email="test@example.com", role="user", **kwargs):
        """Create a test user with default values"""
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        defaults = {
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+254712345678',
            'password': 'testpass123'
        }
        defaults.update(kwargs)
        
        return User.objects.create_user(
            email=email,
            role=role,
            **defaults
        )
    
    @staticmethod
    def create_test_event(organizer, title="Test Event", **kwargs):
        """Create a test event with default values"""
        from .models import Event
        from django.utils import timezone
        from datetime import timedelta
        from decimal import Decimal
        
        defaults = {
            'description': 'Test event description',
            'date': timezone.now() + timedelta(days=30),
            'location': 'Test Venue',
            'price': Decimal('1000.00'),
            'capacity': 100
        }
        defaults.update(kwargs)
        
        return Event.objects.create(
            title=title,
            organizer=organizer,
            **defaults
        )
    
    @staticmethod
    def create_test_ticket(event, user, **kwargs):
        """Create a test ticket with default values"""
        from .models import Ticket
        
        defaults = {
            'price': event.price
        }
        defaults.update(kwargs)
        
        return Ticket.objects.create(
            event=event,
            user=user,
            **defaults
        )


# Test mixins for common functionality
class AuthTestMixin:
    """Mixin for authentication-related test functionality"""
    
    def get_auth_header(self, user):
        """Get JWT authentication header for user"""
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}
    
    def authenticate_user(self, user):
        """Authenticate user for the test client"""
        self.client.force_authenticate(user=user)


class APITestMixin(AuthTestMixin):
    """Mixin for API testing functionality"""
    
    def assertValidationError(self, response, field=None):
        """Assert that response contains validation errors"""
        self.assertEqual(response.status_code, 400)
        if field:
            self.assertIn(field, response.data)
    
    def assertPermissionDenied(self, response):
        """Assert that response is permission denied"""
        self.assertIn(response.status_code, [401, 403])
    
    def assertSuccessResponse(self, response, status_code=200):
        """Assert that response is successful"""
        self.assertEqual(response.status_code, status_code)
    
    def create_test_data(self):
        """Create common test data"""
        self.user = TestDataFactory.create_test_user()
        self.organizer = TestDataFactory.create_test_user(
            email="organizer@test.com",
            role="organizer"
        )
        self.admin = TestDataFactory.create_test_user(
            email="admin@test.com",
            role="admin"
        )
        self.event = TestDataFactory.create_test_event(self.organizer)
        self.ticket = TestDataFactory.create_test_ticket(self.event, self.user)


# Custom assertions for ticketing domain
class TicketingAssertions:
    """Custom assertions for ticketing-specific tests"""
    
    def assertTicketValid(self, ticket):
        """Assert that ticket is in valid state"""
        self.assertTrue(ticket.is_valid)
        self.assertIsNone(ticket.scanned_at)
        self.assertIsNone(ticket.scanned_by)
        self.assertIsNotNone(ticket.validation_token)
    
    def assertTicketUsed(self, ticket, scanned_by=None):
        """Assert that ticket has been used/scanned"""
        self.assertFalse(ticket.is_valid)
        self.assertIsNotNone(ticket.scanned_at)
        if scanned_by:
            self.assertEqual(ticket.scanned_by, scanned_by)
    
    def assertEventStats(self, stats, expected_events=None, expected_tickets=None, expected_revenue=None):
        """Assert event statistics match expected values"""
        if expected_events is not None:
            self.assertEqual(stats['total_events'], expected_events)
        if expected_tickets is not None:
            self.assertEqual(stats['total_tickets_sold'], expected_tickets)
        if expected_revenue is not None:
            self.assertEqual(str(stats['total_revenue']), str(expected_revenue))


# Test case base classes
class BaseTestCase(APITestMixin, TicketingAssertions):
    """Base test case with common functionality"""
    
    def setUp(self):
        """Set up test data"""
        super().setUp()
        self.create_test_data()


# Performance test utilities
class PerformanceTestMixin:
    """Mixin for performance testing"""
    
    def assertQueryCountLessThan(self, max_queries, func, *args, **kwargs):
        """Assert that function executes with fewer than max_queries database queries"""
        from django.test.utils import override_settings
        from django.db import connection
        
        with override_settings(DEBUG=True):
            initial_queries = len(connection.queries)
            func(*args, **kwargs)
            query_count = len(connection.queries) - initial_queries
            
            self.assertLess(
                query_count,
                max_queries,
                f"Function executed {query_count} queries, expected less than {max_queries}"
            )


# Test coverage configuration
COVERAGE_CONFIG = {
    'source': ['core', 'accounts'],
    'omit': [
        '*/migrations/*',
        '*/venv/*',
        '*/env/*',
        '*/__pycache__/*',
        '*/tests/*',
        '*/test_*.py',
        'manage.py',
        '*/settings/*',
        '*/wsgi.py',
        '*/asgi.py',
    ],
    'exclude_lines': [
        'pragma: no cover',
        'def __repr__',
        'if self.debug:',
        'if settings.DEBUG',
        'raise AssertionError',
        'raise NotImplementedError',
        'if 0:',
        'if __name__ == .__main__.:',
    ]
}
