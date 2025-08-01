# This file defines the URL patterns for the ticketing system's core app.
# It includes endpoints for listing and creating events, booking tickets for events,
# and viewing the user's booked tickets.


from django.urls import path, include
from .views import (
    EventListCreateView, TicketCreateView, MyTicketsView,
    validate_ticket, bulk_validate_tickets,
    OrganizerEventListView, EventTicketsView, event_stats
)

urlpatterns = [
    # Public/User endpoints
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:event_id>/book/', TicketCreateView.as_view(), name='book-ticket'),
    path('my-tickets/', MyTicketsView.as_view(), name='my-tickets'),
    path('api/auth/', include('accounts.urls')),
    
    # 🎫 QR Code Validation Endpoints (Organizer only)
    path('validate-ticket/<uuid:validation_token>/', validate_ticket, name='validate-ticket'),
    path('bulk-validate/', bulk_validate_tickets, name='bulk-validate-tickets'),
    
    # 📊 Organizer Dashboard Endpoints
    path('organizer/events/', OrganizerEventListView.as_view(), name='organizer-events'),
    path('organizer/events/<int:event_id>/tickets/', EventTicketsView.as_view(), name='event-tickets'),
    path('organizer/events/<int:event_id>/stats/', event_stats, name='event-stats'),
]
