"""
Comprehensive Seed Script for RaithuMandi Platform
Run: python manage.py shell < seed.py
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from marketplace.models import (
    User, FarmerProfile, ProcessorProfile, Commodity, Order, ProduceLog,
    BatchTrace, QualityCheckpoint, InputProduct, InputOrder
)
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import uuid

print("🌱 Seeding RaithuMandi Database...")

# =============================================
# 1. USERS
# =============================================
admin, _ = User.objects.get_or_create(username='admin', defaults={
    'role': 'ADMIN', 'phone_number': '9000000000', 'first_name': 'Admin', 'last_name': 'RaithuMandi',
    'is_staff': True, 'is_superuser': True
})
admin.set_password('admin123')
admin.save()

# Village Agents
agents_data = [
    {'username': 'agent_rajesh', 'first_name': 'Rajesh', 'last_name': 'Kumar', 'phone': '9100000001'},
    {'username': 'agent_priya', 'first_name': 'Priya', 'last_name': 'Sharma', 'phone': '9100000002'},
    {'username': 'agent_venkat', 'first_name': 'Venkat', 'last_name': 'Reddy', 'phone': '9100000003'},
]
agents = []
for a in agents_data:
    user, _ = User.objects.get_or_create(username=a['username'], defaults={
        'role': 'AGENT', 'phone_number': a['phone'], 'first_name': a['first_name'], 'last_name': a['last_name']
    })
    user.set_password('agent123')
    user.save()
    agents.append(user)

# Farmers
farmers_data = [
    {'username': 'farmer_ramu', 'first': 'Ramu', 'last': 'Naidu', 'phone': '9200000001', 'village': 'Anantapur', 'district': 'Anantapur', 'aadhaar': '234567890123', 'upi': 'ramu@ybl'},
    {'username': 'farmer_lakshmi', 'first': 'Lakshmi', 'last': 'Devi', 'phone': '9200000002', 'village': 'Kurnool', 'district': 'Kurnool', 'aadhaar': '345678901234', 'upi': 'lakshmi@paytm'},
    {'username': 'farmer_suresh', 'first': 'Suresh', 'last': 'Gowda', 'phone': '9200000003', 'village': 'Raichur', 'district': 'Raichur', 'aadhaar': '456789012345', 'upi': 'suresh@gpay'},
    {'username': 'farmer_anjali', 'first': 'Anjali', 'last': 'Patil', 'phone': '9200000004', 'village': 'Bellary', 'district': 'Bellary', 'aadhaar': '567890123456', 'upi': 'anjali@phonepe'},
    {'username': 'farmer_krishna', 'first': 'Krishna', 'last': 'Murthy', 'phone': '9200000005', 'village': 'Dharwad', 'district': 'Dharwad', 'aadhaar': '678901234567', 'upi': 'krishna@ybl'},
    {'username': 'farmer_padma', 'first': 'Padma', 'last': 'Rani', 'phone': '9200000006', 'village': 'Guntur', 'district': 'Guntur', 'aadhaar': '789012345678', 'upi': 'padma@paytm'},
    {'username': 'farmer_venky', 'first': 'Venky', 'last': 'Swamy', 'phone': '9200000007', 'village': 'Chittoor', 'district': 'Chittoor', 'aadhaar': '890123456789', 'upi': 'venky@gpay'},
    {'username': 'farmer_sita', 'first': 'Sita', 'last': 'Kumari', 'phone': '9200000008', 'village': 'Nellore', 'district': 'Nellore', 'aadhaar': '901234567890', 'upi': 'sita@ybl'},
]
farmers = []
for f in farmers_data:
    user, _ = User.objects.get_or_create(username=f['username'], defaults={
        'role': 'FARMER', 'phone_number': f['phone'], 'first_name': f['first'], 'last_name': f['last']
    })
    profile, _ = FarmerProfile.objects.get_or_create(user=user, defaults={
        'aadhaar_number': f['aadhaar'], 'upi_id': f['upi'], 'village': f['village'],
        'district': f['district'], 'agent': agents[0]
    })
    farmers.append(profile)

# Processors
processors_data = [
    {'username': 'proc_itc', 'first': 'ITC', 'last': 'Foods', 'phone': '9300000001', 'company': 'ITC Aashirvaad', 'gstin': '36AAACI1681G1Z7', 'addr': 'ITC Centre, Peddar Road, Mumbai 400036'},
    {'username': 'proc_britannia', 'first': 'Britannia', 'last': 'Industries', 'phone': '9300000002', 'company': 'Britannia Industries Ltd', 'gstin': '29AABCB0785H1Z9', 'addr': '5/1A Hungerford St, Kolkata 700017'},
    {'username': 'proc_parle', 'first': 'Parle', 'last': 'Products', 'phone': '9300000003', 'company': 'Parle Agro Pvt Ltd', 'gstin': '27AAACP3981P1ZF', 'addr': 'Parle Biscuits Compound, Vile Parle East, Mumbai'},
]
processors = []
for p in processors_data:
    user, _ = User.objects.get_or_create(username=p['username'], defaults={
        'role': 'PROCESSOR', 'phone_number': p['phone'], 'first_name': p['first'], 'last_name': p['last']
    })
    profile, _ = ProcessorProfile.objects.get_or_create(user=user, defaults={
        'company_name': p['company'], 'gstin': p['gstin'], 'company_address': p['addr']
    })
    processors.append(profile)

print(f"  ✅ Users: {len(agents)} agents, {len(farmers)} farmers, {len(processors)} processors")

# =============================================
# 2. COMMODITIES
# =============================================
commodities_data = [
    {'name': 'Wheat', 'grade': 'Sharbati (Premium)', 'price': 28.50, 'min_qty': 500},
    {'name': 'Wheat', 'grade': 'Lokwan (Standard)', 'price': 24.00, 'min_qty': 500},
    {'name': 'Rice', 'grade': 'Sona Masoori', 'price': 42.00, 'min_qty': 200},
    {'name': 'Rice', 'grade': 'Basmati (1121)', 'price': 78.00, 'min_qty': 100},
    {'name': 'Tomato', 'grade': 'Grade A (Firm)', 'price': 18.00, 'min_qty': 100},
    {'name': 'Onion', 'grade': 'Nashik Red', 'price': 22.00, 'min_qty': 200},
    {'name': 'Potato', 'grade': 'Pukhraj', 'price': 16.00, 'min_qty': 300},
    {'name': 'Chilli', 'grade': 'Guntur Sannam S4', 'price': 145.00, 'min_qty': 50},
    {'name': 'Turmeric', 'grade': 'Salem Finger', 'price': 95.00, 'min_qty': 100},
    {'name': 'Maize', 'grade': 'Yellow Dent', 'price': 19.00, 'min_qty': 500},
    {'name': 'Cotton', 'grade': 'MCU-5 (Medium Staple)', 'price': 62.00, 'min_qty': 200},
    {'name': 'Sugarcane', 'grade': 'CO 86032', 'price': 3.50, 'min_qty': 1000},
]
commodities = []
for c in commodities_data:
    obj, _ = Commodity.objects.get_or_create(name=c['name'], grade=c['grade'], defaults={
        'current_price_per_kg': Decimal(str(c['price'])), 'min_quantity_kg': c['min_qty']
    })
    commodities.append(obj)

print(f"  ✅ Commodities: {len(commodities)} items")

# =============================================
# 3. ORDERS (from processors)
# =============================================
now = timezone.now()
orders_data = [
    {'proc': 0, 'comm': 0, 'qty': 5000, 'fulfilled': 3200, 'status': 'AGGREGATING', 'days_ago': 5, 'delivery_days': 10},
    {'proc': 0, 'comm': 2, 'qty': 2000, 'fulfilled': 2000, 'status': 'DELIVERED', 'days_ago': 15, 'delivery_days': 7},
    {'proc': 1, 'comm': 3, 'qty': 1000, 'fulfilled': 450, 'status': 'PENDING', 'days_ago': 2, 'delivery_days': 14},
    {'proc': 1, 'comm': 5, 'qty': 3000, 'fulfilled': 3000, 'status': 'DELIVERED', 'days_ago': 20, 'delivery_days': 10},
    {'proc': 2, 'comm': 7, 'qty': 500, 'fulfilled': 350, 'status': 'IN_TRANSIT', 'days_ago': 7, 'delivery_days': 12},
    {'proc': 0, 'comm': 8, 'qty': 800, 'fulfilled': 0, 'status': 'PENDING', 'days_ago': 1, 'delivery_days': 21},
    {'proc': 2, 'comm': 4, 'qty': 1500, 'fulfilled': 1500, 'status': 'DELIVERED', 'days_ago': 30, 'delivery_days': 7},
    {'proc': 1, 'comm': 9, 'qty': 4000, 'fulfilled': 1800, 'status': 'AGGREGATING', 'days_ago': 3, 'delivery_days': 14},
]
orders = []
for o in orders_data:
    comm = commodities[o['comm']]
    order, _ = Order.objects.get_or_create(
        processor=processors[o['proc']], commodity=comm, target_quantity_kg=o['qty'],
        defaults={
            'fulfilled_quantity_kg': o['fulfilled'], 'status': o['status'],
            'target_delivery_date': (now + timedelta(days=o['delivery_days'])).date(),
            'escrow_amount': Decimal(str(o['qty'])) * comm.current_price_per_kg,
        }
    )
    orders.append(order)

print(f"  ✅ Orders: {len(orders)} from processors")

# =============================================
# 4. PRODUCE LOGS (from agents)
# =============================================
logs_data = [
    {'agent': 0, 'farmer': 0, 'comm': 0, 'qty': 800, 'status': 'GRADED', 'order': 0, 'days': 4},
    {'agent': 0, 'farmer': 1, 'comm': 0, 'qty': 1200, 'status': 'DISPATCHED', 'order': 0, 'days': 4},
    {'agent': 0, 'farmer': 2, 'comm': 0, 'qty': 1200, 'status': 'GRADED', 'order': 0, 'days': 3},
    {'agent': 1, 'farmer': 3, 'comm': 2, 'qty': 500, 'status': 'DISPATCHED', 'order': 1, 'days': 12},
    {'agent': 1, 'farmer': 4, 'comm': 2, 'qty': 1500, 'status': 'DISPATCHED', 'order': 1, 'days': 13},
    {'agent': 0, 'farmer': 5, 'comm': 5, 'qty': 1500, 'status': 'DISPATCHED', 'order': 3, 'days': 18},
    {'agent': 0, 'farmer': 6, 'comm': 5, 'qty': 1500, 'status': 'DISPATCHED', 'order': 3, 'days': 17},
    {'agent': 2, 'farmer': 7, 'comm': 7, 'qty': 350, 'status': 'DISPATCHED', 'order': 4, 'days': 6},
    {'agent': 0, 'farmer': 0, 'comm': 4, 'qty': 750, 'status': 'DISPATCHED', 'order': 6, 'days': 28},
    {'agent': 0, 'farmer': 1, 'comm': 4, 'qty': 750, 'status': 'DISPATCHED', 'order': 6, 'days': 27},
    {'agent': 1, 'farmer': 3, 'comm': 9, 'qty': 900, 'status': 'GRADED', 'order': 7, 'days': 2},
    {'agent': 1, 'farmer': 4, 'comm': 9, 'qty': 900, 'status': 'LOGGED', 'order': 7, 'days': 1},
    {'agent': 2, 'farmer': 5, 'comm': 3, 'qty': 225, 'status': 'LOGGED', 'order': 2, 'days': 1},
    {'agent': 2, 'farmer': 6, 'comm': 3, 'qty': 225, 'status': 'LOGGED', 'order': 2, 'days': 1},
]
logs = []
for l in logs_data:
    comm = commodities[l['comm']]
    log, created = ProduceLog.objects.get_or_create(
        agent=agents[l['agent']], farmer=farmers[l['farmer']], commodity=comm,
        quantity_kg=Decimal(str(l['qty'])),
        defaults={
            'applied_rate': comm.current_price_per_kg, 'status': l['status'],
            'destination_order': orders[l['order']],
        }
    )
    if created:
        log.created_at = now - timedelta(days=l['days'])
        log.save(update_fields=['created_at'])
    logs.append(log)

print(f"  ✅ Produce Logs: {len(logs)} entries")

# =============================================
# 5. BATCH TRACES (traceability)
# =============================================
villages_coords = {
    'Anantapur': (14.6819, 77.6006), 'Kurnool': (15.8281, 78.0373),
    'Raichur': (16.2120, 77.3439), 'Bellary': (15.1394, 76.9214),
    'Dharwad': (15.4589, 75.0078), 'Guntur': (16.3067, 80.4365),
    'Chittoor': (13.2172, 79.1003), 'Nellore': (14.4426, 79.9865),
}
batch_statuses = {
    'LOGGED': 'CREATED', 'GRADED': 'QUALITY_CHECKED', 'DISPATCHED': 'IN_TRANSIT'
}
batches = []
for i, log in enumerate(logs):
    village = log.farmer.village
    lat, lng = villages_coords.get(village, (15.0, 78.0))
    status = batch_statuses.get(log.status, 'CREATED')
    # For delivered orders, mark batch as RECEIVED
    if log.destination_order and log.destination_order.status == 'DELIVERED':
        status = 'RECEIVED'
    
    batch, created = BatchTrace.objects.get_or_create(
        produce_log=log,
        defaults={
            'order': log.destination_order, 'status': status,
            'moisture_content': Decimal(str(12 + (i % 5))),
            'foreign_matter_pct': Decimal(str(0.5 + (i % 3) * 0.3)),
            'quality_grade': ['A', 'A', 'B', 'A', 'B', 'A', 'A', 'B', 'A', 'A', 'B', 'C', 'C', 'B'][i % 14],
            'origin_lat': Decimal(str(lat)), 'origin_lng': Decimal(str(lng)),
            'origin_village': village,
            'dispatched_at': (now - timedelta(days=2)) if status in ('IN_TRANSIT', 'RECEIVED') else None,
            'received_at': (now - timedelta(days=1)) if status == 'RECEIVED' else None,
        }
    )
    batches.append(batch)

print(f"  ✅ Batch Traces: {len(batches)} batches")

# =============================================
# 6. QUALITY CHECKPOINTS
# =============================================
for batch in batches:
    stage_idx = ['CREATED', 'QUALITY_CHECKED', 'IN_TRANSIT', 'RECEIVED'].index(batch.status) if batch.status in ['CREATED', 'QUALITY_CHECKED', 'IN_TRANSIT', 'RECEIVED'] else 0
    checkpoint_types = ['HARVEST', 'AGGREGATION', 'TRANSIT', 'RECEIVING']
    inspectors = ['Rajesh Kumar', 'Priya Sharma', 'Venkat Reddy', 'Lab Technician']
    
    for j in range(stage_idx + 1):
        QualityCheckpoint.objects.get_or_create(
            batch=batch, checkpoint_type=checkpoint_types[j],
            defaults={
                'inspector_name': inspectors[j],
                'passed': True,
                'notes': f'{checkpoint_types[j]} inspection passed. Quality grade: {batch.quality_grade}',
            }
        )

print(f"  ✅ Quality Checkpoints: created for all batches")

# =============================================
# 7. INPUT PRODUCTS
# =============================================
products_data = [
    {'name': 'Sona Masoori Paddy Seeds', 'cat': 'SEEDS', 'brand': 'IARI Certified', 'price': 85, 'unit': 'kg', 'stock': 500, 'desc': 'High-yielding, disease-resistant paddy seeds. Certified by IARI. Ideal for Kharif season.'},
    {'name': 'Bt Cotton Seeds (Bollgard-II)', 'cat': 'SEEDS', 'brand': 'Mahyco', 'price': 930, 'unit': 'packet', 'stock': 200, 'desc': 'Bollworm resistant BT cotton seeds. 450g per packet. Excellent germination rate.'},
    {'name': 'HD-3086 Wheat Seeds', 'cat': 'SEEDS', 'brand': 'Pusa Certified', 'price': 72, 'unit': 'kg', 'stock': 800, 'desc': 'High-yielding bread wheat. Rust resistant. Best for Northern plains. Rabi season.'},
    {'name': 'Hybrid Tomato Seeds (Arka Rakshak)', 'cat': 'SEEDS', 'brand': 'IIHR Bangalore', 'price': 450, 'unit': 'packet', 'stock': 350, 'desc': 'Triple disease resistant hybrid tomato. High yield of 75-80 tonnes/hectare.'},
    {'name': 'Guntur Sannam Chilli Seeds', 'cat': 'SEEDS', 'brand': 'Nunhems', 'price': 680, 'unit': 'packet', 'stock': 150, 'desc': 'Premium S4 variety chilli seeds. 10,000-12,000 SHU. Red colour, excellent drying quality.'},
    {'name': 'DAP (Di-Ammonium Phosphate)', 'cat': 'FERTILIZER', 'brand': 'IFFCO', 'price': 1350, 'unit': '50kg bag', 'stock': 120, 'desc': 'Essential phosphatic fertilizer. 18% Nitrogen, 46% Phosphorus. Government subsidized.'},
    {'name': 'Urea (Neem Coated)', 'cat': 'FERTILIZER', 'brand': 'NFL', 'price': 267, 'unit': '45kg bag', 'stock': 300, 'desc': 'Neem coated urea as per government mandate. 46% Nitrogen. Slow release for better efficiency.'},
    {'name': 'NPK 10:26:26', 'cat': 'FERTILIZER', 'brand': 'Coromandel', 'price': 1470, 'unit': '50kg bag', 'stock': 90, 'desc': 'Complex fertilizer ideal for crops needing more phosphorus and potassium.'},
    {'name': 'Vermicompost (Organic)', 'cat': 'FERTILIZER', 'brand': 'GreenLife', 'price': 8, 'unit': 'kg', 'stock': 2000, 'desc': '100% organic earthworm compost. Rich in humus, NPK, and beneficial microbes.'},
    {'name': 'Imidacloprid 17.8% SL', 'cat': 'PESTICIDE', 'brand': 'Bayer CropScience', 'price': 520, 'unit': 'litre', 'stock': 80, 'desc': 'Systemic insecticide for sucking pests. Effective against aphids, jassids, thrips, and whiteflies.'},
    {'name': 'Mancozeb 75% WP', 'cat': 'PESTICIDE', 'brand': 'UPL', 'price': 380, 'unit': 'kg', 'stock': 150, 'desc': 'Broad-spectrum contact fungicide. Controls downy mildew, late blight, and leaf spots.'},
    {'name': 'Neem Oil (1500 PPM)', 'cat': 'PESTICIDE', 'brand': 'Parry Agro', 'price': 280, 'unit': 'litre', 'stock': 200, 'desc': 'Organic approved neem-based pesticide. Safe for beneficial insects. Effective pest repellent.'},
    {'name': 'Knapsack Sprayer (16L)', 'cat': 'EQUIPMENT', 'brand': 'ASPEE', 'price': 1850, 'unit': 'piece', 'stock': 45, 'desc': 'Manual knapsack sprayer with brass nozzle. 16 litre capacity. Durable ABS body.'},
    {'name': 'Drip Irrigation Kit (1 acre)', 'cat': 'EQUIPMENT', 'brand': 'Jain Irrigation', 'price': 18500, 'unit': 'set', 'stock': 15, 'desc': 'Complete inline drip system for 1 acre. Includes laterals, emitters, filters, and fittings.'},
    {'name': 'Soil Testing Kit', 'cat': 'EQUIPMENT', 'brand': 'Himedia', 'price': 2400, 'unit': 'kit', 'stock': 30, 'desc': 'Test pH, NPK, organic carbon, and micronutrients. 50 tests per kit. Easy colour chart method.'},
]
for p in products_data:
    InputProduct.objects.get_or_create(
        name=p['name'], brand=p['brand'],
        defaults={
            'category': p['cat'], 'description': p['desc'],
            'price_per_unit': Decimal(str(p['price'])), 'unit': p['unit'],
            'stock_available': p['stock'], 'supplier': processors[0], 'is_active': True
        }
    )

print(f"  ✅ Input Products: {len(products_data)} items in marketplace")

# =============================================
# 8. SAMPLE INPUT ORDERS
# =============================================
input_orders = [
    {'farmer': 0, 'product_name': 'HD-3086 Wheat Seeds', 'qty': 25, 'status': 'DELIVERED'},
    {'farmer': 1, 'product_name': 'DAP (Di-Ammonium Phosphate)', 'qty': 2, 'status': 'SHIPPED'},
    {'farmer': 2, 'product_name': 'Vermicompost (Organic)', 'qty': 100, 'status': 'CONFIRMED'},
    {'farmer': 3, 'product_name': 'Neem Oil (1500 PPM)', 'qty': 5, 'status': 'PLACED'},
]
for io in input_orders:
    product = InputProduct.objects.filter(name=io['product_name']).first()
    if product:
        InputOrder.objects.get_or_create(
            farmer=farmers[io['farmer']], product=product, quantity=io['qty'],
            defaults={
                'agent': agents[0], 'total_price': product.price_per_unit * io['qty'],
                'status': io['status'], 'delivery_address': f"{farmers[io['farmer']].village}, {farmers[io['farmer']].district}"
            }
        )

print(f"  ✅ Input Orders: {len(input_orders)} sample orders")
print("\n🎉 Seeding Complete! Your RaithuMandi database is fully populated.")
