# pytest configuration for Django testing
import os
import sys
import django
from pathlib import Path

# Add backend to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Configure Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Pytest configuration
def pytest_configure(config):
    """Configure pytest for Django"""
    import django
    from django.conf import settings
    from django.test.utils import get_runner
    
    # Configure test settings
    settings.configure(
        DEBUG=True,
        DATABASES={
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': ':memory:',
            }
        },
        INSTALLED_APPS=[
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.sessions',
            'django.contrib.messages',
            'django.contrib.staticfiles',
            'rest_framework',
            'rest_framework_simplejwt',
            'corsheaders',
            'accounts',
            'core',
        ],
        SECRET_KEY='test-secret-key-for-testing-only',
        USE_TZ=True,
        ROOT_URLCONF='backend.urls',
        PASSWORD_HASHERS=[
            'django.contrib.auth.hashers.MD5PasswordHasher',
        ],
    )
    
    django.setup()


# Pytest fixtures
import pytest
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

User = get_user_model()


@pytest.fixture
def user_factory():
    """Factory for creating test users"""
    def _create_user(email="test@example.com", role="user", **kwargs):
        defaults = {
            'first_name': 'Test',
            'last_name': 'User',
            'phone_number': '+254712345678'
        }
        defaults.update(kwargs)
        return User.objects.create_user(email=email, role=role, **defaults)
    return _create_user


@pytest.fixture
def test_user(user_factory):
    """Create a test user"""
    return user_factory()


@pytest.fixture
def test_organizer(user_factory):
    """Create a test organizer"""
    return user_factory(email="organizer@test.com", role="organizer")


@pytest.fixture
def test_admin(user_factory):
    """Create a test admin"""
    return user_factory(email="admin@test.com", role="admin")


@pytest.fixture
def event_factory(test_organizer):
    """Factory for creating test events"""
    def _create_event(title="Test Event", organizer=None, **kwargs):
        from core.models import Event
        
        if organizer is None:
            organizer = test_organizer
            
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
    return _create_event


@pytest.fixture
def test_event(event_factory):
    """Create a test event"""
    return event_factory()


@pytest.fixture
def ticket_factory(test_event, test_user):
    """Factory for creating test tickets"""
    def _create_ticket(event=None, user=None, **kwargs):
        from core.models import Ticket
        
        if event is None:
            event = test_event
        if user is None:
            user = test_user
            
        defaults = {
            'price': event.price
        }
        defaults.update(kwargs)
        
        return Ticket.objects.create(
            event=event,
            user=user,
            **defaults
        )
    return _create_ticket


@pytest.fixture
def test_ticket(ticket_factory):
    """Create a test ticket"""
    return ticket_factory()


@pytest.fixture
def api_client():
    """Create API client for testing"""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, test_user):
    """Create authenticated API client"""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(test_user)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def organizer_client(api_client, test_organizer):
    """Create organizer authenticated API client"""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(test_organizer)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


@pytest.fixture
def admin_client(api_client, test_admin):
    """Create admin authenticated API client"""
    from rest_framework_simplejwt.tokens import RefreshToken
    
    refresh = RefreshToken.for_user(test_admin)
    api_client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return api_client


# Pytest markers
def pytest_configure_markers(config):
    """Configure custom pytest markers"""
    config.addinivalue_line("markers", "slow: marks tests as slow")
    config.addinivalue_line("markers", "integration: marks tests as integration tests")
    config.addinivalue_line("markers", "unit: marks tests as unit tests")
    config.addinivalue_line("markers", "api: marks tests as API tests")
    config.addinivalue_line("markers", "permissions: marks tests as permission tests")
    config.addinivalue_line("markers", "models: marks tests as model tests")
