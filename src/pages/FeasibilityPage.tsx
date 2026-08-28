import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { FEASIBILITY_SNAPSHOTS, RISK_MITIGATION_ROWS } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import type { Language } from '../types';

interface FeasibilityPageProps {
  currentLang?: Language;
}

export const FeasibilityPage: React.FC<FeasibilityPageProps> = ({ currentLang = 'en' }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {t.feasibilityTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F3864]">
            {t.feasibilitySub}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Designed for rapid institutional adoption, low capital expenditure, and zero-downtime resilience in high-altitude monsoon conditions.
          </p>
        </div>

        {/* Feasibility Snapshot (3 Green Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEASIBILITY_SNAPSHOTS.map((snap) => (
            <div
              key={snap.id}
              className="bg-[#E2F0D9] border border-emerald-300 p-6 rounded-2xl flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-extrabold text-base text-[#1F3864]">
                  {snap.title}
                </h3>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {snap.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Risk → Mitigation Mapping Table (RISK in red/pink on left, arrow, FIX in blue on right) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-extrabold text-[#1F3864]">
                Risk → Mitigation Mapping Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Proactive engineering solutions mapped to real-world deployment challenges in NER.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">4 Core Risk Vectors</span>
          </div>

          <div className="space-y-4">
            {RISK_MITIGATION_ROWS.map((row) => (
              <div
                key={row.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch"
              >
                {/* RISK Card (Red/Pink #FBE7E6) */}
                <div className="md:col-span-5 bg-[#FBE7E6] border border-red-200 p-5 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-600/10 text-red-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                      RISK FACTOR 0{row.id}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {row.risk}
                    </p>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="md:col-span-2 flex items-center justify-center text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                {/* FIX Card (Light Blue #E7F0FB) */}
                <div className="md:col-span-5 bg-[#E7F0FB] border border-blue-200 p-5 rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-[#1F6FEB] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                      ENGINEERED MITIGATION / FIX
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {row.fix}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
