/**
 * Smart Event Experience System - Core JS
 * handles real-time updates and UI interactions with robust error handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    const POLLING_INTERVAL = 8000; // 8 seconds
    let lastAlertCount = 0;

    // --- 1. LIVE DATA POLLING ---
    
    function refreshData() {
        // Only poll if we have containers to update to save bandwidth
        if (!document.getElementById('alerts-container') && 
            !document.getElementById('crowd-heatmap') && 
            !document.getElementById('food-list')) {
            return;
        }

        fetch('/api/status')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                updateUI(data);
                checkNewAlerts(data.alerts);
            })
            .catch(err => {
                console.error('Connection Error:', err);
                // Fail silently for polling to not annoy user, but log it
            });
    }

    setInterval(refreshData, POLLING_INTERVAL);
    refreshData();

    // --- 2. UI ORCHESTRATION ---

    function updateUI(data) {
        const indicator = document.querySelector('.live-indicator');
        if (indicator) indicator.classList.add('pulse');

        // A. Alerts (Dashboard)
        const alertList = document.getElementById('alerts-container');
        if (alertList && data.alerts) {
            alertList.innerHTML = data.alerts.map(alert => `
                <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; gap: 16px; align-items: center;">
                    <div style="width: 10px; height: 10px; border-radius: 50%;" class="bg-${getAlertClass(alert.type)}"></div>
                    <div style="flex: 1;">
                        <h4 style="font-size: 0.95rem; font-weight: 600;">${alert.title}</h4>
                        <p style="font-size: 0.85rem; color: var(--text-secondary);">${alert.msg}</p>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">${alert.time}</span>
                </div>
            `).join('');
        }

        // B. Heatmap (Analytics)
        if (document.getElementById('crowd-heatmap') && data.zones) {
            data.zones.forEach(zone => {
                const pathId = `zone-${zone.name.replace(/\s+/g, '-')}`;
                const path = document.getElementById(pathId);
                if (path) {
                    const levelClass = zone.risk === 2 ? 'busy' : (zone.risk === 1 ? 'medium' : 'free');
                    const colors = { 'free': '#10b981', 'medium': '#f59e0b', 'busy': '#ef4444' };
                    path.setAttribute('fill', colors[levelClass]);
                }
            });
            
            const statsList = document.getElementById('zone-stats-list');
            if (statsList) {
                statsList.innerHTML = data.zones.map(z => {
                    const levelClass = z.risk === 2 ? 'busy' : (z.risk === 1 ? 'medium' : 'free');
                    const percent = Math.round((z.curr / z.total) * 100);
                    return `
                    <div class="zone-stat-item" style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span style="font-weight: 500; font-size: 0.9rem;">${z.name}</span>
                            <span class="text-${levelClass}" style="font-weight: 700;">${percent}%</span>
                        </div>
                        <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden;">
                            <div style="width: ${percent}%; height: 100%; transition: width 1s ease-in-out;" class="bg-${levelClass}"></div>
                        </div>
                    </div>`;
                }).join('');
            }
        }

        // C. Queues (Queues Page)
        if (document.getElementById('food-list') && data.queues) {
            const grouped = data.queues.reduce((acc, q) => {
                if (!acc[q.category]) acc[q.category] = [];
                acc[q.category].push(q);
                return acc;
            }, {});

            const lists = { 'food': 'food-list', 'toilet': 'toilet-list', 'parking': 'parking-list' };
            Object.keys(lists).forEach(cat => {
                const el = document.getElementById(lists[cat]);
                if (el && grouped[cat]) {
                    el.innerHTML = grouped[cat].map(q => {
                        const level = q.wait > 15 ? 'busy' : (q.wait > 8 ? 'medium' : 'free');
                        return cat === 'food' ? `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.05);">
                                <div><h4 style="font-size: 1rem;">${q.name}</h4><span style="font-size: 0.8rem; color: var(--text-secondary);">Live Tracking</span></div>
                                <div class="text-${level}" style="font-size: 1.4rem; font-weight: 700;">${q.wait}<span style="font-size: 0.8rem;">m</span></div>
                            </div>` : `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.9rem;">
                                <span style="color: var(--text-secondary);">${q.name}</span>
                                <strong class="text-${level}">${q.wait}m</strong>
                            </div>`;
                    }).join('');
                }
            });
        }
    }

    // --- 3. TOASTS & ALERTS ---

    function showToast(title, msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'glass toast';
        const colors = { 'info': '#d29922', 'emergency': '#ef4444', 'event': '#10b981' };
        toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
        toast.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-size: 0.75rem; text-transform: uppercase; color: ${colors[type]}; font-weight: 700;">${type} alert</span>
                <span style="font-size: 0.95rem; font-weight: 600;">${title}</span>
                <p style="font-size: 0.8rem; color: var(--text-secondary);">${msg}</p>
            </div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 5000);
    }

    function checkNewAlerts(alerts) {
        if (!alerts || alerts.length === 0) return;
        if (lastAlertCount === 0) { lastAlertCount = alerts.length; return; }
        if (alerts.length > lastAlertCount) {
            showToast(alerts[0].title, alerts[0].msg, alerts[0].type);
            lastAlertCount = alerts.length;
        }
    }

    function getAlertClass(type) {
        return ['free', 'medium', 'busy'].includes(type) ? type : (type === 'emergency' ? 'busy' : 'medium');
    }

    // --- 4. AJAX ACTIONS ---

    // Admin Broadcast
    const adminForm = document.getElementById('adminBroadcastForm');
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(adminForm);
            formData.append('ajax', 'true');
            fetch('/emergency', { 
                method: 'POST', 
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            })
            .then(res => res.json())
            .then(data => {
                showToast('Broadcast Sent', 'Your message has been deployed.', 'event');
                adminForm.reset();
            })
            .catch(err => console.error(err));
        });
    }

    // SOS Trigger
    const sosTrigger = document.getElementById('sosTrigger');
    if (sosTrigger) {
        sosTrigger.addEventListener('click', () => {
            if (confirm('Deploy emergency assistance signal?')) {
                const formData = new FormData();
                formData.append('message', 'IMMEDIATE SOS SIGNAL FROM GUEST');
                formData.append('type', 'emergency');
                formData.append('ajax', 'true');
                fetch('/emergency', { 
                    method: 'POST', 
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' }
                })
                .then(res => res.json())
                .then(data => showToast('SOS CONFIRMED', 'Emergency teams are responding.', 'emergency'))
                .catch(err => console.error(err));
            }
        });
    }
});
