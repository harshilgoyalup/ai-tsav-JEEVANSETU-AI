// FloodGuard AI — Offline Service
// Caches critical data in localStorage for offline/low-connectivity mode.

import type { AppState } from '../types';

const CACHE_KEY = 'floodguard_cache';
const CACHE_TIMESTAMP_KEY = 'floodguard_cache_ts';

interface CachedData {
  zones: AppState['zones'];
  facilities: AppState['facilities'];
  weather: AppState['weather'];
  alerts: AppState['alerts'];
  blockedRoads: AppState['blockedRoads'];
  rescueTeams: AppState['rescueTeams'];
  citizenReports: AppState['citizenReports'];
}

/**
 * Save current app state to localStorage.
 */
export function cacheData(data: CachedData): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.warn('[OfflineService] Failed to cache data:', error);
  }
}

/**
 * Load cached data from localStorage.
 */
export function loadCachedData(): CachedData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Get the timestamp of the last cache update.
 */
export function getLastSyncTime(): string | null {
  return localStorage.getItem(CACHE_TIMESTAMP_KEY);
}

/**
 * Clear cached data.
 */
export function clearCache(): void {
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(CACHE_TIMESTAMP_KEY);
}
