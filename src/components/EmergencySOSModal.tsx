import React, { useState } from 'react';
import { X, PhoneCall, Radio, ShieldAlert, Mic, Phone, AlertCircle } from 'lucide-react';
import { LANGUAGES, HAMLET_ZONES, DEFAULT_DEMO_PHONE_NUMBER } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import { IncomingCallModal } from './IncomingCallModal';
import type { Language } from '../types';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const [selectedHamletId, setSelectedHamletId] = useState('h-sohra');
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang);
  const [phoneNumber, setPhoneNumber] = useState(DEFAULT_DEMO_PHONE_NUMBER);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showCallReceiver, setShowCallReceiver] = useState(false);
  const [callStatusNotice, setCallStatusNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentHamlet = HAMLET_ZONES.find((h) => h.id === selectedHamletId) || HAMLET_ZONES[0];
  const t = TRANSLATIONS[selectedLang] || TRANSLATIONS.en;

  const handleBroadcast = async () => {
    setIsBroadcasting(true);
    setCallStatusNotice(null);

    const scriptText = t.scriptPreview.replace('Sohra', currentHamlet.name);

    try {
      // Attempt backend REST dispatch to telephony dispatcher (Twilio / Exotel gateway)
      const res = await fetch('http://localhost:3001/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phoneNumber.replace(/\s+/g, ''),
          message: scriptText,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setCallStatusNotice(`[Real GSM Call Dispatched] Twilio Call SID: ${data.callSid} ringing ${phoneNumber}`);
      } else if (data.requiresSetup) {
        setCallStatusNotice(`[Telephony Setup Notice] Twilio/Exotel credentials missing in server .env. In-browser audio simulation active below.`);
      }
    } catch {
      setCallStatusNotice(`[Telephony Status] Running in local simulation mode. Configure server/telephony.js with Twilio keys for outbound GSM PSTN calls.`);
    } finally {
      setTimeout(() => {
        setIsBroadcasting(false);
        setShowCallReceiver(true);
      }, 1200);
    }
  };

  const resetModal = () => {
    setIsBroadcasting(false);
    setShowCallReceiver(false);
    setCallStatusNotice(null);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 animate-pulse">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  GIRI-PRAHARI Emergency SOS
                  <span className="text-[10px] font-mono bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30">
                    CRITICAL
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Multi-Channel Voice IVR, SMS & Siren Broadcast Engine
                </p>
              </div>
            </div>
            <button
              onClick={resetModal}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            {/* Real PSTN Call Status Notice */}
            {callStatusNotice && (
              <div className="p-3 bg-amber-950/70 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span className="font-mono text-[11px] leading-relaxed">{callStatusNotice}</span>
              </div>
            )}

            {/* Target Phone Number Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Target Recipient Phone Number (Type Any Number):
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  IVR Dialing Target
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Type any recipient mobile number (e.g. +91 6300156232)..."
                  className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
                <span className="absolute right-3 top-2.5 text-[10px] font-mono text-slate-400">
                  India (+91)
                </span>
              </div>
            </div>

            {/* Target Hamlet Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Target Slope / Hamlet Zone:</span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">
                  35 High-Risk Hamlets Indexed
                </span>
              </label>
              <select
                value={selectedHamletId}
                onChange={(e) => setSelectedHamletId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs font-medium text-white focus:ring-2 focus:ring-red-500 cursor-pointer font-mono"
              >
                {HAMLET_ZONES.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} — {h.district}, {h.state} (Risk: {h.riskScore}/100 - {h.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Broadcast Language Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                <span>Primary Local IVR Language:</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  43 Languages Available
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium text-left transition-all cursor-pointer ${
                      selectedLang === lang.code
                        ? 'bg-red-950/60 border-red-500 text-red-200 shadow'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold truncate">{lang.name}</div>
                    <div className="text-[10px] opacity-75 truncate">{lang.nativeName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Message Preview Box */}
            <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span className="flex items-center gap-1 font-semibold text-red-400">
                  <Mic className="w-3.5 h-3.5 animate-pulse" />
                  Voice Synthesizer Preview ({LANGUAGES.find(l => l.code === selectedLang)?.name}):
                </span>
                <span className="font-mono text-[10px] text-emerald-400">AI Verified Script</span>
              </div>
              <p className="text-xs italic text-slate-200 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                “{t.scriptPreview.replace('Sohra', currentHamlet.name)}”
              </p>
            </div>

            {/* Live Metrics Pill */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Target Phone</div>
                <div className="font-mono font-bold text-emerald-400 text-[11px] truncate">{phoneNumber}</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Mesh Channels</div>
                <div className="font-mono font-bold text-emerald-400 text-xs">PSTN Voice + SMS</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-800">
                <div className="text-slate-400 text-[10px]">Sector Risk</div>
                <div className={`font-mono font-bold text-xs ${currentHamlet.riskScore >= 75 ? 'text-red-400' : 'text-amber-400'}`}>
                  {currentHamlet.riskScore}/100 ({currentHamlet.status})
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleBroadcast}
              disabled={isBroadcasting}
              className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isBroadcasting ? (
                <>
                  <Radio className="w-5 h-5 animate-spin text-white" />
                  <span>DIALING {phoneNumber} OVER GSM NETWORK...</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-5 h-5" />
                  <span>DISPATCH EMERGENCY PHONE CALL TO {phoneNumber}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Live Incoming Call Receiver Modal */}
      <IncomingCallModal
        isOpen={showCallReceiver}
        onClose={() => {
          setShowCallReceiver(false);
          onClose();
        }}
        phoneNumber={phoneNumber}
        hamletName={currentHamlet.name}
        language={selectedLang}
      />
    </>
  );
};
