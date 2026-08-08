-- FloodGuard AI — Seed Data
-- Matches the demo data used in the frontend.
-- ALL DATA IS SIMULATED for demonstration purposes.

-- Zones
INSERT INTO zones (id, name, latitude, longitude, radius, risk_score, risk_level, rainfall, water_level, drainage_stress, blocked_roads, citizen_reports, forecast_risk) VALUES
('zone-b07', 'B-07 · Ferozepur Road', 30.8950, 75.8420, 800, 89, 'CRITICAL', 82, 2.4, 78, 6, 27, 85),
('zone-a03', 'A-03 · Civil Lines', 30.9120, 75.8550, 700, 72, 'HIGH', 65, 1.8, 62, 3, 14, 70),
('zone-c04', 'C-04 · Dugri', 30.8780, 75.8380, 750, 68, 'HIGH', 58, 1.6, 55, 4, 18, 65),
('zone-d11', 'D-11 · Giaspura', 30.8680, 75.8650, 600, 55, 'MEDIUM', 45, 1.2, 48, 2, 8, 50),
('zone-e02', 'E-02 · Model Town', 30.9180, 75.8700, 650, 35, 'MEDIUM', 35, 0.8, 30, 1, 5, 40),
('zone-f06', 'F-06 · Sarabha Nagar', 30.9050, 75.8780, 550, 22, 'LOW', 28, 0.6, 22, 0, 3, 30),
('zone-g09', 'G-09 · Bhai Randhir Singh Nagar', 30.8850, 75.8900, 700, 75, 'HIGH', 72, 2.0, 68, 5, 22, 75),
('zone-h01', 'H-01 · Pakhowal Road', 30.8920, 75.8250, 800, 62, 'HIGH', 60, 1.5, 58, 3, 12, 62),
('zone-i05', 'I-05 · Haibowal', 30.9250, 75.8350, 650, 40, 'MEDIUM', 40, 1.0, 35, 1, 6, 45),
('zone-j08', 'J-08 · Shimlapuri', 30.9320, 75.8600, 600, 52, 'MEDIUM', 50, 1.3, 52, 2, 10, 55),
('zone-k10', 'K-10 · Jamalpur', 30.9100, 75.8150, 700, 70, 'HIGH', 68, 1.9, 65, 4, 16, 72),
('zone-l12', 'L-12 · Sherpur', 30.9350, 75.8480, 550, 18, 'LOW', 22, 0.4, 18, 0, 2, 25)
ON CONFLICT (id) DO NOTHING;

-- Facilities
INSERT INTO facilities (id, name, type, latitude, longitude, risk_level, status, details) VALUES
('fac-h01', 'DMC Hospital', 'hospital', 30.9040, 75.8510, 'HIGH', 'OPERATIONAL', 'Major trauma center'),
('fac-h02', 'SPS Hospital', 'hospital', 30.8920, 75.8620, 'MEDIUM', 'OPERATIONAL', 'Multi-specialty hospital'),
('fac-h03', 'CMCH Hospital', 'hospital', 30.9150, 75.8480, 'LOW', 'OPERATIONAL', 'Medical college hospital'),
('fac-h04', 'Civil Hospital', 'hospital', 30.9080, 75.8390, 'HIGH', 'OPERATIONAL', 'Government hospital'),
('fac-h05', 'Fortis Hospital', 'hospital', 30.8780, 75.8750, 'LOW', 'OPERATIONAL', 'Private hospital'),
('fac-s01', 'DAV Public School', 'school', 30.8960, 75.8450, 'HIGH', 'OPEN', 'Simulated enrollment: ~1,200'),
('fac-s02', 'BCM School', 'school', 30.9100, 75.8680, 'MEDIUM', 'OPEN', 'Simulated enrollment: ~800'),
('fac-s03', 'Sacred Heart School', 'school', 30.9200, 75.8550, 'LOW', 'OPEN', 'Simulated enrollment: ~1,500'),
('fac-s04', 'Govt. Senior Secondary School', 'school', 30.8870, 75.8350, 'HIGH', 'OPEN', 'Simulated enrollment: ~900'),
('fac-s05', 'Kundan Vidya Mandir', 'school', 30.9280, 75.8420, 'MEDIUM', 'OPEN', 'Simulated enrollment: ~600'),
('fac-sh01', 'Guru Nanak Bhawan (Shelter)', 'shelter', 30.9000, 75.8580, 'LOW', 'ACTIVE', 'Simulated capacity: 500'),
('fac-sh02', 'Community Center Dugri (Shelter)', 'shelter', 30.8750, 75.8400, 'MEDIUM', 'ACTIVE', 'Simulated capacity: 300'),
('fac-sh03', 'Sports Stadium Shelter', 'shelter', 30.9170, 75.8720, 'LOW', 'STANDBY', 'Simulated capacity: 1,000')
ON CONFLICT (id) DO NOTHING;

-- Rescue Teams
INSERT INTO rescue_teams (id, name, latitude, longitude, status, team_size, equipment) VALUES
('team-01', 'Alpha Rescue Unit', 30.9000, 75.8500, 'DEPLOYED', 8, ARRAY['Inflatable Boats', 'Life Jackets', 'First Aid']),
('team-02', 'Bravo Response Team', 30.8880, 75.8380, 'DEPLOYED', 6, ARRAY['Pumps', 'Sandbags', 'Emergency Lights']),
('team-03', 'Charlie Medical Unit', 30.9120, 75.8600, 'AVAILABLE', 5, ARRAY['Ambulance', 'Medical Kits', 'Stretchers']),
('team-04', 'Delta Evacuation Squad', 30.8750, 75.8700, 'DEPLOYED', 10, ARRAY['Buses', 'Tents', 'Water Supplies']),
('team-05', 'Echo Engineering Team', 30.9250, 75.8450, 'AVAILABLE', 7, ARRAY['Heavy Pumps', 'Generators', 'Road Barriers']),
('team-06', 'Foxtrot Drone Unit', 30.9050, 75.8800, 'STANDBY', 4, ARRAY['Surveillance Drones', 'Thermal Cameras', 'Radios']),
('team-07', 'Golf Rescue Divers', 30.8900, 75.8550, 'DEPLOYED', 6, ARRAY['Diving Gear', 'Ropes', 'Life Rafts']),
('team-08', 'Hotel Relief Team', 30.9300, 75.8350, 'AVAILABLE', 12, ARRAY['Food Packets', 'Blankets', 'Water Purifiers']),
('team-09', 'India Communication Unit', 30.9150, 75.8750, 'STANDBY', 3, ARRAY['Satellite Phones', 'Radio Equipment', 'PA Systems'])
ON CONFLICT (id) DO NOTHING;
