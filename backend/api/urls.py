from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, PostViewSet, health_check, login, post_statistics

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('health/', health_check),
    path('login/', login),
    path('statistics/', post_statistics),
    path('', include(router.urls)),
]
