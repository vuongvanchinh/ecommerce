from django.urls import path, include
from rest_framework.routers import SimpleRouter
from . import views

router = SimpleRouter()
router.register('category',views.CategoryViewSet)
router.register('product-admin', views.ProductAdminViewSet)
router.register('product', views.ProductAPIView)

# router.register('variants', views.ProductVariantViewSet)

app_name = 'product'

urlpatterns = [
    path('product-recommend/<slug:slug>', views.getRecommendProducts, name='get_recommend_products'),
    path('', include(router.urls)),
    
]