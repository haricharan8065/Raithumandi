from rest_framework import serializers
from .models import (
    User, FarmerProfile, ProcessorProfile, Commodity, Order, ProduceLog,
    BatchTrace, QualityCheckpoint, InputProduct, InputOrder
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'first_name', 'last_name']

class FarmerProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    
    class Meta:
        model = FarmerProfile
        fields = '__all__'

class ProcessorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ProcessorProfile
        fields = '__all__'

class CommoditySerializer(serializers.ModelSerializer):
    class Meta:
        model = Commodity
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    processor_name = serializers.CharField(source='processor.company_name', read_only=True)
    commodity_name = serializers.CharField(source='commodity.name', read_only=True)
    commodity_grade = serializers.CharField(source='commodity.grade', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class ProduceLogSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(source='farmer.user.get_full_name', read_only=True)
    commodity_name = serializers.CharField(source='commodity.name', read_only=True)
    estimated_payout = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = ProduceLog
        fields = '__all__'


# =============================================
# TRACEABILITY SERIALIZERS
# =============================================

class QualityCheckpointSerializer(serializers.ModelSerializer):
    class Meta:
        model = QualityCheckpoint
        fields = '__all__'

class BatchTraceSerializer(serializers.ModelSerializer):
    checkpoints = QualityCheckpointSerializer(many=True, read_only=True)
    farmer_name = serializers.CharField(source='produce_log.farmer.user.get_full_name', read_only=True)
    commodity_name = serializers.CharField(source='produce_log.commodity.name', read_only=True)
    quantity_kg = serializers.DecimalField(source='produce_log.quantity_kg', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = BatchTrace
        fields = '__all__'


# =============================================
# INPUT MARKETPLACE SERIALIZERS
# =============================================

class InputProductSerializer(serializers.ModelSerializer):
    supplier_name = serializers.CharField(source='supplier.company_name', read_only=True, default='Direct Supplier')

    class Meta:
        model = InputProduct
        fields = '__all__'

class InputOrderSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    farmer_name = serializers.CharField(source='farmer.user.get_full_name', read_only=True)

    class Meta:
        model = InputOrder
        fields = '__all__'
