from rest_framework import generics, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import Event, Ticket
from .serializers import EventSerializer, TicketSerializer, TicketValidationSerializer
from .permissions import IsOrganizerOrAdmin, CanScanEventTickets, IsEventOrganizer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from django.core.mail import send_mail
from django.conf import settings

# 📅 List and Create Events

class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-start_time')
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'location', 'organizer']
    search_fields = ['name', 'description']

    def perform_create(self, serializer):
        # Automatically set the current user as the organizer
        # Only allow organizers and admins to create events
        if self.request.user.role not in ['organizer', 'admin'] and not self.request.user.is_superuser:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Only organizers and admins can create events")
        
        serializer.save(organizer=self.request.user)

    def get_queryset(self):
        # Organizers can only see their own events (unless admin)
        if self.request.user.role == 'organizer':
            return Event.objects.filter(organizer=self.request.user).order_by('-start_time')
        return Event.objects.all().order_by('-start_time')


# 🎟️ Book a Ticket for an Event
class TicketCreateView(generics.CreateAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)

        # Check if event still has capacity
        current_tickets = Ticket.objects.filter(event=event).count()
        if current_tickets >= event.capacity:
            return Response({"error": "Event is fully booked."}, status=status.HTTP_400_BAD_REQUEST)

        ticket = Ticket.objects.create(user=request.user, event=event)

        # Send confirmation email after ticket is created
        send_mail(
            subject='Your Ticket Confirmation',
            message=f"Hi {request.user.username}, your ticket for {event.name} has been reserved. See you there!",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[request.user.email],
            fail_silently=True
        )

        serializer = self.get_serializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 🙋 View My Tickets
class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-created_at')


# 🎫 QR Code Ticket Validation API
@api_view(['GET', 'POST'])
@permission_classes([IsOrganizerOrAdmin])  # Only organizers/admins can scan
def validate_ticket(request, validation_token):
    """
    Validate a ticket using its validation token from QR code
    GET: Check ticket status without marking as used
    POST: Mark ticket as used/scanned (only by event organizer)
    """
    try:
        ticket = get_object_or_404(Ticket, validation_token=validation_token)
    except:
        return Response({
            'valid': False,
            'status': 'invalid',
            'message': 'Invalid ticket token'
        }, status=status.HTTP_404_NOT_FOUND)

    # Check if user can scan this event's tickets
    if not ticket.event.can_be_scanned_by(request.user):
        return Response({
            'valid': False,
            'status': 'forbidden',
            'message': f'You are not authorized to scan tickets for event: {ticket.event.name}',
            'event': ticket.event.name,
            'event_organizer': ticket.event.organizer.username
        }, status=status.HTTP_403_FORBIDDEN)

    # Check if ticket is scannable
    if not ticket.is_scannable():
        reasons = []
        if ticket.status != 'paid':
            reasons.append(f"Ticket status is '{ticket.status}', not 'paid'")
        if not ticket.is_valid:
            reasons.append("Ticket has been invalidated")
        if ticket.scanned_at:
            reasons.append(f"Ticket already scanned at {ticket.scanned_at}")
            
        return Response({
            'valid': False,
            'status': ticket.status,
            'message': 'Ticket cannot be scanned',
            'reasons': reasons,
            'ticket': TicketValidationSerializer(ticket).data
        }, status=status.HTTP_400_BAD_REQUEST)

    # GET request: Just validate without marking as used
    if request.method == 'GET':
        return Response({
            'valid': True,
            'status': 'scannable',
            'message': 'Ticket is valid and ready to scan',
            'event': {
                'name': ticket.event.name,
                'organizer': ticket.event.organizer.username,
                'start_time': ticket.event.start_time
            },
            'ticket': TicketValidationSerializer(ticket).data
        })

    # POST request: Mark ticket as used
    if request.method == 'POST':
        # Mark ticket as used
        ticket.mark_as_used(request.user)

        return Response({
            'valid': True,
            'status': 'scanned',
            'message': f'Ticket successfully scanned by {request.user.username}',
            'scanned_at': ticket.scanned_at,
            'scanned_by': request.user.username,
            'event': ticket.event.name,
            'ticket': TicketValidationSerializer(ticket).data
        })


# 🔍 Bulk Ticket Status Check (for event organizers)
@api_view(['POST'])
@permission_classes([IsOrganizerOrAdmin])
def bulk_validate_tickets(request):
    """
    Check status of multiple tickets at once
    POST body: {"tokens": ["token1", "token2", "token3"]}
    """
    tokens = request.data.get('tokens', [])
    if not tokens:
        return Response({
            'error': 'No tokens provided'
        }, status=status.HTTP_400_BAD_REQUEST)

    results = []
    for token in tokens:
        try:
            ticket = Ticket.objects.get(validation_token=token)
            # Check if user can access this ticket's event
            if not ticket.event.can_be_scanned_by(request.user):
                results.append({
                    'token': token,
                    'valid': False,
                    'status': 'forbidden',
                    'ticket': None
                })
                continue
                
            results.append({
                'token': token,
                'valid': ticket.is_scannable(),
                'status': ticket.status,
                'ticket': TicketValidationSerializer(ticket).data
            })
        except Ticket.DoesNotExist:
            results.append({
                'token': token,
                'valid': False,
                'status': 'not_found',
                'ticket': None
            })

    return Response({
        'results': results,
        'total_checked': len(tokens),
        'valid_count': sum(1 for r in results if r['valid'])
    })


# 📊 Organizer Dashboard Views
class OrganizerEventListView(generics.ListAPIView):
    """List events for the current organizer"""
    serializer_class = EventSerializer
    permission_classes = [IsOrganizerOrAdmin]

    def get_queryset(self):
        if self.request.user.role == 'admin' or self.request.user.is_superuser:
            return Event.objects.all().order_by('-start_time')
        return Event.objects.filter(organizer=self.request.user).order_by('-start_time')


class EventTicketsView(generics.ListAPIView):
    """List all tickets for a specific event (organizer only)"""
    serializer_class = TicketSerializer
    permission_classes = [IsOrganizerOrAdmin]

    def get_queryset(self):
        event_id = self.kwargs.get('event_id')
        event = get_object_or_404(Event, id=event_id)
        
        # Check if user can access this event
        if not event.can_be_scanned_by(self.request.user):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("You don't have permission to view tickets for this event")
        
        return Ticket.objects.filter(event=event).order_by('-created_at')


@api_view(['GET'])
@permission_classes([IsOrganizerOrAdmin])
def event_stats(request, event_id):
    """Get statistics for a specific event"""
    event = get_object_or_404(Event, id=event_id)
    
    # Check permissions
    if not event.can_be_scanned_by(request.user):
        return Response({
            'error': 'You don\'t have permission to view stats for this event'
        }, status=status.HTTP_403_FORBIDDEN)
    
    tickets = Ticket.objects.filter(event=event)
    
    stats = {
        'event_name': event.name,
        'event_capacity': event.capacity,
        'total_tickets': tickets.count(),
        'pending_tickets': tickets.filter(status='pending').count(),
        'paid_tickets': tickets.filter(status='paid').count(),
        'cancelled_tickets': tickets.filter(status='cancelled').count(),
        'scanned_tickets': tickets.filter(status='used').count(),
        'available_capacity': event.capacity - tickets.count(),
        'scan_rate': f"{(tickets.filter(status='used').count() / max(tickets.filter(status='paid').count(), 1)) * 100:.1f}%"
    }
    
    return Response(stats)
