// FloodGuard / JeevanSetu AI — Emergency Alert Dispatch Center

import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { generateAlertMessage } from '../../services/geminiService';
import { timeAgo } from '../../utils/formatters';
import { Bell, Send, X, CheckCircle2, Loader2, Users, Building2, GraduationCap, HeartPulse, Truck } from 'lucide-react';
import type { Alert } from '../../types';

const AUDIENCES = [
  { id: 'Residents', icon: Users, label: 'Residents' },
  { id: 'Schools', icon: GraduationCap, label: 'Schools' },
  { id: 'Hospitals', icon: HeartPulse, label: 'Hospitals' },
  { id: 'Rescue Teams', icon: Truck, label: 'Rescue Teams' },
  { id: 'Traffic Authorities', icon: Building2, label: 'Traffic Authorities' },
];

export default function AlertCenter() {
  const { zones, alerts, addAlert } = useApp();
  const [composing, setComposing] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [severity, setSeverity] = useState<Alert['severity']>('WARNING');
  const [targetAudience, setTargetAudience] = useState<string[]>(['Residents']);
  const [message, setMessage] = useState('');
  const [generating, setGenerating] = useState(false);
  const [dispatched, setDispatched] = useState(false);

  const zone = zones.find(z => z.id === selectedZone);

  const handleGenerate = async () => {
    if (!zone) return;
    setGenerating(true);
    try {
      const resp = await generateAlertMessage(zone, severity, targetAudience);
      setMessage(resp.message);
    } catch {
      setMessage('Failed to generate alert message.');
    }
    setGenerating(false);
  };

  const handleDispatch = () => {
    if (!zone || !message) return;
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      zone_id: zone.id,
      severity,
      target_audience: targetAudience,
      message,
      status: 'DISPATCHED',
      created_at: new Date().toISOString(),
    };
    addAlert(alert);
    setDispatched(true);
    setTimeout(() => {
      setDispatched(false);
      setComposing(false);
      setMessage('');
      setSelectedZone('');
    }, 2500);
  };

  const toggleAudience = (id: string) => {
    setTargetAudience(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-slate-900 animate-fade-in">
      <div className="flex items-center justify-between bg-white border border-slate-200 p-3.5 rounded shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-600" />
            EMERGENCY ALERT DISPATCH CENTER
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Issue targeted advisory notices to emergency services and civilian channels</p>
        </div>
        <button
          onClick={() => setComposing(!composing)}
          className="flex items-center gap-1.5 bg-red-600 text-white font-bold text-xs px-3.5 py-2 rounded hover:bg-red-700 transition-colors shadow-xs"
        >
          <Bell className="w-3.5 h-3.5" />
          Compose New Alert
        </button>
      </div>

      {/* Composer Panel */}
      {composing && (
        <div className="bg-white border border-slate-300 rounded p-4 shadow-sm animate-fade-in space-y-4">
          {dispatched ? (
            <div className="flex items-center gap-3 py-6 justify-center bg-emerald-50 rounded border border-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <div>
                <p className="text-emerald-900 font-bold text-sm">✓ ALERT DISPATCH RECORDED</p>
                <p className="text-xs text-emerald-700">Simulated broadcast dispatched to selected recipient channels.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alert Configuration Panel</h3>
                <button onClick={() => setComposing(false)} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Target Sector Zone</label>
                  <select
                    value={selectedZone}
                    onChange={e => setSelectedZone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="">Select target sector...</option>
                    {zones.sort((a, b) => b.risk_score - a.risk_score).map(z => (
                      <option key={z.id} value={z.id}>{z.name} ({z.risk_score}% Risk)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Severity Classification</label>
                  <select
                    value={severity}
                    onChange={e => setSeverity(e.target.value as Alert['severity'])}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                  >
                    <option value="CRITICAL">CRITICAL WARNING</option>
                    <option value="WARNING">WARNING ADVISORY</option>
                    <option value="WATCH">WATCH MONITORING</option>
                    <option value="RESOLVED">SITUATION RESOLVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Target Audience Channels</label>
                <div className="flex flex-wrap gap-2">
                  {AUDIENCES.map(a => (
                    <button
                      key={a.id}
                      onClick={() => toggleAudience(a.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded border transition-colors ${
                        targetAudience.includes(a.id)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <a.icon className="w-3.5 h-3.5" />
                      {a.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Broadcast Message Content</label>
                  <button
                    onClick={handleGenerate}
                    disabled={!zone || generating}
                    className="text-xs font-bold text-blue-700 hover:underline disabled:opacity-50 flex items-center gap-1"
                  >
                    {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    {generating ? 'Drafting with AI...' : 'Draft via JeevanSetu AI'}
                  </button>
                </div>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Enter explicit alert text or click Draft via JeevanSetu AI..."
                  className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-600 resize-none font-sans"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={handleDispatch}
                  disabled={!zone || !message}
                  className="flex items-center gap-1.5 bg-red-600 text-white font-bold text-xs px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Dispatch Emergency Broadcast
                </button>
                <button
                  onClick={() => setComposing(false)}
                  className="text-xs text-slate-600 font-semibold px-3 py-2 rounded hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Dispatched Alerts History */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Broadcast Archive</h3>
        {alerts.map(a => {
          const z = zones.find(z => z.id === a.zone_id);
          return (
            <div key={a.id} className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border uppercase ${
                    a.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-300' :
                    a.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-blue-100 text-blue-800 border-blue-300'
                  }`}>
                    {a.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{z?.name || 'Sector Broadcast'}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{a.status}</span>
                  <span>{timeAgo(a.created_at)}</span>
                </div>
              </div>

              <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-line">{a.message}</p>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Channels:</span>
                {a.target_audience.map(t => (
                  <span key={t} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
