// FloodGuard / JeevanSetu AI — Decision Assistant Console

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { askAssistant, type GeminiStructuredResponse } from '../../services/geminiService';
import { Send, Loader2, Shield, CheckCircle2, Info, FileText } from 'lucide-react';

interface ChatEntry {
  id: string;
  role: 'user' | 'assistant';
  question?: string;
  response?: GeminiStructuredResponse;
  timestamp: string;
}

const SUGGESTED_QUESTIONS = [
  'Which areas need immediate attention?',
  'Why is Zone B-07 critical?',
  'Which schools are in warning zones?',
  'What resources are required in Zone B-07?',
  'Find the safest route to DMC Hospital.',
  'Generate an emergency alert for Zone C-04.',
];

export default function AIAssistant() {
  const appState = useApp();
  const [messages, setMessages] = useState<ChatEntry[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const question = text || input;
    if (!question.trim()) return;

    const userEntry: ChatEntry = {
      id: `usr-${Date.now()}`,
      role: 'user',
      question,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userEntry]);
    setInput('');
    setLoading(true);

    try {
      const resp = await askAssistant(question, {
        selectedLocation: appState.selectedLocation,
        zones: appState.zones,
        weather: appState.weather,
        facilities: appState.facilities,
        rescueTeams: appState.rescueTeams,
        citizenReports: appState.citizenReports,
        blockedRoads: appState.blockedRoads,
        alerts: appState.alerts,
      });

      const assistantEntry: ChatEntry = {
        id: `ast-${Date.now() + 1}`,
        role: 'assistant',
        response: resp,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantEntry]);
    } catch {
      setMessages(prev => [...prev, {
        id: `ast-err-${Date.now()}`,
        role: 'assistant',
        response: {
          situation: 'System error querying AI decision model.',
          evidence: 'Backend request timed out or was interrupted.',
          confidence: 'LOW',
          limitation: 'Check connectivity to Supabase Edge Function.',
          action: 'Rely on deterministic flood risk scores and live weather telemetry.',
          rawText: '',
          isDemo: true,
        },
        timestamp: new Date().toISOString(),
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 overflow-hidden animate-fade-in">
      {/* Console Header */}
      <div className="p-3.5 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-blue-400 shrink-0" />
          <div>
            <h2 className="text-sm font-bold tracking-tight">JeevanSetu Decision Assistant</h2>
            <p className="text-[10px] text-slate-400 font-mono">AI-assisted emergency analysis & operational recommendations</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
          MODEL: GEMINI-2.0-FLASH
        </span>
      </div>

      {/* Main Console Output Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white border border-slate-200 rounded p-4 mb-4 shadow-xs text-center">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-800">OPERATIONAL DECISION CONSOLE</h3>
              <p className="text-xs text-slate-500 mt-1">
                The Decision Assistant synthesizes telemetry from Open-Meteo weather, the FloodGuard risk engine, OSRM routing, and verified citizen reports into structured action reports.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  className="text-left text-xs bg-white border border-slate-200 rounded p-3 text-slate-700 hover:bg-slate-100 hover:border-slate-300 font-medium transition-colors shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className="space-y-2">
            {msg.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded max-w-[70%]">
                  {msg.question}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    JeevanSetu Action Report
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                      msg.response?.confidence === 'HIGH' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                      msg.response?.confidence === 'MEDIUM' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      Confidence: {msg.response?.confidence || 'MEDIUM'}
                    </span>
                    {msg.response?.isDemo && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                        SIMULATED AI
                      </span>
                    )}
                  </div>
                </div>

                {/* Structured Sections */}
                <div className="grid grid-cols-1 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-extrabold uppercase text-[10px] text-slate-500 tracking-wider block mb-0.5">SITUATION</span>
                    <p className="text-slate-900 font-medium">{msg.response?.situation}</p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="font-extrabold uppercase text-[10px] text-slate-500 tracking-wider block mb-0.5">EVIDENCE</span>
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">{msg.response?.evidence}</p>
                  </div>

                  <div className="bg-amber-50/70 p-2.5 rounded border border-amber-200">
                    <span className="font-extrabold uppercase text-[10px] text-amber-800 tracking-wider block mb-0.5">LIMITATION</span>
                    <p className="text-amber-900">{msg.response?.limitation}</p>
                  </div>

                  <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                    <span className="font-extrabold uppercase text-[10px] text-emerald-800 tracking-wider block mb-0.5">RECOMMENDED ACTION</span>
                    <p className="text-emerald-950 font-semibold whitespace-pre-line leading-relaxed">{msg.response?.action}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-white border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-center gap-2 max-w-sm">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span>Analyzing flood telemetry & running reasoning engine...</span>
          </div>
        )}
      </div>

      {/* Operational Disclaimer Footer */}
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1">
          <Info className="w-3.5 h-3.5 text-slate-500" />
          AI responses are derived from available telemetry and must be verified by local district emergency authorities.
        </span>
        <span className="font-mono text-[10px] text-slate-500">PROTOTYPE DECISION CONSOLE</span>
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask JeevanSetu Decision Assistant for operational analysis..."
            className="flex-1 bg-slate-50 border border-slate-300 rounded px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="bg-blue-600 text-white font-medium text-xs px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Query</span>
          </button>
        </div>
      </div>
    </div>
  );
}
