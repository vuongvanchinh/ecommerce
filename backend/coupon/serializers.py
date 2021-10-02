from .models import Coupon
from rest_framework import serializers

class CouponSerializer(serializers.ModelSerializer):
    valid_from = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    valid_to = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    
    class Meta:
        model = Coupon
        fields = ['id', 'code', 'type', 'description', 'discount', 'min_order_value',
            'valid_from', 'valid_to', 'active'
        ]
    
