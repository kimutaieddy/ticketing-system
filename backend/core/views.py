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
    filterset_fields = ['category', 'location']
    search_fields = ['name', 'description']


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

    def post(self, request):
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
@permission_classes([AllowAny])  # Scanner apps don't need authentication
def validate_ticket(request, validation_token):
    """
    Validate a ticket using its validation token from QR code
    GET: Check ticket status without marking as used
    POST: Mark ticket as used/scanned
    """
    try:
        ticket = get_object_or_404(Ticket, validation_token=validation_token)
    except:
        return Response({
            'valid': False,
            'status': 'invalid',
            'message': 'Invalid ticket token'
        }, status=status.HTTP_404_NOT_FOUND)

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
            'ticket': TicketValidationSerializer(ticket).data
        })

    # POST request: Mark ticket as used
    if request.method == 'POST':
        # Get scanner user info if provided
        scanned_by_user = None
        if request.user.is_authenticated:
            scanned_by_user = request.user

        # Mark ticket as used
        ticket.mark_as_used(scanned_by_user)

        return Response({
            'valid': True,
            'status': 'scanned',
            'message': 'Ticket successfully scanned and marked as used',
            'scanned_at': ticket.scanned_at,
            'ticket': TicketValidationSerializer(ticket).data
        })


# 🔍 Bulk Ticket Status Check (for event organizers)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
