import { Card } from '../ui/Card';
import type { WeatherData } from '../../types/domain';

type WeatherResultCardProps = {
  weather: WeatherData;
};

export function WeatherResultCard({ weather }: WeatherResultCardProps) {
  return (
    <Card
      title={`Resultado para ${weather.city}`}
      description="Dados ja normalizados para consumo consistente da interface."
    >
      <div className="stats-grid">
        <div className="metric">
          <span className="metric__label">Temperatura</span>
          <strong className="metric__value">{weather.temperatureLabel}</strong>
        </div>
        <div className="metric">
          <span className="metric__label">Descricao</span>
          <strong className="metric__value metric__value--compact">{weather.description}</strong>
        </div>
        <div className="metric">
          <span className="metric__label">Cidade</span>
          <strong className="metric__value metric__value--compact">{weather.city}</strong>
        </div>
      </div>
    </Card>
  );
}
