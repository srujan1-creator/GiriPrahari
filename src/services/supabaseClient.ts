import { createClient } from '@supabase/supabase-js';
import type { SlopeNode, RiskStatus } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ovlvbykpwlpfujfblukj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_LrHGg9xbl0zH9b-5yOQqJg_R5hQqw9d';

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface IncidentLog {
  id?: string;
  location: string;
  riskScore: number;
  alertType: string;
  timestamp: string;
}

export interface TelemetryRecord {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  state: string;
  riskScore: number;
  porePressure: number;
  creepRate: number;
  rainfall24h: number;
  status: RiskStatus;
}

const LOCAL_STORAGE_INCIDENTS_KEY = 'giri_prahari_incidents';
const LOCAL_STORAGE_TELEMETRY_KEY = 'giri_prahari_telemetry_stream';
const MAX_TELEMETRY_RECORDS = 500;

/**
 * Logs an emergency incident to Supabase PostgreSQL database.
 * If Supabase is not yet configured, gracefully falls back to browser localStorage.
 */
export const logIncident = async (incidentData: Partial<IncidentLog>) => {
  const payload = {
    location: incidentData.location || 'Unknown Sector',
    risk_score: incidentData.riskScore || 0,
    alert_type: incidentData.alertType || 'MANUAL_SOS',
    timestamp: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .insert([payload]);
        
      if (error) {
        saveIncidentLocally(payload);
      }
      return data;
    } catch {
      saveIncidentLocally(payload);
    }
  } else {
    saveIncidentLocally(payload);
  }
};

function saveIncidentLocally(payload: { location: string; risk_score: number; alert_type: string; timestamp: string }) {
  try {
    const localHistory = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INCIDENTS_KEY) || '[]');
    const localPayload = { ...payload, id: 'incident-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4) };
    localHistory.unshift(localPayload);
    localStorage.setItem(LOCAL_STORAGE_INCIDENTS_KEY, JSON.stringify(localHistory.slice(0, 100)));
    window.dispatchEvent(new CustomEvent('giri_incident_logged', { detail: localPayload }));
  } catch {
    // ignore
  }
}

/**
 * Retrieves the history of emergency incidents.
 */
export const getIncidents = async () => {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('timestamp', { ascending: false });
        
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {
      // fallback
    }
  }
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_INCIDENTS_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Continuously records real-time telemetry from all slope nodes
 */
export const logContinuousTelemetry = async (nodes: SlopeNode[]) => {
  const now = new Date().toISOString();
  
  const records: TelemetryRecord[] = nodes.map(node => ({
    id: `tel-${node.id}-${Date.now()}`,
    timestamp: now,
    nodeId: node.id,
    nodeName: node.name,
    state: node.state,
    riskScore: node.riskScore,
    porePressure: node.soilMoisturePct,
    creepRate: node.displacementMm,
    rainfall24h: node.rainfallMm24h,
    status: node.status,
  }));

  // 1. Save to continuous persistent storage (browser rolling time-series buffer)
  try {
    const existing: TelemetryRecord[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TELEMETRY_KEY) || '[]');
    const combined = [...records, ...existing].slice(0, MAX_TELEMETRY_RECORDS);
    localStorage.setItem(LOCAL_STORAGE_TELEMETRY_KEY, JSON.stringify(combined));
    window.dispatchEvent(new CustomEvent('giri_telemetry_recorded', { detail: { count: combined.length, latest: records[0] } }));
  } catch {
    // Ignore storage quota
  }

  // 2. Also stream to Supabase if connected
  if (supabase) {
    try {
      const dbPayload = records.slice(0, 5).map(r => ({
        node_id: r.nodeId,
        node_name: r.nodeName,
        state: r.state,
        risk_score: r.riskScore,
        pore_pressure: r.porePressure,
        creep_rate: r.creepRate,
        rainfall_24h: r.rainfall24h,
        status: r.status,
        timestamp: r.timestamp,
      }));
      await supabase.from('telemetry_logs').insert(dbPayload);
    } catch {
      // fallback silently
    }
  }
};

/**
 * Returns recorded continuous telemetry stream data
 */
export const getContinuousTelemetry = (): TelemetryRecord[] => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_TELEMETRY_KEY) || '[]');
  } catch {
    return [];
  }
};

/**
 * Exports stored telemetry data as a CSV file for download
 */
export const exportTelemetryCSV = () => {
  const records = getContinuousTelemetry();
  if (records.length === 0) return;

  const headers = ['Timestamp', 'Node ID', 'Node Name', 'State', 'Risk Score', 'Pore Pressure (%)', 'Creep Rate (mm)', '24h Rain (mm)', 'Status'];
  const rows = records.map(r => [
    `"${r.timestamp}"`,
    `"${r.nodeId}"`,
    `"${r.nodeName}"`,
    `"${r.state}"`,
    r.riskScore,
    r.porePressure,
    r.creepRate,
    r.rainfall24h,
    `"${r.status}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `GIRI_PRAHARI_Continuous_Telemetry_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
