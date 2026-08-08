// FloodGuard AI / JeevanSetu — Nominatim Geocoding Service
// Converts search queries into geographic coordinates (lat/lng) anywhere in India or globally.
// Respects Nominatim usage policy (rate-limited, debounced, custom User-Agent).

import { NOMINATIM_BASE } from '../config/constants';

export interface GeocodingResult {
  name: string;
  district?: string;
  state?: string;
  country?: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1100; // Nominatim: max 1 req/sec policy

/**
 * Search for any city, town, or address using Nominatim.
 */
export async function searchLocation(query: string, boundedToIndia = true): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 2) return [];

  // Rate limiting
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }

  try {
    const params = new URLSearchParams({
      q: query.trim(),
      format: 'json',
      limit: '6',
      addressdetails: '1',
    });

    if (boundedToIndia) {
      params.append('countrycodes', 'in');
    }

    lastRequestTime = Date.now();
    const response = await fetch(`${NOMINATIM_BASE}/search?${params}`, {
      headers: { 'User-Agent': 'JeevanSetu-FloodGuard-EmergencyOps/2.0' },
      signal: AbortSignal.timeout(6000),
    });

    if (!response.ok) throw new Error(`Nominatim HTTP ${response.status}`);

    const data = await response.json();
    return data.map((item: any) => {
      const address = item.address || {};
      const cityName = item.name || address.city || address.town || address.village || address.county || item.display_name.split(',')[0];
      return {
        name: cityName,
        district: address.state_district || address.county || address.suburb,
        state: address.state,
        country: address.country,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        displayName: item.display_name,
      };
    });
  } catch (error) {
    console.warn('[GeocodingService] Nominatim query failed:', error);
    return [];
  }
}

/**
 * Create a debounced location search function.
 */
export function createDebouncedSearch(delay = 500) {
  let timer: ReturnType<typeof setTimeout>;
  return (query: string, boundedToIndia = true): Promise<GeocodingResult[]> => {
    return new Promise((resolve) => {
      clearTimeout(timer);
      timer = setTimeout(async () => {
        const results = await searchLocation(query, boundedToIndia);
        resolve(results);
      }, delay);
    });
  };
}
