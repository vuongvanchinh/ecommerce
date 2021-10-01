from django.db import models
from django.utils.timezone import now
from . import OrderStatus

# Create your models here.
class ShippingMethod(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    active = models.BooleanField(default=True)

class PaymentMethod(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    active = models.BooleanField(default=True)
    

class Order(models.Model):
    user = models.ForeignKey("account.User", 
                related_name='orders', 
                blank=True, null=True,on_delete=models.SET_NULL)
    created = models.DateTimeField(default=now, editable=False)
    status = models.CharField(max_length=50, default=OrderStatus.DRAFT, choices=OrderStatus.CHOICES)
    paid = models.BooleanField(default=False)

    # shiping information
    email = models.EmailField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=150, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    district = models.CharField(max_length=100, blank=True, null=True)
    commune = models.CharField(max_length=100, blank=True, null=True)
    detail_address = models.CharField(max_length=150, blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    # payment method
    payment_method = models.ForeignKey(PaymentMethod, 
                    null=True, related_name='orders', 
                    on_delete=models.SET_NULL)
    shipping_method = models.ForeignKey(ShippingMethod, 
                    null=True, related_name='orders', 
                    on_delete=models.SET_NULL)
    
    coupon = models.ForeignKey('coupon.Coupon', null=True, default=None, on_delete=models.SET_NULL)
    total_payment = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    class Meta:
        ordering=('-created', )
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,related_name='items', on_delete=models.CASCADE )
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    variant = models.ForeignKey(
        "product.ProductVariant",
        related_name="items",
        blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    product = models.ForeignKey(
        "product.Product",
        related_name="items",
        blank=True, null=True,
        on_delete=models.SET_NULL,
    )
    product_name = models.CharField(max_length=255)
    variant_name = models.CharField(max_length=255, default="", blank=True)
    product_sku = models.CharField(max_length=50)
    image = models.CharField(max_length=255, blank=True, null=True)

    
    class Meta:
        ordering = ('order', )
    def __str__(self):
        return f'{self.order} order {self.product_name} variant {self.variant_name}'
        
        

        