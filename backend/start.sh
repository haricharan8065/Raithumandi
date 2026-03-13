#!/bin/bash

# Run database migrations
python manage.py migrate --noinput

# Seed the database (only if empty)
python manage.py shell -c "
from marketplace.models import User
if User.objects.count() == 0:
    exec(open('seed.py').read())
    print('Database seeded successfully!')
else:
    print('Database already has data, skipping seed.')
"

# Collect static files
python manage.py collectstatic --noinput

# Start gunicorn
exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 config.wsgi:application
