// FloodGuard / JeevanSetu AI — Data Sources & Telemetry Status Panel

import { useApp } from '../../contexts/AppContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { Database, CheckCircle2, XCircle } from 'lucide-react';

export default function DataSourcesPanel() {
  const { dataMode, weather, weatherError, isOffline } = useApp();

  const sources = [
    {
      name: 'Open-Meteo Weather API',
      type: 'Weather & Forecast',
      status: isOffline ? 'OFFLINE' : weatherError ? 'ERROR' : dataMode === 'LIVE' && weather?.isLive ? 'LIVE' : 'SIMULATED',
      provider: weather?.source || 'Open-Meteo API',
      detail: weatherError ? `Error: ${weatherError}` : dataMode === 'LIVE' ? 'Real-time precipitation & wind via Open-Meteo' : 'Simulated monsoon model',
      connected: !isOffline && !weatherError,
    },
    {
      name: 'OpenStreetMap Cartography',
      type: 'GIS Base Map',
      status: 'LIVE',
      provider: 'OpenStreetMap Tile Network',
      detail: 'Vector road geometry & spatial basemap',
      connected: true,
    },
    {
      name: 'OSRM Routing Engine',
      type: 'Road Navigation',
      status: 'LIVE',
      provider: 'OSRM Driving Router',
      detail: 'Live distance & travel time route calculations',
      connected: true,
    },
    {
      name: 'Nominatim Geocoder',
      type: 'Location Search',
      status: 'LIVE',
      provider: 'OSM Nominatim API',
      detail: 'Address & city coordinate geocoding',
      connected: true,
    },
    {
      name: 'Supabase PostgreSQL',
      type: 'Emergency Database',
      status: isSupabaseConfigured() ? 'LIVE' : 'DEMO MODE',
      provider: 'Supabase Backend',
      detail: isSupabaseConfigured() ? 'Realtime DB connection active' : 'Local memory state (Demo Mode)',
      connected: isSupabaseConfigured(),
    },
    {
      name: 'River Water-Level Sensor Network',
      type: 'Hydrological Telemetry',
      status: dataMode === 'DEMO' ? 'SIMULATED' : 'NOT CONNECTED',
      provider: 'Sutlej River Gauge (Unconnected)',
      detail: dataMode === 'DEMO' ? 'Simulated gauge sensor data (Demo Mode)' : 'No live physical river sensor connected',
      connected: false,
    },
    {
      name: 'Urban Flood Depth Sensors',
      type: 'Street Inundation Sensors',
      status: dataMode === 'DEMO' ? 'SIMULATED' : 'NOT CONNECTED',
      provider: 'City IoT Network (Unconnected)',
      detail: dataMode === 'DEMO' ? 'Simulated street sensor data (Demo Mode)' : 'No live physical street depth sensor connected',
      connected: false,
    },
  ];

  return (
    <div className="bg-white rounded border border-slate-200 p-4 shadow-xs font-sans text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-600" />
          SYSTEM DATA SOURCES & TELEMETRY AUDIT
        </h3>
        <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">
          MODE: {dataMode}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
        {sources.map(s => (
          <div key={s.name} className="bg-slate-50 border border-slate-200 rounded p-2.5 flex items-start justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900">{s.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">({s.type})</span>
              </div>
              <p className="text-[11px] text-slate-600">{s.detail}</p>
              <p className="text-[10px] font-mono text-slate-400">Provider: {s.provider}</p>
            </div>

            <div className="shrink-0 ml-2 text-right">
              {s.status === 'LIVE' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ● LIVE
                </span>
              ) : s.status === 'SIMULATED' || s.status === 'DEMO MODE' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  ● SIMULATED
                </span>
              ) : s.status === 'NOT CONNECTED' ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-300">
                  ○ NOT CONNECTED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded border border-red-300">
                  <XCircle className="w-3 h-3 text-red-600" /> ⚠ {s.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
