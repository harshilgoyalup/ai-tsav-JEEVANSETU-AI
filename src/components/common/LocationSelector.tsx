// FloodGuard / JeevanSetu AI — Dynamic Location Selector & Search

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { PRESET_LOCATIONS } from '../../config/constants';
import { searchLocation, type GeocodingResult } from '../../services/geocodingService';
import { MapPin, Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import type { LocationState } from '../../types';

export default function LocationSelector() {
  const { selectedLocation, setSelectedLocation } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(async () => {
      const res = await searchLocation(val);
      setResults(res);
      setSearching(false);
    }, 450);
  };

  const handleSelectLocation = (loc: LocationState) => {
    setSelectedLocation(loc);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative font-sans text-xs" ref={dropdownRef}>
      {/* Location Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded border border-slate-700 font-semibold transition-colors"
      >
        <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <div className="text-left">
          <span className="font-extrabold text-white text-xs block leading-tight">{selectedLocation.name}</span>
          <span className="text-[10px] text-slate-400 block leading-tight font-mono">
            {selectedLocation.latitude.toFixed(4)}°N, {selectedLocation.longitude.toFixed(4)}°E
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-80 bg-white border border-slate-300 rounded-md shadow-xl z-50 p-3 text-slate-900 animate-fade-in">
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Search Location (India / Global)
            </span>
            <div className="relative">
              <input
                value={query}
                onChange={e => handleQueryChange(e.target.value)}
                placeholder="Type city or town name (e.g. Amritsar, Delhi)..."
                className="w-full bg-slate-50 border border-slate-300 rounded pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 font-medium"
                autoFocus
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              {searching && <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin absolute right-2.5 top-2" />}
            </div>
          </div>

          {/* Search Results */}
          {results.length > 0 && (
            <div className="mb-3 border-b border-slate-200 pb-2 max-h-40 overflow-y-auto">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">Search Results</span>
              {results.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectLocation({
                    name: r.name,
                    district: r.district,
                    state: r.state,
                    country: r.country,
                    latitude: r.latitude,
                    longitude: r.longitude,
                  })}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-100 flex items-start gap-2 text-xs text-slate-800 transition-colors border-b border-slate-100"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="truncate">
                    <p className="font-bold text-slate-900">{r.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{r.displayName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Preset Locations */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Preset Demonstration Regions
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_LOCATIONS.map(loc => {
                const isSelected = selectedLocation.name === loc.name;
                return (
                  <button
                    key={loc.name}
                    onClick={() => handleSelectLocation(loc)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-xs font-semibold transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 text-blue-800'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{loc.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
