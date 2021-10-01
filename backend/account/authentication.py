from django.contrib.auth.models import update_last_login
import jwt
import datetime
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework import exceptions
from .models import User


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # "Bearer token..."
        # print(request.headers)
        auth_info = request.headers['Authorization']
        # print("Auth info", auth_info)
        if not auth_info:
            return None
        token = auth_info[7:]
        if (not token) :
            return None

        try: 
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])     
        except Exception:
            return None
            # raise exceptions.AuthenticationFailed('expired token')
        # print(payload)
        user = User.objects.get(pk=payload['user_id'])
        
        if user is None:
            raise exceptions.AuthenticationFailed('User not found!')
        update_last_login(None, user)
        return (user, None)
        

    @staticmethod
    def generate_jwt(id):
        payload = {            
            'user_id': id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
            'iat': datetime.datetime.utcnow()
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')