from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CouponViewset

router = DefaultRouter()
router.register('', CouponViewset)

urlpatterns = [
    path('', include(router.urls))

]