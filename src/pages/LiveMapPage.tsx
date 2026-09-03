import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Globe, Search, PhoneCall, X } from 'lucide-react';
import type { SlopeNode, Language } from '../types';
import { INITIAL_SLOPE_NODES } from '../services/riskData';

import { TRANSLATIONS } from '../services/translations';

interface LiveMapPageProps {
  onOpenSOS: () => void;
  currentLang: Language;
}

// Create custom animated Leaflet marker icons with Level-4 Escalation for score >= 90
const createCustomMarkerIcon = (status: 'SAFE' | 'WATCH' | 'DANGER', score: number, isSelected: boolean) => {
  const isCritical90 = score >= 90;

  const colorClass =
    isCritical90
      ? 'bg-gradient-to-r from-red-600 via-rose-700 to-red-600 border-2 border-yellow-300 text-white shadow-[0_0_25px_rgba(239,68,68,1)] animate-bounce font-black'
      : status === 'DANGER'
      ? 'bg-red-600 border-red-400 text-white shadow-red-900/80'
      : status === 'WATCH'
      ? 'bg-amber-500 border-amber-300 text-slate-950 shadow-amber-900/80'
      : 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/80';

  const ringClass =
    isCritical90
      ? 'w-14 h-14 bg-red-600/60 animate-ping ring-4 ring-rose-400 -top-3.5 -left-3.5'
      : status === 'DANGER'
      ? 'w-10 h-10 bg-red-500/40 animate-ping -top-1 -left-1'
      : status === 'WATCH'
      ? 'w-10 h-10 bg-amber-500/30 -top-1 -left-1'
      : 'w-10 h-10 bg-emerald-500/20 -top-1 -left-1';

  const scaleClass = isSelected ? 'scale-125 z-50 ring-4 ring-white' : isCritical90 ? 'scale-115 z-40' : 'hover:scale-110';

  const html = `
    <div class="relative flex items-center justify-center cursor-pointer group transition-transform ${scaleClass}">
      <div class="rounded-full absolute ${ringClass}"></div>
      ${isCritical90 ? '<div class="w-10 h-10 -top-1.5 -left-1.5 rounded-full absolute bg-rose-500/40 animate-pulse"></div>' : ''}
      <div class="px-2.5 py-1 rounded-xl border-2 font-mono font-black text-xs shadow-2xl flex items-center gap-1.5 whitespace-nowrap ${colorClass}">
        <span class="w-2 h-2 rounded-full ${isCritical90 ? 'bg-yellow-300 animate-ping' : 'bg-white animate-pulse'}"></span>
        <span>${isCritical90 ? '🚨 ' + score + ' EVACUATE' : score}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: isCritical90 ? [84, 30] : [40, 30],
    iconAnchor: isCritical90 ? [42, 15] : [20, 15],
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

export const LiveMapPage: React.FC<LiveMapPageProps> = ({ onOpenSOS, currentLang = 'en' }) => {
  const [nodes] = useState<SlopeNode[]>(INITIAL_SLOPE_NODES);
  const [selectedNode, setSelectedNode] = useState<SlopeNode | null>(INITIAL_SLOPE_NODES[0]); // Default to Sohra
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'DANGER' | 'WATCH' | 'SAFE'>('ALL');
  const [mapTileMode, setMapTileMode] = useState<'topo' | 'satellite'>('satellite');

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.state.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || node.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dangerCount = nodes.filter(n => n.status === 'DANGER').length;
  const watchCount = nodes.filter(n => n.status === 'WATCH').length;
  const safeCount = nodes.filter(n => n.status === 'SAFE').length;

  const handleDispatchNodeAlert = async (node: SlopeNode) => {
    onOpenSOS();
    try {
      const alertMsg = `ATTENTION! CRITICAL LANDSLIDE CREEP DETECTED AT ${node.name.toUpperCase()} ${node.state.toUpperCase()}. RISK SCORE IS ${node.riskScore} OUT OF 100. EVACUATE IMMEDIATELY.`;
      
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
  };

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

  return (
    <div className="min-h-screen bg-[#0B0F14] text-slate-100 font-sans flex flex-col">
      {/* Top Map Control Bar */}
      <div className="bg-[#0E1420] border-b border-white/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              {t.liveMapTitle} ({nodes.length} SENSOR NODES)
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h1>
            <p className="text-[11px] text-slate-400">
              Interactive 24/7 Geographic OpenStreetMap & InSAR Satellite Overlay
            </p>
          </div>
        </div>

        {/* Filter & Map Layer Switcher Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Map Layer Switcher */}
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setMapTileMode('satellite')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                mapTileMode === 'satellite' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Esri Satellite
            </button>
            <button
              onClick={() => setMapTileMode('topo')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                mapTileMode === 'topo' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ OpenStreetMap
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search hamlet, district or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 w-44 sm:w-56"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="bg-slate-900 p-1 rounded-lg border border-slate-700 flex text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({nodes.length})
            </button>
            <button
              onClick={() => setStatusFilter('DANGER')}
              className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                statusFilter === 'DANGER' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Danger ({dangerCount})
            </button>
            <button
              onClick={() => setStatusFilter('WATCH')}
              className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                statusFilter === 'WATCH' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Watch ({watchCount})
            </button>
            <button
              onClick={() => setStatusFilter('SAFE')}
              className={`px-2 py-1 rounded font-semibold transition-colors cursor-pointer ${
                statusFilter === 'SAFE' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Safe ({safeCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View Grid */}
      <div className="flex-1 flex overflow-hidden relative min-h-[500px]">
        {/* Full Interactive Leaflet Geographic Map */}
        <div className="flex-1 relative bg-[#090D12]">
          <MapContainer
            center={[25.8, 93.2]}
            zoom={7}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', width: '100%', background: '#090D12' }}
          >
            <MapAutoResize />
            <TileLayer
              key={mapTileMode}
              attribution={mapTileMode === 'satellite' ? 'Tiles &copy; Esri' : '&copy; OpenStreetMap'}
              url={
                mapTileMode === 'satellite'
                  ? 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
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

            {/* Interactive Leaflet Markers */}
            {filteredNodes.map((node) => {
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
                  <Popup className="leaflet-custom-popup">
                    <div className="p-1 font-sans">
                      <div className="font-extrabold text-sm text-slate-900 flex items-center justify-between gap-2">
                        <span>{node.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded text-white font-bold ${node.status === 'DANGER' ? 'bg-red-600' : node.status === 'WATCH' ? 'bg-amber-600' : 'bg-emerald-600'}`}>
                          {node.status} ({node.riskScore})
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {node.district}, {node.state}
                      </p>
                      <div className="text-[11px] font-mono mt-1 space-y-0.5 border-t pt-1">
                        <div>Creep: <strong className="text-red-600">{node.displacementMm}mm</strong></div>
                        <div>Rainfall: <strong>{node.rainfallMm24h}mm</strong></div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Slide-Over Right Telemetry Sidebar */}
        {selectedNode && (
          <aside className="w-80 bg-[#0E1420] border-l border-white/10 p-5 flex flex-col justify-between z-40 shadow-2xl shrink-0 animate-slideLeft">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                    Selected Slope Telemetry
                  </span>
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mt-1">
                    {selectedNode.name}
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        selectedNode.status === 'DANGER'
                          ? 'bg-red-500 text-white'
                          : selectedNode.status === 'WATCH'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-500 text-slate-950'
                      }`}
                    >
                      {selectedNode.status}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedNode.district}, {selectedNode.state}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Risk Gauge */}
              <div className="bg-slate-900 p-4 rounded-xl border border-white/10 text-center">
                <div className="text-3xl font-black font-mono text-white mb-1">
                  {selectedNode.riskScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
                <div className="text-xs font-semibold text-slate-300">
                  Risk Classification Index
                </div>
              </div>

              {/* Live Sensor Metrics */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg border border-white/5">
                  <span className="text-slate-400">Slope Creep:</span>
                  <span className="font-mono text-red-400 font-bold">{selectedNode.displacementMm} mm</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg border border-white/5">
                  <span className="text-slate-400">Rainfall:</span>
                  <span className="font-mono text-amber-400 font-bold">{selectedNode.rainfallMm24h} mm</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg border border-white/5">
                  <span className="text-slate-400">Soil Moisture:</span>
                  <span className="font-mono text-blue-400 font-bold">{selectedNode.soilMoisturePct}%</span>
                </div>
                <div className="flex justify-between p-2.5 bg-slate-900 rounded-lg border border-white/5">
                  <span className="text-slate-400">Vibration:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedNode.vibrationHz} Hz</span>
                </div>
              </div>
            </div>

            {/* Emergency SOS Trigger */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleDispatchNodeAlert(selectedNode)}
                className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
              >
                <PhoneCall className="w-4 h-4" />
                <span>DISPATCH EMERGENCY AI PHONE CALL ({selectedNode.name.toUpperCase()})</span>
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
