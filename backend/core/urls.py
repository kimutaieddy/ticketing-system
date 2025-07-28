# This file defines the URL patterns for the ticketing system's core app.
# It includes endpoints for listing and creating events, booking tickets for events,
# and viewing the user's booked tickets.


from django.urls import path, include
from .views import EventListCreateView, TicketCreateView, MyTicketsView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
    path('events/<int:event_id>/book/', TicketCreateView.as_view(), name='book-ticket'),
    path('my-tickets/', MyTicketsView.as_view(), name='my-tickets'),
    path('api/auth/', include('accounts.urls')),

]

