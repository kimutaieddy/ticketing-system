from rest_framework import generics, permissions
from .models import Event, Ticket
from .serializers import EventSerializer, TicketSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

# 📅 List and Create Events
class EventListCreateView(generics.ListCreateAPIView):
    queryset = Event.objects.all().order_by('-start_time')
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


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
        serializer = self.get_serializer(ticket)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# 🙋 View My Tickets
class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(user=self.request.user).order_by('-created_at')
