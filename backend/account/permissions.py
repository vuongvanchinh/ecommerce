from rest_framework.permissions import BasePermission
from .models import User

class IsAdminOrIsSelf(BasePermission):
    
    def has_permission(self, request, view):
        admin = bool(request.user and request.user.is_staff)
        if admin:
            return True
        path = request.path[0: -1]
        pk = int(path[path.rfind('/') + 1 : ])
        return bool(request.user and request.user.is_authenticated and request.user.id == pk)

