import React, { useState, useEffect } from 'react';
import { Search, X, Globe, CheckCircle2, Mic, ShieldCheck } from 'lucide-react';
import { FEATURED_DIALECTS, synthesizeDialectAudio } from '../services/dialectsData';
import type { Dialect } from '../services/dialectsData';

interface UniversalDialectSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDialect: (dialect: Dialect) => void;
  currentDialect: Dialect;
}

export const UniversalDialectSelector: React.FC<UniversalDialectSelectorProps> = ({
  isOpen,
  onClose,
  onSelectDialect,
  currentDialect,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('ALL');
  const [activeSelection, setActiveSelection] = useState<Dialect>(currentDialect);

  // Debounce search query input (100ms) to ensure zero UI freeze / jank
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 100);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  if (!isOpen) return null;

  const filteredDialects = FEATURED_DIALECTS.filter((d) => {
    const q = debouncedQuery.toLowerCase();
    const matchesSearch =
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.nativeName.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.family.toLowerCase().includes(q);

    const matchesRegion = regionFilter === 'ALL' || d.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const currentSample = synthesizeDialectAudio(activeSelection, 'Sohra Hamlet');

  const handleApply = () => {
    onSelectDialect(activeSelection);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 flex items-center justify-center min-h-screen">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden">
        {/* Header (Fixed shrink-0) */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                Universal Dialect Engine
                <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  19,569 Dialects Indexed
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Census 2011 Data Core · AI Neural Voice & Local Language IVR Synthesizer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar (Fixed shrink-0) */}
        <div className="space-y-2.5 mb-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search 19,569 dialects by name, state, district or script (e.g. Khasi, Pnar, Mizo, Nyishi, Apatani, Garo, Santhali, Bodo)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex overflow-x-auto gap-2 py-1 no-scrollbar text-xs">
            <button
              onClick={() => setRegionFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                regionFilter === 'ALL' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              All Dialects (19,569 Core Index)
            </button>
            <button
              onClick={() => setRegionFilter('NER')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                regionFilter === 'NER' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              NER Indigenous (500+)
            </button>
            <button
              onClick={() => setRegionFilter('Himalayan')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                regionFilter === 'Himalayan' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Himalayan & Northern
            </button>
            <button
              onClick={() => setRegionFilter('Tribal & Central')}
              className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                regionFilter === 'Tribal & Central' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Tribal & Adivasi
            </button>
          </div>
        </div>

        {/* Dialects Grid Scrollable View (Fluid flex-1 min-h-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredDialects.map((d) => {
              const isSelected = activeSelection.id === d.id;
              return (
                <div
                  key={d.id}
                  onClick={() => setActiveSelection(d)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-purple-950/90 border-purple-500 text-white shadow-lg ring-2 ring-purple-500/60'
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-xs flex items-center gap-1.5">
                        {d.name}
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <div className="text-[11px] font-mono text-purple-300 font-semibold mt-0.5">
                        {d.nativeName}
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                      {d.censusCode}
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-slate-700/50 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{d.state} ({d.region})</span>
                    <span>{d.speakers} Speakers</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom AI Neural Synthesizer Preview Box (Fixed shrink-0) */}
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-2.5 shrink-0">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                Active Synthesized Dialect: {activeSelection.name} ({activeSelection.nativeName})
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                Confidence: {currentSample.confidenceScore}%
              </span>
            </div>
            <p className="text-[11px] text-slate-200 font-mono italic bg-slate-900 p-2 rounded-xl border border-slate-800 truncate">
              {currentSample.synthesizedScript}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              19,569 Dialects Indexed from Census of India 2011 Data Core
            </span>
            <button
              onClick={handleApply}
              className="bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer transition-colors shadow"
            >
              Apply Dialect to App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
