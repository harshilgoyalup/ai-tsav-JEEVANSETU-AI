// FloodGuard AI / JeevanSetu — Application Context
// Central state management: Firebase User Authentication, selectedLocation, live Open-Meteo telemetry, data mode & DB feeds.

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { DataMode, Zone, Facility, RescueTeam, CitizenReport, BlockedRoad, Alert, WeatherData, RiskResult, LocationState } from '../types';
import type { NavId } from '../config/constants';
import { DEFAULT_LOCATION } from '../config/constants';
import { demoZones } from '../data/demoZones';
import { demoFacilities } from '../data/demoFacilities';
import { demoTeams } from '../data/demoTeams';
import { demoCitizenReports } from '../data/demoReports';
import { demoBlockedRoads } from '../data/demoRoads';
import { demoAlerts } from '../data/demoAlerts';
import { fetchWeather, getDemoWeather } from '../services/weatherService';
import { calculateOverallRisk, recalculateZoneRisk } from '../services/riskEngine';
import { cacheData, loadCachedData, getLastSyncTime } from '../services/offlineService';
import { subscribeToAuth, logoutFirebase, type AuthUser } from '../services/firebaseAuthService';

interface AppContextType {
  // Authentication State
  currentUser: AuthUser | null;
  authLoading: boolean;
  logout: () => Promise<void>;

  // Mode & Location
  dataMode: DataMode;
  setDataMode: (mode: DataMode) => void;
  isOffline: boolean;
  setIsOffline: (v: boolean) => void;
  lastSync: string;
  selectedLocation: LocationState;
  setSelectedLocation: (loc: LocationState) => void;

  // Navigation
  activePage: NavId;
  setActivePage: (page: NavId) => void;

  // Data
  zones: Zone[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  facilities: Facility[];
  rescueTeams: RescueTeam[];
  citizenReports: CitizenReport[];
  setCitizenReports: React.Dispatch<React.SetStateAction<CitizenReport[]>>;
  blockedRoads: BlockedRoad[];
  alerts: Alert[];
  setAlerts: React.Dispatch<React.SetStateAction<Alert[]>>;
  weather: WeatherData | null;
  weatherError: string | null;
  overallRisk: RiskResult | null;

  // API Key & Settings
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;

  // Actions
  refreshWeather: () => Promise<void>;
  addCitizenReport: (report: CitizenReport) => void;
  addAlert: (alert: Alert) => void;
  updateZoneSimulation: (updates: Record<string, Partial<Zone>>) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Auth state
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // App mode & location
  const [dataMode, setDataMode] = useState<DataMode>('LIVE');
  const [isOffline, setIsOffline] = useState(false);
  const [lastSync, setLastSync] = useState(getLastSyncTime() || new Date().toISOString());
  const [activePage, setActivePage] = useState<NavId>('dashboard');
  const [selectedLocation, setSelectedLocation] = useState<LocationState>(DEFAULT_LOCATION);
  const [geminiApiKey, setGeminiApiKeyState] = useState<string>(() => localStorage.getItem('GEMINI_API_KEY') || '');

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = subscribeToAuth(user => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await logoutFirebase();
    setCurrentUser(null);
  };

  const setGeminiApiKey = (key: string) => {
    setGeminiApiKeyState(key);
    if (key) localStorage.setItem('GEMINI_API_KEY', key);
    else localStorage.removeItem('GEMINI_API_KEY');
  };

  // Data state — demo data active when dataMode === 'DEMO'
  const [zones, setZones] = useState<Zone[]>(demoZones);
  const [facilities, setFacilities] = useState<Facility[]>(demoFacilities);
  const [rescueTeams, setRescueTeams] = useState<RescueTeam[]>(demoTeams);
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(demoCitizenReports);
  const [blockedRoads, setBlockedRoads] = useState<BlockedRoad[]>(demoBlockedRoads);
  const [alerts, setAlerts] = useState<Alert[]>(demoAlerts);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [overallRisk, setOverallRisk] = useState<RiskResult | null>(null);

  // Track mount for React 18 StrictMode safety
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Update datasets depending on DataMode
  useEffect(() => {
    if (dataMode === 'LIVE') {
      setZones(prev => prev.map(z => ({ ...z, isSimulated: true })));
      setFacilities(prev => prev.map(f => ({ ...f, isSimulated: true })));
    } else {
      setZones(demoZones);
      setFacilities(demoFacilities);
      setRescueTeams(demoTeams);
      setCitizenReports(demoCitizenReports);
      setBlockedRoads(demoBlockedRoads);
      setAlerts(demoAlerts);
    }
  }, [dataMode]);

  // Recalculate overall risk when zones or mode change
  useEffect(() => {
    setOverallRisk(calculateOverallRisk(zones, dataMode));
  }, [zones, dataMode]);

  // Fetch weather for selected location
  const refreshWeather = useCallback(async () => {
    if (isOffline) return;

    if (dataMode === 'DEMO') {
      setWeather(getDemoWeather(selectedLocation.name));
      setWeatherError(null);
      setLastSync(new Date().toISOString());
      return;
    }

    try {
      setWeatherError(null);
      const w = await fetchWeather(selectedLocation.latitude, selectedLocation.longitude, selectedLocation.name);
      if (mounted.current) {
        setWeather(w);
        setLastSync(new Date().toISOString());
      }
    } catch (err: any) {
      if (mounted.current) {
        const errorMsg = err?.message || 'Open-Meteo Weather API query failed';
        console.warn('[AppContext] Weather fetch error:', errorMsg);
        setWeatherError(errorMsg);
      }
    }
  }, [dataMode, isOffline, selectedLocation]);

  useEffect(() => {
    refreshWeather();
    const interval = setInterval(refreshWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshWeather]);

  // Cache data for offline use
  useEffect(() => {
    if (!isOffline && weather) {
      cacheData({ zones, facilities, weather, alerts, blockedRoads, rescueTeams, citizenReports });
    }
  }, [zones, weather, alerts, isOffline, facilities, blockedRoads, rescueTeams, citizenReports]);

  // Load cached data when going offline
  useEffect(() => {
    if (isOffline) {
      const cached = loadCachedData();
      if (cached) {
        setZones(cached.zones);
        setWeather(cached.weather);
        setAlerts(cached.alerts);
      }
    }
  }, [isOffline]);

  const addCitizenReport = useCallback((report: CitizenReport) => {
    setCitizenReports(prev => [report, ...prev]);
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  }, []);

  const updateZoneSimulation = useCallback((updates: Record<string, Partial<Zone>>) => {
    setZones(prev => prev.map(z => {
      const update = updates[z.id];
      if (!update) return z;
      const updated = { ...z, ...update };
      return recalculateZoneRisk(updated, dataMode);
    }));
  }, [dataMode]);

  return (
    <AppContext.Provider value={{
      currentUser, authLoading, logout,
      dataMode, setDataMode,
      isOffline, setIsOffline,
      lastSync,
      selectedLocation, setSelectedLocation,
      activePage, setActivePage,
      zones, setZones,
      facilities, rescueTeams,
      citizenReports, setCitizenReports,
      blockedRoads,
      alerts, setAlerts,
      weather, weatherError, overallRisk,
      geminiApiKey, setGeminiApiKey,
      refreshWeather,
      addCitizenReport, addAlert,
      updateZoneSimulation,
    }}>
      {children}
    </AppContext.Provider>
  );
}
