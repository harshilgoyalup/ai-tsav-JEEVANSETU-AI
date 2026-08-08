// FloodGuard / JeevanSetu AI — Operational Sidebar Navigation

import { useApp } from '../../contexts/AppContext';
import { NAV_ITEMS, type NavId } from '../../config/constants';
import {
  LayoutDashboard, Map, Route, Bell, FileText,
  Sliders, Bot, Activity, ShieldAlert
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard, Map, Route, Bell, FileText, Sliders, Bot, Activity,
};

export default function Sidebar() {
  const { activePage, setActivePage } = useApp();

  return (
    <aside className="w-[230px] bg-slate-900 border-r border-slate-800 flex flex-col h-full shrink-0 select-none">
      {/* Header / Brand */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-6 h-6 text-red-500 mt-0.5 shrink-0" />
          <div>
            <h1 className="text-sm font-extrabold text-white tracking-wider">FLOODGUARD AI</h1>
            <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5">
              JeevanSetu Command Center
            </p>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>REGION: LUDHIANA</span>
          <span className="text-emerald-400 font-medium">DISTRICT OPS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Control Center Modules
        </div>
        {NAV_ITEMS.map(item => {
          const Icon = iconMap[item.icon] || Activity;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id as NavId)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Control Room Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <p className="text-[10px] text-slate-400 text-center font-mono">
          PUNJAB EMERGENCY OPS v2.4
        </p>
      </div>
    </aside>
  );
}
