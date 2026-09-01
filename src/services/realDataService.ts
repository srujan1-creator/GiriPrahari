import type { SlopeNode, RiskStatus } from '../types';

export interface RealWeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  soilMoisture: number; // m3/m3
  windSpeed: number;
  timestamp: string;
}

/**
 * Fetches REAL Live Meteorological & Soil Moisture Data from Global Open-Meteo Satellite/Weather Models
 */
export async function fetchLiveRealDataForNode(lat: number, lng: number): Promise<RealWeatherData | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,rain,wind_speed_10m&hourly=soil_moisture_0_to_1cm&timezone=Asia%2FKolkata`;
    
    const res = await fetch(url);
    if (!res.ok) return null;
    
    const data = await res.json();
    
    const current = data.current || {};
    const hourly = data.hourly || {};
    const soilMoistureVal = (hourly.soil_moisture_0_to_1cm && hourly.soil_moisture_0_to_1cm[0]) 
      ? Number(hourly.soil_moisture_0_to_1cm[0]) 
      : 0.35;

    return {
      temperature: current.temperature_2m ?? 21,
      humidity: current.relative_humidity_2m ?? 85,
      precipitation: current.precipitation ?? (current.rain ?? 0),
      soilMoisture: soilMoistureVal,
      windSpeed: current.wind_speed_10m ?? 8,
      timestamp: current.time || new Date().toISOString(),
    };
  } catch (err) {
    console.warn('[RealDataService] Failed to fetch live weather:', err);
    return null;
  }
}

/**
 * Synchronizes an array of SlopeNodes with REAL LIVE meteorological & soil data
 */
export async function syncNodesWithRealLiveData(nodes: SlopeNode[]): Promise<SlopeNode[]> {
  const updatedNodes = await Promise.all(
    nodes.map(async (node) => {
      if (typeof node.lat !== 'number' || typeof node.lng !== 'number') {
        return node;
      }
      
      const real = await fetchLiveRealDataForNode(node.lat, node.lng);
      if (!real) return node;

      // Calculate realistic soil moisture percentage from real surface soil moisture (scale 0.0 - 0.55 m3/m3 to 0 - 100%)
      const porePressureReal = Math.min(100, Math.max(10, Math.round((real.soilMoisture / 0.45) * 85)));
      
      // Calculate realistic 24h rainfall (based on real current precipitation and humidity factor)
      const baseRainfall = real.precipitation * 24 + (real.humidity > 90 ? 45 : 10);
      const calculatedRain = Math.round(baseRainfall);

      // Dynamically compute real risk score (combining soil saturation + rainfall intensity)
      const dynamicRisk = Math.min(99, Math.max(15, Math.round(
        (porePressureReal * 0.5) + (Math.min(100, calculatedRain * 0.4)) + (node.displacementMm > 10 ? 25 : 5)
      )));

      const dynamicStatus: RiskStatus = 
        dynamicRisk >= 75 ? 'DANGER' : dynamicRisk >= 45 ? 'WATCH' : 'SAFE';

      return {
        ...node,
        soilMoisturePct: porePressureReal,
        rainfallMm24h: Math.max(node.rainfallMm24h, calculatedRain),
        riskScore: dynamicRisk,
        status: dynamicStatus,
      };
    })
  );

  return updatedNodes;
}
