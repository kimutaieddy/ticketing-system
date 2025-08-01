from rest_framework import permissions
from .models import Event

class IsOrganizerOrAdmin(permissions.BasePermission):
    """
    Permission class that allows only organizers and admins to access certain views
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['organizer', 'admin'] or request.user.is_superuser


class CanScanEventTickets(permissions.BasePermission):
    """
    Permission class for ticket scanning - only event organizers can scan their event tickets
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in ['organizer', 'admin'] or request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        # obj here would be a Ticket object
        if obj is None:
            return False
            
        if hasattr(obj, 'event'):
            event = obj.event
        else:
            event = obj
        
        return event.can_be_scanned_by(request.user)


class IsEventOrganizer(permissions.BasePermission):
    """
    Permission class that allows only the event organizer or admin to access
    """
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'organizer'):
            # obj is an Event
            return (obj.organizer == request.user or 
                   request.user.role == 'admin' or 
                   request.user.is_superuser)
        elif hasattr(obj, 'event'):
            # obj is a Ticket
            return (obj.event.organizer == request.user or 
                   request.user.role == 'admin' or 
                   request.user.is_superuser)
        return False
