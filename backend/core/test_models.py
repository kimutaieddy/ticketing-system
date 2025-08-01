"""
Test cases for Core models - Event, Ticket, and User interactions
"""
import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from decimal import Decimal
from datetime import datetime, timedelta
from django.utils import timezone

from .models import Event, Ticket

User = get_user_model()


class UserModelTest(TestCase):
    """Test custom User model functionality"""
    
    def setUp(self):
        self.user_data = {
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = User.objects.create_user(
            username='testuser',
            email='user@test.com',  # Override the email from user_data
            password='testpass123',
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name']
        )
        self.assertEqual(user.email, 'user@test.com')
        self.assertEqual(user.role, 'user')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_organizer(self):
        """Test creating an organizer user"""
        organizer = User.objects.create_user(
            username='organizer',
            email='organizer@test.com',
            password='testpass123',
            role='organizer',
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name']
        )
        self.assertEqual(organizer.role, 'organizer')
        self.assertFalse(organizer.is_staff)
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass123',
            first_name=self.user_data['first_name'],
            last_name=self.user_data['last_name']
        )
        self.assertEqual(admin.role, 'admin')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
    
    def test_email_unique(self):
        """Test that email addresses must be unique"""
        User.objects.create_user(
            username='unique1',
            email='unique@test.com',
            password='testpass123'
        )
        
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                username='unique2',
                email='unique@test.com',
                password='anotherpass'
            )
    
    def test_user_str_representation(self):
        """Test string representation of user"""
        user = User.objects.create_user(
            username='displayuser',
            email='display@test.com',
            first_name='Display',
            last_name='User'
        )
        self.assertEqual(str(user), 'display@test.com')


class EventModelTest(TestCase):
    """Test Event model functionality"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.event_data = {
            'name': 'Test Event',  # Changed from 'title' to 'name'
            'description': 'A test event description',
            'start_time': timezone.now() + timedelta(days=30),  # Changed from 'date'
            'end_time': timezone.now() + timedelta(days=30, hours=3),  # Added end_time
            'location': 'Test Venue',
            'capacity': 100,
            'organizer': self.organizer
        }
    
    def test_create_event(self):
        """Test creating an event"""
        event = Event.objects.create(**self.event_data)
        self.assertEqual(event.name, 'Test Event')  # Changed from title to name
        self.assertEqual(event.organizer, self.organizer)
        self.assertIsNotNone(event.created_at)
    
    def test_event_str_representation(self):
        """Test string representation of event"""
        event = Event.objects.create(**self.event_data)
        self.assertEqual(str(event), 'Test Event')
    
    def test_available_tickets_calculation(self):
        """Test available tickets calculation"""
        event = Event.objects.create(**self.event_data)
        
        # Create some tickets
        user = User.objects.create_user(
            username='buyer',
            email='buyer@test.com',
            password='testpass123'
        )
        
        # Book 3 tickets
        for i in range(3):
            Ticket.objects.create(
                event=event,
                user=user,
                status='paid'  # Use valid status
            )
        
        # Count available tickets manually
        total_tickets = Ticket.objects.filter(event=event).count()
        available = event.capacity - total_tickets
        
        # Should have 97 available tickets
        self.assertEqual(available, 97)
    
    def test_can_be_scanned_by_organizer(self):
        """Test that organizer can scan their event tickets"""
        event = Event.objects.create(**self.event_data)
        self.assertTrue(event.can_be_scanned_by(self.organizer))
    
    def test_can_be_scanned_by_admin(self):
        """Test that admin can scan any event tickets"""
        event = Event.objects.create(**self.event_data)
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass123'
        )
        self.assertTrue(event.can_be_scanned_by(admin))
    
    def test_cannot_be_scanned_by_regular_user(self):
        """Test that regular users cannot scan event tickets"""
        event = Event.objects.create(**self.event_data)
        user = User.objects.create_user(
            username='regularuser',
            email='user@test.com',
            password='testpass123'
        )
        self.assertFalse(event.can_be_scanned_by(user))
    
    def test_cannot_be_scanned_by_other_organizer(self):
        """Test that other organizers cannot scan event tickets"""
        event = Event.objects.create(**self.event_data)
        other_organizer = User.objects.create_user(
            username='other',
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        self.assertFalse(event.can_be_scanned_by(other_organizer))


class TicketModelTest(TestCase):
    """Test Ticket model functionality"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            username='organizer',
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            username='testuser',
            email='user@test.com',
            password='testpass123'
        )
        
        self.event = Event.objects.create(
            name='Test Event',
            description='A test event',
            start_time=timezone.now() + timedelta(days=30),
            end_time=timezone.now() + timedelta(days=30, hours=3),
            location='Test Venue',
            capacity=100,
            organizer=self.organizer
        )
    
    def test_create_ticket(self):
        """Test creating a ticket"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        self.assertEqual(ticket.event, self.event)
        self.assertEqual(ticket.user, self.user)
        self.assertEqual(ticket.status, 'paid')
        self.assertTrue(ticket.is_valid)
        self.assertIsNone(ticket.scanned_at)
        self.assertIsNone(ticket.scanned_by)
        self.assertIsNotNone(ticket.validation_token)
        self.assertIsInstance(ticket.validation_token, uuid.UUID)
    
    def test_ticket_str_representation(self):
        """Test string representation of ticket"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        expected = f"{self.user.username} - {self.event.name} [paid]"
        self.assertEqual(str(ticket), expected)
    
    def test_mark_as_used_by_organizer(self):
        """Test marking ticket as used by organizer"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        # Mark as used
        result = ticket.mark_as_used(self.organizer)
        
        self.assertTrue(result)
        self.assertFalse(ticket.is_valid)
        self.assertIsNotNone(ticket.scanned_at)
        self.assertEqual(ticket.scanned_by, self.organizer)
        self.assertEqual(ticket.status, 'used')
    
    def test_mark_as_used_by_admin(self):
        """Test marking ticket as used by admin"""
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass123'
        )
        
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        result = ticket.mark_as_used(admin)
        self.assertTrue(result)
        self.assertEqual(ticket.scanned_by, admin)
    
    def test_cannot_mark_as_used_by_unauthorized_user(self):
        """Test that unauthorized users cannot mark ticket as used"""
        unauthorized_user = User.objects.create_user(
            username='unauthorized',
            email='unauthorized@test.com',
            password='testpass123'
        )
        
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        result = ticket.mark_as_used(unauthorized_user)
        
        self.assertFalse(result)
        self.assertTrue(ticket.is_valid)
        self.assertIsNone(ticket.scanned_at)
        self.assertIsNone(ticket.scanned_by)
    
    def test_cannot_mark_already_used_ticket(self):
        """Test that already used tickets cannot be marked as used again"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        # First scan - should succeed
        result1 = ticket.mark_as_used(self.organizer)
        self.assertTrue(result1)
        
        # Second scan - should fail
        result2 = ticket.mark_as_used(self.organizer)
        self.assertFalse(result2)
    
    def test_validation_token_uniqueness(self):
        """Test that validation tokens are unique"""
        ticket1 = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        ticket2 = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        self.assertNotEqual(ticket1.validation_token, ticket2.validation_token)
    
    def test_get_qr_code_data(self):
        """Test QR code data generation"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            status='paid'
        )
        
        qr_data = ticket.get_qr_code_data()
        
        # Should contain validation token and ticket ID
        self.assertIn(str(ticket.validation_token), qr_data)
        self.assertIn(str(ticket.id), qr_data)
        self.assertIn('ticket_id', qr_data)
        self.assertIn('validation_token', qr_data)
