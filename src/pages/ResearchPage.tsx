import React from 'react';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';
import { RESEARCH_SOURCES } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import type { Language } from '../types';

interface ResearchPageProps {
  currentLang?: Language;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ currentLang = 'en' }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
            {t.researchTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F3864]">
            {t.researchSub}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            GIRI-PRAHARI synthesizes published datasets and mapping protocols from India's premier geological, space, and disaster institutions.
          </p>
        </div>

        {/* Research Sources List */}
        <div className="space-y-4">
          {RESEARCH_SOURCES.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#1F6FEB] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h3 className="font-extrabold text-base text-[#1F3864] flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                {item.source}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Geological & Remote Sensing Citation Note */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <BookOpen className="w-5 h-5" />
            <span>Open Data & Open Science Compliance</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Satellite synthetic aperture radar (SAR) telemetry is sourced via Copernicus Open Access Hub (ESA Sentinel-1). Geological vulnerability indices conform to GSI NLSM 1:50,000 scale landslide susceptibility standards.
          </p>
        </div>
      </div>
    </div>
  );
};
