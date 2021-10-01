from django.db import models
from . import CouponType
# Create your models here.
class Coupon(models.Model):
    code = models.CharField(max_length=100, unique=True, primary_key=True)
    type = models.CharField(max_length=50, default=CouponType.DIRECT_DEDUCTION, choices=CouponType.CHOICES)
    description = models.CharField(max_length=255)
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    active = models.BooleanField(default=False)
    discount = models.DecimalField(max_digits=8, decimal_places=1)
    min_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    def __str__(self):
        return f'{self.code}: {self.description}'
