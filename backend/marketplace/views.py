from rest_framework import viewsets, permissions
from .models import (
    User, FarmerProfile, ProcessorProfile, Commodity, Order, ProduceLog,
    BatchTrace, QualityCheckpoint, InputProduct, InputOrder
)
from .serializers import (
    UserSerializer, FarmerProfileSerializer, ProcessorProfileSerializer,
    CommoditySerializer, OrderSerializer, ProduceLogSerializer,
    BatchTraceSerializer, QualityCheckpointSerializer,
    InputProductSerializer, InputOrderSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class FarmerProfileViewSet(viewsets.ModelViewSet):
    queryset = FarmerProfile.objects.all()
    serializer_class = FarmerProfileSerializer
    permission_classes = [permissions.AllowAny]

class ProcessorProfileViewSet(viewsets.ModelViewSet):
    queryset = ProcessorProfile.objects.all()
    serializer_class = ProcessorProfileSerializer
    permission_classes = [permissions.AllowAny]

class CommodityViewSet(viewsets.ModelViewSet):
    queryset = Commodity.objects.all()
    serializer_class = CommoditySerializer
    permission_classes = [permissions.AllowAny]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

class ProduceLogViewSet(viewsets.ModelViewSet):
    queryset = ProduceLog.objects.all().order_by('-created_at')
    serializer_class = ProduceLogSerializer
    permission_classes = [permissions.AllowAny]


# =============================================
# TRACEABILITY VIEWS
# =============================================

class BatchTraceViewSet(viewsets.ModelViewSet):
    queryset = BatchTrace.objects.all().order_by('-created_at')
    serializer_class = BatchTraceSerializer
    permission_classes = [permissions.AllowAny]

class QualityCheckpointViewSet(viewsets.ModelViewSet):
    queryset = QualityCheckpoint.objects.all().order_by('-checked_at')
    serializer_class = QualityCheckpointSerializer
    permission_classes = [permissions.AllowAny]


# =============================================
# INPUT MARKETPLACE VIEWS
# =============================================

class InputProductViewSet(viewsets.ModelViewSet):
    queryset = InputProduct.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = InputProductSerializer
    permission_classes = [permissions.AllowAny]

class InputOrderViewSet(viewsets.ModelViewSet):
    queryset = InputOrder.objects.all().order_by('-created_at')
    serializer_class = InputOrderSerializer
    permission_classes = [permissions.AllowAny]
