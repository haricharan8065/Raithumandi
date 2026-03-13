from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, FarmerProfileViewSet, ProcessorProfileViewSet,
    CommodityViewSet, OrderViewSet, ProduceLogViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'farmers', FarmerProfileViewSet)
router.register(r'processors', ProcessorProfileViewSet)
router.register(r'commodities', CommodityViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'logs', ProduceLogViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
