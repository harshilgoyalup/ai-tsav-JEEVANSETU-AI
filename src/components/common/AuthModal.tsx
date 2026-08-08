// FloodGuard / JeevanSetu AI — Supabase Authentication Modal

import { useState } from 'react';
import { getSupabase } from '../../services/supabaseClient';
import { Lock, Mail, LogIn, LogOut, CheckCircle2, AlertCircle, Shield, X, Loader2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [userSession, setUserSession] = useState<any>(null);

  if (!isOpen) return null;

  const supabase = getSupabase();

  const handleEmailLogin = async () => {
    if (!supabase || !email) return;
    setLoading(true);
    setMessage(null);

    try {
      if (password) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUserSession(data.session);
        setMessage({ type: 'success', text: `Successfully authenticated as ${data.user?.email}` });
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setMessage({ type: 'success', text: `Magic authentication link dispatched to ${email}. Check your inbox.` });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err?.message || 'Authentication request failed.' });
    }
    setLoading(false);
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      const errMsg = err?.message || '';
      if (errMsg.includes('Unsupported provider') || errMsg.includes('not enabled')) {
        setMessage({
          type: 'error',
          text: `The selected OAuth provider is not enabled in your Supabase Dashboard yet. Enable it under Authentication > Providers in Supabase, or log in with Email/Password.`,
        });
      } else {
        setMessage({ type: 'error', text: errMsg || `${provider} OAuth failed.` });
      }
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUserSession(null);
    setMessage({ type: 'success', text: 'Logged out successfully.' });
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in font-sans text-slate-900">
      <div className="bg-white border border-slate-300 rounded-lg shadow-2xl max-w-md w-full p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Supabase Control Center Login</h3>
              <p className="text-[10px] text-slate-500 font-mono">Project: kdndbqxcrpqdxsgszlsy</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-4 h-4" /></button>
        </div>

        {/* Credentials Badges */}
        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] font-mono space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">CLIENT ID:</span>
            <span className="text-slate-900 font-bold">4b0ae14c-5978-4cd8-8e7e-53b2f55a23c5</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">API KEY TOKEN:</span>
            <span className="text-slate-900 font-bold truncate max-w-[180px]">9hLZ2tW...mZM8A</span>
          </div>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`p-3 rounded text-xs border flex items-start gap-2 ${
            message.type === 'success' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-red-50 border-red-300 text-red-900'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Session Status or Login Form */}
        {userSession ? (
          <div className="space-y-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs">
              <span className="font-bold text-emerald-900 block">AUTHENTICATED OPERATOR SESSION</span>
              <p className="text-emerald-800 text-[11px] font-mono mt-0.5">{userSession.user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white font-bold text-xs py-2 rounded hover:bg-slate-700 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Log Out Session
            </button>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Operator Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@disaster.punjab.gov.in"
                  className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Password (Optional for Magic Link)</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              </div>
            </div>

            <button
              onClick={handleEmailLogin}
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold text-xs py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogIn className="w-3.5 h-3.5" />}
              {password ? 'Sign In with Password' : 'Send Magic OTP Link'}
            </button>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-bold">OR OAUTH AUTHENTICATION</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleOAuthLogin('google')}
                className="bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs py-1.5 rounded hover:bg-slate-200 transition-colors"
              >
                Google OAuth
              </button>
              <button
                onClick={() => handleOAuthLogin('github')}
                className="bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs py-1.5 rounded hover:bg-slate-200 transition-colors"
              >
                GitHub OAuth
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
