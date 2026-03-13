from rest_framework import serializers
from .models import User, FarmerProfile, ProcessorProfile, Commodity, Order, ProduceLog

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
