from rest_framework import serializers
from .models import Event, Ticket

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['organizer', 'created_at']


class TicketSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    validation_url = serializers.ReadOnlyField()
    is_scannable = serializers.ReadOnlyField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'user', 'event', 'validation_token', 'qr_code', 
            'status', 'created_at', 'scanned_at', 'is_valid', 
            'scanned_by', 'validation_url', 'is_scannable'
        ]
        read_only_fields = [
            'user', 'validation_token', 'qr_code', 'created_at', 
            'scanned_at', 'scanned_by', 'validation_url', 'is_scannable'
        ]


class TicketValidationSerializer(serializers.ModelSerializer):
    """Serializer for ticket validation responses"""
    event_name = serializers.CharField(source='event.name', read_only=True)
    event_date = serializers.DateTimeField(source='event.start_time', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'validation_token', 'status', 'is_valid', 
            'scanned_at', 'event_name', 'event_date', 'user_name'
        ]
        read_only_fields = '__all__'

        
