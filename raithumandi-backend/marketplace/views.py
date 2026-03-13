from rest_framework import viewsets, permissions
from .models import User, FarmerProfile, ProcessorProfile, Commodity, Order, ProduceLog
from .serializers import (
    UserSerializer, FarmerProfileSerializer, ProcessorProfileSerializer,
    CommoditySerializer, OrderSerializer, ProduceLogSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # In a real app, use more strict permissions
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
