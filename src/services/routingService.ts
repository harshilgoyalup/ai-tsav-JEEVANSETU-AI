// FloodGuard AI — Routing Service
// Integrates OSRM for route calculation with flood-risk overlay.

import { OSRM_BASE } from '../config/constants';
import type { RouteResult, Zone, BlockedRoad } from '../types';
import { getRiskLevel } from './riskEngine';

/**
 * Calculate routes between two points using OSRM.
 * Returns multiple alternatives when available.
 */
export async function calculateRoutes(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
): Promise<RouteResult[]> {
  try {
    const url = `${OSRM_BASE}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&alternatives=true&steps=false`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`OSRM HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.code !== 'Ok' || !data.routes?.length) {
      throw new Error('No routes found');
    }

    return data.routes.map((route: any) => ({
      geometry: route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]),
      distance: Math.round((route.distance / 1000) * 10) / 10,
      duration: Math.round(route.duration / 60),
      floodRisk: 'LOW' as const,
      floodScore: 0,
      blockedRoads: 0,
      riskZonesCrossed: 0,
      recommended: false,
    }));
  } catch (error) {
    console.warn('[RoutingService] OSRM unavailable:', error);
    return [];
  }
}

/**
 * Apply flood-risk overlay to OSRM routes.
 * Checks route proximity to flood zones and blocked roads.
 */
export function applyFloodRiskToRoutes(
  routes: RouteResult[],
  zones: Zone[],
  blockedRoads: BlockedRoad[],
): RouteResult[] {
  const scored = routes.map(route => {
    let floodScore = 0;
    let zonesHit = 0;
    let blockedCount = 0;

    // Check each point on route against flood zones
    for (const [lat, lng] of route.geometry) {
      for (const zone of zones) {
        const dist = haversineDistance(lat, lng, zone.latitude, zone.longitude);
        if (dist <= zone.radius / 1000) { // convert meters to km
          zonesHit++;
          floodScore += zone.risk_score * 0.1;
        }
      }

      // Check proximity to blocked roads (within 200m)
      for (const road of blockedRoads) {
        if (road.status === 'CLEARED') continue;
        const dist = haversineDistance(lat, lng, road.latitude, road.longitude);
        if (dist <= 0.2) {
          blockedCount++;
          floodScore += road.severity === 'CRITICAL' ? 20 : road.severity === 'HIGH' ? 15 : 10;
        }
      }
    }

    // Normalize flood score
    const normalizedScore = Math.min(100, Math.round(floodScore / Math.max(route.geometry.length * 0.05, 1)));

    return {
      ...route,
      floodScore: normalizedScore,
      floodRisk: getRiskLevel(normalizedScore),
      blockedRoads: blockedCount,
      riskZonesCrossed: zonesHit,
    };
  });

  // Sort by flood score (lowest = safest) and mark recommendation
  scored.sort((a, b) => a.floodScore - b.floodScore);
  if (scored.length > 0) {
    scored[0].recommended = true;
  }

  return scored;
}

/**
 * Haversine distance between two points in km.
 */
function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
