from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExampleViewSet, health_check

router = DefaultRouter()
router.register(r'examples', ExampleViewSet)

urlpatterns = [
    path('health/', health_check),
    path('', include(router.urls)),
]
