from rest_framework.views import APIView
from rest_framework.response import Response

from .cart import Cart
from rest_framework.decorators import api_view
from product.models import Product, ProductVariant
from rest_framework import status
from product.serializers import ProductCartSerializer, ProductReadOnlySerializer, ProductVariantSerializer
from .serializers import CartItemSerializer

# Create your views here.
def handleCartData(dt, request):
    result = []
    data = dt.copy()
    product_ids = dt.keys()
    for key in product_ids:
        p = Product.objects.get(id=key)
        if p:
            data[key]['product'] = ProductCartSerializer(p, context={'request': request}).data
            result.append(data[key])
        else:
            print(f'not product id: {key}')
    return result


@api_view(['POST'])
def add_product(request):
    print('request', request.data)
    s = CartItemSerializer(data=request.data)
    if s.is_valid():
        v = ProductVariant.objects.get(id=s.data['variant'])
        data = {
            "quantity": s.data['quantity'],
            "variant": ProductVariantSerializer(instance=v).data,
            "product": ProductCartSerializer(instance=v.product, context={'request': request}).data,
            "image": request.build_absolute_uri(s.data.get('image'))
        }
        return Response(data)
        
    return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
def validate(request):
    dt = request.data
    data = []
    for item in dt:
        s = CartItemSerializer(data=item)
        if s.is_valid():
            v = ProductVariant.objects.get(id=s.data.get('variant'))
            data.append({
                "error": False,
                "quantity": s.data.get('quantity'),
                "variant": ProductVariantSerializer(instance=v).data,
                "product": ProductCartSerializer(instance=v.product, context={'request': request}).data,
                "image": request.build_absolute_uri(s.data.get('image'))
            })
        else:
            error_data = {
                'error': True,
                'errors': s.errors,
                'quantity': item.get('quantity'),
                'image': request.build_absolute_uri(item.get('image'))
            }
            p = Product.objects.get(id=item.get('product', None))
            v = ProductVariant.objects.get(id=item.get('variant', None))
            if p:
                error_data['product'] = ProductCartSerializer(instance=p, context={'request': request}).data
            if v:
                error_data['variant'] = ProductVariantSerializer(instance=v).data

            data.append(error_data)
    return Response(data, status=status.HTTP_200_OK)

