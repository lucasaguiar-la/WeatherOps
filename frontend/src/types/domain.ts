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
