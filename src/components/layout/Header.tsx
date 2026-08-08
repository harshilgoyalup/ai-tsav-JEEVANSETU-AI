// FloodGuard / JeevanSetu AI — Operational Header

import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import LocationSelector from '../common/LocationSelector';
import SettingsModal from '../common/SettingsModal';
import AuthModal from '../common/AuthModal';
import { Wifi, WifiOff, RefreshCw, Clock, Settings, AlertTriangle, LogOut, User as UserIcon } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

export default function Header() {
  const { dataMode, setDataMode, isOffline, setIsOffline, lastSync, refreshWeather, weather, weatherError, currentUser, logout } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="h-14 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between px-4 shrink-0 shadow-sm select-none">
        {/* Left: Dynamic Location Selector & Operational Badges */}
        <div className="flex items-center gap-3">
          {/* Location Selector Component */}
          <LocationSelector />

          {/* Data Mode Indicator Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${
            dataMode === 'LIVE'
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-300'
              : 'bg-amber-950/60 border-amber-800/80 text-amber-300'
          }`}>
            <span className="font-extrabold uppercase tracking-wider text-[11px]">
              {dataMode === 'LIVE' ? '● LIVE MODE' : '● DEMO MODE'}
            </span>
            <span className="text-[10px] opacity-75 font-mono">
              ({dataMode === 'LIVE' ? (weatherError ? 'API Error' : weather?.source || 'Open-Meteo') : 'Simulated Telemetry'})
            </span>
          </div>

          {/* Weather API Error Alert Badge */}
          {weatherError && dataMode === 'LIVE' && (
            <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-700 text-red-200 px-2.5 py-1 rounded text-[11px] font-medium animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span>WEATHER API ERROR: {weatherError}</span>
            </div>
          )}
        </div>

        {/* Right: User Profile, Controls & Settings */}
        <div className="flex items-center gap-2.5 text-xs">
          {/* Authenticated Firebase User Profile */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-2.5 py-1 rounded text-xs font-medium">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="text-left font-mono">
                <span className="font-bold text-slate-200 text-[11px] block leading-tight">
                  {currentUser.displayName}
                </span>
                <span className="text-[9px] text-slate-400 block leading-tight">
                  {currentUser.isAnonymous ? 'Guest Demo Operator' : currentUser.email}
                </span>
              </div>
              <button
                onClick={() => logout()}
                title="Sign out of Firebase Auth"
                className="ml-1 text-slate-400 hover:text-red-400 p-0.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Last sync time */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Updated: {formatTime(lastSync)}</span>
          </div>

          {/* Refresh Weather */}
          <button
            onClick={() => refreshWeather()}
            title="Refresh weather data for selected location"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Live / Demo Mode Toggle */}
          <button
            onClick={() => setDataMode(dataMode === 'DEMO' ? 'LIVE' : 'DEMO')}
            className={`px-2.5 py-1 rounded font-semibold text-xs border transition-colors ${
              dataMode === 'DEMO'
                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
                : 'bg-amber-600 hover:bg-amber-700 text-white border-amber-500'
            }`}
          >
            {dataMode === 'DEMO' ? 'Switch to Live API' : 'Switch to Demo Mode'}
          </button>

          {/* Offline Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded border font-medium transition-colors ${
              isOffline
                ? 'bg-amber-950/80 text-amber-200 border-amber-700'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
          </button>

          {/* API & Credentials Settings */}
          <button
            onClick={() => setSettingsOpen(true)}
            title="API Keys & Database Credentials Settings"
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </header>

      {/* Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
