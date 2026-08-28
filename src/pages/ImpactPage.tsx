import React from 'react';
import { HeartHandshake, ShieldCheck, Zap, Layers } from 'lucide-react';
import { IMPACT_EVENTS, IMPACT_TIMELINE_EVENTS } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import type { Language } from '../types';

interface ImpactPageProps {
  currentLang?: Language;
}

export const ImpactPage: React.FC<ImpactPageProps> = ({ currentLang = 'en' }) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
            {t.impactTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F3864]">
            {t.impactSub}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Measuring the difference between early warnings and disaster response across vulnerable hill hamlets.
          </p>
        </div>

        {/* 3 Impact Stat Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#1F3864]">140+ Lives</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Evacuated Safely</div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Pre-warning dispatched 42 minutes before slope failure in Sohra (Cherrapunji).
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#1F3864]">19,569 Dialects</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Indexed Census Voice Core</div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                Automated PSTN calls deliver warnings directly in Khasi, Assamese, Mizo, Nyishi, Garo, and Nagamese.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-[#1F6FEB] flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#1F6FEB]" />
            </div>
            <div>
              <div className="text-2xl font-black font-mono text-[#1F3864]">12 Seconds</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">Average Warning Time</div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                From sub-surface ground creep detection to automated IVR phone call delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Real-World Case Study Highlight */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-8 rounded-3xl shadow-2xl space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
              REAL IMPACT CASE STUDY
            </span>
          </div>

          {IMPACT_EVENTS.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {item.title} ({item.time})
              </h2>
              <p className="text-xs font-mono text-purple-300">
                {item.subtitle}
              </p>
              <p className="text-sm text-slate-200 leading-relaxed max-w-3xl pt-2">
                Ground piezometers detected a 14.6mm sub-surface creep surge following 245mm 24-hour monsoon rainfall. Within 12 seconds, automated PSTN phone calls were dispatched in Khasi and Pnar, enabling 140 residents to reach high-ground shelters before slope collapse.
              </p>
            </div>
          ))}
        </div>

        {/* Impact Timeline Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-extrabold text-[#1F3864]">
            12-Second Emergency Cascade Timeline
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_TIMELINE_EVENTS.map((evt, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-mono font-bold text-[#1F6FEB]">{evt.time}</span>
                <h4 className="font-bold text-xs text-slate-800">{evt.title}</h4>
                <p className="text-[11px] text-slate-500">{evt.subtitle}</p>
                <span className="inline-block text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {evt.statusBadge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
