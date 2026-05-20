import { Card } from '../ui/Card';
import type { WeatherData } from '../../types/domain';

type WeatherResultCardProps = {
  weather: WeatherData;
};

function getTempColor(value: number | null): string {
  if (value === null) return 'var(--color-navy)';
  if (value <= 10)  return 'var(--color-sky)';
  if (value <= 20)  return 'var(--color-navy-mid)';
  if (value <= 30)  return 'var(--color-primary-text)';
  return '#b45309';
}

export function WeatherResultCard({ weather }: WeatherResultCardProps) {
  const color = getTempColor(weather.temperatureValue);

  const match = weather.temperatureLabel.match(/^([\d.,-]+)\s*(.*)$/);
  const numericPart = match ? match[1] : weather.temperatureLabel;
  const unitPart    = match ? match[2] : '';

  return (
    <Card title={weather.city}>
      <div className="weather-result">
        <div className="weather-result__temp">
          <span
            className="weather-result__temp-value"
            style={{ color }}
          >
            {numericPart}
          </span>
          {unitPart && (
            <span className="weather-result__temp-unit">{unitPart}</span>
          )}
        </div>

        <span className="weather-result__desc">
          {weather.description}
        </span>
      </div>
    </Card>
  );
}
