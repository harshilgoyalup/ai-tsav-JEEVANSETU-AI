// FloodGuard / JeevanSetu AI — Monsoon Flood Scenario Simulator

import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { calculateFloodRisk, getRiskLevel } from '../../services/riskEngine';
import { Sliders, RotateCcw, AlertTriangle, Waves, Filter, CloudRain } from 'lucide-react';

export default function FloodSimulator() {
  const { zones, updateZoneSimulation, dataMode } = useApp();

  const [rainfall, setRainfall] = useState(80);
  const [waterLevel, setWaterLevel] = useState(2.0);
  const [drainageCapacity, setDrainageCapacity] = useState(40);
  const [forecastRisk, setForecastRisk] = useState(70);

  const simResult = calculateFloodRisk({
    rainfall,
    waterLevel,
    drainageStress: 100 - drainageCapacity,
    forecastRisk,
    citizenReports: 15,
  }, dataMode);

  const simulatedZones = zones.map(z => {
    const scaleFactor = simResult.score / 60;
    const adjScore = Math.min(100, Math.round(z.risk_score * scaleFactor));
    return { ...z, risk_score: adjScore, risk_level: getRiskLevel(adjScore) };
  });

  const critical = simulatedZones.filter(z => z.risk_level === 'CRITICAL').length;
  const high = simulatedZones.filter(z => z.risk_level === 'HIGH').length;
  const medium = simulatedZones.filter(z => z.risk_level === 'MEDIUM').length;
  const low = simulatedZones.filter(z => z.risk_level === 'LOW').length;

  const handleApply = () => {
    const updates: Record<string, any> = {};
    zones.forEach(z => {
      const scale = rainfall / 80;
      updates[z.id] = {
        rainfall: Math.round(z.rainfall * scale),
        water_level: Math.round(z.water_level * (waterLevel / 2.0) * 10) / 10,
        drainage_stress: Math.round(Math.min(100, z.drainage_stress * ((100 - drainageCapacity) / 60))),
        forecast_risk: Math.round(Math.min(100, z.forecast_risk * (forecastRisk / 70))),
      };
    });
    updateZoneSimulation(updates);
  };

  const handleReset = () => {
    setRainfall(80);
    setWaterLevel(2.0);
    setDrainageCapacity(40);
    setForecastRisk(70);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-900 animate-fade-in">
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            MONSOON FLOOD SCENARIO SIMULATOR
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Stress-test district risk metrics by modeling severe rainfall & drainage failure scenarios</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleApply}
            className="bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded hover:bg-blue-700 transition-colors shadow-xs"
          >
            Apply Scenario to Dashboard
          </button>
          <button
            onClick={handleReset}
            className="bg-slate-100 text-slate-700 font-semibold text-xs px-3 py-2 rounded hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Default
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Sliders Control Panel */}
        <div className="col-span-5 bg-white rounded border border-slate-200 p-4 shadow-xs space-y-5">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Scenario Control Parameters
          </h3>

          <SliderControl
            icon={<CloudRain className="w-4 h-4 text-blue-600" />}
            label="Precipitation Volume (mm/3hr)"
            value={rainfall}
            min={0} max={200}
            onChange={setRainfall}
            format={v => `${v} mm`}
          />

          <SliderControl
            icon={<Waves className="w-4 h-4 text-cyan-600" />}
            label="Sutlej River / Drain Level (m)"
            value={waterLevel}
            min={0} max={5} step={0.1}
            onChange={setWaterLevel}
            format={v => `${v.toFixed(1)} m`}
          />

          <SliderControl
            icon={<Filter className="w-4 h-4 text-amber-600" />}
            label="Drainage Discharge Capacity (%)"
            value={drainageCapacity}
            min={0} max={100}
            onChange={setDrainageCapacity}
            format={v => `${v}%`}
          />

          <SliderControl
            icon={<AlertTriangle className="w-4 h-4 text-red-600" />}
            label="Heavy Monsoon Forecast Risk (%)"
            value={forecastRisk}
            min={0} max={100}
            onChange={setForecastRisk}
            format={v => `${v}%`}
          />

          {/* Pipeline */}
          <div className="border-t border-slate-200 pt-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Deterministic Risk Pipeline Execution</p>
            <div className="space-y-1 text-center text-xs font-mono font-bold">
              <span className="text-blue-700">RAINFALL INPUT</span> → <span className="text-cyan-700">TELEMETRY</span> → <span className="text-amber-700">DRAINAGE STRESS</span> → <span className="text-red-700">FLOOD RISK INDEX</span>
            </div>
          </div>
        </div>

        {/* Calculated Simulation Output */}
        <div className="col-span-7 space-y-4">
          <div className={`rounded border p-4 shadow-xs ${
            simResult.level === 'CRITICAL' ? 'bg-red-50 border-red-300 text-red-950' :
            simResult.level === 'HIGH' ? 'bg-orange-50 border-orange-300 text-orange-950' :
            'bg-amber-50 border-amber-300 text-amber-950'
          }`}>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block mb-1">Simulated Model Output Score</span>
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-extrabold">{simResult.score}</span>
              <span className="text-sm font-bold text-slate-500">/ 100 Risk Index ({simResult.level})</span>
            </div>
            <p className="text-xs font-medium text-slate-700 mt-2 border-t border-slate-200/60 pt-2">
              {simResult.confidenceDisclaimer}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <SimStatCard label="CRITICAL" value={critical} color="text-red-700" bg="bg-red-50 border-red-200" />
            <SimStatCard label="HIGH" value={high} color="text-orange-700" bg="bg-orange-50 border-orange-200" />
            <SimStatCard label="MEDIUM" value={medium} color="text-amber-700" bg="bg-amber-50 border-amber-200" />
            <SimStatCard label="LOW" value={low} color="text-emerald-700" bg="bg-emerald-50 border-emerald-200" />
          </div>

          <div className="bg-white rounded border border-slate-200 p-4 shadow-xs">
            <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Simulated Sector Impact Breakdown</h3>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              {simulatedZones.sort((a, b) => b.risk_score - a.risk_score).map(z => (
                <div key={z.id} className="flex items-center justify-between p-1.5 rounded bg-slate-50 text-xs">
                  <span className="font-semibold text-slate-800">{z.name}</span>
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                    z.risk_level === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                    z.risk_level === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-amber-100 text-amber-800'
                  }`}>{z.risk_score}% {z.risk_level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderControl({
  icon, label, value, min, max, step = 1, onChange, format
}: {
  icon: React.ReactNode; label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">{icon}<span className="text-xs font-semibold text-slate-700">{label}</span></div>
        <span className="text-xs font-mono font-bold text-slate-900">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
      />
    </div>
  );
}

function SimStatCard({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`rounded border p-2.5 text-center ${bg}`}>
      <p className={`text-xl font-extrabold ${color}`}>{value}</p>
      <p className="text-[10px] font-bold uppercase text-slate-600">{label}</p>
    </div>
  );
}
