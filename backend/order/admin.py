from django.contrib import admin

from .models import Order, OrderItem, PaymentMethod, ShippingMethod

admin.site.register(ShippingMethod)
admin.site.register(PaymentMethod)
admin.site.register(OrderItem)
admin.site.register(Order)


# Register your models here.
