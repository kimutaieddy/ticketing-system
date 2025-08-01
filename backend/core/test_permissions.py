"""
Test cases for Core permissions - Custom permission classes
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from rest_framework.request import Request
from unittest.mock import Mock
from decimal import Decimal
from datetime import timedelta
from django.utils import timezone

from .models import Event, Ticket
from .permissions import IsOrganizerOrAdmin, CanScanEventTickets, IsEventOrganizer

User = get_user_model()


class IsOrganizerOrAdminTest(TestCase):
    """Test IsOrganizerOrAdmin permission class"""
    
    def setUp(self):
        self.permission = IsOrganizerOrAdmin()
        self.factory = APIRequestFactory()
        
        self.user = User.objects.create_user(
            username='user',
            email='user@test.com',
            password='testpass123'
        )
        
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass123'
        )
    
    def test_organizer_has_permission(self):
        """Test that organizer has permission"""
        request = self.factory.get('/')
        request.user = self.organizer
        
        view = Mock()
        
        self.assertTrue(
            self.permission.has_permission(request, view)
        )
    
    def test_admin_has_permission(self):
        """Test that admin has permission"""
        request = self.factory.get('/')
        request.user = self.admin
        
        view = Mock()
        
        self.assertTrue(
            self.permission.has_permission(request, view)
        )
    
    def test_regular_user_no_permission(self):
        """Test that regular user does not have permission"""
        request = self.factory.get('/')
        request.user = self.user
        
        view = Mock()
        
        self.assertFalse(
            self.permission.has_permission(request, view)
        )
    
    def test_anonymous_user_no_permission(self):
        """Test that anonymous user does not have permission"""
        from django.contrib.auth.models import AnonymousUser
        
        request = self.factory.get('/')
        request.user = AnonymousUser()
        
        view = Mock()
        
        self.assertFalse(
            self.permission.has_permission(request, view)
        )


class CanScanEventTicketsTest(TestCase):
    """Test CanScanEventTickets permission class"""
    
    def setUp(self):
        self.permission = CanScanEventTickets()
        self.factory = APIRequestFactory()
        
        self.organizer = User.objects.create_user(
            username='organizer2',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.other_organizer = User.objects.create_user(
            username='other_organizer',
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='user2',
            email='user@test.com',
            password='testpass123'
        )
        
        self.admin = User.objects.create_superuser(
            username='admin2',
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Create event
        self.event = Event.objects.create(
            name='Test Event',  # Changed from title
            description='Test description',
            start_time=timezone.now() + timedelta(days=30),  # Changed from date
            end_time=timezone.now() + timedelta(days=30, hours=3),  # Added end_time
            location='Test Venue',
            capacity=50,
            organizer=self.organizer
        )
        
        # Create ticket
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'  # Changed from price
        )
    
    def test_event_organizer_can_scan(self):
        """Test that event organizer can scan their event tickets"""
        request = self.factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.organizer
        
        view = Mock()
        view.get_object.return_value = self.ticket
        
        self.assertTrue(
            self.permission.has_permission(request, view)
        )
    
    def test_admin_can_scan_any_ticket(self):
        """Test that admin can scan any event tickets"""
        request = self.factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.admin
        
        view = Mock()
        view.get_object.return_value = self.ticket
        
        self.assertTrue(
            self.permission.has_permission(request, view)
        )
    
    def test_other_organizer_cannot_scan(self):
        """Test that other organizers cannot scan tickets from different events"""
        request = self.factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.other_organizer
        
        view = Mock()
        view.get_object.return_value = self.ticket
        
        self.assertFalse(
            self.permission.has_object_permission(request, view, self.ticket)
        )
    
    def test_regular_user_cannot_scan(self):
        """Test that regular users cannot scan tickets"""
        request = self.factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.user
        
        view = Mock()
        view.get_object.return_value = self.ticket
        
        self.assertFalse(
            self.permission.has_permission(request, view)
        )
    
    def test_permission_with_missing_ticket_data(self):
        """Test permission behavior when ticket data is missing"""
        request = self.factory.post('/', {})
        request.user = self.organizer
        
        view = Mock()
        
        # Should return False when ticket object is None or invalid
        self.assertFalse(
            self.permission.has_object_permission(request, view, None)
        )


class IsEventOrganizerTest(TestCase):
    """Test IsEventOrganizer permission class"""
    
    def setUp(self):
        self.permission = IsEventOrganizer()
        self.factory = APIRequestFactory()
        
        self.organizer = User.objects.create_user(
            username='organizer@test.com',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.other_organizer = User.objects.create_user(
            username='other@test.com',
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.admin = User.objects.create_superuser(
            username='admin@test.com',
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Create event
        self.event = Event.objects.create(
            name='Test Event',
            description='Test description',
            start_time=timezone.now() + timedelta(days=30),
            end_time=timezone.now() + timedelta(days=30, hours=3),
            location='Test Venue',
            capacity=50,
            organizer=self.organizer
        )
    
    def test_event_organizer_has_object_permission(self):
        """Test that event organizer has permission for their event"""
        request = self.factory.get('/')
        request.user = self.organizer
        
        view = Mock()
        
        self.assertTrue(
            self.permission.has_object_permission(request, view, self.event)
        )
    
    def test_admin_has_object_permission(self):
        """Test that admin has permission for any event"""
        request = self.factory.get('/')
        request.user = self.admin
        
        view = Mock()
        
        self.assertTrue(
            self.permission.has_object_permission(request, view, self.event)
        )
    
    def test_other_organizer_no_object_permission(self):
        """Test that other organizer does not have permission for this event"""
        request = self.factory.get('/')
        request.user = self.other_organizer
        
        view = Mock()
        
        self.assertFalse(
            self.permission.has_object_permission(request, view, self.event)
        )
    
    def test_permission_always_true_for_has_permission(self):
        """Test that has_permission always returns True (object-level only)"""
        request = self.factory.get('/')
        request.user = self.other_organizer
        
        view = Mock()
        
        # has_permission should always return True for object-level permissions
        self.assertTrue(
            self.permission.has_permission(request, view)
        )


class PermissionIntegrationTest(TestCase):
    """Integration tests for permission combinations"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            username='organizer@test.com',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='user@test.com',
            email='user@test.com',
            password='testpass123'
        )
        
        self.admin = User.objects.create_superuser(
            username='admin@test.com',
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Create event
        self.event = Event.objects.create(
            name='Test Event',
            description='Test description',
            start_time=timezone.now() + timedelta(days=30),
            end_time=timezone.now() + timedelta(days=30, hours=3),
            location='Test Venue',
            capacity=50,
            organizer=self.organizer
        )
        
        # Create ticket
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
    
    def test_permission_chain_for_ticket_validation(self):
        """Test complete permission chain for ticket validation"""
        from .permissions import CanScanEventTickets
        
        factory = APIRequestFactory()
        permission = CanScanEventTickets()
        
        # Test organizer can validate their event's tickets
        request = factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.organizer
        
        view = Mock()
        view.get_object.return_value = self.ticket
        
        self.assertTrue(permission.has_permission(request, view))
        
        # Test regular user cannot validate tickets
        request.user = self.user
        self.assertFalse(permission.has_permission(request, view))
    
    def test_admin_superuser_permissions(self):
        """Test that admin has all permissions"""
        factory = APIRequestFactory()
        
        # Test IsOrganizerOrAdmin
        perm1 = IsOrganizerOrAdmin()
        request = factory.get('/')
        request.user = self.admin
        view = Mock()
        
        self.assertTrue(perm1.has_permission(request, view))
        
        # Test IsEventOrganizer for object permission
        perm2 = IsEventOrganizer()
        self.assertTrue(perm2.has_object_permission(request, view, self.event))
        
        # Test CanScanEventTickets
        perm3 = CanScanEventTickets()
        request = factory.post('/', {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        })
        request.user = self.admin
        view.get_object.return_value = self.ticket
        
        self.assertTrue(perm3.has_permission(request, view))
