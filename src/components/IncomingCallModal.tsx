import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, ShieldAlert, Volume2, CheckCircle2 } from 'lucide-react';
import { TRANSLATIONS } from '../services/translations';
import { LANGUAGES, DEFAULT_DEMO_PHONE_NUMBER } from '../services/riskData';
import type { Language } from '../types';

interface IncomingCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
  hamletName: string;
  language: Language;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  isOpen,
  onClose,
  phoneNumber,
  hamletName,
  language,
}) => {
  const [callState, setCallState] = useState<'RINGING' | 'CONNECTED' | 'ENDED'>('RINGING');
  const [callDuration, setCallDuration] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const langName = LANGUAGES.find((l) => l.code === language)?.name || 'Local Language';

  /**
   * Play realistic telephone ring tone (dual-tone 440Hz + 480Hz US/India PSTN ring rhythm)
   */
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isOpen && callState === 'RINGING') {
      const startRing = () => {
        if (typeof window === 'undefined') return;
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) return;

          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.frequency.value = 440;
          osc2.frequency.value = 480;
          gain.gain.value = 0.12;

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start();
          osc2.start();

          // Ring rhythm: 2s sound, 2s silence
          setTimeout(() => {
            try {
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);
              setTimeout(() => {
                try { ctx.close(); } catch {}
              }, 150);
            } catch {}
          }, 2000);
        } catch {
          // Audio error handled
        }
      };

      startRing();
      interval = setInterval(startRing, 4000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch {}
        audioCtxRef.current = null;
      }
    };
  }, [isOpen, callState]);

  /**
   * Safe Web Speech API Synthesis Trigger with Browser Feature Detection Fallback
   */
  const speakWarningText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      console.warn('[Web Speech API] Speech Synthesis is not supported in this browser environment.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'bn' || language === 'as') utterance.lang = 'bn-IN';
      else if (language === 'ta') utterance.lang = 'ta-IN';
      else if (language === 'te') utterance.lang = 'te-IN';
      else utterance.lang = 'en-IN';

      window.speechSynthesis.speak(utterance);
    } catch {
      console.warn('[Web Speech API] Playback error caught gracefully.');
    }
  };

  // Call timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'CONNECTED') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  if (!isOpen) return null;

  const handleAcceptCall = () => {
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    setCallState('CONNECTED');
    const warningMsg = t.scriptPreview.replace('Sohra', hamletName);
    speakWarningText(warningMsg);
  };

  const handleEndCall = () => {
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCallState('ENDED');
    setTimeout(() => {
      onClose();
      setCallState('RINGING');
      setCallDuration(0);
    }, 1500);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      <div className="bg-gradient-to-b from-slate-900 via-[#0B132B] to-slate-950 border border-slate-700 text-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative flex flex-col items-center justify-between min-h-[480px]">
        {/* Top Header */}
        <div className="text-center space-y-1 w-full pt-2">
          <div className="inline-flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 px-3 py-1 rounded-full text-red-400 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>CRITICAL LANDSLIDE IVR CALL</span>
          </div>

          <div className="pt-3">
            <p className="text-xs text-slate-400 font-medium">INCOMING EMERGENCY VOICE CALL</p>
            <h2 className="text-xl font-extrabold text-white mt-1">
              GIRI-PRAHARI SENTINEL
            </h2>
            <p className="text-xs font-mono text-emerald-400 font-bold mt-0.5">
              +91-1800-GIRI-SOS
            </p>
          </div>
        </div>

        {/* Center Target Info & Pulse Ring */}
        <div className="my-6 text-center space-y-4 w-full">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            {callState === 'RINGING' && (
              <>
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-emerald-500/30 animate-pulse" />
              </>
            )}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center border-2 shadow-xl relative z-10 ${
              callState === 'CONNECTED'
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : callState === 'ENDED'
                ? 'bg-slate-800 border-slate-700 text-slate-400'
                : 'bg-emerald-950 border-emerald-500 text-emerald-400 animate-bounce'
            }`}>
              <Phone className="w-9 h-9" />
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-200">
              Recipient: <span className="text-white font-mono">{phoneNumber || DEFAULT_DEMO_PHONE_NUMBER}</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Sector: <span className="text-emerald-300 font-semibold">{hamletName}</span>
            </div>
            <div className="text-[11px] font-mono text-purple-300 mt-1">
              Voice Dialect: {langName}
            </div>
          </div>

          {/* Status Display Bar */}
          <div className="pt-2">
            {callState === 'RINGING' && (
              <div className="text-amber-400 text-xs font-mono font-bold animate-pulse flex items-center justify-center gap-1.5">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                RINGING... (Phone Ringtone Active)
              </div>
            )}

            {callState === 'CONNECTED' && (
              <div className="space-y-1">
                <div className="text-emerald-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  CALL IN PROGRESS — {formatTimer(callDuration)}
                </div>
                <p className="text-[11px] text-slate-300 italic bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-left mt-2 leading-relaxed">
                  “{t.scriptPreview.replace('Sohra', hamletName)}”
                </p>
              </div>
            )}

            {callState === 'ENDED' && (
              <div className="text-slate-400 text-xs font-mono font-bold">
                Call Ended · Telemetry Logged
              </div>
            )}
          </div>
        </div>

        {/* Bottom Call Controls (Decline / Answer) */}
        <div className="w-full pt-4 border-t border-slate-800 flex items-center justify-around">
          {callState === 'RINGING' && (
            <>
              <button
                onClick={handleEndCall}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <PhoneOff className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-slate-400">DECLINE</span>
              </button>

              <button
                onClick={handleAcceptCall}
                className="flex flex-col items-center gap-1 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/50 animate-pulse group-hover:scale-105 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-[11px] font-bold text-emerald-400">ANSWER CALL</span>
              </button>
            </>
          )}

          {callState === 'CONNECTED' && (
            <button
              onClick={handleEndCall}
              className="flex flex-col items-center gap-1 cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <PhoneOff className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold text-slate-400">END CALL</span>
            </button>
          )}

          {callState === 'ENDED' && (
            <div className="text-xs text-slate-500 font-mono py-2">
              Closing call window...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
