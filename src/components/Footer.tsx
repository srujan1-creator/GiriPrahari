import React from 'react';
import { Shield, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: About */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <div className="w-7 h-7 rounded bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-xs">
              GP
            </div>
            <span>GIRI-PRAHARI</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-md">
            The AI + Nature + Community Hybrid Landslide Sentinel Network for India’s North Eastern Region (NER). Fusing ground vibration sensors, satellite InSAR, and village volunteers into one live risk score.
          </p>
          <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Hybrid Landslide Sentinel Network · Team HAPPY</span>
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActiveTab('home')} className="hover:text-emerald-400 cursor-pointer">
                Home / Concept
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 cursor-pointer">
                Live Risk Dashboard
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('map')} className="hover:text-emerald-400 cursor-pointer">
                Interactive NER Regional Map
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('methodology')} className="hover:text-emerald-400 cursor-pointer">
                6-Step Methodology
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('sentinel')} className="hover:text-emerald-400 cursor-pointer">
                Field Sentinel App
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Research & Datasets */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Open Data Feeds
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <a href="https://gsi.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                <span>Geological Survey of India (GSI)</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                <span>ISRO Bhuvan Landslide Atlas</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://mausam.imd.gov.in" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                <span>IMD Weather Telemetry API</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
            <li>
              <a href="https://dataspace.copernicus.eu" target="_blank" rel="noreferrer" className="hover:text-emerald-400 flex items-center gap-1">
                <span>ESA Sentinel-1 InSAR Radar</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p className="font-semibold text-slate-300">
          “Empowering communities. AI for a safer tomorrow.”
        </p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for the North Eastern Region of India
        </p>
      </div>
    </footer>
  );
};
