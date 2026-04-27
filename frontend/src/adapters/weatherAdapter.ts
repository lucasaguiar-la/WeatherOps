import type { ApiWeatherResponse } from '../types/api';
import type { WeatherData } from '../types/domain';
import { HttpError } from '../services/http';

function fixLegacyText(value: string) {
  return [
    ['\u00c3\u00a1', '\u00e1'],
    ['\u00c3\u00a0', '\u00e0'],
    ['\u00c3\u00a2', '\u00e2'],
    ['\u00c3\u00a3', '\u00e3'],
    ['\u00c3\u00a9', '\u00e9'],
    ['\u00c3\u00aa', '\u00ea'],
    ['\u00c3\u00ad', '\u00ed'],
    ['\u00c3\u00b3', '\u00f3'],
    ['\u00c3\u00b4', '\u00f4'],
    ['\u00c3\u00b5', '\u00f5'],
    ['\u00c3\u00ba', '\u00fa'],
    ['\u00c3\u00a7', '\u00e7'],
    ['\u00c2\u00ba', '\u00ba'],
  ].reduce((text, [from, to]) => text.split(from).join(to), value).trim();
}

function readStringValue(response: ApiWeatherResponse, keys: string[]) {
  for (const key of keys) {
    const value = response[key];

    if (typeof value === 'string' && value.trim()) {
      return fixLegacyText(value);
    }
  }

  return '';
}

function extractTemperatureValue(label: string) {
  const match = label.match(/-?\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
}

export function adaptWeatherResponse(response: ApiWeatherResponse): WeatherData {
  const city = readStringValue(response, ['Cidade']);
  const temperatureLabel = readStringValue(response, ['Temperatura']);
  const description = readStringValue(response, ['Descricao', 'Descri\u00e7\u00e3o', 'Descri\u00c3\u00a7\u00c3\u00a3o']);

  if (!city || !temperatureLabel || !description) {
    throw new HttpError('A resposta de clima veio incompleta da API legado.', 500, response);
  }

  return {
    city,
    description,
    temperatureLabel,
    temperatureValue: extractTemperatureValue(temperatureLabel),
  };
}
