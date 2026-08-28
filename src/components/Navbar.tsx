import React, { useState } from 'react';
import { WifiOff, Globe, PhoneCall, Sparkles } from 'lucide-react';
import { LANGUAGES } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import { FEATURED_DIALECTS } from '../services/dialectsData';
import { UniversalDialectSelector } from './UniversalDialectSelector';
import type { Language } from '../types';
import type { Dialect } from '../services/dialectsData';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  selectedDialect?: Dialect;
  setSelectedDialect?: (dialect: Dialect) => void;
  isOfflineMode: boolean;
  setIsOfflineMode: (offline: boolean) => void;
  onOpenSOS: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLang,
  setLanguage,
  selectedDialect = FEATURED_DIALECTS[0],
  setSelectedDialect,
  isOfflineMode,
  setIsOfflineMode,
  onOpenSOS,
}) => {
  const [isDialectModalOpen, setIsDialectModalOpen] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const navItems = [
    { id: 'home', label: t.navHome },
    { id: 'dashboard', label: t.navDashboard },
    { id: 'map', label: t.navMap },
    { id: 'methodology', label: t.navMethodology },
    { id: 'feasibility', label: t.navFeasibility },
    { id: 'impact', label: t.navImpact },
    { id: 'research', label: t.navResearch },
    { id: 'sentinel', label: t.navSentinel },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2 mx-auto">
            <WifiOff className="w-3.5 h-3.5 animate-pulse" />
            <span>
              <strong>Mesh Sync Active</strong> — {t.meshActive}
            </span>
          </div>
          <button
            onClick={() => setIsOfflineMode(false)}
            className="text-slate-950 hover:underline text-[11px] font-mono cursor-pointer"
          >
            {t.reconnectOnline}
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo & High-Definition Brand Emblem */}
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md border border-emerald-500/40 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/giri_prahari_logo.png"
                alt="GIRI-PRAHARI Sentinel Emblem"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1F3864] whitespace-nowrap leading-none">
                GIRI-PRAHARI
              </span>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block whitespace-nowrap leading-tight mt-0.5">
                Hybrid Landslide Sentinel Network · NER
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 shrink">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-[#1F3864] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#1F3864] hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Tools: Language, Universal Dialect Selector, SOS Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Universal Dialect Selector Trigger Button */}
            <button
              onClick={() => setIsDialectModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>{selectedDialect.name}</span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-mono">
                {selectedDialect.state}
              </span>
            </button>

            {/* Main Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-3.5 h-3.5 absolute left-2 text-slate-400 pointer-events-none" />
              <select
                value={currentLang}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="pl-7 pr-2 py-1.5 bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1F3864] cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Red SOS Quick Trigger Button */}
            <button
              onClick={onOpenSOS}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer animate-pulse transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>SOS CALL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Universal Dialect Selector Modal */}
      <UniversalDialectSelector
        isOpen={isDialectModalOpen}
        onClose={() => setIsDialectModalOpen(false)}
        currentDialect={selectedDialect}
        onSelectDialect={(d) => {
          if (setSelectedDialect) setSelectedDialect(d);
          setIsDialectModalOpen(false);
        }}
      />
    </header>
  );
};
