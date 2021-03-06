from django.db import models
from . import CouponType
# Create your models here.
from decimal import Decimal

class Coupon(models.Model):
    code = models.CharField(max_length=100)
    type = models.CharField(max_length=50, default=CouponType.DIRECT_DEDUCTION, choices=CouponType.CHOICES)
    description = models.CharField(max_length=255)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=False)
    discount = models.DecimalField(max_digits=8, decimal_places=1)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    def __str__(self):
        return f'{self.code}: {self.description}'
    
    def apply(self, pre_cost):
        
        if pre_cost < self.min_order_value:
            return pre_cost
        apply_cost = pre_cost
        if self.type == CouponType.DIRECT_DEDUCTION or self.type == CouponType.FREESHIP :
            apply_cost -= self.discount
        elif self.type == CouponType.PERCENTAGE_DEDUCTION:
            apply_cost = Decimal((1-self.discount/100))*pre_cost
        return apply_cost
        
    class Meta:
        db_table = 'coupon_coupon_update'# to fix bug database when change forienkey