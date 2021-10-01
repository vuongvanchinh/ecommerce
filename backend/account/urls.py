from django.urls import path, include
from . import views
from rest_framework.routers import SimpleRouter

routers =  SimpleRouter()
routers.register('user',views.UserViewSet)

urlpatterns = [
    path('login/', views.UserLoginAPIView.as_view()),
    # path('logout/', views.UserLogoutAPIView.as_view()),
    path('register/', views.UserRegisterAPIView.as_view()),
    path('test/', views.TestAPIView.as_view()),
    path('', include(routers.urls))
]

# urlpatterns.append(routers)