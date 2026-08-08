// FloodGuard AI — Supabase Client
// Initializes Supabase client from environment variables.
// Returns null if not configured — app works in DEMO mode.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.info('[Supabase] No credentials configured. Running in DEMO mode.');
    return null;
  }

  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
    console.info('[Supabase] Client initialized.');
    return supabase;
  } catch (error) {
    console.warn('[Supabase] Failed to initialize:', error);
    return null;
  }
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
