// FloodGuard AI — Gemini Alert Generation Edge Function

// @ts-ignore: Deno types
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-2.0-flash';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (!GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { zone, severity, targetAudience } = await req.json();

    const prompt = `Generate a concise emergency flood alert message for the following situation:

Zone: ${zone.name}
Risk Score: ${zone.risk_score}/100
Risk Level: ${zone.risk_level}
Severity: ${severity}
Rainfall: ${zone.rainfall} mm in last 3 hours
Water Level: ${zone.water_level} meters
Blocked Roads: ${zone.blocked_roads}
Citizen Reports: ${zone.citizen_reports}
Target Audience: ${targetAudience.join(', ')}

Requirements:
- Start with the severity level and zone name
- Include key metrics
- Provide specific actionable recommendations for the target audience
- Keep it under 200 words
- Use professional emergency communication tone
- Do not exaggerate or minimize the situation`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: prompt }] }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 512,
          },
        }),
      }
    );

    const data = await response.json();
    const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate alert.';

    return new Response(
      JSON.stringify({ message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to generate alert' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
