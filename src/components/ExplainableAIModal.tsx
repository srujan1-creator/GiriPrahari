import React from 'react';
import { X, Cpu, Layers } from 'lucide-react';
import type { SlopeNode } from '../types';

interface ExplainableAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  node: SlopeNode | null;
}

export const ExplainableAIModal: React.FC<ExplainableAIModalProps> = ({
  isOpen,
  onClose,
  node,
}) => {
  if (!isOpen || !node) return null;

  const weights = [
    { label: 'Ground Sensors (Vibration & Tilt)', weight: '40%', val: `${node.displacementMm} mm creep / ${node.vibrationHz} Hz`, color: 'bg-emerald-500' },
    { label: 'ESA Sentinel-1 Satellite InSAR', weight: '35%', val: `${node.sensors.satelliteFeeds} feeds active`, color: 'bg-blue-500' },
    { label: 'IMD Weather (Rainfall & Pore Moisture)', weight: '15%', val: `${node.rainfallMm24h} mm/24h · ${node.soilMoisturePct}% saturation`, color: 'bg-amber-500' },
    { label: 'Community Sentinel Ground Verification', weight: '10%', val: `${node.sensors.communityReports} reports verified`, color: 'bg-purple-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                Explainable AI (XAI) Audit Breakdown
                <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                  TRANSPARENT REASONING
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {node.name} ({node.district}, {node.state}) — Risk Score: <strong className="text-red-400 font-mono">{node.riskScore}/100</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4">
          {/* Key Contributing Factor */}
          <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-xl text-xs text-red-200">
            <div className="font-bold flex items-center gap-2 mb-1 text-red-300">
              <Layers className="w-4 h-4 text-red-400" />
              Primary Risk Trigger: High Pore Pressure & Slope Creep
            </div>
            <p className="leading-relaxed text-slate-300">
              Sustained 24h rainfall ({node.rainfallMm24h}mm) caused soil moisture saturation to reach {node.soilMoisturePct}%, pushing sub-surface displacement to {node.displacementMm}mm.
            </p>
          </div>

          {/* AI Bayesian Weight Allocation */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Bayesian Fusion Neural Weight Distribution:
            </h4>
            <div className="space-y-2">
              {weights.map((w, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{w.label}</span>
                    <span className="font-mono font-bold text-white">{w.weight}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${w.color} h-full rounded-full`} style={{ width: w.weight }} />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Current Input: {w.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer button */}
        <div className="mt-5 pt-3 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
