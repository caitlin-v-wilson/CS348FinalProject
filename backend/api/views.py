from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Post
from .serializers import UserSerializer, PostSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    #crud is default behavior in django, but the 
    #create fuction is for the special behavior 
    #for checking duplicate usernames
    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        
        # Check if username already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'This username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # If username doesn't exist, create the user
        return super().create(request, *args, **kwargs)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all()
        user_owner = self.request.query_params.get('user_owner')
        if user_owner:
            queryset = queryset.filter(user_owner=user_owner)
        return queryset

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'API is running'})

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(username=username)
        if user.password == password:
            return Response({'user_id': user.user_id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Unsuccessful login'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'Unsuccessful login'}, status=status.HTTP_401_UNAUTHORIZED)
