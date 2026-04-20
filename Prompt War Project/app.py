import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from models import db, Ticket, ZoneStatus, QueueStatus, Alert
from simulation import init_dummy_data, simulate_data_drift

app = Flask(__name__)
app.config['SECRET_KEY'] = 'stadium_super_secret_key_2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///stadium.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Initialize Database on first run
with app.app_context():
    db.create_all()
    init_dummy_data()

# --- ROUTES ---

@app.route('/')
def index():
    # Redirect to dashboard for zero-step access
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    alerts = Alert.query.order_by(Alert.id.desc()).limit(3).all()
    ticket = Ticket.query.first()
    return render_template('dashboard.html', alerts=alerts, ticket=ticket)

@app.route('/analytics')
def analytics():
    zones = ZoneStatus.query.all()
    return render_template('analytics.html', zones=zones)

@app.route('/navigation')
def navigation():
    ticket = Ticket.query.first()
    return render_template('navigation.html', ticket=ticket)

@app.route('/queues')
def queues():
    food_queues = QueueStatus.query.filter_by(category='food').all()
    washroom_queues = QueueStatus.query.filter_by(category='toilet').all()
    parking_queues = QueueStatus.query.filter_by(category='parking').all()
    return render_template('queues.html', food=food_queues, toilets=washroom_queues, parking=parking_queues)

@app.route('/emergency', methods=['GET', 'POST'])
def emergency():
    if request.method == 'POST':
        msg = request.form.get('message')
        type = request.form.get('type', 'emergency')
        new_alert = Alert(title="GUEST SOS", message=msg, alert_type=type)
        db.session.add(new_alert)
        db.session.commit()
        
        # Return JSON if it's an AJAX request (best effort detection)
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest' or request.is_json or request.form.get('ajax'):
            return jsonify({'status': 'success', 'message': 'Assistance signal deployed.'})
        
        flash('Assistance request sent! Security is on the way.', 'danger')
    return render_template('emergency.html')

@app.route('/admin')
def admin():
    zones = ZoneStatus.query.all()
    queues = QueueStatus.query.all()
    alerts = Alert.query.order_by(Alert.id.desc()).all()
    return render_template('admin.html', zones=zones, queues=queues, alerts=alerts)

# --- API ENDPOINTS FOR AJAX ---

@app.route('/api/status')
def get_status():
    simulate_data_drift()
    zones = ZoneStatus.query.all()
    queues = QueueStatus.query.all()
    alerts = Alert.query.order_by(Alert.id.desc()).limit(5).all()
    
    return jsonify({
        'zones': [{
            'name': z.zone_name,
            'curr': z.capacity_current,
            'total': z.capacity_total,
            'risk': z.risk_level
        } for z in zones],
        'queues': [{
            'name': q.stall_name,
            'wait': q.wait_time_mins,
            'category': q.category
        } for q in queues],
        'alerts': [{
            'title': a.title,
            'msg': a.message,
            'type': a.alert_type,
            'time': a.created_at.strftime('%H:%M')
        } for a in alerts]
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
