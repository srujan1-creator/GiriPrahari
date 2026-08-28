export type Language =
  | 'en'
  | 'hi'
  | 'as'
  | 'kha'
  | 'pna'
  | 'lus'
  | 'hma'
  | 'njz'
  | 'apa'
  | 'gal'
  | 'adi'
  | 'grt'
  | 'mni'
  | 'tan'
  | 'nag'
  | 'ang'
  | 'ao'
  | 'sum'
  | 'lot'
  | 'kon'
  | 'trv'
  | 'rea'
  | 'brx'
  | 'kar'
  | 'dim'
  | 'lep'
  | 'bhu'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'gu'
  | 'kn'
  | 'or'
  | 'ml'
  | 'pa'
  | 'sat'
  | 'gon'
  | 'doi'
  | 'ks'
  | 'lad'
  | 'kok'
  | 'tly';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

export type RiskStatus = 'SAFE' | 'WATCH' | 'DANGER';

export interface SlopeNode {
  id: string;
  name: string;
  state: string;
  district: string;
  lat: number;
  lng: number;
  riskScore: number;
  status: RiskStatus;
  type: 'hamlet' | 'hub' | 'ivr';
  delta: string;
  lastUpdated: string;
  sensors: {
    groundSensors: number;
    satelliteFeeds: number;
    weatherStations: number;
    communityReports: number;
  };
  displacementMm: number;
  rainfallMm24h: number;
  soilMoisturePct: number;
  vibrationHz: number;
  connectedNodes: string[];
  recentAlerts: string[];
}

export interface Alert {
  id: string;
  nodeId: string;
  placeName: string;
  status: RiskStatus;
  description: Record<string, string>;
  timestamp: string;
  channel: 'IVR' | 'SMS' | 'SIREN' | 'LOCAL';
  read: boolean;
}

export interface MethodologyStep {
  id: number;
  stage: string;
  description: string;
  visual: string;
  details: string[];
  iconName: string;
}

export interface TechStackTile {
  category: string;
  icon: string;
  description: string;
}

export interface ResearchSource {
  badge: string;
  source: string;
  detail: string;
  link: string;
}

export interface ImpactEvent {
  time: string;
  title: string;
  subtitle: string;
  statusBadge: string;
  badgeType: 'DANGER' | 'QUEUED' | 'SENT' | 'SAFE';
}
