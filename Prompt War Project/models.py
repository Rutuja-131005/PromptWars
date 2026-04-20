from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String(200), nullable=False)
    seat_section = db.Column(db.String(50), nullable=False)
    seat_number = db.Column(db.String(50), nullable=False)
    gate_suggestion = db.Column(db.String(50), nullable=True)
    qr_data = db.Column(db.String(500), nullable=True)

class ZoneStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    zone_name = db.Column(db.String(100), unique=True, nullable=False)
    capacity_total = db.Column(db.Integer, default=100)
    capacity_current = db.Column(db.Integer, default=0)
    risk_level = db.Column(db.Integer, default=0) # 0: Low, 1: Med, 2: High
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)

class QueueStatus(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    stall_name = db.Column(db.String(100), unique=True, nullable=False)
    category = db.Column(db.String(50), nullable=False) # 'food', 'toilet', 'parking'
    wait_time_mins = db.Column(db.Integer, default=0)
    is_open = db.Column(db.Boolean, default=True)

class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    alert_type = db.Column(db.String(50), default='info') # 'info', 'emergency', 'event'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
