import random
from models import db, Ticket, ZoneStatus, QueueStatus, Alert
from datetime import datetime, timedelta

def init_dummy_data():
    # 1. Add Stadium Zones
    zones = [
        ('North Stand', 5000), ('South Stand', 5000), 
        ('East Stand', 8000), ('West Stand', 8000),
        ('VIP Lounge', 1000), ('Food Court A', 2000),
        ('Entry Gate 1', 1000), ('Entry Gate 2', 1000)
    ]
    
    for name, cap in zones:
        if not ZoneStatus.query.filter_by(zone_name=name).first():
            z = ZoneStatus(zone_name=name, capacity_total=cap, capacity_current=random.randint(0, cap//2))
            db.session.add(z)

    # 2. Add Queues
    queues = [
        ('The Burger Hub', 'food'), ('Pizza Palace', 'food'),
        ('Quick Snack A', 'food'), ('Quick Snack B', 'food'),
        ('Washroom North', 'toilet'), ('Washroom South', 'toilet'),
        ('Washroom East', 'toilet'), ('Parking Exit A', 'parking'),
        ('Parking Exit B', 'parking')
    ]
    
    for name, cat in queues:
        if not QueueStatus.query.filter_by(stall_name=name).first():
            q = QueueStatus(stall_name=name, category=cat, wait_time_mins=random.randint(2, 25))
            db.session.add(q)

    # 3. Add Initial Alert
    if not Alert.query.first():
        alert = Alert(
            title='Welcome to the Arena!',
            message='Event in progress. Please use the navigation guide to find amenities.',
            alert_type='event'
        )
        db.session.add(alert)

    # 4. Add a Generic Ticket for display
    if not Ticket.query.first():
        ticket = Ticket(
            event_name='Grand Championship 2026',
            seat_section='East Stand, Block B',
            seat_number='B-42',
            gate_suggestion='Gate 4',
            qr_data='CHAMP-2026-FAN42'
        )
        db.session.add(ticket)

    db.session.commit()

def simulate_data_drift():
    """Randomly updates crowd and queue data to simulate live action."""
    zones = ZoneStatus.query.all()
    for z in zones:
        change = random.randint(-50, 50)
        z.capacity_current = max(0, min(z.capacity_total, z.capacity_current + change))
        # Update risk level based on occupancy
        occupancy = (z.capacity_current / z.capacity_total) * 100
        if occupancy > 85:
            z.risk_level = 2 # High/Crimson
        elif occupancy > 60:
            z.risk_level = 1 # Med/Amber
        else:
            z.risk_level = 0 # Low/Emerald
        z.last_updated = datetime.utcnow()
    
    queues = QueueStatus.query.all()
    for q in queues:
        q.wait_time_mins = max(1, min(45, q.wait_time_mins + random.randint(-3, 3)))
    
    db.session.commit()
