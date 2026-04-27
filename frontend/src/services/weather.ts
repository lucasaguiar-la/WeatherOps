import { adaptWeatherResponse } from '../adapters/weatherAdapter';
import type { ApiWeatherResponse } from '../types/api';
import type { WeatherData } from '../types/domain';
import { HttpError, http } from './http';

export async function getWeatherByCity(city: string): Promise<WeatherData> {
  const normalizedCity = city.trim();

  if (!normalizedCity) {
    throw new HttpError('Informe uma cidade para consultar.', 400);
  }

  const response = await http<ApiWeatherResponse>(
    `/weather?city=${encodeURIComponent(normalizedCity)}`,
  );

  return adaptWeatherResponse(response);
}
