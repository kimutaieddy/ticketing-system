"""
Test cases for Core API views - Authentication, Events, Tickets, and QR validation
"""
import json
import uuid
from decimal import Decimal
from datetime import timedelta
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Event, Ticket

User = get_user_model()


class UserRegistrationTest(APITestCase):
    """Test user registration API"""
    
    def setUp(self):
        self.registration_url = reverse('user-register')
        self.valid_user_data = {
            'email': 'newuser@test.com',
            'password': 'SecurePass123!',
            'first_name': 'New',
            'last_name': 'User',
            'phone_number': '+254712345678'
        }
    
    def test_successful_user_registration(self):
        """Test successful user registration"""
        response = self.client.post(
            self.registration_url,
            self.valid_user_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'newuser@test.com')
        self.assertEqual(response.data['user']['role'], 'user')
    
    def test_organizer_registration(self):
        """Test organizer registration"""
        organizer_data = self.valid_user_data.copy()
        organizer_data['role'] = 'organizer'
        
        response = self.client.post(
            self.registration_url,
            organizer_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['user']['role'], 'organizer')
    
    def test_duplicate_email_registration(self):
        """Test registration with duplicate email"""
        # Create first user
        User.objects.create_user(
            email='existing@test.com',
            password='password123'
        )
        
        # Try to register with same email
        duplicate_data = self.valid_user_data.copy()
        duplicate_data['email'] = 'existing@test.com'
        
        response = self.client.post(
            self.registration_url,
            duplicate_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_invalid_email_registration(self):
        """Test registration with invalid email"""
        invalid_data = self.valid_user_data.copy()
        invalid_data['email'] = 'invalid-email'
        
        response = self.client.post(
            self.registration_url,
            invalid_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
    
    def test_weak_password_registration(self):
        """Test registration with weak password"""
        weak_data = self.valid_user_data.copy()
        weak_data['password'] = '123'
        
        response = self.client.post(
            self.registration_url,
            weak_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EventAPITest(APITestCase):
    """Test Event-related API endpoints"""
    
    def setUp(self):
        # Create test users
        self.organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            email='user@test.com',
            password='testpass123'
        )
        
        self.admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Create test event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test event description',
            date=timezone.now() + timedelta(days=30),
            location='Test Venue',
            price=Decimal('1500.00'),
            capacity=50,
            organizer=self.organizer
        )
        
        # URLs
        self.events_url = reverse('event-list-create')
        self.event_detail_url = lambda pk: reverse('event-detail', kwargs={'pk': pk})
        
    def get_auth_header(self, user):
        """Get authentication header for user"""
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}
    
    def test_list_events_unauthenticated(self):
        """Test listing events without authentication"""
        response = self.client.get(self.events_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_event_as_organizer(self):
        """Test creating event as organizer"""
        event_data = {
            'title': 'New Event',
            'description': 'New event description',
            'date': (timezone.now() + timedelta(days=60)).isoformat(),
            'location': 'New Venue',
            'price': '2000.00',
            'capacity': 100
        }
        
        response = self.client.post(
            self.events_url,
            event_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Event')
        self.assertEqual(response.data['organizer'], self.organizer.id)
    
    def test_create_event_as_regular_user(self):
        """Test that regular users cannot create events"""
        event_data = {
            'title': 'Unauthorized Event',
            'description': 'Should not be created',
            'date': (timezone.now() + timedelta(days=60)).isoformat(),
            'location': 'Venue',
            'price': '1000.00',
            'capacity': 50
        }
        
        response = self.client.post(
            self.events_url,
            event_data,
            format='json',
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_update_event_as_organizer(self):
        """Test updating event as its organizer"""
        update_data = {
            'title': 'Updated Event Title',
            'price': '1800.00'
        }
        
        response = self.client.patch(
            self.event_detail_url(self.event.id),
            update_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Event Title')
    
    def test_cannot_update_other_organizer_event(self):
        """Test that organizers cannot update other organizers' events"""
        other_organizer = User.objects.create_user(
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        update_data = {'title': 'Hacked Title'}
        
        response = self.client.patch(
            self.event_detail_url(self.event.id),
            update_data,
            format='json',
            **self.get_auth_header(other_organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_delete_event_as_organizer(self):
        """Test deleting event as its organizer"""
        response = self.client.delete(
            self.event_detail_url(self.event.id),
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=self.event.id).exists())
    
    def test_organizer_events_filter(self):
        """Test organizer can see only their events"""
        # Create another organizer with their event
        other_organizer = User.objects.create_user(
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        Event.objects.create(
            title='Other Event',
            description='Other description',
            date=timezone.now() + timedelta(days=45),
            location='Other Venue',
            price=Decimal('1000.00'),
            capacity=30,
            organizer=other_organizer
        )
        
        # Test organizer endpoint
        organizer_events_url = reverse('organizer-events')
        response = self.client.get(
            organizer_events_url,
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Test Event')


class TicketAPITest(APITestCase):
    """Test Ticket-related API endpoints"""
    
    def setUp(self):
        # Create users
        self.user = User.objects.create_user(
            email='user@test.com',
            password='testpass123'
        )
        
        self.organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        # Create event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test description',
            date=timezone.now() + timedelta(days=30),
            location='Test Venue',
            price=Decimal('1000.00'),
            capacity=50,
            organizer=self.organizer
        )
        
        # Create ticket
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        # URLs
        self.book_ticket_url = reverse('book-ticket')
        self.user_tickets_url = reverse('user-tickets')
        
    def get_auth_header(self, user):
        """Get authentication header for user"""
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}
    
    def test_book_ticket_success(self):
        """Test successful ticket booking"""
        booking_data = {
            'event_id': self.event.id,
            'quantity': 2
        }
        
        response = self.client.post(
            self.book_ticket_url,
            booking_data,
            format='json',
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data['tickets']), 2)
        self.assertEqual(response.data['total_amount'], '2000.00')
    
    def test_book_ticket_insufficient_capacity(self):
        """Test booking more tickets than available"""
        # Create an event with only 2 capacity
        small_event = Event.objects.create(
            title='Small Event',
            description='Small event',
            date=timezone.now() + timedelta(days=30),
            location='Small Venue',
            price=Decimal('500.00'),
            capacity=2,
            organizer=self.organizer
        )
        
        booking_data = {
            'event_id': small_event.id,
            'quantity': 5  # More than capacity
        }
        
        response = self.client.post(
            self.book_ticket_url,
            booking_data,
            format='json',
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Not enough tickets available', str(response.data))
    
    def test_book_ticket_unauthenticated(self):
        """Test booking ticket without authentication"""
        booking_data = {
            'event_id': self.event.id,
            'quantity': 1
        }
        
        response = self.client.post(
            self.book_ticket_url,
            booking_data,
            format='json'
        )
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_user_tickets(self):
        """Test listing user's tickets"""
        response = self.client.get(
            self.user_tickets_url,
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['event']['title'], 'Test Event')
    
    def test_user_cannot_see_other_tickets(self):
        """Test that users can only see their own tickets"""
        other_user = User.objects.create_user(
            email='other@test.com',
            password='testpass123'
        )
        
        # Create ticket for other user
        Ticket.objects.create(
            event=self.event,
            user=other_user,
            price=self.event.price
        )
        
        response = self.client.get(
            self.user_tickets_url,
            **self.get_auth_header(self.user)
        )
        
        # Should only see own ticket
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user'], self.user.id)


class QRValidationAPITest(APITestCase):
    """Test QR code validation API endpoints"""
    
    def setUp(self):
        # Create users
        self.organizer = User.objects.create_user(
            email='organizer@test.com',
            password='testpass123',
            role='organizer'
        )
        
        self.user = User.objects.create_user(
            email='user@test.com',
            password='testpass123'
        )
        
        self.admin = User.objects.create_superuser(
            email='admin@test.com',
            password='adminpass123'
        )
        
        # Create event
        self.event = Event.objects.create(
            title='Test Event',
            description='Test description',
            date=timezone.now() + timedelta(days=30),
            location='Test Venue',
            price=Decimal('1000.00'),
            capacity=50,
            organizer=self.organizer
        )
        
        # Create valid ticket
        self.ticket = Ticket.objects.create(
            event=self.event,
            user=self.user,
            price=self.event.price
        )
        
        # URLs
        self.validate_url = reverse('validate-ticket')
        
    def get_auth_header(self, user):
        """Get authentication header for user"""
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}
    
    def test_validate_ticket_success_by_organizer(self):
        """Test successful ticket validation by organizer"""
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertIn('ticket', response.data)
        
        # Verify ticket is marked as used
        self.ticket.refresh_from_db()
        self.assertFalse(self.ticket.is_valid)
        self.assertIsNotNone(self.ticket.scanned_at)
        self.assertEqual(self.ticket.scanned_by, self.organizer)
    
    def test_validate_ticket_success_by_admin(self):
        """Test successful ticket validation by admin"""
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.admin)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
    
    def test_validate_ticket_invalid_token(self):
        """Test validation with invalid token"""
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(uuid.uuid4())  # Random UUID
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn('Invalid ticket', response.data['message'])
    
    def test_validate_ticket_already_used(self):
        """Test validating an already used ticket"""
        # First validation
        self.ticket.mark_as_used(self.organizer)
        
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn('already been used', response.data['message'])
    
    def test_validate_ticket_by_unauthorized_user(self):
        """Test that regular users cannot validate tickets"""
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_validate_ticket_by_other_organizer(self):
        """Test that organizers cannot validate other organizers' event tickets"""
        other_organizer = User.objects.create_user(
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        validation_data = {
            'ticket_id': self.ticket.id,
            'validation_token': str(self.ticket.validation_token)
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(other_organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_validate_nonexistent_ticket(self):
        """Test validating a nonexistent ticket"""
        validation_data = {
            'ticket_id': 99999,
            'validation_token': str(uuid.uuid4())
        }
        
        response = self.client.post(
            self.validate_url,
            validation_data,
            format='json',
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class OrganizerDashboardAPITest(APITestCase):
    """Test Organizer Dashboard API endpoints"""
    
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
        
        # Create events
        self.event1 = Event.objects.create(
            title='Event 1',
            description='First event',
            date=timezone.now() + timedelta(days=30),
            location='Venue 1',
            price=Decimal('1000.00'),
            capacity=100,
            organizer=self.organizer
        )
        
        self.event2 = Event.objects.create(
            title='Event 2',
            description='Second event',
            date=timezone.now() + timedelta(days=45),
            location='Venue 2',
            price=Decimal('1500.00'),
            capacity=50,
            organizer=self.organizer
        )
        
        # Create tickets
        for i in range(5):
            Ticket.objects.create(
                event=self.event1,
                user=self.user,
                price=self.event1.price
            )
        
        for i in range(3):
            ticket = Ticket.objects.create(
                event=self.event2,
                user=self.user,
                price=self.event2.price
            )
            # Mark one as used
            if i == 0:
                ticket.mark_as_used(self.organizer)
        
        # URLs
        self.stats_url = reverse('organizer-stats')
        self.tickets_url = reverse('organizer-tickets')
        
    def get_auth_header(self, user):
        """Get authentication header for user"""
        refresh = RefreshToken.for_user(user)
        return {'HTTP_AUTHORIZATION': f'Bearer {refresh.access_token}'}
    
    def test_organizer_stats(self):
        """Test organizer statistics endpoint"""
        response = self.client.get(
            self.stats_url,
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        stats = response.data
        self.assertEqual(stats['total_events'], 2)
        self.assertEqual(stats['total_tickets_sold'], 8)
        self.assertEqual(stats['total_revenue'], '11500.00')  # 5*1000 + 3*1500
        self.assertEqual(stats['tickets_scanned'], 1)
    
    def test_organizer_tickets_list(self):
        """Test organizer tickets listing"""
        response = self.client.get(
            self.tickets_url,
            **self.get_auth_header(self.organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 8)  # All tickets for organizer's events
    
    def test_organizer_cannot_access_other_stats(self):
        """Test that organizers cannot access other organizers' stats"""
        other_organizer = User.objects.create_user(
            email='other@test.com',
            password='testpass123',
            role='organizer'
        )
        
        response = self.client.get(
            self.stats_url,
            **self.get_auth_header(other_organizer)
        )
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should show empty stats for new organizer
        stats = response.data
        self.assertEqual(stats['total_events'], 0)
        self.assertEqual(stats['total_tickets_sold'], 0)
    
    def test_regular_user_cannot_access_organizer_endpoints(self):
        """Test that regular users cannot access organizer endpoints"""
        response = self.client.get(
            self.stats_url,
            **self.get_auth_header(self.user)
        )
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
