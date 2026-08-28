import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Camera, Mic, MapPin, Send, CheckCircle2, AlertTriangle, Square, Play } from 'lucide-react';
import { FEATURED_DIALECTS } from '../services/dialectsData';
import { INITIAL_SLOPE_NODES } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import type { Dialect } from '../services/dialectsData';
import type { Language } from '../types';

interface SentinelAppPageProps {
  onOpenSOS: () => void;
  selectedDialect?: Dialect;
  setSelectedDialect?: (d: Dialect) => void;
  currentLang?: Language;
}

// Custom Leaflet GPS marker icon for Sentinel Field app map
const gpsMarkerIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <div class="w-8 h-8 rounded-full bg-red-500/40 animate-ping absolute"></div>
      <div class="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-lg"></div>
    </div>
  `,
  className: 'custom-gps-marker',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Helper component to auto-pan map view when coordinates change
const MapRecenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  map.setView(center, 13);
  return null;
};

export const SentinelAppPage: React.FC<SentinelAppPageProps> = ({
  onOpenSOS,
  selectedDialect = FEATURED_DIALECTS[0],
  setSelectedDialect,
  currentLang = 'en',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [voiceNoteAudio, setVoiceNoteAudio] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [viewMode, setViewMode] = useState<'PHOTO' | 'MAP'>('PHOTO');

  const activeDialect = selectedDialect || FEATURED_DIALECTS[0];
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  // Dynamically derive Sector Name, GPS coordinates, and Hamlet matching selected dialect
  const getSectorInfo = (dialect: Dialect) => {
    const node = INITIAL_SLOPE_NODES.find(
      (n) => n.state.toLowerCase() === dialect.state.toLowerCase() ||
             dialect.name.toLowerCase().includes(n.name.toLowerCase()) ||
             n.name.toLowerCase().includes(dialect.state.toLowerCase())
    ) || INITIAL_SLOPE_NODES[0];

    return {
      sectorName: `${node.name} Sector B`,
      lat: node.lat,
      lng: node.lng,
      gpsString: `${node.lat.toFixed(4)}° N, ${node.lng.toFixed(4)}° E`,
      nodeName: node.name,
      state: node.state,
    };
  };

  const sector = getSectorInfo(activeDialect);

  const handleDialectChange = (dialectId: string) => {
    const found = FEATURED_DIALECTS.find((d) => d.id === dialectId);
    if (found && setSelectedDialect) {
      setSelectedDialect(found);
    }
  };

  const handleToggleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setRecordTimer(0);
      const interval = setInterval(() => {
        setRecordTimer((prev) => {
          if (prev >= 4) {
            clearInterval(interval);
            setIsRecording(false);
            setVoiceNoteAudio(`voice_observation_${activeDialect.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_04.wav`);
            return 5;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsRecording(false);
    }
  };

  const handlePlayVoiceNote = () => {
    setIsPlayingAudio(true);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = activeDialect.phoneticSample || `Voice observation recorded in ${activeDialect.name}: Slope creep tension rift 14.2mm verified.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 3000);
    }
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);

    if (onOpenSOS) {
      onOpenSOS();
    }

    // Dispatch verified report to Telegram bot & telephony API
    try {
      const alertMsg = `🚨 *VERIFIED SENTINEL FIELD REPORT SUBMITTED*\n\n📍 *Sector*: ${sector.sectorName} (${sector.state})\n📸 *Ground Evidence*: Tension Rift 14.2mm Confirmed\n🗣️ *Voice Observation*: Dialect (${activeDialect.name})\n⚡ *AI Model Weight Boost*: +10% Confidence\n\nSTATUS: Transmitted via Mesh Network!`;
      
      await fetch('http://localhost:3001/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertMsg }),
      });

      await fetch('http://localhost:3001/api/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: alertMsg }),
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setReportSubmitted(false);
      setVoiceNoteAudio(null);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-md w-full space-y-6">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            {t.sentinelTitle}
          </span>
          <h1 className="text-2xl font-black text-[#1F3864]">
            {t.sentinelSub}
          </h1>
          <p className="text-xs text-slate-600">
            Field-tested offline reporting tool for village volunteers across remote hamlets.
          </p>
        </div>

        {/* Mobile Phone Device Frame */}
        <div className="bg-slate-900 text-white rounded-[40px] p-4 border-8 border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Top Notch / Camera Pill */}
          <div className="w-28 h-4 bg-slate-800 rounded-b-xl mx-auto mb-3" />

          {/* Dynamic App Header */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                S4
              </div>
              <div>
                <div className="text-xs font-bold text-white">Sentinel Patrol #04</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold transition-all">
                  {sector.sectorName}
                </div>
              </div>
            </div>

            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Mesh Synced
            </span>
          </div>

          {/* Submitted Success Banner */}
          {reportSubmitted ? (
            <div className="bg-emerald-950 border border-emerald-500/50 p-5 rounded-2xl text-center space-y-3 animate-fadeIn my-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {t.reportTransmitted}
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  AI Bayesian risk weight boosted for {sector.sectorName}. Telephony IVR voice alert dispatched in {activeDialect.name}.
                </p>
              </div>
              <div className="text-[10px] font-mono text-emerald-400 bg-slate-900 p-2 rounded-xl border border-emerald-800">
                Packet Hash: 0x8a92...e411 (Mesh Hop #2)
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-4">
              {/* Ground Sign Evidence View */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    {t.groundEvidence}
                  </span>

                  {/* Toggle between High-Def Photo vs Live Leaflet Map */}
                  <div className="bg-slate-900 p-1 rounded-lg border border-slate-800 flex text-[10px]">
                    <button
                      type="button"
                      onClick={() => setViewMode('PHOTO')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        viewMode === 'PHOTO' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Camera className="w-3 h-3" />
                      {t.fieldPhoto}
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('MAP')}
                      className={`px-2 py-0.5 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                        viewMode === 'MAP' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <MapPin className="w-3 h-3" />
                      {t.gpsMap}
                    </button>
                  </div>
                </div>

                {viewMode === 'PHOTO' ? (
                  /* View 1: Real Mountain Tension Rift Crack Photo */
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 group shadow-inner">
                    <img
                      src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=800&q=80"
                      alt="Ground slope tension rift evidence"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Semi-transparent dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Tension Crack Vector Highlight Graphic */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 120">
                      <path
                        d="M 40 30 L 65 55 L 90 45 L 120 80 L 155 70"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        className="animate-pulse"
                      />
                      <line x1="30" y1="90" x2="180" y2="90" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="75" cy="90" r="5" fill="#10B981" />
                      <circle cx="150" cy="90" r="5" fill="#10B981" />
                    </svg>

                    {/* Top Alert Badge */}
                    <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                      <span className="bg-red-950/90 text-red-300 text-[10px] font-extrabold font-mono px-2.5 py-1 rounded-lg border border-red-500/50 shadow flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                        Tension Rift: 14.2mm
                      </span>
                    </div>

                    {/* Top Right Confirmation Status */}
                    <div className="absolute top-2 right-2 z-20">
                      <span className="bg-emerald-950/90 text-emerald-300 text-[10px] font-mono font-bold px-2 py-1 rounded-lg border border-emerald-500/40 shadow flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Photo Captured
                      </span>
                    </div>

                    {/* Dynamic Bottom Geo-tag Overlay */}
                    <div className="absolute bottom-2 left-2 right-2 z-20 text-[10px] font-mono text-emerald-300 bg-slate-950/90 px-2.5 py-1.5 rounded-lg border border-emerald-500/30 flex items-center justify-between shadow-md backdrop-blur">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        GPS: {sector.gpsString}
                      </span>
                      <span className="text-slate-400 font-bold">{sector.sectorName}</span>
                    </div>
                  </div>
                ) : (
                  /* View 2: Live Dynamic Leaflet OpenStreetMap GPS Map */
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-800 shadow-inner">
                    <MapContainer
                      center={[sector.lat, sector.lng]}
                      zoom={13}
                      scrollWheelZoom={false}
                      zoomControl={false}
                      className="w-full h-full z-0"
                      style={{ height: '100%', width: '100%' }}
                    >
                      <MapRecenter center={[sector.lat, sector.lng]} />
                      <TileLayer
                        attribution='&copy; OpenStreetMap'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[sector.lat, sector.lng]} icon={gpsMarkerIcon}>
                        <Popup>
                          <div className="p-1 font-sans text-xs font-bold text-slate-900">
                            {sector.sectorName} (GPS {sector.gpsString})
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>

                    {/* Dynamic GPS Bottom Badge */}
                    <div className="absolute bottom-2 left-2 right-2 z-20 text-[10px] font-mono text-white bg-slate-950/90 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center justify-between shadow backdrop-blur">
                      <span className="flex items-center gap-1 font-bold text-emerald-400">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        GPS Lock: {sector.sectorName}
                      </span>
                      <span className="text-slate-400">Accurate to 3m</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Local Voice Note Recorder */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-purple-400" />
                    {t.localVoiceObs}
                  </span>
                  <select
                    value={activeDialect.id}
                    onChange={(e) => handleDialectChange(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-xs font-bold rounded px-2.5 py-1 text-emerald-400 focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[170px] truncate cursor-pointer"
                  >
                    {FEATURED_DIALECTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.state})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleToggleRecord}
                  className={`w-full p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isRecording
                      ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {isRecording ? <Square className="w-4 h-4 text-red-500 fill-red-500" /> : <Mic className="w-4 h-4" />}
                  <span>{isRecording ? `${t.recording} 00:0${recordTimer}` : t.tapToRecord}</span>
                </button>

                {/* Playback Voice Note Box */}
                {voiceNoteAudio && (
                  <div className="p-2.5 bg-purple-950/40 border border-purple-500/30 rounded-xl flex items-center justify-between text-xs text-purple-200 animate-fadeIn">
                    <span className="font-mono text-[11px] truncate">{voiceNoteAudio}</span>
                    <button
                      type="button"
                      onClick={handlePlayVoiceNote}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      {isPlayingAudio ? 'Playing...' : 'Play Audio'}
                    </button>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-sm py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>{t.transmitReport}</span>
              </button>
            </form>
          )}

          {/* Bottom Device Home Bar */}
          <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
};
