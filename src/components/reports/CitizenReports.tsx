// FloodGuard / JeevanSetu AI — Citizen Emergency Reports Log

import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { timeAgo } from '../../utils/formatters';
import { Plus, CheckCircle2, X, FileText } from 'lucide-react';
import type { CitizenReport } from '../../types';

const REPORT_TYPES: { value: CitizenReport['report_type']; label: string }[] = [
  { value: 'waterlogging', label: 'Severe Waterlogging' },
  { value: 'blocked_road', label: 'Blocked Road Inundation' },
  { value: 'rising_water', label: 'Rapidly Rising Water' },
  { value: 'drain_overflow', label: 'Major Drain Overflow' },
  { value: 'vehicle_stranded', label: 'Stranded Vehicles' },
];

export default function CitizenReports() {
  const { citizenReports, setCitizenReports, addCitizenReport } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    location_name: '',
    report_type: 'waterlogging' as CitizenReport['report_type'],
    severity: 'MEDIUM' as CitizenReport['severity'],
    description: '',
  });

  const handleSubmit = () => {
    if (!formData.location_name || !formData.description) return;
    const report: CitizenReport = {
      id: `cr-${Date.now()}`,
      location_name: formData.location_name,
      latitude: 30.9010 + (Math.random() - 0.5) * 0.04,
      longitude: 75.8573 + (Math.random() - 0.5) * 0.04,
      report_type: formData.report_type,
      severity: formData.severity,
      description: formData.description,
      verified: false,
      created_at: new Date().toISOString(),
    };
    addCitizenReport(report);
    setShowForm(false);
    setFormData({ location_name: '', report_type: 'waterlogging', severity: 'MEDIUM', description: '' });
  };

  const handleVerify = (id: string) => {
    setCitizenReports(prev => prev.map(r => r.id === id ? { ...r, verified: true } : r));
  };

  const handleMarkCritical = (id: string) => {
    setCitizenReports(prev => prev.map(r => r.id === id ? { ...r, severity: 'CRITICAL' } : r));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-900 animate-fade-in">
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            CITIZEN FIELD REPORTS LOG
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {citizenReports.length} total field submissions · {citizenReports.filter(r => r.verified).length} confirmed by district command
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Submit Field Incident
        </button>
      </div>

      {/* Submission Form */}
      {showForm && (
        <div className="bg-white border border-slate-300 rounded p-4 shadow-sm animate-fade-in space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">New Civilian Incident Intake</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Incident Location Name</label>
              <input
                value={formData.location_name}
                onChange={e => setFormData({ ...formData, location_name: e.target.value })}
                placeholder="e.g., Ferozepur Road underpass near Clock Tower"
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Incident Type</label>
                <select
                  value={formData.report_type}
                  onChange={e => setFormData({ ...formData, report_type: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  {REPORT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assessed Severity</label>
                <select
                  value={formData.severity}
                  onChange={e => setFormData({ ...formData, severity: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                >
                  <option value="LOW">LOW SEVERITY</option>
                  <option value="MEDIUM">MEDIUM SEVERITY</option>
                  <option value="HIGH">HIGH SEVERITY</option>
                  <option value="CRITICAL">CRITICAL SEVERITY</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Incident Details</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide details on water depth, blocked lanes, or stranded citizens..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none font-sans"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!formData.location_name || !formData.description}
              className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Submit Report to Database
            </button>
          </div>
        </div>
      )}

      {/* Reports Feed */}
      <div className="space-y-3">
        {citizenReports
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .map(r => (
            <div key={r.id} className="bg-white border border-slate-200 rounded p-3.5 shadow-xs space-y-2">
              <div className="flex items-start justify-between border-b border-slate-100 pb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{r.location_name}</h3>
                    {r.verified ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> CONFIRMED BY CONTROL
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded border border-blue-300">
                        ● USER REPORTED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{r.report_type.toUpperCase()} · Submitted {timeAgo(r.created_at)}</p>
                </div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                  r.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' :
                  r.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                  'bg-amber-100 text-amber-800 border-amber-300'
                }`}>
                  {r.severity}
                </span>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed">{r.description}</p>

              <div className="flex items-center gap-2 pt-1">
                {!r.verified && (
                  <button
                    onClick={() => handleVerify(r.id)}
                    className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded hover:bg-emerald-100"
                  >
                    Confirm & Verify Report
                  </button>
                )}
                {r.severity !== 'CRITICAL' && (
                  <button
                    onClick={() => handleMarkCritical(r.id)}
                    className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-300 px-2.5 py-1 rounded hover:bg-red-100"
                  >
                    Escalate to Critical
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
