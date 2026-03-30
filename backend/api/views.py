from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Example
from .serializers import ExampleSerializer

class ExampleViewSet(viewsets.ModelViewSet):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'API is running'})
