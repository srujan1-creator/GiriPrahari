import React from 'react';
import { ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from '../services/translations';
import type { Language } from '../types';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
  onOpenSOS: () => void;
  currentLang?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  currentLang = 'en',
}) => {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#1F3864] to-[#1B3A6B] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          {/* Main Title / Tagline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight pt-4">
            {t.heroTagline}
          </h1>

          {/* Core Value Banner */}
          <div className="mt-4 mb-6">
            <span className="inline-block text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
              {t.coreValue}
            </span>
          </div>

          {/* Elevator Pitch */}
          <p className="text-slate-200 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            {t.elevatorPitch}
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="bg-[#1F6FEB] hover:bg-blue-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm cursor-pointer group"
            >
              <span>{t.viewDashboard}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl border border-white/20 transition-all text-sm cursor-pointer"
            >
              {t.seeHowItWorks}
            </button>
          </div>

          {/* Quick Stats Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-emerald-400 font-mono">128+</div>
              <div className="text-xs text-slate-300 font-medium mt-1">{t.dataSources}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-blue-300 font-mono">Sentinel-1</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Free InSAR Radar</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-amber-300 font-mono font-mono-num">&lt; 14s</div>
              <div className="text-xs text-slate-300 font-medium mt-1">IVR Alert Latency</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-purple-300 font-mono">19,569</div>
              <div className="text-xs text-slate-300 font-medium mt-1">Indexed Dialects</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The 3 Pillars of GIRI-PRAHARI
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl mx-auto">
            Combining ground telemetry, orbital satellite radar, and community foot patrols into one unified risk score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-4 font-black text-lg">
                01
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Ground Sensor Fusion
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Piezometers, MEMS accelerometers, and soil moisture probes transmit telemetry via solar-powered LORAWAN mesh nodes.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 mb-4 font-black text-lg">
                02
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                ESA Sentinel-1 InSAR Radar
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Open-access Synthetic Aperture Radar maps mm-level millimeter slope creep deformation across all 8 NER states.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 font-black text-lg">
                03
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Hyper-Local Dialect IVR Call
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Automated phone calls trigger in Khasi, Mizo, Assamese, and Nyishi to ring physical mobile phones during emergency landslide alerts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
