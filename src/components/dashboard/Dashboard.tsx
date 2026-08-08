// FloodGuard / JeevanSetu AI — Operational Command Dashboard

import { useApp } from '../../contexts/AppContext';
import { timeAgo } from '../../utils/formatters';
import DataSourcesPanel from '../common/DataSourcesPanel';
import {
  AlertTriangle, Droplets, Thermometer, Wind, MapPin,
  Users, Truck, Construction, Building2,
  CloudRain, CheckCircle2, Info, Compass, XCircle
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';

export default function Dashboard() {
  const { zones, weather, weatherError, overallRisk, facilities, rescueTeams, blockedRoads, citizenReports, isOffline, dataMode, selectedLocation } = useApp();

  const criticalZones = zones.filter(z => z.risk_level === 'CRITICAL');
  const highZones = zones.filter(z => z.risk_level === 'HIGH');
  const activeTeams = rescueTeams.filter(t => t.status === 'DEPLOYED');
  const activeBlockedRoads = blockedRoads.filter(r => r.status !== 'CLEARED');

  // Breakdown of risk factors with explicit data source tags
  const factorRows = overallRisk ? [
    {
      name: 'Precipitation Volume',
      weight: '30%',
      val: Math.round(overallRisk.normalizedFactors.rainfall),
      rawVal: weather ? `${weather.rainfall} mm/3hr` : `${Math.round(overallRisk.factors.rainfall)} mm/3hr`,
      sourceTag: overallRisk.factorSources.rainfall,
    },
    {
      name: 'Monsoon Forecast Risk',
      weight: '15%',
      val: Math.round(overallRisk.normalizedFactors.forecastRisk),
      rawVal: `${Math.round(overallRisk.factors.forecastRisk)}% risk`,
      sourceTag: overallRisk.factorSources.forecastRisk,
    },
    {
      name: 'Water Level Telemetry',
      weight: '25%',
      val: dataMode === 'LIVE' ? 0 : Math.round(overallRisk.normalizedFactors.waterLevel),
      rawVal: dataMode === 'LIVE' ? 'No sensor connected' : `${overallRisk.factors.waterLevel.toFixed(1)} m`,
      sourceTag: overallRisk.factorSources.waterLevel,
    },
    {
      name: 'Drainage Discharge Capacity',
      weight: '20%',
      val: Math.round(overallRisk.normalizedFactors.drainageStress),
      rawVal: `${Math.round(overallRisk.factors.drainageStress)}% capacity`,
      sourceTag: overallRisk.factorSources.drainageStress,
    },
    {
      name: 'Verified Citizen Reports',
      weight: '10%',
      val: Math.round(overallRisk.normalizedFactors.citizenReports),
      rawVal: `${citizenReports.length} reports`,
      sourceTag: overallRisk.factorSources.citizenReports,
    },
  ] : [];

  // Hourly forecast graph data
  const forecastData = weather?.hourlyForecast?.slice(0, 12).map(h => ({
    time: new Date(h.time).toLocaleTimeString('en-IN', { hour: '2-digit', hour12: true }),
    rain: h.precipitation,
    prob: h.precipitationProbability ?? 0,
  })) || [];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-900 font-sans">
      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-300 rounded p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">LIMITED CONNECTIVITY MODE ACTIVE</p>
            <p>Displaying last synchronized data. Live API queries are paused.</p>
          </div>
        </div>
      )}

      {/* Live Mode API Error Banner */}
      {weatherError && dataMode === 'LIVE' && (
        <div className="bg-red-50 border border-red-300 rounded p-3 flex items-center gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="text-xs text-red-900">
            <p className="font-bold">LIVE WEATHER API ERROR</p>
            <p>{weatherError}. Demo data is NOT substituted automatically in Live mode.</p>
          </div>
        </div>
      )}

      {/* Location Banner & Overview Header */}
      <div className="bg-white border border-slate-200 rounded p-3.5 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600" />
            FLOOD INTELLIGENCE & DISASTER COMMAND — {selectedLocation.name.toUpperCase()}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active Monitoring Region: {selectedLocation.name} {selectedLocation.state ? `(${selectedLocation.state}, ${selectedLocation.country || 'India'})` : ''} · Coordinates: {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-1 rounded font-bold border uppercase tracking-wider ${
            dataMode === 'LIVE'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-amber-50 border-amber-300 text-amber-800'
          }`}>
            {dataMode === 'LIVE' ? '● LIVE MODE ACTIVE' : '● DEMO MODE ACTIVE'}
          </span>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Risk Score Card */}
        <div className="col-span-4 bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Flood Risk Index ({selectedLocation.name})</span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded border uppercase ${
                overallRisk?.level === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                overallRisk?.level === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                overallRisk?.level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {overallRisk?.level || 'LOW'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-3">
              <span className={`text-4xl font-extrabold tracking-tight ${
                overallRisk?.level === 'CRITICAL' ? 'text-red-600' :
                overallRisk?.level === 'HIGH' ? 'text-orange-600' :
                overallRisk?.level === 'MEDIUM' ? 'text-amber-600' :
                'text-emerald-600'
              }`}>
                {overallRisk?.score || 0}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ 100 Risk Index</span>
            </div>

            {/* Risk factors table */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Weighted Factor Telemetry Breakdown
              </p>
              {factorRows.map(row => (
                <div key={row.name} className="text-xs">
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span className="truncate">{row.name} <span className="text-slate-400">({row.weight})</span></span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-slate-900">{row.rawVal}</span>
                      <SourceBadge tag={row.sourceTag} />
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded mt-1 overflow-hidden">
                    <div
                      className={`h-full ${
                        row.val > 70 ? 'bg-red-600' : row.val > 40 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, row.val)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>{overallRisk?.confidenceDisclaimer}</span>
          </div>
        </div>

        {/* Real Open-Meteo Weather Card */}
        <div className="col-span-4 bg-white rounded border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Weather Telemetry</h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {selectedLocation.name} · {selectedLocation.latitude.toFixed(4)}° N, {selectedLocation.longitude.toFixed(4)}° E
                </p>
              </div>
              <SourceBadge tag={weather?.isLive ? 'LIVE' : 'SIMULATED'} label={weather?.source || 'Open-Meteo'} />
            </div>

            {weather ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <CloudRain className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-xl font-bold text-slate-900">{weather.rainfall} mm</p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase">Precip (3-hr Window)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Thermometer className="w-6 h-6 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-xl font-bold text-slate-900">{weather.temperature}°C</p>
                      <p className="text-[10px] font-semibold text-slate-500 uppercase">Temperature</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{weather.windSpeed} km/h</p>
                      <p className="text-[10px] text-slate-500">Wind Velocity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">{weather.humidity}%</p>
                      <p className="text-[10px] text-slate-500">Relative Humidity</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Condition: <strong className="text-slate-900">{weather.condition}</strong></span>
                  <span className="text-[10px] text-slate-400 font-mono">Updated {timeAgo(weather.lastUpdated)}</span>
                </div>
              </div>
            ) : (
              <div className="h-40 flex items-center justify-center text-xs text-slate-400">Fetching Open-Meteo API for {selectedLocation.name}...</div>
            )}
          </div>

          <div className="mt-3 bg-blue-50 border border-blue-200 rounded p-2.5 text-[11px] text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Open-Meteo API requested dynamically for coordinates {selectedLocation.latitude.toFixed(2)}, {selectedLocation.longitude.toFixed(2)}.</span>
          </div>
        </div>

        {/* Operational Indicators */}
        <div className="col-span-4 grid grid-cols-2 gap-3">
          <OperationalStatCard title="Active Sectors" count={zones.length} icon={<MapPin className="w-4 h-4 text-blue-600" />} />
          <OperationalStatCard title="High / Critical" count={criticalZones.length + highZones.length} icon={<AlertTriangle className="w-4 h-4 text-red-600" />} isCritical={criticalZones.length > 0} />
          <OperationalStatCard title="Blocked Roads" count={activeBlockedRoads.length} icon={<Construction className="w-4 h-4 text-amber-600" />} />
          <OperationalStatCard title="Monitored Facilities" count={facilities.length} icon={<Building2 className="w-4 h-4 text-slate-600" />} />
          <OperationalStatCard title="Deployed Teams" count={activeTeams.length} icon={<Truck className="w-4 h-4 text-emerald-600" />} />
          <OperationalStatCard title="Citizen Reports" count={citizenReports.length} icon={<Users className="w-4 h-4 text-indigo-600" />} />
        </div>
      </div>

      {/* System Data Sources Panel (Prompt item #17) */}
      <DataSourcesPanel />

      {/* Operational Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Open-Meteo Hourly Forecast */}
        <div className="col-span-6 bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Open-Meteo Hourly Forecast ({selectedLocation.name})</h3>
            <span className="text-[10px] text-slate-400 font-mono">24-Hour Window</span>
          </div>
          {forecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={forecastData}>
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12, color: '#0f172a' }} />
                <Area type="monotone" dataKey="rain" stroke="#2563eb" fill="#eff6ff" strokeWidth={2} name="Precipitation (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-slate-400">Loading forecast chart...</div>
          )}
        </div>

        {/* Sector Risk Bar Chart */}
        <div className="col-span-6 bg-white rounded border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Sector Risk Distribution</h3>
            <span className="text-[10px] text-slate-400 font-mono">{zones.length} Sectors</span>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={zones.map(z => ({ name: z.name.split('·')[0].trim(), score: z.risk_score, level: z.risk_level }))}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={{ stroke: '#cbd5e1' }} tickLine={false} domain={[0, 100]} width={28} />
              <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 4, fontSize: 12 }} />
              <Bar dataKey="score" name="Risk Score" radius={[2, 2, 0, 0]}>
                {zones.map((z, i) => (
                  <Cell key={i} fill={
                    z.risk_level === 'CRITICAL' ? '#dc2626' :
                    z.risk_level === 'HIGH' ? '#ea580c' :
                    z.risk_level === 'MEDIUM' ? '#f59e0b' : '#16a34a'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function OperationalStatCard({ title, count, icon, isCritical }: { title: string; count: number; icon: React.ReactNode; isCritical?: boolean }) {
  return (
    <div className={`bg-white rounded border p-3 shadow-xs ${isCritical ? 'border-red-300 bg-red-50/40' : 'border-slate-200'}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {icon}
      </div>
      <p className={`text-2xl font-extrabold ${isCritical ? 'text-red-700' : 'text-slate-900'}`}>{count}</p>
    </div>
  );
}

function SourceBadge({ tag, label }: { tag: string; label?: string }) {
  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  if (tag === 'LIVE') bg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (tag === 'USER_REPORTED') bg = 'bg-blue-100 text-blue-800 border-blue-300';
  if (tag === 'SIMULATED') bg = 'bg-amber-100 text-amber-800 border-amber-300';
  if (tag === 'UNAVAILABLE') bg = 'bg-slate-100 text-slate-500 border-slate-300';

  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider shrink-0 ${bg}`}>
      ● {label ? `${tag}: ${label}` : tag}
    </span>
  );
}
