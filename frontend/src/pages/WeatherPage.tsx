import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { WeatherSearchForm } from '../components/weather/WeatherSearchForm';
import { WeatherResultCard } from '../components/weather/WeatherResultCard';
import { Card } from '../components/ui/Card';
import { getWeatherByCity } from '../services/weather';

export function WeatherPage() {
  const [city, setCity] = useState('');

  const weatherMutation = useMutation({
    mutationFn: getWeatherByCity,
  });

  const errorMessage = useMemo(() => {
    if (!weatherMutation.error) return '';
    return weatherMutation.error instanceof Error
      ? weatherMutation.error.message
      : 'Não foi possível obter o clima agora. Tente novamente.';
  }, [weatherMutation.error]);

  const handleReset = () => {
    setCity('');
    weatherMutation.reset();
  };

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Consulta</span>
        <h1>Clima atual por cidade</h1>
        <p>Digite o nome de qualquer cidade e veja a temperatura e condições em tempo real.</p>
      </header>

      <Card title="Nova consulta">
        <WeatherSearchForm
          city={city}
          isLoading={weatherMutation.isPending}
          onCityChange={setCity}
          onSubmit={() => weatherMutation.mutate(city)}
          onReset={weatherMutation.data ? handleReset : undefined}
        />
      </Card>

      {weatherMutation.isPending && (
        <div className="alert alert--info">
          Buscando dados climáticos...
        </div>
      )}

      {errorMessage && (
        <div className="alert alert--error">
          {errorMessage}
        </div>
      )}

      {weatherMutation.data && (
        <WeatherResultCard weather={weatherMutation.data} />
      )}
    </div>
  );
}
