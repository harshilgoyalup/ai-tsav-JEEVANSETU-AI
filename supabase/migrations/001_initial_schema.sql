-- FloodGuard AI — Initial Database Schema
-- Run this migration in your Supabase SQL editor

-- Zones table
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius INTEGER DEFAULT 600,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level TEXT DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  rainfall DOUBLE PRECISION DEFAULT 0,
  water_level DOUBLE PRECISION DEFAULT 0,
  drainage_stress DOUBLE PRECISION DEFAULT 0,
  blocked_roads INTEGER DEFAULT 0,
  citizen_reports INTEGER DEFAULT 0,
  forecast_risk DOUBLE PRECISION DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Citizen reports table
CREATE TABLE IF NOT EXISTS citizen_reports (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  report_type TEXT NOT NULL CHECK (report_type IN ('waterlogging', 'blocked_road', 'rising_water', 'drain_overflow', 'vehicle_stranded')),
  severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  description TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  zone_id TEXT REFERENCES zones(id),
  severity TEXT NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'WATCH', 'RESOLVED')),
  target_audience TEXT[] DEFAULT '{}',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'DISPATCHED', 'EXPIRED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rescue teams table
CREATE TABLE IF NOT EXISTS rescue_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  status TEXT DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'DEPLOYED', 'RETURNING', 'STANDBY')),
  team_size INTEGER DEFAULT 5,
  equipment TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hospital', 'school', 'residential', 'industrial', 'shelter')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  risk_level TEXT DEFAULT 'LOW' CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT DEFAULT 'OPERATIONAL',
  details TEXT
);

-- Blocked roads table
CREATE TABLE IF NOT EXISTS blocked_roads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  road_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  severity TEXT DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  status TEXT DEFAULT 'REPORTED' CHECK (status IN ('REPORTED', 'CONFIRMED', 'CLEARED')),
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_zones_risk ON zones(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_reports_created ON citizen_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocked_roads_status ON blocked_roads(status);

-- Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE citizen_reports;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE zones;

-- Row Level Security (basic — allow public read, authenticated write)
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizen_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE rescue_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_roads ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public read reports" ON citizen_reports FOR SELECT USING (true);
CREATE POLICY "Public read alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON rescue_teams FOR SELECT USING (true);
CREATE POLICY "Public read facilities" ON facilities FOR SELECT USING (true);
CREATE POLICY "Public read roads" ON blocked_roads FOR SELECT USING (true);

-- Allow anonymous inserts for citizen reports (prototype)
CREATE POLICY "Anon insert reports" ON citizen_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon insert alerts" ON alerts FOR INSERT WITH CHECK (true);
