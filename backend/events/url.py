# events/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, TicketViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'events', EventViewSet, basename='event')
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
