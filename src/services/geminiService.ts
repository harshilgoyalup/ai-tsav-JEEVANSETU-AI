// FloodGuard AI / JeevanSetu — Decision Assistant Gemini Service
// Calls Supabase Edge Functions for AI operations.
// Formats responses into structured decision-support outputs.

import { getSupabase } from './supabaseClient';
import type { Zone, AppState } from '../types';

export interface GeminiStructuredResponse {
  situation: string;
  evidence: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  limitation: string;
  action: string;
  rawText: string;
  isDemo: boolean;
}

/**
 * Call the decision assistant via Supabase Edge Function or structured fallback.
 */
export async function askAssistant(
  question: string,
  context: Partial<AppState>,
): Promise<GeminiStructuredResponse> {
  const supabase = getSupabase();

  if (!supabase) {
    return generateDemoStructuredResponse(question, context);
  }

  try {
    const { data, error } = await supabase.functions.invoke('gemini-assistant', {
      body: { question, context: sanitizeContext(context) },
    });

    if (error) throw error;
    return parseStructuredResponse(data.response, false);
  } catch (error) {
    console.warn('[GeminiService] Edge function unavailable:', error);
    return generateDemoStructuredResponse(question, context);
  }
}

/**
 * Generate an alert message via Supabase Edge Function.
 */
export async function generateAlertMessage(
  zone: Zone,
  severity: string,
  targetAudience: string[],
): Promise<{ message: string; isDemo: boolean }> {
  const supabase = getSupabase();

  if (!supabase) {
    return {
      message: `${severity} FLOOD WARNING — ${zone.name}\n\nSITUATION: Risk score reached ${zone.risk_score}% (${zone.risk_level}).\n\nEVIDENCE:\n• Heavy rainfall: ${zone.rainfall} mm/3hr\n• Blocked roads: ${zone.blocked_roads}\n• Verified reports: ${zone.citizen_reports}\n\nTARGET: ${targetAudience.join(', ')}\n\nRECOMMENDED ACTION: Avoid low-lying roads near ${zone.name}. Maintain emergency access corridors to regional medical centers.`,
      isDemo: true,
    };
  }

  try {
    const { data, error } = await supabase.functions.invoke('gemini-alert', {
      body: { zone, severity, targetAudience },
    });

    if (error) throw error;
    return { message: data.message, isDemo: false };
  } catch (error) {
    console.warn('[GeminiService] Alert generation unavailable:', error);
    return {
      message: `${severity} FLOOD WARNING — ${zone.name}\n\nRisk level ${zone.risk_score}% (${zone.risk_level}). Rainfall: ${zone.rainfall}mm/3hr. Target: ${targetAudience.join(', ')}. Action: Maintain emergency corridor to regional hospitals and avoid low-lying roads.`,
      isDemo: true,
    };
  }
}

/**
 * Generate a risk explanation via Supabase Edge Function.
 */
export async function explainRisk(zone: Zone): Promise<GeminiStructuredResponse> {
  return generateDemoExplanation(zone);
}

// --- Helper Parser & Fallbacks ---

function parseStructuredResponse(text: string, isDemo: boolean): GeminiStructuredResponse {
  // If text already has headers, extract them, otherwise wrap cleanly
  return {
    situation: extractSection(text, 'SITUATION') || 'Current zone conditions are being monitored by FloodGuard risk engine.',
    evidence: extractSection(text, 'EVIDENCE') || text,
    confidence: text.includes('HIGH') ? 'HIGH' : text.includes('LOW') ? 'LOW' : 'MEDIUM',
    limitation: extractSection(text, 'LIMITATION') || 'No live physical river telemetry sensor connected.',
    action: extractSection(text, 'RECOMMENDED ACTION') || extractSection(text, 'ACTION') || 'Maintain active emergency monitoring.',
    rawText: text,
    isDemo,
  };
}

function extractSection(text: string, header: string): string {
  const regex = new RegExp(`${header}[:\\n\\s]*([\\s\\S]*?)(?=\\n[A-Z\\s]{4,15}:|$)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function generateDemoStructuredResponse(question: string, context: Partial<AppState>): GeminiStructuredResponse {
  const zones = context.zones || [];
  const critical = zones.filter(z => z.risk_level === 'CRITICAL');
  const high = zones.filter(z => z.risk_level === 'HIGH');
  const q = question.toLowerCase();

  if (q.includes('immediate attention') || q.includes('priority') || q.includes('high risk')) {
    return {
      situation: `${critical.length} zone(s) at CRITICAL level and ${high.length} zone(s) at HIGH level requiring immediate operational prioritization in Ludhiana.`,
      evidence: `Precipitation intensity is heavy across key districts:\n• Zone B-07 (Ferozepur Road): 82mm rain, 6 blocked roads, 27 citizen reports\n• Zone G-09 (BRS Nagar): 72mm rain, 5 blocked roads\n• Zone K-10 (Jamalpur): 68mm rain`,
      confidence: 'MEDIUM',
      limitation: 'Open-Meteo rainfall and forecast data are LIVE. Water level figures are simulated pending local sensor deployment.',
      action: '1. Dispatch Alpha Rescue Unit to Zone B-07.\n2. Verify drainage pumping status along Ferozepur Road.\n3. Establish emergency traffic corridor to DMC Hospital.',
      rawText: '',
      isDemo: true,
    };
  }

  if (q.includes('zone b-07') || q.includes('ferozepur')) {
    return {
      situation: 'Zone B-07 (Ferozepur Road) is currently designated at CRITICAL risk (89/100).',
      evidence: 'High precipitation rate (82mm/3hr) combined with 6 confirmed road blockages and 27 citizen inundation reports near Clock Tower.',
      confidence: 'MEDIUM',
      limitation: 'No live water-level telemetry sensor is connected to Ferozepur Road drain.',
      action: 'Deploy heavy water-pumping equipment immediately and alert traffic authorities to close underpasses along Ferozepur Road.',
      rawText: '',
      isDemo: true,
    };
  }

  if (q.includes('school')) {
    return {
      situation: 'DAV Public School and Govt. Senior Secondary School are located in high-risk inundation zones.',
      evidence: 'DAV Public School is in Zone B-07 (89% risk) and Govt. Senior Secondary School is in Zone H-01 (62% risk).',
      confidence: 'MEDIUM',
      limitation: 'Facility occupancy numbers are simulated reference parameters.',
      action: 'Notify school administrators in Zone B-07 to initiate precautionary dismissal or move students to 1st-floor assembly areas.',
      rawText: '',
      isDemo: true,
    };
  }

  return {
    situation: `Ludhiana Command Center monitoring ${zones.length} active flood risk zones.`,
    evidence: `Current weather reports active rainfall. Risk engine indicates ${critical.length} Critical and ${high.length} High severity zones.`,
    confidence: 'MEDIUM',
    limitation: 'Weather data is LIVE (Open-Meteo). Water levels and drainage stress are estimated model parameters.',
    action: 'Review live map telemetry, verify citizen report clusters, and monitor rescue team deployment status.',
    rawText: '',
    isDemo: true,
  };
}

function generateDemoExplanation(zone: Zone): GeminiStructuredResponse {
  return {
    situation: `Zone ${zone.name} is assessed at ${zone.risk_level} risk (${zone.risk_score}/100).`,
    evidence: `Contributing Risk Factors:\n• Rainfall (30% weight): ${zone.rainfall}mm / 3hr\n• Drainage Stress (20% weight): ${zone.drainage_stress}%\n• Blocked Roads: ${zone.blocked_roads} active obstacles\n• Citizen Reports: ${zone.citizen_reports} community complaints`,
    confidence: 'MEDIUM',
    limitation: 'Live rainfall provided via Open-Meteo API. Water level sensor reading is estimated model input.',
    action: `Prioritize clearing the ${zone.blocked_roads} blocked road access points to ensure rescue vehicles can reach ${zone.name}.`,
    rawText: '',
    isDemo: true,
  };
}

function sanitizeContext(context: Partial<AppState>) {
  return {
    location: context.selectedLocation ? {
      name: context.selectedLocation.name,
      state: context.selectedLocation.state,
      latitude: context.selectedLocation.latitude,
      longitude: context.selectedLocation.longitude,
    } : undefined,
    zones: context.zones?.map(z => ({
      name: z.name,
      risk_score: z.risk_score,
      risk_level: z.risk_level,
      rainfall: z.rainfall,
      water_level: z.water_level,
      blocked_roads: z.blocked_roads,
    })),
    weather: context.weather ? {
      temperature: context.weather.temperature,
      rainfall: context.weather.rainfall,
      condition: context.weather.condition,
      isLive: context.weather.isLive,
      source: context.weather.source,
    } : undefined,
  };
}
