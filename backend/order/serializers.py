from rest_framework import fields, serializers

from .models import OrderItem, Order, PaymentMethod, ShippingMethod
# from product.models import ProductVariant, Product

class OrderItemSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()
    class Meta:
        model = OrderItem
        fields = ['id', 'quantity', 'product',
                    'price', 'product_name',
                    'variant_name', 'product_sku',
                    'variant', 'image']

class OrderItemReadOnlySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'quantity', 'product',
                    'price', 'product_name',
                    'variant_name', 'product_sku',
                    'variant', 'image', 'coupon']
    def get_coupon(self, instance):
        if (instance.coupon):
            return None
        return instance.coupon.code
        
    def get_image(self, instance):
        request = self.context.get('request')
        img = getattr(instance, 'image', None)
        if img:
            return request.build_absolute_uri(img)
        return ''
    def get_product(self, instance):
        return {'slug': instance.product.slug}

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, required=True)
    created = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'user', 'name','phone','email',
                'city', 'district',
                'commune', 'detail_address',
                'note', 'payment_method',
                'shipping_method', 'created', 'status','items']
    
    def create(self, validated_data):
        user = self.context.get('user', None)
        items = validated_data.pop('items', [])
        print('items', items)
        if len(items) == 0:
            raise serializers.ValidationError({'items': ['items not allow empty']})
        o = Order.objects.create(user= user, **validated_data)
        for item in items:
            # update quantity in stock
            quantity = item.get('quantity')
            v = item.get('variant')
            stock = v.quantity_in_stock
            v.quantity_in_stock = stock - quantity
            v.save()
            
            OrderItem.objects.create(order=o, **item)
        return o


class OrderReadOnlySerializer(serializers.ModelSerializer):
    items = OrderItemReadOnlySerializer(many=True, required=True)
    created = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
   
    class Meta:
        model = Order
        fields = ['id', 'user', 'name','phone','email',
                'city', 'district',
                'commune', 'detail_address',
                'note', 'payment_method',
                'shipping_method', 'created', 'status','items']
    
    


class PaymentMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = PaymentMethod
        fields= ['name', 'active']
    
class ShippingMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingMethod
        fields = ['name', 'active']
        
