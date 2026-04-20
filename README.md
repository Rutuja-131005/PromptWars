# 🏟️ StadiumSmart: Smart Event Experience System

**StadiumSmart** is a premium, real-time event management platform designed to revolutionize the attendee experience at large-scale sporting venues and concerts. Built with a focus on "The Refined Catalyst" dark aesthetic, it combines advanced crowd analytics, smart navigation, and emergency safety features into a single, cohesive dashboard.

## 🚀 Key Features

### 📊 Real-Time Crowd Analytics
*   **Interactive Heatmap:** Visualizes zone occupancy (North, South, East, West stands) in real-time.
*   **AI Occupancy Prediction:** Displays historical and predicted attendance trends using Chart.js.
*   **Risk Level Monitoring:** Automatically flags high-occupancy zones for safety intervention.

### 🕒 Live Queue Tracking
*   **Amenities Monitoring:** Track wait times for food stalls, washrooms, and parking exits.
*   **Smart Refresh:** Data updates every 8 seconds via AJAX without page reloads.
*   **Status Indicators:** Color-coded (Emerald/Amber/Crimson) levels or wait times.

### 🗺️ Smart Navigation
*   **Digital Wayfinding:** Interactive stadium map with Point-of-Interest (POI) markers.
*   **Personalized Routing:** Suggested entry gates and "Find My Seat" logic based on ticket data.
*   **Emergency Exits:** Visual highlighting of current nearest safety routes.

### 🆘 Emergency & Safety
*   **One-Touch SOS:** Instant signal deployment to onsite security and medical teams.
*   **Global Broadcasts:** Administrators can push "Toast" notifications to all users instantly via an integrated alert system.
*   **Facility Reporting:** Direct reporting of security, medical, or facility issues.

### 🛠️ Admin Control Center
*   **System Monitors:** Dashboard for managing crowd flow and facility status.
*   **Live Analytics:** Deep-dive into stadium-wide metrics.
*   **Broadcast Engine:** Smooth interface for deploying real-time announcements to the entire stadium.

---

## 🎨 Design Philosophy: "The Refined Catalyst"
The project uses a premium **Dark Format** design language:
*   **Palette:** Deep Slate (`#0b0e14`) and Charcoal (`#161b22`) backgrounds.
*   **Accents:** Functional emerald, amber, and crimson glows for real-time status.
*   **Glassmorphism:** Frosted dark-glass cards with high-blur backdrops for a sophisticated, state-of-the-art feel.

---

## 🛠️ Tech Stack
*   **Backend:** Python Flask
*   **Database:** SQLite (SQLAlchemy ORM)
*   **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla ES6)
*   **Visualization:** Chart.js, SVG

---

## 📥 Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd stadium-smart
    ```

2.  **Install dependencies:**
    ```bash
    pip install flask flask-sqlalchemy
    ```

3.  **Run the application:**
    ```bash
    python app.py
    ```

4.  **Access the Dashboard:**
    Open `http://127.0.0.1:5000` in your browser.

---

## 🧪 Simulation Engine
The project includes a **Data Drift Engine** (`simulation.py`) that randomly updates crowd levels and queue times every few seconds to demonstrate the platform's real-time interaction capabilities.

---

## 📄 License
This project is for demonstration purposes as part of the **Smart Event Experience** vision.
