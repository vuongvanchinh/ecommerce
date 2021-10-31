from rest_framework import fields, serializers

from .models import OrderItem, Order, PaymentMethod, ShippingMethod
# from product.models import ProductVariant, Product
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'quantity', 'product',
                    'price', 'product_name',
                    'variant_name', 'product_sku',
                    'variant', 'image']

class OrderItemReadOnlySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    product = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'quantity', 'product',
                    'price', 'product_name',
                    'variant_name', 'product_sku',
                    'variant', 'image']
   
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
    coupon = serializers.SerializerMethodField(required=False)
    class Meta:
        model = Order
        fields = ['id', 'user', 'name','phone','email',
                'city', 'district',
                'commune', 'detail_address',
                'note', 'created', 'status','items', 
                'coupon', 'total_payment',
                'payment_method',
                'shipping_method']
    
    def get_coupon(self, instance):
        if (not instance.coupon):
            return None
        return instance.coupon.code
    
    def create(self, validated_data):
        user = self.context.get('user', None)
        items = validated_data.pop('items', [])
        if len(items) == 0:
            raise serializers.ValidationError({'items': ['items not allow empty']})
        o = Order.objects.create(user= user, **validated_data)
        total_payment = Decimal('0.0')
        for i in range(len(items)):
            item = items[i]
            # update quantity in stock
            quantity = int(item.get('quantity'))
            v = item.get('variant')
            v_price = v.price
            print(v_price, quantity)
            total_payment += v_price * quantity
            stock = int(v.quantity_in_stock)
            v.quantity_in_stock = stock - quantity
            v.save()
            # variant_serializer = 
            OrderItem.objects.create(order=o, **item)
        if (o.shipping_method):
            total_payment = o.shipping_method.apply(total_payment)
        if(o.coupon):
            total_payment = o.coupon.apply(total_payment)
        o.total_payment = total_payment
        # print(total_payment)

        return o
    
    def validate(self, data):
        print(data)
        dt = super().validate(data)
        items = dt.get('items', [])
        for index, item in enumerate(items):
            quantity = int(item.get('quantity'))
            variant = item.get('variant')
            if quantity > variant.quantity_in_stock:
                raise serializers.ValidationError(
                    {'out_of_stock': 
                        {
                            'index': index, 
                            'message': f'There are not enough of {variant.product.name}-{variant.combind_string} in stock, now there are {variant.quantity_in_stock}',
                            'id': variant.id,
                            'current_stock': variant.quantity_in_stock
                        }
                    }
                )
        return dt
    # override validate data

class OrderReadOnlySerializer(serializers.ModelSerializer):
    items = OrderItemReadOnlySerializer(many=True, required=True)
    created = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S", read_only=True)
   
    class Meta:
        model = Order
        fields = ['id', 'user', 'name', 'total_payment', 'phone','email',
                'city', 'district',
                'commune', 'detail_address',
                'note', 'payment_method',
                'shipping_method', 'created', 'status','items']
    
class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields= ['id', 'name', 'coupon', 'active']
        
class PaymentMethodReadOnlySerializer(serializers.ModelSerializer):
    coupon = serializers.SerializerMethodField()

    class Meta:
        model = PaymentMethod
        fields= ['id', 'name', 'coupon', 'active']
    
    def get_coupon(self, instance):
        coupon = instance.coupon
        if coupon:
            return {'id': coupon.id, 'description': coupon.description, 'active': coupon.active}
        return None

    
class ShippingMethodSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShippingMethod
        fields = ['id', 'name', 'active', 'fee']
        
