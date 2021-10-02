
from rest_framework import viewsets
from .serializers import CouponSerializer
from .models import Coupon
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
# Create your views here.

class CouponViewset(viewsets.ModelViewSet):
    serializer_class = CouponSerializer
    queryset = Coupon.objects.all()

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        rs = [permission() for permission in permission_classes]
        # print(rs)
        return rs