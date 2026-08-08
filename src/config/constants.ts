// FloodGuard AI / JeevanSetu — Configuration Constants

import type { LocationState } from '../types';

// Default demonstration location (Ludhiana)
export const DEFAULT_LOCATION: LocationState = {
  name: 'Ludhiana',
  district: 'Ludhiana',
  state: 'Punjab',
  latitude: 30.9010,
  longitude: 75.8573,
  country: 'India',
};

// Preset demonstration locations
export const PRESET_LOCATIONS: LocationState[] = [
  { name: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', latitude: 30.9010, longitude: 75.8573, country: 'India' },
  { name: 'Amritsar', district: 'Amritsar', state: 'Punjab', latitude: 31.6340, longitude: 74.8723, country: 'India' },
  { name: 'Jalandhar', district: 'Jalandhar', state: 'Punjab', latitude: 31.3260, longitude: 75.5762, country: 'India' },
  { name: 'Patiala', district: 'Patiala', state: 'Punjab', latitude: 30.3398, longitude: 76.3869, country: 'India' },
  { name: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, country: 'India' },
  { name: 'Delhi', district: 'New Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.2090, country: 'India' },
];

export const DEFAULT_MAP_ZOOM = 13;

// Risk calculation weights
export const RISK_WEIGHTS = {
  rainfall: 0.30,
  waterLevel: 0.25,
  drainageStress: 0.20,
  forecastRisk: 0.15,
  citizenReports: 0.10,
} as const;

// Risk level thresholds
export const RISK_THRESHOLDS = {
  LOW: 30,
  MEDIUM: 60,
  HIGH: 80,
  CRITICAL: 100,
} as const;

// Operational status palette: Safe/Warning/Critical
export const RISK_COLORS = {
  LOW: '#16a34a',
  MEDIUM: '#f59e0b',
  HIGH: '#ea580c',
  CRITICAL: '#dc2626',
} as const;

export const RISK_BG_COLORS = {
  LOW: '#f0fdf4',
  MEDIUM: '#fffbeb',
  HIGH: '#fff7ed',
  CRITICAL: '#fef2f2',
} as const;

// Normalization ranges for risk factors
export const NORMALIZATION = {
  rainfall: { min: 0, max: 100 },       // mm in 3 hours
  waterLevel: { min: 0, max: 3 },        // meters
  drainageStress: { min: 0, max: 100 },  // percentage
  forecastRisk: { min: 0, max: 100 },    // percentage
  citizenReports: { min: 0, max: 30 },   // count
} as const;

// Open-Meteo API
export const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';

// OSRM API (public demo server)
export const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

// Nominatim API
export const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';

// Weather code descriptions
export const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm with hail',
};

// App navigation
export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { id: 'map', label: 'Flood Map', icon: 'Map' },
  { id: 'routing', label: 'Rescue Routing', icon: 'Route' },
  { id: 'alerts', label: 'Alert Center', icon: 'Bell' },
  { id: 'reports', label: 'Citizen Reports', icon: 'FileText' },
  { id: 'simulation', label: 'Simulation', icon: 'Sliders' },
  { id: 'assistant', label: 'Decision Assistant', icon: 'Bot' },
  { id: 'status', label: 'System Status', icon: 'Activity' },
] as const;

export type NavId = typeof NAV_ITEMS[number]['id'];
