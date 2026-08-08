# JeevanSetu AI — Real-Time Flood Intelligence & Emergency Operations System

[![System Status](https://img.shields.io/badge/System-Operational-16a34a?style=flat-square)](http://localhost:5175/)
[![React](https://img.shields.io/badge/Frontend-React_19_+_TypeScript-2563eb?style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Build-Vite-646cff?style=flat-square)](https://vitejs.dev/)
[![Firebase Auth](https://img.shields.io/badge/Auth-Firebase_(`ai--tsav`)-ffca28?style=flat-square)](https://firebase.google.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e?style=flat-square)](https://supabase.com/)
[![Open-Meteo](https://img.shields.io/badge/Weather-Open--Meteo_Live_API-0284c7?style=flat-square)](https://open-meteo.com/)

**JeevanSetu AI (FloodGuard AI)** is a high-density, professional **Disaster Management Command Center** engineered for Punjab and India. The application integrates live weather telemetry, real-time spatial routing, deterministic flood risk modeling, citizen field reports, and AI decision-support to demonstrate an end-to-end emergency response workflow.

---

## 🌟 Key Features & Architecture

### 1. 🛡️ Compulsory Firebase Authentication Portal
* **Project**: `ai-tsav`
* **Compulsory Security Gateway**: All users must authenticate before accessing emergency command tools.
* **Authentication Options**:
  * Operator Email & Password authentication / Registration
  * Passwordless Magic Link OTPs
  * Google OAuth Sign-in
  * Quick Demo Operator Access (Anonymous Firebase Auth)

### 2. 🌍 Dynamic Location Telemetry & Open-Meteo Integration
* **Dynamic Location Selector**: Switch monitoring between preset Punjab regions (**Ludhiana**, **Amritsar**, **Jalandhar**, **Patiala**, **Chandigarh**, **Delhi**) or search any city globally via Nominatim.
* **Live Weather Telemetry**: Direct Open-Meteo API requests (`https://api.open-meteo.com/v1/forecast`) for the selected location's exact coordinates (`latitude`, `longitude`).
* **Telemetry Metrics**: Real precipitation volume (3-hr window), temperature, wind speed, relative humidity, and 24-hour precipitation probability forecast.

### 3. ⚖️ Transparent Deterministic Risk Engine
* **Mathematical Risk Score**: Computes a 0–100 risk index for monitored sectors based on weighted inputs:
  $$\text{Risk Score} = 0.30(\text{Rainfall}) + 0.25(\text{Water Level}) + 0.20(\text{Drainage Stress}) + 0.15(\text{Forecast Risk}) + 0.10(\text{Citizen Reports})$$
* **Data Availability & Confidence**: Clearly distinguishes LIVE telemetry from UNAVAILABLE physical sensors (e.g., river water level) and includes explicit data confidence disclaimers (`DATA CONFIDENCE: LIMITED`).

### 4. 🔍 System Data Sources & Audit Panel
* Audits every API and sensor feed in real time:
  * 🟢 **Open-Meteo Weather API** (`● LIVE`)
  * 🟢 **OpenStreetMap Cartography** (`● LIVE`)
  * 🟢 **OSRM Rescue Routing Engine** (`● LIVE`)
  * 🟢 **Nominatim Geocoding API** (`● LIVE`)
  * 🔵 **Supabase Emergency Database** (`● USER REPORTED / LIVE`)
  * ⚪ **River Water-Level Telemetry** (`○ NOT CONNECTED / UNAVAILABLE`)

### 5. 🗺️ OSRM Rescue Routing & Interactive Leaflet Map
* **OSRM Routing Engine**: Calculates driving geometries, travel distances, and durations via OSRM (`router.project-osrm.org`).
* **Flood Risk Overlay**: Evaluates candidate routes against active sector risk levels and known road blockages to recommend safe access corridors to trauma centers (e.g., DMC Hospital).
* **Interactive Map**: OpenStreetMap Leaflet layer toggles for risk sectors, hospitals, schools, rescue teams, road blockages, and citizen reports.

### 6. 🤖 JeevanSetu AI Decision Assistant Console
* Powered by Google Gemini AI (via Supabase Edge Functions / custom API keys).
* Formats reasoning outputs into structured action reports:
  * **SITUATION**: High-level sector summary.
  * **EVIDENCE**: Quantitative telemetry and blockage counts.
  * **DATA CONFIDENCE**: Explicit telemetry reliability tag.
  * **LIMITATION**: Disclaims missing physical river sensors.
  * **RECOMMENDED ACTION**: Concrete operational recommendations for emergency crews.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS v4, Lucide React Icons, JetBrains Mono |
| **Data Visualization** | Recharts (Area & Bar Charts) |
| **Spatial Mapping** | Leaflet, React-Leaflet, OpenStreetMap |
| **Weather Telemetry** | Open-Meteo Forecast API |
| **Routing & Geocoding** | OSRM Driving Router API, Nominatim API |
| **Authentication** | Firebase Authentication (`ai-tsav`) |
| **Backend & Realtime** | Supabase PostgreSQL (`kdndbqxcrpqdxsgszlsy`) |
| **AI Reasoning Layer** | Google Gemini API (via Supabase Edge Functions) |

---

## 🚀 Getting Started

### 1. Prerequisites
* Node.js v18+ and `npm` installed.

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone git@github.com:harshilgoyalup/ai-tsav-JEEVANSETU-AI.git
cd ai-tsav-JEEVANSETU-AI
npm install
```

### 3. Environment Configuration (`.env`)
Create or verify your `.env` file in the root directory:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://kdndbqxcrpqdxsgszlsy.supabase.co
VITE_SUPABASE_ANON_KEY=9hLZ2tW9OZTqlfH3TS1JXlBmIHoxNPmMDhJA-ymZM8A
VITE_SUPABASE_CLIENT_ID=4b0ae14c-5978-4cd8-8e7e-53b2f55a23c5

# Gemini Model
VITE_GEMINI_MODEL=gemini-2.0-flash
```

### 4. Development Server
Run the local Vite development server:
```bash
npm run dev
```
Open [http://localhost:5175](http://localhost:5175) in your browser.

### 5. Production Build
To create an optimized production bundle:
```bash
npm run build
```

---

## 📁 Repository Structure

```text
ai-tsav-JEEVANSETU-AI/
├── public/                     # Static assets & icons
├── src/
│   ├── assets/                 # Brand assets
│   ├── components/             # React UI Components
│   │   ├── alerts/             # Emergency Alert Dispatcher
│   │   ├── assistant/          # JeevanSetu AI Decision Console
│   │   ├── auth/               # Firebase Login Gateway
│   │   ├── common/             # LocationSelector, DataSourcesPanel, SettingsModal, AuthModal
│   │   ├── dashboard/          # Command Center Main Overview
│   │   ├── layout/             # Header & Sidebar Navigation
│   │   ├── map/                # Interactive Leaflet Flood Map
│   │   ├── reports/            # Citizen Incident Log
│   │   ├── routing/            # OSRM Rescue Routing Console
│   │   ├── simulation/         # Monsoon Scenario Simulator
│   │   └── status/             # Infrastructure Health Monitor
│   ├── config/                 # Firebase config & application constants
│   ├── contexts/               # AppContext (Global State & Auth)
│   ├── data/                   # Demonstration sector & facility datasets
│   ├── services/               # Weather, Routing, Geocoding, Supabase, Firebase & Risk Engine
│   ├── types/                  # TypeScript Interface definitions
│   ├── utils/                  # Date & number formatters
│   ├── App.tsx                 # Application Shell & Auth Wall
│   ├── index.css               # Tailwind CSS Operational Theme
│   └── main.tsx                # Entry point
├── supabase/                   # SQL Migrations & Edge Functions
├── README.md                   # Project Documentation
└── package.json                # Dependencies & Build Scripts
```

---

## 📜 License & Attribution

Developed for **Punjab Flood Response & Emergency Intelligence Competition**.  
* Map data & Geocoding: &copy; [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors  
* Weather Telemetry: [Open-Meteo](https://open-meteo.com/)  
* Routing Engine: [OSRM](http://project-osrm.org/)
