from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Determine the role of the user
    ROLE_CHOICES = (
        ('FARMER', 'Farmer'),
        ('AGENT', 'Village Agent'),
        ('PROCESSOR', 'Processor'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FARMER')
    phone_number = models.CharField(max_length=15, unique=True)
    
class FarmerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    aadhaar_number = models.CharField(max_length=12, unique=True, null=True, blank=True)
    upi_id = models.CharField(max_length=100, null=True, blank=True)
    village = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    # linked agent who onboarded them
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='managed_farmers')
    
    def __str__(self):
        return f"Farmer: {self.user.get_full_name()} ({self.village})"

class ProcessorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='processor_profile')
    company_name = models.CharField(max_length=255)
    gstin = models.CharField(max_length=15, unique=True)
    company_address = models.TextField()

    def __str__(self):
        return self.company_name

class Commodity(models.Model):
    name = models.CharField(max_length=100) # e.g., 'Tomato', 'Maize', 'Paddy'
    grade = models.CharField(max_length=50) # e.g., 'Grade A', 'Lokwan'
    current_price_per_kg = models.DecimalField(max_digits=10, decimal_places=2)
    min_quantity_kg = models.IntegerField(default=100)
    
    class Meta:
        verbose_name_plural = "Commodities"

    def __str__(self):
        return f"{self.name} ({self.grade})"

class Order(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Match'),
        ('AGGREGATING', 'Aggregating at Village'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered & Paid'),
        ('CANCELLED', 'Cancelled'),
    )
    processor = models.ForeignKey(ProcessorProfile, on_delete=models.CASCADE, related_name='orders')
    commodity = models.ForeignKey(Commodity, on_delete=models.PROTECT)
    target_quantity_kg = models.IntegerField()
    fulfilled_quantity_kg = models.IntegerField(default=0)
    target_delivery_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    # Escrow amount calculated based on platform rate at time of order
    escrow_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.processor.company_name} - {self.commodity.name}"

class ProduceLog(models.Model):
    STATUS_CHOICES = (
        ('LOGGED', 'Logged by Agent'),
        ('GRADED', 'Graded & Approved'),
        ('DISPATCHED', 'Dispatched to Processor'),
    )
    agent = models.ForeignKey(User, on_delete=models.PROTECT, related_name='logged_produce')
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.PROTECT, related_name='produce_logs')
    commodity = models.ForeignKey(Commodity, on_delete=models.PROTECT)
    quantity_kg = models.DecimalField(max_digits=10, decimal_places=2)
    # The rate applied at the time of logging
    applied_rate = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='LOGGED')
    # Link to the specific processor order they are contributing to
    destination_order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='produce_logs')
    created_at = models.DateTimeField(auto_now_add=True)
    
    @property
    def estimated_payout(self):
        return self.quantity_kg * self.applied_rate

    def __str__(self):
        return f"Log #{self.id} - {self.farmer.user.get_full_name()} - {self.quantity_kg}kg {self.commodity.name}"


# =============================================
# TRACEABILITY & QUALITY CERTIFICATION MODELS
# =============================================

import uuid

class BatchTrace(models.Model):
    """Tracks a batch of produce from farm to processor with a unique QR code."""
    STATUS_CHOICES = (
        ('CREATED', 'Created at Village'),
        ('QUALITY_CHECKED', 'Quality Verified'),
        ('IN_TRANSIT', 'In Transit'),
        ('RECEIVED', 'Received by Processor'),
        ('REJECTED', 'Rejected'),
    )
    batch_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    produce_log = models.ForeignKey(ProduceLog, on_delete=models.CASCADE, related_name='batch_traces')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='batch_traces')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='CREATED')
    # Quality metrics
    moisture_content = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Moisture % at harvest")
    foreign_matter_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, help_text="Foreign matter %")
    quality_grade = models.CharField(max_length=10, blank=True, default='', help_text="Final assigned grade: A, B, C")
    # Geo
    origin_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    origin_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    origin_village = models.CharField(max_length=150, blank=True, default='')
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Batch {str(self.batch_id)[:8]} - {self.produce_log.commodity.name}"


class QualityCheckpoint(models.Model):
    """Each checkpoint records a quality inspection event on a batch."""
    CHECKPOINT_TYPE = (
        ('HARVEST', 'At Harvest (Agent)'),
        ('AGGREGATION', 'At Aggregation Center'),
        ('TRANSIT', 'During Transit'),
        ('RECEIVING', 'At Processor Dock'),
    )
    batch = models.ForeignKey(BatchTrace, on_delete=models.CASCADE, related_name='checkpoints')
    checkpoint_type = models.CharField(max_length=20, choices=CHECKPOINT_TYPE)
    inspector_name = models.CharField(max_length=150)
    passed = models.BooleanField(default=True)
    notes = models.TextField(blank=True, default='')
    photo_url = models.URLField(blank=True, default='')
    checked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        status = "PASS" if self.passed else "FAIL"
        return f"{self.checkpoint_type} - {status} - Batch {str(self.batch.batch_id)[:8]}"


# =============================================
# INPUT MARKETPLACE MODELS (B2C for Farmers)
# =============================================

class InputProduct(models.Model):
    """Agricultural input products (seeds, fertilizers, etc.) sold to farmers."""
    CATEGORY_CHOICES = (
        ('SEEDS', 'Seeds'),
        ('FERTILIZER', 'Fertilizer'),
        ('PESTICIDE', 'Pesticide'),
        ('EQUIPMENT', 'Farm Equipment'),
    )
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='SEEDS')
    brand = models.CharField(max_length=150)
    description = models.TextField(blank=True, default='')
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20, default='kg')  # kg, packet, litre, piece
    stock_available = models.IntegerField(default=0)
    image_url = models.URLField(blank=True, default='')
    # Supplier can be a Processor or a separate vendor
    supplier = models.ForeignKey(ProcessorProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='input_products')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.brand}) - ₹{self.price_per_unit}/{self.unit}"


class InputOrder(models.Model):
    """Order placed by a farmer (via agent) for input products."""
    STATUS_CHOICES = (
        ('PLACED', 'Order Placed'),
        ('CONFIRMED', 'Confirmed by Supplier'),
        ('SHIPPED', 'Shipped'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    )
    farmer = models.ForeignKey(FarmerProfile, on_delete=models.CASCADE, related_name='input_orders')
    agent = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='facilitated_input_orders')
    product = models.ForeignKey(InputProduct, on_delete=models.PROTECT, related_name='orders')
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PLACED')
    delivery_address = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"InputOrder #{self.id} - {self.product.name} x{self.quantity}"
