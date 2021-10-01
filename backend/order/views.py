from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework import status

# Create your views here.
from .serializers import OrderItemSerializer, OrderSerializer, PaymentMethodSerializer, ShippingMethodSerializer, OrderReadOnlySerializer
from .models import Order, PaymentMethod, ShippingMethod
from . import OrderStatus

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]
    queryset = Order.objects.all()
    
    def get_serializer_class(self):
        if self.action in ('list', 'retrieve'):
            return OrderReadOnlySerializer
        return OrderSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    @action(detail=True)
    def confirm(self,request, pk):
        order = Order.objects.get(pk=pk)
        if order and order.status in (OrderStatus.UNCONFIRMED, ):
            order.status = OrderStatus.SHIPPING
            order.save()
        else: 
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderReadOnlySerializer(order, context={'request': request}).data)
    
    @action(detail=True)
    def cancel(self, request, pk):
        order = Order.objects.get(pk=pk)
        if order and order.status in (OrderStatus.UNCONFIRMED, OrderStatus.SHIPPING ):
            order.status = OrderStatus.CANCELED
            for item in order.items.all():
                v = item.variant
                v.quantity_in_stock = v.quantity_in_stock + item.quantity
                v.save()
            order.save()
        else: 
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(OrderReadOnlySerializer(order,  context={'request': request}).data)
    
    
class PaymentMethodViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentMethodSerializer
    queryset = PaymentMethod.objects.filter(active=True)

    def get_permissions(self):
        if self.action in ('list, retrieve'):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]
class ShippingMethodViewSet(viewsets.ModelViewSet):
    serializer_class = ShippingMethodSerializer
    queryset = ShippingMethod.objects.filter(active=True)

    def get_permissions(self):
        if self.action in ('list, retrieve'):
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]

@api_view(['POST'])
@permission_classes([IsAuthenticated])# new
def createOrder(request):
    data = request.data
    data['status'] = OrderStatus.UNCONFIRMED
    
    s = OrderSerializer(data=data, partial=True, context={'user': request.user, 'request': request})
    if s.is_valid():
        s.save()
        return Response(s.data, status=status.HTTP_201_CREATED)
    return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)   

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserOrder(request):
    orders = Order.objects.filter(user=request.user)
    s = OrderReadOnlySerializer(orders, many=True, context={'request': request})
    data = s.data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cancelOrder(request, pk):
    order = Order.objects.get(pk=pk, user=request.user)
    print(order)
    if order and order.status in (OrderStatus.UNCONFIRMED, OrderStatus.SHIPPING):
        order.status = OrderStatus.CANCELED
        for item in order.items:
            v = item.variant
            print(item)
            v.quantity_in_stock = v.quantity_in_stock + item.quantity
            v.save()
        order.save()

    else: 
        return Response({"message": "Đừng có láo"}, status=status.HTTP_400_BAD_REQUEST)
    return Response(OrderReadOnlySerializer(order, context={'request': request}).data)

@api_view(['POST'])
def test(request):
    print(request.data)
    s = OrderItemSerializer(data=request.data, context={'request': request}, partial=True)
    if s.is_valid():

        return Response(s.data)
    return Response(s.errors)
