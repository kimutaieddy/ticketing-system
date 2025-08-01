from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
import uuid
from django.urls import reverse

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('music', 'Music'),
        ('sports', 'Sports'),
        ('conference', 'Conference'),
        ('comedy', 'Comedy'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    description = models.TextField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    capacity = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



class Ticket(models.Model):
    """Represents a ticket for an event reserved or bought by a user."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    
    # Enhanced QR Code fields
    validation_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    qr_code = models.CharField(max_length=255, blank=True, null=True)  # Store QR code data/URL
    
    # Ticket status and validation
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "Pending"),
            ("paid", "Paid"),
            ("cancelled", "Cancelled"),
            ("used", "Used"),  # Added for scanned tickets
        ],
        default="pending"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    scanned_at = models.DateTimeField(null=True, blank=True)  # When ticket was scanned/used
    
    # Additional validation fields
    is_valid = models.BooleanField(default=True)
    scanned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='scanned_tickets'
    )

    def save(self, *args, **kwargs):
        # Generate QR code URL when ticket is created
        if not self.qr_code:
            self.qr_code = f"https://yourdomain.com/api/validate-ticket/{self.validation_token}/"
        super().save(*args, **kwargs)

    def mark_as_used(self, scanned_by_user=None):
        """Mark ticket as used/scanned"""
        from django.utils import timezone
        self.status = 'used'
        self.scanned_at = timezone.now()
        if scanned_by_user:
            self.scanned_by = scanned_by_user
        self.save()

    def is_scannable(self):
        """Check if ticket can be scanned"""
        return (
            self.status == 'paid' and 
            self.is_valid and 
            self.scanned_at is None
        )

    @property
    def validation_url(self):
        """Get the full validation URL for QR code"""
        return f"https://yourdomain.com/api/validate-ticket/{self.validation_token}/"

    def __str__(self):
        return f"{self.user.username} - {self.event.name} [{self.status}]"


class User(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('organizer', 'Organizer'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # email is used as login

    def __str__(self):
        return self.email