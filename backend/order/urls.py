from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import (OrderViewSet, PaymentMethodViewSet, ShippingMethodViewSet, cancelOrder,
                    createOrder, getUserOrder, cancelOrder, test)

router = SimpleRouter()

router.register('payment-method', PaymentMethodViewSet)
router.register('shipping-method', ShippingMethodViewSet)
router.register('', OrderViewSet)

app_name = 'order'
urlpatterns = [
    path('create/', createOrder, name='create_order'),
    path('your-order/', getUserOrder, name='get_user_order'),
    path('cancel/<int:pk>/', cancelOrder, name='cancel_order' ),
    path('test/', test, name='test'),
    path('', include(router.urls))
]