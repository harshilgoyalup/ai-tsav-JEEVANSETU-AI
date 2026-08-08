// FloodGuard / JeevanSetu AI — Interactive Operational Flood Map

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../contexts/AppContext';
import { DEFAULT_MAP_ZOOM, RISK_COLORS } from '../../config/constants';
import { explainRisk, type GeminiStructuredResponse } from '../../services/geminiService';
import {
  X, AlertTriangle, Droplets, Construction, Users,
  Route, Bell, Brain, Layers
} from 'lucide-react';
import type { Zone } from '../../types';
import 'leaflet/dist/leaflet.css';

// Component to dynamically re-center Leaflet map when selectedLocation changes
function MapViewController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, DEFAULT_MAP_ZOOM, { animate: true });
  }, [center, map]);
  return null;
}

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function createIcon(emoji: string, size: number = 22) {
  return L.divIcon({
    html: `<span style="font-size:${size}px">${emoji}</span>`,
    className: 'bg-transparent border-0',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export default function FloodMap() {
  const { zones, facilities, rescueTeams, blockedRoads, citizenReports, dataMode, setActivePage, selectedLocation } = useApp();
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<GeminiStructuredResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Layer toggles
  const [layers, setLayers] = useState({
    zones: true,
    hospitals: true,
    schools: true,
    teams: true,
    blockedRoads: true,
    reports: true,
    shelters: true,
  });

  const toggleLayer = (key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleZoneClick = (zone: Zone) => {
    setSelectedZone(zone);
    setAiAnalysis(null);
  };

  const handleExplainRisk = async () => {
    if (!selectedZone) return;
    setAiLoading(true);
    try {
      const resp = await explainRisk(selectedZone);
      setAiAnalysis(resp);
    } catch {
      setAiAnalysis(null);
    }
    setAiLoading(false);
  };

  const hospitals = facilities.filter(f => f.type === 'hospital');
  const schools = facilities.filter(f => f.type === 'school');
  const shelters = facilities.filter(f => f.type === 'shelter');

  const mapCenter: [number, number] = [selectedLocation.latitude, selectedLocation.longitude];

  return (
    <div className="flex-1 flex relative animate-fade-in bg-slate-100 overflow-hidden font-sans">
      {/* Map view */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={DEFAULT_MAP_ZOOM}
          className="h-full w-full"
          zoomControl={true}
        >
          <MapViewController center={mapCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Zones — displayed as simulated overlays or active report overlays */}
          {layers.zones && zones.map(z => (
            <CircleMarker
              key={z.id}
              center={[z.latitude, z.longitude]}
              radius={z.radius / 50}
              pathOptions={{
                color: RISK_COLORS[z.risk_level],
                fillColor: RISK_COLORS[z.risk_level],
                fillOpacity: 0.2,
                weight: 2,
              }}
              eventHandlers={{ click: () => handleZoneClick(z) }}
            >
              <Popup>
                <div className="text-xs">
                  <strong className="text-slate-900">{z.name}</strong><br />
                  <span className="font-semibold text-slate-700">Risk: {z.risk_score}% ({z.risk_level})</span><br />
                  <span className="text-[10px] text-slate-500">{z.rainfall}mm rain · {z.water_level}m water</span>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Hospitals */}
          {layers.hospitals && hospitals.map(h => (
            <Marker key={h.id} position={[h.latitude, h.longitude]} icon={createIcon('🏥', 20)}>
              <Popup><div className="text-xs"><strong>{h.name}</strong><br />Status: {h.status}<br /><span className="text-[10px] text-slate-500 font-mono">SIMULATED FACILITY TELEMETRY</span></div></Popup>
            </Marker>
          ))}

          {/* Schools */}
          {layers.schools && schools.map(s => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={createIcon('🏫', 20)}>
              <Popup><div className="text-xs"><strong>{s.name}</strong><br />{s.details}<br /><span className="text-[10px] text-slate-500 font-mono">SIMULATED FACILITY TELEMETRY</span></div></Popup>
            </Marker>
          ))}

          {/* Shelters */}
          {layers.shelters && shelters.map(s => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={createIcon('⛺', 20)}>
              <Popup><div className="text-xs"><strong>{s.name}</strong><br />Status: {s.status}</div></Popup>
            </Marker>
          ))}

          {/* Rescue teams */}
          {layers.teams && rescueTeams.map(t => (
            <Marker key={t.id} position={[t.latitude, t.longitude]} icon={createIcon('🚑', 20)}>
              <Popup><div className="text-xs"><strong>{t.name}</strong><br />Status: {t.status}<br />Team Size: {t.team_size}</div></Popup>
            </Marker>
          ))}

          {/* Blocked roads */}
          {layers.blockedRoads && blockedRoads.filter(r => r.status !== 'CLEARED').map(r => (
            <Marker key={r.id} position={[r.latitude, r.longitude]} icon={createIcon('🚧', 18)}>
              <Popup>
                <div className="text-xs">
                  <strong>{r.road_name}</strong><br />
                  <span className="text-red-600 font-semibold">{r.severity} BLOCKAGE</span><br />
                  <span className="text-[10px] text-slate-500 font-mono">SOURCE: {r.source || 'USER REPORTED'}</span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Citizen reports */}
          {layers.reports && citizenReports.map(r => (
            <Marker key={r.id} position={[r.latitude, r.longitude]} icon={createIcon('📍', 16)}>
              <Popup>
                <div className="text-xs">
                  <strong>{r.location_name}</strong><br />
                  <span>{r.report_type} · {r.severity}</span><br />
                  <span className="text-[10px] text-slate-500">{r.description}</span><br />
                  <span className="text-[10px] text-blue-600 font-mono">USER REPORTED</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Layer Controls Panel */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 border border-slate-300 rounded p-3 shadow-md backdrop-blur-xs text-slate-900 w-44">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" /> Map Layers
          </p>
          <div className="space-y-1 text-xs">
            {[
              { key: 'zones', label: 'Flood Sectors', icon: '🔴' },
              { key: 'hospitals', label: 'Hospitals', icon: '🏥' },
              { key: 'schools', label: 'Schools', icon: '🏫' },
              { key: 'teams', label: 'Rescue Teams', icon: '🚑' },
              { key: 'blockedRoads', label: 'Blocked Roads', icon: '🚧' },
              { key: 'reports', label: 'Citizen Reports', icon: '📍' },
              { key: 'shelters', label: 'Relief Shelters', icon: '⛺' },
            ].map(l => (
              <label key={l.key} className="flex items-center gap-2 cursor-pointer py-0.5 hover:text-blue-700">
                <input
                  type="checkbox"
                  checked={layers[l.key as keyof typeof layers]}
                  onChange={() => toggleLayer(l.key as keyof typeof layers)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>{l.icon} {l.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 border border-slate-300 rounded p-2.5 shadow-md text-slate-900 text-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">Risk Severity Legend</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" />CRITICAL</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" />HIGH</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" />MEDIUM</div>
            <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />LOW</div>
          </div>
        </div>
      </div>

      {/* Zone Detail Side Panel */}
      {selectedZone && (
        <div className="w-[360px] bg-white border-l border-slate-300 overflow-y-auto shrink-0 shadow-lg flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className={`p-4 border-b border-slate-200 ${
              selectedZone.risk_level === 'CRITICAL' ? 'bg-red-50' :
              selectedZone.risk_level === 'HIGH' ? 'bg-orange-50' :
              selectedZone.risk_level === 'MEDIUM' ? 'bg-amber-50' : 'bg-emerald-50'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  selectedZone.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' :
                  selectedZone.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                  selectedZone.risk_level === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                  'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {selectedZone.risk_level} SECTOR
                </span>
                <button onClick={() => setSelectedZone(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedZone.name}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-extrabold text-slate-900">{selectedZone.risk_score}%</span>
                <span className="text-xs text-slate-500 font-medium">Calculated Risk Index</span>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="p-4 grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-[10px] font-bold uppercase">Precipitation</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{selectedZone.rainfall} mm</p>
                <span className="text-[9px] text-emerald-700 font-mono font-bold">
                  {dataMode === 'LIVE' ? '● LIVE: OPEN-METEO' : '● SIMULATED'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[10px] font-bold uppercase">Water Telemetry</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{selectedZone.water_level} m</p>
                <span className="text-[9px] text-amber-700 font-mono font-bold">
                  {dataMode === 'LIVE' ? '● UNAVAILABLE' : '● SIMULATED SENSOR'}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Construction className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-[10px] font-bold uppercase">Road Blocks</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{selectedZone.blocked_roads} locations</p>
                <span className="text-[9px] text-slate-500 font-mono">USER & MODEL DATA</span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-[10px] font-bold uppercase">Citizen Reports</span>
                </div>
                <p className="text-sm font-bold text-slate-900">{selectedZone.citizen_reports} reports</p>
                <span className="text-[9px] text-blue-700 font-mono font-bold">● USER REPORTED</span>
              </div>
            </div>

            {/* AI Decision Analysis button */}
            <div className="px-4 pb-4 space-y-3">
              <button
                onClick={handleExplainRisk}
                disabled={aiLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs py-2 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <Brain className="w-4 h-4 text-blue-600" />
                {aiLoading ? 'Analyzing Sector Data...' : 'Generate Decision Support Report'}
              </button>

              {aiAnalysis && (
                <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                    <span className="font-extrabold text-[10px] text-slate-600 uppercase">JeevanSetu AI Analysis</span>
                    <span className="text-[9px] font-bold text-slate-500 font-mono">CONFIDENCE: {aiAnalysis.confidence}</span>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] text-slate-500 uppercase block">SITUATION</span>
                    <p className="text-slate-900 font-semibold">{aiAnalysis.situation}</p>
                  </div>
                  <div>
                    <span className="font-bold text-[10px] text-slate-500 uppercase block">RECOMMENDED ACTION</span>
                    <p className="text-emerald-800 font-semibold whitespace-pre-line">{aiAnalysis.action}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50">
            <button
              onClick={() => setActivePage('routing')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-xs py-2 rounded hover:bg-emerald-700 transition-colors"
            >
              <Route className="w-3.5 h-3.5" />
              Calculate Safe Rescue Route
            </button>
            <button
              onClick={() => setActivePage('alerts')}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold text-xs py-2 rounded hover:bg-red-700 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              Issue Targeted Sector Alert
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
