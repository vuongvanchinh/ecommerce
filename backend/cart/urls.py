from django.urls import path
from . import views
urlpatterns = [
    # path('', views.CartAPiView.as_view(), name='cart'),
    path('add_product/', views.add_product, name='add_product_to_cart'),
    path('validate/', views.validate, name='validate_cart')
]
