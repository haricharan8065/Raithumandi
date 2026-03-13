from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, FarmerProfileViewSet, ProcessorProfileViewSet,
    CommodityViewSet, OrderViewSet, ProduceLogViewSet,
    BatchTraceViewSet, QualityCheckpointViewSet,
    InputProductViewSet, InputOrderViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'farmers', FarmerProfileViewSet)
router.register(r'processors', ProcessorProfileViewSet)
router.register(r'commodities', CommodityViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'logs', ProduceLogViewSet)
# Traceability
router.register(r'batches', BatchTraceViewSet)
router.register(r'checkpoints', QualityCheckpointViewSet)
# Input Marketplace
router.register(r'input-products', InputProductViewSet)
router.register(r'input-orders', InputOrderViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]
