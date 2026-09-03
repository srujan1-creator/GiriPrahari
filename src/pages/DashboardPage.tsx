import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Mountain,
  Shield,
  CheckCircle,
  Bell,
  Radio,
  Phone,
  MessageSquare,
  Volume2,
  Globe,
  Maximize2,
  Cpu,
  PhoneCall,
  AlertTriangle,
  FileText,
  BarChart2,
  X,
  Sparkles,
  CheckCheck
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { SlopeNode, Language } from '../types';
import { INITIAL_SLOPE_NODES, INITIAL_ALERTS, generateRealtime7DayTrend } from '../services/riskData';
import { TRANSLATIONS } from '../services/translations';
import { ExplainableAIModal } from '../components/ExplainableAIModal';
import { AutoDialerWidget } from '../components/AutoDialerWidget';
import { syncNodesWithRealLiveData } from '../services/realDataService';
import { logContinuousTelemetry, getContinuousTelemetry, exportTelemetryCSV, type TelemetryRecord } from '../services/supabaseClient';
import { generateComprehensiveTelemetry, streamAllMultiSignalDataToDatabase, getInitialComprehensiveTelemetry, type ComprehensiveNodeTelemetry } from '../services/unifiedDataPipeline';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  currentLang: Language;
  onOpenSOS: () => void;
}

// Create custom Leaflet marker icons
const createCustomMarkerIcon = (status: 'SAFE' | 'WATCH' | 'DANGER', score: number, isSelected: boolean) => {
  const colorClass =
    status === 'DANGER'
      ? 'bg-red-600 border-red-400 text-white shadow-red-900/80'
      : status === 'WATCH'
      ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-900/80'
      : 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/80';

  const ringClass =
    status === 'DANGER'
      ? 'bg-red-500/40 animate-ping'
      : status === 'WATCH'
      ? 'bg-amber-500/30'
      : 'bg-emerald-500/20';

  const scaleClass = isSelected ? 'scale-125 z-50 ring-4 ring-white' : 'hover:scale-110';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group transition-transform ${scaleClass}">
      <div class="w-9 h-9 rounded-full absolute -top-1 -left-1 ${ringClass}"></div>
      <div class="px-2 py-0.5 rounded-xl border-2 font-mono font-black text-xs shadow-2xl flex items-center gap-1 whitespace-nowrap ${colorClass}">
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>${score}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [36, 26],
    iconAnchor: [18, 13],
  });
};

// Helper to automatically recalculate Leaflet map canvas dimensions and prevent black screen
const MapAutoResize = () => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);
  return null;
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  setActiveTab,
  currentLang,
  onOpenSOS,
}) => {
  const [nodes, setNodes] = useState<SlopeNode[]>(INITIAL_SLOPE_NODES);
  const alerts = INITIAL_ALERTS;
  const [selectedNode, setSelectedNode] = useState<SlopeNode | null>(null);
  const [mapMode, setMapMode] = useState<'terrain' | 'satellite' | 'carto'>('satellite');
  const [activeChannelFilter, setActiveChannelFilter] = useState<string | null>(null);
  const [explainNode, setExplainNode] = useState<SlopeNode | null>(null);
  const [liveClock, setLiveClock] = useState<string>('');
  const [trendData, setTrendData] = useState(() => generateRealtime7DayTrend());
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(8);
  const [isRealDataSyncing, setIsRealDataSyncing] = useState(false);
  const [realDataLastSync, setRealDataLastSync] = useState<string>('Live Streaming');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [selectedDataTab, setSelectedDataTab] = useState<'all' | 'isro' | 'satellite' | 'ground' | 'weather' | 'ai'>('all');
  const [telemetryLogs, setTelemetryLogs] = useState<TelemetryRecord[]>(() => getContinuousTelemetry());
  const [multiSignalData, setMultiSignalData] = useState<ComprehensiveNodeTelemetry[]>(() => getInitialComprehensiveTelemetry());

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const dangerCount = nodes.filter(n => n.status === 'DANGER').length;
  const watchCount = nodes.filter(n => n.status === 'WATCH').length;
  const safeCount = nodes.filter(n => n.status === 'SAFE').length;

  const dangerNodes = nodes.filter(n => n.status === 'DANGER');

  // Real Multi-Signal Data Ingestion (Satellite InSAR + Ground IoT + Open-Meteo Weather)
  useEffect(() => {
    let isMounted = true;

    const ingestComprehensiveData = async () => {
      setIsRealDataSyncing(true);
      try {
        const fullStream = await generateComprehensiveTelemetry();
        const syncedNodes = await syncNodesWithRealLiveData(nodes);

        if (isMounted) {
          setNodes(syncedNodes);
          setMultiSignalData(fullStream);
          setRealDataLastSync(new Date().toLocaleTimeString());
          await streamAllMultiSignalDataToDatabase(fullStream);
          await logContinuousTelemetry(syncedNodes);
          setTelemetryLogs(getContinuousTelemetry());
        }
      } catch (err) {
        console.warn('[MultiSignal Pipeline] Sync notice:', err);
      } finally {
        if (isMounted) setIsRealDataSyncing(false);
      }
    };

    ingestComprehensiveData();
    const interval = setInterval(ingestComprehensiveData, 20000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Generate ultra-clean Spider Web Mesh Topology (Radial Hub Spokes + Ring Lattice)
  const meshLines: { positions: [number, number][]; color: string }[] = [];
  const addedPairs = new Set<string>();

  // 1. Radial Hub Spokes from Shillong Central Relay (Node IVR)
  const hubNode = nodes.find(n => n.id === 'node-ivr') || nodes[0];
  nodes.forEach((node) => {
    if (node.id !== hubNode.id) {
      const pairKey = [node.id, hubNode.id].sort().join('--');
      if (!addedPairs.has(pairKey)) {
        addedPairs.add(pairKey);
        const isDangerLink = node.status === 'DANGER' || hubNode.status === 'DANGER';
        meshLines.push({
          positions: [[node.lat, node.lng], [hubNode.lat, hubNode.lng]],
          color: isDangerLink ? '#EF4444' : '#22C55E',
        });
      }
    }
  });

  // 2. Outer Spider Web Concentric Ring Lattice (Connect each node to 2 nearest neighbors)
  nodes.forEach((n1) => {
    const sortedByDist = nodes
      .filter((n2) => n2.id !== n1.id && n2.id !== hubNode.id)
      .map((n2) => ({ node: n2, dist: Math.hypot(n1.lat - n2.lat, n1.lng - n2.lng) }))
      .sort((a, b) => a.dist - b.dist);

    sortedByDist.slice(0, 2).forEach(({ node: n2 }) => {
      const pairKey = [n1.id, n2.id].sort().join('--');
      if (!addedPairs.has(pairKey)) {
        addedPairs.add(pairKey);
        const isDangerLink = n1.status === 'DANGER' || n2.status === 'DANGER';
        meshLines.push({
          positions: [[n1.lat, n1.lng], [n2.lat, n2.lng]],
          color: isDangerLink ? '#EF4444' : '#22C55E',
        });
      }
    });
  });

  // Live Clock formatting
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setLiveClock(`${timeStr} · ${dateStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic Real-Time Telemetry Simulator for sub-millimeter micro-creep
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prevNodes) =>
        prevNodes.map((n) => {
          if (n.id === 'node-sohra') {
            const shift = +(14 + Math.random() * 0.8).toFixed(1);
            return { ...n, displacementMm: shift };
          }
          return n;
        })
      );

      setTrendData((prev) =>
        prev.map((d, i) => (i === prev.length - 1 ? { ...d, score: Math.min(100, Math.max(70, d.score + (Math.random() > 0.5 ? 1 : -1))) } : d))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Filter alerts by channel
  const filteredAlerts = activeChannelFilter
    ? alerts.filter((a) => a.channel === activeChannelFilter)
    : alerts;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-100 font-sans selection:bg-purple-500 selection:text-white flex flex-col">
      {/* Header Bar (Dark) */}
      <header className="bg-[#0E1420] border-b border-white/10 px-4 py-3 flex items-center justify-between shadow-md relative z-50">
        {/* Left Header Branding */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white shadow">
              <Mountain className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-bold text-sm tracking-tight text-white">
              GIRI-PRAHARI — <span className="text-slate-400 font-normal">AI-Powered Risk Intelligence</span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          {/* LIVE Indicator */}
          <div className="flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 px-2.5 py-1 rounded-full text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold">LIVE RISK DASHBOARD</span>
          </div>
        </div>

        {/* Right Header Status Bar */}
        <div className="flex items-center gap-3">
          {/* Real Live Data Stream Inspector Button */}
          <button
            onClick={() => {
              setTelemetryLogs(getContinuousTelemetry());
              setIsDataModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/50 hover:bg-purple-900/60 text-purple-300 px-3 py-1 rounded-full text-xs font-mono transition-all cursor-pointer shadow-lg shadow-purple-950/40"
            title="Inspect continuous real-time telemetry stream & database records"
          >
            <span className={`w-2 h-2 rounded-full ${isRealDataSyncing ? 'bg-amber-400 animate-ping' : 'bg-purple-400 animate-pulse'}`} />
            <span className="font-bold">🛰️ REAL DATA STREAM</span>
            <span className="text-[10px] bg-purple-800/80 px-1.5 py-0.2 rounded font-bold text-white">
              {telemetryLogs.length} Records
            </span>
          </button>

          {/* Operational Pill */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>SYSTEM STATUS — Real Satellite Models Ingesting ({nodes.length} Nodes)</span>
          </div>

          {/* Live Clock */}
          <div className="text-xs font-mono font-medium text-slate-400 bg-slate-900/80 px-3 py-1 rounded-lg border border-white/5 hidden sm:block">
            {liveClock}
          </div>

          {/* Interactive Notification Bell with Live Emergency Drawer */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer relative"
              title="View Emergency Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold font-mono rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Live Interactive Emergency Alerts Dropdown Menu */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 animate-bounce" />
                    <h4 className="font-extrabold text-sm text-white">
                      Live Emergency Notifications ({dangerNodes.length})
                    </h4>
                  </div>
                  <button
                    onClick={() => setUnreadCount(0)}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark Read
                  </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {dangerNodes.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNode(n);
                        setIsNotificationsOpen(false);
                      }}
                      className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl hover:border-red-400 transition-colors cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold text-white">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          {n.name} ({n.state})
                        </span>
                        <span className="font-mono bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded">
                          {n.riskScore}/100 DANGER
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        Slope Creep: <strong className="text-red-400 font-mono">{n.displacementMm}mm</strong> · Rain: <strong className="text-amber-400 font-mono">{n.rainfallMm24h}mm</strong>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {n.recentAlerts[0] || 'CRITICAL: Evacuation IVR Call placed'}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Dispatch Trigger Button */}
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    onOpenSOS();
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl shadow flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>TRIGGER TELEGRAM VOICE CALL & EMERGENCY ALERT</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Dashboard Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Nav */}
        <aside className="w-16 bg-[#0B0F14] border-r border-white/10 flex flex-col items-center justify-between py-4 shrink-0">
          <div className="space-y-4 text-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              title="Dashboard"
              className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition-colors cursor-pointer"
            >
              <BarChart2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveTab('map')}
              title="Live Regional Map"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Globe className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('methodology')}
              title="Methodology"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Cpu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('sentinel')}
              title="Sentinel Field App"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Radio className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('research')}
              title="Research Sources"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <FileText className="w-5 h-5" />
            </button>

            <button
              onClick={() => setExplainNode(nodes[0])}
              title="Explainable AI"
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Bottom Pinned Emergency SOS Button */}
          <button
            onClick={onOpenSOS}
            title="Emergency Quick Call"
            className="w-10 h-10 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white flex items-center justify-center shadow-lg animate-pulse cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
          </button>
        </aside>

        {/* Dashboard Main Grid Area */}
        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Top Stat Row (4 KPI Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Safe KPI */}
            <div className="dash-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  {t.safeSlopes}
                </span>
                <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{safeCount}</div>
                <span className="text-[11px] font-semibold text-emerald-400/90 font-mono">
                  +20% vs yesterday
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
            </div>

            {/* Watch KPI */}
            <div className="dash-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  {t.watchHamlets}
                </span>
                <div className="text-2xl font-black font-mono text-amber-400 mt-1">{watchCount}</div>
                <span className="text-[11px] font-semibold text-amber-400/90 font-mono">
                  +10% vs yesterday
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
            </div>

            {/* Danger KPI */}
            <div className="dash-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  {t.dangerSlopes}
                </span>
                <div className="text-2xl font-black font-mono text-red-400 mt-1">{dangerCount}</div>
                <span className="text-[11px] font-semibold text-red-400/90 font-mono">
                  All 8 NER States Monitored
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            {/* Total Alerts KPI */}
            <div className="dash-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  {t.totalAlertsToday}
                </span>
                <div className="text-2xl font-black font-mono text-purple-400 mt-1">128</div>
                <span className="text-[11px] font-semibold text-purple-400/90 font-mono">
                  IVR + SMS + Siren
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Radio className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Autonomous AI Landslide Phone Dispatcher Control Panel */}
          <AutoDialerWidget onOpenSOS={onOpenSOS} />

          {/* Main Map + Alert Feed Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Real Interactive Leaflet Geographic Map (2 Cols) */}
            <div className="lg:col-span-2 bg-[#0E1420] rounded-2xl border border-white/10 p-4 flex flex-col relative overflow-hidden min-h-[480px]">
              {/* Map Header Toolbar */}
              <div className="flex items-center justify-between mb-3 z-10">
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    {t.liveMapTitle} — {nodes.length} SENSOR NODES
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Interactive OpenStreetMap & InSAR Satellite Overlay
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex text-xs">
                    <button
                      onClick={() => setMapMode('satellite')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                        mapMode === 'satellite' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🛰️ Esri Satellite
                    </button>
                    <button
                      onClick={() => setMapMode('terrain')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                        mapMode === 'terrain' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🗺️ OpenStreetMap
                    </button>
                    <button
                      onClick={() => setMapMode('carto')}
                      className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                        mapMode === 'carto' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌌 Carto Dark
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveTab('map')}
                    title="Expand Map"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Leaflet Geographic Map Container */}
              <div className="flex-1 relative rounded-xl border border-white/5 overflow-hidden min-h-[380px]">
                <MapContainer
                  center={[25.8, 93.2]}
                  zoom={7}
                  scrollWheelZoom={true}
                  className="w-full h-full z-0"
                  style={{ height: '100%', width: '100%', background: '#090D12' }}
                >
                  <MapAutoResize />
                  <TileLayer
                    key={mapMode}
                    attribution={
                      mapMode === 'satellite'
                        ? 'Tiles &copy; Esri'
                        : mapMode === 'carto'
                        ? '&copy; CartoDB Dark Matter'
                        : '&copy; OpenStreetMap'
                    }
                    url={
                      mapMode === 'satellite'
                        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                        : mapMode === 'carto'
                        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                    maxZoom={18}
                  />

                  {/* Connecting Spider Web Mesh Lines */}
                  {meshLines.map((line, idx) => (
                    <Polyline
                      key={idx}
                      positions={line.positions}
                      pathOptions={{ color: line.color, weight: 2, dashArray: '5 3', opacity: 0.8 }}
                    />
                  ))}

                  {/* Live Node Markers */}
                  {nodes.map((node) => {
                    const isSelected = selectedNode?.id === node.id;
                    const icon = createCustomMarkerIcon(node.status, node.riskScore, isSelected);

                    return (
                      <Marker
                        key={node.id}
                        position={[node.lat, node.lng]}
                        icon={icon}
                        eventHandlers={{
                          click: () => setSelectedNode(node),
                        }}
                      >
                        <Popup>
                          <div className="p-1 font-sans text-slate-900">
                            <div className="font-extrabold text-sm">{node.name} ({node.status})</div>
                            <div className="text-xs text-slate-600">{node.district}, {node.state}</div>
                            <div className="text-xs font-mono mt-1 font-bold">Creep: {node.displacementMm}mm</div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>

                {/* Selected Node Drawer Popup */}
                {selectedNode && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-700 p-4 rounded-xl shadow-2xl z-40 backdrop-blur flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-white text-sm">{selectedNode.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                            selectedNode.status === 'DANGER'
                              ? 'bg-red-500 text-white'
                              : selectedNode.status === 'WATCH'
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-emerald-500 text-slate-950'
                          }`}
                        >
                          {selectedNode.status} (Score: {selectedNode.riskScore}/100)
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Creep: <span className="text-red-400 font-mono font-bold">{selectedNode.displacementMm}mm</span> ·
                        Rain: <span className="text-amber-400 font-mono font-bold">{selectedNode.rainfallMm24h}mm</span> ·
                        Moisture: <span className="text-blue-400 font-mono font-bold">{selectedNode.soilMoisturePct}%</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExplainNode(selectedNode)}
                        className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Explain AI
                      </button>
                      <button
                        onClick={() => setSelectedNode(null)}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Alert Feed Column (1 Col) */}
            <div className="bg-[#0E1420] rounded-2xl border border-white/10 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    {t.alertFeedTitle}
                    <span className="text-xs font-mono text-purple-400 font-normal">({filteredAlerts.length})</span>
                  </h3>
                  <button
                    onClick={() => setActiveChannelFilter(null)}
                    className="text-xs text-purple-400 hover:underline cursor-pointer"
                  >
                    {t.viewAll}
                  </button>
                </div>

                {/* Communication Channel Filter Bar */}
                <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-semibold mb-3">
                  <button
                    onClick={() => setActiveChannelFilter(activeChannelFilter === 'IVR' ? null : 'IVR')}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      activeChannelFilter === 'IVR' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3 h-3" />
                    IVR
                  </button>
                  <button
                    onClick={() => setActiveChannelFilter(activeChannelFilter === 'SMS' ? null : 'SMS')}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      activeChannelFilter === 'SMS' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <MessageSquare className="w-3 h-3" />
                    SMS
                  </button>
                  <button
                    onClick={() => setActiveChannelFilter(activeChannelFilter === 'SIREN' ? null : 'SIREN')}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      activeChannelFilter === 'SIREN' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3 h-3" />
                    Siren
                  </button>
                  <button
                    onClick={() => setActiveChannelFilter(activeChannelFilter === 'LOCAL' ? null : 'LOCAL')}
                    className={`py-1.5 rounded flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      activeChannelFilter === 'LOCAL' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    Local
                  </button>
                </div>

                {/* Scrollable Feed Cards */}
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {filteredAlerts.map((alert) => {
                    const descText = alert.description[currentLang] || alert.description.en;
                    return (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl border transition-all ${
                          alert.status === 'DANGER'
                            ? 'bg-red-950/40 border-red-500/40 text-red-100'
                            : alert.status === 'WATCH'
                            ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-extrabold flex items-center gap-1.5">
                            {alert.placeName}
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                                alert.status === 'DANGER'
                                  ? 'bg-red-500 text-white'
                                  : alert.status === 'WATCH'
                                  ? 'bg-amber-500 text-slate-950'
                                  : 'bg-emerald-500 text-slate-950'
                              }`}
                            >
                              {alert.status}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{alert.timestamp}</span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-200">{descText}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 4 Intelligence Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Widget 1: Data Sources */}
            <div className="bg-[#0E1420] p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block uppercase">{t.dataSources}</span>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between p-2 bg-slate-900 rounded border border-white/5">
                  <span>Piezometers:</span>
                  <span className="text-emerald-400 font-bold">128 Ground</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded border border-white/5">
                  <span>ESA Sentinel-1:</span>
                  <span className="text-blue-400 font-bold">InSAR Pass 84</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded border border-white/5">
                  <span>Sentinels:</span>
                  <span className="text-amber-400 font-bold">16 Patrols</span>
                </div>
              </div>
            </div>

            {/* Widget 2: AI Risk Score */}
            <div className="bg-[#0E1420] p-4 rounded-xl border border-white/10 flex flex-col justify-between text-center">
              <span className="text-xs font-semibold text-slate-400 block uppercase">{t.aiRiskScore}</span>
              <div className="my-1">
                <div className="text-3xl font-black font-mono text-red-400">87 / 100</div>
                <div className="text-[11px] font-semibold text-amber-400 font-mono mt-0.5">High Pore Pressure</div>
              </div>
              <button
                onClick={() => setExplainNode(nodes[0])}
                className="w-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold py-1.5 rounded-lg cursor-pointer transition-colors"
              >
                {t.explainReasoning}
              </button>
            </div>

            {/* Widget 3: Realtime 7-Day Trend Chart */}
            <div className="bg-[#0E1420] p-4 rounded-xl border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-400 block uppercase">{t.trend7Days}</span>
                <span className="text-[9px] font-mono text-emerald-400 font-bold px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800">
                  REALTIME
                </span>
              </div>
              <div className="h-20 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <YAxis domain={[0, 100]} hide />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#090D12', borderColor: '#374151', fontSize: '11px', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#EF4444" fill="url(#riskGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Widget 4: Model Status */}
            <div className="bg-[#0E1420] p-4 rounded-xl border border-white/10 space-y-2">
              <span className="text-xs font-semibold text-slate-400 block uppercase">{t.modelStatus}</span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bayesian ML:</span>
                  <span className="font-mono text-emerald-400 font-bold">Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-mono text-white font-bold">98.6%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Retrain Log:</span>
                  <span className="font-mono text-purple-400 font-bold">0x9f8...22e4</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Explainable AI Reasoning Modal */}
      <ExplainableAIModal
        isOpen={Boolean(explainNode)}
        onClose={() => setExplainNode(null)}
        node={explainNode}
      />

      {/* Continuous Real Data Stream & Database Inspector Modal */}
      {isDataModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#0E1420] border border-purple-500/30 rounded-2xl w-full max-w-4xl shadow-2xl p-6 flex flex-col max-h-[85vh] text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold">
                  🛰️
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    Continuous Real Data Stream & Database Store
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-mono font-bold">
                      LIVE INGESTION ACTIVE
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Real satellite & Open-Meteo meteorological readings continuously captured and stored in PostgreSQL / Local storage.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportTelemetryCSV}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  EXPORT CSV
                </button>
                <button
                  onClick={() => setIsDataModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Live Metrics Quick Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-xs font-mono">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">TOTAL STORED RECORDS</span>
                <span className="text-lg font-bold text-purple-400">{telemetryLogs.length}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">LAST REAL SYNC</span>
                <span className="text-sm font-bold text-emerald-400">{realDataLastSync}</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">SOURCE MODEL</span>
                <span className="text-sm font-bold text-blue-400">Open-Meteo + InSAR</span>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-slate-400 block text-[10px]">DATABASE SYNC</span>
                <span className="text-sm font-bold text-amber-400">PostgreSQL (Dual)</span>
              </div>
            </div>

            {/* Multi-Stream Tab Switcher */}
            <div className="flex items-center gap-2 mb-3 bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setSelectedDataTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDataTab === 'all' ? 'bg-purple-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌐 Unified All-Stream
              </button>
              <button
                onClick={() => setSelectedDataTab('isro')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDataTab === 'isro' ? 'bg-orange-600 text-white font-bold shadow ring-2 ring-orange-400/50' : 'text-slate-400 hover:text-white'
                }`}
              >
                🇮🇳 ISRO EOS-04 & Bhuvan
              </button>
              <button
                onClick={() => setSelectedDataTab('satellite')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDataTab === 'satellite' ? 'bg-blue-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🛰️ Sentinel InSAR
              </button>
              <button
                onClick={() => setSelectedDataTab('ground')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDataTab === 'ground' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌱 Ground IoT
              </button>
              <button
                onClick={() => setSelectedDataTab('weather')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedDataTab === 'weather' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                🌧️ Live Weather
              </button>
            </div>

            {/* Live Continuous Telemetry Table */}
            <div className="flex-1 overflow-y-auto border border-white/10 rounded-xl bg-slate-950/60 font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-white/10">
                  {selectedDataTab === 'isro' ? (
                    <tr>
                      <th className="p-2.5">Node Sector</th>
                      <th className="p-2.5">State</th>
                      <th className="p-2.5 text-center">ISRO Satellite Mission</th>
                      <th className="p-2.5 text-center">Bhuvan LSZ Category</th>
                      <th className="p-2.5 text-center">CartoDEM Elevation</th>
                      <th className="p-2.5 text-center">INSAT-3DS LST</th>
                      <th className="p-2.5 text-center">MOSDAC Rainfall</th>
                      <th className="p-2.5 text-center">RISAT-1A Backscatter</th>
                      <th className="p-2.5 text-center">NISAR InSAR</th>
                    </tr>
                  ) : selectedDataTab === 'satellite' ? (
                    <tr>
                      <th className="p-2.5">Node Sector</th>
                      <th className="p-2.5">State</th>
                      <th className="p-2.5 text-center">Satellite Thermal Skin</th>
                      <th className="p-2.5 text-center">Cloud Cover</th>
                      <th className="p-2.5 text-center">Radar Soil (0-1cm)</th>
                      <th className="p-2.5 text-center">Radar Deep (3-9cm)</th>
                      <th className="p-2.5 text-center">InSAR Velocity</th>
                      <th className="p-2.5 text-center">Mission / Track</th>
                    </tr>
                  ) : selectedDataTab === 'ground' ? (
                    <tr>
                      <th className="p-2.5">Node Sector</th>
                      <th className="p-2.5">Piezometer kPa</th>
                      <th className="p-2.5 text-center">Pore %</th>
                      <th className="p-2.5 text-center">Tilt Deg</th>
                      <th className="p-2.5 text-center">Micro-Creep</th>
                      <th className="p-2.5 text-center">Vibration Hz</th>
                      <th className="p-2.5 text-center">LoRa RSSI</th>
                    </tr>
                  ) : selectedDataTab === 'weather' ? (
                    <tr>
                      <th className="p-2.5">Node Sector</th>
                      <th className="p-2.5">State</th>
                      <th className="p-2.5 text-center">Temp °C</th>
                      <th className="p-2.5 text-center">Humidity %</th>
                      <th className="p-2.5 text-center">Rain Rate</th>
                      <th className="p-2.5 text-center">24h Rain</th>
                      <th className="p-2.5 text-center">Soil Moisture</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Node Sector</th>
                      <th className="p-2.5">State</th>
                      <th className="p-2.5 text-center">Risk</th>
                      <th className="p-2.5 text-center">Pore Water</th>
                      <th className="p-2.5 text-center">Creep</th>
                      <th className="p-2.5 text-center">24h Rain</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedDataTab === 'isro' ? (
                    multiSignalData.map((d) => (
                      <tr key={d.nodeId} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 font-sans font-medium text-white">{d.nodeName}</td>
                        <td className="p-2.5 text-slate-300 font-sans">{d.state}</td>
                        <td className="p-2.5 text-orange-400 font-medium text-[11px]">{d.isro.satelliteName}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            d.isro.bhuvanLszCategory === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            d.isro.bhuvanLszCategory === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}>
                            {d.isro.bhuvanLszCategory}
                          </span>
                        </td>
                        <td className="p-2.5 text-center text-cyan-400 font-bold">{d.isro.cartoDemElevationM} m</td>
                        <td className="p-2.5 text-center text-amber-400 font-bold">{d.isro.insatLandSurfaceTempC}°C</td>
                        <td className="p-2.5 text-center text-blue-400 font-bold">{d.isro.insatRainfallEstimateHemMm} mm</td>
                        <td className="p-2.5 text-center text-purple-400 font-bold">{d.isro.risatBackscatterSigma0Db} dB</td>
                        <td className="p-2.5 text-center text-red-400 font-bold">{d.isro.nisarInSarDefVelocityMmYr} mm/yr</td>
                      </tr>
                    ))
                  ) : selectedDataTab === 'satellite' ? (
                    multiSignalData.map((d) => (
                      <tr key={d.nodeId} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 font-sans font-medium text-white">{d.nodeName}</td>
                        <td className="p-2.5 text-slate-300 font-sans">{d.state}</td>
                        <td className="p-2.5 text-center text-amber-400 font-bold">{d.satellite.surfaceSkinTempC}°C</td>
                        <td className="p-2.5 text-center text-blue-400 font-bold">{d.satellite.cloudCoverPct}% (Low: {d.satellite.cloudCoverLowPct}%)</td>
                        <td className="p-2.5 text-center text-cyan-400 font-bold">{d.satellite.radarSoilMoistureSurface} m³/m³</td>
                        <td className="p-2.5 text-center text-emerald-400 font-bold">{d.satellite.radarSoilMoistureDeep} m³/m³</td>
                        <td className="p-2.5 text-center text-red-400 font-bold">{d.satellite.lineOfSightVelocityMmYr} mm/yr</td>
                        <td className="p-2.5 text-center text-slate-400 text-[10px]">{d.satellite.mission} ({d.satellite.orbitTrack})</td>
                      </tr>
                    ))
                  ) : selectedDataTab === 'ground' ? (
                    multiSignalData.map((d) => (
                      <tr key={d.nodeId} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 font-sans font-medium text-white">{d.nodeName}</td>
                        <td className="p-2.5 text-cyan-400 font-bold">{d.ground.porePressureKpa} kPa</td>
                        <td className="p-2.5 text-center text-blue-400 font-bold">{d.ground.porePressurePct}%</td>
                        <td className="p-2.5 text-center text-amber-400 font-bold">{d.ground.inclinometerTiltDeg}°</td>
                        <td className="p-2.5 text-center text-red-400 font-bold">{d.ground.subsurfaceCreepMm} mm</td>
                        <td className="p-2.5 text-center text-purple-400">{d.ground.vibrationHz} Hz</td>
                        <td className="p-2.5 text-center text-emerald-400">{d.ground.loraSignalRssi} dBm</td>
                      </tr>
                    ))
                  ) : selectedDataTab === 'weather' ? (
                    multiSignalData.map((d) => (
                      <tr key={d.nodeId} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 font-sans font-medium text-white">{d.nodeName}</td>
                        <td className="p-2.5 text-slate-300 font-sans">{d.state}</td>
                        <td className="p-2.5 text-center text-amber-400">{d.weather.temperatureC}°C</td>
                        <td className="p-2.5 text-center text-blue-400">{d.weather.relativeHumidityPct}%</td>
                        <td className="p-2.5 text-center text-cyan-400 font-bold">{d.weather.rainfallCurrentMmH} mm/h</td>
                        <td className="p-2.5 text-center text-purple-400 font-bold">{d.weather.rainfall24hMm} mm</td>
                        <td className="p-2.5 text-center text-emerald-400 font-bold">{d.weather.soilMoisturePct}% Saturation</td>
                      </tr>
                    ))
                  ) : (
                    telemetryLogs.slice(0, 50).map((record) => (
                      <tr key={record.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-2.5 text-slate-400 text-[11px]">
                          {new Date(record.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="p-2.5 font-sans font-medium text-white">{record.nodeName}</td>
                        <td className="p-2.5 text-slate-300 font-sans">{record.state}</td>
                        <td className="p-2.5 text-center font-bold text-purple-400">{record.riskScore}/100</td>
                        <td className="p-2.5 text-center text-blue-400 font-bold">{record.porePressure}%</td>
                        <td className="p-2.5 text-center text-amber-400 font-bold">{record.creepRate}mm</td>
                        <td className="p-2.5 text-center text-cyan-400 font-bold">{record.rainfall24h}mm</td>
                        <td className="p-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                              record.status === 'DANGER'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : record.status === 'WATCH'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Streaming 35 live landslide monitoring stations across 8 North East states.</span>
              <button
                onClick={() => setIsDataModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
