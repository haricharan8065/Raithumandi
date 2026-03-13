import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from marketplace.models import Commodity

User = get_user_model()

# Create superuser if not exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin', first_name='Admin')
    print("Superuser created")

# Create commodities if not exist
commodities = [
    {'name': 'Tomatoes', 'grade': 'Grade A', 'current_price_per_kg': 24.50},
    {'name': 'Tomatoes', 'grade': 'Grade B', 'current_price_per_kg': 18.00},
    {'name': 'Onions', 'grade': 'Standard', 'current_price_per_kg': 35.00},
    {'name': 'Maize', 'grade': 'Feed Grade', 'current_price_per_kg': 22.00},
]

for c in commodities:
    Commodity.objects.get_or_create(
        name=c['name'],
        grade=c['grade'],
        defaults={'current_price_per_kg': c['current_price_per_kg']}
    )
print("Commodities seeded")
