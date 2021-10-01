from django.contrib import admin
from .models import ShippingMethod, PaymentMethod, Order, OrderItem

admin.site.register(ShippingMethod)
admin.site.register(PaymentMethod)
admin.site.register(OrderItem)
admin.site.register(Order)


# Register your models here.
