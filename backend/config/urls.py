"""
URL configuration for CS348 project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def api_root(request):
    return Response({'message': 'Welcome to CS348 API'})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/auth/', include('api.urls')),
]
