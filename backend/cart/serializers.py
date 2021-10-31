from product.serializers import ProductReadOnlySerializer, ProductVariantSerializer
from django import forms
from rest_framework import serializers
from django.core.exceptions import ValidationError
from order.models import OrderItem

from product.serializers import ProductCartSerializer

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'variant', 'quantity', 'image']
       
    def validate(self, data):
        dt = super().validate(data)
        variant = dt.get('variant', None)
        product = dt.get('product', None)
        quantity = dt.get('quantity', None)
        print("variant ", variant)
        print("product ", product)
        if quantity is None:
            raise serializers.ValidationError({'quantity': 'Quantity is required'})
        if not product:
            raise serializers.ValidationError({'product': 'Product is required'})
        if not product.is_published:
            raise serializers.ValidationError({'product': 'Product is unpublish'})
        if variant:
            if variant.quantity_in_stock == 0 or variant.quantity_in_stock < quantity:
                raise serializers.ValidationError({'quantity': 'Quanity over quantity in stock.'})
            if product.id != variant.product.id:
                raise serializers.ValidationError({'product': 'Product and variant do not belog together'})
        else: 
            raise serializers.ValidationError({'variant': 'Variant is required'})
        return dt
    