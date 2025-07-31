from   rest_framework import serializers
from .models import Event, Ticket, Category
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

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.StringRelatedField(read_only=True)
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = Event
        fields = [
            'id', 'organizer', 'title', 'description', 'venue', 
            'start_date', 'end_date', 'image', 'capacity', 
            'category', 'category_id', 'created_at'
        ]
        read_only_fields = ['id', 'organizer', 'created_at']
