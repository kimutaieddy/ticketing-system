from django.shortcuts import render

# Create your views here.
# events/views.py

from rest_framework import viewsets, permissions, filters
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from .models import Event, Ticket, Category
from .serializers import EventSerializer, TicketSerializer, CategorySerializer

# Pagination class
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# Event ViewSet
class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('-created_at')
    serializer_class = EventSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = StandardResultsSetPagination

    filter_backends = [filters.SearchFilter, filters.OrderingFilter, DjangoFilterBackend]
    search_fields = ['title', 'venue']
    ordering_fields = ['start_date', 'created_at']
    filterset_fields = ['category']

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

# Ticket ViewSet
class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-reserved_at')
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = StandardResultsSetPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Category ViewSet (Optional but useful for filtering)
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
