from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import User, Post
from .serializers import UserSerializer, PostSerializer

def sanitize(value: str) -> str:
    value = value.strip()
    result = ''
    inside_tag = False
    for char in value:
        if char == '<': 
            inside_tag = True
        elif char == '>':
            inside_tag = False
        elif not inside_tag:
            result += char
    return result

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    #crud is default behavior in django, but the 
    #create fuction is for the special behavior 
    #for checking duplicate usernames
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        
        #get a copy of the request data so the input can be santizied
        data = request.data.copy()

        #santize the data the user inputted for username, password, about
        data['username'] = sanitize(data.get('username', ''))
        data['password'] = sanitize(data.get('password', ''))
        data['about'] = sanitize(data.get('about', ''))

        # Check if the santitized username already exists
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'error': 'This username already exists'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        #passes the santizied data to the serializer to create the user
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        #If the user edited their about section, sanitize it
        if 'about' in data:
            data['about'] = sanitize(data['about'])
        kwargs['partial'] = kwargs.get('partial', False)
        #see if we can edit it
        instance = self.get_object() 
        #get lock to edit it
        instance = User.objects.select_for_update().get(pk=instance.pk) 
        serializer = self.get_serializer(instance, data=data, partial=kwargs['partial'])
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    #gets the posts for a specific user profile
    def get_queryset(self):
        queryset = Post.objects.all()
        user_owner = self.request.query_params.get('user_owner')
        if user_owner:
            queryset = queryset.filter(user_owner=user_owner)
        return queryset

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['post_title'] = sanitize(data.get('post_title', ''))
        data['post_text'] = sanitize(data.get('post_text', ''))
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @transaction.atomic
    def update(self, request, *args, **kwargs):
        data = request.data.copy()
        if 'post_title' in data:
            data['post_title'] = sanitize(data['post_title'])
        if 'post_text' in data:
            data['post_text'] = sanitize(data['post_text'])
        kwargs['partial'] = kwargs.get('partial', False)

        #get permission to edit post
        instance = self.get_object()  
        #edit post
        instance = Post.objects.select_for_update().get(pk=instance.pk) 
        serializer = self.get_serializer(instance, data=data, partial=kwargs['partial'])
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'API is running'})

@api_view(['POST'])
def login(request):
    username = sanitize(request.data.get('username', ''))
    password = sanitize(request.data.get('password', ''))
    
    try:
        user = User.objects.get(username=username)
        if user.password == password:
            return Response({'user_id': user.user_id}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Unsuccessful login'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response({'error': 'Unsuccessful login'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def post_statistics(request):
    from datetime import datetime, timedelta
    
    start_date = request.query_params.get('start_date')
    end_date = request.query_params.get('end_date')
    user_owner = request.query_params.get('user_owner')
    
    posts = Post.objects.all()
    
    #date range filter
    if start_date:
        posts = posts.filter(date_created__gte=start_date)
    if end_date:
        #include the end date 
        end_date_obj = datetime.strptime(end_date, '%Y-%m-%d')
        end_date_obj = end_date_obj + timedelta(days=1)
        posts = posts.filter(date_created__lt=end_date_obj)
    
    #user filter (used for history page)
    if user_owner:
        posts = posts.filter(user_owner=user_owner)
    

    post_count = posts.count()
    top_user = None
    top_user_count = 0
    if post_count > 0:
        from django.db.models import Count
        user_post_counts = posts.values('user_owner').annotate(count=Count('user_owner')).order_by('-count').first()
        if user_post_counts:
            top_user_id = user_post_counts['user_owner']
            top_user_count = user_post_counts['count']
            try:
                top_user = User.objects.get(user_id=top_user_id).username
            except User.DoesNotExist:
                top_user = f"User {top_user_id}"
    
    #longest post
    longest_post_user = None
    longest_post_length = 0
    if post_count > 0:
        longest_post = posts.order_by('-post_text').first()
        if longest_post:
            longest_post_length = len(longest_post.post_text)
            try:
                longest_post_user = User.objects.get(user_id=longest_post.user_owner).username
            except User.DoesNotExist:
                longest_post_user = f"User {longest_post.user_owner}"
    
    return Response({
        'post_count': post_count,
        'top_user': top_user,
        'top_user_count': top_user_count,
        'longest_post_user': longest_post_user,
        'longest_post_length': longest_post_length,
        'posts': PostSerializer(posts, many=True).data
    }, status=status.HTTP_200_OK)
