from rest_framework.decorators import action
from account.authentication import JWTAuthentication
from account.serializers import UserLoginForm, UserSerializer
from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from .permissions import IsAdminOrIsSelf
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from .models import User
from django.core.cache import cache
from core.utils import generate_code
# Create your views here.
from .tasks import send_email
from django.core.mail import send_mail
from datetime import datetime

USER_CACHE_KEY = 'users_backend'
PASSWORD_DEFAULT="12345678"

class TestAPIView(APIView):
    # permission_classes = [IsAdminOrIsSelf]
    def get(self, request):
        user = request.user
        print(user)
        token = "hello"
        subject = "Vuong Van Chinh Final exam"
        message = "Your code is 123456"
        recipient_list = ['19020231@vnu.edu.vn']
        # print(message)
        print(datetime.now().strftime("%H:%M:%S"))
        e = send_email.delay(subject, message, recipient_list)
        print(e)
        print(datetime.now().strftime("%H:%M:%S"))
        return Response({"token": token})


class UserLoginAPIView(APIView):    
    def post(self, request):
        s = UserLoginForm(data=request.data)
        if s.is_valid():
            data = s.data
            email = data['email']
            password = data['password']
            # print(request.user)
            user = User.objects.get(email=email)
            if not user:
                return Response({'email': ['User not exist']}, status=status.HTTP_400_BAD_REQUEST)
            if not user.check_password(password):
                return Response({'password': ['Password not exact']}, status=status.HTTP_400_BAD_REQUEST)
            
            token = JWTAuthentication.generate_jwt(user.id)
            response = Response()
            user_data = UserSerializer(user).data
            if user.avatar:
                user_data['avatar'] = request.build_absolute_uri(user_data['avatar'])
            
            response.data = {
                'jwt': token,
                'user_logedin': user_data
            }

            return response
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogoutAPIView(APIView):
    permission_classes =[IsAuthenticated]
    def get(self, request):
        response = Response(data={'message': 'Logout successfuly!'}, status=status.HTTP_200_OK)
        response.delete_cookie('jwt')
        return response

class UserRegisterAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        data = request.data
        if data['password'] != data['password_confirm']:
            return Response({"message": "Password confirm no match"})
        data.pop('password_confirm')
        user = User.objects.create_user(**data)
        user.set_password(data['password'])
        return Response(UserSerializer(user).data)

class UserViewSet(viewsets.ModelViewSet):    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # permission_classes = [IsAdminUser]  
    def list(self, request):
        users = cache.get(USER_CACHE_KEY)
        if not users:
            users = users = list(User.objects.all())
            cache.set(USER_CACHE_KEY, users, timeout=60*60*24) #24h
            print("miss")
        else:
            print("hit")
        total = len(users)
        limit = int(request.query_params.get('limit', 0))
        offset = int(request.query_params.get('offset', 0))
        if limit and offset < total:
            users = users[offset:offset+limit]
        
        data = UserSerializer(users, many=True).data        
        # print(data)
        for i in range(len(data)):
            if data[i]['avatar']:
                print(data[i]['avatar'])
                data[i]['avatar'] = request.build_absolute_uri(data[i]['avatar'])

        return Response({
            "total": total,
            "data": data
        }, status=status.HTTP_200_OK)

    def create(self, request):
        data = request.data
        if not data.get('avatar', '').startswith('data:'):
            data.pop('avatar', '')
        if not request.user.is_staff:
            data.pop('is_active', '')
            data.pop('is_staff', '')

        serializer = UserSerializer(data=data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(PASSWORD_DEFAULT)
            cache.delete(USER_CACHE_KEY)
            data = UserSerializer(user).data
            if user.avatar:
                data['avatar'] = request.build_absolute_uri(data['avatar'])
            return Response(data, status=201)
       
        return Response(serializer.errors, status=400)
            
    def update(self, request, pk):    
        user = User.objects.get(pk=pk)
        data = request.data
       
        if not data.get('avatar', '') or not data.get('avatar', '').startswith('data:'):
            data.pop('avatar', '')
        if not request.user.is_staff:
            data.pop('is_active', None)
            data.pop('is_staff', '')
         
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            cache.delete(USER_CACHE_KEY)
            data = serializer.data
            if user.avatar:
                data['avatar'] = request.build_absolute_uri(data['avatar'])

            return Response(data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk):
        instance = User.objects.filter(id=pk).delete()
        print("instance", instance)
        if instance:
            print("delete Cache")
            cache.delete(USER_CACHE_KEY)
            return Response({"message": "delete successfully!"})
        return Response(data='User not exist',status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['GET'])
    def info(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.avatar:
            data['avatar'] = request.build_absolute_uri(data['avatar'])
        return Response(data)

    @action(detail=False, methods=['POST'])
    def change_password(self, request):
        data = request.data
        if data['new_password'] != data['new_password_confirm']:
            return Response({"message": "new password not match"}, status=status.HTTP_400_BAD_REQUEST)
        if request.user.check_password(data['old_password']):
            request.user.set_password(data['new_password'])
            request.user.save()
            return Response({
                "message": "Password has changed"
            }, status=status.HTTP_200_OK)
        return Response({"error": "old password not exactly"}, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['POST'])
    def reset_password(self, request):
        email = request.data['email']
        code = request.data['code']
        new_password = request.data['new_password']
        new_password_confirm = request.data['new_password_confirm']

        message =''
        st = status.HTTP_200_OK
        if email and code and new_password and new_password_confirm:
            if new_password == new_password_confirm:
                key = f'{email}-{code}'
                cache_code = cache.get(key)
                if (cache_code == code):
                    user = User.objects.get(email=email)
                    print(new_password)
                    user.set_password(new_password)
                    user.save()
                    print(user)
                    cache.delete(key)
                    message = 'Password has changed.'
                    st = status.HTTP_200_OK
                else:
                    message = 'Errors'
                    st = status.HTTP_400_BAD_REQUEST    
            else:
                message = 'Password and password confirm not match.'
                st = status.HTTP_400_BAD_REQUEST
        elif email and code:
            print("cache", cache.get(email))
            code_in_cache = cache.get(email)
            if (code_in_cache and code_in_cache == code):
                message = 'You have ten minutes. Enter new password'
                cache.set(f'{email}-{code}', code_in_cache, timeout=600)
                cache.delete(email)
            else:
                message = 'Code not exact'
                st = status.HTTP_400_BAD_REQUEST
            print("code", code)

        elif email:
            if User.objects.filter(email=email).exists():
                c = generate_code(6)
                cache.set(email, c, timeout=120)
                sub = 'Reset your password'
                msg = f'Your code to reset password: {c}'
                send_email.delay(sub, msg, [email])
                message = 'Check your email, enter the code. You have two minutes'
                print(c)
            else:
                message = f'The user with email {email} not exist.'
                st = status.HTTP_400_BAD_REQUEST

        return Response({'message': message}, status=st)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ('retrieve', 'update', 'delete'):
            permission_classes = [IsAdminOrIsSelf]
        elif self.action in ('info', 'change_password'):
            permission_classes = [IsAuthenticated]
        elif self.action =='reset_password':
            permission_classes = [AllowAny]
        else:permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
        