// FloodGuard AI / JeevanSetu — Deterministic Flood Risk Engine
// This engine uses a transparent weighted formula. Gemini NEVER invents numerical risk scores.

import { RISK_WEIGHTS, NORMALIZATION, RISK_THRESHOLDS } from '../config/constants';
import type { RiskFactors, RiskResult, RiskLevel, Zone, FactorSource, DataMode } from '../types';

/**
 * Normalize a value to 0-100 range based on configured min/max.
 */
function normalize(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return ((clamped - min) / (max - min)) * 100;
}

/**
 * Determine risk level from a 0-100 score.
 */
export function getRiskLevel(score: number): RiskLevel {
  if (score <= RISK_THRESHOLDS.LOW) return 'LOW';
  if (score <= RISK_THRESHOLDS.MEDIUM) return 'MEDIUM';
  if (score <= RISK_THRESHOLDS.HIGH) return 'HIGH';
  return 'CRITICAL';
}

/**
 * Calculate flood risk from raw input factors with factor sources and transparency metadata.
 */
export function calculateFloodRisk(factors: RiskFactors, dataMode: DataMode = 'DEMO'): RiskResult {
  const normalizedFactors: RiskFactors = {
    rainfall: normalize(factors.rainfall, NORMALIZATION.rainfall.min, NORMALIZATION.rainfall.max),
    waterLevel: normalize(factors.waterLevel, NORMALIZATION.waterLevel.min, NORMALIZATION.waterLevel.max),
    drainageStress: normalize(factors.drainageStress, NORMALIZATION.drainageStress.min, NORMALIZATION.drainageStress.max),
    forecastRisk: normalize(factors.forecastRisk, NORMALIZATION.forecastRisk.min, NORMALIZATION.forecastRisk.max),
    citizenReports: normalize(factors.citizenReports, NORMALIZATION.citizenReports.min, NORMALIZATION.citizenReports.max),
  };

  const score = Math.round(
    normalizedFactors.rainfall * RISK_WEIGHTS.rainfall +
    normalizedFactors.waterLevel * RISK_WEIGHTS.waterLevel +
    normalizedFactors.drainageStress * RISK_WEIGHTS.drainageStress +
    normalizedFactors.forecastRisk * RISK_WEIGHTS.forecastRisk +
    normalizedFactors.citizenReports * RISK_WEIGHTS.citizenReports
  );

  const factorSources: FactorSource = {
    rainfall: dataMode === 'LIVE' ? 'LIVE' : 'SIMULATED',
    forecastRisk: dataMode === 'LIVE' ? 'LIVE' : 'SIMULATED',
    citizenReports: 'USER_REPORTED',
    waterLevel: dataMode === 'LIVE' ? 'UNAVAILABLE' : 'SIMULATED',
    drainageStress: 'SIMULATED',
  };

  const confidenceDisclaimer = dataMode === 'LIVE'
    ? 'Risk confidence is limited: rainfall and forecasts are LIVE via Open-Meteo, but no live water-level river sensor is connected.'
    : 'Running in DEMO MODE — displaying simulated flood monitoring parameters for competition demonstration.';

  return {
    score: Math.min(100, Math.max(0, score)),
    level: getRiskLevel(score),
    factors,
    normalizedFactors,
    factorSources,
    confidenceLevel: dataMode === 'LIVE' ? 'LIMITED' : 'HIGH',
    confidenceDisclaimer,
  };
}

/**
 * Calculate overall city risk from all zones.
 */
export function calculateOverallRisk(zones: Zone[], dataMode: DataMode = 'DEMO'): RiskResult {
  if (zones.length === 0) {
    return {
      score: 0,
      level: 'LOW',
      factors: { rainfall: 0, waterLevel: 0, drainageStress: 0, forecastRisk: 0, citizenReports: 0 },
      normalizedFactors: { rainfall: 0, waterLevel: 0, drainageStress: 0, forecastRisk: 0, citizenReports: 0 },
      factorSources: {
        rainfall: dataMode === 'LIVE' ? 'LIVE' : 'SIMULATED',
        forecastRisk: dataMode === 'LIVE' ? 'LIVE' : 'SIMULATED',
        citizenReports: 'USER_REPORTED',
        waterLevel: dataMode === 'LIVE' ? 'UNAVAILABLE' : 'SIMULATED',
        drainageStress: 'SIMULATED',
      },
      confidenceLevel: 'LOW',
      confidenceDisclaimer: 'No active risk zones detected.',
    };
  }

  // Average factors across active sectors for overall district score
  const avgFactors: RiskFactors = {
    rainfall: zones.reduce((s, z) => s + z.rainfall, 0) / zones.length,
    waterLevel: zones.reduce((s, z) => s + z.water_level, 0) / zones.length,
    drainageStress: zones.reduce((s, z) => s + z.drainage_stress, 0) / zones.length,
    forecastRisk: zones.reduce((s, z) => s + z.forecast_risk, 0) / zones.length,
    citizenReports: zones.reduce((s, z) => s + z.citizen_reports, 0) / zones.length,
  };

  return calculateFloodRisk(avgFactors, dataMode);
}

/**
 * Recalculate a zone's risk score from its current data.
 */
export function recalculateZoneRisk(zone: Zone, dataMode: DataMode = 'DEMO'): Zone {
  const result = calculateFloodRisk({
    rainfall: zone.rainfall,
    waterLevel: zone.water_level,
    drainageStress: zone.drainage_stress,
    forecastRisk: zone.forecast_risk,
    citizenReports: zone.citizen_reports,
  }, dataMode);

  return {
    ...zone,
    risk_score: result.score,
    risk_level: result.level,
  };
}
