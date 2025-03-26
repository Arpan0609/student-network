from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProfileViewSet, PostViewSet, ConnectionViewSet, MessageViewSet, NotificationViewSet, GroupViewSet
from .views import RegisterView, LoginView, LogoutView

router = DefaultRouter()
router.register(r'profiles', ProfileViewSet)
router.register(r'posts', PostViewSet)
router.register(r'connections', ConnectionViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]