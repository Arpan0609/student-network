from rest_framework import viewsets
from .models import Profile, Post, Connection, Message, Notification, Group
from .serializers import ProfileSerializer, PostSerializer, ConnectionSerializer, MessageSerializer, NotificationSerializer, GroupSerializer

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

class ConnectionViewSet(viewsets.ModelViewSet):
    queryset = Connection.objects.all()
    serializer_class = ConnectionSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


# Add to existing views
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def check_auth(request):
    return Response({'authenticated': request.user.is_authenticated})


# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User

class RegisterView(APIView):
    permission_classes = []  # Allow any user to register
    
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            email = request.data.get('email')
            
            if not username or not password:
                return Response({'error': 'Username and password required'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, 
                              status=status.HTTP_400_BAD_REQUEST)
            
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email if email else ''
            )
            return Response({'success': 'User created successfully'}, 
                           status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, 
                          status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token

class LoginView(APIView):
    permission_classes = []  # Allow unauthenticated access
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Both username and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            login(request, user)
            # Get new CSRF token after login
            csrf_token = get_token(request)
            return Response({
                'success': 'Logged in successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email
                },
                'csrf_token': csrf_token
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        


from django.contrib.auth import logout

class LogoutView(APIView):
    permission_classes = []  # Allow any user to logout
    
    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response(
                {'success': 'Logged out successfully'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'error': 'User was not logged in'},
            status=status.HTTP_400_BAD_REQUEST
        )


from django.contrib.auth import logout
from django.middleware.csrf import get_token

class LogoutView(APIView):
    def post(self, request):
        logout(request)
        response = Response({'success': 'Logged out successfully'})
        # Clear session cookie
        response.delete_cookie('sessionid')
        # Clear CSRF cookie
        response.delete_cookie('csrftoken')
        # Get new CSRF token for anonymous user
        get_token(request)
        return response