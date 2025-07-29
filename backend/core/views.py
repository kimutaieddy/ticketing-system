from rest_framework import generics, permissions, filters
from .models import Event, Ticket
from .serializers import EventSerializer, TicketSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

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
