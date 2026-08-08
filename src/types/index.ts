// FloodGuard AI / JeevanSetu — Core Type Definitions

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DataMode = 'DEMO' | 'LIVE';
export type ServiceStatus = 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
export type DataSourceTag = 'LIVE' | 'SIMULATED' | 'USER_REPORTED' | 'UNAVAILABLE';

export interface LocationState {
  name: string;
  district?: string;
  state?: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // meters
  risk_score: number;
  risk_level: RiskLevel;
  rainfall: number; // mm
  water_level: number; // meters
  drainage_stress: number; // 0-100
  blocked_roads: number;
  citizen_reports: number;
  forecast_risk: number; // 0-100
  updated_at: string;
  isSimulated?: boolean;
}

export interface WeatherData {
  temperature: number;
  rainfall: number; // mm in recent window
  windSpeed: number; // km/h
  humidity: number;
  weatherCode: number;
  condition: string;
  precipitationProbability?: number;
  hourlyForecast: HourlyForecast[];
  lastUpdated: string;
  isLive: boolean;
  source: string;
  locationName?: string;
  latitude?: number;
  longitude?: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  precipitation: number;
  precipitationProbability?: number;
  windSpeed: number;
  weatherCode: number;
}

export interface Facility {
  id: string;
  name: string;
  type: 'hospital' | 'school' | 'residential' | 'industrial' | 'shelter';
  latitude: number;
  longitude: number;
  risk_level: RiskLevel;
  status: string;
  details?: string;
  isSimulated?: boolean;
}

export interface RescueTeam {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: 'AVAILABLE' | 'DEPLOYED' | 'RETURNING' | 'STANDBY';
  team_size: number;
  equipment: string[];
  updated_at: string;
  isSimulated?: boolean;
}

export interface CitizenReport {
  id: string;
  location_name: string;
  latitude: number;
  longitude: number;
  report_type: 'waterlogging' | 'blocked_road' | 'rising_water' | 'drain_overflow' | 'vehicle_stranded';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  verified: boolean;
  created_at: string;
  source?: 'USER_REPORTED' | 'SIMULATED';
}

export interface BlockedRoad {
  id: string;
  road_name: string;
  latitude: number;
  longitude: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'CONFIRMED' | 'CLEARED';
  reported_at: string;
  source: 'USER_REPORTED' | 'SIMULATED' | 'CONFIRMED';
}

export interface Alert {
  id: string;
  zone_id: string;
  severity: 'CRITICAL' | 'WARNING' | 'WATCH' | 'RESOLVED';
  target_audience: string[];
  message: string;
  status: 'DRAFT' | 'DISPATCHED' | 'EXPIRED';
  created_at: string;
}

export interface RouteResult {
  geometry: [number, number][];
  distance: number; // km
  duration: number; // minutes
  floodRisk: RiskLevel;
  floodScore: number;
  blockedRoads: number;
  riskZonesCrossed: number;
  recommended: boolean;
  source: string;
}

export interface RiskFactors {
  rainfall: number;
  waterLevel: number;
  drainageStress: number;
  forecastRisk: number;
  citizenReports: number;
}

export interface FactorSource {
  rainfall: DataSourceTag;
  waterLevel: DataSourceTag;
  drainageStress: DataSourceTag;
  forecastRisk: DataSourceTag;
  citizenReports: DataSourceTag;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactors;
  normalizedFactors: RiskFactors;
  factorSources: FactorSource;
  confidenceLevel: 'HIGH' | 'LIMITED' | 'LOW';
  confidenceDisclaimer: string;
}

export interface SystemServiceStatus {
  name: string;
  status: ServiceStatus;
  lastCheck: string;
  responseTime?: number;
  detail?: string;
}

export interface AppState {
  dataMode: DataMode;
  isOffline: boolean;
  lastSync: string;
  selectedLocation: LocationState;
  zones: Zone[];
  facilities: Facility[];
  rescueTeams: RescueTeam[];
  citizenReports: CitizenReport[];
  blockedRoads: BlockedRoad[];
  alerts: Alert[];
  weather: WeatherData | null;
  weatherError: string | null;
  overallRisk: RiskResult | null;
  geminiApiKey: string;
}
