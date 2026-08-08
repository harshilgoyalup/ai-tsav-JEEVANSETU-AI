// FloodGuard AI / JeevanSetu — Weather Service
// Integrates Open-Meteo API for real weather data for ANY location coordinates.

import { OPEN_METEO_BASE, WEATHER_CODES } from '../config/constants';
import type { WeatherData, HourlyForecast } from '../types';

// Simulated fallback weather ONLY for DEMO mode
const DEMO_WEATHER: WeatherData = {
  temperature: 27.5,
  rainfall: 82.0,
  windSpeed: 18,
  humidity: 89,
  weatherCode: 65,
  condition: 'Heavy rain',
  precipitationProbability: 95,
  hourlyForecast: Array.from({ length: 24 }, (_, i) => ({
    time: new Date(Date.now() + i * 3600000).toISOString(),
    temperature: 25 + Math.round(Math.random() * 5),
    precipitation: Math.round(10 + Math.random() * 30),
    precipitationProbability: 80 + Math.floor(Math.random() * 20),
    windSpeed: 12 + Math.round(Math.random() * 15),
    weatherCode: [61, 63, 65, 80, 81, 82, 95][Math.floor(Math.random() * 7)],
  })),
  lastUpdated: new Date().toISOString(),
  isLive: false,
  source: 'DEMO / SIMULATED MONSOON DATA',
  locationName: 'Ludhiana (Demo)',
};

/**
 * Fetch live weather from Open-Meteo for any latitude/longitude.
 * Throws explicit errors when unavailable — NEVER silently substitutes demo data in Live mode.
 */
export async function fetchWeather(
  latitude: number,
  longitude: number,
  locationName: string = 'Selected Location'
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m',
    hourly: 'temperature_2m,precipitation,precipitation_probability,weather_code,wind_speed_10m',
    forecast_days: '2',
    timezone: 'Asia/Kolkata',
  });

  const response = await fetch(`${OPEN_METEO_BASE}?${params}`, {
    signal: AbortSignal.timeout(9000),
  });

  if (!response.ok) {
    throw new Error(`Open-Meteo API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const current = data.current;

  if (!current) {
    throw new Error('Open-Meteo API returned empty current weather payload');
  }

  // Calculate precipitation window
  const hourlyPrecip: number[] = data.hourly?.precipitation || [];
  const hourlyProb: number[] = data.hourly?.precipitation_probability || [];
  const hourlyTimes: string[] = data.hourly?.time || [];
  const now = new Date();

  let rainfallAccumulated = current.precipitation ?? 0;
  let currentProb = 0;

  for (let i = 0; i < hourlyTimes.length; i++) {
    const t = new Date(hourlyTimes[i]);
    const diffHours = (now.getTime() - t.getTime()) / 3600000;
    if (diffHours >= -1 && diffHours <= 3) {
      rainfallAccumulated += hourlyPrecip[i] || 0;
      if (hourlyProb[i] !== undefined) {
        currentProb = Math.max(currentProb, hourlyProb[i]);
      }
    }
  }

  // Build hourly forecast
  const hourlyForecast: HourlyForecast[] = [];
  for (let i = 0; i < Math.min(24, hourlyTimes.length); i++) {
    const t = new Date(hourlyTimes[i]);
    if (t.getTime() >= now.getTime() - 3600000) {
      hourlyForecast.push({
        time: hourlyTimes[i],
        temperature: Math.round((data.hourly.temperature_2m?.[i] ?? 0) * 10) / 10,
        precipitation: Math.round((hourlyPrecip[i] ?? 0) * 10) / 10,
        precipitationProbability: hourlyProb[i] ?? 0,
        windSpeed: Math.round(data.hourly.wind_speed_10m?.[i] ?? 0),
        weatherCode: data.hourly.weather_code?.[i] ?? 0,
      });
    }
  }

  return {
    temperature: Math.round((current.temperature_2m ?? 0) * 10) / 10,
    rainfall: Math.round(rainfallAccumulated * 10) / 10,
    windSpeed: Math.round(current.wind_speed_10m ?? 0),
    humidity: Math.round(current.relative_humidity_2m ?? 0),
    weatherCode: current.weather_code ?? 0,
    condition: WEATHER_CODES[current.weather_code] || 'Clear',
    precipitationProbability: currentProb || (hourlyForecast[0]?.precipitationProbability ?? 0),
    hourlyForecast,
    lastUpdated: new Date().toISOString(),
    isLive: true,
    source: 'OPEN-METEO API',
    locationName,
    latitude,
    longitude,
  };
}

/**
 * Get demo weather data (used strictly when mode === "DEMO").
 */
export function getDemoWeather(locationName: string = 'Ludhiana'): WeatherData {
  return {
    ...DEMO_WEATHER,
    locationName: `${locationName} (Demo)`,
    lastUpdated: new Date().toISOString(),
  };
}
