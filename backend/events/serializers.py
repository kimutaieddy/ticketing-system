from   rest_framework import serializers
from .models import Event, Ticket
from django.contrib.auth import get_user_model

User = get_user_model()

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category    
        fields = 'id', 'name'

class OrganizerProfileSerializers(serializers.ModelSerializer):
    category = CategorySerializer() 

    class Meta:
        model = Event
        fields = ['id', 'organizer_name', 'user']

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'
