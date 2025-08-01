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
            'last_name': 'User',
            'phone_number': '+254712345678'
        }
    
    def test_create_user(self):
        """Test creating a regular user"""
        user = User.objects.create_user(
            email='user@test.com',
            password='testpass123',
            **self.user_data
        )
        self.assertEqual(user.email, 'user@test.com')
        self.assertEqual(user.role, 'user')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_create_organizer(self):
        """Test creating an organizer user"""
        organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer',
            **self.user_data
        )
        self.assertEqual(organizer.role, 'organizer')
        self.assertFalse(organizer.is_staff)
    
    def test_create_superuser(self):
        """Test creating a superuser"""
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123',
            **self.user_data
        )
        self.assertEqual(admin.role, 'admin')
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
    
    def test_email_unique(self):
        """Test that email addresses must be unique"""
        User.objects.create_user(
            email='unique@test.com',
            password='testpass123'
        )
        
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                email='unique@test.com',
                password='anotherpass'
            )
    
    def test_user_str_representation(self):
        """Test string representation of user"""
        user = User.objects.create_user(
            email='display@test.com',
            first_name='Display',
            last_name='User'
        )
        self.assertEqual(str(user), 'display@test.com')


class EventModelTest(TestCase):
    """Test Event model functionality"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.event_data = {
            'title': 'Test Event',
            'description': 'A test event description',
            'date': timezone.now() + timedelta(days=30),
            'location': 'Test Venue',
            'price': Decimal('1000.00'),
            'capacity': 100,
            'organizer': self.organizer
        }
    
    def test_create_event(self):
        """Test creating an event"""
        event = Event.objects.create(**self.event_data)
        self.assertEqual(event.title, 'Test Event')
        self.assertEqual(event.organizer, self.organizer)
        self.assertEqual(event.available_tickets, 100)
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
            email='buyer@test.com',
            password='testpass123'
        )
        
        # Book 3 tickets
        for i in range(3):
            Ticket.objects.create(
                event=event,
                user=user,
                price=event.price
            )
        
        # Should have 97 available tickets
        self.assertEqual(event.available_tickets, 97)
    
    def test_can_be_scanned_by_organizer(self):
        """Test that organizer can scan their event tickets"""
        event = Event.objects.create(**self.event_data)
        self.assertTrue(event.can_be_scanned_by(self.organizer))
    
    def test_can_be_scanned_by_admin(self):
        """Test that admin can scan any event tickets"""
        event = Event.objects.create(**self.event_data)
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        self.assertTrue(event.can_be_scanned_by(admin))
    
    def test_cannot_be_scanned_by_regular_user(self):
        """Test that regular users cannot scan event tickets"""
        event = Event.objects.create(**self.event_data)
        user = User.objects.create_user(
            email='user@test.com',
            password='testpass123'
        )
        self.assertFalse(event.can_be_scanned_by(user))
    
    def test_cannot_be_scanned_by_other_organizer(self):
        """Test that other organizers cannot scan event tickets"""
        event = Event.objects.create(**self.event_data)
        other_organizer = User.objects.create_user(
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        self.assertFalse(event.can_be_scanned_by(other_organizer))


class TicketModelTest(TestCase):
    """Test Ticket model functionality"""
    
    def setUp(self):
        self.organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            email='user@test.com',
            password='testpass123'
        )
        
        self.event = Event.objects.create(
            title='Test Event',
            description='A test event',
            date=timezone.now() + timedelta(days=30),
            location='Test Venue',
            price=Decimal('1000.00'),
            capacity=100,
            organizer=self.organizer
        )
    
    def test_create_ticket(self):
        """Test creating a ticket"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        self.assertEqual(ticket.event, self.event)
        self.assertEqual(ticket.user, self.user)
        self.assertEqual(ticket.price, Decimal('1000.00'))
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
            price=self.event.price
        )
        expected = f"Ticket for {self.event.title} - {self.user.email}"
        self.assertEqual(str(ticket), expected)
    
    def test_mark_as_used_by_organizer(self):
        """Test marking ticket as used by organizer"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        # Mark as used
        result = ticket.mark_as_used(self.organizer)
        
        self.assertTrue(result)
        self.assertFalse(ticket.is_valid)
        self.assertIsNotNone(ticket.scanned_at)
        self.assertEqual(ticket.scanned_by, self.organizer)
    
    def test_mark_as_used_by_admin(self):
        """Test marking ticket as used by admin"""
        admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        result = ticket.mark_as_used(admin)
        self.assertTrue(result)
        self.assertEqual(ticket.scanned_by, admin)
    
    def test_cannot_mark_as_used_by_unauthorized_user(self):
        """Test that unauthorized users cannot mark ticket as used"""
        unauthorized_user = User.objects.create_user(
            email='unauthorized@test.com',
            password='testpass123'
        )
        
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
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
            price=self.event.price
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
            price=self.event.price
        )
        
        ticket2 = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        self.assertNotEqual(ticket1.validation_token, ticket2.validation_token)
    
    def test_get_qr_code_data(self):
        """Test QR code data generation"""
        ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        qr_data = ticket.get_qr_code_data()
        
        # Should contain validation token and ticket ID
        self.assertIn(str(ticket.validation_token), qr_data)
        self.assertIn(str(ticket.id), qr_data)
        self.assertIn('ticket_id', qr_data)
        self.assertIn('validation_token', qr_data)
