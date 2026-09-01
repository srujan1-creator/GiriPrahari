import { createClient } from '@supabase/supabase-js';

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
        
      if (error) console.error('Supabase Error:', error);
      return data;
    } catch (err) {
      console.error('Supabase Exception:', err);
    }
  } else {
    // Fallback Local Storage
    const localHistory = JSON.parse(localStorage.getItem('giri_prahari_incidents') || '[]');
    const localPayload = { ...payload, id: 'local-' + Date.now() };
    localHistory.unshift(localPayload);
    localStorage.setItem('giri_prahari_incidents', JSON.stringify(localHistory));
    console.log('[Local DB Storage] Incident saved to browser localStorage.');
  }
};

/**
 * Retrieves the history of emergency incidents.
 */
export const getIncidents = async () => {
  if (supabase) {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('timestamp', { ascending: false });
      
    if (error) {
      console.error('Supabase Fetch Error:', error);
      return [];
    }
    return data;
  } else {
    return JSON.parse(localStorage.getItem('giri_prahari_incidents') || '[]');
  }
};
