// FloodGuard AI / JeevanSetu — Classy & Aesthetic Firebase Auth Gateway

import { useState } from 'react';
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  loginAsGuest
} from '../../services/firebaseAuthService';
import {
  ShieldAlert, Lock, Mail, ArrowRight, UserCheck,
  Loader2, AlertCircle, Shield
} from 'lucide-react';

export default function LoginGateway() {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (isRegisterMode) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.warn('[Firebase Auth] Error:', err);
      let msg = err?.message || 'Authentication failed.';
      if (msg.includes('auth/invalid-credential') || msg.includes('wrong-password')) {
        msg = 'Invalid credentials. Please verify your email and password or create a new account.';
      } else if (msg.includes('auth/email-already-in-use')) {
        msg = 'Email is already registered. Please sign in instead.';
      } else if (msg.includes('auth/weak-password')) {
        msg = 'Password should be at least 6 characters.';
      }
      setErrorMsg(msg);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('[Google Auth] Error:', err);
      setErrorMsg(err?.message || 'Google Authentication failed.');
    }
    setLoading(false);
  };

  const handleGuestSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginAsGuest();
    } catch (err: any) {
      console.warn('[Guest Auth] Error:', err);
      setErrorMsg(err?.message || 'Guest Login failed.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950 flex items-center justify-center p-4 select-none font-sans text-slate-100 overflow-y-auto">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 opacity-90" />

      {/* Main Login Portal Box */}
      <div className="relative z-10 max-w-md w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden my-auto">
        {/* Portal Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-slate-900 border border-slate-700 mb-3 shadow-inner">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-xl font-extrabold text-white tracking-wider">FLOODGUARD AI</h1>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
            JeevanSetu Command Center Portal
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 font-mono">
            <Shield className="w-3 h-3 text-emerald-400" />
            <span>SECURE FIREBASE AUTHENTICATION</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded bg-red-950/80 border border-red-800 text-xs text-red-200 flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Operator Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@disaster.punjab.gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 rounded-lg transition-colors shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create Operator Account' : 'Authenticate & Enter Command Center'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Register / Login mode */}
          <div className="text-center pt-1">
            <button
              onClick={() => { setIsRegisterMode(!isRegisterMode); setErrorMsg(''); }}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              {isRegisterMode
                ? 'Already registered? Sign in here'
                : 'Need a new operator account? Register here'}
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              ALTERNATIVE FIREBASE AUTH
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google & Anonymous Sign In */}
          <div className="space-y-2">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-xs py-2 rounded-lg transition-colors shadow-xs"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>

            <button
              onClick={handleGuestSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs py-2 rounded-lg transition-colors"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Enter as Quick Demo Operator (Guest)</span>
            </button>
          </div>
        </div>

        {/* Portal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10px] text-slate-500 font-mono flex items-center justify-between px-6">
          <span>PROJECT: ai-tsav</span>
          <span className="text-emerald-400 font-semibold">DISTRICT EMERGENCY OPS</span>
        </div>
      </div>
    </div>
  );
}
