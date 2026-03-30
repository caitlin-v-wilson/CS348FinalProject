from rest_framework import serializers
from .models import Example

class ExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Example
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
