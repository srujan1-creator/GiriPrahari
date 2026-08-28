import React, { useState } from 'react';
import { Radio, Network, Cpu, CheckCircle2, Volume2, Sparkles } from 'lucide-react';
import { METHODOLOGY_STEPS, TECH_STACK_TILES } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import type { Language } from '../types';

interface MethodologyPageProps {
  currentLang?: Language;
}

export const MethodologyPage: React.FC<MethodologyPageProps> = ({ currentLang = 'en' }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio': return <Radio className="w-5 h-5 text-emerald-600" />;
      case 'Network': return <Network className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-teal-600" />;
      case 'Volume2': return <Volume2 className="w-5 h-5 text-red-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      default: return <Radio className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#1F6FEB] bg-blue-100 px-3 py-1 rounded-full">
            {t.archTitle}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1F3864]">
            {t.archSubtitle}
          </h1>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            “A continuous loop — every layer feeds the next.” From ground vibration sensing to automated voice calls in Khasi, Assamese, Mizo, and Nyishi.
          </p>
        </div>

        {/* 6-Step Stepper Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {METHODOLOGY_STEPS.map((step) => {
            const isActive = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-white border-[#1F6FEB] shadow-xl ring-2 ring-blue-500/20 scale-102'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getStepIcon(step.iconName)}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      STEP 0{step.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-[#1F3864]">
                      {step.stage}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tech Stack Tiles Section */}
        <div className="space-y-6 pt-8 border-t border-slate-200">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-[#1F3864]">
              Technology & Component Architecture
            </h2>
            <p className="text-xs text-slate-500">
              Built with modern React 19, TypeScript, Express Telephony REST Services, and Leaflet Maps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TECH_STACK_TILES.map((tile, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-[#1F6FEB] uppercase tracking-wider block font-mono">
                  {tile.category}
                </span>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {tile.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
