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
    if (!weatherMutation.error) {
      return '';
    }

    return weatherMutation.error instanceof Error
      ? weatherMutation.error.message
      : 'Não foi possível consultar o clima agora.';
  }, [weatherMutation.error]);

  const handleReset = () => {
    setCity('');
    weatherMutation.reset();
  };

  return (
    <div className="page">
      <header className="page-header">
        <span className="page-header__eyebrow">Consulta</span>
        <h1>Consulte o clima atual por cidade</h1>
      </header>

      <div className="content-grid">
        <Card
          title="Nova consulta"
          description="Informe uma cidade para buscar a temperatura e a descrição atual."
        >
          <WeatherSearchForm
            city={city}
            isLoading={weatherMutation.isPending}
            onCityChange={setCity}
            onSubmit={() => weatherMutation.mutate(city)}
          />
        </Card>

        <Card
          title="Como funciona"
          description="Camada de integração preparada para lidar com chaves em português e variações de encoding."
        >
          <div className="inline-list">
            <div className="inline-list__item">
              <span>Servico</span>
              <strong className="mono">getWeatherByCity(city)</strong>
            </div>
            <div className="inline-list__item">
              <span>Adapter</span>
              <strong className="mono">weatherAdapter</strong>
            </div>
            <div className="inline-list__item">
              <span>Tratamento</span>
              <strong>Loading, erro e reset</strong>
            </div>
          </div>
        </Card>
      </div>

      {weatherMutation.isPending && <div className="alert alert--info">Buscando clima atual...</div>}

      {errorMessage && <div className="alert alert--error">{errorMessage}</div>}

      {weatherMutation.data && <WeatherResultCard weather={weatherMutation.data} />}
    </div>
  );
}
