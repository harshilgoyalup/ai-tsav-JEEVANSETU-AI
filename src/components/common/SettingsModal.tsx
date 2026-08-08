// FloodGuard / JeevanSetu AI — Credentials & API Settings Modal

import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { isSupabaseConfigured } from '../../services/supabaseClient';
import { Key, Database, Shield, X } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { geminiApiKey, setGeminiApiKey, dataMode, setDataMode } = useApp();
  const [apiKeyInput, setApiKeyInput] = useState(geminiApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    setGeminiApiKey(apiKeyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-lg w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">System Credentials & API Settings</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        {/* Gemini API Key Configuration */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded border border-slate-200">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-600" /> Google Gemini AI API Key
            </label>
            {geminiApiKey ? (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-300">
                CONFIGURED
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                DEFAULT / EDGE FUNCTION
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">
            Enter a custom Google Gemini API Key for direct client testing or override default Supabase Edge Function calls.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={e => setApiKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
            />
            <button
              onClick={handleSaveKey}
              className="bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              Save Key
            </button>
          </div>
          {savedSuccess && <p className="text-[11px] text-emerald-700 font-semibold">✓ API Key saved to local storage.</p>}
        </div>

        {/* Supabase Status & Credentials */}
        <div className="space-y-2 bg-slate-50 p-3.5 rounded border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-600" /> Supabase Database & Auth State
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              {isSupabaseConfigured() ? 'SUPABASE CONNECTED' : 'DEMO MODE FALLBACK'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {isSupabaseConfigured()
              ? 'Connected to primary Supabase backend. Citizen reports and alerts synchronize live.'
              : 'Supabase URL or Anon key environment variables are unset. Running in self-contained DEMO MODE.'}
          </p>
          <div className="pt-2 border-t border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-600 font-medium">Active Data Mode:</span>
            <button
              onClick={() => setDataMode(dataMode === 'LIVE' ? 'DEMO' : 'LIVE')}
              className="font-bold text-blue-700 hover:underline"
            >
              Toggle Mode (Currently {dataMode})
            </button>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded hover:bg-slate-700 transition-colors"
          >
            Close Settings
          </button>
        </div>
      </div>
    </div>
  );
}
