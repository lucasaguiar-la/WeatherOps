export type WeatherData = {
  city: string;
  description: string;
  temperatureLabel: string;
  temperatureValue: number | null;
};

export type HistoryRecord = {
  city: string;
  country: string;
  description: string;
  id: number;
  queriedAt: string;
  temperatureLabel: string;
  temperatureValue: number | null;
};

export type ApiStatus = {
  checkedAt: string;
  isOnline: boolean;
  message: string;
  source: 'legacy-root' | 'future-health';
};

export type ActionResult = {
  message: string;
};

export type AvailabilityBar = {
  hour: string;
  status: 'ok' | 'warn' | 'off';
  uptimePct: number | null;
  avgResponseMs: number | null;
};

export type MonitoringAvailability = {
  bars: AvailabilityBar[];
  uptimePct24h: number | null;
  avgResponseMs24h: number | null;
  totalChecks24h: number;
  lastIncidentAt: string | null;
};
